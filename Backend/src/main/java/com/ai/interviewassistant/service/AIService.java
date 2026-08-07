package com.ai.interviewassistant.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class AIService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

}