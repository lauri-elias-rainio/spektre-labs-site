/**
 * HeroPoster — the STATIC, bulletproof fallback for the hero seal.
 *
 * This is the no-WebGL / mobile-low / SSR / reduced-motion / loading state.
 * It is a pure inline-SVG render of the Spektre 1 = 1 seal: 8-fold radial +
 * perfect bilateral symmetry, platinum hairlines on OLED true-black, exactly
 * one cold signal keyline on the vertical axis (declared = realized).
 *
 * It ships zero JS, zero network, zero GPU — so the hero is NEVER blank and
 * NEVER looks broken, on any device, in any browser, at any point in load.
 *
 * STYLE_LAW: OLED #000 + one platinum metal axis + one cold signal (#cfe3ff);
 * perfect symmetry (flip-test passes — the mark is its own reflection);
 * material (gradient specular, glow) over flat; restraint over decoration.
 */
export function HeroPoster({ className }: { className?: string }) {
  const spokes = Array.from({ length: 8 }, (_, i) => (i / 8) * 360);
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { x: 100 + Math.sin(a) * 86, y: 100 - Math.cos(a) * 86 };
  });
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden role="presentation">
      <defs>
        <linearGradient id="hero-platinum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#b9bdc6" />
          <stop offset="100%" stopColor="#565b65" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(120,140,175,0.18)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="200" height="200" fill="#000000" />
      <rect x="0" y="0" width="200" height="200" fill="url(#hero-glow)" />
      {/* containment rings — the octad's circle */}
      <circle cx="100" cy="100" r="86" fill="none" stroke="url(#hero-platinum)" strokeWidth="0.9" opacity="0.85" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="#888d97" strokeWidth="0.7" opacity="0.7" />
      {/* the octad spokes — 8-fold radial symmetry */}
      <g stroke="#e8eaee" strokeWidth="0.9" opacity="0.9">
        {spokes.map((deg) => (
          <line key={deg} x1="100" y1="100" x2="100" y2="14" transform={`rotate(${deg} 100 100)`} />
        ))}
      </g>
      {/* vesica nodes at each octad vertex */}
      <g fill="url(#hero-platinum)">
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="2.4" />
        ))}
      </g>
      {/* the single cold signal keyline — bilateral axis, declared = realized */}
      <line x1="100" y1="6" x2="100" y2="194" stroke="#cfe3ff" strokeWidth="0.9" opacity="0.92" />
      {/* the fixpoint — specular center node */}
      <circle cx="100" cy="100" r="3.6" fill="#ffffff" />
    </svg>
  );
}

export default HeroPoster;
