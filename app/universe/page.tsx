import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Universe",
  description:
    "The Spektre Labs divisions map. Research → Systems → Studio → Games → Shoreworld. One axiom: 1 = 1.",
  path: "/universe",
});

/*
  /universe — immersive divisions map.
  Axiom: 1 = 1 (center Glyph seal).
  Five divisions: Research · Systems · Studio · Games · Shoreworld.
  σ-honest tier tags: REAL / EMERGING / VISION.
  Grammar: OLED black · platinum axis · one cold signal (#cfe3ff) ·
  mono-Abloh labels · Reveal stagger · generous black space.
  DO NOT fake anything (rule 7). Vision is fenced as vision.
*/

type Division = {
  index: string;       // mono 01–05
  name: string;
  substrate: string;   // one-word substrate line
  line: string;        // one honest line
  tier: "REAL" | "EMERGING" | "VISION";
  href?: string;       // only REAL/EMERGING divisions get a link
};

const DIVISIONS: Division[] = [
  {
    index: "01",
    name: "Research",
    substrate: "Corpus · Protocol",
    line: "The source. Formal theory of coherence — K_crit, σ — everything is licensed by this.",
    tier: "REAL",
    href: "/research",
  },
  {
    index: "02",
    name: "Systems",
    substrate: "σ-gate · Creation OS",
    line: "Coherence as executable tools. The theory proven and monetized in code.",
    tier: "REAL",
    href: "/systems",
  },
  {
    index: "03",
    name: "Studio",
    substrate: "Film · Media",
    line: "Coherence as narrative. Dark-luxury sci-fi aesthetic generated and broadcast.",
    tier: "EMERGING",
    href: "/studio",
  },
  {
    index: "04",
    name: "Games",
    substrate: "AAA Generative Worlds",
    line: "Coherence as interactive structure. Playable worlds derived from the axiom.",
    tier: "VISION",
  },
  {
    index: "05",
    name: "Shoreworld",
    substrate: "The World · IP",
    line: "The fiction the films and games inhabit. One universe, one aesthetic, one axiom.",
    tier: "VISION",
  },
];

const TIER_COLOR: Record<Division["tier"], string> = {
  REAL: "var(--signal)",
  EMERGING: "var(--metal-2)",
  VISION: "var(--fg-faint)",
};

const TIER_DOT_OPACITY: Record<Division["tier"], number> = {
  REAL: 1,
  EMERGING: 0.6,
  VISION: 0.3,
};

