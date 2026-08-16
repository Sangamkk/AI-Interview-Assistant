"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {

  const router = useRouter();

  return (
    <>
      <style jsx>{`
        .home {
          min-height: 100vh;
          background:
            radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.12), transparent 30%),
            radial-gradient(circle at 15% 80%, rgba(99, 102, 241, 0.08), transparent 25%),
            #020617;
          color: #f8fafc;
          overflow: hidden;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99, 102, 241, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.035) 1px, transparent 1px);
          background-size: 45px 45px;
          pointer-events: none;
        }

        .nav {
          position: relative;
          z-index: 10;
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
          background: rgba(2, 6, 23, 0.75);
          backdrop-filter: blur(14px);
        }

        .brand {
          position: relative;
          letter-spacing: -0.02em;
        }

        .brand::before {
          content: "";
          position: absolute;
          left: -12px;
          top: 3px;
          width: 3px;
          height: 18px;
          background: #6366f1;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.8);
        }

        .hero {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          text-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
        }

        .hero-accent {
          color: #818cf8;
          text-shadow:
            0 0 20px rgba(99, 102, 241, 0.3),
            0 0 50px rgba(99, 102, 241, 0.1);
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #818cf8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .section-label::before {
          content: "";
          width: 24px;
          height: 1px;
          background: #6366f1;
          box-shadow: 0 0 8px rgba(99, 102, 241, 0.8);
        }

        .card {
          position: relative;
          min-height: 410px;
          background:
            linear-gradient(
              145deg,
              rgba(17, 24, 39, 0.98),
              rgba(8, 14, 29, 0.98)
            );
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow:
            0 18px 35px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
          transition:
            transform 0.35s ease,
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        /* Small geometric cut on top-right */

        .card::before {
          content: "";
          position: absolute;
          top: -1px;
          right: -1px;
          width: 42px;
          height: 42px;
          background: #020617;
          clip-path: polygon(100% 0, 100% 100%, 0 0);
          border-left: 1px solid rgba(99, 102, 241, 0.3);
          border-bottom: 1px solid rgba(99, 102, 241, 0.3);
        }

        /* Small geometric cut on bottom-left */

        .card::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: -1px;
          width: 32px;
          height: 32px;
          background: #020617;
          clip-path: polygon(0 0, 100% 100%, 0 100%);
          border-right: 1px solid rgba(99, 102, 241, 0.25);
          border-top: 1px solid rgba(99, 102, 241, 0.25);
        }

        .card:hover {
          transform:
            perspective(1000px)
            rotateX(2deg)
            rotateY(-1.5deg)
            translateY(-7px);

          border-color: rgba(129, 140, 248, 0.55);

          box-shadow:
            0 28px 55px rgba(0, 0, 0, 0.5),
            0 0 28px rgba(99, 102, 241, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }

        .icon {
          position: relative;
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(
              145deg,
              rgba(99, 102, 241, 0.18),
              rgba(30, 41, 59, 0.4)
            );
          border: 1px solid rgba(129, 140, 248, 0.3);
          box-shadow:
            5px 5px 0 rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          clip-path: polygon(
            0 8px,
            8px 0,
            calc(100% - 8px) 0,
            100% 8px,
            100% calc(100% - 8px),
            calc(100% - 8px) 100%,
            8px 100%,
            0 calc(100% - 8px)
          );
          transition: transform 0.3s ease;
        }

        .card:hover .icon {
          transform: translateY(-3px) rotate(-3deg);
        }

        .primary-button {
          position: relative;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: 1px solid rgba(165, 180, 252, 0.35);
          box-shadow:
            0 4px 0 #312e81,
            0 8px 20px rgba(79, 70, 229, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 0 #312e81,
            0 12px 25px rgba(79, 70, 229, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .primary-button:active {
          transform: translateY(2px);
          box-shadow:
            0 2px 0 #312e81,
            0 5px 10px rgba(79, 70, 229, 0.2);
        }

        .proctored {
          border-color: rgba(129, 140, 248, 0.38);
        }

        .advanced {
          border: 1px solid rgba(129, 140, 248, 0.3);
          background: rgba(99, 102, 241, 0.08);
          color: #a5b4fc;
        }

        .feature {
          position: relative;
          padding-left: 18px;
          border-left: 1px solid rgba(99, 102, 241, 0.3);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .feature:hover {
          transform: translateX(4px);
          border-color: #818cf8;
        }

        .orb {
          position: absolute;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(99, 102, 241, 0.08);
          transform: rotate(45deg);
          pointer-events: none;
          animation: float 9s ease-in-out infinite;
        }

        .orb-one {
          top: 190px;
          right: 8%;
        }

        .orb-two {
          bottom: 180px;
          left: 5%;
          width: 90px;
          height: 90px;
          animation-delay: -3s;
        }

        @keyframes float {
          0%, 100% {
            transform: rotate(45deg) translateY(0);
          }

          50% {
            transform: rotate(50deg) translateY(-15px);
          }
        }

        .proctored-line {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(129, 140, 248, 0.8),
            transparent
          );
          opacity: 0.7;
        }
      `}</style>

      <main className="home">

        <div className="hero-grid" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        {/* Navbar */}

        <nav className="nav">

          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

            <div>
              <h1 className="brand text-xl font-bold tracking-tight">
                AI Interview Assistant
              </h1>
            </div>

            <button
              onClick={() => router.push("/voice-interview")}
              className="primary-button px-5 py-2.5 text-sm font-semibold text-white"
            >
              Start Interview
            </button>

          </div>

        </nav>


        {/* Hero */}

        <section className="hero mx-auto max-w-7xl px-6 py-20">

          <div className="max-w-3xl">

            <p className="section-label mb-6">
              AI POWERED INTERVIEW PLATFORM
            </p>

            <h2 className="hero-title text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Practice interviews.
              <br />
              <span className="hero-accent">
                Get better.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Prepare for technical, HR, and behavioral interviews
              with AI-powered conversations, instant feedback, and
              realistic interview environments.
            </p>

          </div>


          {/* Interview Modes */}

          <div className="mt-16">

            <div className="mb-8">
              <p className="section-label">
                CHOOSE YOUR INTERVIEW MODE
              </p>
            </div>


            <div className="grid gap-6 md:grid-cols-3">

              {/* Text Interview */}

              <div className="card group p-7">

                <div className="icon mb-6 text-3xl">
                  💬
                </div>

                <h3 className="text-xl font-bold text-slate-100">
                  Text Interview
                </h3>

                <p className="mt-3 min-h-20 leading-7 text-slate-400">
                  Practice traditional interviews by answering
                  AI-generated questions through text.
                </p>

                <div className="mt-6 space-y-2 text-sm text-slate-400">
                  <p>✓ AI-generated questions</p>
                  <p>✓ Instant answer evaluation</p>
                  <p>✓ Score and ideal answer</p>
                </div>

                <button
                  onClick={() => router.push("/interview")}
                  className="primary-button mt-7 w-full px-5 py-3 font-semibold text-white"
                >
                  Start Text Interview
                </button>

              </div>


              {/* Voice Interview */}

              <div className="card group p-7">

                <div className="icon mb-6 text-3xl">
                  🎙️
                </div>

                <h3 className="text-xl font-bold text-slate-100">
                  Voice Interview
                </h3>

                <p className="mt-3 min-h-20 leading-7 text-slate-400">
                  Have a natural speech-to-speech interview
                  with an AI interviewer in real time.
                </p>

                <div className="mt-6 space-y-2 text-sm text-slate-400">
                  <p>✓ Real-time voice conversation</p>
                  <p>✓ Natural follow-up questions</p>
                  <p>✓ Multiple interview types</p>
                </div>

                <button
                  onClick={() => router.push("/voice-interview")}
                  className="primary-button mt-7 w-full px-5 py-3 font-semibold text-white"
                >
                  Start Voice Interview
                </button>

              </div>


              {/* Proctored Interview */}

              <div className="card proctored group p-7">

                <div className="proctored-line" />

                <div className="icon mb-6 text-3xl">
                  🛡️
                </div>

                <div className="mb-2 flex items-center gap-2">

                  <h3 className="text-xl font-bold text-slate-100">
                    Proctored Interview
                  </h3>

                  <span className="advanced px-2 py-1 text-xs font-semibold">
                    ADVANCED
                  </span>

                </div>

                <p className="mt-3 min-h-20 leading-7 text-slate-400">
                  Experience a realistic interview with voice,
                  camera, screen sharing, and AI-assisted monitoring.
                </p>

                <div className="mt-6 space-y-2 text-sm text-slate-400">
                  <p>✓ Real-time voice interview</p>
                  <p>✓ Camera monitoring</p>
                  <p>✓ Screen sharing</p>
                </div>

                <button
                  onClick={() => router.push("/proctored-interview")}
                  className="primary-button mt-7 w-full px-5 py-3 font-semibold text-white"
                >
                  Start Proctored Interview
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* Features */}

        <section className="relative z-10 border-t border-slate-800 bg-slate-900/40">

          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="grid gap-8 md:grid-cols-3">

              <div className="feature">
                <p className="text-2xl">🤖</p>

                <h3 className="mt-4 font-semibold text-slate-100">
                  AI-Powered
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Questions and feedback adapt to your selected
                  interview type and difficulty.
                </p>
              </div>


              <div className="feature">
                <p className="text-2xl">📊</p>

                <h3 className="mt-4 font-semibold text-slate-100">
                  Instant Feedback
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Understand your strengths, weaknesses, and
                  how your answers can improve.
                </p>
              </div>


              <div className="feature">
                <p className="text-2xl">🎯</p>

                <h3 className="mt-4 font-semibold text-slate-100">
                  Realistic Practice
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Simulate different interview environments
                  before facing the real one.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* Footer */}

        <footer className="relative z-10 border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
          AI Interview Assistant · Practice smarter, interview better.
        </footer>

      </main>
    </>
  );
}