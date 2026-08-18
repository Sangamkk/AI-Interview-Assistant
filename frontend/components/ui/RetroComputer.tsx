export default function RetroComputer() {
  return (
    <svg
      viewBox="0 0 340 400"
      className="w-full max-w-[340px] mx-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* shadow */}
      <ellipse cx="170" cy="392" rx="120" ry="8" fill="#00000012" />

      {/* main body */}
      <rect x="20" y="10" width="300" height="330" rx="26" fill="#eae7e0" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* screen bezel */}
      <rect x="42" y="34" width="256" height="196" rx="10" fill="#dcd8cf" stroke="#1a1a1a" strokeWidth="1.5" />

      {/* screen */}
      <rect x="58" y="50" width="224" height="164" rx="4" fill="#3d3d3a" />

      {/* screen dots */}
      <circle cx="72" cy="64" r="2" fill="#efeeea" opacity="0.7" />
      <circle cx="80" cy="64" r="2" fill="#efeeea" opacity="0.7" />
      <circle cx="88" cy="64" r="2" fill="#efeeea" opacity="0.7" />

      {/* screen text lines */}
      <text x="70" y="90" fill="#efeeea" fontSize="9" fontFamily="monospace" opacity="0.9">
        Positioned at the axis
      </text>
      <text x="70" y="103" fill="#efeeea" fontSize="9" fontFamily="monospace" opacity="0.9">
        of talent and content
      </text>
      <text x="70" y="116" fill="#efeeea" fontSize="9" fontFamily="monospace" opacity="0.9">
        across worlds.
      </text>

      {/* small diagram glyph */}
      <g stroke="#efeeea" strokeWidth="0.75" opacity="0.6" fill="none">
        <rect x="228" y="78" width="34" height="30" />
        <line x1="228" y1="93" x2="262" y2="93" />
        <line x1="245" y1="78" x2="245" y2="108" />
        <line x1="228" y1="78" x2="245" y2="93" />
      </g>

      <text x="70" y="168" fill="#efeeea" fontSize="6.5" fontFamily="monospace" opacity="0.55">
        AI interview assistant system
      </text>
      <text x="70" y="179" fill="#efeeea" fontSize="6.5" fontFamily="monospace" opacity="0.55">
        Practice. Improve. Succeed.
      </text>
      <text x="70" y="190" fill="#efeeea" fontSize="6.5" fontFamily="monospace" opacity="0.55">
        Preparing next session...
      </text>
      <text x="248" y="196" fill="#efeeea" fontSize="7" fontFamily="monospace" opacity="0.7">
        &gt;&gt; v1.0
      </text>

      {/* lower control panel */}
      <rect x="42" y="244" width="256" height="72" rx="8" fill="#eae7e0" stroke="#1a1a1a" strokeWidth="1.25" />

      {/* three dial buttons */}
      {[76, 100, 124].map((cx) => (
        <g key={cx}>
          <rect x={cx - 5} y={260} width="10" height="20" rx="5" fill="#f4f2ec" stroke="#1a1a1a" strokeWidth="1" />
          <circle cx={cx} cy={258} r="1.4" fill="#1a1a1a" />
        </g>
      ))}

      {/* vent grille */}
      {[0, 1, 2, 3, 4].map((row) => (
        <line
          key={row}
          x1="228"
          y1={262 + row * 7}
          x2="278"
          y2={262 + row * 7}
          stroke="#1a1a1a"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}

      {/* power dot */}
      <circle cx="90" cy="300" r="3" fill="none" stroke="#1a1a1a" strokeWidth="1.25" />

      {/* stand / swirl */}
      <path
        d="M 30 340 a 14 14 0 0 0 14 20"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.25"
      />
    </svg>
  );
}
