"use client";

import { useState, useEffect } from "react";
import { getNextQuestion } from "@/lib/api";
import { connectWebSocket, sendInterviewMessage, disconnectWebSocket } from "@/lib/websocket";
import InterviewSetup from "@/components/interview/InterviewSetup";
import QuestionDisplay from "@/components/interview/QuestionDisplay";
import AnswerBox from "@/components/interview/AnswerBox";
import { InterviewConfig } from "@/types/interview";

export default function InterviewPage() {

    const [config, setConfig] = useState<InterviewConfig | null>(null);
    const [started, setStarted] = useState(false);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [gettingNext, setGettingNext] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        connectWebSocket((message) => {
            const data = JSON.parse(message);
            console.log("WebSocket response:", data);

            if (data.type === "QUESTION") {
                setQuestion(data.question);
                setLoading(false);
            }

            if (data.type === "EVALUATION") {
                setFeedback(data.feedback);
                setScore(data.score);
                setCorrectAnswer(data.correctAnswer);
                setEvaluating(false);
            }
        });

        return () => {
            disconnectWebSocket();
        };
    }, []);

    const handleStartInterview = (interviewConfig: InterviewConfig) => {
        try {
            setConfig(interviewConfig);
            setStarted(true);
            setLoading(true);

            sendInterviewMessage("QUESTION", {
                topic: interviewConfig.subject,
                difficulty: interviewConfig.difficulty
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSubmitAnswer = () => {
        try {
            setEvaluating(true);

            sendInterviewMessage("ANSWER", {
                question,
                answer
            });
        } catch (error) {
            console.error(error);
            setEvaluating(false);
        }
    };

    const handleNextQuestion = async () => {
        if (!config) return;

        try {
            setGettingNext(true);

            const data = await getNextQuestion(
                config.subject,
                config.difficulty
            );

            setQuestion(data.question);
            setAnswer("");
            setFeedback("");
            setCorrectAnswer("");
            setScore(null);
            setQuestionNumber((previous) => previous + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setGettingNext(false);
        }
    };

    if (!started) {
        return (
            <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
                <div className="mx-auto max-w-4xl">
                    <header className="mb-10">
                        <p className="mb-2 text-sm font-semibold tracking-widest text-indigo-400">
                            AI POWERED INTERVIEW
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight">
                            AI Interview Assistant
                        </h1>
                        <p className="mt-3 text-slate-400">
                            Practice interviews and get instant AI feedback.
                        </p>
                    </header>

                    <InterviewSetup onStart={handleStartInterview} />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
            <div className="mx-auto max-w-4xl">

                <header className="mb-10">
                    <p className="mb-2 text-sm font-semibold tracking-widest text-indigo-400">
                        AI POWERED INTERVIEW
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight">
                        AI Interview Assistant
                    </h1>
                    <p className="mt-3 text-slate-400">
                        {config?.type} · {config?.subject} · {config?.difficulty}
                    </p>
                </header>

                {loading && !question && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center shadow-xl">
                        <p className="text-slate-400">
                            Generating your first question...
                        </p>
                    </div>
                )}

                {question && (
                    <section className="space-y-6">

                        <QuestionDisplay
                            question={question}
                            questionNumber={questionNumber}
                            totalQuestions={config?.questionCount ?? 10}
                        />

                        <AnswerBox
                            answer={answer}
                            onAnswerChange={setAnswer}
                            onSubmit={handleSubmitAnswer}
                            loading={evaluating}
                        />

                        {feedback && (
                            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6">

                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold">
                                        AI
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold tracking-widest text-indigo-400">
                                            AI ANALYSIS
                                        </p>
                                        <h2 className="text-xl font-bold">
                                            Feedback
                                        </h2>
                                    </div>
                                </div>

                                <p className="whitespace-pre-line leading-7 text-slate-300">
                                    {feedback}
                                </p>

                                {score !== null && (
                                    <p className="mt-4 text-lg font-semibold">
                                        Score: {score}/10
                                    </p>
                                )}

                                {correctAnswer && (
                                    <div className="mt-6 border-t border-slate-800 pt-6">
                                        <p className="mb-2 text-xs font-bold tracking-widest text-emerald-400">
                                            IDEAL ANSWER
                                        </p>
                                        <p className="whitespace-pre-line leading-7 text-slate-300">
                                            {correctAnswer}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleNextQuestion}
                                    disabled={gettingNext}
                                    className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {gettingNext ? "Generating..." : "Next Question →"}
                                </button>
                            </div>
                        )}

                    </section>
                )}

            </div>
        </main>
    );
}