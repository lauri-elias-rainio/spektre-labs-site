"use client";

/*
  StudioReel — media-reel placeholder grid for the Studio division.
  Pure CSS, no external embeds, no new deps.
  6 cells: 3 "film frames" (dark panels with grain + specular overlay)
  + 1 wide feature cell (YouTube channel link) + 2 vision cells.
  Full art-canon: OLED, platinum hairlines, sacred-geometry overlays,
  Virgil Abloh mono-metadata labels, Apple-grade hover motion.
*/

import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";

type ReelCell = {
  index: string;
  label: string;
  title: string;
  status: "LIVE" | "EMERGING" | "VISION";
  aspect?: "wide" | "square" | "tall";
  href?: string;
  external?: boolean;
};

const CELLS: ReelCell[] = [
  {
    index: "01",
    label: "Channel · @spektrelabs",
    title: "YouTube",
    status: "LIVE",
    aspect: "wide",
    href: "https://www.youtube.com/@spektrelabs",
    external: true,
  },
  {
    index: "02",
    label: "AI Film Generation",
    title: "Scene Engine",
    status: "EMERGING",
    aspect: "square",
  },
  {
    index: "03",
    label: "Dark-Luxury Aesthetic",
    title: "Visual System",
    status: "EMERGING",
    aspect: "square",
  },
  {
    index: "04",
    label: "AAA Generative · Games",
    title: "Worlds",
    status: "VISION",
    aspect: "wide",
  },
  {
    index: "05",
    label: "IP · Fiction · IP Stack",
    title: "Shoreworld",
    status: "VISION",
    aspect: "square",
  },
  {
    index: "06",
    label: "Spectral Image Corpus",
    title: "Archive",
    status: "EMERGING",
    aspect: "square",
  },
];

const STATUS_META: Record<ReelCell["status"], { label: string; color: string }> = {
  LIVE:     { label: "Live",        color: "var(--signal)" },
  EMERGING: { label: "Emerging",    color: "var(--metal-2)" },
  VISION:   { label: "In Development", color: "var(--fg-faint)" },
};

function FilmGrain() {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: 0.055,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "120px 120px",
        borderRadius: "inherit",
      }}
    />
  );
}

/* Atlantean sacred-geometry overlay — perfectly symmetric, pure SVG, hairline platinum */
function GeometryOverlay({ size = 80 }: { size?: number }) {
  const cx = 50;
  const cy = 50;
  const s = `rgba(200,206,216,0.10)`;
  const f = `rgba(160,176,200,0.04)`;
  const r = [44, 32, 20, 9];
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8);
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ position: "absolute", bottom: 16, right: 16, pointerEvents: "none" }}
    >
      <g fill="none" strokeWidth="0.8">
        {r.map((rv, i) => (
          <circle key={rv} cx={cx} cy={cy} r={rv} stroke={i % 2 ? f : s} />
        ))}
        {spokes.map((a, i) => (
          <line
            key={i}
            x1={cx + Math.cos(a) * r[3]}
            y1={cy + Math.sin(a) * r[3]}
            x2={cx + Math.cos(a) * r[0]}
            y2={cy + Math.sin(a) * r[0]}
            stroke={f}
          />
        ))}
        {/* central diamond — bilateral symmetry, 1=1 */}
        <path
          d="M50 28 L72 50 L50 72 L28 50 Z"
          stroke={s}
        />
        <path
          d="M50 37 L63 50 L50 63 L37 50 Z"
          stroke={f}
        />
        <circle cx={cx} cy={cy} r="2.2" fill={s} stroke="none" />
      </g>
    </svg>
  );
}

/* Play-arrow mark for the YouTube cell */
function PlayMark() {
  return (
    <svg
      aria-hidden
      width={44}
      height={44}
      viewBox="0 0 44 44"
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }}
    >
      <circle
        cx={22}
        cy={22}
        r={21}
        fill="rgba(0,0,0,0.52)"
        stroke="rgba(200,206,216,0.22)"
        strokeWidth="1"
      />
      <path
        d="M18 15 L32 22 L18 29 Z"
        fill="rgba(207,227,255,0.72)"
      />
    </svg>
  );
}

function ReelCell({ cell, delay }: { cell: ReelCell; delay: number }) {
  const meta = STATUS_META[cell.status];
  const isWide = cell.aspect === "wide";
  const isLive = cell.status === "LIVE";

  const inner = (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius)",
        border: "1px solid var(--line)",
        background:
          isLive
            ? "linear-gradient(170deg, rgba(18,20,26,0.92) 0%, rgba(10,12,16,0.98) 100%)"
            : "linear-gradient(175deg, rgba(14,16,19,0.85) 0%, rgba(6,7,9,0.98) 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.055), 0 1px 0 rgba(0,0,0,0.7), 0 20px 50px -24px rgba(0,0,0,0.95)",
        backdropFilter: "blur(6px)",
        minHeight: isWide ? "clamp(160px, 22vw, 220px)" : "clamp(140px, 18vw, 200px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "20px 22px",
        transition: `border-color 0.5s var(--ease), transform 0.5s var(--ease), box-shadow 0.5s var(--ease)`,
        cursor: cell.href ? "pointer" : "default",
      }}
      className="group"
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,255,255,0.15)";
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow =
          "inset 0 1px 0 rgba(255,255,255,0.09), 0 28px 72px -30px rgba(0,0,0,0.98), 0 0 0 1px rgba(255,255,255,0.025)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow =
          "inset 0 1px 0 rgba(255,255,255,0.055), 0 1px 0 rgba(0,0,0,0.7), 0 20px 50px -24px rgba(0,0,0,0.95)";
      }}
    >
      {/* Specular edge — top catch light */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: "linear-gradient(180deg, rgba(255,255,255,0.028) 0%, transparent 38%)",
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <FilmGrain />

      {/* Geometry overlay */}
      <GeometryOverlay size={isWide ? 88 : 64} />

      {/* Play mark on YouTube cell */}
      {isLive && <PlayMark />}

      {/* Top row: index + status */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 22,
          right: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-faint)",
            fontWeight: 500,
          }}
        >
          {cell.index}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            fontSize: "0.59rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: meta.color,
          }}
        >
          {meta.label}
        </span>
      </div>

      {/* Bottom: category label + title */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-mono, ui-monospace, monospace)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--fg-faint)",
            fontWeight: 500,
            marginBottom: "0.45rem",
          }}
        >
          {cell.label}
        </p>
        <p
          style={{
            fontSize: isWide ? "1.45rem" : "1.12rem",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            color: "var(--fg)",
            background:
              "linear-gradient(177deg,#fff 0%,#dadee5 28%,#9aa0ab 55%,#c8ccd4 73%,#6e737d 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {cell.title}
        </p>
      </div>
    </div>
  );

  if (cell.href) {
    return (
      <Reveal delay={delay} className={isWide ? "col-span-2 sm:col-span-2" : ""}>
        <a href={cell.href} target={cell.external ? "_blank" : undefined} rel={cell.external ? "noopener noreferrer" : undefined} style={{ display: "block", textDecoration: "none" }} tabIndex={0}>
          {inner}
        </a>
      </Reveal>
    );
  }

  return (
    <Reveal delay={delay} className={isWide ? "col-span-2 sm:col-span-2" : ""}>
      {inner}
    </Reveal>
  );
}

export function StudioReel() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "clamp(10px, 1.2vw, 16px)",
      }}
    >
      {CELLS.map((cell, i) => (
        <ReelCell key={cell.index} cell={cell} delay={i * 80} />
      ))}
    </div>
  );
}
