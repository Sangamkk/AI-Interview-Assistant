"use client";

import { useState } from "react";

export default function SystemBar() {
  const [theme, setTheme] = useState("DEFAULT");
  const [sound, setSound] = useState("MED");

  const cycleTheme = () => {
    const themes = ["DEFAULT", "LIGHT", "DARK"];
    const currentIndex = themes.indexOf(theme);

    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  const cycleSound = () => {
    const levels = ["MUTE", "LOW", "MED", "HIGH"];
    const currentIndex = levels.indexOf(sound);

    setSound(levels[(currentIndex + 1) % levels.length]);
  };

  const handleSearch = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const showSystemInfo = () => {
    alert(
      `AI INTERVIEW ASSISTANT SYSTEM
VERSION: 1.0
THEME: ${theme}
SOUND: ${sound}
STATUS: ONLINE`
    );
  };

  return (
    <div className="relative z-20 flex h-14 items-center justify-between border-b-[4px] border-[#62452f] bg-[#3c9aaa] px-6 text-[#30261f] sm:px-10">

      {/* SYSTEM NAME */}
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full border border-[#30261f] bg-[#f4c97d]" />

        <p className="text-[14px] tracking-[0.08em] sm:text-[17px]">
          AI INTERVIEW ASSISTANT SYSTEM
        </p>
      </div>

      {/* SYSTEM CONTROLS */}
      <div className="hidden items-center gap-2 text-[13px] sm:flex">

        {/* THEME SWITCHER */}
        <button
          onClick={cycleTheme}
          title={`Theme: ${theme}`}
          className="flex h-9 items-center gap-2 border-2 border-[#62452f] bg-[#efe2ca] px-3 transition hover:-translate-y-[2px] hover:bg-[#f4c97d] active:translate-y-0"
        >
          <span className="text-[16px]">◧</span>

          <span className="text-[9px] tracking-[0.1em]">
            {theme}
          </span>
        </button>

        {/* SOUND CONTROL */}
        <button
          onClick={cycleSound}
          title={`Sound: ${sound}`}
          className="flex h-9 items-center gap-2 border-2 border-[#62452f] bg-[#efe2ca] px-3 transition hover:-translate-y-[2px] hover:bg-[#f4c97d] active:translate-y-0"
        >
          <span
            className={`text-[17px] ${
              sound !== "MUTE" ? "animate-pulse" : ""
            }`}
          >
            ⌁
          </span>

          <span className="text-[9px] tracking-[0.1em]">
            {sound}
          </span>
        </button>

        {/* QUICK NAVIGATION */}
        <button
          onClick={handleSearch}
          title="Quick Navigation"
          className="flex h-9 w-10 items-center justify-center border-2 border-[#62452f] bg-[#efe2ca] text-[18px] transition hover:-translate-y-[2px] hover:bg-[#f4c97d] active:translate-y-0"
        >
          ⌕
        </button>

        {/* SYSTEM INFO */}
        <button
          onClick={showSystemInfo}
          title="System Information"
          className="ml-2 border-l-2 border-[#62452f] pl-4 text-[10px] tracking-[0.12em] transition hover:text-[#efe2ca]"
        >
          SYS 21
        </button>

      </div>
    </div>
  );
}