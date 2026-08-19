"use client";

import Link from "next/link";
import localFont from "next/font/local";

const pixelOperator = localFont({
  src: "../fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

export default function FeaturesPage() {
  const features = [
    {
      number: "01",
      title: "TEXT INTERVIEW",
      icon: "T",
      color: "bg-[#f4c97d]",
      description:
        "Practice answering interview questions through text. Write your responses and build confidence before the real interview.",
    },
    {
      number: "02",
      title: "VOICE INTERVIEW",
      icon: "♫",
      color: "bg-[#39a38e]",
      description:
        "Practice speaking your answers naturally and experience an interview that feels more like a real conversation.",
    },
    {
      number: "03",
      title: "FACE TO FACE",
      icon: "◉",
      color: "bg-[#e98782]",
      description:
        "Experience a more realistic interview environment and prepare yourself for real-world interview situations.",
    },
    {
      number: "04",
      title: "AI-POWERED PRACTICE",
      icon: "AI",
      color: "bg-[#78a8d8]",
      description:
        "Practice with AI-generated interview sessions designed to help you improve your preparation and confidence.",
    },
  ];

  return (
    <main
      className={`${pixelOperator.className} min-h-screen bg-[#efe8d8] p-3 text-[#473226] sm:p-5`}
    >
      <section className="relative min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border-2 border-[#b49a7f] bg-[#f7f0e2] shadow-[8px_8px_0_rgba(104,73,50,0.12)] sm:min-h-[calc(100vh-40px)]">
        
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.65),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(244,201,125,0.12),transparent_28%)]" />

        {/* HEADER */}
        <header className="relative z-10 flex items-center justify-between px-8 py-7 md:px-14 md:py-10">
          <Link href="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-[#684932] bg-[#f4c97d] text-[20px] shadow-[3px_3px_0_rgba(104,73,50,0.2)]">
              &gt;_
            </div>

            <div>
              <h1 className="text-[16px] tracking-[0.18em]">
                AI INTERVIEW ASSISTANT
              </h1>

              <p className="mt-1 text-[9px] tracking-[0.18em] text-[#806754]">
                SYSTEM FEATURES
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-[11px] tracking-[0.14em] md:flex">
            <Link href="/" className="text-[#765f4d] hover:text-[#3e2d23]">
              HOME
            </Link>

            <span className="border-b-2 border-[#60432f] pb-1 text-[#473226]">
              FEATURES
            </span>

            <Link href="/about" className="text-[#765f4d] hover:text-[#3e2d23]">
              ABOUT
            </Link>

            <Link href="/contact" className="text-[#765f4d] hover:text-[#3e2d23]">
              CONTACT
            </Link>
          </nav>
        </header>

        {/* CONTENT */}
        <div className="relative z-10 px-8 pb-20 pt-8 md:px-14">
          <p className="text-[10px] tracking-[0.2em] text-[#806754]">
            // SYSTEM FEATURES
          </p>

          <h2 className="mt-7 text-[40px] leading-[1.2] tracking-[0.06em] text-[#473226] sm:text-[52px]">
            BUILT TO HELP
            <br />
            YOU INTERVIEW
            <br />
            BETTER._
          </h2>

          <p className="mt-6 max-w-[600px] text-[13px] leading-7 tracking-[0.04em] text-[#715a47]">
            Everything you need to practice, improve, and prepare for
            interviews in a way that feels closer to the real thing.
          </p>

          {/* FEATURE CARDS */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-lg border-2 border-[#684932] bg-[#f3ead9] p-6 shadow-[5px_5px_0_rgba(104,73,50,0.12)] transition duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] tracking-[0.16em] text-[#806754]">
                    {feature.number}
                  </span>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-sm border-2 border-[#684932] ${feature.color} text-[15px] shadow-[2px_2px_0_rgba(104,73,50,0.2)]`}
                  >
                    {feature.icon}
                  </div>
                </div>

                <h3 className="mt-7 text-[18px] tracking-[0.08em]">
                  {feature.title}
                </h3>

                <p className="mt-4 max-w-[420px] text-[12px] leading-6 tracking-[0.04em] text-[#715a47]">
                  {feature.description}
                </p>

                <div className="mt-6 h-[2px] w-full bg-[#d4bfa7]" />
              </div>
            ))}
          </div>

          <div className="mt-16 border-l-4 border-[#39a38e] pl-5">
            <p className="text-[18px] tracking-[0.08em] text-[#473226]">
              PRACTICE MORE.
              <br />
              OVERTHINK LESS.
              <br />
              SHOW UP READY._
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}