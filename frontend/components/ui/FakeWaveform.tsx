"use client";

type FakeWaveformProps = {
  active: boolean;
  variant?: "ai" | "user";
};

export default function FakeWaveform({
  active,
  variant = "ai",
}: FakeWaveformProps) {
  const bars =
    variant === "ai"
      ? [18, 28, 42, 60, 35, 75, 48, 30, 65, 38, 55, 25, 45, 70, 32]
      : [30, 55, 35, 70, 45, 25, 60, 78, 42, 68, 32, 52, 72, 40, 58];

  return (
    <div className="flex h-[90px] items-center justify-center gap-[4px]">
      {bars.map((height, index) => (
        <span
          key={index}
          className={`w-[4px] rounded-full bg-[#d8ddd8] ${
            active ? "animate-pulse" : "opacity-30"
          }`}
          style={{
            height: `${height}px`,
            animationDelay: `${index * 0.08}s`,
            animationDuration: variant === "ai" ? "0.7s" : "0.5s",
          }}
        />
      ))}
    </div>
  );
}