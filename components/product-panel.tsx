"use client";

import { useState, useCallback } from "react";

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

/* ─────────────────────────────────────────────────────────────────────────────
   EndpointProbe — live endpoint status row with probe-on-demand affordance.

   σ-honest:
   · No numbers are pre-fabricated. Latency and status appear ONLY after the
     user clicks PROBE and a real fetch completes.
   · CORS / network failures are reported honestly; the direct ↗ link is always
     available regardless of probe result.
   · Timeout is 7 seconds. Status codes come from the actual HTTP response.
────────────────────────────────────────────────────────────────────────────── */

type ProbeState =
  | { s: "idle" }
  | { s: "probing" }
  | { s: "ok"; ms: number; code: number }
  | { s: "failed"; reason: "timeout" | "network" };

function ProbeStatus({ state }: { state: ProbeState }) {
  if (state.s === "idle") {
    return <span className="label text-[var(--fg-faint)]">—</span>;
  }
  if (state.s === "probing") {
    return <span className="label text-[var(--fg-mute)]">CHECKING…</span>;
  }
  if (state.s === "ok") {
    return (
      <span className="label tabular-nums" style={{ color: "var(--signal)" }}>
        HTTP {state.code} · {state.ms.toFixed(0)} ms
      </span>
    );
  }
  if (state.reason === "timeout") {
    return <span className="label text-[var(--fg-faint)]">TIMEOUT</span>;
  }
  /* network / CORS — honest: we cannot distinguish in the browser */
  return (
    <span className="label text-[var(--fg-mute)]">CORS / UNREACHABLE</span>
  );
}

export function EndpointProbe({
  index,
  name,
  sub,
  url,
  description,
}: {
  index: string;
  name: string;
  sub?: string;
  url: string;
  description: string;
}) {
  const [state, setState] = useState<ProbeState>({ s: "idle" });

  const probe = useCallback(async () => {
    setState({ s: "probing" });
    const t0 = performance.now();
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      setState({
        s: "ok",
        ms: performance.now() - t0,
        code: res.status,
      });
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setState({ s: "failed", reason: "timeout" });
      } else {
        setState({ s: "failed", reason: "network" });
      }
    }
  }, [url]);

  return (
    <div className="group relative border-t border-[var(--line)] py-10 transition-colors duration-500 hover:border-[var(--line-strong)] sm:py-12">
      {/* Hover accent hairline */}
      <span
        className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[var(--metal-3)] transition-[width] duration-700 group-hover:w-full"
        aria-hidden
      />

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
        {/* Index + name + URL */}
        <div className="flex items-baseline gap-5 lg:col-span-4">
          <span className="label tabular-nums text-[var(--fg-faint)] shrink-0">{index}</span>
          <div className="min-w-0">
            <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] leading-none text-[var(--fg)] sm:text-[1.6rem]">
              {name}
            </h3>
            {sub ? (
              <p className="mt-1.5 label text-[var(--fg-faint)]">{sub}</p>
            ) : null}
            <p className="mt-2 font-mono text-[0.63rem] tracking-tight leading-relaxed text-[var(--fg-faint)] break-all">
              {url}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-5 lg:col-start-5">
          <p className="text-[0.97rem] leading-[1.84] text-[var(--fg-dim)]">
            {description}
          </p>
        </div>

        {/* Probe status + controls */}
        <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:col-start-10 lg:flex-col lg:items-end lg:justify-center">
          <ProbeStatus state={state} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={probe}
              disabled={state.s === "probing"}
              aria-label={`Probe ${name} endpoint`}
              className="label rounded-[6px] border border-[var(--line)] px-3 py-1.5 text-[var(--fg-mute)] transition-colors duration-300 hover:border-[var(--line-strong)] hover:text-[var(--fg)] disabled:opacity-40 disabled:pointer-events-none"
            >
              {state.s === "probing" ? "…" : "PROBE"}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name} endpoint directly`}
              className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]"
            >
              ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
