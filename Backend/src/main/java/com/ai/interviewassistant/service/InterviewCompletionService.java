package com.ai.interviewassistant.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;

@Service
public class InterviewCompletionService {

    private final FeedbackService feedbackService;

    public InterviewCompletionService(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * Completes the interview.
     *
     * Steps:
     * 1. Generate feedback
     * 2. FeedbackService saves feedback
     * 3. FeedbackService updates interview
     * 4. FeedbackService sends feedback to frontend
     * 5. FeedbackService closes the WebSocket
     */
    public void completeInterview(
            WebSocketSession frontendSession,
            List<String> conversation,
            Long interviewId) {

        System.out.println("================================");
        System.out.println("INTERVIEW COMPLETION STARTED");
        System.out.println("Interview ID: " + interviewId);
        System.out.println("================================");

        if (interviewId == null) {
            System.err.println("Cannot complete interview: interviewId is null");

            sendError(
                    frontendSession,
                    "Interview ID not found"
            );

            return;
        }

        if (conversation == null || conversation.isEmpty()) {
            System.err.println("Cannot complete interview: conversation is empty");

            sendError(
                    frontendSession,
                    "No interview conversation available"
            );

            return;
        }

        feedbackService.generateFeedback(
                frontendSession,
                conversation,
                interviewId
        );
    }

    private void sendError(
            WebSocketSession session,
            String message) {

        try {

            if (session.isOpen()) {

                session.sendMessage(
                        new org.springframework.web.socket.TextMessage(
                                """
                                {
                                  "type": "ERROR",
                                  "message": "%s"
                                }
                                """.formatted(message)
                        )
                );
            }

        } catch (Exception error) {
            System.err.println("Failed to send completion error");
            error.printStackTrace();
        }
    }
}