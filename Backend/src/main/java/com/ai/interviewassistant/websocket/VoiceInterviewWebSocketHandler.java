package com.ai.interviewassistant.websocket;

import com.ai.interviewassistant.service.GeminiLiveService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class VoiceInterviewWebSocketHandler extends TextWebSocketHandler {

    private final GeminiLiveService geminiLiveService;

    public VoiceInterviewWebSocketHandler(GeminiLiveService geminiLiveService) {
        this.geminiLiveService = geminiLiveService;
    }

    @Override
    public void afterConnectionEstablished(
            WebSocketSession session
    ) {
        System.out.println(
                "Voice client connected: " + session.getId()
        );
    }

    @Override
    protected void handleTextMessage(
            WebSocketSession session,
            TextMessage message
    ) {

        System.out.println(
                "Message received from frontend: "
                        + message.getPayload()
        );

        geminiLiveService.handleFrontendMessage(
                session,
                message.getPayload()
        );
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status
    ) {

        System.out.println(
                "Voice client disconnected: "
                        + session.getId()
        );

        geminiLiveService.closeSession(
                session.getId()
        );
    }
}