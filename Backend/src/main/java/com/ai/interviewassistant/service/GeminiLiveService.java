package com.ai.interviewassistant.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

@Service
public class GeminiLiveService {
    public void handleFrontendMessage( WebSocketSession session, String payload ) {
        System.out.println( "GeminiLiveService received: " + payload );
        // Gemini connection and audio forwarding
        // will be added next.
    }
    public void closeSession(String sessionId) {
        System.out.println( "Closing voice session: " + sessionId );
    }
}