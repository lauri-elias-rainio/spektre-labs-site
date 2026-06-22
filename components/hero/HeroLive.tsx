"use client";

import { useEffect, useRef, useState } from "react";

import { HeroPoster } from "./HeroPoster";

/**
 * HeroLive — the client-only 3D mount. This is the dynamic-import target
 * (never SSR'd, never in the first-paint bundle). It owns the capability gate
 * and the degradation chain (σ-honest, no fake claims):
 *
 *   WebGPU (three WebGPURenderer + TSL bloom)  →  WebGL2 (same scene graph)
 *     →  static HeroPoster (no-WebGL / mobile-low / init failure).
 *
 * The poster underlays the canvas ALWAYS and only fades out once a real live
 * frame is confirmed — so there is no flash of nothing and no broken hero if
 * the GPU path throws. prefers-reduced-motion renders a single still frame.
 *
 * The heavy three.js renderer module is itself imported lazily inside the
 * effect, so even this client chunk stays light until the canvas truly mounts.
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

export default function HeroLive() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // The poster stays visible until the 3D scene confirms a live frame.
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Capability gate: no GPU at all → keep the static poster, mount nothing.
    if (!supportsWebGL()) return;

    let disposed = false;
    let mounted: { dispose: () => void } | null = null;
    const reduced = prefersReducedMotion();

    (async () => {
      try {
        // Proven WebGPU→WebGL2 renderer lives in the peer hero-scene module;
        // reuse it rather than fork the scene graph (declared = realized).
        const { mountHero } = await import("@/components/hero-scene/renderer");
        if (disposed) return;
        mounted = await mountHero(canvas, () => reduced);
        if (disposed) {
          mounted?.dispose();
          return;
        }
        setLive(true);
      } catch {
        // Any init failure: the poster remains, canvas stays empty/hidden.
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
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* Static poster — visible until (and unless) the 3D goes live. */}
      <HeroPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
      {/* OLED vignette so the seal recedes into true-black at the edges. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: "radial-gradient(60% 60% at 50% 45%, transparent 30%, #000 78%)",
        }}
      />
    </div>
  );
}
