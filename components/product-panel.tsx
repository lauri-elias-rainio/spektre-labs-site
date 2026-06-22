import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";

/*
  ProductPanel — reusable on-canon block for a real, shipping product.
  Industrial dark-luxury editorial. Glass surface, hairline grid, mono labels.
  Renders: header (tag + title + body) · optional dimension list · optional code block ·
  optional CTA row. All slots are optional — compose what the product needs.

  σ-law: only rendered when the product is real and shipping. Vision tiers use a
  different treatment (with explicit VISION status labels).
*/

export type ProductDimension = {
  label: string;
  value: string;
  accent?: boolean; // highlight with --signal
};

export type ProductCTA = {
  label: string;
  href: string;
  external?: boolean;
  variant?: "primary" | "ghost"; // primary = .btn-metal chrome, ghost = hairline border
};

export type ProductPanelProps = {
  /** Abloh mono label — e.g. "Dimension 02 · Systems" */
  eyebrow?: string;
  /** Product name — rendered metal-text gradient */
  title: string;
  /** One cold signal word/phrase shown beside the title */
  signal?: string;
  /** Short declarative lines. Terse. No marketing fluff. */
  body: string[];
  /** Small data-fact rail — left-right symmetric pairs */
  dimensions?: ProductDimension[];
  /** Inline code block — shown verbatim in monospace */
  code?: {
    language?: string;
    snippet: string;
    caption?: string;
  };
  /** Call-to-action buttons */
  ctas?: ProductCTA[];
  /** Glyph node decorating the top-left */
  showGlyph?: boolean;
  className?: string;
};

export function ProductPanel({
  eyebrow,
  title,
  signal,
  body,
  dimensions,
  code,
  ctas,
  showGlyph = true,
  className = "",
}: ProductPanelProps) {
  return (
    <div
      className={[
        "surface",
        "rounded-[var(--radius)]",
        "overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="grid lg:grid-cols-[1fr_auto]">
        {/* ── Main content column ── */}
        <div className="p-8 sm:p-12 lg:p-14 xl:p-16">
          {/* Eyebrow + signal */}
          {(eyebrow || signal) ? (
            <Reveal delay={0}>
              <div className="mb-6 flex items-center justify-between gap-6">
                {eyebrow ? (
                  <p className="label text-[var(--fg-faint)]">{eyebrow}</p>
                ) : <span />}
                {signal ? (
                  <span
                    className="label"
                    style={{ color: "var(--signal)" }}
                  >
                    {signal}
                  </span>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          {/* Glyph node */}
          {showGlyph ? (
            <Reveal delay={40}>
              <div className="mb-6">
                <Glyph variant="node" size={24} strokeOpacity={0.55} />
              </div>
            </Reveal>
          ) : null}

          {/* Title */}
          <Reveal delay={80}>
            <h2 className="metal-text text-[2rem] font-semibold tracking-[-0.038em] leading-[1.04] sm:text-[2.6rem] lg:text-[3rem]">
              {title}
            </h2>
          </Reveal>

          {/* Body */}
          <div className="mt-6 space-y-4">
            {body.map((line, i) => (
              <Reveal key={i} delay={120 + i * 60}>
                <p className="max-w-[44ch] text-[1rem] leading-[1.84] text-[var(--fg-dim)] sm:text-[1.05rem]">
                  {line}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Code block */}
          {code ? (
            <Reveal delay={220}>
              <div className="mt-10">
                <div
                  className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-2)] overflow-hidden"
                >
                  {/* Code header bar */}
                  <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
                    <span className="label text-[var(--fg-faint)]">
                      {code.language ?? "python"}
                    </span>
                    <div className="flex items-center gap-1.5" aria-hidden>
                      <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                      <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                      <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                    </div>
                  </div>
                  {/* Code body */}
                  <pre className="overflow-x-auto px-5 py-5 text-[0.82rem] leading-[1.75] text-[var(--fg-dim)] font-mono">
                    <code>{code.snippet}</code>
                  </pre>
                </div>
                {code.caption ? (
                  <p className="mt-3 label text-[var(--fg-faint)]">
                    {code.caption}
                  </p>
                ) : null}
              </div>
            </Reveal>
          ) : null}

          {/* CTAs */}
          {ctas && ctas.length > 0 ? (
            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {ctas.map((cta) =>
                  cta.variant === "ghost" ? (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target={cta.external ? "_blank" : undefined}
                      rel={cta.external ? "noopener noreferrer" : undefined}
                      className="rounded-[10px] border border-[var(--line-strong)] px-6 py-3 text-[0.88rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
                    >
                      {cta.label}
                    </a>
                  ) : (
                    <a
                      key={cta.label}
                      href={cta.href}
                      target={cta.external ? "_blank" : undefined}
                      rel={cta.external ? "noopener noreferrer" : undefined}
                      className="btn-metal rounded-[10px] px-6 py-3 text-[0.88rem] font-semibold tracking-tight"
                    >
                      {cta.label}
                    </a>
                  )
                )}
              </div>
            </Reveal>
          ) : null}
        </div>

        {/* ── Dimension rail — right side ── */}
        {dimensions && dimensions.length > 0 ? (
          <div className="flex flex-col justify-center gap-0 border-t border-[var(--line)] bg-[var(--bg-2)] lg:border-l lg:border-t-0 lg:min-w-[200px] xl:min-w-[220px]">
            {dimensions.map((dim, i) => (
              <Reveal key={dim.label} delay={160 + i * 50}>
                <div
                  className={[
                    "border-b border-[var(--line)] px-8 py-6",
                    i === dimensions.length - 1 ? "border-b-0" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <p className="label text-[var(--fg-faint)] mb-1.5">
                    {dim.label}
                  </p>
                  <p
                    className="text-[0.95rem] font-medium tracking-[-0.01em] leading-snug"
                    style={{
                      color: dim.accent
                        ? "var(--signal)"
                        : "var(--fg)",
                    }}
                  >
                    {dim.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
