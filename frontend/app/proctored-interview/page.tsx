"use client";

import { useRef, useState } from "react";
import { arrayBufferToBase64, playGeminiAudio } from "@/lib/audio";
import InterviewSetup from "@/components/interview/InterviewSetup";
import CameraPreview from "@/components/interview/CameraPreview";
import ProctoringStatus from "@/components/interview/ProctoringStatus";
import { InterviewConfig } from "@/types/interview";
import localFont from "next/font/local";

const pixelOperator = localFont({
    src: "../fonts/PixelOperatorSC.ttf",
    variable: "--font-pixel-operator",
});
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

            if (audioContext.state === "suspended") {
                await audioContext.resume();
            }

            const source =
                audioContext.createMediaStreamSource(stream);

            sourceRef.current = source;

            const processor =
                audioContext.createScriptProcessor(
                    1024,
                    1,
                    1
                );

            processorRef.current = processor;

            // Prevent microphone audio from being played through speakers
            const silentGain =
                audioContext.createGain();

            silentGain.gain.value = 0;

            processor.onaudioprocess = (event) => {

                const socket = socketRef.current;

                if (
                    !socket ||
                    socket.readyState !== WebSocket.OPEN
                ) {
                    return;
                }

                // Prevent WebSocket backlog
                if (socket.bufferedAmount > 50000) {
                    console.warn(
                        "WebSocket buffer high, skipping audio chunk:",
                        socket.bufferedAmount
                    );
                    return;
                }

                const input =
                    event.inputBuffer.getChannelData(0);

                const pcm16 =
                    new Int16Array(input.length);

                for (let i = 0; i < input.length; i++) {

                    const sample =
                        Math.max(
                            -1,
                            Math.min(1, input[i])
                        );

                    pcm16[i] =
                        sample < 0
                            ? sample * 0x8000
                            : sample * 0x7fff;
                }

                const base64 =
                    arrayBufferToBase64(
                        pcm16.buffer
                    );

                const message = {
                    realtimeInput: {
                        audio: {
                            data: base64,
                            mimeType: "audio/pcm;rate=16000"
                        }
                    }
                };

                const setupJson =
                    JSON.stringify(message);

                console.log(
                    "Gemini setup message size:",
                    setupJson.length,
                    "characters"
                );

                socket.send(setupJson);

                console.log(
                    "Gemini setup sent"
                );
            };

            source.connect(processor);

            processor.connect(silentGain);

            silentGain.connect(
                audioContext.destination
            );

            setListening(true);

            console.log(
                "Microphone processing started"
            );

        } catch (error) {

            console.error(
                "Microphone processing error:",
                error
            );

            setStatus(
                "Microphone processing failed"
            );
        }
    };
    // --------------------------------
    // Start Gemini voice interview
    // --------------------------------
    const startVoiceInterview = async (
        interviewConfig: InterviewConfig
    ) => {
        try {

            setConfig(interviewConfig);
            setStarted(true);

            setStatus("Requesting permissions...");

            // --------------------------------
            // CAMERA + MICROPHONE
            // --------------------------------

            const mediaStream =
                await startCameraAndMicrophone();

            // --------------------------------
            // SCREEN SHARING
            // --------------------------------

            await startScreenSharing();

            // --------------------------------
            // CONNECT TO SPRING BOOT
            // --------------------------------

            setStatus(
                "Connecting to interview server..."
            );
            console.log("i am here.");
            const socket = new WebSocket(
                "ws://localhost:8080/ws/voice-interview"
            );
            console.log("i am here.");

            socketRef.current = socket;

            // --------------------------------
            // BACKEND CONNECTED
            // --------------------------------

            socket.onopen = () => {

                console.log(
                    "Connected to backend"
                );

                setConnected(true);

                setStatus(
                    "Starting Gemini session..."
                );

                // Send interview configuration
                // to Spring Boot

                const setupMessage = {
                    type: "SETUP",

                    subject:
                        interviewConfig.subject,

                    difficulty:
                        interviewConfig.difficulty,

                    interviewType:
                        interviewConfig.type,

                    language:
                        interviewConfig.language,

                    questionCount:
                        interviewConfig.questionCount
                };

                socket.send(
                    JSON.stringify(
                        setupMessage
                    )
                );

                console.log(
                    "Interview setup sent to backend"
                );
            };

            // --------------------------------
            // MESSAGES FROM SPRING BOOT
            // --------------------------------

            socket.onmessage = async (
                event
            ) => {

                try {

                    let messageText: string;

                    if (
                        event.data instanceof Blob
                    ) {

                        messageText =
                            await event.data.text();

                    } else if (
                        event.data instanceof ArrayBuffer
                    ) {

                        messageText =
                            new TextDecoder().decode(
                                event.data
                            );

                    } else if (
                        typeof event.data === "string"
                    ) {

                        messageText =
                            event.data;

                    } else {

                        console.log(
                            "Unknown backend message:",
                            event.data
                        );

                        return;
                    }

                    const data =
                        JSON.parse(
                            messageText
                        );

                    console.log(
                        "Backend message:",
                        data
                    );

                    // --------------------------------
                    // GEMINI READY
                    // --------------------------------

                    if (
                        data.type === "READY"
                    ) {

                        console.log(
                            "Gemini session ready"
                        );

                        setStatus(
                            "Gemini ready"
                        );

                        // Start sending microphone
                        // audio to Spring Boot

                        await startMicrophone(
                            mediaStream
                        );

                        console.log(
                            "Microphone started"
                        );

                        return;
                    }

                    // --------------------------------
                    // GEMINI AUDIO
                    // --------------------------------

                    if (
                        data.type === "AUDIO"
                    ) {

                        console.log(
                            "Gemini audio received"
                        );

                        playGeminiAudio(
                            data.audio,
                            playbackContextRef,
                            nextAudioTimeRef
                        );

                        return;
                    }

                    // --------------------------------
                    // USER TRANSCRIPTION
                    // --------------------------------

                    if (
                        data.type ===
                        "USER_TRANSCRIPTION"
                    ) {

                        console.log(
                            "You:",
                            data.text
                        );

                        return;
                    }

                    // --------------------------------
                    // AI TRANSCRIPTION
                    // --------------------------------

                    if (
                        data.type ===
                        "AI_TRANSCRIPTION"
                    ) {

                        console.log(
                            "Gemini:",
                            data.text
                        );

                        return;
                    }

                    // --------------------------------
                    // ERROR
                    // --------------------------------

                    if (
                        data.type === "ERROR"
                    ) {

                        console.error(
                            "Backend error:",
                            data.message
                        );

                        setStatus(
                            data.message
                        );

                        return;
                    }

                } catch (error) {

                    console.error(
                        "Backend message error:",
                        error
                    );
                }
            };

            // --------------------------------
            // WEBSOCKET ERROR
            // --------------------------------

            socket.onerror = (
                error
            ) => {

                console.error(
                    "Backend WebSocket error:",
                    error
                );

                setStatus(
                    "Backend connection error"
                );
            };

            // --------------------------------
            // WEBSOCKET CLOSED
            // --------------------------------

            socket.onclose = (
                event
            ) => {

                console.log(
                    "================================"
                );

                console.log(
                    "BACKEND WEBSOCKET CLOSED"
                );

                console.log(
                    "Close code:",
                    event.code
                );

                console.log(
                    "Close reason:",
                    event.reason
                );

                console.log(
                    "Was clean:",
                    event.wasClean
                );

                console.log(
                    "================================"
                );

                stopInterview();

                setConnected(false);
                setListening(false);

                setStatus(
                    event.code === 1009
                        ? "WebSocket message too large"
                        : "Disconnected"
                );
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

    // --------------------------------
    // Setup UI
    // --------------------------------

    if (!started) {
        return (
            <main
                className={`${pixelOperator.className} min-h-screen bg-[#e6e4df] p-3 text-[#4d3728] sm:p-5`}
            >
                {/* MAIN DESKTOP */}
                <section className="mx-auto min-h-[calc(100vh-24px)] max-w-[1350px] overflow-hidden rounded-[24px] border-[3px] border-[#62412c] bg-[#f3ead8] shadow-[10px_10px_0_rgba(92,60,40,0.35)]">

                    {/* ================= SYSTEM BAR ================= */}
                    <header className="flex h-14 items-center justify-between border-b-[3px] border-[#62412c] bg-[#3d98a8] px-5 sm:px-8">

                        <p className="text-[12px] tracking-[0.08em] sm:text-[16px]">
                            AI INTERVIEW ASSISTANT
                        </p>

                        <div className="flex items-center gap-3 text-[11px] tracking-[0.1em]">
                            <span className="hidden sm:inline">
                                PROCTORED MODE
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#73a77d]" />
                                READY
                            </span>
                        </div>

                    </header>

                    {/* ================= MAIN CONTENT ================= */}
                    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center px-6 py-10 sm:px-10">

                        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

                            {/* ================= LEFT CONTENT ================= */}
                            <div className="max-w-[450px]">

                                <p className="text-[10px] tracking-[0.2em] text-[#8b725e]">
                                // SECURE INTERVIEW SYSTEM
                                </p>

                                <h1 className="mt-5 text-[42px] leading-[1.05] tracking-[0.05em] text-[#4c3528] sm:text-[56px]">
                                    FACE TO
                                    <br />
                                    FACE._
                                </h1>

                                <p className="mt-5 max-w-[400px] text-[13px] leading-7 tracking-[0.04em] text-[#715d4e]">
                                    Practice a realistic AI interview with voice
                                    interaction, camera monitoring and screen sharing.
                                </p>

                                {/* SYSTEM FEATURES */}
                                <div className="mt-8 space-y-2 border-l-2 border-[#9b7656] pl-4 text-[10px] tracking-[0.1em] text-[#624c3d]">
                                    <p>[01] CAMERA MONITORING</p>
                                    <p>[02] LIVE VOICE INTERVIEW</p>
                                    <p>[03] SCREEN SHARING</p>
                                </div>

                                <p className="mt-8 text-[9px] tracking-[0.14em] text-[#967d68]">
                                // CHECK YOUR CAMERA AND MICROPHONE BEFORE STARTING
                                </p>

                            </div>

                            {/* ================= SETUP WINDOW ================= */}
                            <div className="relative">

                                {/* SHADOW */}
                                <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-[14px] bg-[#7b5035]" />

                                <div className="relative overflow-hidden rounded-[14px] border-[3px] border-[#62412c] bg-[#f6eddc]">

                                    {/* WINDOW HEADER */}
                                    <div className="flex items-center justify-between border-b-[3px] border-[#62412c] bg-[#d9c3a0] px-5 py-3">

                                        <div className="flex gap-2">
                                            <span className="h-3 w-3 rounded-full border border-[#62412c] bg-[#e47c6f]" />
                                            <span className="h-3 w-3 rounded-full border border-[#62412c] bg-[#e9bd68]" />
                                            <span className="h-3 w-3 rounded-full border border-[#62412c] bg-[#73a77d]" />
                                        </div>

                                        <p className="text-[9px] tracking-[0.14em] text-[#513b2e]">
                                            VOICE_SESSION.EXE
                                        </p>

                                        <span className="text-[13px]">
                                            □
                                        </span>

                                    </div>

                                    {/* WINDOW CONTENT */}
                                    <div className="p-5 sm:p-7">

                                        <div className="mb-6 border-b border-[#c9b69b] pb-4">

                                            <p className="text-[9px] tracking-[0.18em] text-[#8a705d]">
                                                SESSION CONFIGURATION
                                            </p>

                                            <h2 className="mt-2 text-[20px] tracking-[0.06em] text-[#4c3528]">
                                                SETUP INTERVIEW._
                                            </h2>

                                        </div>

                                        <InterviewSetup
                                            onStart={startVoiceInterview}
                                        />

                                    </div>

                                    {/* STATUS BAR */}
                                    <div className="flex items-center justify-between border-t-2 border-[#62412c] bg-[#eadcc4] px-5 py-3 text-[8px] tracking-[0.12em] text-[#70594a]">

                                        <span>CONFIGURATION READY</span>

                                        <span className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#73a77d]" />
                                            SYSTEM ONLINE
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>
            </main>
        );
    }

    // --------------------------------
    // Interview UI
    // --------------------------------

    return (
        <main className={`${pixelOperator.className} min-h-screen bg-[#e4e3df] p-3 text-[#25282a] sm:p-5`}>

            <section className="relative min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border border-[#cfcec9] bg-[#f0efec] shadow-[0_15px_50px_rgba(40,40,40,0.12)] sm:min-h-[calc(100vh-40px)]">

                {/* Background */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.6),transparent_38%),radial-gradient(circle_at_90%_10%,rgba(210,208,200,0.25),transparent_30%)]" />

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-7 md:px-10">

                    {/* ================= HEADER ================= */}
                    <header className="flex flex-col justify-between gap-6 border-b border-[#c9c8c3] pb-6 sm:flex-row sm:items-center">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center border border-[#aaa9a3] bg-[#e7e6e1] text-[19px] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.8),2px_3px_6px_rgba(0,0,0,0.08)]">
                                &gt;_
                            </div>

                            <div>
                                <p className="text-[9px] tracking-[0.2em] text-[#777872]">
                                    PROCTORED INTERVIEW
                                </p>

                                <h1 className="mt-1 text-[22px] tracking-[0.12em] text-[#2f3231]">
                                    AI INTERVIEW ASSISTANT
                                </h1>

                                <p className="mt-2 text-[10px] tracking-[0.1em] text-[#696a65]">
                                    {config?.type} / {config?.subject} / {config?.difficulty}
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={stopInterview}
                            className="border border-[#8d817b] bg-[#d9d4cf] px-6 py-3 text-[11px] tracking-[0.16em] text-[#4b3e39] transition-all duration-200 hover:bg-[#554c47] hover:text-[#f2f0eb] hover:shadow-[4px_5px_0_rgba(0,0,0,0.12)]"
                        >
                            [ END SESSION ]
                        </button>

                    </header>


                    {/* ================= SYSTEM STATUS BAR ================= */}
                    <div className="my-6 grid grid-cols-2 border border-[#c7c6c0] bg-[#e8e7e2] sm:grid-cols-4">

                        <div className="border-b border-[#c7c6c0] p-4 sm:border-b-0 sm:border-r">
                            <p className="text-[8px] tracking-[0.16em] text-[#858680]">
                                CONNECTION
                            </p>
                            <p className="mt-2 text-[11px] tracking-[0.12em] text-[#373936]">
                                {connected ? "ONLINE" : "CONNECTING"}
                            </p>
                        </div>

                        <div className="border-b border-[#c7c6c0] p-4 sm:border-b-0 sm:border-r">
                            <p className="text-[8px] tracking-[0.16em] text-[#858680]">
                                CAMERA
                            </p>
                            <p className="mt-2 text-[11px] tracking-[0.12em] text-[#373936]">
                                {cameraActive ? "ACTIVE" : "OFFLINE"}
                            </p>
                        </div>

                        <div className="border-r border-[#c7c6c0] p-4">
                            <p className="text-[8px] tracking-[0.16em] text-[#858680]">
                                SCREEN
                            </p>
                            <p className="mt-2 text-[11px] tracking-[0.12em] text-[#373936]">
                                {screenSharing ? "SHARING" : "WAITING"}
                            </p>
                        </div>

                        <div className="p-4">
                            <p className="text-[8px] tracking-[0.16em] text-[#858680]">
                                WARNINGS
                            </p>
                            <p className="mt-2 text-[11px] tracking-[0.12em] text-[#373936]">
                                {String(warningCount).padStart(2, "0")}
                            </p>
                        </div>

                    </div>


                    {/* ================= MAIN GRID ================= */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

                        {/* ================= CAMERA AREA ================= */}
                        <div className="relative border border-[#b9b9b4] bg-[#e9e8e3] p-3 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),0_8px_25px_rgba(0,0,0,0.07)]">

                            <div className="mb-3 flex items-center justify-between border-b border-[#c9c8c3] pb-3">

                                <p className="text-[10px] tracking-[0.18em] text-[#4b4d49]">
                                    [ CAMERA FEED ]
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 ${cameraActive ? "bg-[#59695a]" : "bg-[#a39a94]"}`} />
                                    <span className="text-[8px] tracking-[0.15em] text-[#73746e]">
                                        LIVE
                                    </span>
                                </div>

                            </div>

                            <div className="overflow-hidden border border-[#aaa9a3] bg-[#d9d8d2]">
                                <CameraPreview stream={mediaStreamRef.current} />
                            </div>

                            <p className="mt-4 text-[8px] tracking-[0.13em] text-[#777872]">
                            // VIDEO MONITORING ACTIVE. MAINTAIN CAMERA VISIBILITY.
                            </p>

                        </div>


                        {/* ================= RIGHT PANEL ================= */}
                        <div className="space-y-6">

                            {/* Proctoring */}
                            <div className="border border-[#b9b9b4] bg-[#e9e8e3]/80 p-5 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),0_8px_20px_rgba(0,0,0,0.06)]">

                                <div className="mb-5 border-b border-[#c9c8c3] pb-4">
                                    <p className="text-[10px] tracking-[0.18em] text-[#454744]">
                                        [ SECURITY MONITOR ]
                                    </p>
                                </div>

                                <ProctoringStatus
                                    cameraActive={cameraActive}
                                    microphoneActive={microphoneActive}
                                    screenSharing={screenSharing}
                                    warningCount={warningCount}
                                />

                            </div>


                            {/* AI Status */}
                            <div className="border border-[#b9b9b4] bg-[#e7e6e1] p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">

                                <p className="text-[9px] tracking-[0.18em] text-[#777872]">
                                    AI INTERVIEWER STATUS
                                </p>

                                <div className="my-5 h-px bg-[#c8c7c1]" />

                                <p className="text-[15px] tracking-[0.08em] text-[#353735]">
                                    {status}
                                </p>

                                {connected && (
                                    <div className="mt-8 border-t border-[#c8c7c1] pt-6">

                                        <div className="flex items-center gap-5">

                                            <div className="flex h-14 w-14 items-center justify-center border border-[#aaa9a3] bg-[#dcdbd5] text-[24px]">
                                                {listening ? "MIC" : "AI"}
                                            </div>

                                            <div>
                                                <p className="text-[9px] tracking-[0.16em] text-[#777872]">
                                                    LIVE SIGNAL
                                                </p>

                                                <p className="mt-2 text-[12px] tracking-[0.1em] text-[#393b38]">
                                                    {listening
                                                        ? "LISTENING..."
                                                        : "AI SPEAKING..."}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Signal bars */}
                                        <div className="mt-7 flex h-8 items-center gap-[4px]">
                                            {[5, 12, 7, 18, 10, 22, 8, 15, 5, 19, 11, 24, 8, 16, 6, 12, 20, 9, 15, 5].map((height, index) => (
                                                <span
                                                    key={index}
                                                    className="w-[2px] bg-[#6d6f69]"
                                                    style={{ height: `${height}px` }}
                                                />
                                            ))}
                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* ================= FOOTER ================= */}
                    <footer className="mt-8 flex items-center justify-between border-t border-[#c9c8c3] pt-5 text-[8px] tracking-[0.14em] text-[#777872]">

                        <p>// SECURE SESSION IN PROGRESS</p>

                        <p>
                            {connected ? "SYSTEM: ONLINE" : "SYSTEM: OFFLINE"}
                        </p>

                    </footer>

                </div>

            </section>

        </main>
    );
}