import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import SignalRaymarch from "@/components/signal-raymarch";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Universe",
  description:
    "The Spektre Labs divisions map. Research → Systems → Studio → Games → Shoreworld. One axiom: 1 = 1.",
  path: "/universe",
  image: "/generated/og/universe.png",
});

/*
  /universe — world map of the six arenas.
  Scale: DESIGN_SYSTEM §4.4 modular major-third ladder.
    h1        → display-l  clamp(2.5rem,5vw,4rem)
    division  → title      1.75rem
    lead/body → body-l     1.125rem  / body 1rem
    secondary → caption    0.875rem
    labels    → .label     0.66rem / 0.24em / uppercase
  Vertical cadence: multiples of 1rem (Tailwind 4 = 1rem).
  Text columns: max-w-[65ch].
  Cartography: 3×2 hairline grid, six arenas (gap-px on --line bg = 1px lines).
*/

type TierKey = "REAL" | "EMERGING" | "VISION";

type Arena = {
  index: string;
  name: string;
  substrate: string;
  tier: TierKey;
};

type Division = {
  index: string;
  name: string;
  substrate: string;
  line: string;
  tier: TierKey;
  href?: string;
  img: string;
};

/* Six arenas — DESIGN_SYSTEM §11 substrates, split at Theory/Canon boundary */
const ARENAS: Arena[] = [
  { index: "01", name: "Research",   substrate: "Formal Theory · K_crit · σ", tier: "REAL"     },
  { index: "02", name: "Corpus",     substrate: "Written Canon · Protocol",    tier: "REAL"     },
  { index: "03", name: "Systems",    substrate: "σ-gate · Executable Tools",   tier: "REAL"     },
  { index: "04", name: "Studio",     substrate: "Film · Media · Broadcast",    tier: "EMERGING" },
  { index: "05", name: "Games",      substrate: "AAA Generative Worlds",       tier: "VISION"   },
  { index: "06", name: "Shoreworld", substrate: "The World · IP · Mythology",  tier: "VISION"   },
];

const DIVISIONS: Division[] = [
  {
    index: "01",
    name: "Research",
    substrate: "Corpus · Protocol",
    line: "The source. Formal theory of coherence — K_crit, σ — everything is licensed by this.",
    tier: "REAL",
    href: "/research",
    img: "/generated/divisions/research.png",
  },
  {
    index: "02",
    name: "Systems",
    substrate: "σ-gate · open core",
    line: "Coherence as executable tools. The theory, proven in code.",
    tier: "REAL",
    href: "/systems",
    img: "/generated/divisions/systems.png",
  },
  {
    index: "03",
    name: "Studio",
    substrate: "Film · Media",
    line: "Coherence as narrative. Dark-luxury sci-fi aesthetic generated and broadcast.",
    tier: "EMERGING",
    href: "/studio",
    img: "/generated/divisions/studio-2.png",
  },
  {
    index: "04",
    name: "Games",
    substrate: "AAA Generative Worlds",
    line: "Coherence as interactive structure. Playable worlds derived from the axiom.",
    tier: "VISION",
    href: "/games",
    img: "/generated/divisions/games.png",
  },
  {
    index: "05",
    name: "Shoreworld",
    substrate: "The World · IP",
    line: "The fiction the films and games inhabit. One universe, one aesthetic, one axiom.",
    tier: "VISION",
    href: "/shoreworld",
    img: "/generated/divisions/shoreworld.png",
  },
];

const TIER_COLOR: Record<TierKey, string> = {
  REAL:     "var(--signal)",
  EMERGING: "var(--metal-2)",
  VISION:   "var(--fg-faint)",
};

const TIER_DOT_OPACITY: Record<TierKey, number> = {
  REAL:     1,
  EMERGING: 0.6,
  VISION:   0.3,
};

