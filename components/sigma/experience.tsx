"use client";

/*
  Σ-COLLAPSE experience shell — the brand law rendered as live physics.

  A raw-WebGPU compute engine (components/sigma/engine.ts, zero deps) drives
  a mirrored particle field under two forces: entropy (a drifting noise
  field) and the law (attraction along the SDF gradient of the sigil).
  Noise collapses into the mark. σ — the mean particle distance to the
  form — is measured ON the GPU and shown in the HUD. Every number in this
  view is measured, none is declared: 1 = 1.

  Canon: OLED black · platinum hairlines · one cold signal (#cfe3ff).
  Degradation is σ-honest: no WebGPU → the seal + a plain statement, never
  a fake video of the thing.
*/

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Glyph } from "@/components/glyph";
import type { SigmaCollapseHandle } from "@/components/sigma/engine";

type Mode = "boot" | "live" | "unsupported";

export default function SigmaExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<Mode>("boot");
  const [sigma, setSigma] = useState<number | null>(null);
  const [field, setField] = useState<number | null>(null);
  // portal to <body> — escapes the layout's stacking contexts so the
  // experience truly covers nav + footer.
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setMode("unsupported");
      return;
    }

    let disposed = false;
    let mounted: SigmaCollapseHandle | null = null;

    (async () => {
      const { mountSigmaCollapse } = await import("@/components/sigma/engine");
      const gpu = await mountSigmaCollapse(canvas, {
        getActive: () => !disposed,
        onSigma: (s) => {
          if (!disposed) setSigma(s);
        },
      });
      if (!gpu) {
        if (!disposed) setMode("unsupported");
        return;
      }
      if (disposed) {
        gpu.dispose();
        return;
      }
      mounted = gpu;
      setField(gpu.count * 2); // the form + its mirror — the real number.
      setMode("live");
    })();

    return () => {
      disposed = true;
      mounted?.dispose();
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <>
      {/* ── the engine surface — fixed above layout chrome (immersive) ── */}
      <div className="fixed inset-0 z-20 bg-black">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="h-full w-full"
          style={{
            opacity: mode === "live" ? 1 : 0,
            transition: "opacity 1.4s var(--ease)",
          }}
        />
      </div>

      {/* ── HUD — platinum hairline frame ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-30">
        <div className="absolute left-5 top-6 sm:left-8 sm:top-8">
          <p
            className="label text-[0.56rem] tracking-[0.28em]"
            style={{ color: "var(--metal-3)" }}
          >
            Spektre Labs · Σ-COLLAPSE
          </p>
          <p
            className="mt-1 label text-[0.5rem] tracking-[0.22em]"
            style={{ color: "var(--fg-faint)" }}
          >
            The law, rendered as physics
          </p>
        </div>

        <div className="absolute right-5 top-6 text-right sm:right-8 sm:top-8">
          <p
            className="label text-[0.5rem] tracking-[0.24em]"
            style={{ color: "var(--fg-faint)", textTransform: "none" }}
          >
            σ = DECLARED − REALIZED
          </p>
          <p
            className="mt-1 label text-[0.5rem] tracking-[0.24em]"
            style={{ color: "var(--signal)" }}
          >
            1 = 1
          </p>
        </div>

        {/* live telemetry — measured on the GPU, shown only when real */}
        {mode === "live" && sigma !== null && field !== null ? (
          <p
            className="label absolute bottom-6 left-1/2 w-max -translate-x-1/2 text-center text-[0.56rem] tracking-[0.26em] sm:bottom-8"
            style={{ color: "var(--fg-mute)", textTransform: "none" }}
          >
            FIELD&nbsp;{field.toLocaleString("en-US")}&nbsp;·&nbsp;σ&nbsp;
            {sigma.toFixed(3)}&nbsp;→&nbsp;0&nbsp;·&nbsp;MEASURED&nbsp;LIVE
          </p>
        ) : null}

        {/* back */}
        <a
          href="/"
          className="pointer-events-auto absolute bottom-5 left-5 no-underline sm:bottom-7 sm:left-8"
        >
          <span
            className="label text-[0.56rem] tracking-[0.24em] transition-colors duration-300 hover:text-[var(--fg)]"
            style={{ color: "var(--fg-mute)" }}
          >
            ← Spektre
          </span>
        </a>
      </div>

      {/* ── honest fallback — no WebGPU / reduced motion ──────────────── */}
      {mode === "unsupported" ? (
        <div className="fixed inset-0 z-[25] flex flex-col items-center justify-center bg-black px-6 text-center">
          <Glyph variant="seal" size={132} strokeOpacity={0.4} />
          <p
            className="label mt-9 text-[0.6rem] tracking-[0.26em]"
            style={{ color: "var(--fg-mute)" }}
          >
            Σ-COLLAPSE runs on WebGPU
          </p>
          <p className="mt-4 max-w-[30rem] text-[0.95rem] leading-[1.8] text-[var(--fg-dim)]">
            This experience computes a quarter-million-particle field on your
            GPU and measures σ live. Your browser or motion settings do not
            expose WebGPU, so we show the seal instead of faking the physics.
          </p>
        </div>
      ) : null}
    </>,
    document.body,
  );
}
