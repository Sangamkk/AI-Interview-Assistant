    export const getGeminiToken = async () => {
        const response = await fetch( "http://localhost:8080/api/voice/session",
            {
                method: "POST"
            }
        );
        if (!response.ok) {
            throw new Error(
                "Failed to create Gemini session"
            );
        }
        const data = await response.json();
        return data.name;
    };

