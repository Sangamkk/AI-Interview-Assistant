"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import FakeWaveform from "./FakeWaveform";

type Speaker = "ai" | "user" | "thinking";

export default function RetroComputerInterview() {
  const [speaker, setSpeaker] = useState<Speaker>("ai");

  useEffect(() => {
    const sequence = [
      { speaker: "ai" as Speaker, duration: 5000 },
      { speaker: "user" as Speaker, duration: 5000 },
      { speaker: "thinking" as Speaker, duration: 2500 },
    ];

    let index = 0;

    const runSequence = () => {
      const current = sequence[index];

      setSpeaker(current.speaker);

      setTimeout(() => {
        index = (index + 1) % sequence.length;
        runSequence();
      }, current.duration);
    };

    runSequence();
  }, []);

  const isAI = speaker === "ai";
  const isUser = speaker === "user";

  return (
    <div className="relative w-full max-w-[500px]">

      {/* COMPUTER IMAGE */}
      <Image
        src="/LandingPage.jpeg"
        alt="Retro AI Interview Computer"
        width={607}
        height={677}
        priority
        className="
          relative
          z-10
          h-auto
          w-full
          object-contain
          mix-blend-multiply
          brightness-[1.05]
          contrast-[1.12]
          saturate-[1.12]
          drop-shadow-[0_18px_16px_rgba(70,50,35,0.25)]
        "
      />

      {/* ================= LIVE CRT SCREEN ================= */}
      <div
        className="
          absolute
          z-20
          left-[18%]
          top-[12%]
          h-[42%]
          w-[64%]
          overflow-hidden
          rounded-[12%]
          bg-[#1b1d1c]
          px-[7%]
          py-[8%]
          shadow-inner
        "
      >

        {/* CRT GLOW */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]" />

        {/* SCREEN CONTENT */}
        <div className="relative z-10 flex h-full flex-col">

          {/* TOP DOTS */}
          <div className="flex gap-1">
            <span className="h-[3px] w-[3px] rounded-full bg-[#d8ddd8]" />
            <span className="h-[3px] w-[3px] rounded-full bg-[#d8ddd8]" />
            <span className="h-[3px] w-[3px] rounded-full bg-[#d8ddd8]" />
          </div>

          {/* SPEAKER */}
          <div className="mt-5">

            <p className="text-[7px] tracking-[0.18em] text-[#aeb5af]">
              {isAI
                ? "AI INTERVIEWER"
                : isUser
                ? "YOU"
                : "AI SYSTEM"}
            </p>

            <p
              className={`mt-2 text-[6px] tracking-[0.15em] ${
                isAI
                  ? "text-[#8fcfc4]"
                  : isUser
                  ? "text-[#d8c184]"
                  : "animate-pulse text-[#d8ddd8]"
              }`}
            >
              {isAI
                ? "SPEAKING..."
                : isUser
                ? "LISTENING..."
                : "ANALYZING RESPONSE..."}
            </p>

          </div>

          {/* WAVEFORM */}
          <div className="flex flex-1 items-center justify-center">

            {speaker !== "thinking" ? (
              <FakeWaveform
                active
                variant={isAI ? "ai" : "user"}
              />
            ) : (
              <div className="flex gap-2">
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#d8ddd8]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#d8ddd8] [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[#d8ddd8] [animation-delay:300ms]" />
              </div>
            )}

          </div>

          {/* TEXT / TRANSCRIPT */}
          <div className="border-t border-[#ffffff]/10 pt-2">

            <p className="text-[6px] leading-[1.5] tracking-[0.05em] text-[#d8ddd8]">

              {isAI &&
                "Tell me about a challenging project you worked on."}

              {isUser &&
                "I worked on an AI Interview Assistant that helps users practice interviews."}

              {speaker === "thinking" &&
                "PROCESSING RESPONSE..."}

            </p>

          </div>

          {/* BOTTOM STATUS */}
          <div className="mt-2 flex justify-between text-[5px] tracking-[0.12em] text-[#8f9690]">
            <span>VOICE LINK ACTIVE</span>
            <span>
              {isAI ? "AI-01" : isUser ? "USER" : "..."}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}