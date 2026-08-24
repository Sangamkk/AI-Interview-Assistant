package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.service.GeminiTextService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class GeminiTestController {

    private final GeminiTextService geminiTextService;

    public GeminiTestController(GeminiTextService geminiTextService) {
        this.geminiTextService = geminiTextService;
    }

    @GetMapping("/api/test-gemini")
    public Map<String, String> testGemini(@RequestParam String prompt) {
        return Map.of("response", geminiTextService.askGemini(prompt));
    }
}