import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { MethodDiagram } from "@/components/method-diagram";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Method",
  description: lab.method.description,
  path: "/method",
});

export default function MethodPage() {
  return (
    <div>
      <PageHeader title={lab.method.title} description={lab.method.description} />

      <ProseBlock size="lead" className="mt-12 max-w-[42rem] sm:mt-14">
        {lab.method.introduction.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </ProseBlock>

      <Section title={lab.method.process.title}>
        <div className="max-w-5xl">
          <p
            className="max-w-[42rem] text-[0.9rem] leading-[1.85]"
            style={{ color: "var(--fg-mute)" }}
          >
            {lab.method.process.introduction}
          </p>
          {/* hairline separator before diagram */}
          <div className="rule mt-10 mb-0" />
          <div className="mt-0">
            <MethodDiagram steps={lab.method.process.steps} />
          </div>
        </div>
      </Section>

      <Section title={lab.method.crossDomainValidation.title}>
        <ProseBlock className="max-w-[42rem]">
          {lab.method.crossDomainValidation.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ProseBlock>
      </Section>

      <Section title={lab.method.roleOfComputationalSystems.title}>
        <ProseBlock className="max-w-[42rem]">
          {lab.method.roleOfComputationalSystems.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ProseBlock>
      </Section>

      <Section title={lab.method.researchPhilosophy.title}>
        <ProseBlock className="max-w-[42rem]">
          {lab.method.researchPhilosophy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ProseBlock>
      </Section>
    </div>
  );
}


