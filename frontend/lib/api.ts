const API_URL = "http://localhost:8080";

export async function startInterview(
  topic: string,
  difficulty: string
) {
  const response = await fetch(
    `${API_URL}/api/interview/start`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        topic,
        difficulty,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "Backend error:",
      response.status,
      errorText
    );

    throw new Error(
      `Failed to start interview: ${response.status}`
    );
  }

  return response.json();
}

export async function evaluateAnswer(
    question: string,
    answer: string
) {
    const response = await fetch(
        `${API_URL}/api/interview/answer`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                question,
                answer,
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to evaluate answer");
    }

    return response.json();
}

export async function getNextQuestion(
    topic: string,
    difficulty: string
) {
    const response = await fetch(
        `${API_URL}/api/interview/next`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                topic,
                difficulty,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to start interview: ${response.status}`);
    }

    return response.json();
}