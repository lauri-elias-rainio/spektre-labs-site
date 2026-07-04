import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import ShoreworldEngine from "@/components/shoreworld-engine";
import SignalRaymarch from "@/components/signal-raymarch";
import { createPageMetadata } from "@/lib/site";

/*
 * Spacing ladder (multiples of 0.25rem, modular scale):
 *   mt-4=1rem · mt-6=1.5rem · mt-8=2rem · mt-10=2.5rem · mt-12=3rem
 *   mt-16=4rem · mt-20=5rem · mt-28=7rem · mt-32=8rem · mt-44=11rem
 * Type ladder (DESIGN_SYSTEM §4.4):
 *   0.66rem=label · 0.88rem=fine · 0.92rem=body-sm · 1rem=body
 *   1.1rem=subhead · 1.25rem=lead · 2.1→2.8→4rem=h1 breakpoints
 * Thesis ratio: 2.25rem sm → 2.75rem lg — 1.22× step
 */

export const metadata: Metadata = createPageMetadata({
  title: "Shoreworld",
  description:
    "The unifying universe the films and games inhabit — one axiom, one aesthetic. Atlantean-cybernetic, dark-luxury. In development.",
  path: "/shoreworld",
  image: "/generated/shoreworld/hero.png",
});

const FRAMES: { src: string; caption: string; wide?: boolean }[] = [
  { src: "/generated/shoreworld/city.png", caption: "The Capital — radial symmetry over an obsidian sea", wide: true },
  { src: "/generated/shoreworld/gate.png", caption: "The Gate — the 1 = 1 sigil at its core" },
  { src: "/generated/shoreworld/interior.png", caption: "The Coherence Temple — one beam, perfect bilateral symmetry" },
  { src: "/generated/shoreworld/fleet.png", caption: "The Fleet — obsidian and platinum under twin moons" },
  { src: "/generated/shoreworld/throne.png", caption: "The Seat — sacred geometry in the void" },
];

const WORLD_PARAMS: { param: string; value: string; live?: boolean }[] = [
  { param: "Geography", value: "Drowned-and-risen civilization — obsidian coastlines, platinum spires" },
  { param: "Law", value: "Declared = realized — or the sea reclaims it" },
  { param: "Engine", value: "WebGPU · signed-distance field · raymarched per-frame on your GPU", live: true },
  { param: "Live surface", value: "/shoreworld/experience — procedural reality, not a render", live: true },
  { param: "Scale", value: "One world, five divisions — films · games · research · systems · studio" },
  { param: "Status", value: "World active · games in development · axiom shipped" },
];

