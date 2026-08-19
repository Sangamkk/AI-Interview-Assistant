"use client";

import Link from "next/link";
import localFont from "next/font/local";

const pixelOperator = localFont({
    src: "../fonts/PixelOperatorSC.ttf",
    variable: "--font-pixel-operator",
});

export default function InterviewModePage() {
    const modes = [
        {
            id: "01",
            title: "TEXT TO TEXT",
            description:
                "Practice your interview by typing answers and receiving AI-powered responses and feedback.",
            icon: "⌨",
            href: "/text-practice",
            status: "KEYBOARD READY",
            accent: "#e98c88",
            light: "#f7c5bd",
            iconBg: "#ef8b85",
        },
        {
            id: "02",
            title: "VOICE TO VOICE",
            description:
                "Speak naturally with the AI interviewer and receive feedback on your answers and delivery.",
            icon: "◉",
            href: "/voice-interview",
            status: "MICROPHONE READY",
            accent: "#269c91",
            light: "#8fd3c8",
            iconBg: "#2b9f94",
        },
        {
            id: "03",
            title: "FACE TO FACE",
            description:
                "Experience a realistic interview using your camera, voice, and AI-powered analysis.",
            icon: "◫",
            href: "/proctored-interview",
            status: "CAMERA READY",
            accent: "#3c99aa",
            light: "#91cdd7",
            iconBg: "#3193a5",
        },
    ];

    return (
        <main
            className={`${pixelOperator.className} min-h-screen bg-[#e9e7e2] p-4 text-[#4b3628] sm:p-8`}
        >
            {/* Retro Desktop Window */}
            <section className="relative mx-auto min-h-[calc(100vh-32px)] max-w-[1400px] overflow-hidden rounded-[34px] border-[4px] border-[#5a3825] bg-[#f4ead5] shadow-[22px_22px_0_#684127,0_20px_45px_rgba(60,38,25,0.18)] sm:min-h-[calc(100vh-64px)]">

                {/* ================= TOP DESKTOP BAR ================= */}
                <div className="relative z-20 flex h-[58px] items-center justify-between border-b-[4px] border-[#5a3825] bg-[#3298a9] px-6 text-[#3f3029] sm:px-8">
                    {/* Left system text */}
                    <div className="flex items-center gap-3 text-[13px] tracking-[0.08em]">
                        <span className="hidden sm:block">
                            AI INTERVIEW ASSISTANT
                        </span>

                        <span className="h-4 w-px bg-[#315f65]/60" />

                        <span className="hidden md:block">
                            INTERVIEW MODE SELECTOR
                        </span>
                    </div>

                    {/* Right system indicators */}
                    <div className="flex items-center gap-5 text-[14px]">
                        <span className="hidden sm:block">◫</span>
                        <span>⌁</span>
                        <span>◉</span>
                        <span className="hidden md:block">
                            Wed 21 Jun
                        </span>
                    </div>
                </div>

                {/* ================= BACKGROUND ================= */}
                <div className="pointer-events-none absolute inset-[58px_0_0_0] bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.5),transparent_34%),radial-gradient(circle_at_15%_85%,rgba(230,201,151,0.22),transparent_30%)]" />

                {/* ================= HEADER ================= */}
                <header className="relative z-10 flex items-center justify-between px-7 py-7 sm:px-10">

                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-[#5a3825] bg-[#f8d291] text-[19px] shadow-[3px_3px_0_#5a3825] transition-transform group-hover:-translate-y-1">
                            &gt;_
                        </div>

                        <div>
                            <h1 className="text-[17px] tracking-[0.16em] text-[#503426]">
                                AI INTERVIEW ASSISTANT
                            </h1>

                            <p className="mt-1 text-[10px] tracking-[0.14em] text-[#876a50]">
                                PRACTICE. IMPROVE. SUCCEED.
                            </p>
                        </div>
                    </Link>

                    {/* Desktop window controls */}
                    <div className="hidden items-center gap-2 sm:flex">
                        <span className="flex h-8 w-8 items-center justify-center border-2 border-[#6a4831] bg-[#f4c77e] text-[13px]">
                            −
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center border-2 border-[#6a4831] bg-[#f4c77e] text-[11px]">
                            □
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center border-2 border-[#6a4831] bg-[#e98c88] text-[13px]">
                            ×
                        </span>
                    </div>
                </header>

                {/* ================= PAGE CONTENT ================= */}
                <div className="relative z-10 px-7 pb-28 pt-5 sm:px-10 lg:px-14">

                    {/* System path */}
                    <div className="mb-10 flex items-center gap-3">
                        <span className="text-[10px] tracking-[0.18em] text-[#876a50]">
                            HOME / INTERVIEW / SELECT MODE
                        </span>

                        <div className="h-px flex-1 bg-[#c9af8d]" />
                    </div>

                    {/* ================= TITLE ================= */}
                    <div className="max-w-[800px]">
                        <p className="mb-5 text-[11px] tracking-[0.18em] text-[#2f8e9b]">
              // SESSION_CONFIGURATION
                        </p>

                        <h2 className="text-[38px] leading-[1.15] tracking-[0.08em] text-[#503426] sm:text-[52px] md:text-[65px]">
                            CHOOSE YOUR
                            <br />
                            INTERVIEW MODE.
                        </h2>

                        <p className="mt-6 max-w-[580px] text-[13px] leading-7 tracking-[0.04em] text-[#795d47]">
                            Select how you want to practice. Each environment simulates
                            a different interview experience and prepares you for the
                            real thing.
                        </p>
                    </div>

                    {/* ================= MODE WINDOWS ================= */}
                    <div className="mt-14 grid grid-cols-1 gap-7 lg:grid-cols-3">
                        {modes.map((mode) => (
                            <Link
                                key={mode.id}
                                href={mode.href}
                                className="group relative block min-h-[340px] border-[3px] border-[#5a3825] bg-[#f7ecd7] shadow-[8px_8px_0_#765038] transition-all duration-200 hover:-translate-y-2 hover:shadow-[12px_12px_0_#765038]"
                            >
                                {/* Card title bar */}
                                <div
                                    className="flex h-[45px] items-center justify-between border-b-[3px] border-[#5a3825] px-4"
                                    style={{ backgroundColor: mode.light }}
                                >
                                    <span className="text-[10px] tracking-[0.14em] text-[#4e3427]">
                                        MODE_{mode.id}
                                    </span>

                                    <div className="flex gap-1">
                                        <span className="h-3 w-3 border border-[#5a3825] bg-[#f7ecd7]" />
                                        <span className="h-3 w-3 border border-[#5a3825] bg-[#f7ecd7]" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Folder / app icon */}
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="relative flex h-16 w-16 items-center justify-center rounded-sm border-[3px] border-[#5a3825] text-[30px] text-[#4d382c] shadow-[4px_4px_0_#5a3825]"
                                            style={{ backgroundColor: mode.iconBg }}
                                        >
                                            {mode.icon}
                                        </div>

                                        <span
                                            className="border-2 border-[#5a3825] px-2 py-1 text-[9px] tracking-[0.12em]"
                                            style={{
                                                backgroundColor: mode.light,
                                                color: "#4e3427",
                                            }}
                                        >
                                            {mode.status}
                                        </span>
                                    </div>

                                    {/* Decorative divider */}
                                    <div className="mt-8 border-t-2 border-dashed border-[#c5a886]" />

                                    <p
                                        className="mt-7 text-[10px] tracking-[0.18em]"
                                        style={{ color: mode.accent }}
                                    >
                                        INTERVIEW APPLICATION
                                    </p>

                                    <h3 className="mt-4 text-[25px] tracking-[0.08em] text-[#503426]">
                                        {mode.title}
                                    </h3>

                                    <p className="mt-5 text-[12px] leading-6 tracking-[0.03em] text-[#765b47]">
                                        {mode.description}
                                    </p>
                                </div>

                                {/* Bottom action bar */}
                                <div className="absolute bottom-0 left-0 flex h-[52px] w-full items-center justify-between border-t-[3px] border-[#5a3825] bg-[#ead9bb] px-5">
                                    <span className="text-[10px] tracking-[0.14em] text-[#604331]">
                                        OPEN APPLICATION
                                    </span>

                                    <span
                                        className="text-[20px] transition-transform duration-200 group-hover:translate-x-2"
                                        style={{ color: mode.accent }}
                                    >
                                        &gt;&gt;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* ================= SYSTEM MESSAGE ================= */}
                    <div className="mt-14 border-2 border-dashed border-[#b99975] bg-[#efe1c9] px-6 py-4 text-center text-[11px] tracking-[0.13em] text-[#72543e]">
                        SYSTEM STATUS: 03 INTERVIEW ENVIRONMENTS AVAILABLE. SELECT ONE TO INITIALIZE.
                    </div>
                </div>

                {/* ================= RETRO DOCK ================= */}
                <div className="relative z-10 mx-auto mb-8 flex w-fit items-center gap-3 border-[3px] border-[#5a3825] bg-[#eadcc4] p-3 shadow-[5px_5px_0_rgba(90,56,37,0.22)]">

                    {/* Mail */}
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-[#5a3825] bg-[#f6cc84] text-[20px]">
                        ✉
                    </div>

                    {/* Calendar */}
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-[#5a3825] bg-[#f7eee0] text-[15px]">
                        21
                    </div>

                    {/* Chat */}
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-[#5a3825] bg-[#2b9f94] text-[20px]">
                        ●
                    </div>

                    {/* Music */}
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-[#5a3825] bg-[#ef8b85] text-[20px]">
                        ♫
                    </div>

                    {/* Browser */}
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-[#5a3825] bg-[#3298a9] text-[20px]">
                        ◎
                    </div>

                    <div className="mx-1 h-8 w-[2px] bg-[#9c7b5d]" />

                    {/* Folder */}
                    <div className="flex h-11 w-14 items-center justify-center border-2 border-[#5a3825] bg-[#f5c779] text-[21px]">
                        ▱
                    </div>
                </div>

                {/* Bottom system line */}
                <div className="relative z-10 border-t-[3px] border-[#5a3825] bg-[#e5d4b7] px-7 py-4 text-[10px] tracking-[0.13em] text-[#76543d] sm:px-10">
                    <div className="flex items-center justify-between">
                        <span>AI INTERVIEW OS v1.0</span>
                        <span>SESSION: NOT STARTED</span>
                        <span className="hidden sm:block">READY</span>
                    </div>
                </div>
            </section>
        </main>
    );
}