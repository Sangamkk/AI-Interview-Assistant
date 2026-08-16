"use client";

import { useRef, useState } from "react";
import { getGeminiToken } from "@/lib/gemini";
import { arrayBufferToBase64, playGeminiAudio} from "@/lib/audio";

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
            const stream = await navigator.mediaDevices .getUserMedia({ audio: true });
            mediaStreamRef.current = stream;
            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;
            const source = audioContext .createMediaStreamSource( stream );
            sourceRef.current = source;

            const processor = audioContext .createScriptProcessor(4096, 1, 1 );
            processorRef.current = processor;
            processor.onaudioprocess = (event) => {
                    const socket = socketRef.current;
                    if ( !socket || socket.readyState !== WebSocket.OPEN) {
                        return;
                    }

                    const input = event.inputBuffer .getChannelData(0);
                    const pcm16 = new Int16Array( input.length );
                    for ( let i = 0; i < input.length; i++ ) {
                        const sample = Math.max( -1, Math.min( 1, input[i] ) );
                        pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
                    }
                    const base64 = arrayBufferToBase64( pcm16.buffer);
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
            processor.connect( audioContext.destination );
            setListening(true);
            console.log(
                "Microphone started"
            );
        } catch (error) {
            console.error(
                "Microphone error:",
                error
            );
            setStatus("Microphone permission denied" );
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
        if ( audioContextRef.current ) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        if ( mediaStreamRef.current ) {
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
                setStatus( "Getting Gemini session..." );
                // Get temporary token
                const token = await getGeminiToken();
                console.log( "Gemini token received" );
                // Create WebSocket
                const socket = new WebSocket( `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${token}` );
                socketRef.current = socket;
                // --------------------------------
                // WebSocket OPEN
                // --------------------------------
                socket.onopen = () => {
                    console.log( "Connected to Gemini Live" );
                    setConnected(true);
                    setStatus( "Connecting to Gemini..." );
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
                    socket.send( JSON.stringify( setupMessage ) );
                    console.log( "Gemini setup sent" );
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
                            setStatus( "Gemini ready" );
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
                            for ( const part of modelTurn.parts ) {
                                if (part.inlineData) {
                                    const audioData = part.inlineData.data;
                                    console.log(
                                        "Gemini audio received"
                                    );
                                    playGeminiAudio( audioData, playbackContextRef, nextAudioTimeRef );
                                }
                            }
                        }
                        // --------------------------------
                        // User transcription
                        // --------------------------------
                        if ( serverContent.inputTranscription) {
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
                        setStatus( "Gemini connection error" );
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
                        setStatus( "Disconnected" );
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
        if ( playbackContextRef.current ) {
            playbackContextRef.current.close();
            playbackContextRef.current = null;
        }
        nextAudioTimeRef.current = 0;
        if ( socketRef.current ) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setConnected(false);
        setListening(false);
        setStatus( "Disconnected" );
    };
    // --------------------------------
    // UI
    // --------------------------------
    return (
        <main
            className=" min-h-screen bg-gray-950 text-white flex items-center justify-center p-6 " >
            <div
                className=" w-full max-w-2xl rounded-2xl bg-gray-900 p-8 shadow-xl " >
                <h1 className=" text-3xl font-bold text-center " > AI Voice Interview </h1>
                <p className=" mt-2 text-center text-gray-400 " > Real-time speech-to-speech technical interview </p>
                <div className=" mt-8 text-center " > 
                    <p className=" text-gray-300 " > Status: {status} </p>
                </div>
                <div className=" mt-8 flex justify-center gap-4 " >
                    {!connected ? (
                        <button onClick={ startVoiceInterview } className=" rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 " >
                            Start Interview
                        </button>
                    ) : (
                        <button onClick={ stopVoiceInterview } className=" rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-700" >
                            End Interview
                        </button>
                    )}
                </div>
                {connected && (
                    <div className=" mt-10 text-center " >
                        <div className=" text-6xl " >
                            {listening ? "🎤" : "🔊"}
                        </div>
                        <p className=" mt-4 text-gray-300 " >
                            {listening ? "Listening..." : "AI is speaking..."}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}