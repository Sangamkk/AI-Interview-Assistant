"use client";

import { useSystem } from "@/app/context/SystemContext";

export default function SystemInfo() {
  const {
    systemInfoOpen,
    setSystemInfoOpen,
    theme,
    soundEnabled,
  } = useSystem();

  if (!systemInfoOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3b2a20]/40 p-4 backdrop-blur-sm">

      <div className="w-full max-w-[420px] border-2 border-[#684932] bg-[#efe2ca] shadow-[8px_8px_0_rgba(104,73,50,0.25)]">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b-2 border-[#684932] bg-[#f4c97d] px-5 py-4">

          <span className="text-[14px] tracking-[0.12em]">
            SYS 21 INFORMATION
          </span>

          <button
            onClick={() => setSystemInfoOpen(false)}
            className="text-[18px] hover:scale-125"
          >
            ×
          </button>

        </div>

        {/* SYSTEM DATA */}
        <div className="space-y-4 p-6 text-[13px] text-[#4a362a]">

          <div className="flex justify-between">
            <span>VERSION</span>
            <span>AI-ASST v1.0</span>
          </div>

          <div className="flex justify-between">
            <span>THEME MODE</span>
            <span>{theme.toUpperCase()}</span>
          </div>

          <div className="flex justify-between">
            <span>SOUND SYSTEM</span>
            <span>
              {soundEnabled ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>STATUS</span>
            <span className="text-[#39a38e]">
              ● SYSTEM ONLINE
            </span>
          </div>

        </div>

        <div className="border-t-2 border-[#b49a7f] px-5 py-3 text-[10px] tracking-[0.12em] text-[#715a47]">
          ALL SYSTEMS OPERATIONAL
        </div>

      </div>
    </div>
  );
}