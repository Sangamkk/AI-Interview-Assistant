package com.ai.interviewassistant.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController
@RequestMapping("/api/voice")
@CrossOrigin(origins = "http://localhost:3000")
public class GeminiLiveController {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiLiveController(WebClient webClient) {
        this.webClient = webClient;
    }

    @PostMapping("/session")
    public Map<String, Object> createSession() {

        String expireTime = Instant.now()
                .plus(30, ChronoUnit.MINUTES)
                .toString();

        String newSessionExpireTime = Instant.now()
                .plus(1, ChronoUnit.MINUTES)
                .toString();

        Map<String, Object> requestBody = Map.of(
                "uses", 1,
                "expireTime", expireTime,
                "newSessionExpireTime", newSessionExpireTime
        );

        try {

            return webClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/auth_tokens")
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

        } catch (WebClientResponseException e) {

            System.out.println(
                    "GEMINI STATUS: " + e.getStatusCode()
            );

            System.out.println(
                    "GEMINI RESPONSE: "
                            + e.getResponseBodyAsString()
            );

            throw e;
        }
    }
}