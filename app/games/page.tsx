import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

/*
 * Spacing ladder (multiples of 0.25rem, modular scale):
 *   mt-4=1rem · mt-6=1.5rem · mt-8=2rem · mt-10=2.5rem · mt-12=3rem
 *   mt-16=4rem · mt-20=5rem · mt-28=7rem · mt-32=8rem · mt-44=11rem
 * Type ladder (DESIGN_SYSTEM §4.4):
 *   0.66rem=label · 0.88rem=fine · 0.92rem=body-sm · 1rem=body
 *   1.1rem=subhead · 1.25rem=lead · 2.1→2.8→4rem=h1 breakpoints
 *   clamp(3.6rem,8.8vw,7.4rem)=hero-display
 * Ratio used for thesis display: 2.25rem sm / 2.75rem lg — 1.22× step
 */

export const metadata: Metadata = createPageMetadata({
  title: "Games",
  description:
    "Coherence as interactive structure — AAA generative worlds derived from the axiom. In development.",
  path: "/games",
  image: "/generated/games/hero.png",
});

const FRAMES: { src: string; caption: string }[] = [
  { src: "/generated/games/arena.png", caption: "The Arena — a coherence field at center" },
  { src: "/generated/games/world.png", caption: "The Vista — Atlantean ruins, twin moons" },
];

const SPEC: { label: string; value: string }[] = [
  { label: "World", value: "Shoreworld" },
  { label: "Engine", value: "WebGPU · procedural" },
  { label: "Genre", value: "AAA open world" },
  { label: "Axiom", value: "1 = 1" },
  { label: "Status", value: "Vision · roadmap" },
];

const PILLARS: { index: string; name: string; body: string }[] = [
  {
    index: "01",
    name: "Procedural",
    body: "Every structure is generated from rules, not placed by hand. The world emerges from the axiom — not from a level designer's decisions.",
  },
  {
    index: "02",
    name: "Dark-luxury",
    body: "Industrial dark minimalism. Obsidian surfaces, platinum hairlines, one cold signal. The aesthetic is the law made material.",
  },
  {
    index: "03",
    name: "Coherent",
    body: "Systems that lie collapse. The player doesn't fight enemies — they restore the line between what was declared and what was realized.",
  },
];

export default function GamesPage() {
  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Games"
        description="Coherence as interactive structure. Playable worlds derived from one axiom — generative, AAA, dark-luxury."
      />

      {/* σ-honest vision fence */}
      <Reveal delay={20} className="mt-6">
        <span className="label text-[var(--fg-faint)]">
          Vision · in design · not a shipped product
        </span>
      </Reveal>

      {/* ── Hero image ───────────────────────────────────────────── */}
      <Reveal delay={60} className="mt-10 sm:mt-12">
        <figure className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/generated/games/hero.png"
            alt="Games — a monolith crowned with the 1=1 sigil"
            className="aspect-video w-full object-cover"
            loading="eager"
          />
        </figure>
      </Reveal>

      {/* ── Spec sheet ───────────────────────────────────────────── */}
      {/* horizontal hairline grid — Abloh-grade spec rail */}
      <Reveal delay={80} className="mt-16 sm:mt-20">
        <div className="border-t border-[var(--line)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {SPEC.map((s, i) => (
              <div
                key={s.label}
                /* right hairline on all but last per row */
                className={[
                  "px-6 py-5 sm:px-7",
                  i < SPEC.length - 1
                    ? "border-r border-[var(--line)]"
                    : "",
                ].join(" ")}
              >
                <p className="label text-[var(--fg-faint)]">{s.label}</p>
                {/* body-sm: 0.92rem */}
                <p className="mt-2 text-[0.92rem] text-[var(--fg-dim)]">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="h-px bg-[var(--line)]" />
        </div>
      </Reveal>

      {/* ── Thesis ───────────────────────────────────────────────── */}
      {/* display: 2.25rem sm → 2.75rem lg; ratio 1.22× (type ladder step) */}
      <Reveal className="mt-20 sm:mt-28">
        <div className="max-w-[54rem]">
          <p className="label mb-6 text-[var(--fg-faint)]">Thesis</p>
          <p
            className="metal-text text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[2.25rem] lg:text-[2.75rem]"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            The world holds where coherence holds — it fractures where
            the declared and the realized diverge.
          </p>
        </div>
      </Reveal>

      {/* ── The premise ──────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">The premise</p>
            </div>
            <div className="lg:col-span-8">
              {/* lead: 1.25rem */}
              <p className="max-w-[44rem] text-[1.1rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.25rem]">
                A game is a system you inhabit. Spektre games are built on the same invariant as
                everything else —{" "}
                <span className="metal-text">1 = 1</span>. The world holds where coherence
                holds; it fractures where the declared and the realized diverge. The player
                doesn&rsquo;t fight a story — they{" "}
                <span className="text-[var(--fg)]">restore the line.</span> Generative,
                procedural, set in Shoreworld.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Design pillars ───────────────────────────────────────── */}
      <section className="mt-20 sm:mt-28">
        <Reveal>
          <p className="label mb-8 text-[var(--fg-faint)]">Design pillars</p>
        </Reveal>
        {/* hairline-grid gap-px trick: bg = hairline color, children bg = base */}
        <div className="grid gap-px bg-[var(--line)] sm:grid-cols-3">
          {PILLARS.map((p) => (
            <Reveal key={p.index}>
              <div className="bg-[var(--bg)] px-8 py-8 sm:px-9 sm:py-9">
                <p className="label mb-5 text-[var(--fg-faint)]">
                  {p.index} / {p.name}
                </p>
                {/* body-sm: 0.92rem */}
                <p className="text-[0.92rem] leading-[1.8] text-[var(--fg-dim)]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="h-px bg-[var(--line)]" />
      </section>

      {/* ── Glyph divider ────────────────────────────────────────── */}
      <div className="mt-16 flex justify-center sm:mt-20">
        <Glyph variant="divider" size={200} strokeOpacity={0.32} />
      </div>

      {/* ── Key art gallery ──────────────────────────────────────── */}
      <section className="mt-12 sm:mt-16">
        <Reveal>
          <p className="label mb-8 text-[var(--fg-faint)]">Key art · generated in-canon</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {FRAMES.map((f, i) => (
            <Reveal key={f.src} delay={Math.min(i * 90, 240)}>
              <figure className="group overflow-hidden rounded-[12px] border border-[var(--line)] transition-colors duration-500 hover:border-[var(--line-strong)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.src}
                  alt={f.caption}
                  loading="lazy"
                  className="aspect-video w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
                />
                <figcaption className="label flex items-center justify-between px-4 py-3 text-[var(--fg-faint)]">
                  <span>{f.caption}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <Reveal>
        <div className="mt-20 border-t border-[var(--line)] pt-10 sm:mt-28">
          <p className="label text-[var(--fg-faint)]">
            Key art generated in the Spektre canon (Imagen) · games in development · the axiom is shipped
          </p>
        </div>
      </Reveal>

      <div className="mt-32 lg:mt-44" />
    </div>
  );
}
