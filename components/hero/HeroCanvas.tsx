"use client";

import dynamic from "next/dynamic";

import { HeroPoster } from "./HeroPoster";

/**
 * HeroCanvas — the public hero-seal entry. Bulletproof + future-proof.
 *
 * (1) Capability gate — the lazily-loaded HeroLive picks WebGPU (three
 *     WebGPURenderer) when available, else WebGL2, else the static poster.
 * (2) Lazy-load — the heavy 3D is `next/dynamic` with `ssr: false`, so it never
 *     blocks first paint; until it loads we show a platinum-on-black CSS
 *     placeholder (the static poster + OLED vignette).
 * (3) prefers-reduced-motion → static (handled inside HeroLive: one still
 *     frame, no animation loop).
 *
 * Result: the hero is NEVER blank and NEVER looks broken — server, slow
 * network, no-GPU, mobile-low, or reduced-motion all resolve to a finished,
 * symmetric, platinum-on-OLED seal. σ-honest: this is capability/brand, the 3D
 * is not load-bearing for any content.
 */
const HeroLive = dynamic(() => import("./HeroLive"), {
  ssr: false,
  loading: HeroPlaceholder,
});

/** Platinum-on-black placeholder shown until the 3D chunk loads. */
function HeroPlaceholder() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <HeroPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
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

export function HeroCanvas() {
  return <HeroLive />;
}

export default HeroCanvas;
