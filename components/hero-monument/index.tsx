"use client";

/*
  HeroMonument — the home hero engine with a σ-honest degradation chain:

    raw WebGPU MONUMENT (raymarched obelisk + compute atmosphere, one SDF)
      → three.js obelisk (SignalWebGPU — its own WebGPU/WebGL2 chain)
        → the CSS monolith fallback (always rendered underneath).

  prefers-reduced-motion skips the raw engine (the three path renders a
  still). Pauses offscreen via IntersectionObserver.
*/

import { useEffect, useRef, useState } from "react";

import SignalWebGPU from "@/components/signal-webgpu";
import type { MonumentHandle } from "@/components/hero-monument/engine";

type Mode = "boot" | "monument" | "three";

export default function HeroMonument() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("boot");

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setMode("three");
      return;
    }

    let disposed = false;
    let mounted: MonumentHandle | null = null;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 });
    io.observe(host);

    (async () => {
      const { mountMonument } = await import("@/components/hero-monument/engine");
      const gpu = await mountMonument(canvas, { getActive: () => visible });
      if (!gpu) {
        if (!disposed) setMode("three");
        return;
      }
      if (disposed) { gpu.dispose(); return; }
      mounted = gpu;
      setMode("monument");
    })();

    return () => {
      disposed = true;
      io.disconnect();
      mounted?.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        aria-hidden
        className="h-full w-full"
        style={{
          opacity: mode === "monument" ? 1 : 0,
          transition: "opacity 1.4s var(--ease)",
        }}
      />
      {mode === "three" ? (
        <div className="absolute inset-0">
          <SignalWebGPU />
        </div>
      ) : null}
    </div>
  );
}
