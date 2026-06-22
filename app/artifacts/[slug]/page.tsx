import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackLink } from "@/components/back-link";
import { ExternalLink } from "@/components/external-link";
import { MetadataList } from "@/components/metadata-list";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { StructuredData } from "@/components/structured-data";
import { getArtifactBySlug, getArtifacts } from "@/lib/artifacts";
import { absoluteUrl, createPageMetadata } from "@/lib/site";
import { getArtifactStructuredData } from "@/lib/structured-data";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  const artifacts = getArtifacts();
  return artifacts.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const artifact = getArtifactBySlug(params.slug);
  if (!artifact) return { title: "Artifact" };
  return createPageMetadata({
    title: artifact.title,
    description: artifact.summary,
    path: `/artifacts/${params.slug}`,
    type: "article",
  });
}

export default function ArtifactPage({ params }: { params: Params }) {
  const artifact = getArtifactBySlug(params.slug);
  if (!artifact) notFound();

  return (
    <div>
      <StructuredData data={getArtifactStructuredData(artifact)} />

      {/* back nav */}
      <BackLink href="/artifacts" className="mb-10">
        Back to Artifacts
      </BackLink>

      {/* page header — title + summary as description */}
      <PageHeader title={artifact.title} description={artifact.summary} />

      {/* body grid — generous gutter, editorial proportion */}
      <section className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* left gutter — structural breathing room */}
        <div className="lg:col-span-3" />

        <div className="grid gap-8 lg:col-span-9 lg:grid-cols-12">
          {/* main body prose */}
          <div className="lg:col-span-7">
            <ProseBlock size="lead" className="space-y-7 max-w-3xl">
              {artifact.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className={
                    paragraph === "K(crit) ~= 0.127"
                      ? "font-mono text-lg text-[var(--signal)] tracking-tight"
                      : "text-[var(--fg-mute)] leading-[1.90]"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </ProseBlock>
          </div>

          {/* sticky metadata sidebar */}
          <div
            className="border-t pt-6 lg:col-span-5 lg:max-w-[20rem] lg:justify-self-end lg:sticky lg:top-28 lg:self-start"
            style={{ borderColor: "var(--line-strong)" }}
          >
            {/* Abloh-style label above the data panel */}
            <p className="label mb-5">Artifact metadata</p>
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
                      <span className="text-[var(--fg-faint)]">Unreleased</span>
                    ),
                  },
                  {
                    label: "Zenodo",
                    value: artifact.zenodo ? (
                      <ExternalLink href={artifact.zenodo}>
                        {artifact.zenodo}
                      </ExternalLink>
                    ) : (
                      <span className="text-[var(--fg-faint)]">Unreleased</span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
