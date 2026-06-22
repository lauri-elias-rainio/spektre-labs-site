/*
  ResearchGrid — deep editorial navigator of Spektre coherence layers.
  Abloh-grade: mono indices, quotation marks, hairline grids, big type, metal hover.
  Prada restraint: generous negative space, no decoration without reason.
  Server component — no hooks. Reveal wraps are handled via .rise CSS animation.
*/

import { cn } from "@/lib/utils";
import { Glyph } from "@/components/glyph";

export type ResearchDirection = {
  layer: string;
  description?: string;
  note?: string;
  items: Array<{
    title: string;
    description?: string;
  }>;
};

export function ResearchGrid({
  items,
  className,
}: {
  items: ResearchDirection[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-0", className)}>
      {items.map((item, index) => (
        <section
          key={item.layer}
          className="rise group"
          style={{ animationDelay: `${index * 0.055}s` }}
        >
          {/* Full-width hairline rule — editorial section divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />

          <div className="py-14 sm:py-16 lg:py-20">
            {/* ── Layer header — large editorial layout ── */}
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              {/* LEFT COLUMN: index anchor */}
              <div className="lg:col-span-1 flex lg:flex-col items-center lg:items-start gap-4 lg:gap-3">
                {/* Large mono index — Fear of God negative space anchor */}
                <span
                  className="font-mono text-[2.4rem] sm:text-[3rem] lg:text-[3.6rem] font-light leading-none tracking-[-0.04em] text-[var(--fg-faint)] tabular-nums select-none"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Vertical hairline on desktop */}
                <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-[var(--line-strong)] to-transparent mt-2" />
              </div>

              {/* CENTRE COLUMN: layer name + description */}
              <div className="lg:col-span-7 min-w-0">
                {/* Virgil quotation device */}
                <p className="label text-[var(--fg-faint)] mb-4 tracking-[0.3em]">
                  LAYER&nbsp;&nbsp;{String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="metal-text text-[1.6rem] font-semibold tracking-[-0.035em] leading-[1.1] sm:text-[2rem] lg:text-[2.4rem] transition-all duration-700 group-hover:opacity-90">
                  {item.layer}
                </h3>

                {item.description ? (
                  <p className="mt-6 max-w-[44rem] text-[0.97rem] leading-[1.88] text-[var(--fg-dim)]">
                    {item.description}
                  </p>
                ) : null}

                {item.note ? (
                  <p className="mt-4 max-w-[44rem] text-[0.88rem] leading-relaxed text-[var(--fg-mute)] whitespace-pre-line font-mono tracking-[0.02em]">
                    {item.note}
                  </p>
                ) : null}
              </div>

              {/* RIGHT COLUMN: node glyph + item count stat */}
              <div className="hidden lg:flex lg:col-span-4 justify-end items-start gap-4 pt-1">
                <div className="flex flex-col items-end gap-2">
                  {/* Item count in Abloh-label style */}
                  <div className="label text-[var(--fg-faint)] text-right">
                    {item.items.length} TOPICS
                  </div>
                  {/* Hairline corner bracket — top-right */}
                  <div className="w-8 h-8 border-t border-r border-[var(--line-strong)] opacity-30 transition-opacity duration-500 group-hover:opacity-70" />
                </div>
                {/* Node glyph — small radial mark */}
                <Glyph variant="node" size={40} strokeOpacity={0.25} />
              </div>
            </div>

            {/* ── Sub-items grid — two columns of research topics ── */}
            <div className="mt-12 lg:mt-14 pl-0 lg:pl-[calc((1/12*100%)_+_2.5rem)]">
              {/* Hairline top of grid */}
              <div className="h-px bg-[var(--line-soft)] mb-0" />

              <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {item.items.map((entry, entryIndex) => (
                  <div
                    key={entry.title}
                    className="group/item border-b border-[var(--line-soft)] py-5 pr-8 transition-all duration-500 hover:border-[var(--line)] last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 xl:[&:nth-last-child(-n+3)]:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      {/* Small ordinal — Abloh micro-index */}
                      <span
                        className="label text-[0.56rem] text-[var(--fg-faint)] tabular-nums pt-[0.22em] shrink-0 min-w-[1.6rem]"
                        aria-hidden="true"
                      >
                        {String(entryIndex + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-[0.9rem] font-medium tracking-[-0.015em] leading-[1.3] text-[var(--fg)] transition-colors duration-500 group-hover/item:text-[var(--metal-1)]">
                          {entry.title}
                        </h4>
                        {entry.description ? (
                          <p className="mt-2 text-[0.83rem] leading-[1.78] text-[var(--fg-mute)] transition-colors duration-500 group-hover/item:text-[var(--fg-dim)]">
                            {entry.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Terminal rule */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent" />

      {/* Closing glyph divider — symmetry punctuation */}
      <div className="flex justify-center py-10">
        <Glyph variant="divider" size={160} strokeOpacity={0.25} />
      </div>
    </div>
  );
}
