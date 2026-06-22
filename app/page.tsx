import type { Metadata } from "next";

import { EditorialLink } from "@/components/editorial-link";
import { Hero } from "@/components/hero";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { getArtifacts } from "@/lib/artifacts";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: lab.name,
  description: lab.subtext,
  path: "/",
});

export default function Home() {
  const artifacts = getArtifacts();
  const corpus = artifacts.find((artifact) => artifact.slug === "spektre-corpus");
  const protocol = artifacts.find((artifact) => artifact.slug === "spektre-protocol");

  return (
    <div>
      <Hero />

      {/* ── What We Do ─────────────────────────────────────────────── */}
      <Section
        title={lab.home.whatWeDo.title}
        eyebrow="Discipline"
        className="mt-28 pt-14 sm:mt-36 sm:pt-18 lg:mt-44 lg:pt-24"
      >
        <div className="max-w-[48rem]">
          <ProseBlock size="lead" className="text-[var(--fg-dim)] space-y-6">
            <p>{lab.home.whatWeDo.description}</p>
            <p>{lab.home.whatWeDo.detail}</p>
          </ProseBlock>

          {/* Domain grid — Abloh-style labeled list */}
          <div className="mt-12">
            <p className="label mb-6 text-[var(--fg-faint)]">Research Domains</p>
            <ul className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              {lab.home.whatWeDo.domains.map((domain, i) => (
                <li
                  key={domain}
                  className="rise flex items-center gap-4 border-b border-[var(--line)] py-4 text-[0.95rem] tracking-[-0.01em] text-[var(--fg-dim)] transition-colors duration-500 hover:text-[var(--fg)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* hairline index tick */}
                  <span className="label text-[var(--fg-faint)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {domain}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Primary Artifact — Spektre Corpus ───────────────────────── */}
      <Section
        title="Primary Artifact"
        eyebrow="Corpus"
        className="mt-32 pt-16 sm:mt-40 sm:pt-20 lg:mt-52 lg:pt-28"
      >
        {corpus ? (
          <div className="max-w-[52rem]">
            {/* Artifact panel — surface glass card */}
            <div className="surface surface-hover rounded-[var(--radius)] p-8 sm:p-10 lg:p-12">
              {/* Eyebrow metadata row */}
              <div className="mb-8 flex items-center gap-6">
                <span className="label text-[var(--fg-faint)]">Artifact — Primary</span>
                <span className="h-px flex-1 bg-[var(--line)]" />
                <span className="label text-[var(--signal)]">Active</span>
              </div>

              {/* Title — large metal headline */}
              <h3 className="metal-text rise text-balance text-[2.4rem] font-semibold tracking-[-0.03em] leading-[1.04] sm:text-[3rem] lg:text-[3.6rem] lg:leading-[1.02]">
                {corpus.title}
              </h3>

              {/* Summary — generous lead text */}
              <p className="mt-6 max-w-[44rem] text-pretty text-[1.1rem] leading-[1.74] text-[var(--fg-dim)] sm:text-[1.22rem]">
                {corpus.summary}
              </p>

              {/* Rule */}
              <div className="rule my-8" />

              {/* Description paragraphs */}
              <div className="max-w-[42rem] space-y-5">
                {(corpus.homeDescription ?? corpus.description.slice(0, 2)).map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[0.96rem] leading-[1.9] text-[var(--fg-mute)] sm:text-[1.01rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Links row */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                {corpus.github ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="label text-[var(--fg-faint)]">Repository</p>
                    <EditorialLink href={corpus.github} external>
                      {corpus.github}
                    </EditorialLink>
                  </div>
                ) : null}
                <EditorialLink href="/artifacts/spektre-corpus" className="btn-metal rounded-[8px] px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.06em] uppercase no-underline">
                  View Artifact
                </EditorialLink>
              </div>
            </div>
          </div>
        ) : null}
      </Section>

      {/* ── Supporting Framework — Spektre Protocol ─────────────────── */}
      <Section
        title="Supporting Framework"
        eyebrow="Protocol"
        className="mt-32 pt-16 sm:mt-40 sm:pt-20 lg:mt-48 lg:pt-24"
      >
        {protocol ? (
          <div className="max-w-[42rem]">
            <div className="border-l-2 border-[var(--line-strong)] pl-6 sm:pl-8">
              <p className="label mb-5 text-[var(--fg-faint)]">Framework — Secondary</p>

              <h3 className="text-[1.55rem] font-semibold tracking-[-0.025em] leading-[1.2] text-[var(--fg)] sm:text-[1.85rem]">
                {protocol.title}
              </h3>

              <p className="mt-4 text-pretty text-[0.98rem] leading-[1.84] text-[var(--fg-dim)] sm:text-[1.03rem]">
                {protocol.summary}
              </p>

              <div className="mt-6 space-y-4">
                {(protocol.homeDescription ?? protocol.description.slice(0, 1)).map((paragraph) => (
                  <p key={paragraph} className="text-[0.93rem] leading-[1.9] text-[var(--fg-mute)]">
                    {paragraph}
                  </p>
                ))}
              </div>

              {protocol.github ? (
                <div className="mt-7">
                  <p className="label mb-2 text-[var(--fg-faint)]">Repository</p>
                  <EditorialLink href={protocol.github} external>
                    {protocol.github}
                  </EditorialLink>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Section>

      {/* ── Research Teaser ─────────────────────────────────────────── */}
      <Section
        title={lab.home.research.title}
        eyebrow="Inquiry"
        className="mt-32 pt-16 sm:mt-40 sm:pt-20 lg:mt-48 lg:pt-24"
      >
        <div className="max-w-[44rem]">
          <ProseBlock className="text-[var(--fg-dim)]">
            <p>{lab.home.research.description}</p>
            <p>{lab.home.research.detail}</p>
          </ProseBlock>

          <div className="mt-9 flex items-center gap-5">
            <EditorialLink href="/research" className="btn-metal rounded-[8px] px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.06em] uppercase no-underline">
              View Research
            </EditorialLink>
            <span className="h-px w-8 bg-[var(--line-strong)]" />
            <span className="label text-[var(--fg-faint)]">Ongoing</span>
          </div>
        </div>
      </Section>

      {/* ── Method Teaser ───────────────────────────────────────────── */}
      <Section
        title={lab.home.method.title}
        eyebrow="Process"
        className="mt-32 pt-16 sm:mt-40 sm:pt-20 lg:mt-48 lg:pt-24"
      >
        <div className="max-w-[44rem]">
          {/* Large editorial quote block */}
          <blockquote className="relative pl-6 sm:pl-8">
            <span
              className="pointer-events-none absolute left-0 top-[-0.1em] font-serif text-[3.5rem] leading-none text-[var(--metal-4)] select-none"
              aria-hidden
            >
              &ldquo;
            </span>
            <p className="text-pretty text-[1.08rem] leading-[1.82] text-[var(--fg-dim)] sm:text-[1.18rem] lg:text-[1.25rem]">
              {lab.home.method.description}
            </p>
          </blockquote>

          <div className="mt-9">
            <EditorialLink href="/method">
              View Method →
            </EditorialLink>
          </div>
        </div>
      </Section>

      {/* ── Footer spacer ───────────────────────────────────────────── */}
      <div className="mt-40 lg:mt-56" />
    </div>
  );
}
