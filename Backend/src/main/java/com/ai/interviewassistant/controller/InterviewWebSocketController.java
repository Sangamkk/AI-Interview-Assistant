package com.ai.interviewassistant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class InterviewWebSocketController {

    @MessageMapping("/interview")
    @SendTo("/topic/interview")
    public Map<String, String> handleInterview(
            Map<String, String> message) {

        String text = message.get("text");

        System.out.println("Received from frontend: " + text);

        return Map.of(
                "text",
                "Spring Boot received: " + text
        );
    }
}