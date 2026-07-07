import type { Metadata } from "next";

import { CanonVideo } from "@/components/canon-video";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

/*
 * Spacing ladder (multiples of 0.25rem, modular scale):
 *   mt-4=1rem · mt-6=1.5rem · mt-8=2rem · mt-10=2.5rem · mt-12=3rem
 *   mt-16=4rem · mt-20=5rem · mt-24=6rem · mt-28=7rem · mt-32=8rem
 * Type ladder (DESIGN_SYSTEM §4.4):
 *   0.66rem=label · 0.88rem=fine · 0.92rem=body-sm · 1rem=body
 *   1.05rem=body-lg · 3→4→5rem=hero h1 breakpoints
 */

export const metadata: Metadata = createPageMetadata({
  title: "Press",
  description:
    "Brand kit and press facts for Spektre Labs — logo, palette, typography, boilerplate, and contact.",
  path: "/press",
});

/*
 * Brand palette — three colours, single theme, one signal.
 * CSS variable names match globals.css exactly.
 */
const PALETTE = [
  {
    label: "OLED Black",
    hex: "#000000",
    cssVar: "--bg",
    role: "Base background",
    bg: "#000000",
    border: "rgba(255,255,255,0.12)",
    textOn: "#b9bdc6",
  },
  {
    label: "Platinum",
    hex: "#E8EAEE",
    cssVar: "--metal-1",
    role: "Metal axis · primary type",
    bg: "#e8eaee",
    border: "rgba(255,255,255,0.18)",
    textOn: "#0a0b0d",
  },
  {
    label: "Signal",
    hex: "#CFE3FF",
    cssVar: "--signal",
    role: "Cold accent · 1 per view max",
    bg: "#cfe3ff",
    border: "rgba(207,227,255,0.3)",
    textOn: "#0a0b0d",
  },
] as const;

/*
 * Full token table — all palette tokens from globals.css
 */
const TOKEN_TABLE: { token: string; hex: string; role: string }[] = [
  { token: "--bg",       hex: "#000000",              role: "Page background" },
  { token: "--bg-2",     hex: "#0B0C0E",              role: "Panel / surface background" },
  { token: "--metal-1",  hex: "#E8EAEE",              role: "Platinum axis · primary type" },
  { token: "--signal",   hex: "#CFE3FF",              role: "Cold accent · use once per view" },
  { token: "--fg",       hex: "#F4F5F7",              role: "Body copy" },
  { token: "--fg-dim",   hex: "#B6BAC1",              role: "Secondary copy" },
  { token: "--fg-mute",  hex: "#7D828B",              role: "Tertiary / metadata" },
  { token: "--fg-faint", hex: "#50545C",              role: "Faintest legible text" },
  { token: "--line",     hex: "rgba(255,255,255,.08)", role: "Hairline borders and dividers" },
];

const BOILERPLATE = `Spektre Labs is an independent research laboratory based in Helsinki, \
founded by Lauri Elias Rainio. The lab investigates structural \
invariants across complex systems — identifying patterns that persist \
across domains from physics and information theory to cognition, \
artificial intelligence, and institutional dynamics. Its primary \
artifact is the Spektre Corpus: a collection of formal research papers \
examining coherence, feedback failure, and collapse dynamics. All \
research artifacts are published openly. Spektre Labs operates under \
one standard: declared equals realized, or the claim does not ship.`;

