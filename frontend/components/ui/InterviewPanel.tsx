export default function InterviewPanel() {
  return (
    <div className="w-full max-w-sm border border-ink rounded-2xl bg-paper overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-ink/70 text-xs tracking-wide">
        <span>INTERVIEW SESSION</span>
        <span className="flex items-center gap-2">
          00:00:00
          <span className="w-1.5 h-1.5 rounded-full bg-ink inline-block" />
        </span>
      </div>

      {/* body */}
      <div className="px-5 py-6 min-h-[240px] text-sm space-y-6">
        <div>
          <p className="text-xs text-ink/60 mb-1">AI INTERVIEWER:</p>
          <p className="leading-relaxed">
            Tell me about a challenging project you worked on.
          </p>
        </div>

        <div>
          <p className="text-xs text-ink/60 mb-1">YOU:</p>
          <span className="inline-block w-2 h-4 bg-ink/80 animate-pulse" />
        </div>
      </div>

      {/* waveform */}
      <div className="px-5 pb-4">
        <div className="flex items-end gap-[3px] h-6 opacity-70">
          {Array.from({ length: 42 }).map((_, i) => (
            <span
              key={i}
              className="w-[2px] bg-ink"
              style={{
                height: `${((i * 37) % 24) + 4}px`,
                opacity: i % 7 === 0 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="px-5 py-3 border-t border-ink/70 text-xs tracking-wide">
        STATUS: READY WHEN YOU ARE.
      </div>
    </div>
  );
}
