export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
};

export const playGeminiAudio = (base64Audio: string, playbackContextRef: {current:AudioContext | null;}, nextAudioTimeRef: {current:number}) => {
    if (!playbackContextRef.current) {
        playbackContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const audioContext = playbackContextRef.current;
    // Base64 → bytes
    const binaryString = atob(base64Audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    // Bytes → PCM16
    const pcm16 = new Int16Array(bytes.buffer);
    // PCM16 → AudioBuffer
    const audioBuffer = audioContext.createBuffer(1, pcm16.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcm16.length; i++) {
        channelData[i] = pcm16[i] / 32768;
    }
    // Create audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    // Prevent gaps between chunks
    const currentTime = audioContext.currentTime;
    const startTime = Math.max(currentTime, nextAudioTimeRef.current);
    source.start(startTime);
    nextAudioTimeRef.current = startTime + audioBuffer.duration;
};