import { cn } from "@/lib/utils";

type Step = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

/* Roman numeral helper — keeps the editorial clock feeling */
const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function MethodDiagram({
  steps,
  className,
}: {
  steps: Step[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Symmetric center axis — visible only on lg+ */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden -translate-x-px border-l border-[var(--line-soft)] lg:block"
      />

      <ol className="grid gap-0 lg:grid-cols-2">
        {steps.map((s, i) => {
          /* Mirror left/right on large screens for perfect bilateral symmetry */
          const isRight = i % 2 === 1;

          return (
            <li
              key={s.title}
              className={cn(
                "rise group relative",
                /* right cells get left-padding on large screens */
                isRight ? "lg:pl-12 lg:pr-0" : "lg:pr-12"
              )}
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {/* Top hairline per cell */}
              <div
                className={cn(
                  "border-t border-[var(--line-strong)] pb-12 pt-8",
                  /* right cells on lg: shift hairline to flush right of center gap */
                  isRight && "lg:border-t-0 lg:border-l lg:border-[var(--line)]"
                )}
              >
                {/* Step meta row */}
                <div className="mb-6 flex items-center justify-between gap-4">
                  {/* Abloh-style mono label */}
                  <span className="label text-[var(--fg-faint)]">STAGE</span>

                  {/* Large editorial roman numeral */}
                  <span
                    className="font-mono text-[2rem] font-light leading-none tracking-[-0.03em] tabular-nums"
                    style={{ color: "var(--line-strong)" }}
                  >
                    {ROMAN[i] ?? String(i + 1)}
                  </span>
                </div>

                {/* Step title */}
                <h3
                  className="text-[1.08rem] font-semibold leading-snug tracking-[-0.025em]"
                  style={{ color: "var(--fg)" }}
                >
                  {s.title}
                </h3>

                {/* Hairline accent below title */}
                <div
                  aria-hidden="true"
                  className="mt-4 mb-5 h-px w-5"
                  style={{ background: "var(--line-strong)" }}
                />

                {s.paragraphs?.length ? (
                  <div className="space-y-4">
                    {s.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-[0.925rem] leading-[1.87]"
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
                        {/* Hairline tick — Abloh detail */}
                        <span
                          className="mt-px shrink-0 font-mono text-[0.6rem]"
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
          );
        })}
      </ol>

      {/* Bottom symmetry line — seals the grid */}
      <div
        aria-hidden="true"
        className="mt-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--line-strong) 18%, var(--line-strong) 82%, transparent)",
        }}
      />
    </div>
  );
}
