"use client";

import dynamic from "next/dynamic";

import { SealPoster } from "../hero-scene/seal-poster";

/**
 * SigmaScene — the world-class Σ hero centerpiece (drop-in for HeroScene).
 *
 * The heavy 3D (three.js WebGPU/WebGL) is dynamically imported with SSR
 * disabled; until it loads, the static OLED-platinum poster shows so the hero
 * is never blank. Industrial dark-luxury × Atlantean cybernetics, per STYLE_LAW.
 */
const SigmaCanvas = dynamic(() => import("./sigma-canvas"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <SealPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 58% at 50% 46%, transparent 28%, #000 80%)",
        }}
      />
    </div>
  ),
});

export function SigmaScene() {
  return <SigmaCanvas />;
}
