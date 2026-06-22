/*
  ResearchMap — perfectly symmetric node diagram of Spektre coherence domains.
  Pure SVG + CSS, server-safe (no hooks). Glyph primitives at center and nodes.
  Bilateral + radial symmetry: left = right, top = bottom → 1 = 1 made visual.
  Hairline topology lines connect domains through a central seal.
  Art direction: Altered Carbon in Prada — cold, precise, noir sci-fi.
*/

import { Glyph } from "@/components/glyph";
import type { ResearchLayer } from "@/lib/research";

/* ─── Geometry ─────────────────────────────────────────────────────────────── */

const CX = 200; // SVG center x
const CY = 200; // SVG center y
const R_ORBIT = 148; // node orbit radius
const VIEWBOX = "0 0 400 400";

// 7 domains → positions on orbit. We place them at exact radial symmetry.
// 8 positions gives perfect bilateral symmetry; with 7 layers we use 7 of 8
// but keep the angular cadence even. We anchor at top (−90°) and go clockwise.
function nodeAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (i * (Math.PI * 2)) / count;
    return angle;
  });
}

// Shorten a line segment by `gap` px at each end (so arrows don't overlap nodes)
function shortenedLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gap: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: x1 + ux * gap,
    y1: y1 + uy * gap,
    x2: x2 - ux * gap,
    y2: y2 - uy * gap,
  };
}

/* ─── Node label placement ──────────────────────────────────────────────────── */

// Choose text-anchor and offset based on quadrant
function labelProps(angle: number): {
  anchor: string;
  dx: number;
  dy: number;
} {
  const deg = ((angle * 180) / Math.PI + 360) % 360;
  if (deg < 22.5 || deg >= 337.5) return { anchor: "middle", dx: 0, dy: -18 }; // top
  if (deg < 67.5) return { anchor: "start", dx: 16, dy: -12 };
  if (deg < 112.5) return { anchor: "start", dx: 18, dy: 5 }; // right
  if (deg < 157.5) return { anchor: "start", dx: 16, dy: 16 };
  if (deg < 202.5) return { anchor: "middle", dx: 0, dy: 22 }; // bottom
  if (deg < 247.5) return { anchor: "end", dx: -16, dy: 16 };
  if (deg < 292.5) return { anchor: "end", dx: -18, dy: 5 }; // left
  return { anchor: "end", dx: -16, dy: -12 };
}

/* ─── Short domain name map ─────────────────────────────────────────────────── */

const SHORT: Record<string, string> = {
  "Core Theoretical Layer": "Core Theory",
  "Complex Systems Layer": "Complex Systems",
  "Artificial Intelligence Layer": "Artificial Intelligence",
  "Cognition Layer": "Cognition",
  "Information & Computation Layer": "Info & Computation",
  "Physics Layer": "Physics",
  "Cross-Domain Layer": "Cross-Domain",
};

/* ─── Component ─────────────────────────────────────────────────────────────── */

