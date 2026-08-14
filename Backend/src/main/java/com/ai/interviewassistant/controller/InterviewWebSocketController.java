package com.ai.interviewassistant.controller;

import com.ai.interviewassistant.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class InterviewWebSocketController {

    private final AIService aiService;

    @MessageMapping("/interview")
    @SendTo("/topic/interview")
    public Map<String, Object> handleInterview(
            Map<String, String> message) {

        String type = message.get("type");

        // Generate question
        if ("QUESTION".equals(type)) {

            String topic = message.get("topic");
            String difficulty = message.get("difficulty");

            String question = aiService.generateQuestion( topic, difficulty );
            return Map.of(
                    "type", "QUESTION",
                    "question", question
            );
        }

        // Evaluate candidate answer
        if ("ANSWER".equals(type)) {

            String question = message.get("question");
            String answer = message.get("answer");

            Map<String, Object> result =
                    aiService.evaluateAnswer(
                            question,
                            answer
                    );

            return Map.of(
                    "type", "EVALUATION",
                    "feedback", result.get("feedback"),
                    "score", result.get("score"),
                    "correctAnswer", result.get("correctAnswer")
            );
        }

        return Map.of(
                "type", "ERROR",
                "message", "Unknown message type"
        );
    }
}