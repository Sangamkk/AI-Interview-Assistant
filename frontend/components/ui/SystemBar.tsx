"use client";

import { useSystem } from "@/app/context/SystemContext";

export default function SystemBar() {
  const {
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    setHelpOpen,
    setSystemInfoOpen,
  } = useSystem();

  /* ================= THEME ================= */
  const toggleTheme = () => {
    const nextTheme =
      theme === "default"
        ? "light"
        : theme === "light"
        ? "dark"
        : "default";

    setTheme(nextTheme);
  };

  const systemLabel =
    theme === "default"
      ? "SYS 21"
      : theme === "light"
      ? "SYS LIGHT"
      : "SYS DARK";

  return (
    <div className="relative z-50 flex h-14 items-center justify-between border-b-[4px] border-[#62452f] bg-[#3c9aaa] px-6 text-[#30261f] sm:px-10">

      {/* SYSTEM NAME */}
      <p className="text-[14px] tracking-[0.08em] sm:text-[17px]">
        AI INTERVIEW ASSISTANT SYSTEM
      </p>

      {/* CONTROLS */}
      <div className="flex items-center gap-4 text-[13px] sm:gap-5">

        {/* THEME */}
        <button
          onClick={toggleTheme}
          title={`Theme: ${theme}`}
          className="flex h-7 w-7 items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-90"
        >
          ◧
        </button>

        {/* SOUND */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "Sound: ON" : "Sound: OFF"}
          className={`flex h-7 w-7 items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90 ${
            soundEnabled ? "animate-pulse opacity-100" : "opacity-40"
          }`}
        >
          ⌁
        </button>

        {/* HELP */}
        <button
          onClick={() => setHelpOpen(true)}
          title="Help & Guide"
          className="flex h-7 w-7 items-center justify-center cursor-pointer transition-all duration-300 hover:rotate-12 hover:scale-110 active:scale-90"
        >
          ⌕
        </button>

        {/* SYSTEM INFO */}
        <button
          onClick={() => setSystemInfoOpen(true)}
          title="System Information"
          className="hidden cursor-pointer border-l-2 border-[#62452f]/40 pl-4 tracking-[0.08em] transition-all duration-200 hover:scale-105 sm:inline"
        >
          {systemLabel}
        </button>

      </div>
    </div>
  );
}