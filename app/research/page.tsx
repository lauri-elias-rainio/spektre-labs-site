import type { Metadata } from "next";
import type React from "react";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { ResearchMap } from "@/components/research-map";
import { Section } from "@/components/section";
import { ResearchGrid } from "@/components/research-grid";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { getResearchIntroduction, getResearchLayers, getResearchItemCount } from "@/lib/research";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Research",
  description:
    "Spektre Labs investigates structural invariants across complex systems — coherence, collapse, and the K_crit constant.",
  path: "/research",
});

export default function ResearchPage() {
  const research = getResearchLayers();
  const introduction = getResearchIntroduction();
  const itemCount = getResearchItemCount(research);

  return (
    <div>
      {/* Page header */}
      <PageHeader
        title="Research"
        description="Structural invariants across complex systems. Coherence, collapse, and K_crit ≈ 0.127."
      />

      {/* ── Axiom rail — σ-honest stats, Abloh metadata band ── */}
      <Reveal delay={80}>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-3 border-b border-[var(--line-soft)] pb-10">
          {[
            { label: "DOMAINS", value: String(research.length).padStart(2, "0") },
            { label: "TOPICS", value: String(itemCount).padStart(2, "0") },
            { label: "AXIOM", value: "1 = 1" },
            { label: "K_CRIT", value: "≈ 0.127" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-3">
              <span className="label text-[var(--fg-faint)]">{label}</span>
              <span className="font-mono text-[1.1rem] font-light tracking-[-0.02em] text-[var(--metal-2)] tabular-nums">
                {value}
              </span>
            </div>
          ))}

          {/* Divider glyph — inline hairline ornament */}
          <div className="ml-auto hidden sm:block">
            <Glyph variant="node" size={24} strokeOpacity={0.3} />
          </div>
        </div>
      </Reveal>

      {/* ── Lead introduction — editorial body copy ── */}
      <Reveal delay={140}>
        <div className="mt-14 sm:mt-16 grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:col-start-4">
            <ProseBlock size="lead" className="text-[var(--fg-dim)]">
              {introduction.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </ProseBlock>

            {/* Third paragraph — editorial footnote */}
            {introduction[2] ? (
              <p className="mt-6 text-[0.9rem] leading-[1.84] text-[var(--fg-mute)] max-w-[42rem]">
                {introduction[2]}
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>

      {/* ── Research Map — symmetric node diagram + tiled cards ── */}
      <Section title="Coherence Map" eyebrow="Structure">
        <ResearchMap layers={research} />
      </Section>

      {/* ── Glyph divider ── */}
      <Reveal delay={0}>
        <div className="flex justify-center py-16 sm:py-20">
          <Glyph variant="seal" size={72} strokeOpacity={0.18} />
        </div>
      </Reveal>

      {/* ── Research Layers — deep editorial navigator ── */}
      <Section title="Research Layers" eyebrow="Detail">
        <ResearchGrid items={research} />
      </Section>
    </div>
  );
}
