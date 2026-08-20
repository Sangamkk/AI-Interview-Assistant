"use client";

import { useSystem } from "@/app/context/SystemContext";

export default function HelpGuide() {
  const {
    helpOpen,
    setHelpOpen,
  } = useSystem();

  if (!helpOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3b2a20]/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-[520px] border-2 border-[#684932] bg-[#efe2ca] shadow-[8px_8px_0_rgba(104,73,50,0.25)]">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b-2 border-[#684932] bg-[#3c9aaa] px-5 py-4">

          <span className="text-[14px] tracking-[0.12em] text-[#30261f]">
            ⌕ HELP SYSTEM
          </span>

          <button
            onClick={() => setHelpOpen(false)}
            className="text-[18px] transition-transform hover:scale-125"
          >
            ×
          </button>

        </div>

        {/* CONTENT */}
        <div className="space-y-4 p-6 text-[#4a362a]">

          <p className="text-[11px] tracking-[0.14em] text-[#806754]">
            USER GUIDE
          </p>

          <div className="space-y-2 text-[13px] leading-6">

            <p>01. TEXT INTERVIEW</p>
            <p className="pl-4 text-[#735d4b]">
              Practice by typing answers and receive AI feedback.
            </p>

            <p>02. VOICE INTERVIEW</p>
            <p className="pl-4 text-[#735d4b]">
              Answer questions using your microphone.
            </p>

            <p>03. FACE TO FACE</p>
            <p className="pl-4 text-[#735d4b]">
              Practice with camera and microphone interaction.
            </p>

            <p>04. AI FEEDBACK</p>
            <p className="pl-4 text-[#735d4b]">
              Review your answers and identify areas to improve.
            </p>

          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t-2 border-[#b49a7f] px-5 py-3 text-[10px] tracking-[0.12em] text-[#715a47]">
          STATUS: GUIDE SYSTEM READY
        </div>

      </div>
    </div>
  );
}