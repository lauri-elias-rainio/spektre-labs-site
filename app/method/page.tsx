import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Method",
  description: lab.method.description,
  path: "/method",
});

/*
  /method — Computational Orchestration.
  Scale: DESIGN_SYSTEM §4.4 modular major-third ladder.
    stage title → body-l  1.125rem
    descriptions → caption 0.875rem
    metadata     → caption 0.875rem
    labels       → .label  0.66rem / 0.24em / uppercase
  Vertical cadence: multiples of 1rem (mt-16=4, mt-20=5, mt-24=6).
  Text columns: max-w-[65ch].
  Symmetric diagram: 4 nodes on a 1px hairline centerline (§5.1 bilateral symmetry).
    Nodes 01↔04 mirror, 02↔03 mirror — 1=1 rendered as sequence.
*/

const STAGE_NUMERALS = ["01", "02", "03", "04"];

const STAGE_SUBTITLES: Record<string, string> = {
  "Formal Modeling":           "declare the structure",
  "Computational Exploration": "traverse the space",
  "Iterative Falsification":   "stress-test to collapse",
  "Structural Synthesis":      "formalize the invariant",
};

/* Diagram node labels — compressed for the narrow spec strip */
const DIAGRAM_NODES = [
  { n: "01", sub: "Declare" },
  { n: "02", sub: "Traverse" },
  { n: "03", sub: "Stress-test" },
  { n: "04", sub: "Formalize" },
];