export function ResearchMap({ layers }: { layers: ResearchLayer[] }) {
  const angles = nodeAngles(layers.length);
  const stroke = "rgba(200,206,216,0.45)";
  const strokeFaint = "rgba(160,176,200,0.18)";
  const strokeSignal = "rgba(207,227,255,0.55)";
  const nodeR = 22;

  return (
    <div className="w-full">
      {/* ── Symmetric Node Diagram ── */}
      <div
        className="rise relative mx-auto"
        style={{
          maxWidth: 540,
          animationDelay: "0.05s",
        }}
        aria-label="Spektre research domain map"
        role="img"
      >
        {/* Hairline frame — full border, Abloh-grade container */}
        <div
          className="relative border border-[var(--line)] bg-[var(--bg-1)]"
          style={{ paddingTop: "100%" }}
        >
          {/* Label — upper left industrial eyebrow */}
          <div
            className="label absolute top-4 left-4 text-[var(--fg-faint)] z-10"
            aria-hidden="true"
          >
            COHERENCE MAP / σ = 1
          </div>
          {/* Label — upper right index */}
          <div
            className="label absolute top-4 right-4 text-[var(--fg-faint)] z-10"
            aria-hidden="true"
          >
            {layers.length} DOMAINS
          </div>

          {/* The SVG fills the padded square */}
          <svg
            viewBox={VIEWBOX}
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            {/* ── Orbital rings (sacred geometry substrate) ── */}
            <circle cx={CX} cy={CY} r={R_ORBIT} stroke={strokeFaint} strokeWidth="1" fill="none" />
            <circle cx={CX} cy={CY} r={R_ORBIT * 0.62} stroke={strokeFaint} strokeWidth="0.5" fill="none" strokeDasharray="2 6" />
            <circle cx={CX} cy={CY} r={R_ORBIT * 0.28} stroke={strokeFaint} strokeWidth="0.5" fill="none" />

            {/* ── Radial spoke guides (faint, behind everything) ── */}
            {angles.map((a, i) => {
              const x2 = CX + Math.cos(a) * (R_ORBIT + 2);
              const y2 = CY + Math.sin(a) * (R_ORBIT + 2);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={CX}
                  y1={CY}
                  x2={x2}
                  y2={y2}
                  stroke={strokeFaint}
                  strokeWidth="0.5"
                />
              );
            })}

            {/* ── Ring connector (polygon linking all nodes) ── */}
            <polygon
              points={angles
                .map((a) => `${CX + Math.cos(a) * R_ORBIT},${CY + Math.sin(a) * R_ORBIT}`)
                .join(" ")}
              fill="none"
              stroke={strokeFaint}
              strokeWidth="0.75"
            />

            {/* ── Topology hairlines: each node → center, shortened ── */}
            {angles.map((a, i) => {
              const nx = CX + Math.cos(a) * R_ORBIT;
              const ny = CY + Math.sin(a) * R_ORBIT;
              const line = shortenedLine(nx, ny, CX, CY, nodeR + 4);
              return (
                <line
                  key={`line-${i}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={stroke}
                  strokeWidth="0.75"
                  strokeDasharray="3 5"
                />
              );
            })}

            {/* ── Centre Seal ── */}
            <g transform={`translate(${CX - 44}, ${CY - 44})`}>
              {/* White bg circle so seal reads on dark */}
              <circle cx="44" cy="44" r="34" fill="var(--bg-2)" />
              {/* Outer ring — doubled for specular depth */}
              <circle cx="44" cy="44" r="34" fill="none" stroke={stroke} strokeWidth="0.75" />
              <circle cx="44" cy="44" r="30" fill="none" stroke={strokeFaint} strokeWidth="0.5" />
            </g>
            {/* Glyph is an img so we embed it inline via use — instead render text mark */}
            {/* Center axiom text */}
            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              fill={stroke}
              fontSize="9"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.15em"
              fontWeight="400"
            >
              SPEKTRE
            </text>
            <text
              x={CX}
              y={CY + 6}
              textAnchor="middle"
              fill={strokeFaint}
              fontSize="7.5"
              fontFamily="ui-monospace, monospace"
              letterSpacing="0.12em"
            >
              1 = 1
            </text>
            {/* Cardinal tick marks on seal border */}
            {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
              <line
                key={`tick-${i}`}
                x1={CX + Math.cos(a) * 30}
                y1={CY + Math.sin(a) * 30}
                x2={CX + Math.cos(a) * 34}
                y2={CY + Math.sin(a) * 34}
                stroke={stroke}
                strokeWidth="1"
              />
            ))}

            {/* ── Domain nodes ── */}
            {layers.map((layer, i) => {
              const a = angles[i];
              const nx = CX + Math.cos(a) * R_ORBIT;
              const ny = CY + Math.sin(a) * R_ORBIT;
              const lp = labelProps(a);
              const shortName = SHORT[layer.layer] ?? layer.layer;
              // Split into two lines if long
              const words = shortName.split(" ");
              const mid = Math.ceil(words.length / 2);
              const line1 = words.slice(0, mid).join(" ");
              const line2 = words.slice(mid).join(" ");

              return (
                <g key={layer.layer}>
                  {/* Node circle — platinum hairline, filled with near-black */}
                  <circle
                    cx={nx}
                    cy={ny}
                    r={nodeR}
                    fill="var(--bg-2)"
                    stroke={stroke}
                    strokeWidth="0.75"
                  />
                  {/* Inner accent circle */}
                  <circle
                    cx={nx}
                    cy={ny}
                    r={nodeR - 5}
                    fill="none"
                    stroke={strokeFaint}
                    strokeWidth="0.5"
                  />
                  {/* Node index */}
                  <text
                    x={nx}
                    y={ny - 2}
                    textAnchor="middle"
                    fill="rgba(200,206,216,0.7)"
                    fontSize="8"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="0.1em"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                  {/* Item count */}
                  <text
                    x={nx}
                    y={ny + 8}
                    textAnchor="middle"
                    fill={strokeFaint}
                    fontSize="6.5"
                    fontFamily="ui-monospace, monospace"
                  >
                    /{layer.items.length}
                  </text>

                  {/* Label — outside node, bidirectional placement */}
                  <text
                    x={nx + lp.dx}
                    y={ny + lp.dy}
                    textAnchor={lp.anchor as "start" | "middle" | "end"}
                    fill="rgba(182,186,193,0.9)"
                    fontSize="8"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    letterSpacing="-0.01em"
                    fontWeight="500"
                  >
                    {line2 ? (
                      <>
                        <tspan x={nx + lp.dx} dy="0">{line1}</tspan>
                        <tspan x={nx + lp.dx} dy="10">{line2}</tspan>
                      </>
                    ) : (
                      line1
                    )}
                  </text>

                  {/* Outer tick — Abloh industrial mark */}
                  <line
                    x1={CX + Math.cos(a) * (R_ORBIT + nodeR + 2)}
                    y1={CY + Math.sin(a) * (R_ORBIT + nodeR + 2)}
                    x2={CX + Math.cos(a) * (R_ORBIT + nodeR + 8)}
                    y2={CY + Math.sin(a) * (R_ORBIT + nodeR + 8)}
                    stroke={strokeFaint}
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* ── σ signal pulse ring (outermost, barely visible) ── */}
            <circle
              cx={CX}
              cy={CY}
              r={R_ORBIT + 20}
              fill="none"
              stroke={strokeSignal}
              strokeWidth="0.4"
              strokeDasharray="1 12"
            />
          </svg>
        </div>

        {/* Bottom label bar — editorial footer */}
        <div className="flex items-center justify-between border-t border-[var(--line)] px-4 py-3">
          <span className="label text-[var(--fg-faint)]">COHERENCE TOPOLOGY</span>
          <span className="label text-[var(--fg-faint)]">K_CRIT ≈ 0.127</span>
        </div>
      </div>

      {/* ── Layer Cards — tiled below the diagram ── */}
      <div
        className="rise mt-12 grid gap-px bg-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ animationDelay: "0.18s" }}
      >
        {layers.map((layer, index) => (
          <div
            key={layer.layer}
            className="group relative bg-[var(--bg)] px-6 py-6 transition-colors duration-500 hover:bg-[var(--bg-1)]"
          >
            {/* Index + hairline corner tick */}
            <div className="flex items-start justify-between mb-5">
              <span className="label text-[var(--fg-faint)] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-4 h-4 border-t border-r border-[var(--line)] opacity-50 transition-opacity duration-500 group-hover:opacity-100 group-hover:border-[var(--metal-4)]" />
            </div>

            {/* Layer name */}
            <h3 className="metal-text text-[0.95rem] font-semibold tracking-[-0.02em] leading-[1.22] transition-all duration-500">
              {layer.layer}
            </h3>

            {/* Description */}
            {layer.description ? (
              <p className="mt-3 text-[0.82rem] leading-[1.78] text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg-dim)]">
                {layer.description}
              </p>
            ) : null}

            {/* Items — hairline rows */}
            <ul className="mt-5 space-y-0">
              {layer.items.slice(0, 4).map((item, itemIndex) => (
                <li
                  key={item.title}
                  className="flex items-baseline gap-2.5 border-b border-[var(--line-soft)] py-2 last:border-b-0 transition-colors duration-500 group-hover:border-[var(--line)]"
                >
                  <span
                    className="label text-[0.52rem] text-[var(--fg-faint)] tabular-nums shrink-0"
                    aria-hidden="true"
                  >
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.8rem] text-[var(--fg-dim)] tracking-[-0.005em] transition-colors duration-500 group-hover:text-[var(--fg)]">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>

            {layer.items.length > 4 ? (
              <p className="mt-3 label text-[var(--fg-faint)]">
                +{layer.items.length - 4} more
              </p>
            ) : null}

            {/* Bottom signal bar on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--signal)] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
