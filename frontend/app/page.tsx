"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import localFont from "next/font/local";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import SystemBar from "@/components/ui/SystemBar";

const pixelOperator = localFont({
  src: "./fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

export default function Home() {
  const [answer, setAnswer] = useState("")
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const dragStart = useRef({
    mouseX: 0,
    mouseY: 0,
    cardX: 0,
    cardY: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't drag when typing in textarea
    if ((e.target as HTMLElement).closest("textarea")) return;

    setIsDragging(true);

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cardX: cardPosition.x,
      cardY: cardPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const newX =
      dragStart.current.cardX +
      (e.clientX - dragStart.current.mouseX);

    const newY =
      dragStart.current.cardY +
      (e.clientY - dragStart.current.mouseY);

    setCardPosition({
      x: newX,
      y: newY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  return (
    <main
      className={`${pixelOperator.className} min-h-screen bg-[#d8d8d4] p-4 text-[#3f3025] sm:p-6`}
    >
      {/* ================= MAIN RETRO WINDOW ================= */}
      <section id="#home" className="relative min-h-[calc(100vh-32px)] overflow-hidden rounded-[28px] border-[4px] border-[#62452f] bg-[#efe8d8] shadow-[18px_20px_0_rgba(91,61,37,0.85)] sm:min-h-[calc(100vh-48px)]">

        {/* ================= TOP SYSTEM BAR ================= */}
        <SystemBar/>

        {/* ================= BACKGROUND ================= */}
        <div className="pointer-events-none absolute inset-0 top-14 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.55),transparent_35%),radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.35),transparent_25%)]" />

        {/* ================= HEADER ================= */}
        <Header />

        {/* ================= MAIN CONTENT ================= */}
        <div className="relative z-10 grid min-h-[650px] grid-cols-1 items-center gap-12 px-8 pb-20 pt-6 md:grid-cols-[1fr_0.9fr_1fr] md:px-12 lg:min-h-[680px]">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col justify-center">

            <p className="mb-7 text-[11px] tracking-[0.18em] text-[#806754]">
              // WELCOME USER
            </p>

            <h2 className="text-[48px] leading-[1.28] tracking-[0.06em] text-[#493529] sm:text-[56px] lg:text-[62px]">
              PRACTICE
              <br />
              SMARTER.
              <br />
              GET HIRED.
              <br />
              ACE YOUR
              <br />
              NEXT ONE._
            </h2>

            <p className="mt-8 max-w-[430px] text-[14px] leading-7 tracking-[0.04em] text-[#725e4d]">
              AI-powered mock interviews with real-time feedback to help you
              improve your answers and confidence.
            </p>

            {/* ================= THREE INTERVIEW MODES ================= */}
            <div className="mt-9 flex flex-wrap gap-3">

              {/* TEXT TO TEXT */}
              <button
                onClick={() => router.push("/text-practice")}
                className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#f4c97d] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#ffd993]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#684932] bg-[#f8e5bd]">
                  T
                </span>

                <span>
                  TEXT
                  <br />
                  INTERVIEW
                </span>
              </button>


              {/* VOICE TO VOICE */}
              <button
                onClick={() => router.push("/voice-interview")}
                className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#39a38e] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#4bb49e]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#684932] bg-[#d9eee5]">
                  ♫
                </span>

                <span>
                  VOICE
                  <br />
                  INTERVIEW
                </span>
              </button>


              {/* FACE TO FACE */}
              <button
                onClick={() => router.push("/proctored-interview")}
                className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#e98782] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#f09b96]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-[#684932] bg-[#f8d6d2]">
                  ◉
                </span>

                <span>
                  FACE TO
                  <br />
                  FACE
                </span>
              </button>

            </div>
          </div>

          {/* ================= CENTER RETRO COMPUTER ================= */}
          <div className="flex flex-col items-center justify-center">

            <div className="relative w-full max-w-[500px]">

              {/* AMBIENT SHADOW */}
              <div className="pointer-events-none absolute bottom-[9%] left-1/2 h-16 w-[72%] -translate-x-1/2 rounded-full bg-[#684932]/20 blur-2xl" />

              <div className="relative z-10 flex justify-center overflow-hidden">

                <Image src="/LandingPage.jpeg"
                  alt="Retro AI Interview Assistant Computer"
                  width={607}
                  height={677}
                  priority
                  className="
                    h-auto
                    w-full
                    max-w-[440px]
                    object-contain
                    brightness-[1.01]
                    contrast-[0.97]
                  "
                />

                {/* IMAGE BLENDING */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(239,232,216,0.1)_62%,rgba(239,232,216,0.68)_84%,#efe8d8_100%)]
                  "
                />
              </div>
            </div>

            <p className="mt-2 text-[10px] tracking-[0.15em] text-[#806754]">
              SWITCH DAY 'N' NIGHT
            </p>
          </div>

          {/* ================= RIGHT INTERVIEW TERMINAL ================= */}
          <div
            className="relative flex justify-center md:justify-end"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* DRAGGABLE CARD */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                transform: `translate(${cardPosition.x}px, ${cardPosition.y}px)`,
              }}
              className={`
      relative
      w-full
      max-w-[400px]
      select-none
      overflow-hidden
      rounded-lg
      border-2
      border-[#684932]
      bg-[#f3ead9]/75
      shadow-[4px_4px_0_rgba(104,73,50,0.12)]
      transition-transform
      ${isDragging ? "cursor-grabbing transition-none" : "cursor-grab"}
    `}
            >
              {/* TERMINAL HEADER */}
              <div className="flex items-center justify-between border-b-2 border-[#b49a7f] bg-[#f7eddb] px-5 py-4">
                <span className="text-[10px] tracking-[0.16em] text-[#5c4331]">
                  INTERVIEW SESSION
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.12em] text-[#745d4a]">
                    00:00:00
                  </span>

                  <span className="h-2.5 w-2.5 rounded-full border border-[#684932] bg-[#39a38e]" />
                </div>
              </div>

              {/* TERMINAL CONTENT */}
              <div className="min-h-[270px] px-5 py-7">
                <p className="text-[10px] tracking-[0.15em] text-[#806754]">
                  AI INTERVIEWER:
                </p>

                <p className="mt-4 text-[15px] leading-7 tracking-[0.04em] text-[#4a362a]">
                  Tell me about a challenging
                  <br />
                  project you worked on.
                </p>

                <p className="mt-7 text-[10px] tracking-[0.15em] text-[#806754]">
                  YOU:
                </p>

                {/* USER ANSWER AREA */}
                <div className="relative mt-3 min-h-[85px] w-full">

                  {/* DISPLAY LAYER */}
                  <div className="pointer-events-none absolute inset-0 min-h-[85px] whitespace-pre-wrap break-words border-l-[3px] border-[#513b2c] px-3 py-2 text-[13px] leading-6 tracking-[0.04em] text-[#4a362a]">
                    {answer ? (
                      <>
                        {answer}
                        <span className="ml-[2px] inline-block h-[18px] w-[3px] translate-y-[3px] animate-pulse bg-[#513b2c]" />
                      </>
                    ) : (
                      <>
                        <span className="text-[#a48d7c]">
                          Type your answer here...
                        </span>

                        <span className="ml-[3px] inline-block h-[18px] w-[3px] translate-y-[3px] animate-pulse bg-[#513b2c]" />
                      </>
                    )}
                  </div>

                  {/* ACTUAL TEXTAREA */}
                  <textarea
                    name="projectAnswer"
                    id="projectAnswer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="
            relative
            z-10
            min-h-[85px]
            w-full
            resize-none
            border-l-[3px]
            border-transparent
            bg-transparent
            px-3
            py-2
            text-[13px]
            leading-6
            tracking-[0.04em]
            text-transparent
            caret-transparent
            outline-none
            cursor-text
          "
                  />
                </div>

                {/* RETRO SIGNAL */}
                <div className="mt-5 flex h-6 items-center gap-[3px]">
                  {[
                    4, 7, 3, 10, 5, 8, 4, 14, 6, 3,
                    8, 5, 11, 4, 7, 3, 13, 5, 9, 4,
                    6, 3, 8, 5, 11, 4, 7, 3, 9,
                  ].map((height, index) => (
                    <span
                      key={index}
                      className="w-px bg-[#3c9aaa]"
                      style={{
                        height: `${Math.round(height * 0.75)}px`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* TERMINAL STATUS */}
              <div className="border-t-2 border-[#b49a7f] bg-[#f7eddb] px-5 py-4">
                <p className="text-[9px] tracking-[0.14em] text-[#715a47]">
                  STATUS: READY WHEN YOU ARE.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM RETRO DOCK ================= */}
        <Footer />

      </section>
    </main>
  );
}