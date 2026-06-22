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
  /method — Computational Orchestration
  4-stage process rendered as a precise symmetric sequence: mono numerals,
  hairline connectors, σ-honest descriptions. Grammar from studio/page.tsx.
  Art-canon: OLED, platinum, hairline, Abloh mono, absolute symmetry (1=1).
*/

const STAGE_NUMERALS = ["01", "02", "03", "04"];

const STAGE_SUBTITLES: Record<string, string> = {
  "Formal Modeling":       "declare the structure",
  "Computational Exploration": "traverse the space",
  "Iterative Falsification":   "stress-test to collapse",
  "Structural Synthesis":      "formalize the invariant",
};

export default function MethodPage() {
  const steps = lab.method.process.steps;

  return (
    <div>
      <PageHeader title={lab.method.title} description={lab.method.description} />

      {/* ── Lead ─────────────────────────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <ProseBlock size="lead" className="max-w-[44rem] text-[var(--fg-dim)]">
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
            <p
              className="metal-text font-semibold tracking-[-0.04em] leading-none"
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.4rem)" }}
            >
              1 = 1
            </p>
            <p className="label mt-2 text-[var(--fg-faint)]">declared = realized</p>
          </div>
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
      </Reveal>

      {/* ── 4-Stage Process — symmetric precision sequence ────────────── */}
      <Section title={lab.method.process.title} eyebrow="Process">
        {/* Process intro */}
        <Reveal delay={60}>
          <p
            className="max-w-[42rem] text-[0.9rem] leading-[1.87]"
            style={{ color: "var(--fg-mute)" }}
          >
            {lab.method.process.introduction} Each stage is a discrete gate — no
            stage begins until its predecessor closes. The sequence is fixed; the
            invariant is the only thing that passes through.
          </p>
        </Reveal>

        {/* Metadata rail */}
        <Reveal delay={120} className="mt-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-[var(--line)] rounded-[var(--radius)] overflow-hidden">
            {[
              { label: "Method", value: "Computational Orchestration" },
              { label: "Stages", value: "04" },
              { label: "Gate", value: "Per-stage" },
              { label: "Output", value: "Structural Invariant" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="border-r border-[var(--line)] last:border-r-0 px-5 py-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <p className="label text-[var(--fg-faint)] mb-1.5">{item.label}</p>
                <p
                  className="text-[0.88rem] tracking-[-0.01em]"
                  style={{ color: "var(--fg-dim)" }}
                >
                  {item.value}
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
                  {/* Vertical connector — runs between stages, not after the last */}
                  {!isLast && (
                    <div
                      className="absolute left-[2.1rem] top-[4.8rem] w-px"
                      style={{
                        height: "calc(100% - 1.5rem)",
                        background: "linear-gradient(180deg, var(--line-strong) 0%, var(--line) 100%)",
                      }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex gap-6 sm:gap-9 pb-14 last:pb-0">
                    {/* Numeral column — fixed width, perfectly aligned */}
                    <div className="flex flex-col items-center shrink-0" style={{ width: "4.2rem" }}>
                      {/* Numeral badge */}
                      <div
                        className="surface flex items-center justify-center rounded-[6px] shrink-0"
                        style={{ width: "3.2rem", height: "3.2rem" }}
                      >
                        <span
                          className="metal-text font-semibold tracking-[-0.03em]"
                          style={{ fontSize: "1.15rem" }}
                        >
                          {numeral}
                        </span>
                      </div>
                    </div>

                    {/* Stage content */}
                    <div className="flex-1 pt-[0.35rem]">
                      {/* Stage header */}
                      <div className="mb-4">
                        <p className="label mb-1.5" style={{ color: "var(--fg-faint)" }}>
                          Stage {numeral} — {subtitle}
                        </p>
                        <h3
                          className="text-[1.12rem] font-semibold tracking-[-0.025em] leading-[1.2]"
                          style={{ color: "var(--fg)" }}
                        >
                          {step.title}
                        </h3>
                      </div>

                      {/* Hairline */}
                      <div className="rule mb-5" />

                      {/* Description */}
                      <div className="space-y-3">
                        {step.paragraphs.map((p) => (
                          <p
                            key={p}
                            className="text-[0.92rem] leading-[1.88]"
                            style={{ color: "var(--fg-dim)" }}
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

        {/* Sequence close — symmetry marker */}
        <Reveal delay={520} className="mt-4">
          <div className="flex items-center gap-5">
            <div className="h-px flex-1" style={{ background: "var(--line)" }} />
            <span className="label" style={{ color: "var(--signal)", fontSize: "0.58rem" }}>
              σ — sequence closed
            </span>
            <div className="h-px flex-1" style={{ background: "var(--line)" }} />
          </div>
        </Reveal>
      </Section>

      {/* ── Cross-Domain Validation ───────────────────────────────────── */}
      <Section title={lab.method.crossDomainValidation.title} eyebrow="Validation">
        <div className="max-w-[44rem]">
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
              <div className="mt-10 grid grid-cols-2 gap-px border border-[var(--line)] sm:grid-cols-3">
                {lab.method.crossDomainValidation.domains.map((domain, i) => (
                  <div
                    key={domain}
                    className="border border-[var(--line)] px-5 py-4 flex items-center gap-3"
                  >
                    <span
                      className="label shrink-0"
                      style={{ color: "var(--fg-faint)", fontSize: "0.58rem" }}
                    >
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
        <div className="max-w-[44rem]">
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
              <p
                className="text-pretty leading-[1.84] sm:text-[1.08rem]"
                style={{ color: "var(--fg-dim)" }}
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
        <div className="max-w-[44rem]">
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
      <Reveal delay={0} className="mt-32 flex flex-col items-center gap-6 sm:mt-40 lg:mt-56">
        <Glyph variant="seal" size={88} strokeOpacity={0.22} />
        <p className="label text-[var(--fg-faint)]">σ — structural invariant</p>
        <div className="h-px w-16 bg-[var(--line-strong)]" />
      </Reveal>

      <div className="mt-24 lg:mt-32" />
    </div>
  );
}
