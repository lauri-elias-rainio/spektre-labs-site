import type { Metadata } from "next";

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
      <PageHeader title="Research" description="Research is organized into interconnected layers." />

      <ProseBlock size="lead" className="mt-12 max-w-[42rem] sm:mt-14">
        {introduction.slice(0, 2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ProseBlock>

      <Section title="Research Map">
        <ResearchMap layers={research} />
      </Section>

      <Section title="Research Layers">
        <ResearchGrid items={research} />
      </Section>
    </div>
  );
}


