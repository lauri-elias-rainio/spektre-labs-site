import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";
import corpus from "@/data/corpus-papers.json";

export const metadata: Metadata = createPageMetadata({
  title: "Corpus",
  description:
    "The Spektre Corpus — open-access research papers on coherence, collapse, and the σ-instability principle. All falsifiable, all CC BY.",
  path: "/corpus",
  image: "/generated/divisions/research.png",
});

type Paper = {
  section: string;
  index: number;
  title: string;
  file: string;
  github: string;
  doi: string | null;
};

export default function CorpusPage() {
  const papers = corpus.papers as Paper[];

  // group by section, preserving first-seen order
  const order: string[] = [];
  const bySection = new Map<string, Paper[]>();
  for (const p of papers) {
    if (!bySection.has(p.section)) {
      bySection.set(p.section, []);
      order.push(p.section);
    }
    bySection.get(p.section)!.push(p);
  }

  return (
    <div>
      <PageHeader
        title="Corpus"
        description="The formal record. Open-access research papers investigating coherence, feedback failure, and collapse across physics, information, cognition, and institutions."
      />

      {/* σ-honest framing */}
      <section className="mt-14 sm:mt-18 lg:mt-20">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Open Access · CC BY · σ-honest</p>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-[42rem] text-[1rem] leading-[1.85] text-[var(--fg-dim)]">
                {corpus.count} papers, published openly on Zenodo. Every claim is falsifiable and stated
                with its evidence; this is a working research program, not peer-reviewed consensus. The
                corpus rests on one invariant — <span className="text-[var(--fg)]">1 = 1</span>, declared
                equals realized — and one metric, σ, the distance between them.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="mt-16 flex justify-center sm:mt-20">
        <Glyph variant="divider" size={200} strokeOpacity={0.32} />
      </div>

      {/* papers by section */}
      <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-28">
        {order.map((section) => {
          const items = bySection.get(section)!;
          return (
            <section key={section}>
              <Reveal>
                <div className="mb-8 flex items-baseline gap-4 border-b border-[var(--line)] pb-5">
                  <h2 className="metal-text text-[1.5rem] font-semibold tracking-[-0.03em] sm:text-[1.9rem]">
                    {section}
                  </h2>
                  <span className="label text-[var(--fg-faint)]">
                    {String(items.length).padStart(2, "0")} {items.length === 1 ? "paper" : "papers"}
                  </span>
                </div>
              </Reveal>

              <ul>
                {items.map((p, i) => (
                  <Reveal as="li" key={p.github} delay={Math.min(i * 40, 240)}>
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-[var(--line-soft)] py-5 transition-colors duration-500 hover:border-[var(--line-strong)] sm:grid-cols-[3rem_1fr_auto] sm:gap-x-6"
                    >
                      <span className="label tabular-nums text-[var(--fg-faint)]">
                        {String(p.index).padStart(2, "0")}
                      </span>
                      <span className="text-[1.02rem] font-medium leading-[1.4] text-[var(--fg-dim)] transition-colors duration-500 group-hover:text-[var(--fg)] sm:text-[1.08rem]">
                        {p.title}
                      </span>
                      <span className="col-start-2 mt-2 font-mono text-[0.66rem] tracking-[0.04em] text-[var(--fg-faint)] sm:col-start-3 sm:mt-0 sm:text-right">
                        {p.doi ? p.doi.replace(/^10\.5281\//, "") : "open access"}
                        <span className="ml-2 text-[var(--fg-faint)] transition-colors duration-500 group-hover:text-[var(--signal)]">
                          ↗
                        </span>
                      </span>
                    </a>
                  </Reveal>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* footer note */}
      <Reveal>
        <div className="mt-24 border-t border-[var(--line)] pt-10 sm:mt-32">
          <p className="label text-[var(--fg-faint)]">
            All papers · CC BY 4.0 · Zenodo · github.com/spektre-labs/corpus
          </p>
        </div>
      </Reveal>

      <div className="mt-32 lg:mt-44" />
    </div>
  );
}
