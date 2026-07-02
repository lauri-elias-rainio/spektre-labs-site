import type { Metadata } from "next";

import { CanonVideo } from "@/components/canon-video";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Press",
  description:
    "Brand kit and press facts for Spektre Labs — logo, palette, boilerplate, and contact.",
  path: "/press",
});

const PALETTE = [
  {
    label: "OLED Black",
    hex: "#000000",
    role: "Background / Base",
    bg: "#000000",
    border: "rgba(255,255,255,0.12)",
    text: "#b9bdc6",
  },
  {
    label: "Platinum",
    hex: "#E8EAEE",
    role: "Metal axis / Type",
    bg: "#e8eaee",
    border: "rgba(255,255,255,0.18)",
    text: "#0a0b0d",
  },
  {
    label: "Signal",
    hex: "#CFE3FF",
    role: "Cold accent",
    bg: "#cfe3ff",
    border: "rgba(207,227,255,0.3)",
    text: "#0a0b0d",
  },
] as const;

export default function PressPage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-28">
        <Reveal delay={0}>
          <p className="label text-[var(--fg-faint)]">Brand Kit · Press</p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="metal-text mt-5 text-[3rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
            Spektre Labs
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-[44rem] text-[1.05rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.12rem]">
            Industrial dark-luxury minimalism × mathematically-perfect-symmetric
            mythical Atlantean cybernetics.
          </p>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-8 bg-[var(--line-strong)]" />
            <span className="label text-[var(--fg-faint)]">1 = 1</span>
          </div>
        </Reveal>
      </div>

      {/* ── Full-bleed rule ───────────────────────────────────────────── */}
      <div className="rule mt-14 sm:mt-18 lg:mt-22" />

      {/* ── Mark / Seal ───────────────────────────────────────────────── */}
      <div className="mt-14 sm:mt-18 lg:mt-22">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">The Mark</p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Seal on black */}
          <Reveal delay={60}>
            <div className="surface flex flex-col items-center gap-6 rounded-[var(--radius)] p-10">
              <Glyph variant="seal" size={160} strokeOpacity={0.55} />
              <div className="text-center">
                <p className="label text-[var(--fg-faint)]">Seal · OLED Black</p>
              </div>
            </div>
          </Reveal>

          {/* Seal on dark surface — doubled ring opacity */}
          <Reveal delay={120}>
            <div
              className="flex flex-col items-center gap-6 rounded-[var(--radius)] p-10"
              style={{
                background: "var(--bg-3)",
                border: "1px solid var(--line-strong)",
              }}
            >
              <Glyph variant="seal" size={160} strokeOpacity={0.72} />
              <div className="text-center">
                <p className="label text-[var(--fg-faint)]">Seal · Surface</p>
              </div>
            </div>
          </Reveal>

          {/* Usage rules panel */}
          <Reveal delay={180}>
            <div className="surface flex flex-col justify-between rounded-[var(--radius)] p-8 sm:p-10 lg:col-span-1">
              <p className="label mb-6 text-[var(--fg-faint)]">Usage</p>
              <div className="flex flex-col gap-4 text-[0.88rem] leading-[1.8] text-[var(--fg-dim)]">
                {[
                  "Use on OLED black or near-black surfaces only.",
                  "Never recolor the mark. Platinum hairlines only.",
                  "Minimum clear space: equal to one ring radius on all sides.",
                  "Do not crop, rotate, or distort the radial symmetry.",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Glyph variant="node" size={14} strokeOpacity={0.32} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
              <div className="rule mt-8" />
              <p className="label mt-5 text-[var(--fg-faint)]">
                Symmetry is law — 1 = 1
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Palette ───────────────────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Palette</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {PALETTE.map((swatch, i) => (
            <Reveal key={swatch.hex} delay={60 + i * 80}>
              <div
                className="overflow-hidden rounded-[var(--radius)]"
                style={{ border: `1px solid ${swatch.border}` }}
              >
                {/* Swatch block */}
                <div
                  style={{ background: swatch.bg, height: "7rem" }}
                  aria-label={swatch.label}
                />
                {/* Metadata strip */}
                <div
                  style={{ background: "var(--bg-2)", borderTop: `1px solid ${swatch.border}` }}
                  className="px-5 py-4"
                >
                  <p
                    className="text-[0.95rem] font-semibold tracking-[-0.02em]"
                    style={{ color: "var(--fg)" }}
                  >
                    {swatch.label}
                  </p>
                  <p className="label mt-1 text-[var(--fg-faint)]">{swatch.hex}</p>
                  <p className="label mt-1 text-[var(--fg-faint)]">{swatch.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Identity facts ────────────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Identity Facts</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface max-w-[52rem] overflow-hidden rounded-[var(--radius)]">
            {/* Header strip */}
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-8 py-4 sm:px-10">
              <p className="label text-[var(--fg-faint)]">Brand Facts</p>
              <p className="label text-[var(--signal)]">σ-HONEST</p>
            </div>

            {/* Fact rows */}
            <div className="divide-y divide-[var(--line)]">
              {[
                { label: "Name", value: lab.name },
                { label: "Founder", value: lab.about.authorSection.name },
                { label: "Role", value: lab.about.authorSection.role },
                { label: "Location", value: lab.location },
                {
                  label: "ORCID",
                  value: `${lab.orcid}`,
                  link: LINKS.orcid,
                },
                {
                  label: "GitHub",
                  value: lab.github,
                  link: lab.github,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-6 px-8 py-5 sm:px-10"
                >
                  <span
                    className="w-24 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.18em]"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    {row.label}
                  </span>
                  {row.link ? (
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--fg)] transition-colors duration-200"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)]">
                      {row.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Motion assets — loops captured from the LIVE engines.
             σ-honest by construction: these are recordings of the real
             experiences running on a GPU, not composited promos. ───────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">
            Motion · captured from the live engines · free to publish
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              src: "/press/sigma-loop.mp4",
              poster: "/press/sigma-loop-poster.jpg",
              cap: "Σ-COLLAPSE — noise collapses into the mark; σ measured live",
              href: "/sigma",
            },
            {
              src: "/press/shore-loop.mp4",
              poster: "/press/shore-loop-poster.jpg",
              cap: "The Coherence Capital — procedural world, generated per-frame",
              href: "/shoreworld",
            },
          ].map((v) => (
            <Reveal key={v.src} delay={60}>
              <figure className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
                <CanonVideo
                  src={v.src}
                  poster={v.poster}
                  label={`${v.cap} — 10-second loop captured from the live engine.`}
                  className="aspect-video w-full object-cover"
                />
                <figcaption className="flex items-center justify-between px-4 py-3">
                  <span className="label text-[var(--fg-faint)]">{v.cap}</span>
                  <a
                    href={v.src}
                    download
                    className="label text-[var(--fg-mute)] transition-colors duration-300 hover:text-[var(--fg)]"
                  >
                    Download&nbsp;↓
                  </a>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── Boilerplate ───────────────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Boilerplate</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface max-w-[52rem] rounded-[var(--radius)] p-8 sm:p-10 lg:p-12">
            <p className="label mb-6 text-[var(--fg-faint)]">
              Standard press description — copy verbatim
            </p>

            <blockquote className="border-l-2 border-[var(--signal)] pl-6 sm:pl-8">
              <p className="text-[0.97rem] leading-[1.92] text-[var(--fg-dim)] sm:text-[1.02rem]">
                Spektre Labs is an independent research laboratory based in Helsinki,
                founded by Lauri Elias Rainio. The lab investigates structural
                invariants across complex systems — identifying patterns that persist
                across domains from physics and information theory to cognition,
                artificial intelligence, and institutional dynamics. Its primary
                artifact is the Spektre Corpus: a collection of formal research papers
                examining coherence, feedback failure, and collapse dynamics. All
                research artifacts are published openly. Spektre Labs operates under
                one standard: declared equals realized, or the claim does not ship.
              </p>
            </blockquote>

            <div className="rule mt-8" />
            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-5 bg-[var(--line-strong)]" />
              <span className="label text-[var(--fg-faint)]">
                Use only this text — no paraphrasing without written approval
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Press Contact</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface surface-hover max-w-[36rem] rounded-[var(--radius)] p-8 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p
                  className="text-[1rem] font-semibold tracking-[-0.02em]"
                  style={{ color: "var(--fg)" }}
                >
                  {lab.about.authorSection.name}
                </p>
                <p className="label mt-1 text-[var(--fg-faint)]">
                  {lab.about.authorSection.role}
                </p>

                <div className="rule my-6 max-w-[12rem]" />

                <a
                  href={LINKS.email}
                  className="btn-metal inline-block rounded-[8px] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.1em] uppercase"
                >
                  {lab.email}
                </a>
              </div>

              <div className="hidden sm:block">
                <Glyph variant="seal" size={80} strokeOpacity={0.28} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Closing seal ──────────────────────────────────────────────── */}
      <Reveal
        delay={0}
        className="mt-32 flex flex-col items-center gap-5 sm:mt-40 lg:mt-56"
      >
        <Glyph variant="divider" size={180} strokeOpacity={0.18} />
        <p className="label text-[var(--fg-faint)]">Spektre Labs · Helsinki · 1 = 1</p>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
