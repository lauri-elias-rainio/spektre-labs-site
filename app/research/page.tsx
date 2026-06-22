import type { Metadata } from "next";
import type React from "react";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { ResearchMap } from "@/components/research-map";
import { Section } from "@/components/section";
import { ResearchGrid } from "@/components/research-grid";
import { getResearchIntroduction, getResearchLayers } from "@/lib/research";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Research",
  description:
    "Research organized as interconnected layers across which coherence, stability, and collapse can be studied.",
  path: "/research",
});

export default function ResearchPage() {
  const research = getResearchLayers();
  const introduction = getResearchIntroduction();
  return (
    <div>
      {/* Page header — inherits updated luxury styles from component */}
      <PageHeader
        title="Research"
        description="Research is organized into interconnected layers."
      />

      {/* Lead introduction — editorial body copy */}
      <div className="rise mt-14 sm:mt-16" style={{ animationDelay: "0.1s" }}>
        <ProseBlock size="lead" className="max-w-[42rem] text-[var(--fg-dim)]">
          {introduction.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ProseBlock>
      </div>

      {/* Research Map — structural diagram overview */}
      <Section title="Research Map" eyebrow="Structure">
        <ResearchMap layers={research} />
      </Section>

      {/* Research Layers — deep editorial grid */}
      <Section title="Research Layers" eyebrow="Detail">
        <ResearchGrid items={research} />
      </Section>
    </div>
  );
}
