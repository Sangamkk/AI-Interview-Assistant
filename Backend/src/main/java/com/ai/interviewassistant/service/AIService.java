package com.ai.interviewassistant.service;

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

    @Value("${openrouter.api.key}")
    private String apiKey;

    public String generateQuestion(String topic, String difficulty) {

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
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractText(response);
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
                5. The ideal/correct answer.

                Keep the feedback concise.
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
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        return extractText(response);
    }

    private String extractText(Map response) {

        List choices = (List) response.get("choices");

        Map choice = (Map) choices.get(0);

        Map message = (Map) choice.get("message");

        return (String) message.get("content");
    }
}