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
      <BackLink href="/artifacts" className="mb-8">
        Back to Artifacts
      </BackLink>

      <PageHeader title={artifact.title} description={artifact.summary} />

      <section className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-3" />
        <div className="grid gap-6 lg:col-span-9 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProseBlock size="lead" className="space-y-6 max-w-3xl">
              {artifact.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className={
                    paragraph === "K(crit) ~= 0.127"
                      ? "font-mono text-lg text-neutral-800 dark:text-neutral-200"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </ProseBlock>
          </div>

          <div className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 lg:col-span-5 lg:max-w-[20rem] lg:justify-self-end lg:sticky lg:top-28 lg:self-start">
            <MetadataList
              items={[
                {
                  label: "Slug",
                  value: (
                    <span className="font-mono text-[0.82rem] text-neutral-500 dark:text-neutral-400">
                      {absoluteUrl(`/artifacts/${artifact.slug}`)}
                    </span>
                  ),
                },
                {
                  label: "GitHub",
                  value: artifact.github ? (
                    <ExternalLink href={artifact.github}>{artifact.github}</ExternalLink>
                  ) : (
                    "Unavailable"
                  ),
                },
                {
                  label: "Zenodo",
                  value: artifact.zenodo ? (
                    <ExternalLink href={artifact.zenodo}>{artifact.zenodo}</ExternalLink>
                  ) : (
                    "Unavailable"
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