export default function MethodPage() {
  const steps = lab.method.process.steps;

  return (
    <div>
      <PageHeader title={lab.method.title} description={lab.method.description} />

      {/* ── Lead ─────────────────────────────────────────────────────── */}
      {/* cadence: mt-16/20/24 = 4/5/6rem steps */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <ProseBlock size="lead" className="max-w-[65ch] text-[var(--fg-dim)]">
          {lab.method.introduction.map((paragraph, i) => (
            <Reveal key={paragraph} as="p" delay={80 + i * 90}>
              {paragraph}
            </Reveal>
          ))}
        </ProseBlock>
      </div>

      {/* ── Axiom block ──────────────────────────────────────────────── */}
      <Reveal delay={300} className="mt-16 sm:mt-20 lg:mt-24">
        <div className="flex items-center gap-6 sm:gap-9">
          <div className="h-px flex-1 bg-[var(--line)]" />
          <div className="text-center">
            <p className="label mb-2 text-[var(--fg-faint)]">Axiom</p>
            {/* display-l: clamp(2.5rem,6vw,4.4rem) §4.4 */}
            <p
              className="metal-text font-semibold tracking-[-0.045em] leading-none"
              style={{ fontSize: "clamp(2.5rem,6vw,4.4rem)" }}
            >
              1 = 1
            </p>
            <p className="label mt-2 text-[var(--fg-faint)]">declared = realized</p>
          </div>
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
      </Reveal>

      {/* ── 4-Stage Process ───────────────────────────────────────────── */}
      <Section title={lab.method.process.title} eyebrow="Process">
        {/* Process intro — caption: 0.875rem §4.4 */}
        <Reveal delay={60}>
          <p
            className="leading-[1.72]"
            style={{ fontSize: "0.875rem", color: "var(--fg-mute)", maxWidth: "65ch" }}
          >
            {lab.method.process.introduction} Each stage is a discrete gate — no
            stage begins until its predecessor closes. The sequence is fixed; the
            invariant is the only thing that passes through.
          </p>
        </Reveal>

        {/* Metadata rail — caption: 0.875rem values §4.4 */}
        <Reveal delay={120} className="mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
            {[
              { label: "Method", value: "Computational Orchestration" },
              { label: "Stages", value: "04" },
              { label: "Gate",   value: "Per-stage" },
              { label: "Output", value: "Structural Invariant" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="border-r border-[var(--line)] last:border-r-0 px-5 py-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="label text-[var(--fg-faint)] mb-1.5">{item.label}</p>
                {/* caption: 0.875rem §4.4 */}
                <p
                  className="leading-[1.4] tracking-[-0.01em]"
                  style={{ fontSize: "0.875rem", color: "var(--fg-dim)" }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ── Symmetric 4-node diagram ───────────────────────────────── */}
        {/*
          Nodes 01↔04 mirror, 02↔03 mirror — bilateral symmetry = 1=1.
          Badge: 3.5rem × 3.5rem .surface rounded-[8px].
          Centerline: 1px --line at top:1.75rem (badge midpoint).
        */}
        <Reveal delay={180} className="mt-12 sm:mt-16">
          <div className="relative flex justify-between" style={{ maxWidth: "36rem" }}>
            {/* 1px hairline through badge centers — top: half of 3.5rem badge */}
            <div
              className="pointer-events-none absolute left-0 right-0 h-px"
              style={{ top: "1.75rem", background: "var(--line)" }}
              aria-hidden
            />
            {DIAGRAM_NODES.map((s) => (
              <div key={s.n} className="relative z-10 flex flex-col items-center gap-3">
                {/* badge: 3.5rem = 14 × 0.25rem §scale */}
                <div
                  className="surface flex items-center justify-center"
                  style={{ width: "3.5rem", height: "3.5rem", borderRadius: "8px" }}
                >
                  {/* body-l: 1.125rem §4.4 */}
                  <span
                    className="metal-text font-semibold"
                    style={{ fontSize: "1.125rem", letterSpacing: "-0.03em" }}
                  >
                    {s.n}
                  </span>
                </div>
                {/* sub-label — .label class §4.2 */}
                <p className="label text-center" style={{ color: "var(--fg-faint)", maxWidth: "5rem" }}>
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Stage sequence */}
        <div className="mt-16 max-w-4xl">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            const numeral = STAGE_NUMERALS[i];
            const subtitle = STAGE_SUBTITLES[step.title] ?? "";

            return (
              <Reveal key={step.title} delay={80 + i * 110}>
                <div className="relative">
                  {/* Vertical connector — not after the last */}
                  {!isLast && (
                    <div
                      className="absolute w-px"
                      style={{
                        left: "2.1rem",
                        top: "4.8rem",
                        height: "calc(100% - 1.5rem)",
                        background: "linear-gradient(180deg, var(--line-strong) 0%, var(--line) 100%)",
                      }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex gap-6 sm:gap-9 pb-14 last:pb-0">
                    {/* Numeral column — 4.2rem = 16.8 × 0.25rem */}
                    <div className="flex flex-col items-center shrink-0" style={{ width: "4.2rem" }}>
                      <div
                        className="surface flex items-center justify-center rounded-[6px] shrink-0"
                        style={{ width: "3.2rem", height: "3.2rem" }}
                      >
                        {/* body-l: 1.125rem §4.4 */}
                        <span
                          className="metal-text font-semibold"
                          style={{ fontSize: "1.125rem", letterSpacing: "-0.03em" }}
                        >
                          {numeral}
                        </span>
                      </div>
                    </div>

                    {/* Stage content — pt-1 = 0.25rem §scale */}
                    <div className="flex-1 pt-1">
                      {/* Stage header */}
                      <div className="mb-4">
                        <p className="label mb-1.5" style={{ color: "var(--fg-faint)" }}>
                          Stage {numeral} — {subtitle}
                        </p>
                        {/* body-l: 1.125rem §4.4 */}
                        <h3
                          className="font-semibold tracking-[-0.025em] leading-[1.2]"
                          style={{ fontSize: "1.125rem", color: "var(--fg)" }}
                        >
                          {step.title}
                        </h3>
                      </div>

                      <div className="rule mb-5" />

                      {/* Description — caption: 0.875rem §4.4 */}
                      <div className="space-y-3">
                        {step.paragraphs.map((p) => (
                          <p
                            key={p}
                            className="leading-[1.72]"
                            style={{ fontSize: "0.875rem", color: "var(--fg-dim)" }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Sequence close — σ symmetry marker */}
        <Reveal delay={520} className="mt-4">
          <div className="flex items-center gap-5">
            <div className="h-px flex-1" style={{ background: "var(--line)" }} />
            <span className="label" style={{ color: "var(--signal)" }}>
              σ — sequence closed
            </span>
            <div className="h-px flex-1" style={{ background: "var(--line)" }} />
          </div>
        </Reveal>
      </Section>

      {/* ── Cross-Domain Validation ───────────────────────────────────── */}
      <Section title={lab.method.crossDomainValidation.title} eyebrow="Validation">
        <div className="max-w-[65ch]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.method.crossDomainValidation.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} as="p" delay={i * 80}>
                {paragraph}
              </Reveal>
            ))}
          </ProseBlock>

          {/* Domain grid — Abloh mono tags */}
          {lab.method.crossDomainValidation.domains?.length ? (
            <Reveal delay={160}>
              <div className="mt-10 grid grid-cols-2 gap-px border border-[var(--line)] sm:grid-cols-3" style={{ background: "var(--line)" }}>
                {lab.method.crossDomainValidation.domains.map((domain, i) => (
                  <div
                    key={domain}
                    className="px-5 py-4 flex items-center gap-3"
                    style={{ background: "var(--bg)" }}
                  >
                    <span className="label shrink-0" style={{ color: "var(--fg-faint)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="label text-[var(--fg-mute)]">{domain}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* ── Role of Computational Systems ─────────────────────────────── */}
      <Section title={lab.method.roleOfComputationalSystems.title} eyebrow="Instrumentation">
        <div className="max-w-[65ch]">
          {/* Pull quote — Abloh device */}
          <Reveal delay={0} className="mb-10">
            <blockquote className="relative pl-6 sm:pl-8">
              <span
                className="pointer-events-none absolute left-0 top-[-0.15em] font-serif text-[3rem] leading-none select-none"
                style={{ color: "var(--metal-4)" }}
                aria-hidden
              >
                &ldquo;
              </span>
              {/* body-l: 1.125rem §4.4 */}
              <p
                className="text-pretty leading-[1.72]"
                style={{ fontSize: "1.125rem", color: "var(--fg-dim)" }}
              >
                Computation amplifies reasoning. It does not replace the researcher who directs
                the search and evaluates what survives.
              </p>
            </blockquote>
          </Reveal>

          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.method.roleOfComputationalSystems.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} as="p" delay={i * 80}>
                {paragraph}
              </Reveal>
            ))}
          </ProseBlock>
        </div>
      </Section>

      {/* ── Research Philosophy ───────────────────────────────────────── */}
      <Section title={lab.method.researchPhilosophy.title} eyebrow="Philosophy">
        <div className="max-w-[65ch]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.method.researchPhilosophy.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} as="p" delay={i * 80}>
                {paragraph}
              </Reveal>
            ))}
          </ProseBlock>
        </div>
      </Section>

      {/* ── Closing symmetry seal ──────────────────────────────────────── */}
      {/* cadence: mt-32/40/56 = 8/10/14rem */}
      <Reveal delay={0} className="mt-32 flex flex-col items-center gap-6 sm:mt-40 lg:mt-56">
        <Glyph variant="seal" size={88} strokeOpacity={0.22} />
        <p className="label text-[var(--fg-faint)]">σ — structural invariant</p>
        <div className="h-px w-16 bg-[var(--line-strong)]" />
      </Reveal>

      <div className="mt-24 lg:mt-32" />
    </div>
  );
}
