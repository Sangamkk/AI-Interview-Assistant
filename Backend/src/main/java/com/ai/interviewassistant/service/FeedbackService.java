package com.ai.interviewassistant.service;

import com.ai.interviewassistant.dto.FeedbackResponse;
import com.ai.interviewassistant.entity.Feedback;
import com.ai.interviewassistant.entity.Interview;
import com.ai.interviewassistant.repository.FeedbackRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import com.ai.interviewassistant.repository.InterviewRepository;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.feedback.model:gemini-2.5-flash}")
    private String feedbackModel;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final FeedbackRepository feedbackRepository;
    private final InterviewRepository interviewRepository;

    public FeedbackService(ObjectMapper objectMapper, FeedbackRepository feedbackRepository,
            InterviewRepository interviewRepository) {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = objectMapper;
        this.feedbackRepository = feedbackRepository;
        this.interviewRepository = interviewRepository;
    }

    // =========================================================
    // 1. GENERATE FEEDBACK
    // =========================================================

    public void generateFeedback(WebSocketSession frontendSession, List<String> conversation,Long interviewId) {

        if (conversation == null || conversation.isEmpty()) {
            sendToFrontend(frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"No interview conversation available for feedback\"}");
            return;
        }
        String prompt = buildFeedbackPrompt(conversation);
        requestFeedback(frontendSession, prompt,interviewId);
    }

    // =========================================================
    // 2. BUILD FEEDBACK PROMPT
    // =========================================================
    private String buildFeedbackPrompt(List<String> conversation) {
        String interviewText = String.join("\n", conversation);
        return """
                You are an expert technical interview evaluator.
                Evaluate the following interview conversation
                INTERVIEW CONVERSATION:
                %s
                Analyze the candidate based only on their answers.
                Give scores from 0 to 100 for:
                - overallScore
                - technicalScore
                - communicationScore
                - problemSolvingScore
                - confidenceScore
                Also provide:
                - strengths
                - weaknesses
                - suggestions
                - overallFeedback
                Return ONLY valid JSON.
                Do not use markdown.
                Do not use ```json.
                Do not add explanations outside the JSON.
                Required JSON format:
                {
                  "overallScore": 84,
                  "technicalScore": 88,
                  "communicationScore": 80,
                  "problemSolvingScore": 85,
                  "confidenceScore": 82,
                  "strengths": "Candidate demonstrated...",
                  "weaknesses": "Candidate could improve...",
                  "suggestions": "Candidate should...",
                  "overallFeedback": "Overall, the candidate..."
                }
                """.formatted(interviewText);
    }

    // =========================================================
    // 3. SEND REQUEST TO GEMINI
    // =========================================================
    private void requestFeedback(WebSocketSession frontendSession, String prompt,Long interviewId) {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + feedbackModel
                + ":generateContent?key="
                + apiKey;
        try {
            String requestBody = objectMapper.writeValueAsString(
                    Map.of(
                            "contents",
                            List.of(
                                    Map.of(
                                            "role",
                                            "user",
                                            "parts",
                                            List.of(
                                                    Map.of(
                                                            "text",
                                                            prompt)))),
                            "generationConfig",
                            Map.of(
                                    "responseMimeType",
                                    "application/json")));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header(
                            "Content-Type",
                            "application/json")
                    .POST(
                            HttpRequest.BodyPublishers
                                    .ofString(requestBody))
                    .build();
            System.out.println("================================");
            System.out.println("REQUESTING INTERVIEW FEEDBACK");
            System.out.println("================================");
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        System.out.println("Gemini feedback response:");
                        System.out.println(response.body());
                        // -----------------------------------------
                        // Gemini API error
                        // -----------------------------------------
                        if (response.statusCode() != 200) {
                            System.err.println("Gemini feedback request failed: " + response.statusCode());
                            sendToFrontend(frontendSession,
                                    """
                                            {
                                              "type": "ERROR",
                                              "message": "Failed to generate feedback"
                                            }
                                            """);
                            return;
                        }

                        // -----------------------------------------
                        // Extract Gemini text
                        // -----------------------------------------

                        String feedbackText = extractFeedbackText(response.body());

                        if (feedbackText == null) {
                            sendToFrontend(frontendSession,
                                    """
                                            {
                                              "type": "ERROR",
                                              "message": "Could not extract feedback"
                                            }
                                            """);
                            return;
                        }

                        FeedbackResponse feedback = parseFeedback(feedbackText);
                        if (feedback == null) {
                            sendToFrontend(frontendSession,
                                    """
                                            {
                                              "type": "ERROR",
                                              "message": "Failed to parse feedback"
                                            }
                                            """);
                            return;
                        }

                        Interview interview = interviewRepository.findById(interviewId)
                                .orElseThrow(() -> new RuntimeException("Interview not found"));

                        saveFeedback(feedback, interview);

                        interview.setScore(feedback.getOverallScore().intValue());
                        interview.setCompleted(true);

                        interviewRepository.save(interview);

                        System.out.println("Extracted feedback:");
                        System.out.println(feedbackText);
                        // -----------------------------------------
                        // Send feedback to frontend
                        // -----------------------------------------
                        try {
                            String frontendMessage = objectMapper.writeValueAsString(
                                    Map.of(
                                            "type",
                                            "FEEDBACK",
                                            "feedback",
                                            feedbackText));

                            sendToFrontend(frontendSession, frontendMessage);
                        } catch (Exception error) {
                            System.err.println("Failed to send feedback to frontend");
                            error.printStackTrace();
                        }
                    })
                    .exceptionally(error -> {
                        System.err.println("Gemini feedback request failed");
                        error.printStackTrace();
                        sendToFrontend(frontendSession,
                                """
                                        {
                                          "type": "ERROR",
                                          "message": "Feedback request failed"
                                        }
                                        """);
                        return null;
                    });
        } catch (Exception error) {
            System.err.println("Failed to create feedback request");
            error.printStackTrace();
            sendToFrontend(frontendSession,
                    """
                            {
                              "type": "ERROR",
                              "message": "Could not request feedback"
                            }
                            """);
        }
    }

    // =========================================================
    // 4. EXTRACT TEXT FROM GEMINI RESPONSE
    // =========================================================

    private String extractFeedbackText(String responseBody) {
        try {
            JsonNode responseJson = objectMapper.readTree(responseBody);
            JsonNode candidates = responseJson.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                throw new RuntimeException("No candidates found in Gemini response");
            }

            JsonNode parts = candidates.get(0).path("content").path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                throw new RuntimeException("No response parts found");
            }
            String feedbackText = parts
                    .get(0)
                    .path("text")
                    .asText();
            if (feedbackText.isBlank()) {
                throw new RuntimeException("Gemini returned empty feedback");
            }
            return feedbackText;
        } catch (Exception error) {
            System.err.println("Failed to extract feedback text");
            error.printStackTrace();
            return null;
        }
    }

    // =========================================================
    // 5. SEND MESSAGE TO FRONTEND
    // =========================================================

    private void sendToFrontend(WebSocketSession session, String message) {
        try {
            if (session.isOpen()) {
                session.sendMessage(new TextMessage(message));
            }
        } catch (Exception error) {
            System.err.println("Failed to send message to frontend");
            error.printStackTrace();
        }
    }

    private FeedbackResponse parseFeedback(String feedbackText) {

        try {

            FeedbackResponse feedback = objectMapper.readValue(feedbackText, FeedbackResponse.class);

            System.out.println("================================");
            System.out.println("FEEDBACK PARSED SUCCESSFULLY");
            System.out.println("Overall Score: " + feedback.getOverallScore());
            System.out.println("Technical Score: " + feedback.getTechnicalScore());
            System.out.println("Communication Score: " + feedback.getCommunicationScore());
            System.out.println("Problem Solving Score: " + feedback.getProblemSolvingScore());
            System.out.println("Confidence Score: " + feedback.getConfidenceScore());
            System.out.println("================================");

            return feedback;

        } catch (Exception error) {
            System.err.println("Failed to parse feedback JSON");
            error.printStackTrace();
            return null;
        }
    }

    private Feedback saveFeedback(FeedbackResponse feedbackResponse, Interview interview) {

        Feedback feedback = new Feedback();
        feedback.setInterview(interview);
        feedback.setOverallScore(feedbackResponse.getOverallScore());
        feedback.setTechnicalScore(feedbackResponse.getTechnicalScore());
        feedback.setCommunicationScore(feedbackResponse.getCommunicationScore());
        feedback.setProblemSolvingScore(feedbackResponse.getProblemSolvingScore());
        feedback.setConfidenceScore(feedbackResponse.getConfidenceScore());
        feedback.setStrengths(feedbackResponse.getStrengths());
        feedback.setWeaknesses(feedbackResponse.getWeaknesses());
        feedback.setSuggestions(feedbackResponse.getSuggestions());
        feedback.setOverallFeedback(feedbackResponse.getOverallFeedback());
        Feedback savedFeedback = feedbackRepository.save(feedback);
        System.out.println("Feedback saved with ID: " + savedFeedback.getId());
        return savedFeedback;
    }
}
