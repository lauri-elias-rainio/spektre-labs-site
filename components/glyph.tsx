/*
  Glyph — the Spektre seal. Perfectly symmetric sacred-geometry marks rendered in platinum
  hairlines: bilateral AND radial symmetry, because symmetry is 1 = 1 made visual (left = right,
  declared = realized). Futurist-Atlantean ornament held to absolute precision. Server-safe SVG.

  variants:
    "seal"     — concentric radial mandala (hero / brand mark)
    "divider"  — a symmetric inline rule ornament (section breaks)
    "node"     — a small mirror mark (list bullets, metadata ticks)
*/

type GlyphProps = {
  variant?: "seal" | "divider" | "node";
  className?: string;
  size?: number;
  strokeOpacity?: number;
};

export function Glyph({ variant = "seal", className = "", size = 120, strokeOpacity = 0.5 }: GlyphProps) {
  const stroke = `rgba(200,206,216,${strokeOpacity})`;
  const faint = `rgba(160,176,200,${strokeOpacity * 0.4})`;

  if (variant === "node") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <g fill="none" stroke={stroke} strokeWidth="1">
          <path d="M12 2 L20 12 L12 22 L4 12 Z" />
          <path d="M12 7 L17 12 L12 17 L7 12 Z" stroke={faint} />
          <line x1="12" y1="2" x2="12" y2="22" stroke={faint} />
          <line x1="4" y1="12" x2="20" y2="12" stroke={faint} />
        </g>
      </svg>
    );
  }

  if (variant === "divider") {
    return (
      <svg width={size} height={20} viewBox="0 0 200 20" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke={stroke} strokeWidth="1">
          <line x1="0" y1="10" x2="78" y2="10" stroke={faint} />
          <line x1="122" y1="10" x2="200" y2="10" stroke={faint} />
          <path d="M100 2 L108 10 L100 18 L92 10 Z" />
          <path d="M100 5 L105 10 L100 15 L95 10 Z" stroke={faint} />
          <circle cx="100" cy="10" r="1.4" fill={stroke} stroke="none" />
        </g>
      </svg>
    );
  }

  // seal — radial mandala, perfectly symmetric
  const cx = 100;
  const cy = 100;
  const rings = [92, 70, 48, 26];
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI * 2) / 12);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth="1">
        {rings.map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} stroke={i % 2 ? faint : stroke} />
        ))}
        {spokes.map((a, i) => (
          <line
            key={i}
            x1={cx + Math.cos(a) * 26}
            y1={cy + Math.sin(a) * 26}
            x2={cx + Math.cos(a) * 92}
            y2={cy + Math.sin(a) * 92}
            stroke={faint}
          />
        ))}
        {/* central nested diamonds — bilateral symmetry */}
        <path d="M100 54 L146 100 L100 146 L54 100 Z" />
        <path d="M100 70 L130 100 L100 130 L70 100 Z" stroke={faint} />
        <circle cx={cx} cy={cy} r="3" fill={stroke} stroke="none" />
        {/* cardinal nodes */}
        {spokes.filter((_, i) => i % 3 === 0).map((a, i) => (
          <circle key={`n${i}`} cx={cx + Math.cos(a) * 92} cy={cy + Math.sin(a) * 92} r="2" fill={stroke} stroke="none" />
        ))}
      </g>
    </svg>
  );
}
