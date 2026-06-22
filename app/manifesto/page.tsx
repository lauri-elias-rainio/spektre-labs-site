import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Manifesto",
  description:
    "We hold one line: 1 = 1. What we declare, we will realize — and you can check.",
  path: "/manifesto",
});

const PARAGRAPHS = [
  "What you declare must equal what you realize. Everywhere we looked — in machines, in institutions, in money, in a person's word — there was a gap. The world had agreed to stop seeing it. We named it. We call the distance σ, and we built instruments to close it.",
  "We do not ship hype. We ship the smaller true thing over the larger false one. We subtract until only the necessary remains, render it in one cold language, and prove every claim a stranger could doubt. When what we declared is not yet realized, we publish the gap — because the number cannot lie, and neither will we.",
  "This is a research lab the size of a universe and the discipline of a single line. From theory, to code, to cinema, to worlds — one axiom, one standard, no exceptions.",
];

export default function ManifestoPage() {
  return (
    <div className="relative">

      {/* ── Opening label ──────────────────────────────────────────────── */}
      <Reveal delay={0} className="flex items-center gap-4">
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--fg-faint)]">Manifesto · Spektre Labs</span>
      </Reveal>

      {/* ── Hero statement ─────────────────────────────────────────────── */}
      <Reveal delay={80} className="mt-12 sm:mt-16 lg:mt-20">
        <h1
          className="metal-text font-semibold tracking-[-0.04em] leading-[1.02] text-[3.4rem] sm:text-[5rem] lg:text-[6.4rem] text-balance"
          style={{ maxWidth: "18ch" }}
        >
          We hold one line.
        </h1>
      </Reveal>

      <Reveal delay={180} className="mt-5 sm:mt-7">
        <p
          className="font-semibold tracking-[-0.04em] leading-[1.02] text-[3.4rem] sm:text-[5rem] lg:text-[6.4rem]"
          style={{ color: "var(--signal)" }}
        >
          1 = 1.
        </p>
      </Reveal>

      {/* Full-width hairline */}
      <Reveal delay={260}>
        <div className="rule mt-14 sm:mt-18 lg:mt-24" />
      </Reveal>

      {/* ── Manifesto body ─────────────────────────────────────────────── */}
      <div className="mt-14 sm:mt-18 lg:mt-24 max-w-[44rem]">
        {PARAGRAPHS.map((para, i) => (
          <Reveal key={i} as="p" delay={320 + i * 110}
            className="text-[1.12rem] sm:text-[1.22rem] leading-[1.85] text-[var(--fg-dim)] mt-8 first:mt-0"
          >
            {para}
          </Reveal>
        ))}
      </div>

      {/* ── Divider glyph ──────────────────────────────────────────────── */}
      <Reveal delay={660} className="mt-16 sm:mt-20 lg:mt-28">
        <div className="rule" />
      </Reveal>

      {/* ── Closing statement + signature ──────────────────────────────── */}
      <Reveal delay={740} className="mt-12 sm:mt-16 lg:mt-20 max-w-[44rem]">
        <p
          className="metal-text font-semibold tracking-[-0.035em] leading-[1.08] text-[1.9rem] sm:text-[2.6rem] lg:text-[3rem]"
        >
          Coherence is the standard.<br />
          We are the proof.
        </p>
      </Reveal>

      <Reveal delay={840} className="mt-8 sm:mt-10 flex items-center gap-4">
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--fg-mute)]">— Spektre Labs</span>
      </Reveal>

      {/* ── Promise line ───────────────────────────────────────────────── */}
      <Reveal delay={920} className="mt-14 sm:mt-16 lg:mt-20">
        <div className="surface inline-block rounded-[var(--radius)] px-7 py-5 sm:px-9 sm:py-6">
          <p className="label mb-2 text-[var(--fg-faint)]">The promise</p>
          <p className="text-[0.97rem] sm:text-[1.05rem] leading-[1.7] text-[var(--fg-dim)]">
            What we declare, we will realize —{" "}
            <span className="text-[var(--signal)]">and you can check.</span>
          </p>
        </div>
      </Reveal>

      {/* ── Closing seal ───────────────────────────────────────────────── */}
      <Reveal
        delay={0}
        className="mt-40 flex flex-col items-center gap-6 sm:mt-56 lg:mt-72"
      >
        <Glyph variant="seal" size={140} strokeOpacity={0.22} />
        <div className="flex flex-col items-center gap-2">
          <p className="label text-[var(--fg-faint)]">σ = realized − declared</p>
          <Glyph variant="divider" size={160} strokeOpacity={0.14} />
        </div>
        <p className="label text-[var(--fg-faint)]">Spektre Labs · 1 = 1</p>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
