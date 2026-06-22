"use client";

import { useEffect, useRef, useState } from "react";

import { SealPoster } from "../hero-scene/seal-poster";

/**
 * Client-only WebGPU/WebGL canvas for the Σ centerpiece, with a static SVG
 * poster fallback so the hero is never blank.
 *
 * Degradation chain (σ-honest):
 *   WebGPU (TSL bloom)  →  WebGL2 (same scene)  →  static SVG poster.
 *
 * - prefers-reduced-motion: render a single still frame.
 * - no-WebGL / any init failure: the poster stays visible.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      c.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function SigmaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!supportsWebGL()) return;

    let disposed = false;
    let mounted: { dispose: () => void } | null = null;
    const reduced = prefersReducedMotion();

    (async () => {
      try {
        const { mountSigma } = await import("./sigma-renderer");
        if (disposed) return;
        mounted = await mountSigma(canvas, () => reduced);
        if (disposed) {
          mounted?.dispose();
          return;
        }
        setLive(true);
      } catch {
        setLive(false);
      }
    })();

    return () => {
      disposed = true;
      mounted?.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[min(128%,52rem)] w-[min(128%,52rem)] -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* Static poster — visible until (and unless) the 3D goes live. */}
      <SealPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
      {/* OLED vignette so the form recedes into true-black at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 46%, transparent 28%, #000 80%)",
        }}
      />
    </div>
  );
}
