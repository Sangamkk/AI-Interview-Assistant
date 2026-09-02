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
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
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

            // -----------------------------------------
            // FRONTEND SETUP
            // -----------------------------------------
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

            // -----------------------------------------
            // FIND GEMINI SESSION
            // -----------------------------------------
            WebSocket geminiSocket = geminiSessions.get(frontendSession.getId());

            if (geminiSocket == null) {

                sendToFrontend(
                        frontendSession,
                        "{\"type\":\"ERROR\",\"message\":\"Gemini session not ready\"}");

                return;
            }

            // -----------------------------------------
            // FORWARD MESSAGE TO GEMINI
            // -----------------------------------------
            System.out.println("Forwarding frontend message to Gemini:");
            System.out.println(payload);

            geminiSocket.sendText(payload, true);

        } catch (Exception error) {

            System.err.println("Error handling frontend message");
            error.printStackTrace();

            sendToFrontend(
                    frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"Invalid message\"}");
        }
    }

    // =========================================================
    // START GEMINI SESSION
    // =========================================================

    private void startGeminiSession(
            WebSocketSession frontendSession,
            String subject,
            String difficulty) {

        System.out.println("Starting Gemini session...");

        String sessionId = frontendSession.getId();

        if (geminiSessions.containsKey(sessionId)) {

            System.out.println(
                    "Gemini session already exists: " + sessionId);

            return;
        }

        System.out.println(
                "Gemini API key length: " + apiKey.length());

        System.out.println(
                "Gemini API key starts with: "
                        + apiKey.substring(
                                0,
                                Math.min(5, apiKey.length())));

        String geminiUrl = "wss://generativelanguage.googleapis.com/ws/"
                + "google.ai.generativelanguage.v1beta."
                + "GenerativeService.BidiGenerateContent"
                + "?key=" + apiKey;

        System.out.println("Connecting to Gemini Live...");

        httpClient.newWebSocketBuilder()
                .buildAsync(
                        URI.create(geminiUrl),
                        new GeminiWebSocketListener(
                                frontendSession,
                                subject,
                                difficulty))
                .thenAccept(geminiSocket -> {

                    System.out.println(
                            "Gemini WebSocket connected");

                    geminiSessions.put(
                            sessionId,
                            geminiSocket);

                    sendGeminiSetup(
                            geminiSocket,
                            subject,
                            difficulty);
                })
                .exceptionally(error -> {

                    System.err.println(
                            "Failed to connect to Gemini");

                    error.printStackTrace();

                    sendToFrontend(
                            frontendSession,
                            "{\"type\":\"ERROR\",\"message\":\"Failed to connect to Gemini\"}");

                    return null;
                });
    }

    // =========================================================
    // GEMINI SETUP
    // =========================================================

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

                    "outputAudioTranscription": {},

                    "systemInstruction": {
                      "parts": [
                        {
                          "text": "You are a professional %s interviewer. Conduct an interactive interview. The difficulty level is %s. Ask one question at a time, listen to the candidate's answer, and then continue with the next appropriate question. Keep your responses concise."
                        }
                      ]
                    }
                  }
                }
                """
                .formatted(subject, difficulty);

        System.out.println("Sending Gemini setup:");
        System.out.println(setupMessage);

        geminiSocket.sendText(
                setupMessage,
                true)
                .whenComplete((socket, error) -> {

                    if (error != null) {

                        System.err.println(
                                "Gemini setup send failed");

                        error.printStackTrace();

                    } else {

                        System.out.println(
                                "Gemini setup sent.");

                        System.out.println(
                                "Waiting for setupComplete...");
                    }
                });
    }

    // =========================================================
    // CLOSE SESSION
    // =========================================================

    public void closeSession(
            String frontendSessionId) {

        WebSocket geminiSocket = geminiSessions.remove(
                frontendSessionId);

        if (geminiSocket != null) {

            System.out.println(
                    "Closing Gemini session: "
                            + frontendSessionId);

            geminiSocket.sendClose(
                    WebSocket.NORMAL_CLOSURE,
                    "Interview ended");
        }
    }

    // =========================================================
    // SEND MESSAGE TO FRONTEND
    // =========================================================

    private void sendToFrontend(
            WebSocketSession session,
            String message) {

        try {

            if (session.isOpen()) {

                session.sendMessage(
                        new TextMessage(message));
            }

        } catch (Exception error) {

            System.err.println(
                    "Failed to send message to frontend");

            error.printStackTrace();
        }
    }
    // =========================================================
    // FORWARD GEMINI RESPONSE
    // =========================================================

    private void forwardGeminiResponse(
            WebSocketSession frontendSession,
            JsonNode geminiMessage) {

        try {

            JsonNode serverContent = geminiMessage.get("serverContent");

            if (serverContent == null) {
                return;
            }

            // -----------------------------------------
            // MODEL TURN
            // -----------------------------------------

            JsonNode modelTurn = serverContent.get("modelTurn");

            if (modelTurn != null
                    && modelTurn.has("parts")) {

                for (JsonNode part : modelTurn.get("parts")) {

                    JsonNode inlineData = part.get("inlineData");

                    if (inlineData != null
                            && inlineData.has("data")) {

                        String audio = inlineData
                                .get("data")
                                .asText();

                        System.out.println(
                                "Audio chunk received from Gemini");

                        sendToFrontend(
                                frontendSession,
                                objectMapper.writeValueAsString(
                                        Map.of(
                                                "type",
                                                "AUDIO",
                                                "audio",
                                                audio)));
                    }
                }
            }

            // -----------------------------------------
            // USER TRANSCRIPTION
            // -----------------------------------------

            JsonNode inputTranscription = serverContent.get(
                    "inputTranscription");

            if (inputTranscription != null
                    && inputTranscription.has("text")) {

                String text = inputTranscription
                        .get("text")
                        .asText();

                System.out.println(
                        "USER TRANSCRIPTION: " + text);

                sendToFrontend(
                        frontendSession,
                        objectMapper.writeValueAsString(
                                Map.of(
                                        "type",
                                        "USER_TRANSCRIPTION",
                                        "text",
                                        text)));
            }

            // -----------------------------------------
            // AI TRANSCRIPTION
            // -----------------------------------------

            JsonNode outputTranscription = serverContent.get(
                    "outputTranscription");

            if (outputTranscription != null
                    && outputTranscription.has("text")) {

                String text = outputTranscription
                        .get("text")
                        .asText();

                System.out.println(
                        "AI TRANSCRIPTION: " + text);

                sendToFrontend(
                        frontendSession,
                        objectMapper.writeValueAsString(
                                Map.of(
                                        "type",
                                        "AI_TRANSCRIPTION",
                                        "text",
                                        text)));
            }

            // -----------------------------------------
            // TURN COMPLETE
            // -----------------------------------------

            if (serverContent.has("turnComplete")
                    && serverContent
                            .get("turnComplete")
                            .asBoolean()) {

                System.out.println(
                        "Gemini turn complete");

                sendToFrontend(
                        frontendSession,
                        "{\"type\":\"TURN_COMPLETE\"}");
            }

        } catch (Exception error) {

            System.err.println(
                    "Error forwarding Gemini response");

            error.printStackTrace();
        }
    }

    // =========================================================
    // GEMINI WEBSOCKET LISTENER
    // =========================================================

    private class GeminiWebSocketListener
            implements WebSocket.Listener {

        private final WebSocketSession frontendSession;

        private final String subject;
        private final String difficulty;

        // Text frame buffer
        private final StringBuilder textBuffer = new StringBuilder();

        // Binary frame buffer
        private final StringBuilder binaryBuffer = new StringBuilder();

        public GeminiWebSocketListener(
                WebSocketSession frontendSession,
                String subject,
                String difficulty) {

            this.frontendSession = frontendSession;

            this.subject = subject;
            this.difficulty = difficulty;
        }

        // =====================================================
        // CONNECTION OPENED
        // =====================================================

        private void processGeminiMessage(
                WebSocket webSocket,
                String message) {

            try {

                System.out.println("================================");
                System.out.println("GEMINI COMPLETE MESSAGE");
                System.out.println("================================");

                System.out.println(message);

                JsonNode geminiMessage = objectMapper.readTree(message);

                // =========================================
                // SETUP COMPLETE
                // =========================================

                if (geminiMessage.has("setupComplete")) {

                    System.out.println("================================");
                    System.out.println("GEMINI SETUP COMPLETE");
                    System.out.println("================================");

                    // Tell frontend Gemini is ready
                    sendToFrontend(
                            frontendSession,
                            "{\"type\":\"READY\"}");

                    // Start interview
                    sendFirstQuestion(webSocket);

                    return;
                }

                // =========================================
                // SERVER CONTENT
                // =========================================

                JsonNode serverContent = geminiMessage.get("serverContent");

                if (serverContent == null) {
                    return;
                }

                // =========================================
                // FORWARD AUDIO / TRANSCRIPTIONS
                // =========================================

                forwardGeminiResponse(
                        frontendSession,
                        geminiMessage);

            } catch (Exception error) {

                System.err.println(
                        "Failed to process Gemini message");

                error.printStackTrace();
            }
        }

        @Override
        public void onOpen(
                WebSocket webSocket) {

            System.out.println(
                    "Gemini WebSocket onOpen called");

            WebSocket.Listener.super.onOpen(
                    webSocket);

            // Tell Java WebSocket API that
            // we are ready to receive data.
            webSocket.request(1);
        }

        // =====================================================
        // TEXT MESSAGE
        // =====================================================

        @Override
        public CompletionStage<?> onText(
                WebSocket webSocket,
                CharSequence data,
                boolean last) {

            System.out.println(
                    "Gemini TEXT frame received");

            textBuffer.append(
                    data);

            if (last) {

                String completeMessage = textBuffer.toString();

                textBuffer.setLength(0);

                processGeminiMessage(
                        webSocket,
                        completeMessage);
            }

            // Request next frame
            webSocket.request(1);

            return WebSocket.Listener.super.onText(
                    webSocket,
                    data,
                    last);
        }

        // =====================================================
        // BINARY MESSAGE
        // =====================================================

        @Override
        public CompletionStage<?> onBinary(
                WebSocket webSocket,
                ByteBuffer data,
                boolean last) {

            System.out.println(
                    "================================");

            System.out.println(
                    "GEMINI BINARY FRAME RECEIVED");

            System.out.println(
                    "================================");

            try {

                byte[] bytes = new byte[data.remaining()];

                data.get(bytes);

                String message = new String(
                        bytes,
                        StandardCharsets.UTF_8);

                System.out.println(
                        "Binary data converted to UTF-8:");

                System.out.println(message);

                binaryBuffer.append(message);

                if (last) {

                    String completeMessage = binaryBuffer.toString();

                    binaryBuffer.setLength(0);

                    System.out.println(
                            "Complete binary JSON received:");

                    System.out.println(
                            completeMessage);

                    processGeminiMessage(
                            webSocket,
                            completeMessage);
                }

            } catch (Exception error) {

                System.err.println(
                        "Failed to process Gemini binary frame");

                error.printStackTrace();

            } finally {

                // Very important:
                // request the next WebSocket frame.
                webSocket.request(1);
            }

            return WebSocket.Listener.super.onBinary(
                    webSocket,
                    data,
                    last);
        }

        // =====================================================
        // SEND FIRST INTERVIEW QUESTION
        // =====================================================

        private void sendFirstQuestion(
                WebSocket geminiSocket) {

            String firstMessage = """
                    {
                      "realtimeInput": {
                        "text": "Start the interview. Greet me briefly and ask me the first interview question."
                      }
                    }
                    """;

            System.out.println(
                    "================================");

            System.out.println(
                    "SENDING FIRST INTERVIEW MESSAGE");

            System.out.println(
                    "================================");

            System.out.println(
                    firstMessage);

            geminiSocket
                    .sendText(
                            firstMessage,
                            true)
                    .whenComplete(
                            (socket, error) -> {

                                if (error != null) {

                                    System.err.println(
                                            "Initial interview message failed");

                                    error.printStackTrace();

                                } else {

                                    System.out.println(
                                            "Initial interview message sent successfully");
                                }
                            });
        }

        // =====================================================
        // ERROR
        // =====================================================

        @Override
        public void onError(
                WebSocket webSocket,
                Throwable error) {

            System.err.println(
                    "================================");

            System.err.println(
                    "GEMINI WEBSOCKET ERROR");

            System.err.println(
                    "================================");

            error.printStackTrace();

            sendToFrontend(
                    frontendSession,
                    "{\"type\":\"ERROR\",\"message\":\"Gemini WebSocket error\"}");
        }

        // =====================================================
        // CLOSE
        // =====================================================

        @Override
        public CompletionStage<?> onClose(
                WebSocket webSocket,
                int statusCode,
                String reason) {

            System.out.println(
                    "Gemini WebSocket closed");

            System.out.println(
                    "Status code: " + statusCode);

            System.out.println(
                    "Reason: " + reason);

            geminiSessions.remove(
                    frontendSession.getId());

            return WebSocket.Listener.super.onClose(
                    webSocket,
                    statusCode,
                    reason);
        }

        // =====================================================
        // GET FRONTEND SESSION
        // =====================================================
    }

    // =========================================================
    // SHUTDOWN
    // =========================================================

    @PreDestroy
    public void closeAllSessions() {

        System.out.println(
                "Closing all Gemini sessions...");

        geminiSessions.forEach(
                (sessionId, socket) -> {

                    try {

                        socket.sendClose(
                                WebSocket.NORMAL_CLOSURE,
                                "Server shutting down");

                    } catch (Exception error) {

                        error.printStackTrace();
                    }
                });

        geminiSessions.clear();
    }
}