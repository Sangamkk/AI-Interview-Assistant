"use client";

import Image from "next/image";
import localFont from "next/font/local";

const pixelOperator = localFont({
  src: "./fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

export default function Home() {
  return (
    <main
      className={`${pixelOperator.className} min-h-screen bg-[#d8d8d4] p-4 text-[#3f3025] sm:p-6`}
    >
      {/* ================= MAIN RETRO WINDOW ================= */}
      <section className="relative min-h-[calc(100vh-32px)] overflow-hidden rounded-[28px] border-[4px] border-[#62452f] bg-[#efe8d8] shadow-[18px_20px_0_rgba(91,61,37,0.85)] sm:min-h-[calc(100vh-48px)]">

        {/* ================= TOP SYSTEM BAR ================= */}
        <div className="relative z-20 flex h-14 items-center justify-between border-b-[4px] border-[#62452f] bg-[#3c9aaa] px-6 text-[#30261f] sm:px-10">
          
          <p className="text-[14px] tracking-[0.08em] sm:text-[17px]">
            AI INTERVIEW ASSISTANT SYSTEM
          </p>

          <div className="hidden items-center gap-5 text-[13px] sm:flex">
            <span>◧</span>
            <span>⌁</span>
            <span>⌕</span>
            <span>SYS 21</span>
          </div>
        </div>

        {/* ================= BACKGROUND ================= */}
        <div className="pointer-events-none absolute inset-0 top-14 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.55),transparent_35%),radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.35),transparent_25%)]" />

        {/* ================= HEADER ================= */}
        <header className="relative z-10 flex items-start justify-between px-7 py-7 md:px-12 md:py-9">

          {/* LOGO */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-[#684932] bg-[#f5e8d1] text-[22px] shadow-[3px_3px_0_rgba(103,73,50,0.25)]">
              &gt;_
            </div>

            <div>
              <h1 className="text-[18px] tracking-[0.15em] text-[#463326]">
                AI INTERVIEW ASSISTANT
              </h1>

              <p className="mt-1 text-[10px] tracking-[0.16em] text-[#806a57]">
                PRACTICE. IMPROVE. SUCCEED.
              </p>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="hidden items-center gap-9 text-[12px] tracking-[0.12em] md:flex">
            <button className="border-b-2 border-[#60432f] pb-1 text-[#473226]">
              HOME
            </button>

            <button className="text-[#765f4d] transition hover:text-[#3e2d23]">
              FEATURES
            </button>

            <button className="text-[#765f4d] transition hover:text-[#3e2d23]">
              ABOUT
            </button>

            <button className="text-[#765f4d] transition hover:text-[#3e2d23]">
              CONTACT
            </button>
          </nav>
        </header>

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
              <button className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#f4c97d] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#ffd993]">
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
              <button className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#39a38e] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#4bb49e]">
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
              <button className="group flex items-center gap-3 rounded-md border-2 border-[#684932] bg-[#e98782] px-5 py-3 text-[12px] tracking-[0.12em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#f09b96]">
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

                <Image
                  src="/LandingPage.jpeg"
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
          <div className="flex justify-center md:justify-end">

            <div className="w-full max-w-[430px] overflow-hidden rounded-xl border-2 border-[#684932] bg-[#f3ead9]/75 shadow-[5px_5px_0_rgba(104,73,50,0.12)]">

              {/* TERMINAL HEADER */}
              <div className="flex items-center justify-between border-b-2 border-[#b49a7f] bg-[#f7eddb] px-7 py-5">

                <span className="text-[12px] tracking-[0.18em] text-[#5c4331]">
                  INTERVIEW SESSION
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] tracking-[0.14em] text-[#745d4a]">
                    00:00:00
                  </span>

                  <span className="h-3 w-3 rounded-full border border-[#684932] bg-[#39a38e]" />
                </div>
              </div>

              {/* TERMINAL CONTENT */}
              <div className="min-h-[320px] px-7 py-10">

                <p className="text-[12px] tracking-[0.16em] text-[#806754]">
                  AI INTERVIEWER:
                </p>

                <p className="mt-5 text-[17px] leading-8 tracking-[0.04em] text-[#4a362a]">
                  Tell me about a challenging
                  <br />
                  project you worked on.
                </p>

                <p className="mt-10 text-[12px] tracking-[0.16em] text-[#806754]">
                  YOU:
                </p>

                {/* CURSOR */}
                <div className="mt-5 h-7 w-[8px] bg-[#513b2c] shadow-[2px_0_0_rgba(81,59,44,0.2)]" />

                {/* RETRO SIGNAL */}
                <div className="mt-16 flex h-8 items-center gap-[3px]">
                  {[
                    4, 7, 3, 10, 5, 8, 4, 14, 6, 3,
                    8, 5, 11, 4, 7, 3, 13, 5, 9, 4,
                    6, 3, 8, 5, 11, 4, 7, 3, 9,
                  ].map((height, index) => (
                    <span
                      key={index}
                      className="w-px bg-[#3c9aaa]"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* TERMINAL STATUS */}
              <div className="border-t-2 border-[#b49a7f] bg-[#f7eddb] px-7 py-5">
                <p className="text-[11px] tracking-[0.16em] text-[#715a47]">
                  STATUS: READY WHEN YOU ARE.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ================= BOTTOM RETRO DOCK ================= */}
        <footer className="relative z-10 mx-8 flex items-center justify-between border-t-2 border-[#bda98f] px-0 py-7 text-[10px] tracking-[0.12em] text-[#735d4b] md:mx-12">

          <p className="hidden leading-5 sm:block">
            // INTERVIEW SYSTEM
            <br />
            READY FOR SESSION
          </p>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border-2 border-[#684932] bg-[#efe2ca] px-4 py-3 shadow-[3px_3px_0_rgba(104,73,50,0.2)]">
            <span className="flex h-8 w-8 items-center justify-center rounded border border-[#684932] bg-[#f4c97d]">
              ✉
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded border border-[#684932] bg-[#39a38e]">
              ♫
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded border border-[#684932] bg-[#e98782]">
              ◉
            </span>

            <span className="flex h-8 w-8 items-center justify-center rounded border border-[#684932] bg-[#3c9aaa]">
              ◎
            </span>
          </div>

          <p className="ml-auto tracking-[0.16em]">
            SYS TIME 09:48 PM
          </p>
        </footer>

      </section>
    </main>
  );
}