export default function UniversePage() {
  return (
    <div>
      {/* ── Masthead ──────────────────────────────────────────────────── */}
      <div className="relative -mx-6 overflow-hidden px-6 pt-20 pb-0 sm:-mx-10 sm:px-10 sm:pt-28 lg:-mx-14 lg:px-14 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <div className="absolute inset-y-0 right-0 w-full sm:w-[68%]">
            <SignalRaymarch />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(80% 95% at 72% 32%, transparent 0%, #000 74%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>

        <Reveal delay={0}>
          <p className="label mb-6" style={{ color: "var(--fg-faint)" }}>
            Spektre Labs · Universe
          </p>
        </Reveal>

        <Reveal delay={60}>
          {/* display-l: clamp(2.5rem,5vw,4rem) — sub-page hero scale §4.4 */}
          <h1
            className="metal-text font-semibold leading-[1.02] tracking-[-0.045em]"
            style={{ fontSize: "clamp(2.5rem,5vw,4rem)", maxWidth: "18ch" }}
          >
            Five divisions.<br />One axiom.
          </h1>
        </Reveal>

        <Reveal delay={140}>
          {/* body-l: 1.125rem §4.4 · 65ch column */}
          <p
            className="mt-8 leading-[1.72]"
            style={{ fontSize: "1.125rem", color: "var(--fg-dim)", maxWidth: "65ch" }}
          >
            Every substrate — research, code, film, game, world — renders the same invariant.
            The medium changes. The constant does not.
          </p>
        </Reveal>
      </div>

      {/* ── Axiom seal — 1 = 1 — perfectly symmetric center anchor ─── */}
      <Reveal delay={200} className="mt-20 flex flex-col items-center gap-6 sm:mt-28">
        <Glyph variant="seal" size={160} strokeOpacity={0.38} />
        <div className="text-center">
          {/* .label: 0.66rem / 0.24em / uppercase §4.2 */}
          <p className="label" style={{ color: "var(--metal-3)" }}>1 = 1</p>
          <p className="label mt-1" style={{ color: "var(--fg-faint)" }}>declared = realized</p>
        </div>
      </Reveal>

      {/* ── World Cartography — 3×2 hairline spec grid of six arenas ─── */}
      {/* gap-px on --line background = 1px hairline between cells (DESIGN_SYSTEM §6.1) */}
      <Reveal delay={260} className="mt-24 sm:mt-32">
        <div className="mb-8 flex items-center gap-6">
          <p className="label" style={{ color: "var(--fg-faint)" }}>World Map · Six Arenas</p>
          <div className="h-px flex-1" style={{ background: "var(--line)" }} />
          <p className="label" style={{ color: "var(--fg-faint)" }}>1 = 1</p>
        </div>

        <div
          className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]"
          role="list"
          aria-label="The six Spektre arenas"
        >
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-px"
            style={{ background: "var(--line)" }}
          >
            {ARENAS.map((arena) => (
              <div
                key={arena.name}
                role="listitem"
                className="px-6 py-7 sm:px-7 sm:py-8"
                style={{ background: "var(--bg)" }}
              >
                {/* tier dot + index */}
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      background: TIER_COLOR[arena.tier],
                      opacity: TIER_DOT_OPACITY[arena.tier],
                    }}
                  />
                  <span className="label" style={{ color: "var(--fg-faint)" }}>{arena.index}</span>
                </div>

                {/* arena name — title: 1.125rem body-l for compact grid cells */}
                <h3
                  className="mb-2 font-semibold leading-none tracking-[-0.025em]"
                  style={{
                    fontSize: "1.125rem",
                    color: arena.tier === "VISION" ? "var(--fg-dim)" : "var(--fg)",
                  }}
                >
                  {arena.name}
                </h3>

                {/* substrate label */}
                <p className="label" style={{ color: "var(--fg-faint)" }}>
                  {arena.substrate}
                </p>

                {/* tier — spacing: mt-4 = 1rem */}
                <p
                  className="label mt-4"
                  style={{
                    color: TIER_COLOR[arena.tier],
                    opacity: TIER_DOT_OPACITY[arena.tier],
                  }}
                >
                  {arena.tier}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Hairline rule ────────────────────────────────────────────── */}
      <Reveal delay={300} className="mt-24 sm:mt-32">
        <hr className="rule" />
      </Reveal>

      {/* ── Divisions — staggered detail list ────────────────────────── */}
      <div className="mt-16 sm:mt-20 space-y-0">
        {DIVISIONS.map((div, i) => {
          const Inner = (
            <div className="group relative flex flex-col gap-5 border-b border-[var(--line)] py-10 sm:py-12 sm:flex-row sm:items-start sm:gap-16">
              {/* mono index — .label class §4.2 */}
              <div className="shrink-0 sm:w-16">
                <span className="label" style={{ color: "var(--fg-faint)" }}>
                  {div.index}
                </span>
              </div>

              {/* main content */}
              <div className="flex-1 min-w-0">
                {/* tier badge */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{
                      background: TIER_COLOR[div.tier],
                      opacity: TIER_DOT_OPACITY[div.tier],
                    }}
                  />
                  <span
                    className="label"
                    style={{ color: TIER_COLOR[div.tier], opacity: TIER_DOT_OPACITY[div.tier] }}
                  >
                    {div.tier}
                  </span>
                </div>

                {/* name + substrate — title: 1.75rem §4.4 */}
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h2
                    className="font-semibold tracking-[-0.032em] leading-none"
                    style={{
                      fontSize: "1.75rem",
                      color: div.tier === "VISION" ? "var(--fg-dim)" : "var(--fg)",
                    }}
                  >
                    {div.name}
                  </h2>
                  <span className="label" style={{ color: "var(--fg-faint)" }}>
                    {div.substrate}
                  </span>
                </div>

                {/* honest line — body: 1rem / 65ch §4.4 */}
                <p
                  className="leading-[1.72]"
                  style={{
                    fontSize: "1rem",
                    color: div.tier === "VISION" ? "var(--fg-mute)" : "var(--fg-dim)",
                    maxWidth: "65ch",
                  }}
                >
                  {div.line}
                </p>

                {/* VISION fence */}
                {div.tier === "VISION" && (
                  <p className="label mt-3" style={{ color: "var(--fg-faint)", opacity: 0.6 }}>
                    Trajectory — not shipped product
                  </p>
                )}
              </div>

              {/* generated on-canon visual */}
              <div className="shrink-0 sm:w-64 lg:w-80">
                <div className="overflow-hidden rounded-[10px] border border-[var(--line)] transition-colors duration-500 group-hover:border-[var(--line-strong)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={div.img}
                    alt={`${div.name} — generated in the Spektre canon`}
                    loading="lazy"
                    className="aspect-video w-full object-cover opacity-75 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0"
                    style={div.tier === "VISION" ? { opacity: 0.55 } : undefined}
                  />
                </div>
              </div>

              {/* right status — mt-10 = 2.5rem aligns arrow to title center */}
              <div className="shrink-0 flex items-center self-center sm:self-start sm:mt-10">
                {div.href ? (
                  <span
                    className="label opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: "var(--signal)" }}
                  >
                    Explore →
                  </span>
                ) : (
                  <span className="label" style={{ color: "var(--fg-faint)", opacity: 0.4 }}>
                    Vision
                  </span>
                )}
              </div>
            </div>
          );

          return (
            <Reveal key={div.index} delay={80 + i * 90}>
              {div.href ? (
                <a
                  href={div.href}
                  className="block no-underline"
                  aria-label={`${div.name} — ${div.substrate}`}
                >
                  {Inner}
                </a>
              ) : (
                <div>{Inner}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* ── Trajectory rail — σ-honest arc ─────────────────────────── */}
      <Reveal delay={80} className="mt-24 sm:mt-32">
        <div
          className="rounded-[var(--radius)] border border-[var(--line)] px-8 py-8 sm:px-10 sm:py-10"
          style={{ background: "rgba(10,12,16,0.72)" }}
        >
          <p className="label mb-6" style={{ color: "var(--fg-faint)" }}>
            Trajectory · σ-honest arc
          </p>
          <div className="flex flex-wrap items-center gap-0">
            {[
              { label: "Research",   tier: "REAL"     as const },
              { label: "Systems",    tier: "REAL"     as const },
              { label: "Studio",     tier: "EMERGING" as const },
              { label: "Games",      tier: "VISION"   as const },
              { label: "Shoreworld", tier: "VISION"   as const },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-0">
                <div className="flex flex-col items-center gap-1.5 px-3 py-1">
                  {/* caption: 0.875rem §4.4 */}
                  <span
                    className="font-medium tracking-[-0.01em]"
                    style={{
                      fontSize: "0.875rem",
                      color:
                        item.tier === "VISION"   ? "var(--fg-faint)" :
                        item.tier === "EMERGING" ? "var(--fg-dim)"   : "var(--fg)",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="label"
                    style={{ color: TIER_COLOR[item.tier], opacity: TIER_DOT_OPACITY[item.tier] }}
                  >
                    {item.tier}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span className="mx-1 label" style={{ color: "var(--fg-faint)", opacity: 0.3 }}>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* caption: 0.875rem / 65ch */}
          <p
            className="mt-6 leading-[1.72]"
            style={{ fontSize: "0.875rem", color: "var(--fg-mute)", maxWidth: "65ch" }}
          >
            Each layer is licensed by the one above and rendered in the one style.
            REAL layers are active. EMERGING is live. VISION is the honest forward arc — not shipped product.
          </p>
        </div>
      </Reveal>

      {/* ── Final seal — perfect symmetry, 1 = 1 ──────────────────── */}
      <Reveal delay={0} className="mt-40 mb-20 flex flex-col items-center gap-8 lg:mt-52">
        <Glyph variant="seal" size={120} strokeOpacity={0.26} />
        <div className="text-center">
          <p className="label mb-2" style={{ color: "var(--fg-faint)" }}>
            Spektre Labs · Universe
          </p>
          <p className="label" style={{ color: "var(--fg-faint)", opacity: 0.5 }}>
            Research → Systems → Studio → Games → Shoreworld
          </p>
        </div>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
