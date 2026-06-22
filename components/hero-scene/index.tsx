"use client";

import dynamic from "next/dynamic";

import { SealPoster } from "./seal-poster";

/**
 * Lazy-loaded hero scene. The heavy 3D (three.js WebGPU/WebGL) is dynamically
 * imported with SSR disabled so the page is fast and the canvas mounts
 * client-side. Until it loads — and on the server — the static OLED-platinum
 * poster is shown, so the hero is never blank.
 */
const HeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <SealPoster className="absolute left-1/2 top-1/2 h-[min(120%,46rem)] w-[min(120%,46rem)] -translate-x-1/2 -translate-y-1/2" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, transparent 30%, #000 78%)",
        }}
      />
    </div>
  ),
});

export function HeroScene() {
  return <HeroCanvas />;
}
