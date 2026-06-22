import type { Metadata } from "next";

import { MetadataList } from "@/components/metadata-list";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";
import { getArtifacts } from "@/lib/artifacts";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: lab.about.description,
  path: "/about",
});

export default function AboutPage() {
  const corpus = getArtifacts().find((artifact) => artifact.slug === "spektre-corpus");

  return (
    <div>
      {/* Page header */}
      <PageHeader title="About" description={lab.about.description} />

      {/* ── Lead editorial statement ──────────────────────────────────── */}
      <div className="mt-18 sm:mt-22 lg:mt-28">
        {/* Two-column editorial grid on large screens */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left: large metal headline */}
          <div>
            <Reveal delay={0}>
              <p className="metal-text text-balance font-semibold tracking-[-0.038em] leading-[1.04] text-[2.6rem] sm:text-[3.4rem] lg:text-[3.8rem]">
                One mind.<br />
                One invariant.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-7 flex items-center gap-4">
                <span className="h-px w-8 bg-[var(--line-strong)]" />
                <span className="label text-[var(--fg-faint)]">1 = 1</span>
              </div>
            </Reveal>
          </div>

          {/* Right: lead paragraphs */}
          <div className="flex flex-col justify-center">
            <ProseBlock size="lead" className="text-[var(--fg-dim)]">
              {lab.about.overview.slice(0, 2).map((paragraph, i) => (
                <Reveal key={paragraph} as="p" delay={80 + i * 90}>
                  {paragraph}
                </Reveal>
              ))}
            </ProseBlock>
          </div>
        </div>

        {/* Full-bleed hairline rule */}
        <div className="rule mt-14 sm:mt-16 lg:mt-20" />
      </div>

      {/* ── Research posture ─────────────────────────────────────────── */}
      {lab.about.overview[2] ? (
        <Reveal delay={80} className="mt-14 sm:mt-18 lg:mt-20">
          <div className="surface surface-hover max-w-[48rem] rounded-[var(--radius)] p-8 sm:p-10 lg:p-12">
            <p className="label mb-5 text-[var(--fg-faint)]">Research Posture</p>
            <p className="text-[0.98rem] leading-[1.9] text-[var(--fg-dim)] sm:text-[1.04rem]">
              {lab.about.overview[2]}
            </p>
          </div>
        </Reveal>
      ) : null}

      {/* ── Research Output ──────────────────────────────────────────── */}
      <Section title={lab.about.researchOutput.title} eyebrow="Output">
        <div className="max-w-[44rem]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.about.researchOutput.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} as="p" delay={i * 80}>
                {paragraph}
              </Reveal>
            ))}
          </ProseBlock>

          {/* Open-access signal */}
          <Reveal delay={200}>
            <div className="mt-9 flex items-center gap-4">
              <span className="h-px w-8 bg-[var(--line-strong)]" />
              <span className="label text-[var(--signal)]">Open Access</span>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Author — paradigm founder block ──────────────────────────── */}
      <Section title={lab.about.authorSection.title} eyebrow="Author">
        <div className="max-w-[54rem]">
          {/* Symmetric layout: seal left, content right */}
          <Reveal delay={0}>
            <div className="surface rounded-[var(--radius)] p-0 overflow-hidden">
              {/* Top meta strip */}
              <div
                className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-8 py-4 sm:px-10"
              >
                <p className="label text-[var(--fg-faint)]">Independent Researcher</p>
                <p className="label text-[var(--fg-faint)]">Helsinki</p>
              </div>

              {/* Main content area */}
              <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
                {/* Text column */}
                <div className="p-8 sm:p-10 lg:p-12">
                  {/* Name */}
                  <h3 className="metal-text text-[1.9rem] font-semibold tracking-[-0.033em] leading-[1.06] sm:text-[2.4rem]">
                    {lab.about.authorSection.name}
                  </h3>

                  <p className="label mt-3 text-[var(--fg-mute)]">
                    {lab.about.authorSection.role}
                  </p>

                  <div className="rule my-7" />

                  {/* Bio */}
                  <p className="max-w-[38rem] text-[0.97rem] leading-[1.9] text-[var(--fg-dim)] sm:text-[1.02rem]">
                    {lab.about.authorSection.bio}
                  </p>

                  {/* Invariant tag line */}
                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-px w-5 bg-[var(--line-strong)]" />
                    <span className="label text-[var(--fg-faint)]">
                      σ — declared = realized
                    </span>
                  </div>
                </div>

                {/* Seal column — hidden on mobile, shown on sm+ */}
                <div className="hidden items-center justify-center border-l border-[var(--line)] px-10 sm:flex lg:px-14">
                  <Glyph variant="seal" size={96} strokeOpacity={0.28} />
                </div>
              </div>

              {/* Bottom metadata strip */}
              <div className="border-t border-[var(--line)] px-8 py-6 sm:px-10">
                <MetadataList
                  items={[
                    { label: "Name", value: lab.about.authorSection.name },
                    { label: "Role", value: lab.about.authorSection.role },
                    { label: "Location", value: lab.location },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Divisions trajectory ──────────────────────────────────────── */}
      <Section title="Trajectory" eyebrow="Divisions">
        <div className="max-w-[44rem]">
          <Reveal delay={0}>
            <p className="mb-10 text-[0.9rem] leading-[1.87] text-[var(--fg-mute)]">
              One invariant traced across five divisions — from formal theory to world-building.
              Each division is a stage, not a silo.
            </p>
          </Reveal>

          {/* Division list */}
          <div className="border-t border-[var(--line)]">
            {[
              {
                index: "01",
                label: "Research",
                sub: "Corpus · Protocol",
                status: "REAL",
                color: "var(--signal)",
              },
              {
                index: "02",
                label: "Systems",
                sub: "σ-gate · Creation OS",
                status: "SHIPPING",
                color: "var(--signal)",
              },
              {
                index: "03",
                label: "Studio",
                sub: "Film · Media · @spektrelabs",
                status: "EMERGING",
                color: "var(--fg-mute)",
              },
              {
                index: "04",
                label: "Games",
                sub: "AAA Generative",
                status: "VISION",
                color: "var(--fg-faint)",
              },
              {
                index: "05",
                label: "Shoreworld",
                sub: "IP · World",
                status: "VISION",
                color: "var(--fg-faint)",
              },
            ].map((div, i) => (
              <Reveal key={div.index} as="div" delay={i * 70}>
                <div className="flex items-center gap-6 border-b border-[var(--line)] py-5">
                  {/* Index */}
                  <span
                    className="w-8 shrink-0 font-mono text-[0.7rem] tabular-nums"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    {div.index}
                  </span>

                  {/* Label + sub */}
                  <div className="flex-1">
                    <p
                      className="text-[0.97rem] font-semibold tracking-[-0.02em]"
                      style={{ color: "var(--fg)" }}
                    >
                      {div.label}
                    </p>
                    <p className="label mt-0.5" style={{ color: "var(--fg-faint)" }}>
                      {div.sub}
                    </p>
                  </div>

                  {/* Status tag */}
                  <span className="label shrink-0" style={{ color: div.color }}>
                    {div.status}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Links ────────────────────────────────────────────────────── */}
      <Section title="Links" eyebrow="Connect">
        <div className="max-w-[42rem]">
          <Reveal delay={0}>
            <div className="border-l-2 border-[var(--line-strong)] pl-6 sm:pl-8">
              <MetadataList
                items={[
                  {
                    label: "ORCID",
                    value: <ExternalLink href={LINKS.orcid}>{LINKS.orcid}</ExternalLink>,
                  },
                  {
                    label: "GitHub",
                    value: (
                      <ExternalLink href={corpus?.github ?? LINKS.github}>
                        {corpus?.github ?? LINKS.github}
                      </ExternalLink>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    value: (
                      <ExternalLink href={LINKS.linkedin}>{LINKS.linkedin}</ExternalLink>
                    ),
                  },
                ]}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Closing seal ──────────────────────────────────────────────── */}
      <Reveal
        delay={0}
        className="mt-32 flex flex-col items-center gap-5 sm:mt-40 lg:mt-56"
      >
        <Glyph variant="divider" size={180} strokeOpacity={0.18} />
        <p className="label text-[var(--fg-faint)]">Spektre Labs · Helsinki</p>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
