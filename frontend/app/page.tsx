import RetroComputer from "@/components/ui/RetroComputer";
import InterviewPanel from "@/components/ui/InterviewPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl border border-ink/15 rounded-[28px] bg-paper px-6 py-6 sm:px-10 sm:py-8">
        {/* NAVBAR */}
        <nav className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 border border-ink rounded-lg flex items-center justify-center text-sm">
              &gt;_
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide leading-none">
                AI INTERVIEW ASSISTANT
              </p>
              <p className="text-[11px] text-ink/50 tracking-wide mt-1">
                PRACTICE. IMPROVE. SUCCEED.
              </p>
            </div>
          </div>

          <ul className="flex items-center gap-8 text-xs tracking-wide">
            <li className="relative pb-1">
              HOME
              <span className="absolute left-0 -bottom-0.5 w-full h-[1.5px] bg-ink" />
            </li>
            <li className="text-ink/60">FEATURES</li>
            <li className="text-ink/60">ABOUT</li>
            <li className="text-ink/60">CONTACT</li>
          </ul>
        </nav>

        {/* HERO */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          {/* left copy */}
          <div>
            <p className="text-xs tracking-wide text-ink/50 mb-4">// WELCOME</p>

            <h1 className="text-4xl sm:text-5xl font-bold leading-[1.15] tracking-tight">
              PRACTICE SMARTER.
              <br />
              GET HIRED.
              <br />
              ACE YOUR NEXT ONE.
              <span className="align-baseline">_</span>
            </h1>

            <p className="mt-6 text-sm text-ink/70 leading-relaxed max-w-sm">
              AI-powered mock interviews with real-time feedback to help you
              improve your answers and confidence.
            </p>

            <button className="mt-8 border border-ink rounded-xl px-6 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors">
              &gt; START INTERVIEW
            </button>
          </div>

          {/* center illustration */}
          <div className="flex flex-col items-center gap-2">
            <RetroComputer />
            <p className="text-[11px] text-ink/50 tracking-wide">
              Switch Day &apos;N&apos; Night
            </p>
          </div>

          {/* right panel */}
          <div className="flex justify-center lg:justify-end">
            <InterviewPanel />
          </div>
        </section>

        {/* FOOTER BAR */}
        <footer className="mt-16 pt-6 border-t border-ink/15 flex flex-wrap items-center justify-between gap-4 text-[11px] text-ink/50 tracking-wide">
          <p className="max-w-xs leading-relaxed">
            // Positioned at the axis
            <br />
            and content across files
          </p>
          <p>Scroll Down ▾</p>
          <p>09 : 48 pm</p>
        </footer>
      </div>
    </main>
  );
}
