package com.ai.interviewassistant.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${openrouter.api.key}")
    private String apiKey;


    // Generate interview question
    public String generateQuestion(
            String topic,
            String difficulty) {

        String prompt = """
                You are a professional technical interviewer.

                Generate exactly ONE interview question.

                Topic: %s
                Difficulty: %s

                Return only the question.
                """.formatted(topic, difficulty);

        Map<String, Object> requestBody = Map.of(
                "model", "openrouter/free",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        Map response = webClient.post()
                .uri("/api/v1/chat/completions")
                .header(
                        "Authorization",
                        "Bearer " + apiKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractText(response);
    }


    // Evaluate candidate answer
    public Map<String, Object> evaluateAnswer(
            String question,
            String answer) {

        String prompt = """
                You are a professional technical interviewer.

                Evaluate the candidate's answer.

                Question:
                %s

                Candidate's Answer:
                %s

                Return ONLY valid JSON in exactly this format:

                {
                  "feedback": "short evaluation",
                  "score": 8,
                  "correctAnswer": "ideal answer"
                }

                Rules:
                - score must be a number from 0 to 10
                - feedback should be concise
                - correctAnswer should contain the ideal answer
                - do not use markdown
                - do not add any text outside the JSON
                """.formatted(question, answer);

        Map<String, Object> requestBody = Map.of(
                "model", "openrouter/free",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                )
        );

        Map response = webClient.post()
                .uri("/api/v1/chat/completions")
                .header(
                        "Authorization",
                        "Bearer " + apiKey
                )
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        String aiResponse = extractText(response);

        try {

            return objectMapper.readValue(
                    aiResponse,
                    new TypeReference<Map<String, Object>>() {}
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "AI returned invalid JSON: " + aiResponse,
                    e
            );
        }
    }


    // Extract AI text from OpenRouter response
    private String extractText(Map response) {

        List choices = (List) response.get("choices");

        Map choice = (Map) choices.get(0);

        Map message = (Map) choice.get("message");

        return (String) message.get("content");
    }
}