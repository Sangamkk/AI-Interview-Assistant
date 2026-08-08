package com.ai.interviewassistant.service;

import com.ai.interviewassistant.dto.GeminiContent;
import com.ai.interviewassistant.dto.GeminiPart;
import com.ai.interviewassistant.dto.GeminiResponse;
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

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateQuestion(String topic, String difficulty) {

        String prompt = """
                You are a professional technical interviewer.

                Generate exactly ONE interview question.

                Topic: %s
                Difficulty: %s

                Return only the question.
                """.formatted(topic, difficulty);

        GeminiPart part = new GeminiPart();
        part.setText(prompt);

        GeminiContent content = new GeminiContent();
        content.setParts(List.of(part));

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content));

        GeminiResponse response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/mini-3.6-flash:generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();

        return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
    }

    public String evaluateAnswer(
            String question,
            String answer) {

        String prompt = """
                You are a professional technical interviewer.

                Evaluate the candidate's answer.

                Question:
                %s

                Candidate's Answer:
                %s

                Give a short evaluation containing:
                1. Whether the answer is correct.
                2. What was done well.
                3. What could be improved.
                4. A score out of 10.

                Keep the feedback concise.
                """.formatted(question, answer);

        GeminiPart part = new GeminiPart();
        part.setText(prompt);

        GeminiContent content = new GeminiContent();
        content.setParts(List.of(part));

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(content));

        GeminiResponse response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/mini-3.6-flash:generateContent")
                        .queryParam("key", apiKey)
                        .build())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();

        return response.getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText();
    }
}