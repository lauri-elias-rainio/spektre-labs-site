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
        "grid gap-0 lg:grid-cols-2",
        className
      )}
    >
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="rise group relative"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          {/* top hairline — full bleed per column */}
          <div className="border-t border-[var(--line-strong)] pt-7 pb-10 pr-10" >
            {/* step index + connector */}
            <div className="flex items-start justify-between gap-6 mb-5">
              {/* mono step tag */}
              <span className="label" style={{ color: "var(--fg-faint)" }}>
                STEP
              </span>
              {/* large editorial index */}
              <span
                className="font-mono tabular-nums text-[2.4rem] leading-none font-light tracking-[-0.04em]"
                style={{ color: "var(--line-strong)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* title */}
            <h3
              className="text-[1.05rem] font-semibold tracking-[-0.025em] leading-snug"
              style={{ color: "var(--fg)" }}
            >
              {s.title}
            </h3>

            {s.paragraphs?.length ? (
              <div className="mt-5 space-y-4">
                {s.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[0.9rem] leading-[1.85]"
                    style={{ color: "var(--fg-dim)" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {s.bullets?.length ? (
              <ul className="mt-6 space-y-0">
                {s.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-baseline gap-3 border-b border-[var(--line)] py-2.5 text-[0.875rem] leading-relaxed last:border-b-0"
                    style={{ color: "var(--fg-dim)" }}
                  >
                    {/* hairline tick */}
                    <span
                      className="mt-px shrink-0 text-[0.6rem] font-mono"
                      style={{ color: "var(--fg-faint)" }}
                    >
                      —
                    </span>
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

