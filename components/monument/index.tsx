"use client";

/*
  MonumentHero — σ-honest degradation chain for the hero visual:
  THE MONUMENT v2 (progressive raw-WebGPU tracer) → SIGIL PRISM (WebGL2
  raymarch) → the CSS monolith. Each engine must PROVE it draws (3 real
  frames) before the layer below yields. Reduced-motion still runs the
  tracer — it converges to a photoreal STILL and then stops burning GPU.
*/

import { useEffect, useRef, useState } from "react";

import SignalRaymarch from "@/components/signal-raymarch";
import type { MonumentHandle } from "./engine";

export default function MonumentHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tier, setTier] = useState<"css" | "prism" | "monument">("css");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let handle: MonumentHandle | null = null;
    let visible = true;
    let tabVisible = !document.hidden;

    const io = new IntersectionObserver(
      (entries) => { visible = entries.some((e) => e.isIntersecting); },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVis = () => { tabVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const onPointer = (e: PointerEvent) => {
      handle?.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    (async () => {
      try {
        const { createMonument } = await import("./engine");
        handle = await createMonument(canvas, {
          onLive: () => { if (!disposed) setTier("monument"); },
          getActive: () => visible && tabVisible,
        });
      } catch { handle = null; }
      if (!handle && !disposed) setTier("prism"); // WebGL2 prism takes the hero
    })();

    return () => {
      disposed = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      handle?.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden>
      {/* tier 0 — CSS art: instant, and final if nothing above proves */}
      <div
        className="hero-monolith-fallback"
        style={{
          opacity: tier === "css" ? undefined : 0,
          transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* tier 1 — WebGL2 SIGIL PRISM (only mounted if WebGPU failed) */}
      {tier === "prism" ? (
        <div className="absolute inset-0">
          <SignalRaymarch variant="prism" />
        </div>
      ) : null}
      {/* tier 2 — THE MONUMENT v2 */}
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          opacity: tier === "monument" ? 1 : 0,
          transition: "opacity 1.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </div>
  );
}
