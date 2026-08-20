"use client";

import { useRef, useState, useEffect } from "react";
import { getGeminiToken } from "@/lib/gemini";
import { arrayBufferToBase64, playGeminiAudio } from "@/lib/audio";
import localFont from "next/font/local";
import Image from "next/image";
import SystemBar from "@/components/ui/SystemBar";


const pixelOperator = localFont({
    src: "../fonts/PixelOperatorSC.ttf",
    variable: "--font-pixel-operator",
});

export default function VoiceInterviewPage() {

    const [connected, setConnected] = useState(false);
    const [listening, setListening] = useState(false);
    const [status, setStatus] = useState("Not connected");

    const socketRef = useRef<WebSocket | null>(null);//webSocket connection
    const mediaStreamRef = useRef<MediaStream | null>(null);//microphone connection
    const audioContextRef = useRef<AudioContext | null>(null);//Audio Content
    const processorRef = useRef<ScriptProcessorNode | null>(null);//Stores the processed Audio
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);//Stores the connection between microphone-Audio-processing
    const playbackContextRef = useRef<AudioContext | null>(null);//gemini response
    const nextAudioTimeRef = useRef(0);//next Gemini audio chunk

    // --------------------------------
    // Start microphone
    // --------------------------------

    const startMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;

            const processor = audioContext.createScriptProcessor(4096, 1, 1);
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
                // Gemini Live audio message
                socket.send(
                    JSON.stringify({
                        realtimeInput: {
                            audio: {
                                data: base64,
                                mimeType:
                                    "audio/pcm;rate=16000"
                            }
                        }
                    })
                );
            };
            source.connect(processor);
            processor.connect(audioContext.destination);
            setListening(true);
            console.log(
                "Microphone started"
            );
        } catch (error) {
            console.error(
                "Microphone error:",
                error
            );
            setStatus("Microphone permission denied");
        }
    };


    // --------------------------------
    // Stop microphone
    // --------------------------------

    const stopMicrophone = () => {
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
                .forEach(
                    (track) => {
                        track.stop();
                    }
                );
            mediaStreamRef.current = null;
        }
        setListening(false);
        console.log(
            "Microphone stopped"
        );
    };
    // --------------------------------
    // Start voice interview
    // --------------------------------
    const startVoiceInterview = async () => {
        try {
            setStatus("Getting Gemini session...");
            // Get temporary token
            const token = await getGeminiToken();
            console.log("Gemini token received");
            // Create WebSocket
            const socket = new WebSocket(`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${token}`);
            socketRef.current = socket;
            // --------------------------------
            // WebSocket OPEN
            // --------------------------------
            socket.onopen = () => {
                console.log("Connected to Gemini Live");
                setConnected(true);
                setStatus("Connecting to Gemini...");
                // Gemini setup message
                const setupMessage = {
                    setup: {
                        model: "models/gemini-3.1-flash-live-preview",
                        generationConfig: { responseModalities: ["AUDIO"] },
                        systemInstruction: {
                            parts: [{
                                text: `
                                            You are a professional technical interviewer.
                                            Conduct a realistic hr interview.
                                            Start by greeting the candidate
                                            and asking the first question.
                                            Ask only one question at a time.
                                            Wait for the candidate's answer.
                                            Listen carefully to the answer.
                                            Evaluate the answer internally.
                                            Then ask a relevant follow-up question.
                                            The interview topic is specified by user.
                                            The difficulty level is hard.
                                            Keep your responses concise and conversational.
                                            Speak naturally like a human interviewer.`
                            }
                            ]
                        }
                    }
                };
                socket.send(JSON.stringify(setupMessage));
                console.log("Gemini setup sent");
            };
            // --------------------------------
            // Messages from Gemini
            // --------------------------------
            socket.onmessage = async (event) => {
                try {
                    let messageText: string;
                    // Gemini response arrived as Blob
                    if (event.data instanceof Blob) {
                        messageText = await event.data.text();
                    }
                    // Gemini response arrived as normal text
                    else if (
                        typeof event.data === "string"
                    ) {
                        messageText = event.data;
                    }
                    else {
                        console.log(
                            "Unknown Gemini message:",
                            event.data
                        );
                        return;
                    }
                    console.log(
                        "Gemini raw message:",
                        messageText
                    );
                    const data = JSON.parse(messageText);
                    console.log(
                        "Gemini JSON:",
                        data
                    );
                    // --------------------------------
                    // Setup completed
                    // --------------------------------
                    if (data.setupComplete) {
                        console.log(
                            "Gemini setup complete"
                        );
                        setStatus("Gemini ready");
                        // NOW request microphone permission
                        await startMicrophone();
                        return;
                    }
                    // --------------------------------
                    // Server content
                    // --------------------------------
                    const serverContent = data.serverContent;
                    if (!serverContent) {
                        return;
                    }
                    // --------------------------------
                    // Gemini audio response
                    // --------------------------------
                    const modelTurn = serverContent.modelTurn;
                    if (modelTurn?.parts) {
                        for (const part of modelTurn.parts) {
                            if (part.inlineData) {
                                const audioData = part.inlineData.data;
                                console.log(
                                    "Gemini audio received"
                                );
                                playGeminiAudio(audioData, playbackContextRef, nextAudioTimeRef);
                            }
                        }
                    }
                    // --------------------------------
                    // User transcription
                    // --------------------------------
                    if (serverContent.inputTranscription) {
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
                    if (
                        serverContent.outputTranscription
                    ) {
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
                setStatus("Gemini connection error");
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
                stopMicrophone();
                setConnected(false);
                setListening(false);
                setStatus("Disconnected");
            };
        } catch (error) {
            console.error(
                "Voice interview error:",
                error
            );
            setStatus(
                "Failed to connect"
            );
        }
    };


    // --------------------------------
    // Stop interview
    // --------------------------------
    const stopVoiceInterview = () => {
        stopMicrophone();
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
        setStatus("Disconnected");
    };
    // --------------------------------
    // UI
    // --------------------------------

    const [demoSpeaker, setDemoSpeaker] = useState<"ai" | "user">("ai");

    const [waveLevels, setWaveLevels] = useState<number[]>(
        Array.from({ length: 32 }, () => 15)
    );

    /* ================= FAKE SPEAKER SWITCH ================= */

    useEffect(() => {
        if (!connected) {
            setDemoSpeaker("ai");
            return;
        }

        const speakerInterval = setInterval(() => {
            setDemoSpeaker((previous) =>
                previous === "ai" ? "user" : "ai"
            );
        }, 4500);

        return () => clearInterval(speakerInterval);
    }, [connected]);


    /* ================= FAKE LIVE WAVEFORM ================= */

    useEffect(() => {
        if (!connected) {
            setWaveLevels(Array.from({ length: 32 }, () => 4));
            return;
        }

        const waveInterval = setInterval(() => {
            setWaveLevels(
                Array.from({ length: 32 }, (_, index) => {
                    const centerBoost =
                        Math.sin((index / 31) * Math.PI) * 32;

                    const randomBoost =
                        Math.random() * 28;

                    return Math.max(
                        5,
                        Math.round(centerBoost + randomBoost)
                    );
                })
            );
        }, 140);

        return () => clearInterval(waveInterval);
    }, [connected, demoSpeaker]);
    return (
        <main
            className={`${pixelOperator.className} min-h-screen bg-[#d8d8d4] p-3 text-[#3f3025] sm:p-5`}
        >
            <section className="min-h-[calc(100vh-24px)] overflow-hidden rounded-[24px] border-2 border-[#bda98f] bg-[#efe8d8] shadow-[8px_8px_0_rgba(104,73,50,0.12)] sm:min-h-[calc(100vh-40px)]">

                {/* ================= SYSTEM BAR ================= */}
                <SystemBar />

                {/* ================= PAGE ================= */}
                <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-6xl items-center justify-center px-6 py-10 sm:px-10">

                    {/* BACKGROUND LIGHT */}
                    <div className="pointer-events-none absolute left-[10%] top-[20%] h-44 w-44 rounded-full bg-[#f4c97d]/20 blur-3xl" />

                    <div className="pointer-events-none absolute bottom-[15%] right-[10%] h-52 w-52 rounded-full bg-[#3c9aaa]/15 blur-3xl" />


                    <div className="relative z-10 grid w-full items-center gap-12 lg:grid-cols-[0.85fr_1.3fr_0.85fr]">

                        {/* ================================================= */}
                        {/* LEFT INFORMATION */}
                        {/* ================================================= */}

                        <div className="order-2 lg:order-1">

                            <p className="text-[10px] tracking-[0.2em] text-[#806754]">
              // VOICE COMMUNICATION MODULE
                            </p>

                            <h1 className="mt-5 text-[32px] leading-[1.3] tracking-[0.1em] text-[#473226] sm:text-[40px]">
                                SPEAK.
                                <br />
                                LISTEN.
                                <br />
                                RESPOND._
                            </h1>

                            <div className="mt-8 border-l-[3px] border-[#3c9aaa] pl-4">

                                <p className="text-[10px] tracking-[0.16em] text-[#806754]">
                                    REAL-TIME AI INTERVIEW
                                </p>

                                <p className="mt-3 text-[13px] leading-7 tracking-[0.04em] text-[#725e4d]">
                                    Speak naturally with your AI interviewer.
                                    Watch the live signal as the conversation
                                    moves between interviewer and candidate.
                                </p>

                            </div>

                            {/* CURRENT STATUS */}

                            <div className="mt-9 border border-[#b49a7f] bg-[#f7eddb]/70 p-4">

                                <p className="text-[9px] tracking-[0.16em] text-[#806754]">
                                    SYSTEM STATUS
                                </p>

                                <div className="mt-3 flex items-center gap-3">

                                    <span
                                        className={`h-3 w-3 rounded-full border border-[#684932] ${connected
                                            ? "animate-pulse bg-[#39a38e]"
                                            : "bg-[#e98782]"
                                            }`}
                                    />

                                    <p className="text-[11px] tracking-[0.12em] text-[#4a362a]">
                                        {connected
                                            ? demoSpeaker === "ai"
                                                ? "AI SIGNAL ACTIVE"
                                                : "USER SIGNAL ACTIVE"
                                            : "SYSTEM STANDBY"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* CENTER RETRO COMPUTER */}
                        {/* ================================================= */}

                        <div className="order-1 flex flex-col items-center lg:order-2">

                            <div className="relative w-full max-w-[470px]">

                                {/* GROUND SHADOW */}
                                <div className="pointer-events-none absolute bottom-[3%] left-1/2 z-0 h-14 w-[72%] -translate-x-1/2 rounded-full bg-[#684932]/20 blur-2xl" />

                                {/* COMPUTER */}
                                <div className="relative z-10 w-full">

                                    <Image
                                        src="/image_cleanup.png"
                                        alt="Retro AI Interview Computer"
                                        className="block h-auto w-full"
                                        width={400}
                                        height={400}
                                    />

                                    {/* CRT SCREEN CONTENT */}
                                    <div className=" absolute left-[20%] top-[15%] z-20 h-[43%] w-[55%] overflow-hidden rounded-[24px] "
                                    >
                                        {/* CRT DARK TINT */}
                                        <div className="pointer-events-none absolute inset-0 bg-[#171918]/10" />
                                        {/* CRT GLOW */}
                                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_65%)]" />
                                        {/* SCREEN CONTENT */}
                                        <div className="relative z-10 flex h-full flex-col justify-between p-[8%]">
                                            {/* TOP DOTS */}
                                            <div className="flex gap-1.5">
                                                <span className="h-1 w-1 rounded-full bg-[#d5d2ca]/80" />
                                                <span className="h-1 w-1 rounded-full bg-[#d5d2ca]/60" />
                                                <span className="h-1 w-1 rounded-full bg-[#d5d2ca]/40" />
                                            </div>

                                            {/* ACTIVE SPEAKER */}
                                            <div className="mt-auto">

                                                <p
                                                    className={`text-[7px] tracking-[0.16em] sm:text-[9px] ${!connected
                                                        ? "text-[#777872]"
                                                        : demoSpeaker === "ai"
                                                            ? "text-[#3c9aaa]"
                                                            : "text-[#f4c97d]"
                                                        }`}
                                                >
                                                    {!connected
                                                        ? "SYSTEM STANDBY"
                                                        : demoSpeaker === "ai"
                                                            ? "AI INTERVIEWER"
                                                            : "USER SPEAKING"}
                                                </p>

                                                {/* WAVEFORM */}
                                                <div className="mt-[8%] flex h-[30%] items-center justify-center gap-[2px] sm:gap-[3px]">

                                                    {waveLevels.map((height, index) => (
                                                        <span
                                                            key={index}
                                                            className={`w-[2px] rounded-full sm:w-[3px] ${!connected
                                                                ? "bg-[#555652]"
                                                                : demoSpeaker === "ai"
                                                                    ? "bg-[#3c9aaa]"
                                                                    : "bg-[#f4c97d]"
                                                                }`}
                                                            style={{
                                                                height: `${connected
                                                                    ? Math.max(4, height * 0.7)
                                                                    : index % 4 === 0
                                                                        ? 9
                                                                        : 3
                                                                    }px`,
                                                            }}
                                                        />
                                                    ))}

                                                </div>

                                                {/* STATUS */}
                                                <div className="mt-[6%] flex items-center justify-between">

                                                    <p className="text-[7px] tracking-[0.12em] text-[#d8d5cc] sm:text-[9px]">
                                                        {connected
                                                            ? demoSpeaker === "ai"
                                                                ? "AI ACTIVE"
                                                                : "USER ACTIVE"
                                                            : "WAITING"}
                                                    </p>

                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${connected
                                                            ? demoSpeaker === "ai"
                                                                ? "animate-pulse bg-[#3c9aaa]"
                                                                : "animate-pulse bg-[#f4c97d]"
                                                            : "bg-[#555652]"
                                                            }`}
                                                    />

                                                </div>
                                            </div>

                                            {/* SCREEN FOOTER */}
                                            <div className="flex items-end justify-between">

                                                <p className="text-[5px] tracking-[0.1em] text-[#888984] sm:text-[7px]">
                                                    {connected
                                                        ? demoSpeaker === "ai"
                                                            ? "VOICE OUTPUT..."
                                                            : "VOICE INPUT..."
                                                        : "WAITING..."}
                                                </p>

                                                <p className="text-[5px] tracking-[0.1em] text-[#aaa9a3] sm:text-[7px]">
                                                    &gt;&gt; V1.0
                                                </p>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-5 text-[9px] tracking-[0.16em] text-[#806754]">
                                LIVE CONVERSATION SIGNAL
                            </p>

                        </div>


                        {/* ================================================= */}
                        {/* RIGHT CONTROL PANEL */}
                        {/* ================================================= */}

                        <div className="order-3">

                            <div className="border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.16)]">

                                {/* PANEL HEADER */}

                                <div className="border-b-2 border-[#b49a7f] bg-[#f7eddb] px-5 py-4">

                                    <p className="text-[9px] tracking-[0.18em] text-[#806754]">
                                        SESSION CONTROL
                                    </p>

                                    <p className="mt-2 text-[17px] tracking-[0.1em] text-[#473226]">
                                        VOICE CHANNEL._
                                    </p>

                                </div>


                                {/* PANEL CONTENT */}

                                <div className="p-5">

                                    <div className="border-l-[3px] border-[#684932] pl-4">

                                        <p className="text-[9px] tracking-[0.16em] text-[#806754]">
                                            CURRENT STATE
                                        </p>

                                        <p className="mt-3 text-[13px] tracking-[0.08em] text-[#4a362a]">
                                            {!connected
                                                ? "READY TO CONNECT"
                                                : demoSpeaker === "ai"
                                                    ? "AI IS SPEAKING"
                                                    : "YOUR TURN TO SPEAK"}
                                        </p>

                                    </div>


                                    {/* SMALL WAVE */}

                                    <div className="mt-7 flex h-10 items-center gap-[3px]">

                                        {waveLevels.slice(0, 20).map((height, index) => (
                                            <span
                                                key={index}
                                                className={`w-[2px] transition-all duration-150 ${connected
                                                    ? demoSpeaker === "ai"
                                                        ? "bg-[#3c9aaa]"
                                                        : "bg-[#f4c97d]"
                                                    : "bg-[#b49a7f]"
                                                    }`}
                                                style={{
                                                    height: `${connected
                                                        ? Math.max(4, Math.round(height * 0.55))
                                                        : 4
                                                        }px`,
                                                }}
                                            />
                                        ))}

                                    </div>


                                    {/* STATUS */}

                                    <div className="mt-8 border-t border-[#b49a7f] pt-5">

                                        <p className="text-[9px] tracking-[0.16em] text-[#806754]">
                                            SYSTEM MESSAGE
                                        </p>

                                        <p className="mt-3 text-[11px] leading-6 tracking-[0.06em] text-[#4a362a]">
                                            {status.toUpperCase()}
                                        </p>

                                    </div>


                                    {/* BUTTON */}

                                    <div className="mt-8">

                                        {!connected ? (

                                            <button
                                                onClick={startVoiceInterview}
                                                className="
                        w-full
                        border-2
                        border-[#684932]
                        bg-[#f4c97d]
                        px-5
                        py-4
                        text-[11px]
                        tracking-[0.16em]
                        text-[#473226]
                        shadow-[4px_4px_0_rgba(104,73,50,0.22)]
                        transition-all
                        hover:-translate-y-1
                        hover:bg-[#ffd993]
                        active:translate-y-0
                        active:shadow-none
                      "
                                            >
                                                &gt; START SESSION
                                            </button>

                                        ) : (

                                            <button
                                                onClick={stopVoiceInterview}
                                                className="
                        w-full
                        border-2
                        border-[#684932]
                        bg-[#e98782]
                        px-5
                        py-4
                        text-[11px]
                        tracking-[0.16em]
                        text-[#473226]
                        shadow-[4px_4px_0_rgba(104,73,50,0.22)]
                        transition-all
                        hover:-translate-y-1
                        hover:bg-[#f09b96]
                        active:translate-y-0
                        active:shadow-none
                      "
                                            >
                                                ■ END SESSION
                                            </button>

                                        )}

                                    </div>

                                </div>


                                {/* PANEL FOOTER */}

                                <div className="border-t-2 border-[#b49a7f] bg-[#f7eddb] px-5 py-4">

                                    <div className="flex justify-between text-[8px] tracking-[0.14em] text-[#806754]">

                                        <span>INPUT: MIC</span>

                                        <span>OUTPUT: AI</span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </main>
    );
}