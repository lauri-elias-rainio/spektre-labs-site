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

/*
  /manifesto — pure typographic monument.
  Scale: DESIGN_SYSTEM §4.4 modular major-third ladder.
    hero        → display-xl  clamp(3.5rem,8vw,7rem) — the var(--display) range
    closing     → display-l   clamp(2.5rem,5vw,4rem)
    stanzas     → body-l      1.125rem · serif (--font-display) · generous void
    promise     → body        1rem
    labels      → .label      0.66rem / 0.24em / uppercase
  Vertical cadence: multiples of 1rem (mt-12=3, mt-16=4, mt-20=5, mt-24=6).
  Text column: max-w-[52rem] (stanzas centered).
  Monument: full-page centered axis; serif stanzas; void between lines = 3rem/4rem.
  DESIGN_SYSTEM §6.2: brand moments centered on page axis — bilateral symmetry.
*/

/* One line per stanza — each earns its place. */
const STANZAS = [
  "1 = 1. What you say should equal what you do. σ is the gap between them — we measure it.",
  "We do not ship hype. We ship the smaller true thing over the larger false one.",
  "We subtract until only the necessary remains, render it in one cold language, and prove every claim a stranger could doubt.",
  "One operator, every substrate — physics, code, capital, mind. The same invariant, checkable at each layer against the last.",
  "We will not fool ourselves. Nothing is done until it is realized and verified against the reigning standard — never our own word for it.",
  "When declared is not yet realized, we publish the gap. The number cannot lie, and neither will we.",
  "Perfect symmetry is 1 = 1 rendered. Left equals right. Declared equals realized. Geometry, never decoration.",
  "We would rather publish nothing than publish a B. An empty page is coherent; a mediocre one is a lie.",
  "Independent. Helsinki. We answer to the axiom, not to permission.",
];

export default function ManifestoPage() {
  return (
    <div className="relative text-center">

      {/* ── Opening label — centered bilateral axis ─────────────────── */}
      <Reveal delay={0} className="flex items-center justify-center gap-4">
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--fg-faint)]">Manifesto · Spektre Labs</span>
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
      </Reveal>

      {/* ── Hero statement — display-xl, centered §6.2 brand moment ─── */}
      {/* display-xl: clamp(3.5rem,8vw,7rem) §4.4 */}
      <Reveal delay={80} className="mt-12 sm:mt-16 lg:mt-20">
        <h1
          className="metal-text font-semibold tracking-[-0.045em] leading-[1.02]"
          style={{ fontSize: "clamp(3.5rem,8vw,7rem)" }}
        >
          We hold one line.
        </h1>
      </Reveal>

      <Reveal delay={180} className="mt-5 sm:mt-7">
        {/* display-xl — same scale as h1 §4.4 */}
        <p
          className="font-semibold tracking-[-0.045em] leading-[1.02]"
          style={{ fontSize: "clamp(3.5rem,8vw,7rem)", color: "var(--signal)" }}
        >
          1 = 1.
        </p>
      </Reveal>

      {/* Full-width hairline — mt-16/20/24 = 4/5/6rem */}
      <Reveal delay={260}>
        <div className="rule mt-16 sm:mt-20 lg:mt-24" />
      </Reveal>

      {/* ── Manifesto body — typographic monument ───────────────────── */}
      {/*
        Serif stanzas: font-display (Times-class) · body-l 1.125rem · leading-[1.72].
        Void between stanzas: my-12 sm:my-16 = 3rem/4rem — generous, monumental.
        DESIGN_SYSTEM §4.1: serif states the thesis; §7 type is editorial.
      */}
      <div className="mt-16 sm:mt-20 lg:mt-24 mx-auto max-w-[52rem]">
        {STANZAS.map((line, i) => (
          <div key={i}>
            {i > 0 ? (
              <Reveal delay={300 + i * 90}>
                {/* my-12/my-16 = 3/4rem — generous monument void */}
                <div className="hair-x mx-auto my-12 w-24 sm:my-16 sm:w-32" />
              </Reveal>
            ) : null}
            <Reveal
              as="p"
              delay={340 + i * 90}
              className="text-balance leading-[1.72] text-[var(--fg-dim)]"
              style={{
                fontSize: "1.125rem",
                fontFamily: "var(--font-display), Times New Roman, serif",
              }}
            >
              {line}
            </Reveal>
          </div>
        ))}
      </div>

      {/* ── Divider hairline ────────────────────────────────────────── */}
      <Reveal delay={660} className="mt-16 sm:mt-20 lg:mt-24">
        <div className="rule" />
      </Reveal>

      {/* ── Closing statement — display-l §4.4 ────────────────────── */}
      {/* display-l: clamp(2.5rem,5vw,4rem) — centered §6.2 */}
      <Reveal delay={740} className="mt-12 sm:mt-16 lg:mt-20">
        <p
          className="metal-text font-semibold tracking-[-0.04em] leading-[1.08] mx-auto"
          style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}
        >
          Coherence is the standard.<br />
          We are the proof.
        </p>
      </Reveal>

      <Reveal delay={840} className="mt-8 sm:mt-10 flex items-center justify-center gap-4">
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="label text-[var(--fg-mute)]">— Spektre Labs</span>
        <span className="h-px w-6 bg-[var(--line-strong)]" aria-hidden="true" />
      </Reveal>

      {/* ── Promise block — centered surface §4.4 body 1rem ────────── */}
      {/* padding: px-8 py-6 sm:px-10 sm:py-8 = 2/1.5rem → 2.5/2rem (symmetric ratio) */}
      <Reveal delay={920} className="mt-14 sm:mt-16 lg:mt-20 flex justify-center">
        <div className="surface inline-block rounded-[var(--radius)] px-8 py-6 sm:px-10 sm:py-8 text-left">
          <p className="label mb-2 text-[var(--fg-faint)]">The promise</p>
          {/* body: 1rem §4.4 */}
          <p
            className="leading-[1.72]"
            style={{ fontSize: "1rem", color: "var(--fg-dim)" }}
          >
            What we declare, we will realize —{" "}
            <span style={{ color: "var(--signal)" }}>and you can check.</span>
          </p>
        </div>
      </Reveal>

      {/* ── Closing seal — §12.1 signature moment #7: the closing 1=1 ── */}
      {/* cadence: mt-40/56/72 = 10/14/18rem — maximum void for the monument close */}
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
