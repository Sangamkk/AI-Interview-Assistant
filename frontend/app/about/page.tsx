"use client";

import Link from "next/link";
import localFont from "next/font/local";

const pixelOperator = localFont({
  src: "../fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

export default function AboutPage() {
  return (
    <main
      className={`${pixelOperator.className} min-h-screen bg-[#efe8d8] p-3 text-[#473226] sm:p-5`}
    >
      <section className="relative min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border-2 border-[#b49a7f] bg-[#f7f0e2] shadow-[8px_8px_0_rgba(104,73,50,0.12)]">
        
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(57,163,142,0.1),transparent_28%),radial-gradient(circle_at_20%_75%,rgba(244,201,125,0.14),transparent_30%)]" />

        {/* HEADER */}
        <header className="relative z-10 flex items-center justify-between px-8 py-7 md:px-14 md:py-10">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-[#684932] bg-[#f4c97d] text-[20px]">
              &gt;_
            </div>

            <div>
              <h1 className="text-[16px] tracking-[0.18em]">
                AI INTERVIEW ASSISTANT
              </h1>

              <p className="mt-1 text-[9px] tracking-[0.18em] text-[#806754]">
                ABOUT THE SYSTEM
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] tracking-[0.14em] md:flex">
            <Link href="/" className="text-[#765f4d] hover:text-[#3e2d23]">
              HOME
            </Link>

            <Link href="/features" className="text-[#765f4d] hover:text-[#3e2d23]">
              FEATURES
            </Link>

            <span className="border-b-2 border-[#60432f] pb-1 text-[#473226]">
              ABOUT
            </span>

            <Link href="/contact" className="text-[#765f4d] hover:text-[#3e2d23]">
              CONTACT
            </Link>
          </nav>
        </header>

        {/* CONTENT */}
        <div className="relative z-10 grid gap-16 px-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-14 lg:py-20">
          
          {/* LEFT */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#806754]">
              // ABOUT THE SYSTEM
            </p>

            <h2 className="mt-7 text-[42px] leading-[1.2] tracking-[0.06em] sm:text-[56px]">
              INTERVIEWS ARE
              <br />
              HARD ENOUGH.
              <br />
              PRACTICING
              <br />
              SHOULDN'T BE._
            </h2>

            <p className="mt-8 max-w-[570px] text-[13px] leading-8 tracking-[0.04em] text-[#715a47]">
              AI Interview Assistant is designed to give students and job
              seekers a place to practice before the real interview.
              Choose how you want to practice, answer questions, and build
              confidence one session at a time.
            </p>
          </div>

          {/* RIGHT TERMINAL BOX */}
          <div className="self-center rounded-lg border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.12)]">
            <div className="border-b-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4 text-[10px] tracking-[0.16em]">
              SYSTEM LOG
            </div>

            <div className="space-y-7 px-6 py-8">
              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#806754]">
                  PURPOSE:
                </p>
                <p className="mt-2 text-[13px] leading-6">
                  HELP USERS PRACTICE BEFORE THE REAL INTERVIEW.
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.15em] text-[#806754]">
                  MODES AVAILABLE:
                </p>

                <p className="mt-2 text-[13px] leading-7">
                  01 / TYPE IT.
                  <br />
                  02 / SPEAK IT.
                  <br />
                  03 / FACE IT.
                </p>
              </div>

              <div className="border-l-4 border-[#39a38e] pl-4">
                <p className="text-[11px] tracking-[0.1em]">
                  SYSTEM STATUS: READY FOR PRACTICE
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WHY SECTION */}
        <div className="relative z-10 mx-8 border-t-2 border-[#d4bfa7] px-0 py-14 md:mx-14">
          <p className="text-[10px] tracking-[0.2em] text-[#806754]">
            // WHY WE BUILT THIS
          </p>

          <div className="mt-7 grid gap-10 md:grid-cols-2">
            <p className="text-[22px] leading-9 tracking-[0.05em]">
              A REAL INTERVIEW CAN BE STRESSFUL.
            </p>

            <p className="text-[13px] leading-8 tracking-[0.04em] text-[#715a47]">
              You may know the answer but struggle to explain it.
              You may have the skills but lack confidence.
              Sometimes, you simply need more practice.
              This system gives you space to prepare before the opportunity
              actually matters.
            </p>
          </div>

          <p className="mt-14 text-[17px] tracking-[0.08em]">
            NO PERFECT ANSWERS.
            <br />
            JUST BETTER PREPARATION._
          </p>
        </div>
      </section>
    </main>
  );
}