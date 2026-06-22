import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { MethodDiagram } from "@/components/method-diagram";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Method",
  description: lab.method.description,
  path: "/method",
});

export default function MethodPage() {
  return (
    <div>
      <PageHeader title={lab.method.title} description={lab.method.description} />

      {/* ── Lead — three-paragraph introduction ──────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        <ProseBlock size="lead" className="max-w-[44rem] text-[var(--fg-dim)]">
          {lab.method.introduction.map((paragraph, i) => (
            <Reveal key={paragraph} as="p" delay={80 + i * 90}>
              {paragraph}
            </Reveal>
          ))}
        </ProseBlock>
      </div>

      {/* ── Axiom block — 1 = 1 ─────────────────────────────────────── */}
      <Reveal delay={240} className="mt-14 sm:mt-18 lg:mt-20">
        <div className="flex items-center gap-6 sm:gap-9">
          {/* Left hairline */}
          <div className="h-px flex-1 bg-[var(--line)]" />

          {/* Invariant statement */}
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

          {/* Right hairline */}
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
      </Reveal>

      {/* ── Process — 4-stage symmetric diagram ──────────────────────── */}
      <Section title={lab.method.process.title} eyebrow="Process">
        <div className="max-w-5xl">
          <Reveal delay={60}>
            <p
              className="max-w-[42rem] text-[0.9rem] leading-[1.87]"
              style={{ color: "var(--fg-mute)" }}
            >
              {lab.method.process.introduction}
            </p>
          </Reveal>

          {/* Hairline separator before diagram */}
          <div className="rule mt-10 mb-0" />

          <MethodDiagram steps={lab.method.process.steps} className="mt-0" />
        </div>
      </Section>

      {/* ── Cross-Domain Validation ───────────────────────────────────── */}
      <Section
        title={lab.method.crossDomainValidation.title}
        eyebrow="Validation"
      >
        <div className="max-w-[44rem]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.method.crossDomainValidation.paragraphs.map(
              (paragraph, i) => (
                <Reveal key={paragraph} as="p" delay={i * 80}>
                  {paragraph}
                </Reveal>
              )
            )}
          </ProseBlock>

          {/* Domain grid — Abloh-style mono tags */}
          {lab.method.crossDomainValidation.domains?.length ? (
            <Reveal delay={160}>
              <div className="mt-10 grid grid-cols-2 gap-px border border-[var(--line)] sm:grid-cols-3">
                {lab.method.crossDomainValidation.domains.map((domain) => (
                  <div
                    key={domain}
                    className="border border-[var(--line)] px-5 py-4"
                  >
                    <p className="label text-[var(--fg-mute)]">{domain}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </Section>

      {/* ── Role of Computational Systems ────────────────────────────── */}
      <Section
        title={lab.method.roleOfComputationalSystems.title}
        eyebrow="Instrumentation"
      >
        <div className="max-w-[44rem]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.method.roleOfComputationalSystems.paragraphs.map(
              (paragraph, i) => (
                <Reveal key={paragraph} as="p" delay={i * 80}>
                  {paragraph}
                </Reveal>
              )
            )}
          </ProseBlock>
        </div>
      </Section>

      {/* ── Research Philosophy ───────────────────────────────────────── */}
      <Section
        title={lab.method.researchPhilosophy.title}
        eyebrow="Philosophy"
      >
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
