"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const navItems = [
        { label: "HOME", path: "/" },
        { label: "FEATURES", path: "/features" },
        { label: "ABOUT", path: "/about" },
        { label: "CONTACT", path: "/contact" },
    ];

    return (
        <header className="relative z-10 flex w-full items-center justify-between px-6 py-5 md:px-10">
            {/* ================= LOGO ================= */}
            <button
                onClick={() => router.push("/")}
                className="group flex items-center gap-4 text-left"
            >
                {/* Retro logo box */}
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#684932] bg-[#f4c97d] text-[21px] tracking-tight text-[#4a362a] shadow-[3px_3px_0_rgba(104,73,50,0.18)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[4px_5px_0_rgba(104,73,50,0.2)]">
                    &gt;_
                </div>

                {/* Logo text */}
                <div>
                    <h1 className="text-[17px] leading-none tracking-[0.2em] text-[#473226]">
                        AI INTERVIEW ASSISTANT
                    </h1>

                    <p className="mt-2 text-[10px] tracking-[0.2em] text-[#806754]">
                        PRACTICE. IMPROVE. SUCCEED.
                    </p>
                </div>
            </button>

            {/* ================= NAVIGATION ================= */}
            <nav className="hidden -translate-x-25 items-center gap-9 text-[12px] tracking-[0.12em] md:flex">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`
                relative pb-2
                text-[12px]
                tracking-[0.12em]
                transition-colors
                duration-200
                ${isActive
                                    ? "border-b-2 border-[#60432f] text-[#473226]"
                                    : "text-[#765f4d] hover:text-[#3e2d23]"
                                }
              `}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* ================= SYSTEM STATUS ================= */}
            <div className="hidden text-right md:block">

                <p className="text-[9px] tracking-[0.2em] text-[#947a64]">
                    AI INTERVIEW SYSTEM
                </p>

                <div className="mt-2 flex items-center justify-end gap-2">

                    {/* Animated online indicator */}
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39a38e] opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39a38e]" />
                    </span>

                    <span className="text-[10px] tracking-[0.16em] text-[#5c4331]">
                        SYSTEM ONLINE
                    </span>
                </div>

            </div>

        </header>
    );
}