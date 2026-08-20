"use client";

import { useState, useEffect } from "react";
import { getNextQuestion } from "@/lib/api";
import {
  connectWebSocket,
  sendInterviewMessage,
  disconnectWebSocket,
} from "@/lib/websocket";
import localFont from "next/font/local";

import InterviewSetup from "@/components/interview/InterviewSetup";
import QuestionDisplay from "@/components/interview/QuestionDisplay";
import AnswerBox from "@/components/interview/AnswerBox";
import SystemBar from "@/components/ui/SystemBar";

import { InterviewConfig } from "@/types/interview";

const pixelOperator = localFont({
  src: "../fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

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

  /* ================= WEBSOCKET ================= */

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

  /* ================= START INTERVIEW ================= */

  const handleStartInterview = (
    interviewConfig: InterviewConfig
  ) => {
    try {
      setConfig(interviewConfig);
      setStarted(true);
      setLoading(true);

      sendInterviewMessage("QUESTION", {
        topic: interviewConfig.subject,
        difficulty: interviewConfig.difficulty,
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  /* ================= SUBMIT ANSWER ================= */

  const handleSubmitAnswer = () => {
    if (!answer.trim()) return;

    try {
      setEvaluating(true);

      sendInterviewMessage("ANSWER", {
        question,
        answer,
      });
    } catch (error) {
      console.error(error);
      setEvaluating(false);
    }
  };

  /* ================= NEXT QUESTION ================= */

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

  /* =====================================================
     SETUP SCREEN
  ===================================================== */

  if (!started) {
    return (
      <main className={`${pixelOperator.className} min-h-screen bg-[#d8d8d4] p-3 text-[#3f3025] sm:p-5`}>

        <section className="min-h-[calc(100vh-24px)] overflow-hidden rounded-[24px] border-2 border-[#bda98f] bg-[#efe8d8] shadow-[8px_8px_0_rgba(104,73,50,0.12)] sm:min-h-[calc(100vh-40px)]">

          <SystemBar />

          <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">

            {/* SYSTEM LABEL */}

            <p className="mb-4 text-[11px] tracking-[0.2em] text-[#806754]">
              // TEXT INTERVIEW MODULE
            </p>

            {/* TITLE */}

            <h1 className="text-[38px] leading-tight tracking-[0.06em] text-[#473226] sm:text-[52px]">
              READY FOR
              <br />
              INTERVIEW._
            </h1>

            <p className="mt-5 max-w-xl text-[14px] leading-7 tracking-[0.04em] text-[#806754]">
              Configure your interview session. Choose your subject,
              difficulty and number of questions before entering the
              interview terminal.
            </p>

            {/* SETUP TERMINAL */}

            <div className="mt-10 rounded-xl border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.15)]">

              <div className="flex items-center justify-between border-b-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4">

                <span className="text-[11px] tracking-[0.18em] text-[#5c4331]">
                  SESSION CONFIGURATION
                </span>

                <span className="h-3 w-3 animate-pulse rounded-full border border-[#684932] bg-[#39a38e]" />

              </div>

              <div className="p-6 sm:p-8">
                <InterviewSetup onStart={handleStartInterview} />
              </div>

            </div>

          </div>

        </section>

      </main>
    );
  }

  /* =====================================================
     INTERVIEW SCREEN
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#d8d8d4] p-3 text-[#3f3025] sm:p-5">

      <section className="min-h-[calc(100vh-24px)] overflow-hidden rounded-[24px] border-2 border-[#bda98f] bg-[#efe8d8] shadow-[8px_8px_0_rgba(104,73,50,0.12)] sm:min-h-[calc(100vh-40px)]">

        <SystemBar />

        <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">

          {/* ================= INTERVIEW HEADER ================= */}

          <header className="mb-9 border-b-2 border-[#bda98f] pb-7">

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

              <div>

                <p className="mb-3 text-[11px] tracking-[0.2em] text-[#806754]">
                  // ACTIVE INTERVIEW SESSION
                </p>

                <h1 className="text-[36px] tracking-[0.06em] text-[#473226] sm:text-[48px]">
                  INTERVIEW._
                </h1>

                <p className="mt-3 text-[12px] tracking-[0.12em] text-[#806754]">
                  {config?.type} / {config?.subject} / {config?.difficulty}
                </p>

              </div>

              {/* QUESTION COUNTER */}

              <div className="border-2 border-[#684932] bg-[#f7eddb] px-5 py-3 text-center shadow-[3px_3px_0_rgba(104,73,50,0.12)]">

                <p className="text-[9px] tracking-[0.16em] text-[#806754]">
                  QUESTION
                </p>

                <p className="mt-1 text-[20px] tracking-[0.08em] text-[#473226]">
                  {questionNumber}
                  <span className="text-[12px] text-[#947a64]">
                    {" "}
                    / {config?.questionCount ?? 10}
                  </span>
                </p>

              </div>

            </div>

          </header>

          {/* ================= LOADING ================= */}

          {loading && !question && (
            <div className="rounded-lg border-2 border-[#684932] bg-[#f3ead9] p-8 text-center shadow-[4px_4px_0_rgba(104,73,50,0.12)]">

              <p className="animate-pulse text-[13px] tracking-[0.15em] text-[#806754]">
                // GENERATING FIRST QUESTION...
              </p>

              <div className="mx-auto mt-5 flex h-5 justify-center gap-[4px]">

                {[8, 14, 5, 18, 10, 15, 7, 12, 5].map(
                  (height, index) => (
                    <span
                      key={index}
                      className="w-[3px] animate-pulse bg-[#3c9aaa]"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * 0.1}s`,
                      }}
                    />
                  )
                )}

              </div>

            </div>
          )}

          {/* ================= QUESTION AREA ================= */}

          {question && (
            <section className="space-y-6">

              <div className="rounded-xl border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.12)]">

                <div className="flex items-center justify-between border-b-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4">

                  <span className="text-[10px] tracking-[0.18em] text-[#5c4331]">
                    AI INTERVIEWER
                  </span>

                  <span className="flex items-center gap-2 text-[9px] tracking-[0.12em] text-[#806754]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#39a38e]" />
                    ONLINE
                  </span>

                </div>

                <div className="p-6 sm:p-8">

                  <QuestionDisplay
                    question={question}
                    questionNumber={questionNumber}
                    totalQuestions={
                      config?.questionCount ?? 10
                    }
                  />

                </div>

              </div>

              {/* ================= ANSWER AREA ================= */}

              <div className="rounded-xl border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.12)]">

                <div className="border-b-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4">

                  <span className="text-[10px] tracking-[0.18em] text-[#5c4331]">
                    YOUR RESPONSE
                  </span>

                </div>

                <div className="p-6 sm:p-8">

                  <AnswerBox
                    answer={answer}
                    onAnswerChange={setAnswer}
                    onSubmit={handleSubmitAnswer}
                    loading={evaluating}
                  />

                </div>

              </div>

              {/* ================= AI FEEDBACK ================= */}

              {feedback && (
                <div className="rounded-xl border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.12)]">

                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b-2 border-[#b49a7f] bg-[#3c9aaa] px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center border-2 border-[#62452f] bg-[#f4c97d] text-[10px] font-bold">
                        AI
                      </div>

                      <div>

                        <p className="text-[10px] tracking-[0.18em] text-[#473226]">
                          ANALYSIS COMPLETE
                        </p>

                        <h2 className="mt-1 text-[17px] tracking-[0.05em] text-[#30261f]">
                          FEEDBACK REPORT
                        </h2>

                      </div>

                    </div>

                    {score !== null && (
                      <div className="border-2 border-[#62452f] bg-[#f4c97d] px-4 py-2 text-center">

                        <p className="text-[8px] tracking-[0.14em]">
                          SCORE
                        </p>

                        <p className="text-[18px]">
                          {score}/10
                        </p>

                      </div>
                    )}

                  </div>

                  {/* CONTENT */}

                  <div className="p-6 sm:p-8">

                    <p className="whitespace-pre-line text-[14px] leading-7 tracking-[0.03em] text-[#5c4331]">
                      {feedback}
                    </p>

                    {/* IDEAL ANSWER */}

                    {correctAnswer && (
                      <div className="mt-7 border-l-[4px] border-[#39a38e] bg-[#efe2ca] px-5 py-5">

                        <p className="mb-3 text-[10px] tracking-[0.18em] text-[#247565]">
                          IDEAL RESPONSE
                        </p>

                        <p className="whitespace-pre-line text-[14px] leading-7 text-[#5c4331]">
                          {correctAnswer}
                        </p>

                      </div>
                    )}

                    {/* NEXT BUTTON */}

                    <button
                      onClick={handleNextQuestion}
                      disabled={gettingNext}
                      className="mt-8 border-2 border-[#684932] bg-[#f4c97d] px-6 py-4 text-[11px] tracking-[0.15em] text-[#473226] shadow-[4px_4px_0_rgba(104,73,50,0.2)] transition hover:-translate-y-1 hover:bg-[#ffd993] active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {gettingNext
                        ? "// GENERATING..."
                        : "NEXT QUESTION →"}
                    </button>

                  </div>

                </div>
              )}

            </section>
          )}

        </div>

      </section>

    </main>
  );
}