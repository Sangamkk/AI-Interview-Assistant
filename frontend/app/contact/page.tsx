"use client";

import { useState } from "react";
import Link from "next/link";
import localFont from "next/font/local";

const pixelOperator = localFont({
  src: "../fonts/PixelOperatorSC.ttf",
  variable: "--font-pixel-operator",
});

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      name,
      email,
      message,
    });

    alert("MESSAGE TRANSMISSION READY.");
  };

  return (
    <main
      className={`${pixelOperator.className} min-h-screen bg-[#efe8d8] p-3 text-[#473226] sm:p-5`}
    >
      <section className="relative min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border-2 border-[#b49a7f] bg-[#f7f0e2] shadow-[8px_8px_0_rgba(104,73,50,0.12)]">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(233,135,130,0.1),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(57,163,142,0.1),transparent_30%)]" />

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
                COMMUNICATION TERMINAL
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

            <Link href="/about" className="text-[#765f4d] hover:text-[#3e2d23]">
              ABOUT
            </Link>

            <span className="border-b-2 border-[#60432f] pb-1 text-[#473226]">
              CONTACT
            </span>
          </nav>
        </header>

        {/* CONTENT */}
        <div className="relative z-10 grid gap-12 px-8 py-10 md:grid-cols-[0.8fr_1.2fr] md:px-14 lg:py-16">

          {/* LEFT CONTENT */}
          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#806754]">
              // GET IN TOUCH
            </p>

            <h2 className="mt-7 text-[42px] leading-[1.2] tracking-[0.06em] sm:text-[54px]">
              GOT A QUESTION?
              <br />
              SEND A SIGNAL._
            </h2>

            <p className="mt-7 max-w-[430px] text-[13px] leading-8 tracking-[0.04em] text-[#715a47]">
              Have feedback, found a problem, or want to share an idea?
              Send us a message and we'll receive it on the other side
              of the terminal.
            </p>

            {/* STATUS BOX */}
            <div className="mt-12 rounded-md border-2 border-[#684932] bg-[#f3ead9] p-6 shadow-[4px_4px_0_rgba(104,73,50,0.12)]">
              <p className="text-[10px] tracking-[0.18em] text-[#806754]">
                SYSTEM STATUS
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full border border-[#684932] bg-[#39a38e]" />
                <span className="text-[12px] tracking-[0.1em]">
                  ONLINE
                </span>
              </div>

              <div className="mt-7 space-y-3 text-[10px] tracking-[0.12em] text-[#715a47]">
                <p>RESPONSE CHANNEL: EMAIL</p>
                <p>MESSAGE PROTOCOL: OPEN FOR FEEDBACK</p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border-2 border-[#684932] bg-[#f3ead9] shadow-[5px_5px_0_rgba(104,73,50,0.12)]"
          >
            <div className="border-b-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4">
              <span className="text-[11px] tracking-[0.18em]">
                MESSAGE TERMINAL
              </span>
            </div>

            <div className="space-y-7 px-6 py-8">
              
              {/* NAME */}
              <div>
                <label className="text-[10px] tracking-[0.16em] text-[#806754]">
                  YOUR NAME
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  required
                  className="mt-3 w-full border-b-2 border-[#b49a7f] bg-transparent px-1 py-3 text-[14px] tracking-[0.05em] outline-none transition focus:border-[#684932] placeholder:text-[#b29b87]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-[10px] tracking-[0.16em] text-[#806754]">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-3 w-full border-b-2 border-[#b49a7f] bg-transparent px-1 py-3 text-[14px] tracking-[0.05em] outline-none transition focus:border-[#684932] placeholder:text-[#b29b87]"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-[10px] tracking-[0.16em] text-[#806754]">
                  MESSAGE
                </label>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  required
                  className="mt-3 min-h-[150px] w-full resize-none border-2 border-[#b49a7f] bg-[#f8f0e3]/50 p-4 text-[14px] leading-7 tracking-[0.04em] outline-none transition focus:border-[#684932] placeholder:text-[#b29b87]"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="flex items-center gap-3 border-2 border-[#684932] bg-[#f4c97d] px-6 py-4 text-[12px] tracking-[0.16em] shadow-[3px_3px_0_rgba(104,73,50,0.25)] transition hover:-translate-y-1 hover:bg-[#ffd993]"
              >
                <span>&gt;</span>
                SEND MESSAGE
              </button>
            </div>

            <div className="border-t-2 border-[#b49a7f] bg-[#f7eddb] px-6 py-4">
              <p className="text-[9px] tracking-[0.14em] text-[#806754]">
                STATUS: WAITING FOR TRANSMISSION.
              </p>
            </div>
          </form>
        </div>

        <footer className="relative z-10 mx-8 border-t-2 border-[#d4bfa7] py-7 text-center text-[11px] tracking-[0.16em] text-[#715a47] md:mx-14">
          THANKS FOR STOPPING BY._
        </footer>
      </section>
    </main>
  );
}