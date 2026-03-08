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
    <div className={cn("grid gap-9 lg:gap-12", className)}>
      {items.map((item, index) => (
        <section
          key={item.layer}
          className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 sm:pt-8"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="max-w-[32rem] text-lg font-semibold tracking-tight">{item.layer}</h3>
            <span className="text-[0.7rem] tabular-nums text-neutral-400 dark:text-neutral-500">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {item.description ? (
            <p className="mt-3 max-w-[40rem] text-sm leading-[1.82] text-neutral-600 dark:text-neutral-400">
              {item.description}
            </p>
          ) : null}
          {item.note ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {item.note}
            </p>
          ) : null}
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {item.items.map((entry) => (
              <div
                key={entry.title}
                className="border-t border-neutral-200/80 pt-4 dark:border-neutral-800/80"
              >
                <h4 className="text-sm font-semibold tracking-tight">{entry.title}</h4>
                {entry.description ? (
                  <p className="mt-2 text-sm leading-[1.78] text-neutral-600 dark:text-neutral-400">
                    {entry.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

