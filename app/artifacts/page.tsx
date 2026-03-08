import type { Metadata } from "next";

import { ArtifactFeature } from "@/components/artifact-feature";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { StructuredData } from "@/components/structured-data";
import { getArtifacts, getArtifactsIntroduction } from "@/lib/artifacts";
import { createPageMetadata } from "@/lib/site";
import { getArtifactsPageStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Artifacts",
  description: "Research artifacts published by Spektre Labs.",
  path: "/artifacts",
});

export default function ArtifactsPage() {
  const artifacts = getArtifacts();
  const introduction = getArtifactsIntroduction();
  const corpus = artifacts.find((artifact) => artifact.slug === "spektre-corpus");
  const protocol = artifacts.find((artifact) => artifact.slug === "spektre-protocol");

  return (
    <div>
      <StructuredData data={getArtifactsPageStructuredData(artifacts)} />
      <PageHeader title="Artifacts" />

      <ProseBlock size="lead" className="mt-12 max-w-[39rem] sm:mt-14">
        {introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ProseBlock>

      {corpus ? (
        <section className="mt-24 border-t border-neutral-200/80 pt-20 dark:border-neutral-800/80 sm:mt-32 sm:pt-24">
          <ArtifactFeature artifact={corpus} />
        </section>
      ) : null}

      {protocol ? (
        <section className="mt-24 border-t border-neutral-200/80 pt-16 dark:border-neutral-800/80 sm:mt-28 sm:pt-20">
          <ArtifactFeature artifact={protocol} />
        </section>
      ) : null}
    </div>
  );
}


