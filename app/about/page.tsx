import type { Metadata } from "next";

import { MetadataList } from "@/components/metadata-list";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { ExternalLink } from "@/components/external-link";
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
      {/* Page header — uses PageHeader component as-is (do not modify its internals) */}
      <PageHeader title="About" description={lab.about.description} />

      {/* ── Lead editorial overview ──────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-24">
        {/* Large metal-text statement */}
        <p className="metal-text rise text-balance text-[2.4rem] font-semibold tracking-[-0.035em] leading-[1.06] sm:text-[3.2rem] lg:text-[4rem] lg:leading-[1.02] max-w-[26rem] sm:max-w-[34rem] lg:max-w-[46rem]">
          Independent research.<br />
          Structural discovery.
        </p>

        {/* Hairline under the statement */}
        <div className="rule mt-10 mb-10 sm:mt-12 sm:mb-12" />

        {/* Overview paragraphs — lead size, generous leading */}
        <ProseBlock size="lead" className="max-w-[48rem] text-[var(--fg-dim)]">
          {lab.about.overview.slice(0, 2).map((paragraph, i) => (
            <p key={paragraph} className="rise" style={{ animationDelay: `${80 + i * 80}ms` }}>
              {paragraph}
            </p>
          ))}
        </ProseBlock>
      </div>

      {/* ── Extended overview — third paragraph ─────────────────────── */}
      {lab.about.overview[2] ? (
        <div className="mt-16 max-w-[44rem] sm:mt-20 lg:mt-24">
          <div className="surface rounded-[var(--radius)] p-7 sm:p-9">
            <p className="label mb-4 text-[var(--fg-faint)]">Research Posture</p>
            <p className="text-[0.98rem] leading-[1.88] text-[var(--fg-dim)] sm:text-[1.04rem]">
              {lab.about.overview[2]}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Research Output ──────────────────────────────────────────── */}
      <Section title={lab.about.researchOutput.title} eyebrow="Output">
        <div className="max-w-[44rem]">
          <ProseBlock className="text-[var(--fg-dim)]">
            {lab.about.researchOutput.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </ProseBlock>

          {/* Open-access signal tag */}
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-8 bg-[var(--line-strong)]" />
            <span className="label text-[var(--signal)]">Open Access</span>
          </div>
        </div>
      </Section>

      {/* ── Author block ─────────────────────────────────────────────── */}
      <Section title={lab.about.authorSection.title} eyebrow="Author">
        <div className="max-w-[52rem]">
          {/* Author card */}
          <div className="surface rounded-[var(--radius)] p-8 sm:p-10 lg:p-12">
            {/* Author name — metal headline */}
            <h3 className="metal-text text-[1.9rem] font-semibold tracking-[-0.03em] sm:text-[2.4rem]">
              {lab.about.authorSection.name}
            </h3>

            <p className="label mt-3 text-[var(--fg-mute)]">{lab.about.authorSection.role}</p>

            <div className="rule my-7" />

            <p className="max-w-[38rem] text-[0.97rem] leading-[1.86] text-[var(--fg-dim)] sm:text-[1.02rem]">
              {lab.about.authorSection.bio}
            </p>

            {/* Metadata table inset */}
            <div className="mt-8">
              <MetadataList
                items={[
                  { label: "Name", value: lab.about.authorSection.name },
                  { label: "Role", value: lab.about.authorSection.role },
                  { label: "Location", value: lab.location },
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Links ────────────────────────────────────────────────────── */}
      <Section title="Links" eyebrow="Connect">
        <div className="max-w-[42rem]">
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
                  value: <ExternalLink href={LINKS.linkedin}>{LINKS.linkedin}</ExternalLink>,
                },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ── Footer spacer ─────────────────────────────────────────────── */}
      <div className="mt-40 lg:mt-56" />
    </div>
  );
}
