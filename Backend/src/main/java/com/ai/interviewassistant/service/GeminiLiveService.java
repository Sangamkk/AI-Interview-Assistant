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

    private final Map<String, WebSocket> geminiSessions = new ConcurrentHashMap<>();

    public void handleFrontendMessage(
            WebSocketSession frontendSession,
            String payload) {
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
                        difficulty);

                return;
            }

            WebSocket geminiSocket = geminiSessions.get(frontendSession.getId());

            if (geminiSocket == null) {
                sendToFrontend(
                        frontendSession,
                        "{\"type\":\"ERROR\",\"message\":\"Gemini session not ready\"}");
                return;
            }

            geminiSocket.sendText(payload, true);

        } catch (Exception error) {
            error.printStackTrace();

            sendToFrontend(
                    frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"Invalid message\"}");
        }
    }

    private void startGeminiSession(
            WebSocketSession frontendSession,
            String subject,
            String difficulty) {
        System.out.println("Starting Gemini session...");
        String sessionId = frontendSession.getId();

        if (geminiSessions.containsKey(sessionId)) {
            return;
        }

        String geminiUrl = "wss://generativelanguage.googleapis.com/ws/"
                + "google.ai.generativelanguage.v1beta."
                + "GenerativeService.BidiGenerateContent"
                + "?key=" + apiKey;

        httpClient.newWebSocketBuilder()
                .buildAsync(
                        URI.create(geminiUrl),
                        new GeminiWebSocketListener(frontendSession))
                .thenAccept(geminiSocket -> {
                    System.out.println("Gemini WebSocket connected");
                    geminiSessions.put(sessionId, geminiSocket);
                    sendGeminiSetup(geminiSocket, subject, difficulty);
                })
                .exceptionally(error -> {
                    error.printStackTrace();

                    sendToFrontend(
                            frontendSession,
                            "{\"type\":\"ERROR\",\"message\":\"Failed to connect to Gemini\"}");

                    return null;
                });
    }

    private void sendGeminiSetup(
            WebSocket geminiSocket,
            String subject,
            String difficulty) {
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
                          "text": "You are a professional interviewer. Conduct a realistic interview about %s. The difficulty is %s. Start by greeting the candidate and asking the first question. Ask only one question at a time. Wait for the candidate's answer before continuing. Evaluate answers internally. Ask relevant follow-up questions. Keep responses concise and conversational."
                        }
                      ]
                    }
                  }
                }
                """
                .formatted(subject, difficulty);

        System.out.println("Sending Gemini setup:");
        System.out.println(setupMessage);

        geminiSocket.sendText(setupMessage, true)
                .whenComplete((socket, error) -> {
                    if (error != null) {
                        System.err.println("Gemini setup send failed");
                        error.printStackTrace();
                        return;
                    }

                    System.out.println("Gemini setup sent");
                });
    }

    public void closeSession(String frontendSessionId) {
        WebSocket geminiSocket = geminiSessions.remove(frontendSessionId);

        if (geminiSocket != null) {
            geminiSocket.sendClose(
                    WebSocket.NORMAL_CLOSURE,
                    "Interview ended");
        }
    }

    private void sendToFrontend(
            WebSocketSession session,
            String message) {
        try {
            if (session.isOpen()) {
                session.sendMessage(
                        new TextMessage(message));
            }
        } catch (Exception error) {
            error.printStackTrace();
        }
    }

    private void forwardGeminiResponse(
            WebSocketSession frontendSession,
            JsonNode geminiMessage) {
        try {
            JsonNode serverContent = geminiMessage.get("serverContent");

            if (serverContent == null) {
                return;
            }

            JsonNode modelTurn = serverContent.get("modelTurn");

            if (modelTurn != null && modelTurn.has("parts")) {
                for (JsonNode part : modelTurn.get("parts")) {

                    JsonNode inlineData = part.get("inlineData");

                    if (inlineData != null
                            && inlineData.has("data")) {

                        String audio = inlineData.get("data").asText();

                        sendToFrontend(
                                frontendSession,
                                objectMapper.writeValueAsString(
                                        Map.of(
                                                "type", "AUDIO",
                                                "audio", audio)));
                    }
                }
            }

            JsonNode inputTranscription = serverContent.get("inputTranscription");

            if (inputTranscription != null
                    && inputTranscription.has("text")) {

                sendToFrontend(
                        frontendSession,
                        objectMapper.writeValueAsString(
                                Map.of(
                                        "type", "USER_TRANSCRIPTION",
                                        "text",
                                        inputTranscription
                                                .get("text")
                                                .asText())));
            }

            JsonNode outputTranscription = serverContent.get("outputTranscription");

            if (outputTranscription != null
                    && outputTranscription.has("text")) {

                sendToFrontend(
                        frontendSession,
                        objectMapper.writeValueAsString(
                                Map.of(
                                        "type", "AI_TRANSCRIPTION",
                                        "text",
                                        outputTranscription
                                                .get("text")
                                                .asText())));
            }

        } catch (Exception error) {
            System.err.println("Error forwarding Gemini response");
            error.printStackTrace();
        }
    }

    private class GeminiWebSocketListener implements WebSocket.Listener {

        private final WebSocketSession frontendSession;
        private final StringBuilder messageBuffer = new StringBuilder();

        public GeminiWebSocketListener(WebSocketSession frontendSession) {
            this.frontendSession = frontendSession;
        }

        @Override
        public void onOpen(WebSocket webSocket) {
            System.out.println("Gemini WebSocket onOpen called");
            WebSocket.Listener.super.onOpen(webSocket);
            webSocket.request(1);
        }

        @Override
        public CompletionStage<?> onText(
                WebSocket webSocket,
                CharSequence data,
                boolean last) {
            try {
                messageBuffer.append(data);

                if (!last) {
                    System.out.println("Gemini response fragment received:");
                    System.out.println(data);
                    return WebSocket.Listener.super.onText(webSocket, data, false);
                }

                String completeMessage = messageBuffer.toString();
                messageBuffer.setLength(0);

                System.out.println("GEMINI COMPLETE RESPONSE RECEIVED:");
                System.out.println(completeMessage);

                JsonNode geminiMessage = objectMapper.readTree(completeMessage);

                if (geminiMessage.has("setupComplete")) {
                    System.out.println("Gemini setupComplete received");
                    sendToFrontend(frontendSession, "{\"type\":\"READY\"}");
                    return WebSocket.Listener.super.onText(webSocket, data, true);
                }

                forwardGeminiResponse(frontendSession, geminiMessage);

            } catch (Exception error) {
                System.err.println("Gemini response handling failed");
                error.printStackTrace();
            } finally {
                webSocket.request(1);
            }

            return WebSocket.Listener.super.onText(webSocket, data, last);
        }

        @Override
        public void onError(
                WebSocket webSocket,
                Throwable error) {
            System.err.println("Gemini WebSocket error");
            error.printStackTrace();
        }

        @Override
        public CompletionStage<?> onClose(
                WebSocket webSocket,
                int statusCode,
                String reason) {
            System.out.println("Gemini closed");
            System.out.println("Status code: " + statusCode);
            System.out.println("Reason: " + reason);

            return WebSocket.Listener.super.onClose(
                    webSocket,
                    statusCode,
                    reason);
        }
    }

    @PreDestroy
    public void closeAllSessions() {
        geminiSessions.forEach(
                (sessionId, socket) -> socket.sendClose(
                        WebSocket.NORMAL_CLOSURE,
                        "Server shutting down"));

        geminiSessions.clear();
    }
}
