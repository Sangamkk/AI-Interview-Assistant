package com.ai.interviewassistant.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.WebSocket;
import java.util.Map;
import java.util.concurrent.CompletionStage;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeminiLiveService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, WebSocket> geminiSessions =
            new ConcurrentHashMap<>();

    public void handleFrontendMessage(
            WebSocketSession frontendSession,
            String payload
    ) {
        try {
            JsonNode message = objectMapper.readTree(payload);
            String type = message.has("type")
                    ? message.get("type").asText()
                    : "";

            if ("SETUP".equals(type)) {
                String subject = message.has("subject")
                        ? message.get("subject").asText()
                        : "HR Interview";

                String difficulty = message.has("difficulty")
                        ? message.get("difficulty").asText()
                        : "hard";

                startGeminiSession(
                        frontendSession,
                        subject,
                        difficulty
                );

                return;
            }

            WebSocket geminiSocket =
                    geminiSessions.get(frontendSession.getId());

            if (geminiSocket == null) {
                sendToFrontend(
                        frontendSession,
                        "{\"type\":\"ERROR\",\"message\":\"Gemini session not ready\"}"
                );
                return;
            }

            geminiSocket.sendText(payload, true);

        } catch (Exception error) {
            error.printStackTrace();

            sendToFrontend(
                    frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"Invalid message\"}"
            );
        }
    }

    private void startGeminiSession(
            WebSocketSession frontendSession,
            String subject,
            String difficulty
    ) {
        String sessionId = frontendSession.getId();

        if (geminiSessions.containsKey(sessionId)) {
            return;
        }

        String geminiUrl =
                "wss://generativelanguage.googleapis.com/ws/"
                        + "google.ai.generativelanguage.v1beta."
                        + "GenerativeService.BidiGenerateContent"
                        + "?key=" + apiKey;

        httpClient.newWebSocketBuilder()
                .buildAsync(
                        URI.create(geminiUrl),
                        new GeminiWebSocketListener(frontendSession)
                )
                .thenAccept(geminiSocket -> {
                    geminiSessions.put(sessionId, geminiSocket);

                    sendGeminiSetup(
                            geminiSocket,
                            subject,
                            difficulty
                    );
                })
                .exceptionally(error -> {
                    error.printStackTrace();

                    sendToFrontend(
                            frontendSession,
                            "{\"type\":\"ERROR\",\"message\":\"Failed to connect to Gemini\"}"
                    );

                    return null;
                });
    }

    private void sendGeminiSetup(
            WebSocket geminiSocket,
            String subject,
            String difficulty
    ) {
        String setupMessage = """
                {
                  "setup": {
                    "model": "models/gemini-3.1-flash-live-preview",
                    "generationConfig": {
                      "responseModalities": ["AUDIO"]
                    },
                    "systemInstruction": {
                      "parts": [
                        {
                          "text": "You are a professional interviewer. Conduct a realistic interview about %s. The difficulty is %s. Start by greeting the candidate and asking the first question. Ask only one question at a time. Wait for the candidate's answer. Evaluate the answer internally and ask relevant follow-up questions. Keep responses concise and conversational."
                        }
                      ]
                    }
                  }
                }
                """.formatted(subject, difficulty);

        geminiSocket.sendText(setupMessage, true);
    }

    public void closeSession(String frontendSessionId) {
        WebSocket geminiSocket =
                geminiSessions.remove(frontendSessionId);

        if (geminiSocket != null) {
            geminiSocket.sendClose(
                    WebSocket.NORMAL_CLOSURE,
                    "Interview ended"
            );
        }
    }

    private void sendToFrontend(
            WebSocketSession session,
            String message
    ) {
        try {
            if (session.isOpen()) {
                session.sendMessage(
                        new TextMessage(message)
                );
            }
        } catch (Exception error) {
            error.printStackTrace();
        }
    }

    private class GeminiWebSocketListener
            implements WebSocket.Listener {

        private final WebSocketSession frontendSession;

        public GeminiWebSocketListener(
                WebSocketSession frontendSession
        ) {
            this.frontendSession = frontendSession;
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(
                WebSocket webSocket,
                CharSequence data,
                boolean last
        ) {
            try {
                String message = data.toString();

                JsonNode geminiMessage =
                        objectMapper.readTree(message);

                if (geminiMessage.has("setupComplete")) {
                    sendToFrontend(
                            frontendSession,
                            "{\"type\":\"READY\"}"
                    );
                } else {
                    forwardGeminiResponse(
                            frontendSession,
                            geminiMessage
                    );
                }

            } catch (Exception error) {
                error.printStackTrace();

                sendToFrontend(
                        frontendSession,
                        "{\"type\":\"ERROR\",\"message\":\"Error processing Gemini response\"}"
                );
            }

            webSocket.request(1);

            return WebSocket.Listener.super.onText(
                    webSocket,
                    data,
                    last
            );
        }

        private void forwardGeminiResponse(
                WebSocketSession frontendSession,
                JsonNode geminiMessage
        ) {
            try {
                JsonNode serverContent =
                        geminiMessage.get("serverContent");

                if (serverContent == null) {
                    return;
                }

                JsonNode modelTurn =
                        serverContent.get("modelTurn");

                if (modelTurn != null
                        && modelTurn.has("parts")) {

                    for (JsonNode part
                            : modelTurn.get("parts")) {

                        JsonNode inlineData =
                                part.get("inlineData");

                        if (inlineData != null
                                && inlineData.has("data")) {

                            String audio =
                                    inlineData.get("data").asText();

                            sendToFrontend(
                                    frontendSession,
                                    objectMapper.writeValueAsString(
                                            Map.of(
                                                    "type", "AUDIO",
                                                    "audio", audio
                                            )
                                    )
                            );
                        }
                    }
                }

                JsonNode inputTranscription =
                        serverContent.get("inputTranscription");

                if (inputTranscription != null
                        && inputTranscription.has("text")) {

                    sendToFrontend(
                            frontendSession,
                            objectMapper.writeValueAsString(
                                    Map.of(
                                            "type",
                                            "USER_TRANSCRIPTION",
                                            "text",
                                            inputTranscription
                                                    .get("text")
                                                    .asText()
                                    )
                            )
                    );
                }

                JsonNode outputTranscription =
                        serverContent.get("outputTranscription");

                if (outputTranscription != null
                        && outputTranscription.has("text")) {

                    sendToFrontend(
                            frontendSession,
                            objectMapper.writeValueAsString(
                                    Map.of(
                                            "type",
                                            "AI_TRANSCRIPTION",
                                            "text",
                                            outputTranscription
                                                    .get("text")
                                                    .asText()
                                    )
                            )
                    );
                }

            } catch (Exception error) {
                error.printStackTrace();
            }
        }

        @Override
        public void onError(
                WebSocket webSocket,
                Throwable error
        ) {
            error.printStackTrace();

            sendToFrontend(
                    frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"Gemini connection error\"}"
            );
        }

        @Override
        public CompletionStage<?> onClose(
                WebSocket webSocket,
                int statusCode,
                String reason
        ) {
            System.out.println(
                    "Gemini closed: " + reason
            );

            return WebSocket.Listener.super.onClose(
                    webSocket,
                    statusCode,
                    reason
            );
        }
    }

    @PreDestroy
    public void closeAllSessions() {
        geminiSessions.forEach(
                (sessionId, socket) ->
                        socket.sendClose(
                                WebSocket.NORMAL_CLOSURE,
                                "Server shutting down"
                        )
        );

        geminiSessions.clear();
    }
}