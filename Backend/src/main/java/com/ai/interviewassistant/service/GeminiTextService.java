package com.ai.interviewassistant.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiTextService {

        private final WebClient webClient;

        @Value("${gemini.api.key}")
        private String apiKey;

        public GeminiTextService(WebClient webClient) {
                this.webClient = webClient;
        }

        public String askGemini(String prompt) {

                Map<String, Object> requestBody = Map.of(
                                "contents", List.of(
                                                Map.of(
                                                                "parts", List.of(
                                                                                Map.of("text", prompt)))));

                Map<String, Object> response = webClient.post()
                                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                                .header("x-goog-api-key", apiKey)
                                .bodyValue(requestBody)
                                .retrieve()
                                .bodyToMono(Map.class)
                                .block();

                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");

                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

                return (String) parts.get(0).get("text");
        }
}