export default function UniversePage() {
  return (
    <div>
      {/* ── Masthead ────────────────────────────────────────────────── */}
      <div className="pt-20 pb-0 sm:pt-28 lg:pt-36">
        <Reveal delay={0}>
          <p className="label mb-6" style={{ color: "var(--fg-faint)" }}>
            Spektre Labs · Universe
          </p>
        </Reveal>

        <Reveal delay={60}>
          <h1
            className="metal-text text-[2.4rem] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-[3.2rem] lg:text-[4.2rem]"
            style={{ maxWidth: "18ch" }}
          >
            Five divisions.<br />One axiom.
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p
            className="mt-8 text-[1.02rem] leading-[1.84] sm:text-[1.1rem]"
            style={{ color: "var(--fg-dim)", maxWidth: "44ch" }}
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
          <p
            className="label text-[0.72rem] tracking-[0.38em]"
            style={{ color: "var(--metal-3)" }}
          >
            1 = 1
          </p>
          <p
            className="mt-1 label text-[0.55rem] tracking-[0.22em]"
            style={{ color: "var(--fg-faint)" }}
          >
            declared = realized
          </p>
        </div>
      </Reveal>

      {/* ── Hairline rule ────────────────────────────────────────────── */}
      <Reveal delay={240} className="mt-20 sm:mt-24">
        <hr className="rule" />
      </Reveal>

      {/* ── Divisions — staggered list ────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 space-y-0">
        {DIVISIONS.map((div, i) => {
          const Inner = (
            <div className="group relative flex flex-col gap-5 border-b border-[var(--line)] py-10 sm:py-12 sm:flex-row sm:items-start sm:gap-16">
              {/* mono index */}
              <div className="shrink-0 sm:w-16">
                <span
                  className="label text-[0.6rem] tracking-[0.3em]"
                  style={{ color: "var(--fg-faint)" }}
                >
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
                    className="label text-[0.58rem] tracking-[0.28em]"
                    style={{ color: TIER_COLOR[div.tier], opacity: TIER_DOT_OPACITY[div.tier] }}
                  >
                    {div.tier}
                  </span>
                </div>

                {/* name + substrate */}
                <div className="flex flex-wrap items-baseline gap-3 mb-3">
                  <h2
                    className="text-[1.7rem] font-semibold tracking-[-0.032em] leading-none sm:text-[2rem]"
                    style={{
                      color: div.tier === "VISION" ? "var(--fg-dim)" : "var(--fg)",
                    }}
                  >
                    {div.name}
                  </h2>
                  <span
                    className="label text-[0.62rem] tracking-[0.22em]"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    {div.substrate}
                  </span>
                </div>

                {/* honest line */}
                <p
                  className="text-[0.95rem] leading-[1.88] max-w-[52ch]"
                  style={{ color: div.tier === "VISION" ? "var(--fg-mute)" : "var(--fg-dim)" }}
                >
                  {div.line}
                </p>

                {/* VISION fence */}
                {div.tier === "VISION" && (
                  <p
                    className="mt-3 label text-[0.56rem] tracking-[0.22em]"
                    style={{ color: "var(--fg-faint)", opacity: 0.6 }}
                  >
                    Trajectory — not shipped product
                  </p>
                )}
              </div>

              {/* right arrow / status — only for linked divisions */}
              <div className="shrink-0 flex items-center self-center sm:self-start sm:mt-[2.6rem]">
                {div.href ? (
                  <span
                    className="label text-[0.6rem] tracking-[0.24em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ color: "var(--signal)" }}
                  >
                    Explore →
                  </span>
                ) : (
                  <span
                    className="label text-[0.6rem] tracking-[0.24em]"
                    style={{ color: "var(--fg-faint)", opacity: 0.4 }}
                  >
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

      {/* ── Trajectory rail — the arc σ-honest ─────────────────────── */}
      <Reveal delay={80} className="mt-24 sm:mt-32">
        <div
          className="rounded-[var(--radius)] border border-[var(--line)] px-7 py-8 sm:px-10 sm:py-10"
          style={{ background: "rgba(10,12,16,0.72)" }}
        >
          <p className="label mb-6" style={{ color: "var(--fg-faint)" }}>
            Trajectory · σ-honest arc
          </p>
          <div className="flex flex-wrap items-center gap-0">
            {[
              { label: "Research", tier: "REAL" as const },
              { label: "Systems", tier: "REAL" as const },
              { label: "Studio", tier: "EMERGING" as const },
              { label: "Games", tier: "VISION" as const },
              { label: "Shoreworld", tier: "VISION" as const },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-center gap-0">
                <div className="flex flex-col items-center gap-1.5 px-3 py-1">
                  <span
                    className="text-[0.88rem] font-medium tracking-[-0.01em]"
                    style={{
                      color: item.tier === "VISION" ? "var(--fg-faint)" : item.tier === "EMERGING" ? "var(--fg-dim)" : "var(--fg)",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="label text-[0.52rem] tracking-[0.22em]"
                    style={{ color: TIER_COLOR[item.tier], opacity: TIER_DOT_OPACITY[item.tier] }}
                  >
                    {item.tier}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span
                    className="mx-1 label text-[0.7rem]"
                    style={{ color: "var(--fg-faint)", opacity: 0.3 }}
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
          <p
            className="mt-6 text-[0.85rem] leading-[1.8]"
            style={{ color: "var(--fg-mute)", maxWidth: "56ch" }}
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
          <p
            className="label mb-2 text-[0.6rem] tracking-[0.28em]"
            style={{ color: "var(--fg-faint)" }}
          >
            Spektre Labs · Universe
          </p>
          <p
            className="label text-[0.54rem] tracking-[0.22em]"
            style={{ color: "var(--fg-faint)", opacity: 0.5 }}
          >
            Research → Systems → Studio → Games → Shoreworld
          </p>
        </div>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
