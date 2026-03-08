import { cn } from "@/lib/utils";

type Step = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function MethodDiagram({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "grid gap-6 border-l border-neutral-200 pl-5 dark:border-neutral-800 sm:gap-9 sm:border-l-0 sm:pl-0 lg:grid-cols-2",
        className
      )}
    >
      {steps.map((s, i) => (
        <li key={s.title}>
          <div className="border-t border-neutral-200/80 pt-5 dark:border-neutral-800/80 sm:pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-base font-semibold tracking-tight">{s.title}</h3>
              <span className="text-[0.7rem] tabular-nums text-neutral-500 dark:text-neutral-400">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            {s.paragraphs?.length ? (
              <div className="mt-4 space-y-4">
                {s.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-[1.82] text-neutral-600 dark:text-neutral-400"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {s.bullets?.length ? (
              <ul className="mt-5 space-y-2">
                {s.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="border-b border-neutral-200/80 pb-2 text-sm leading-relaxed text-neutral-700 dark:border-neutral-800/80 dark:text-neutral-300"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

