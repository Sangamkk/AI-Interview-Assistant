"use client";

import { useRef, useState } from "react";
import { getGeminiToken } from "@/lib/gemini";
import { arrayBufferToBase64, playGeminiAudio } from "@/lib/audio";
import InterviewSetup from "@/components/interview/InterviewSetup";
import CameraPreview from "@/components/interview/CameraPreview";
import ProctoringStatus from "@/components/interview/ProctoringStatus";
import { InterviewConfig } from "@/types/interview";

export default function ProctoredInterviewPage() {

    const [config, setConfig] = useState<InterviewConfig | null>(null);
    const [started, setStarted] = useState(false);
    const [connected, setConnected] = useState(false);
    const [listening, setListening] = useState(false);
    const [status, setStatus] = useState("Not connected");

    const [cameraActive, setCameraActive] = useState(false);
    const [microphoneActive, setMicrophoneActive] = useState(false);
    const [screenSharing, setScreenSharing] = useState(false);
    const [warningCount, setWarningCount] = useState(0);

    const socketRef = useRef<WebSocket | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const playbackContextRef = useRef<AudioContext | null>(null);
    const nextAudioTimeRef = useRef(0);

    // --------------------------------
    // Start camera + microphone
    // --------------------------------

    const startCameraAndMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            mediaStreamRef.current = stream;

            setCameraActive(true);
            setMicrophoneActive(true);

            return stream;

        } catch (error) {
            console.error("Camera/microphone error:", error);
            setStatus("Camera or microphone permission denied");
            throw error;
        }
    };

    // --------------------------------
    // Start screen sharing
    // --------------------------------

    const startScreenSharing = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            screenStreamRef.current = stream;
            setScreenSharing(true);

            const track = stream.getVideoTracks()[0];

            track.onended = () => {
                console.log("Screen sharing stopped");
                setScreenSharing(false);
                setWarningCount((previous) => previous + 1);
            };

            return stream;

        } catch (error) {
            console.error("Screen sharing error:", error);
            setStatus("Screen sharing is required");
            throw error;
        }
    };

    // --------------------------------
    // Start microphone audio processing
    // --------------------------------

    const startMicrophone = async (stream: MediaStream) => {
        try {
            const audioContext = new AudioContext({
                sampleRate: 16000
            });

            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = audioContext.createScriptProcessor(
                4096,
                1,
                1
            );

            processorRef.current = processor;

            processor.onaudioprocess = (event) => {
                const socket = socketRef.current;

                if (!socket || socket.readyState !== WebSocket.OPEN) {
                    return;
                }

                const input = event.inputBuffer.getChannelData(0);
                const pcm16 = new Int16Array(input.length);
                for (let i = 0; i < input.length; i++) {
                    const sample = Math.max(-1, Math.min(1, input[i]));
                    pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                }

                const base64 = arrayBufferToBase64(pcm16.buffer);
                socket.send( 
                    JSON.stringify({
                        realtimeInput: {
                            audio: {
                                data: base64,
                                mimeType: "audio/pcm;rate=16000"
                            }
                        }
                    })
                );
            };
            source.connect(processor);
            processor.connect(audioContext.destination);
            setListening(true);
        } catch (error) {
            console.error("Microphone processing error:", error);
        }
    };
    // --------------------------------
    // Start Gemini voice interview
    // --------------------------------
    const startVoiceInterview = async ( interviewConfig: InterviewConfig ) => {
        try {
            setConfig(interviewConfig);
            setStarted(true);
            setStatus("Requesting permissions...");
            const mediaStream = await startCameraAndMicrophone();
            await startScreenSharing();
            setStatus("Getting Gemini session...");
            const token = await getGeminiToken();

            console.log("Gemini token received");
            const socket = new WebSocket( `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${token}` );
            socketRef.current = socket;
            // --------------------------------
            // WebSocket OPEN
            // --------------------------------
            socket.onopen = () => {
                console.log("Connected to Gemini Live");
                setConnected(true);
                setStatus("Connecting to Gemini...");
                const setupMessage = {
                    setup: {
                        model: "models/gemini-3.1-flash-live-preview",
                        generationConfig: {
                            responseModalities: ["AUDIO"]
                        },
                        systemInstruction: {
                            parts: [{
                                text: `
You are a professional ${interviewConfig.type} interviewer.
Conduct a realistic interview.
Interview topic: ${interviewConfig.subject}
Programming language: ${interviewConfig.language}
Difficulty level: ${interviewConfig.difficulty}
Number of questions: ${interviewConfig.questionCount}
Ask one question at a time.
Wait for the candidate's answer.
Listen carefully.
Evaluate the answer internally.
Ask relevant follow-up questions.
Keep your responses concise and conversational.
Speak naturally like a human interviewer.
                                `
                            }]
                        }
                    }
                };
                socket.send(
                    JSON.stringify(setupMessage)
                );
                console.log("Gemini setup sent");
            };
            // --------------------------------
            // Messages from Gemini
            // --------------------------------
            socket.onmessage = async (event) => {
                try {
                    let messageText: string;

                    if (event.data instanceof Blob) {
                        messageText =
                            await event.data.text();
                    } else if (
                        typeof event.data === "string"
                    ) {
                        messageText = event.data;
                    } else {
                        console.log(
                            "Unknown Gemini message:",
                            event.data
                        );
                        return;
                    }
                    const data = JSON.parse(messageText);
                    // --------------------------------
                    // Gemini ready
                    // --------------------------------
                    if (data.setupComplete) {
                        console.log(
                            "Gemini setup complete"
                        );
                        setStatus("Gemini ready");
                        await startMicrophone( mediaStream );
                        return;
                    }

                    const serverContent = data.serverContent;
                    if (!serverContent) {
                        return;
                    }
                    // --------------------------------
                    // Gemini audio
                    // --------------------------------
                    const modelTurn = serverContent.modelTurn;
                    if (modelTurn?.parts) {
                        for ( const part of modelTurn.parts ) {
                            if (part.inlineData) {
                                const audioData = part.inlineData.data;
                                playGeminiAudio(
                                    audioData,
                                    playbackContextRef,
                                    nextAudioTimeRef
                                );
                            }
                        }
                    }
                    // --------------------------------
                    // User transcription
                    // --------------------------------
                    if ( serverContent.inputTranscription ) {
                        console.log(
                            "You:",
                            serverContent
                                .inputTranscription
                                .text
                        );
                    }
                    // --------------------------------
                    // Gemini transcription
                    // --------------------------------
                    if ( serverContent.outputTranscription ) {
                        console.log(
                            "Gemini:",
                            serverContent
                                .outputTranscription
                                .text
                        );
                    }
                } catch (error) {
                    console.error(
                        "Gemini message error:",
                        error
                    );
                }
            };
            // --------------------------------
            // WebSocket error
            // --------------------------------
            socket.onerror = (error) => {
                console.error(
                    "Gemini WebSocket error:",
                    error
                );
                setStatus(
                    "Gemini connection error"
                );
            };
            // --------------------------------
            // WebSocket closed
            // --------------------------------
            socket.onclose = (event) => {
                console.log(
                    "Gemini connection closed"
                );
                console.log(
                    "Close code:",
                    event.code
                );
                console.log(
                    "Close reason:",
                    event.reason
                );
                stopInterview();
                setStatus("Disconnected");
            };
        } catch (error) {
            console.error(
                "Proctored interview error:",
                error
            );
            stopInterview();
            setStarted(false);
            setStatus(
                "Unable to start interview"
            );
        }
    };
    // --------------------------------
    // Stop interview
    // --------------------------------

    const stopInterview = () => {
        processorRef.current?.disconnect();
        processorRef.current = null;

        sourceRef.current?.disconnect();
        sourceRef.current = null;

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            mediaStreamRef.current = null;
        }

        if (screenStreamRef.current) {
            screenStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            screenStreamRef.current = null;
        }

        if (playbackContextRef.current) {
            playbackContextRef.current.close();
            playbackContextRef.current = null;
        }

        nextAudioTimeRef.current = 0;

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }

        setConnected(false);
        setListening(false);
        setCameraActive(false);
        setMicrophoneActive(false);
        setScreenSharing(false);
    };

    // --------------------------------
    // Setup UI
    // --------------------------------

    if (!started) {
        return (
            <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
                <div className="mx-auto max-w-4xl">

                    <header className="mb-10">
                        <p className="mb-2 text-sm font-semibold tracking-widest text-indigo-400">
                            AI POWERED INTERVIEW
                        </p>

                        <h1 className="text-4xl font-bold tracking-tight">
                            Proctored Interview
                        </h1>

                        <p className="mt-3 text-gray-400">
                            Voice interview with camera and screen monitoring.
                        </p>
                    </header>

                    <InterviewSetup
                        onStart={startVoiceInterview}
                    />

                </div>
            </main>
        );
    }

    // --------------------------------
    // Interview UI
    // --------------------------------

    return (
        <main className="min-h-screen bg-gray-950 px-6 py-8 text-white">
            <div className="mx-auto max-w-6xl">

                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold tracking-widest text-indigo-400">
                            PROCTORED INTERVIEW
                        </p>

                        <h1 className="text-3xl font-bold">
                            AI Interview Assistant
                        </h1>

                        <p className="mt-1 text-gray-400">
                            {config?.type} · {config?.subject} · {config?.difficulty}
                        </p>
                    </div>

                    <button
                        onClick={stopInterview}
                        className="rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-700"
                    >
                        End Interview
                    </button>
                </header>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Camera */}

                    <div className="lg:col-span-2">
                        <CameraPreview
                            stream={mediaStreamRef.current}
                        />
                    </div>

                    {/* Monitoring */}

                    <div>
                        <ProctoringStatus
                            cameraActive={cameraActive}
                            microphoneActive={microphoneActive}
                            screenSharing={screenSharing}
                            warningCount={warningCount}
                        />

                        <div className="mt-6 rounded-xl border border-slate-800 bg-gray-900 p-6 text-center">

                            <p className="text-gray-400">
                                Status
                            </p>

                            <p className="mt-2 font-semibold">
                                {status}
                            </p>

                            {connected && (
                                <div className="mt-6">
                                    <div className="text-6xl">
                                        {listening ? "🎤" : "🔊"}
                                    </div>

                                    <p className="mt-3 text-gray-300">
                                        {listening
                                            ? "Listening..."
                                            : "AI is speaking..."}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}