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

      {/* intro lead — generous negative space, platinum-warm */}
      <ProseBlock size="lead" className="mt-14 max-w-[39rem] sm:mt-16">
        {introduction.map((paragraph) => (
          <p key={paragraph} className="text-[var(--fg-dim)] leading-[1.82]">
            {paragraph}
          </p>
        ))}
      </ProseBlock>

      {/* Spektre Corpus — primary featured section */}
      {corpus ? (
        <section
          className="mt-28 border-t pt-24 sm:mt-36 sm:pt-28"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <ArtifactFeature artifact={corpus} />
        </section>
      ) : null}

      {/* Spektre Protocol — secondary featured section */}
      {protocol ? (
        <section
          className="mt-24 border-t pt-20 sm:mt-32 sm:pt-24"
          style={{ borderColor: "var(--line)" }}
        >
          <ArtifactFeature artifact={protocol} />
        </section>
      ) : null}
    </div>
  );
}
