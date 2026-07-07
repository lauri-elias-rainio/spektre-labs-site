import type { Metadata } from "next";
import type React from "react";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { ResearchMap } from "@/components/research-map";
import { Section } from "@/components/section";
import { ResearchGrid } from "@/components/research-grid";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { getResearchIntroduction, getResearchLayers, getResearchItemCount } from "@/lib/research";
import { getArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/site";
import corpus from "@/data/corpus-papers.json";

/* ─── Corpus grounding — built ONLY from the real 72-paper data (σ-honest) ── */
type CorpusPaper = { section: string; index: number; title: string; github: string; doi: string };
const CORPUS_PAPERS = corpus.papers as CorpusPaper[];
const DOMAINS = (() => {
  const counts = new Map<string, number>();
  for (const p of CORPUS_PAPERS) counts.set(p.section, (counts.get(p.section) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
})();
const CORPUS_COUNT = corpus.count as number;

export const metadata: Metadata = createPageMetadata({
  title: "Research",
  description:
    "Spektre Labs investigates structural invariants across complex systems — coherence, collapse, and the K_crit constant.",
  path: "/research",
});

/* ─── Falsifiable claims — the σ-honest spine ─────────────────────────────── */

const CLAIMS = [
  {
    index: "01",
    thesis: "declared = realized",
    formal: "σ ≡ realized − declared",
    body:
      "σ measures the scalar gap between what a system declares and what it has realized. The claim: when σ → 0, the system is coherent. When σ diverges, collapse is imminent. Falsifiable: a realized-value measurement that does not decrease σ refutes the model.",
  },
  {
    index: "02",
    thesis: "K_crit ≈ 0.127",
    formal: "lim_{K→K_crit} Φ(K) = ∞",
    body:
      "Below K_crit, local corrective feedback is sufficient to maintain coherence. Above it, error propagation outpaces correction and the system transitions to collapse. The numerical value 0.127 is a hypothesis, not a confirmed constant — it is the current best-fit across the domains studied. It will be revised as more data arrives.",
  },
  {
    index: "03",
    thesis: "coherence is substrate-independent",
    formal: "∀ substrate S: σ(S) obeys identical dynamics",
    body:
      "The same σ-gap dynamics appear across cognitive, economic, institutional, and computational systems. The claim is structural, not analogical: the governing equations share the same fixed-point properties. Falsifiable: a domain that does not exhibit critical-transition signatures near K_crit refutes the claim of universality.",
  },
];

/* ─── Method rail ──────────────────────────────────────────────────────────── */

const METHOD = [
  { label: "MEASURE", body: "Compute σ = realized − declared from empirical traces. No proxies." },
  { label: "THRESHOLD", body: "Locate K_crit by finding where corrective feedback bandwidth saturates." },
  { label: "PREDICT", body: "Forecast collapse onset before the transition; test against held-out data." },
  { label: "FALSIFY", body: "Every claim has a stated refutation condition. Vision is fenced as vision." },
];

export default function ResearchPage() {
  const research = getResearchLayers();
  const introduction = getResearchIntroduction();
  const itemCount = getResearchItemCount(research);
  const articles = getArticles();

  return (
    <div>
      {/* ── Page header ── */}
      <PageHeader
        title="Research"
        description="Structural invariants across complex systems. Coherence, collapse, and K_crit ≈ 0.127."
      />

      {/* ── Axiom rail — σ-honest stat band ── */}
      <Reveal delay={80}>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-[var(--line-soft)] pb-10">
          {[
            { label: "DOMAINS", value: String(research.length).padStart(2, "0") },
            { label: "TOPICS", value: String(itemCount).padStart(2, "0") },
            { label: "AXIOM", value: "1 = 1" },
            { label: "K_CRIT", value: "≈ 0.127" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-3">
              <span className="label text-[var(--fg-faint)]">{label}</span>
              <span className="font-mono text-[1.1rem] font-light tracking-[-0.02em] text-[var(--metal-2)] tabular-nums">
                {value}
              </span>
            </div>
          ))}

          <div className="ml-auto hidden sm:block">
            <Glyph variant="node" size={24} strokeOpacity={0.3} />
          </div>
        </div>
      </Reveal>

      {/* ── Lead introduction ── */}
      <Reveal delay={140}>
        <div className="mt-14 sm:mt-16 grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:col-start-4">
            <ProseBlock size="lead" className="text-[var(--fg-dim)]">
              {introduction.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ProseBlock>

            {introduction[2] ? (
              <p className="mt-6 text-[0.9rem] leading-[1.84] text-[var(--fg-mute)] max-w-[42rem]">
                {introduction[2]}
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>

      {/* ══════════════════════════════════════════════════════════════════════
          FALSIFIABLE SPINE
          Three claims — each with a stated thesis, a formal expression,
          and an explicit refutation condition. σ-honest: vision fenced as vision.
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="Falsifiable Spine" eyebrow="Claims">
        {/* Section caption */}
        <Reveal delay={40}>
          <p className="mb-12 max-w-[44rem] text-[0.9rem] leading-[1.84] text-[var(--fg-mute)]">
            These are the load-bearing hypotheses of the research program. Each is stated
            in falsifiable form. A single counterexample overturns the claim — that is
            the intent.
          </p>
        </Reveal>

        <div className="grid gap-px bg-[var(--line-soft)] sm:grid-cols-1 lg:grid-cols-3">
          {CLAIMS.map((claim, i) => (
            <Reveal key={claim.index} delay={i * 80}>
              <div className="group relative bg-[var(--bg)] p-8 transition-colors duration-500 hover:bg-[var(--bg-1)] h-full">
                {/* Corner bracket — top right */}
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[var(--line)] opacity-40 transition-opacity duration-500 group-hover:opacity-80 group-hover:border-[var(--metal-4)]" />

                {/* Index */}
                <span className="label text-[var(--fg-faint)] tabular-nums">
                  {claim.index}
                </span>

                {/* Thesis — Abloh quotation device */}
                <h3
                  className="mt-4 text-[1.05rem] font-semibold tracking-[-0.025em] leading-[1.22]"
                  style={{
                    background:
                      "linear-gradient(177deg, #ffffff 0%, #dadee5 26%, #9aa0ab 52%, #c8ccd4 70%, #6e737d 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  &ldquo;{claim.thesis}&rdquo;
                </h3>

                {/* Formal expression — mono, signal-colored */}
                <p
                  className="mt-5 font-mono text-[0.75rem] leading-[1.6] tracking-[0.04em]"
                  style={{ color: "var(--signal)" }}
                >
                  {claim.formal}
                </p>

                {/* Hairline rule */}
                <div className="my-5 h-px bg-[var(--line-soft)]" />

                {/* Body — editorial */}
                <p className="text-[0.84rem] leading-[1.82] text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg-dim)]">
                  {claim.body}
                </p>

                {/* Bottom signal bar on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--signal)] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-20" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          CORPUS FOUNDATION — the claims grounded in real, DOI-resolvable papers
          (built ONLY from data/corpus-papers.json — σ-honest, no fabrication)
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="The corpus beneath" eyebrow="Grounding">
        <Reveal delay={0}>
          <p className="max-w-[54ch] text-[1.02rem] leading-[1.84]" style={{ color: "var(--fg-dim)" }}>
            The claims above are not assertions in isolation. Each is formalized in the open
            corpus — <span className="text-[var(--fg)]">{CORPUS_COUNT} papers</span> across{" "}
            <span className="text-[var(--fg)]">{DOMAINS.length} domains</span>, every one
            DOI-resolvable on Zenodo, every one CC&nbsp;BY. The map below is the falsifiability
            surface: one resolvable counter-paper overturns a claim.
          </p>
        </Reveal>

        {/* domain map — real sections + live counts, each links into the corpus */}
        <Reveal delay={80} className="mt-12">
          <div className="grid grid-cols-2 gap-px bg-[var(--line-soft)] sm:grid-cols-3 lg:grid-cols-4">
            {DOMAINS.map((d) => (
              <a
                key={d.name}
                href="/corpus"
                className="group flex items-baseline justify-between gap-3 bg-[var(--bg)] px-4 py-4 no-underline transition-colors duration-500 hover:bg-[var(--bg-1)]"
              >
                <span className="text-[0.86rem] leading-[1.3] text-[var(--fg-dim)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                  {d.name}
                </span>
                <span className="label tabular-nums shrink-0 text-[var(--fg-faint)] transition-colors duration-500 group-hover:text-[var(--signal)]">
                  {String(d.count).padStart(2, "0")}
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <a href="/corpus" className="no-underline">
            <span className="label text-[var(--fg-mute)] transition-colors duration-300 hover:text-[var(--fg)]">
              Read the full corpus → {CORPUS_COUNT} papers, open access
            </span>
          </a>
        </Reveal>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          σ INSTRUMENT — the metric defined, not marketed
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="The σ Instrument" eyebrow="Method">
        <Reveal delay={0}>
          {/* Centered thesis block */}
          <div className="flex justify-center mb-14">
            <div className="relative border border-[var(--line)] bg-[var(--bg-1)] px-10 py-10 max-w-xl w-full text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0) 40%), rgba(14,16,19,0.72)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 0 rgba(0,0,0,0.6), 0 24px 60px -30px rgba(0,0,0,0.9)",
                backdropFilter: "blur(8px)",
                borderRadius: "var(--radius)",
              }}
            >
              {/* Corner brackets — bilateral */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[var(--line-strong)] opacity-50" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[var(--line-strong)] opacity-50" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[var(--line-strong)] opacity-50" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[var(--line-strong)] opacity-50" />

              <p className="label text-[var(--fg-faint)] mb-5">σ — COHERENCE METRIC</p>

              {/* The equation — large mono */}
              <p
                className="font-mono text-[2rem] sm:text-[2.6rem] font-light tracking-[-0.02em] leading-none"
                style={{ color: "var(--signal)" }}
              >
                σ = realized − declared
              </p>

              {/* Horizontal axis — the 1=1 line */}
              <div className="mt-6 flex items-center gap-3 justify-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--line-strong)]" />
                <span className="label text-[var(--fg-faint)] shrink-0">1 = 1</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--line-strong)]" />
              </div>

              {/* States */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                {[
                  { state: "σ = 0", label: "COHERENT", note: "declared = realized" },
                  { state: "σ &lt; 0", label: "DEFICIT", note: "overclaim — realized falls short" },
                  { state: "σ &gt; 0", label: "EXCESS", note: "under-declared — realized exceeds" },
                ].map(({ state, label, note }) => (
                  <div key={label}>
                    <p
                      className="font-mono text-[0.8rem] font-light"
                      style={{ color: "var(--fg-dim)" }}
                      dangerouslySetInnerHTML={{ __html: state }}
                    />
                    <p className="label mt-1 text-[var(--fg-faint)]">{label}</p>
                    <p className="mt-1 text-[0.72rem] text-[var(--fg-faint)]">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Method steps — 4-column editorial rail */}
        <div className="grid gap-px bg-[var(--line-soft)] sm:grid-cols-2 lg:grid-cols-4">
          {METHOD.map((step, i) => (
            <Reveal key={step.label} delay={i * 60}>
              <div className="group bg-[var(--bg)] px-6 py-6 transition-colors duration-500 hover:bg-[var(--bg-1)] h-full">
                <p className="label text-[var(--fg-faint)] mb-4">{step.label}</p>
                <p className="text-[0.84rem] leading-[1.8] text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg-dim)]">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* σ-honest footnote */}
        <Reveal delay={120}>
          <p className="mt-8 text-[0.8rem] leading-[1.84] text-[var(--fg-faint)] max-w-[44rem]">
            σ is defined operationally, not metaphorically. The research program does not claim
            σ is a universal law — it claims σ is a useful measurement and that studying it
            across domains is productive. Null results are reported.
          </p>
        </Reveal>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          K_CRIT — the critical threshold as a research claim
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="K_crit ≈ 0.127" eyebrow="Critical Threshold">
        <Reveal delay={0}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: editorial explanation */}
            <div>
              <p className="text-[0.97rem] leading-[1.88] text-[var(--fg-dim)] max-w-[38rem]">
                K_crit is the coupling threshold above which a system cannot self-correct.
                Below it, local feedback loops close the σ-gap. Above it, error propagates
                faster than it can be corrected and the system crosses into collapse.
              </p>
              <p className="mt-6 text-[0.9rem] leading-[1.84] text-[var(--fg-mute)] max-w-[38rem]">
                The value 0.127 is empirically derived from the current corpus. It is a
                hypothesis. The program treats it as a falsifiable constant: if a studied
                system shows coherence above K = 0.127, the value is revised. No special
                status is claimed beyond best-fit.
              </p>

              {/* Threshold data rail */}
              <div className="mt-10 space-y-0 border border-[var(--line)]">
                {[
                  { range: "K &lt; 0.127", regime: "SUBCRITICAL", note: "self-correcting, σ bounded" },
                  { range: "K ≈ 0.127", regime: "CRITICAL", note: "marginal — transition zone", signal: true },
                  { range: "K &gt; 0.127", regime: "SUPERCRITICAL", note: "collapse dynamics onset" },
                ].map(({ range, regime, note, signal }) => (
                  <div
                    key={regime}
                    className="flex items-center gap-6 border-b border-[var(--line-soft)] px-5 py-4 last:border-b-0"
                  >
                    <p
                      className="font-mono text-[0.78rem] shrink-0 w-[7rem]"
                      style={{ color: signal ? "var(--signal)" : "var(--fg-dim)" }}
                      dangerouslySetInnerHTML={{ __html: range }}
                    />
                    <p className="label text-[var(--fg-mute)] shrink-0">{regime}</p>
                    <p className="text-[0.78rem] text-[var(--fg-faint)] leading-[1.6]">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: schematic diagram — symmetric ASCII-art-style SVG */}
            <div className="relative border border-[var(--line)] bg-[var(--bg-1)]" style={{ paddingTop: "90%" }}>
              {/* Corner labels */}
              <div className="label absolute top-3 left-3 text-[var(--fg-faint)] z-10">COUPLING K</div>
              <div className="label absolute top-3 right-3 text-[var(--fg-faint)] z-10">COLLAPSE Φ</div>

              <svg
                viewBox="0 0 300 270"
                className="absolute inset-0 w-full h-full"
                aria-label="K_crit threshold diagram"
                aria-hidden="true"
              >
                {/* Grid lines */}
                {[60, 120, 180, 240].map((y) => (
                  <line
                    key={y}
                    x1="40" y1={y} x2="280" y2={y}
                    stroke="rgba(255,255,255,0.045)"
                    strokeWidth="0.5"
                  />
                ))}
                {[80, 140, 200, 260].map((x) => (
                  <line
                    key={x}
                    x1={x} y1="20" x2={x} y2="250"
                    stroke="rgba(255,255,255,0.045)"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Axes */}
                <line x1="40" y1="250" x2="280" y2="250" stroke="rgba(200,206,216,0.35)" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="250" stroke="rgba(200,206,216,0.35)" strokeWidth="1" />

                {/* Axis labels */}
                <text x="160" y="268" textAnchor="middle" fill="rgba(160,170,185,0.5)" fontSize="7" fontFamily="ui-monospace,monospace" letterSpacing="0.1em">K (COUPLING)</text>
                <text x="14" y="135" textAnchor="middle" fill="rgba(160,170,185,0.5)" fontSize="7" fontFamily="ui-monospace,monospace" letterSpacing="0.1em" transform="rotate(-90,14,135)">Φ (COLLAPSE)</text>

                {/* Subcritical flat zone — low collapse */}
                <path
                  d="M 40 230 Q 100 228 140 222"
                  fill="none"
                  stroke="rgba(200,206,216,0.5)"
                  strokeWidth="1.5"
                />
                {/* Supercritical rising zone */}
                <path
                  d="M 140 222 Q 160 180 180 110 Q 200 50 210 30"
                  fill="none"
                  stroke="rgba(200,206,216,0.5)"
                  strokeWidth="1.5"
                />

                {/* K_crit vertical marker — signal color */}
                <line
                  x1="140" y1="20" x2="140" y2="250"
                  stroke="rgba(207,227,255,0.55)"
                  strokeWidth="0.75"
                  strokeDasharray="4 5"
                />

                {/* K_crit label */}
                <text x="141" y="40" fill="rgba(207,227,255,0.8)" fontSize="7.5" fontFamily="ui-monospace,monospace" letterSpacing="0.08em">K_CRIT</text>
                <text x="141" y="52" fill="rgba(207,227,255,0.6)" fontSize="7" fontFamily="ui-monospace,monospace">≈ 0.127</text>

                {/* Critical point dot */}
                <circle cx="140" cy="222" r="3" fill="rgba(207,227,255,0.8)" stroke="none" />

                {/* Region labels */}
                <text x="85" y="244" textAnchor="middle" fill="rgba(160,176,200,0.4)" fontSize="6.5" fontFamily="ui-monospace,monospace" letterSpacing="0.08em">SUBCRITICAL</text>
                <text x="210" y="244" textAnchor="middle" fill="rgba(160,176,200,0.4)" fontSize="6.5" fontFamily="ui-monospace,monospace" letterSpacing="0.08em">SUPERCRITICAL</text>

                {/* Outer signal ring — barely visible */}
                <circle cx="150" cy="135" r="118" fill="none" stroke="rgba(207,227,255,0.06)" strokeWidth="0.5" strokeDasharray="1 10" />
              </svg>

              {/* Bottom label bar */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-[var(--line)] px-4 py-2">
                <span className="label text-[var(--fg-faint)]">HYPOTHESIS</span>
                <span className="label text-[var(--signal)] opacity-70">K_CRIT ≈ 0.127</span>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ── Coherence Map ── */}
      <Section title="Coherence Map" eyebrow="Structure">
        <ResearchMap layers={research} />
      </Section>

      {/* ── Glyph divider ── */}
      <Reveal delay={0}>
        <div className="flex justify-center py-16 sm:py-20">
          <Glyph variant="seal" size={72} strokeOpacity={0.18} />
        </div>
      </Reveal>

      {/* ── Research Layers ── */}
      <Section title="Research Layers" eyebrow="Detail">
        <ResearchGrid items={research} />
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          FIELD NOTES — published plain-language articles from the program
      ══════════════════════════════════════════════════════════════════════ */}
      <Section title="Field Notes" eyebrow="Published">
        <Reveal delay={0}>
          <p className="mb-12 max-w-[44rem] text-[0.9rem] leading-[1.84] text-[var(--fg-mute)]">
            Plain-language readings from the research program. No in-house jargon —
            each note translates one structural finding into a method any technical
            reader can use or verify directly.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <article className="group surface surface-hover flex h-full flex-col p-7 sm:p-8">
                {/* eyebrow */}
                <p className="label mb-5" style={{ color: "var(--fg-faint)" }}>
                  {article.eyebrow}
                </p>

                {/* title */}
                <h3
                  className="flex-1 text-[1.02rem] font-semibold leading-[1.24] tracking-[-0.022em]"
                  style={{ color: "var(--fg)" }}
                >
                  <Link
                    href={`/research/${article.slug}`}
                    className="transition-colors duration-500 hover:text-[var(--metal-1)]"
                  >
                    {article.title}
                  </Link>
                </h3>

                {/* summary */}
                <p
                  className="mt-4 text-[0.84rem] leading-[1.82]"
                  style={{ color: "var(--fg-mute)" }}
                >
                  {article.summary}
                </p>

                {/* footer rail */}
                <div
                  className="mt-6 flex items-center justify-between border-t pt-5"
                  style={{ borderColor: "var(--line)" }}
                >
                  <Link
                    href={`/research/${article.slug}`}
                    className="label transition-colors duration-500 hover:text-[var(--fg)]"
                    style={{ color: "var(--fg-dim)" }}
                  >
                    Read&nbsp;→
                  </Link>
                  <span className="label" style={{ color: "var(--fg-faint)" }}>
                    {article.readingTime}&nbsp;min
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          CLOSING — 1 = 1, centered, on void
      ══════════════════════════════════════════════════════════════════════ */}
      <Reveal delay={0}>
        <div className="flex flex-col items-center py-24 sm:py-32 gap-6 text-center">
          <div className="rule w-full mb-8" />
          <p className="label text-[var(--fg-faint)]">RESEARCH PROGRAM · SPEKTRE LABS</p>
          <p
            className="font-mono text-[2.2rem] sm:text-[3rem] font-light tracking-[-0.04em] leading-none"
            style={{
              background:
                "linear-gradient(177deg, #ffffff 0%, #dadee5 26%, #9aa0ab 52%, #c8ccd4 70%, #6e737d 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
          >
            1 = 1
          </p>
          <p className="label text-[var(--fg-faint)] max-w-[28rem] leading-[1.8]">
            declared equals realized — the axiom governs the method
          </p>
          <Glyph variant="divider" size={160} strokeOpacity={0.18} />
        </div>
      </Reveal>
    </div>
  );
}
