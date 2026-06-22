import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/back-link";
import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { MetadataList } from "@/components/metadata-list";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Reveal } from "@/components/reveal";
import { StructuredData } from "@/components/structured-data";
import { getArtifactBySlug, getArtifacts } from "@/lib/artifacts";
import { absoluteUrl, createPageMetadata } from "@/lib/site";
import { getArtifactStructuredData } from "@/lib/structured-data";

type Params = Promise<{
  slug: string;
}>;

export function generateStaticParams() {
  const artifacts = getArtifacts();
  return artifacts.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);
  if (!artifact) return { title: "Artifact" };
  return createPageMetadata({
    title: artifact.title,
    description: artifact.summary,
    path: `/artifacts/${slug}`,
    type: "article",
  });
}

export default async function ArtifactPage({ params }: { params: Params }) {
  const { slug } = await params;
  const artifact = getArtifactBySlug(slug);
  if (!artifact) notFound();

  const allArtifacts = getArtifacts();
  const related = allArtifacts.filter((a) => a.slug !== artifact.slug);

  const isSigmaGate = artifact.slug === "sigma-gate";
  const isCorpus = artifact.slug === "spektre-corpus";
  const github = artifact.github?.trim();

  return (
    <div>
      <StructuredData data={getArtifactStructuredData(artifact)} />

      {/* back nav */}
      <BackLink href="/artifacts" className="mb-10">
        Back to Artifacts
      </BackLink>

      {/* page header */}
      <PageHeader title={artifact.title} description={artifact.summary} />

      {/* body grid */}
      <section className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* left gutter */}
        <div className="lg:col-span-3" />

        <div className="grid gap-8 lg:col-span-9 lg:grid-cols-12">
          {/* main body prose */}
          <div className="lg:col-span-7">
            <ProseBlock size="lead" className="space-y-7 max-w-3xl">
              {artifact.description.map((paragraph, i) => (
                <Reveal key={paragraph} delay={i * 55}>
                  <p
                    className={
                      paragraph === "K(crit) ~= 0.127"
                        ? "font-mono text-lg text-[var(--signal)] tracking-tight"
                        : "text-[var(--fg-mute)] leading-[1.92]"
                    }
                  >
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </ProseBlock>

            {/* corpus — browse all papers */}
            {isCorpus && (
              <Reveal delay={120}>
                <Link
                  href="/corpus"
                  className="btn-metal mt-10 inline-flex items-center gap-2 rounded-[8px] px-6 py-2.5 text-sm font-semibold tracking-tight"
                >
                  Browse all 72 papers →
                </Link>
              </Reveal>
            )}

            {/* σ-gate product block — what it does + CTA */}
            {isSigmaGate && (
              <Reveal delay={260}>
                <div
                  className="surface mt-12 p-7 sm:p-9"
                  style={{ borderColor: "var(--line-strong)" }}
                >
                  <p className="label mb-6 text-[var(--fg-faint)]">
                    Product · open core
                  </p>

                  <ul className="space-y-3.5">
                    {[
                      "Deterministic secret-leak detection — zero model calls, zero network round-trip",
                      "Prompt-injection & jailbreak interception before AI output lands",
                      "Structural coherence (σ) scoring: declared vs. realized alignment",
                      "Sub-100µs per call — drop-in for any agent or CI pipeline",
                      "Open core ships as a zero-dependency library; hosted σ API available",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm leading-[1.82] text-[var(--fg-mute)] sm:text-[0.97rem]"
                      >
                        <Glyph
                          variant="node"
                          size={12}
                          strokeOpacity={0.5}
                          className="mt-[0.18rem] shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="mt-8 flex flex-wrap items-center gap-5 border-t pt-6"
                    style={{ borderColor: "var(--line)" }}
                  >
                    {github && (
                      <Link
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-metal inline-flex items-center gap-2 rounded-[8px] px-6 py-2.5 text-sm font-semibold tracking-tight"
                      >
                        Open on GitHub →
                      </Link>
                    )}
                    <span
                      className="label"
                      style={{ color: "var(--fg-faint)" }}
                    >
                      self-hostable · MIT core · hosted API
                    </span>
                  </div>
                </div>
              </Reveal>
            )}
          </div>

          {/* sticky metadata sidebar */}
          <Reveal
            delay={140}
            className="lg:col-span-5 lg:max-w-[20rem] lg:justify-self-end"
          >
            <div
              className="border-t pt-6 lg:sticky lg:top-28 lg:self-start"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <p className="label mb-5 text-[var(--fg-faint)]">
                Artifact metadata
              </p>
              <div className="surface rounded-[12px] p-5">
                <MetadataList
                  items={[
                    {
                      label: "Slug",
                      value: (
                        <span className="font-mono text-[0.78rem] text-[var(--fg-mute)] break-all">
                          {absoluteUrl(`/artifacts/${artifact.slug}`)}
                        </span>
                      ),
                    },
                    {
                      label: "GitHub",
                      value: artifact.github ? (
                        <ExternalLink href={artifact.github}>
                          {artifact.github}
                        </ExternalLink>
                      ) : (
                        <span className="text-[var(--fg-faint)]">
                          Unreleased
                        </span>
                      ),
                    },
                    {
                      label: "Zenodo",
                      value: artifact.zenodo ? (
                        <ExternalLink href={artifact.zenodo}>
                          {artifact.zenodo}
                        </ExternalLink>
                      ) : (
                        <span className="text-[var(--fg-faint)]">
                          Unreleased
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related artifacts rail — Corpus ↔ Protocol ↔ σ-gate linkage */}
      {related.length > 0 && (
        <section
          className="mt-28 border-t pt-16 sm:mt-36 sm:pt-20"
          style={{ borderColor: "var(--line)" }}
        >
          <Reveal delay={0}>
            <div className="mb-10 flex items-center gap-5">
              <Glyph variant="divider" size={120} strokeOpacity={0.28} />
              <p className="label shrink-0 text-[var(--fg-faint)]">Related</p>
              <Glyph variant="divider" size={120} strokeOpacity={0.28} />
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((rel, i) => (
              <Reveal key={rel.slug} delay={60 + i * 80}>
                <article
                  className="group surface surface-hover p-7 sm:p-8"
                >
                  {/* node tick + slug label */}
                  <div className="mb-5 flex items-center gap-3">
                    <Glyph
                      variant="node"
                      size={13}
                      strokeOpacity={0.45}
                    />
                    <span className="label text-[var(--fg-faint)]">
                      /{rel.slug}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg leading-[1.22] tracking-tight text-[var(--fg)]">
                    <Link
                      href={`/artifacts/${rel.slug}`}
                      className="transition-colors duration-500 hover:text-[var(--metal-1)]"
                      style={{ transitionTimingFunction: "var(--ease)" }}
                    >
                      {rel.title}
                    </Link>
                  </h3>

                  <p className="mt-3.5 text-sm leading-[1.80] text-[var(--fg-mute)]">
                    {rel.summary}
                  </p>

                  <div
                    className="mt-6 flex items-center gap-5 border-t pt-5"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <Link
                      href={`/artifacts/${rel.slug}`}
                      className="label transition-colors duration-500 hover:text-[var(--metal-1)]"
                      style={{
                        transitionTimingFunction: "var(--ease)",
                        color: "var(--fg-dim)",
                      }}
                    >
                      View →
                    </Link>
                    {rel.github && (
                      <ExternalLink href={rel.github}>GitHub</ExternalLink>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
