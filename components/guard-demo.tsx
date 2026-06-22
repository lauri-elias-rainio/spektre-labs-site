"use client";

import { useMemo, useState } from "react";

import { guard, DEMO_EXAMPLES, type Severity } from "@/lib/guard-demo";

const SEV_COLOR: Record<Severity, string> = {
  clean: "var(--metal-2)",
  low: "var(--fg-mute)",
  medium: "var(--signal)",
  high: "var(--signal)",
};

export function GuardDemo() {
  const [text, setText] = useState(DEMO_EXAMPLES[0].text);
  const verdict = useMemo(() => guard(text), [text]);
  const safe = verdict.safe_to_ship;

  return (
    <div className="surface rounded-[var(--radius)] p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="label text-[var(--fg-mute)]">Live · runs in your browser</p>
        <p className="label text-[var(--fg-faint)]">no model · no network · deterministic</p>
      </div>

      {/* example chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {DEMO_EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => setText(ex.text)}
            className="label rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.6rem] text-[var(--fg-mute)] transition-colors duration-300 hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* input */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        rows={3}
        aria-label="Text to gate"
        className="w-full resize-none rounded-[10px] border border-[var(--line)] bg-[var(--bg-1)] p-4 font-mono text-[0.85rem] leading-relaxed text-[var(--fg-dim)] outline-none transition-colors duration-300 focus:border-[var(--line-strong)]"
      />

      {/* verdict */}
      <div className="mt-5 flex items-center gap-4 border-t border-[var(--line-soft)] pt-5">
        <span
          className="grid h-9 w-9 place-items-center rounded-full border"
          style={{ borderColor: safe ? "var(--metal-3)" : "var(--signal)" }}
          aria-hidden
        >
          <span
            className="text-[1.1rem] leading-none"
            style={{ color: safe ? "var(--metal-1)" : "var(--signal)" }}
          >
            {safe ? "✓" : "⊘"}
          </span>
        </span>
        <div>
          <p
            className="text-[1.05rem] font-semibold tracking-tight"
            style={{ color: safe ? "var(--fg)" : "var(--signal)" }}
          >
            {safe ? "SAFE TO SHIP" : "BLOCKED"}
          </p>
          <p className="label mt-0.5 text-[var(--fg-faint)]">
            severity: {verdict.severity}
          </p>
        </div>
      </div>

      {/* flags */}
      {verdict.flags.length > 0 ? (
        <ul className="mt-4 space-y-1.5">
          {verdict.flags.map((f, i) => (
            <li key={`${f.rule}-${i}`} className="flex items-baseline gap-3 font-mono text-[0.72rem]">
              <span className="label w-[4.5rem] shrink-0 text-[var(--fg-faint)]">{f.dim}</span>
              <span className="text-[var(--fg-dim)]">{f.rule}</span>
              <span className="ml-auto" style={{ color: SEV_COLOR[f.sev] }}>
                [{f.sev}]
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-mono text-[0.72rem] text-[var(--fg-faint)]">
          no secret · no injection · no PII detected
        </p>
      )}

      <p className="mt-6 text-[0.74rem] leading-relaxed text-[var(--fg-faint)]">
        A representative subset of the open-core detectors, ported to the browser. The full Python
        package covers 20+ secret providers and runs identically offline. Same input → same verdict.
      </p>
    </div>
  );
}
