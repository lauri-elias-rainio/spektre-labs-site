import { cn } from "@/lib/utils";

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
          className="rise group border-t border-[var(--line)] py-10 sm:py-12 lg:py-14"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          {/* Layer header row */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-baseline gap-5 min-w-0">
              {/* Mono index — Abloh-grade metadata anchor */}
              <span className="label shrink-0 text-[var(--fg-faint)] tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="metal-text text-[1.22rem] font-semibold tracking-[-0.025em] leading-[1.15] sm:text-[1.38rem] lg:text-[1.5rem]">
                {item.layer}
              </h3>
            </div>
            {/* Hairline corner tick */}
            <div className="shrink-0 mt-1 w-4 h-4 border-t border-r border-[var(--line-strong)] opacity-40" />
          </div>

          {/* Description */}
          {item.description ? (
            <p className="mt-5 max-w-[42rem] text-[0.97rem] leading-[1.82] text-[var(--fg-dim)] pl-10 sm:pl-11">
              {item.description}
            </p>
          ) : null}

          {/* Note */}
          {item.note ? (
            <p className="mt-4 whitespace-pre-line max-w-[42rem] text-[0.92rem] leading-relaxed text-[var(--fg-mute)] pl-10 sm:pl-11">
              {item.note}
            </p>
          ) : null}

          {/* Sub-items grid */}
          <div className="mt-8 pl-10 sm:pl-11 grid gap-0 md:grid-cols-2">
            {item.items.map((entry, entryIndex) => (
              <div
                key={entry.title}
                className="group/item border-t border-[var(--line-soft)] pt-5 pb-5 pr-6 transition-colors duration-500 hover:border-[var(--line)]"
              >
                <div className="flex items-start gap-3">
                  {/* Small ordinal tick */}
                  <span
                    className="label text-[0.58rem] text-[var(--fg-faint)] tabular-nums pt-[0.15em] shrink-0"
                    aria-hidden="true"
                  >
                    {String(entryIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-[0.9rem] font-medium tracking-[-0.01em] text-[var(--fg)] transition-colors duration-500 group-hover/item:text-[var(--metal-1)]">
                      {entry.title}
                    </h4>
                    {entry.description ? (
                      <p className="mt-1.5 text-[0.85rem] leading-[1.78] text-[var(--fg-mute)]">
                        {entry.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
