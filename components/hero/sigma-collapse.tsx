"use client";

import { useEffect, useRef, useState } from "react";

import { SealPoster } from "../hero-scene/seal-poster";

/**
 * SigmaCollapse — the Σ centerpiece with a σ-honest degradation chain:
 *
 *   raw WebGPU compute (Σ-COLLAPSE particle field, live measured σ)
 *     → three.js platinum sculpture (WebGPU-TSL / WebGL2)
 *       → static SVG poster.
 *
 * prefers-reduced-motion skips the live paths entirely (still poster).
 * The engine pauses when the hero is offscreen or the tab is hidden.
 * The σ readout is real telemetry — mean particle distance to the form,
 * measured on the GPU. Declared = realized.
 */

type Mode = "boot" | "collapse" | "sculpture" | "poster";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SigmaCollapse() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<Mode>("boot");
  const [sigma, setSigma] = useState<number | null>(null);
  const [field, setField] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    if (prefersReducedMotion()) {
      setMode("poster");
      return;
    }

    let disposed = false;
    let mounted: { dispose: () => void } | null = null;

    // pause simulation when the stage is offscreen.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 },
    );
    io.observe(container);

    (async () => {
      try {
        const { mountSigmaCollapse } = await import("./sigma-collapse-engine");
        const gpu = await mountSigmaCollapse(canvas, {
          getActive: () => visible,
          onSigma: (s) => {
            if (!disposed) setSigma(s);
          },
        });
        if (gpu) {
          if (disposed) {
            gpu.dispose();
            return;
          }
          mounted = gpu;
          setField(gpu.count * 2); // the form + its mirror — the real number.
          setMode("collapse");
          return;
        }
        // fallback: the three.js sculpture (handles its own WebGL chain).
        const { mountSigma } = await import("./sigma-renderer");
        if (disposed) return;
        mounted = await mountSigma(canvas, prefersReducedMotion);
        if (disposed) {
          mounted?.dispose();
          return;
        }
        setMode("sculpture");
      } catch {
        if (!disposed) setMode("poster");
      }
    })();

    return () => {
      disposed = true;
      io.disconnect();
      mounted?.dispose();
    };
  }, []);

  const live = mode === "collapse" || mode === "sculpture";

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[min(132%,56rem)] w-[min(132%,56rem)] -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity 1.4s var(--spk-ease)",
        }}
      />
      {/* Static poster — visible until (and unless) a live path takes over. */}
      {mode !== "collapse" && mode !== "sculpture" ? (
        <SealPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
      ) : null}
      {/* OLED vignette — the field recedes into true-black at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 46%, transparent 30%, #000 82%)",
        }}
      />
      {/* Live spec rail — every number measured, none declared (1 = 1). */}
      {mode === "collapse" && sigma !== null && field !== null ? (
        <p
          aria-hidden
          className="spektre-label absolute bottom-5 left-1/2 w-max -translate-x-1/2 text-center"
          style={{ color: "var(--spk-pt-mid)", opacity: 0.9, textTransform: "none" }}
        >
          “Σ-COLLAPSE”&nbsp;·&nbsp;FIELD&nbsp;{field.toLocaleString("en-US")}
          &nbsp;·&nbsp;σ&nbsp;{sigma.toFixed(3)}&nbsp;→&nbsp;0&nbsp;·&nbsp;MEASURED&nbsp;LIVE
        </p>
      ) : null}
    </div>
  );
}
