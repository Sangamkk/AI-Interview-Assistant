export function startSpeechRecognition(
    onResult: (text: string) => void,
    onEnd: () => void
) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        throw new Error(
            "Speech recognition is not supported in this browser."
        );
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };
    recognition.onend = () => {
        onEnd();
    };
    recognition.start();
    return recognition;
}

