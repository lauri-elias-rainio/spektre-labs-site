import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

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

export default function ShoreworldPage() {
  return (
    <div>
      <PageHeader
        title="Shoreworld"
        description="The unifying universe the films and games inhabit. One world, one aesthetic, one axiom."
      />

      {/* VISION fence — σ-honest */}
      <Reveal delay={20} className="mt-6">
        <span className="label text-[var(--fg-faint)]">Vision · in development · not a shipped product</span>
      </Reveal>

      {/* cinematic hero */}
      <Reveal delay={60} className="mt-10 sm:mt-12">
        <figure className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/generated/shoreworld/hero.png" alt="Shoreworld — the Atlantean-cybernetic capital"
               className="aspect-video w-full object-cover" loading="eager" />
        </figure>
      </Reveal>

      {/* ENTER the live procedural engine — the headline act */}
      <Reveal delay={90} className="mt-10 sm:mt-12">
        <a
          href="/shoreworld/experience"
          className="group flex flex-col gap-5 rounded-[var(--radius)] border border-[var(--line)] px-6 py-7 no-underline transition-colors duration-500 hover:border-[var(--line-strong)] sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-8"
          style={{ background: "rgba(10,12,16,0.55)" }}
        >
          <div>
            <p className="label mb-3 text-[0.56rem] tracking-[0.26em]" style={{ color: "var(--signal)" }}>
              Live · Procedural reality engine
            </p>
            <p className="text-[1.25rem] font-semibold tracking-[-0.03em] sm:text-[1.5rem]" style={{ color: "var(--fg)" }}>
              Enter the Coherence Capital
            </p>
            <p className="mt-2 max-w-[48ch] text-[0.92rem] leading-[1.7]" style={{ color: "var(--fg-mute)" }}>
              The world generated live on your GPU — WebGPU, perfect symmetry, no lag. Not a render. The math, running.
            </p>
          </div>
          <span
            className="btn-metal shrink-0 self-start transition-transform duration-300 group-hover:translate-x-1 sm:self-center"
            aria-hidden
          >
            Enter →
          </span>
        </a>
      </Reveal>

      {/* the premise */}
      <section className="mt-16 sm:mt-20">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">The premise</p>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-[44rem] text-[1.1rem] leading-[1.7] text-[var(--fg-dim)] sm:text-[1.25rem]">
                A drowned-and-risen civilization that survived by making one law absolute:
                <span className="text-[var(--fg)]"> declared must equal realized.</span> Where coherence
                holds, the platinum stands; where it breaks, the sea takes it back. Every frame, every
                game, every artifact obeys the same invariant — <span className="metal-text">1 = 1</span>.
                The aesthetic is not set dressing. It is the law made visible.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mt-16 flex justify-center sm:mt-20">
        <Glyph variant="divider" size={200} strokeOpacity={0.32} />
      </div>

      {/* concept gallery */}
      <section className="mt-12 sm:mt-16">
        <Reveal>
          <p className="label mb-8 text-[var(--fg-faint)]">Concept · generated in-canon</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {FRAMES.map((f, i) => (
            <Reveal key={f.src} delay={Math.min(i * 80, 240)}
                    className={f.wide ? "sm:col-span-2" : ""}>
              <figure className="group overflow-hidden rounded-[12px] border border-[var(--line)] transition-colors duration-500 hover:border-[var(--line-strong)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt={f.caption} loading="lazy"
                     className="aspect-video w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-100" />
                <figcaption className="label flex items-center justify-between px-4 py-3 text-[var(--fg-faint)]">
                  <span>{f.caption}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* honest footer */}
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