export default function PressPage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-28">
        <Reveal delay={0}>
          <p className="label text-[var(--fg-faint)]">Brand Kit · Press</p>
        </Reveal>

        <Reveal delay={80}>
          {/* hero h1: 3rem → 4rem → 5rem, ratio 1.25× */}
          <h1 className="metal-text mt-5 text-[3rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[4rem] lg:text-[5rem]">
            Spektre Labs
          </h1>
        </Reveal>

        <Reveal delay={160}>
          {/* body-lg: 1.05rem → 1.12rem */}
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

      {/* ── Full-bleed rule ───────────────────────────────────────── */}
      <div className="rule mt-14 sm:mt-18 lg:mt-22" />

      {/* ── The Mark / Seal ──────────────────────────────────────── */}
      <div className="mt-14 sm:mt-18 lg:mt-22">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">The Mark</p>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Seal on black */}
          <Reveal delay={60}>
            <div className="surface flex flex-col items-center gap-6 rounded-[var(--radius)] p-10">
              <Glyph variant="seal" size={160} strokeOpacity={0.55} />
              <p className="label text-[var(--fg-faint)]">Seal · OLED Black</p>
            </div>
          </Reveal>

          {/* Seal on dark surface */}
          <Reveal delay={120}>
            <div
              className="flex flex-col items-center gap-6 rounded-[var(--radius)] p-10"
              style={{ background: "var(--bg-3)", border: "1px solid var(--line-strong)" }}
            >
              <Glyph variant="seal" size={160} strokeOpacity={0.72} />
              <p className="label text-[var(--fg-faint)]">Seal · Surface</p>
            </div>
          </Reveal>

          {/* Usage + clearspace rules */}
          <Reveal delay={180}>
            <div className="surface flex flex-col justify-between rounded-[var(--radius)] p-8 sm:p-10 lg:col-span-1">
              <p className="label mb-6 text-[var(--fg-faint)]">Usage · Clearspace</p>

              <div className="flex flex-col gap-4 text-[0.88rem] leading-[1.8] text-[var(--fg-dim)]">
                {[
                  "Use on OLED black or near-black surfaces only.",
                  "Never recolor the mark. Platinum hairlines only.",
                  "Do not crop, rotate, or distort the radial symmetry.",
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Glyph variant="node" size={14} strokeOpacity={0.32} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>

              {/* Clearspace — stated numerically (Rolex-manual precision) */}
              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <p className="label mb-3 text-[var(--signal)]">Clearspace = 1 × r₀</p>
                {/* fine: 0.88rem */}
                <div className="flex flex-col gap-1 text-[0.88rem] text-[var(--fg-mute)]">
                  <span>r₀ = outermost ring radius</span>
                  <span>At 160px: r₀ = 20px → <span className="text-[var(--fg-dim)]">20px clearspace</span></span>
                  <span>At 40mm print: r₀ = 5mm → <span className="text-[var(--fg-dim)]">5mm clearspace</span></span>
                  <span>At 512px OG: r₀ = 64px → <span className="text-[var(--fg-dim)]">64px clearspace</span></span>
                </div>
              </div>

              <div className="rule mt-6" />
              <p className="label mt-4 text-[var(--fg-faint)]">Symmetry is law — 1 = 1</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Palette — swatches + token table ─────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Palette</p>
        </Reveal>

        {/* Three brand swatches */}
        <div className="grid gap-4 sm:grid-cols-3">
          {PALETTE.map((swatch, i) => (
            <Reveal key={swatch.hex} delay={60 + i * 80}>
              <div
                className="overflow-hidden rounded-[var(--radius)]"
                style={{ border: `1px solid ${swatch.border}` }}
              >
                {/* Swatch block — 7rem height */}
                <div
                  style={{ background: swatch.bg, height: "7rem" }}
                  aria-label={swatch.label}
                />
                {/* Metadata strip */}
                <div
                  style={{ background: "var(--bg-2)", borderTop: `1px solid ${swatch.border}` }}
                  className="px-5 py-4"
                >
                  <p className="text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                    {swatch.label}
                  </p>
                  <p className="label mt-1 text-[var(--fg-faint)]">{swatch.hex}</p>
                  {/* mono var name — the single signal permitted in the label */}
                  <p className="label mt-0.5 text-[var(--signal)]">{swatch.cssVar}</p>
                  <p className="label mt-1 text-[var(--fg-faint)]">{swatch.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Full token table — all palette tokens */}
        <Reveal delay={120} className="mt-8">
          <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]">
            {/* header row */}
            <div className="grid grid-cols-3 border-b border-[var(--line)] bg-[var(--bg-2)] px-6 py-3">
              <span className="label text-[var(--fg-faint)]">CSS token</span>
              <span className="label text-[var(--fg-faint)]">Hex / value</span>
              <span className="label text-[var(--fg-faint)]">Role</span>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {TOKEN_TABLE.map((row) => (
                <div key={row.token} className="grid grid-cols-3 items-baseline px-6 py-3.5">
                  {/* mono: 0.66rem label size */}
                  <code className="label text-[var(--signal)]">{row.token}</code>
                  <span className="label text-[var(--fg-dim)]">{row.hex}</span>
                  {/* fine: 0.88rem */}
                  <span className="text-[0.88rem] text-[var(--fg-mute)]">{row.role}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Typography specimen ───────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Typography</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface max-w-[52rem] overflow-hidden rounded-[var(--radius)]">
            {/* Display serif — Instrument Serif, metal gradient */}
            <div className="border-b border-[var(--line)] px-8 py-7 sm:px-10">
              <p className="label mb-4 text-[var(--fg-faint)]">
                Display · serif · .metal-text — for headline quotes and the axiom only
              </p>
              <p
                className="metal-text text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[2.5rem]"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                1 = 1
              </p>
              <p className="label mt-3 text-[var(--fg-faint)]">
                clamp(3.6rem, 8.8vw, 7.4rem) hero-display · 2rem→2.5rem secondary
              </p>
            </div>

            {/* Sans body — Geist Sans */}
            <div className="border-b border-[var(--line)] px-8 py-7 sm:px-10">
              <p className="label mb-4 text-[var(--fg-faint)]">
                Body · Geist Sans · regular
              </p>
              {/* body-lg: 1rem → 1.08rem */}
              <p className="text-[1rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.08rem]">
                An independent research laboratory based in Helsinki. The lab investigates
                structural invariants across complex systems — patterns that persist
                across domains from physics to cognition.
              </p>
              <p className="label mt-3 text-[var(--fg-faint)]">
                1rem / 1.08rem · line-height 1.75 · tracking -0.011em · antialiased
              </p>
            </div>

            {/* Mono label — Geist Mono */}
            <div className="px-8 py-7 sm:px-10">
              <p className="label mb-4 text-[var(--fg-faint)]">
                Label · Geist Mono · uppercase — all metadata and UI tags
              </p>
              <p className="label text-[var(--fg-mute)]">
                SPEKTRE LABS · HELSINKI · 0001 · σ-HONEST · 1 = 1
              </p>
              <p className="label mt-3 text-[var(--fg-faint)]">
                0.66rem · 0.24em letter-spacing · uppercase · mono · weight 500
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Identity Facts ────────────────────────────────────────── */}
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
                { label: "Name",     value: lab.name },
                { label: "Founder",  value: lab.about.authorSection.name },
                { label: "Role",     value: lab.about.authorSection.role },
                { label: "Location", value: lab.location },
                { label: "ORCID",    value: lab.orcid, link: LINKS.orcid },
                { label: "GitHub",   value: lab.github, link: lab.github },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-6 px-8 py-5 sm:px-10"
                >
                  {/* label mono: 0.66rem, w-24 = 6rem */}
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
                      className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors duration-200 hover:text-[var(--fg)]"
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

      {/* ── Motion assets — live engine captures ─────────────────── */}
      {/* σ-honest: these are recordings of the real experiences running
          on a GPU, not composited promos. Free to publish. */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">
            Motion · captured from the live engines · free to publish
          </p>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              src:    "/press/sigma-loop.mp4",
              poster: "/press/sigma-loop-poster.jpg",
              cap:    "Σ-COLLAPSE — noise collapses into the mark; σ measured live",
              href:   "/sigma",
            },
            {
              src:    "/press/shore-loop.mp4",
              poster: "/press/shore-loop-poster.jpg",
              cap:    "The Coherence Capital — procedural world, generated per-frame",
              href:   "/shoreworld",
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

      {/* ── Boilerplate — Rolex-manual precision ─────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Boilerplate</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface max-w-[52rem] rounded-[var(--radius)] p-8 sm:p-10 lg:p-12">
            <div className="mb-6 flex items-center justify-between gap-6">
              <p className="label text-[var(--fg-faint)]">Standard press description · copy verbatim</p>
              {/* copy affordance — CSS user-select:all, no JS required */}
              <span className="label shrink-0 text-[var(--signal)]">Click to select all</span>
            </div>

            {/* user-select:all — click selects the whole block instantly */}
            <pre
              className="select-all cursor-text rounded-[8px] border border-[var(--line)] bg-[var(--bg-2)] p-6 text-[0.88rem] leading-[1.92] text-[var(--fg-dim)] sm:text-[0.95rem]"
              style={{ fontFamily: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {BOILERPLATE}
            </pre>

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

      {/* ── Press Contact ─────────────────────────────────────────── */}
      <div className="mt-20 sm:mt-24 lg:mt-28">
        <Reveal delay={0}>
          <p className="label mb-8 text-[var(--fg-faint)]">Press Contact</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface surface-hover max-w-[36rem] rounded-[var(--radius)] p-8 sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[1rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                  {lab.about.authorSection.name}
                </p>
                <p className="label mt-1 text-[var(--fg-faint)]">
                  {lab.about.authorSection.role}
                </p>

                <div className="rule my-6 max-w-[12rem]" />

                <a
                  href={LINKS.email}
                  className="btn-metal inline-block rounded-[8px] px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em]"
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

      {/* ── Closing seal ─────────────────────────────────────────── */}
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
