import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { StudioFilms } from "@/components/studio-films";
import { EditorialLink } from "@/components/editorial-link";
import { createPageMetadata } from "@/lib/site";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = createPageMetadata({
  title: "Studio",
  description:
    "AI-native film and media generation. Dark-luxury sci-fi aesthetics as the product. Spektre Labs Studio — from Research to Screen.",
  path: "/studio",
});

/*
  Studio page — the production arm of the Spektre universe.
  Divisions expressed σ-honestly:
    Research → Systems → Studio (EMERGING, YouTube live) →
    Games (VISION) → Shoreworld (VISION)
  Art-canon: OLED, platinum/chrome, hairline, film grain, specular,
  Atlantean sacred geometry, absolute symmetry.
*/

export default function StudioPage() {
  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────── */}
      <PageHeader
        title="Studio"
        description="AI-native film and media generation. The dark-luxury sci-fi aesthetic as the product."
      />

      {/* ── Opening statement — full editorial weight ───────────────── */}
      <Reveal delay={80} className="mt-14 sm:mt-16">
        <div className="max-w-[48rem]">
          <blockquote className="relative pl-6 sm:pl-8">
            <span
              className="pointer-events-none absolute left-0 top-[-0.15em] font-serif text-[3rem] leading-none select-none"
              style={{ color: "var(--metal-4)" }}
              aria-hidden
            >
              &ldquo;
            </span>
            <p
              className="text-pretty leading-[1.84] sm:text-[1.15rem] lg:text-[1.22rem]"
              style={{ color: "var(--fg-dim)" }}
            >
              The aesthetic is not decoration. It is the argument: structure persists,
              and coherence made visible is the rarest material.
            </p>
          </blockquote>
        </div>
      </Reveal>

      {/* ── Divider Glyph — absolute symmetry, 1 = 1 ───────────────── */}
      <Reveal delay={160} className="mt-16 flex justify-center">
        <Glyph variant="divider" size={260} strokeOpacity={0.35} />
      </Reveal>

      {/* ── Studio Mission ────────────────────────────────────────── */}
      <Section
        title="AI-Native Film Studio"
        eyebrow="Studio · Emerging"
        className="mt-24 pt-12 sm:mt-32 sm:pt-16 lg:mt-36 lg:pt-20"
      >
        <div className="max-w-[50rem]">
          {/* Metadata rail — Abloh mono labels */}
          <div className="mb-10 grid grid-cols-2 gap-0 sm:grid-cols-4 border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
            {[
              { label: "Division", value: "Studio" },
              { label: "Status", value: "Emerging" },
              { label: "Channel", value: "@spektrelabs" },
              { label: "Metric", value: "σ = realized" },
            ].map((item, i) => (
              <Reveal
                key={item.label}
                delay={i * 60}
                className="border-r border-[var(--line)] last:border-r-0 px-5 py-4"
              >
                <p className="label text-[var(--fg-faint)] mb-1.5">{item.label}</p>
                <p
                  className="text-[0.92rem] tracking-[-0.01em]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  {item.value}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="space-y-6" style={{ color: "var(--fg-dim)" }}>
              <p className="text-[1.02rem] leading-[1.84] sm:text-[1.1rem]">
                Studio is the production arm of Spektre Labs — where the invariants discovered
                in research become image, sequence, and world. AI-native from the ground up:
                generative models orchestrated as a director, not a filter.
              </p>
              <p className="text-[0.97rem] leading-[1.9]" style={{ color: "var(--fg-mute)" }}>
                The aesthetic is not lifted from genre convention. It is derived: Altered Carbon
                precision, Prada restraint, Fear of God negative space — rendered as a coherent
                visual language with a single invariant at its center. Symmetry is 1&nbsp;=&nbsp;1.
              </p>
            </div>
          </Reveal>

          {/* YouTube channel link — live status */}
          <Reveal delay={200} className="mt-10">
            <div className="flex items-center gap-5">
              <a
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-metal rounded-[8px] px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.06em] uppercase no-underline inline-block"
              >
                Watch on YouTube
              </a>
              <span className="h-px w-8" style={{ background: "var(--line-strong)" }} />
              <span className="label" style={{ color: "var(--signal)" }}>Live</span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Media Reel Grid ──────────────────────────────────────────── */}
      <Section
        title="Media Reel"
        eyebrow="Production · Active"
        className="mt-32 pt-16 sm:mt-40 sm:pt-20 lg:mt-44 lg:pt-24"
      >
        <StudioFilms />

        <Reveal delay={100} className="mt-8">
          <p className="label" style={{ color: "var(--fg-faint)" }}>
            01 — Channel live on YouTube. 02–03 — Generative pipeline, in development.
            04–06 — Vision divisions, see below.
          </p>
        </Reveal>
      </Section>

      {/* ── Glyph seal — section break ──────────────────────────────── */}
      <Reveal delay={0} className="mt-28 flex flex-col items-center gap-6">
        <Glyph variant="seal" size={96} strokeOpacity={0.28} />
        <p className="label" style={{ color: "var(--fg-faint)" }}>
          Spektre Labs · Studio Division
        </p>
      </Reveal>

      {/* ── Vision: Games ────────────────────────────────────────────── */}
      <Section
        title="Games"
        eyebrow="Vision · In Development"
        className="mt-36 pt-16 sm:mt-44 sm:pt-20 lg:mt-52 lg:pt-24"
      >
        <div className="max-w-[50rem]">
          {/* Vision banner */}
          <Reveal delay={0}>
            <div
              className="mb-10 flex items-center gap-4 rounded-[8px] border px-5 py-3"
              style={{ borderColor: "var(--line)", background: "rgba(10,12,16,0.72)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: "var(--fg-faint)" }}
              />
              <span className="label" style={{ color: "var(--fg-faint)" }}>
                In Development — honest trajectory, not shipped product
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-6">
              <p className="text-[1.1rem] leading-[1.82] text-balance font-semibold tracking-[-0.022em]" style={{ color: "var(--fg)" }}>
                AAA generative worlds. Structure as the engine.
              </p>
              <p className="text-[0.97rem] leading-[1.9]" style={{ color: "var(--fg-dim)" }}>
                The same invariants that govern system coherence in the research corpus
                apply to world design. A world holds together for the same reason a proof
                holds: internal consistency, no contradiction at the root. Games built from
                the Spektre Protocol are self-consistent by construction — not authored scene
                by scene, but derived from a set of structural axioms.
              </p>
              <p className="text-[0.93rem] leading-[1.9]" style={{ color: "var(--fg-mute)" }}>
                The aesthetic is canon: cold Atlantean geometry, platinum surface,
                OLED depth. Environments that feel excavated rather than constructed.
                Worlds that carry weight because their structure is real.
              </p>
            </div>
          </Reveal>

          {/* Domain tags — Abloh metadata grid */}
          <Reveal delay={160} className="mt-10">
            <div className="flex flex-wrap gap-0">
              {["Generative Worlds", "Structural Design", "AI World-Building", "Proc-Gen", "σ-Coherent Systems"].map((tag, i) => (
                <span
                  key={tag}
                  className="label mr-6 mb-4 text-[0.62rem] tracking-[0.2em]"
                  style={{ color: "var(--fg-faint)" }}
                >
                  {String(i + 1).padStart(2, "0")} — {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Hairline divider ────────────────────────────────────────── */}
      <Reveal delay={0} className="mt-20 flex justify-center">
        <Glyph variant="divider" size={200} strokeOpacity={0.2} />
      </Reveal>

      {/* ── Vision: Shoreworld ───────────────────────────────────────── */}
      <Section
        title="Shoreworld"
        eyebrow="Vision · In Development"
        className="mt-36 pt-16 sm:mt-44 sm:pt-20 lg:mt-52 lg:pt-24"
      >
        <div className="max-w-[50rem]">
          {/* Vision banner */}
          <Reveal delay={0}>
            <div
              className="mb-10 flex items-center gap-4 rounded-[8px] border px-5 py-3"
              style={{ borderColor: "var(--line)", background: "rgba(10,12,16,0.72)" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{ background: "var(--fg-faint)" }}
              />
              <span className="label" style={{ color: "var(--fg-faint)" }}>
                In Development — honest trajectory, not shipped product
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-6">
              <p className="text-[1.1rem] leading-[1.82] text-balance font-semibold tracking-[-0.022em]" style={{ color: "var(--fg)" }}>
                The world. The IP. The fiction at the center of everything.
              </p>
              <p className="text-[0.97rem] leading-[1.9]" style={{ color: "var(--fg-dim)" }}>
                Shoreworld is the narrative universe that contains the Spektre aesthetic —
                the place where the theory becomes mythology. A setting built from the same
                structural axioms as the research, expressed as story, image, and world.
                Cold. Precise. Ancient and post-human simultaneously.
              </p>
              <p className="text-[0.93rem] leading-[1.9]" style={{ color: "var(--fg-mute)" }}>
                The lore is the σ-axiom made narrative. Civilizations that held coherence
                and those that did not. Ruins that are not metaphors — they are proofs of
                collapse, made inhabitable. Shoreworld is not background; it is the argument
                the research has been building toward, given a body.
              </p>
            </div>
          </Reveal>

          {/* Domain tags */}
          <Reveal delay={160} className="mt-10">
            <div className="flex flex-wrap gap-0">
              {["World IP", "Dark-Luxury Sci-Fi", "Narrative Systems", "Franchise", "σ-Mythology"].map((tag, i) => (
                <span
                  key={tag}
                  className="label mr-6 mb-4 text-[0.62rem] tracking-[0.2em]"
                  style={{ color: "var(--fg-faint)" }}
                >
                  {String(i + 1).padStart(2, "0")} — {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Linkage rail — cross-link to Research / Systems ─────────── */}
      <Section
        title="Connected Divisions"
        eyebrow="Linkages"
        className="mt-36 pt-16 sm:mt-44 sm:pt-20 lg:mt-48 lg:pt-20"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-[52rem]">
          {[
            {
              href: "/research",
              eyebrow: "Research",
              title: "Corpus + Protocol",
              desc: "The formal invariants — σ, K_crit, coherence — that underwrite every Studio artifact.",
              status: "Active",
            },
            {
              href: "/artifacts",
              eyebrow: "Systems",
              title: "σ-gate · Creation OS",
              desc: "The runtime infrastructure: guardrail API and orchestration OS powering AI generation.",
              status: "Shipping",
            },
            {
              href: LINKS.youtube,
              eyebrow: "Channel",
              title: "@spektrelabs",
              desc: "Live on YouTube. First media artifacts of the Studio division.",
              status: "Live",
              external: true,
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="surface surface-hover group block rounded-[var(--radius)] p-6 sm:p-7 no-underline"
              >
                <p className="label mb-3" style={{ color: "var(--fg-faint)" }}>{item.eyebrow}</p>
                <h3
                  className="text-[1.05rem] font-semibold tracking-[-0.02em] leading-[1.2] mb-3"
                  style={{ color: "var(--fg)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[0.87rem] leading-[1.82]" style={{ color: "var(--fg-mute)" }}>
                  {item.desc}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className="h-px flex-1"
                    style={{ background: "var(--line)" }}
                  />
                  <span className="label text-[0.58rem]" style={{ color: item.status === "Live" ? "var(--signal)" : "var(--fg-faint)" }}>
                    {item.status}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ── Final seal — absolute symmetry ─────────────────────────── */}
      <Reveal delay={0} className="mt-40 mb-20 flex flex-col items-center gap-8 lg:mt-52">
        <Glyph variant="seal" size={140} strokeOpacity={0.32} />
        <div className="text-center">
          <p className="label mb-2" style={{ color: "var(--fg-faint)" }}>
            Spektre Labs · Studio Division
          </p>
          <p
            className="label text-[0.6rem] tracking-[0.26em]"
            style={{ color: "var(--fg-faint)", opacity: 0.6 }}
          >
            Research → Systems → Studio → Games → Shoreworld
          </p>
        </div>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
