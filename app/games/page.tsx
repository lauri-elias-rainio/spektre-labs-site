import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

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

export default function GamesPage() {
  return (
    <div>
      <PageHeader
        title="Games"
        description="Coherence as interactive structure. Playable worlds derived from one axiom — generative, AAA, dark-luxury."
      />

      <Reveal delay={20} className="mt-6">
        <span className="label text-[var(--fg-faint)]">Vision · in development · not a shipped product</span>
      </Reveal>

      <Reveal delay={60} className="mt-10 sm:mt-12">
        <figure className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/generated/games/hero.png" alt="Games — a monolith crowned with the 1=1 sigil"
               className="aspect-video w-full object-cover" loading="eager" />
        </figure>
      </Reveal>

      <section className="mt-16 sm:mt-20">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">The premise</p>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-[44rem] text-[1.1rem] leading-[1.7] text-[var(--fg-dim)] sm:text-[1.25rem]">
                A game is a system you inhabit. Spektre games are built on the same invariant as everything
                else — <span className="metal-text">1 = 1</span>. The world holds where coherence holds; it
                fractures where the declared and the realized diverge. The player doesn&rsquo;t fight a
                story — they <span className="text-[var(--fg)]">restore the line.</span> Generative,
                procedural, set in Shoreworld.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mt-16 flex justify-center sm:mt-20">
        <Glyph variant="divider" size={200} strokeOpacity={0.32} />
      </div>

      <section className="mt-12 sm:mt-16">
        <Reveal>
          <p className="label mb-8 text-[var(--fg-faint)]">Key art · generated in-canon</p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {FRAMES.map((f, i) => (
            <Reveal key={f.src} delay={Math.min(i * 90, 240)}>
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