export default function ShoreworldPage() {
  return (
    <div>
      {/* ── Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Shoreworld"
        description="The unifying universe the films and games inhabit. One world, one aesthetic, one axiom."
      />

      {/* σ-honest vision fence */}
      <Reveal delay={20} className="mt-6">
        <span className="label text-[var(--fg-faint)]">
          Vision · in development · not a shipped product
        </span>
      </Reveal>

      {/* ── World parameters — spec sheet ────────────────────────── */}
      {/* horizontal hairline table — each row is a precise parameter */}
      <Reveal delay={50} className="mt-12 sm:mt-16">
        <div>
          <p className="label mb-0 text-[var(--fg-faint)]">World parameters</p>
          <div className="mt-6 border-t border-[var(--line)]">
            {WORLD_PARAMS.map((row) => (
              <div
                key={row.param}
                className="flex gap-8 border-b border-[var(--line)] py-4 sm:py-5"
              >
                {/* label: 0.66rem, w-28 = 7rem */}
                <span className="label w-28 shrink-0 text-[var(--fg-faint)]">{row.param}</span>
                <span
                  className="text-[0.92rem] leading-[1.75]"
                  style={{ color: row.live ? "var(--fg-dim)" : "var(--fg-mute)" }}
                >
                  {row.value}
                  {row.live && (
                    <span
                      className="label ml-3 align-middle"
                      style={{ color: "var(--signal)" }}
                    >
                      LIVE
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Cinematic hero — LIVE engine windowed ────────────────── */}
      {/* The world is not a render behind glass: the procedural engine
          runs directly in the page, windowed, high-fps (instanced WebGPU →
          WebGL2, adaptive resolution). A generated still is the honest fallback. */}
      <Reveal delay={60} className="mt-16 sm:mt-20">
        <figure className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
          <div className="relative aspect-video w-full sm:aspect-[21/9]">
            <ShoreworldEngine windowed />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 via-black/30 to-transparent px-6 pb-4 pt-16 sm:px-8"
          >
            <div>
              <p className="label text-[var(--signal)]">The Coherence Capital · Live</p>
              {/* fine: 0.5rem — smallest readable at 160dpi */}
              <p className="label mt-1 text-[0.5rem] text-[var(--fg-faint)]">
                Generated on your GPU · perfect symmetry · nothing pre-rendered
              </p>
            </div>
            <span
              className="metal-text text-[2.4rem] leading-none sm:text-[3rem]"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              1=1
            </span>
          </div>
        </figure>
      </Reveal>

      {/* ── Enter the live experience — headline CTA ─────────────── */}
      <Reveal delay={90} className="mt-10 sm:mt-12">
        <a
          href="/shoreworld/experience"
          className="group flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--line)] px-6 py-7 no-underline transition-colors duration-500 hover:border-[var(--line-strong)] sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-8"
          style={{ background: "rgba(10,12,16,0.55)" }}
        >
          <div>
            <p
              className="label mb-3 text-[0.56rem] tracking-[0.26em]"
              style={{ color: "var(--signal)" }}
            >
              Live · Procedural reality engine
            </p>
            {/* subhead: 1.5rem sm — 1.2× step from 1.25rem lead */}
            <p
              className="text-[1.25rem] font-semibold tracking-[-0.03em] sm:text-[1.5rem]"
              style={{ color: "var(--fg)" }}
            >
              Enter the Coherence Capital
            </p>
            <p
              className="mt-2 max-w-[48ch] text-[0.92rem] leading-[1.75]"
              style={{ color: "var(--fg-mute)" }}
            >
              The world generated live on your GPU — WebGPU, perfect symmetry, computed in real
              time on supported hardware. Not a render. The math, running.
            </p>
          </div>
          <span
            className="btn-metal shrink-0 self-start rounded-[8px] px-5 py-2.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] transition-transform duration-300 group-hover:translate-x-1 sm:self-center"
            aria-hidden
          >
            Enter →
          </span>
        </a>
      </Reveal>

      {/* ── The premise ──────────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">The premise</p>
            </div>
            <div className="lg:col-span-8">
              {/* thesis display: 2.25rem sm → 2.75rem lg */}
              <p
                className="mb-6 metal-text text-[1.4rem] font-semibold leading-[1.2] tracking-[-0.03em] sm:text-[1.75rem]"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                Where coherence holds, the platinum stands. Where it breaks, the sea takes it back.
              </p>
              {/* lead: 1.1rem sm / 1.25rem */}
              <p className="max-w-[44rem] text-[1.05rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.15rem]">
                A drowned-and-risen civilization that survived by making one law absolute:
                <span className="text-[var(--fg)]"> declared must equal realized.</span> Every
                frame, every game, every artifact obeys the same invariant —{" "}
                <span className="metal-text">1 = 1</span>. The aesthetic is not set dressing.
                It is the law made visible.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── The Shore — raymarched live ───────────────────────────── */}
      {/* A colossal double-ring gate in a black ocean, streak reflections,
          twin moons, one volumetric signal beam. Raw WebGL2 SDF — every
          frame computed on the visitor's GPU, nothing pre-rendered. */}
      <Reveal delay={40} className="mt-16 sm:mt-20">
        <figure className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
          <div className="relative aspect-video w-full bg-black sm:aspect-[21/9]">
            <SignalRaymarch variant="shore" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 via-black/25 to-transparent px-6 pb-4 pt-16 sm:px-8"
          >
            <div>
              <p className="label text-[var(--signal)]">The Shore · Live raymarch</p>
              <p className="label mt-1 text-[0.5rem] text-[var(--fg-faint)]">
                Signed-distance field · computed per-frame on your GPU
              </p>
            </div>
            <span
              className="metal-text text-[2.4rem] leading-none sm:text-[3rem]"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              ⟐
            </span>
          </div>
        </figure>
      </Reveal>

      {/* ── Glyph divider ────────────────────────────────────────── */}
      <div className="mt-16 flex justify-center sm:mt-20">
        <Glyph variant="divider" size={200} strokeOpacity={0.32} />
      </div>

      {/* ── Concept gallery ──────────────────────────────────────── */}
      <section className="mt-12 sm:mt-16">
        <Reveal>
          <p className="label mb-8 text-[var(--fg-faint)]">Concept · generated in-canon</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {FRAMES.map((f, i) => (
            <Reveal
              key={f.src}
              delay={Math.min(i * 80, 240)}
              className={f.wide ? "sm:col-span-2" : ""}
            >
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

      {/* ── Honest footer ────────────────────────────────────────── */}
      <Reveal>
        <div className="mt-20 border-t border-[var(--line)] pt-10 sm:mt-28">
          <p className="label text-[var(--fg-faint)]">
            All frames generated in the Spektre canon (Imagen) · the world is in development · the axiom is shipped
          </p>
        </div>
      </Reveal>

      <div className="mt-32 lg:mt-44" />
    </div>
  );
}
