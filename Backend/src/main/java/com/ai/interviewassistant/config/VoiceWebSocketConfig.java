package com.ai.interviewassistant.config;

import com.ai.interviewassistant.websocket.VoiceInterviewWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean;

@Configuration
@EnableWebSocket
public class VoiceWebSocketConfig implements WebSocketConfigurer {

    private final VoiceInterviewWebSocketHandler voiceHandler;

    public VoiceWebSocketConfig(
            VoiceInterviewWebSocketHandler voiceHandler) {
        this.voiceHandler = voiceHandler;
    }

    @Override
    public void registerWebSocketHandlers(
            WebSocketHandlerRegistry registry) {

        registry.addHandler(
                voiceHandler,
                "/ws/voice-interview"
        ).setAllowedOrigins("http://localhost:3000");
    }

    @Bean
    public ServletServerContainerFactoryBean createWebSocketContainer() {

        ServletServerContainerFactoryBean container =
                new ServletServerContainerFactoryBean();

        // Maximum incoming text message size: 1 MB
        container.setMaxTextMessageBufferSize(1024 * 1024);

        // Maximum incoming binary message size: 1 MB
        container.setMaxBinaryMessageBufferSize(1024 * 1024);

        return container;
    }
}