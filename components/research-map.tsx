import type { ResearchLayer } from "@/lib/research";

export function ResearchMap({ layers }: { layers: ResearchLayer[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 2xl:grid-cols-3">
      {layers.map((layer, index) => (
        <div key={layer.layer}>
          <div className="h-full border-t border-neutral-200/80 pt-5 dark:border-neutral-800/80 sm:pt-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="max-w-[16rem] text-base font-semibold tracking-tight">{layer.layer}</h3>
              <span className="text-[0.7rem] tabular-nums text-neutral-400 dark:text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {layer.description ? (
              <p className="mt-3 max-w-[28rem] text-sm leading-[1.8] text-neutral-600 dark:text-neutral-400">
                {layer.description}
              </p>
            ) : null}

            {layer.note ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {layer.note}
              </p>
            ) : null}

            <ul className="mt-5 space-y-2.5">
              {layer.items.slice(0, 4).map((item) => (
                <li
                  key={item.title}
                  className="border-b border-neutral-200/80 pb-2.5 text-sm text-neutral-700 dark:border-neutral-800/80 dark:text-neutral-300"
                >
                  {item.title}
                </li>
              ))}
            </ul>

            {layer.items.length > 4 ? (
              <p className="mt-4 text-[0.7rem] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-400">
                + {layer.items.length - 4} more
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

