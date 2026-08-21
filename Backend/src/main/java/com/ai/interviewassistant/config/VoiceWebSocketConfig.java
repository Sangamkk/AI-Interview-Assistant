package com.ai.interviewassistant.config;

import com.ai.interviewassistant.websocket.VoiceInterviewWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class VoiceWebSocketConfig implements WebSocketConfigurer {

    private final VoiceInterviewWebSocketHandler voiceHandler;

    public VoiceWebSocketConfig( VoiceInterviewWebSocketHandler voiceHandler ) {
        this.voiceHandler = voiceHandler;
    }

    @Override
    public void registerWebSocketHandlers( WebSocketHandlerRegistry registry ) {
        registry.addHandler( voiceHandler, "/ws/voice-interview" ).setAllowedOrigins("http://localhost:3000");
    }
}