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
      <PageHeader title="About" description={lab.about.description} />

      <ProseBlock size="lead" className="mt-12 max-w-[42rem] sm:mt-14">
        {lab.about.overview.slice(0, 2).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ProseBlock>

      <Section title={lab.about.researchOutput.title}>
        <ProseBlock className="max-w-[42rem]">
          {lab.about.researchOutput.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ProseBlock>
      </Section>

      <Section title={lab.about.authorSection.title}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 lg:col-span-6">
            <MetadataList
              items={[
                { label: "Name", value: lab.about.authorSection.name },
                { label: "Role", value: lab.about.authorSection.role },
                { label: "Profile", value: lab.about.authorSection.bio },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section title="Links">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 lg:col-span-6">
            <MetadataList
              items={[
                { label: "ORCID", value: <ExternalLink href={LINKS.orcid}>{LINKS.orcid}</ExternalLink> },
                { label: "GitHub", value: <ExternalLink href={corpus?.github ?? LINKS.github}>{corpus?.github ?? LINKS.github}</ExternalLink> },
                { label: "LinkedIn", value: <ExternalLink href={LINKS.linkedin}>{LINKS.linkedin}</ExternalLink> },
              ]}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}


