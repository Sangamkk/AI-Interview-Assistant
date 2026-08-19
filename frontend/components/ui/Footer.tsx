"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer() {
    const router = useRouter();
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            setTime(
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        };

        updateTime();

        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);
    const links = [
        {
            icon: "⌂",
            label: "HOME",
            path: "/",
            color: "bg-[#f4c97d]",
        },
        {
            icon: "⚙",
            label: "FEATURES",
            path: "/features",
            color: "bg-[#39a38e]",
        },
        {
            icon: "?",
            label: "ABOUT",
            path: "/about",
            color: "bg-[#e98782]",
        },
        {
            icon: "✉",
            label: "CONTACT",
            path: "/contact",
            color: "bg-[#3c9aaa]",
        },
    ];

    return (
        <footer className="relative z-10 mx-8 border-t-2 border-[#bda98f] py-6 text-[#735d4b] md:mx-12">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

                {/* LEFT SYSTEM INFO */}
                <div className="text-center text-[10px] leading-5 tracking-[0.12em] md:text-left">
                    <p>// AI INTERVIEW SYSTEM</p>
                    <p className="text-[#947a64]">STATUS: READY FOR SESSION</p>
                </div>

                {/* CENTER NAVIGATION COMPONENT */}
                <div className="flex items-center gap-2 rounded-xl border-2 border-[#684932] bg-[#efe2ca] p-2 shadow-[3px_3px_0_rgba(104,73,50,0.2)]">

                    {links.map((link) => (
                        <button
                            key={link.label}
                            onClick={() => router.push(link.path)}
                            title={link.label}
                            className={`
                group relative flex h-9 w-9 items-center justify-center
                rounded border-2 border-[#684932]
                ${link.color}
                text-[16px] text-[#4a362a]
                shadow-[2px_2px_0_rgba(104,73,50,0.18)]
                transition-all duration-150
                hover:-translate-y-1
                hover:shadow-[3px_4px_0_rgba(104,73,50,0.22)]
                active:translate-y-[1px]
                active:shadow-none
              `}
                        >
                            {link.icon}

                            {/* RETRO LABEL */}
                            <span
                                className="
                  pointer-events-none
                  absolute -top-8 left-1/2
                  hidden -translate-x-1/2
                  whitespace-nowrap
                  border border-[#684932]
                  bg-[#f7eddb]
                  px-2 py-1
                  text-[8px]
                  tracking-[0.12em]
                  text-[#684932]
                  group-hover:block
                "
                            >
                                {link.label}
                            </span>
                        </button>
                    ))}

                </div>

                {/* RIGHT SYSTEM CLOCK */}
                <div className="text-center md:text-right">

                    {/* System label */}
                    <p className="text-[9px] tracking-[0.22em] text-[#947a64]">
                        LOCAL SYSTEM TIME
                    </p>

                    {/* Live digital time */}
                    <div className="mt-1 flex items-center justify-center gap-2 md:justify-end">

                        {/* Status light */}
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#39a38e] opacity-50" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#39a38e]" />
                        </span>

                        <p className="text-[14px] tracking-[0.12em] text-[#473226]">
                            {time}
                        </p>

                    </div>

                    {/* System status */}
                    <p className="mt-1 text-[8px] tracking-[0.18em] text-[#947a64]">
                        SYS ONLINE // IST
                    </p>

                </div>

            </div>
        </footer>
    );
}