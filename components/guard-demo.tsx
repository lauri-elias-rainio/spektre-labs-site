"use client";

import { useCallback, useEffect, useState } from "react";

import { guard, DEMO_EXAMPLES, type Severity, type Verdict } from "@/lib/guard-demo";

/* ── dimension chip style map ── */
const SEV_STYLE: Record<Severity, { color: string; label: string }> = {
  clean:  { color: "var(--fg-faint)", label: "CLEAR" },
  low:    { color: "var(--fg-mute)",  label: "LOW"   },
  medium: { color: "var(--signal)",   label: "MED"   },
  high:   { color: "var(--signal)",   label: "HIGH"  },
};

type GateState = { verdict: Verdict; ms: number | null };

/* Runs the gate and captures wall-clock time in one call. */
function runGate(text: string): GateState {
  const t0 = performance.now();
  const verdict = guard(text);
  return { verdict, ms: performance.now() - t0 };
}

export function GuardDemo() {
  const [text, setText] = useState(DEMO_EXAMPLES[0].text);

  /*
    The verdict is deterministic — identical on server and client, so it can
    live in the initializer. The TIMING is not (performance.now differs per
    environment → hydration mismatch), so ms starts null and is measured
    after mount. Subsequent updates happen inside event handlers.
  */
  const [{ verdict, ms }, setGate] = useState<GateState>(() => ({
    verdict: guard(DEMO_EXAMPLES[0].text),
    ms: null,
  }));

  useEffect(() => {
    // deferred one frame — timing is measurement, not render logic
    const id = requestAnimationFrame(() => setGate(runGate(DEMO_EXAMPLES[0].text)));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleInput = useCallback((next: string) => {
    setText(next);
    setGate(runGate(next));
  }, []);

  const safe = verdict.safe_to_ship;

  return (
    <div className="surface rounded-[var(--radius)] overflow-hidden">

      {/* ── Instrument header bar ── */}
      <div
        className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)] px-5 py-3.5"
        role="banner"
        aria-label="Gate instrument panel"
      >
        <div className="flex items-center gap-3">
          {/* live signal dot */}
          <span
            className="h-1.5 w-1.5 rounded-full shrink-0"
            style={{
              background: "var(--signal)",
              boxShadow: "0 0 6px var(--signal-glow)",
            }}
            aria-hidden
          />
          <span className="label text-[var(--fg-mute)]">GUARD · σ-GATE · LIVE IN BROWSER</span>
        </div>
        {/* response-time readout */}
        <span
          className="label tabular-nums text-[var(--fg-faint)]"
          aria-label="Gate response time"
        >
          {ms === null ? "—" : ms.toFixed(2)} ms
        </span>
      </div>

      <div className="p-6 sm:p-8">

        {/* ── Example selector chips ── */}
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Load an example">
          {DEMO_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => handleInput(ex.text)}
              className="label rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.6rem] text-[var(--fg-mute)] transition-colors duration-300 hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* ── Signal input zone ── */}
        <div className="mb-6">
          <p className="label mb-2 text-[var(--fg-faint)]">SIGNAL INPUT</p>
          <textarea
            value={text}
            onChange={(e) => handleInput(e.target.value)}
            spellCheck={false}
            rows={3}
            aria-label="Text to gate"
            className="w-full resize-none rounded-[10px] border border-[var(--line)] bg-[var(--bg-1)] p-4 font-mono text-[0.85rem] leading-relaxed text-[var(--fg-dim)] outline-none transition-colors duration-300 focus:border-[var(--line-strong)]"
          />
        </div>

        {/* ── Verdict panel ── */}
        <div
          className="mb-5 rounded-[10px] border p-5"
          role="status"
          aria-live="polite"
          aria-label="Gate verdict"
          style={{
            borderColor: safe ? "var(--line)" : "rgba(207,227,255,0.22)",
            background:  safe ? "transparent" : "rgba(207,227,255,0.025)",
          }}
        >
          {/* Pass / Block row */}
          <div className="flex items-center gap-4">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border text-[1rem] leading-none"
              style={{
                borderColor: safe ? "var(--metal-3)" : "var(--signal)",
                color:       safe ? "var(--metal-1)" : "var(--signal)",
              }}
              aria-hidden
            >
              {safe ? "✓" : "⊘"}
            </span>

            <div className="flex-1 min-w-0">
              <p
                className="text-[1.1rem] font-semibold tracking-[-0.02em] leading-none"
                style={{ color: safe ? "var(--fg)" : "var(--signal)" }}
              >
                {safe ? "SAFE TO SHIP" : "BLOCKED"}
              </p>
              <p className="label mt-1.5 text-[var(--fg-faint)]">
                severity · {verdict.severity}
                &emsp;·&emsp;
                {ms === null ? "—" : ms.toFixed(2)} ms
              </p>
            </div>
          </div>

          {/* Dimension chip rail */}
          <div
            className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--line-soft)] pt-4"
            aria-label="Detector dimensions"
          >
            {(["secret", "injection", "pii"] as const).map((dim) => {
              const sev = verdict.dims[dim];
              const st  = SEV_STYLE[sev];
              return (
                <span
                  key={dim}
                  className="label rounded-[4px] border px-2.5 py-1.5 text-[0.58rem]"
                  style={{
                    color:       st.color,
                    borderColor: sev === "clean"
                      ? "var(--line)"
                      : "rgba(207,227,255,0.28)",
                    background: sev !== "clean"
                      ? "rgba(207,227,255,0.04)"
                      : "transparent",
                  }}
                >
                  {dim.toUpperCase()} · {st.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* ── Detection list ── */}
        {verdict.flags.length > 0 ? (
          <div className="mb-5 rounded-[10px] border border-[var(--line)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--bg-2)] px-4 py-2.5">
              <span className="label text-[var(--fg-faint)]">DETECTIONS</span>
              <span
                className="label tabular-nums"
                style={{ color: "var(--signal)" }}
              >
                {verdict.flags.length}
              </span>
            </div>
            <ul className="divide-y divide-[var(--line-soft)]">
              {verdict.flags.map((f, i) => (
                <li
                  key={`${f.rule}-${i}`}
                  className="grid items-baseline gap-3 px-4 py-3 font-mono text-[0.72rem]"
                  style={{ gridTemplateColumns: "4rem 1fr 3.5rem" }}
                >
                  <span className="label text-[var(--fg-faint)] truncate">{f.dim}</span>
                  <span className="text-[var(--fg-dim)] truncate">{f.rule}</span>
                  <span
                    className="label text-right"
                    style={{ color: SEV_STYLE[f.sev].color }}
                  >
                    [{f.sev}]
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mb-5 font-mono text-[0.72rem] text-[var(--fg-faint)]">
            no secret · no injection · no PII detected
          </p>
        )}

        {/* ── σ-honest caveat ── */}
        <p className="text-[0.74rem] leading-relaxed text-[var(--fg-faint)]">
          A representative subset of the open-core detectors, running in your browser.
          The full Python package covers 20+ providers and runs identically offline.
          Same input → same verdict.
        </p>
      </div>
    </div>
  );
}
