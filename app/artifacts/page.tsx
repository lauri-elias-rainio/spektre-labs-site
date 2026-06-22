import type { Metadata } from "next";

import { ArtifactCard } from "@/components/artifact-card";
import { ArtifactFeature } from "@/components/artifact-feature";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Reveal } from "@/components/reveal";
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
  const corpus = artifacts.find((a) => a.slug === "spektre-corpus");
  const protocol = artifacts.find((a) => a.slug === "spektre-protocol");
  const sigmaGate = artifacts.find((a) => a.slug === "sigma-gate");

  // Items not individually featured above — feed the archive
  const featuredSlugs = new Set(["spektre-corpus", "spektre-protocol"]);
  const archiveItems = artifacts.filter((a) => !featuredSlugs.has(a.slug));

  return (
    <div>
      <StructuredData data={getArtifactsPageStructuredData(artifacts)} />

      <PageHeader title="Artifacts" />

      {/* intro — generous negative space */}
      <ProseBlock size="lead" className="mt-14 max-w-[39rem] sm:mt-16">
        {introduction.map((paragraph, i) => (
          <Reveal key={paragraph} delay={i * 60}>
            <p className="text-[var(--fg-dim)] leading-[1.84]">{paragraph}</p>
          </Reveal>
        ))}
      </ProseBlock>

      {/* theory → axiom divider */}
      <Reveal delay={120}>
        <div className="mt-16 flex items-center gap-6 sm:mt-20">
          <Glyph variant="divider" size={200} strokeOpacity={0.3} />
          <span
            className="label shrink-0"
            style={{ color: "var(--fg-faint)" }}
          >
            Axiom · σ = 1
          </span>
          <Glyph variant="divider" size={200} strokeOpacity={0.3} />
        </div>
      </Reveal>

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

      {/* σ-gate — card treatment linking to full product page */}
      {sigmaGate ? (
        <section
          className="mt-20 border-t pt-16 sm:mt-28 sm:pt-20"
          style={{ borderColor: "var(--line)" }}
        >
          <Reveal delay={0}>
            <p className="label mb-8 text-[var(--fg-faint)]">
              Operational layer
            </p>
          </Reveal>
          <ArtifactCard
            artifact={sigmaGate}
            featured
            description={sigmaGate.summary}
            index={0}
          />
        </section>
      ) : null}

      {/* additional archive items (future artifacts) */}
      {archiveItems.length > 1 ? (
        <section
          className="mt-20 border-t pt-16 sm:mt-28 sm:pt-20"
          style={{ borderColor: "var(--line)" }}
        >
          <Reveal delay={0}>
            <p className="label mb-8 text-[var(--fg-faint)]">
              All artifacts
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {archiveItems.map((item, i) => (
              <ArtifactCard
                key={item.slug}
                artifact={item}
                index={i}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
