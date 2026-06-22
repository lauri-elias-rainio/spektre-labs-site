"use client";

import { useEffect, useRef, useState } from "react";

import { SealPoster } from "./seal-poster";

/**
 * Client-only WebGPU/WebGL hero canvas with a static poster fallback.
 *
 * Degradation chain (σ-honest):
 *   WebGPU (TSL bloom)  →  WebGL2 (same scene)  →  static SVG poster.
 *
 * - prefers-reduced-motion: render a single still frame (or the poster).
 * - any init failure or no-WebGL: the poster stays visible — never blank.
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

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // poster shows until the 3D scene confirms it has mounted a live frame.
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // No GPU at all → keep the poster, render nothing.
    if (!supportsWebGL()) return;

    let disposed = false;
    let mounted: { dispose: () => void } | null = null;
    const reduced = prefersReducedMotion();

    (async () => {
      try {
        const { mountHero } = await import("./renderer");
        if (disposed) return;
        mounted = await mountHero(canvas, () => reduced);
        if (disposed) {
          mounted?.dispose();
          return;
        }
        setLive(true);
      } catch {
        // any failure: poster remains, canvas stays empty/hidden.
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
      {/* The WebGPU/WebGL canvas — OLED black, single platinum seal. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: live ? 1 : 0, transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)" }}
      />
      {/* Static poster — visible until (and unless) the 3D scene goes live. */}
      <SealPoster
        className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2"
      />
      {/* OLED vignette so the seal recedes into true-black at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, transparent 30%, #000 78%)",
        }}
      />
    </div>
  );
}
