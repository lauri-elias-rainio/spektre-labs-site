"use client";

/**
 * THE DESCENT — one persistent particle field behind the whole homepage.
 *
 * The canvas is fixed behind the content. Sections marked with
 * [data-descent-stage] are the five stations; scroll position maps to a
 * continuous stage value and the engine morphs the field between formations.
 *
 * σ-honest handoff: the CSS monolith renders at 0ms and only yields once the
 * engine has PROVEN it draws (3 real frames). WebGPU (131k simulated · 262k
 * rendered) → WebGL2 (49k × 2, GPU-morphed) → the CSS art simply stays.
 * prefers-reduced-motion ⇒ no engine at all; the static composition holds.
 */

import { useEffect, useRef, useState } from "react";

import type { DescentHandle } from "./engine-webgpu";

const STAGE_SELECTOR = "[data-descent-stage]";
const SEAL_STAGE = 4;

export default function Descent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // the static CSS composition is the experience
    }

    let disposed = false;
    let handle: DescentHandle | null = null;
    let visible = true;
    let tabVisible = !document.hidden;

    const io = new IntersectionObserver(
      (entries) => { visible = entries.some((e) => e.isIntersecting); },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVis = () => { tabVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    /* scroll → continuous stage value across the marked sections */
    let stageTops: number[] = [];
    const measure = () => {
      stageTops = Array.from(document.querySelectorAll(STAGE_SELECTOR)).map(
        (el) => (el as HTMLElement).offsetTop
      );
    };
    const stageAt = () => {
      if (!stageTops.length) return { fA: 0, fB: 0, blend: 0, seal: 0, exposure: 1 };
      const y = window.scrollY + window.innerHeight * 0.42;
      let pos = 0;
      for (let i = 0; i < stageTops.length - 1; i++) {
        const a = stageTops[i];
        const b = stageTops[i + 1];
        if (y >= b) { pos = i + 1; continue; }
        if (y >= a) {
          const f = (y - a) / Math.max(1, b - a);
          // luxury settle — hold the form, morph through the gap
          const eased = f < 0.35 ? 0 : f > 0.85 ? 1 : (f - 0.35) / 0.5;
          pos = i + eased * eased * (3 - 2 * eased);
        }
      }
      const fA = Math.min(Math.floor(pos), stageTops.length - 1);
      const fB = Math.min(fA + 1, stageTops.length - 1);
      const blend = pos - fA;
      const seal =
        (fA === SEAL_STAGE ? 1 - blend : 0) + (fB === SEAL_STAGE ? blend : 0);
      // exposure choreography: the MONUMENT owns the hero (field dark there),
      // quiet tissue through the text sections, and the seal moment stays
      // BENEATH the closing typography — presence, never competition.
      const rise = Math.min(1, Math.max(0, (pos - 0.35) / 0.45));
      const sealNear = Math.min(1, Math.max(0, (pos - 3.3) / 0.7));
      const exposure = 0.15 * rise + 0.33 * sealNear;
      return { fA, fB, blend, seal, exposure };
    };

    const onScroll = () => {
      if (!handle) return;
      const s = stageAt();
      handle.setStage(s.fA, s.fB, s.blend, s.seal, s.exposure);
    };
    const onResize = () => { measure(); onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    /* pointer → world-plane entropy injection */
    const onPointer = (e: PointerEvent) => {
      if (!handle) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      handle.setPointer(nx * 2.0, ny * 1.4, 0.06);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    (async () => {
      const opts = {
        onLive: () => { if (!disposed) setLive(true); },
        getActive: () => visible && tabVisible,
      };
      try {
        const { createDescentWebGPU } = await import("./engine-webgpu");
        handle = await createDescentWebGPU(canvas, opts);
      } catch { handle = null; }
      if (!handle && !disposed) {
        try {
          const { createDescentWebGL } = await import("./engine-webgl");
          handle = await createDescentWebGL(canvas, opts);
        } catch { handle = null; }
      }
      if (disposed) { handle?.dispose(); return; }
      measure();
      onScroll();
    })();

    return () => {
      disposed = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      handle?.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* the CSS monolith — instant, and the whole art if no GPU path proves */}
      <div
        className="hero-monolith-fallback"
        style={{
          opacity: live ? 0 : undefined,
          transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      {/* symmetric legibility veil — content floats above the field */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_0%,rgba(0,0,0,0.55)_78%,rgba(0,0,0,0.82)_100%)]" />
    </div>
  );
}
