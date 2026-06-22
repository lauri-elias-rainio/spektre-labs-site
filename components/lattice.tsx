"use client";

import { useEffect, useRef } from "react";

/*
  Lattice — the hero's signal object. A 3D point structure that reads as
  "structure mined from latent space": an ordered platinum lattice crystallised
  at the core, dissolving into latent noise at the edges. Pure canvas 2D with a
  hand-rolled 3D projection (no WebGL dependency), DPR-aware for OLED 8K crispness,
  metallic depth shading, faint wireframe, slow rotation + subtle pointer parallax.
*/

type P = { x: number; y: number; z: number; ordered: boolean };

export function Lattice() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // ---- build the point set ----
    const pts: P[] = [];
    const R = 1;

    // ordered core: Fibonacci sphere shell (the crystallised structure)
    const N = 340;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      pts.push({ x: Math.cos(t) * r * R, y: y * R, z: Math.sin(t) * r * R, ordered: true });
    }
    // latent noise: a diffuse cloud dissolving outward
    for (let i = 0; i < 180; i++) {
      const u = Math.random();
      const v = Math.random();
      const th = u * Math.PI * 2;
      const ph = Math.acos(2 * v - 1);
      const rad = R * (1.25 + Math.random() * 1.5);
      pts.push({
        x: Math.sin(ph) * Math.cos(th) * rad,
        y: Math.cos(ph) * rad,
        z: Math.sin(ph) * Math.sin(th) * rad,
        ordered: false,
      });
    }

    // precompute near-neighbour edges among ordered points (the wireframe)
    const ordered = pts.filter((p) => p.ordered);
    const edges: [P, P][] = [];
    const thresh = 0.34;
    for (let i = 0; i < ordered.length; i++) {
      for (let j = i + 1; j < ordered.length; j++) {
        const dx = ordered[i].x - ordered[j].x;
        const dy = ordered[i].y - ordered[j].y;
        const dz = ordered[i].z - ordered[j].z;
        if (dx * dx + dy * dy + dz * dz < thresh * thresh) edges.push([ordered[i], ordered[j]]);
      }
    }

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Cap DPR at 2 — 2.5 wastes GPU fill on Retina without visible gain
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // pointer parallax
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    // ---- visibility / intersection pause gates ----
    let visible = true;   // IntersectionObserver
    let pageVisible = !document.hidden; // visibilitychange

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && pageVisible) scheduleFrame();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible && visible) scheduleFrame();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---- 30 fps throttle ----
    const TARGET_MS = 1000 / 30;
    let lastFrameTime = 0;

    let raf = 0;
    let animT = reduce ? 0.6 : 0;
    let rafScheduled = false;

    const render = (now: number) => {
      rafScheduled = false;

      // throttle to ~30 fps
      const elapsed = now - lastFrameTime;
      if (elapsed < TARGET_MS - 1) {
        scheduleFrame();
        return;
      }
      lastFrameTime = now - (elapsed % TARGET_MS);

      animT += 0.0016;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      const cx = w / 2;
      const cy = h * 0.5;
      const scale = Math.min(w, h) * 0.42;
      const persp = 3.0;

      const ay = animT + mx * 0.5;
      const ax = -0.42 + my * 0.32;
      const cay = Math.cos(ay), say = Math.sin(ay);
      const cax = Math.cos(ax), sax = Math.sin(ax);

      const proj = (p: P) => {
        // rotate Y then X
        let x = p.x * cay - p.z * say;
        let z = p.x * say + p.z * cay;
        let y = p.y * cax - z * sax;
        z = p.y * sax + z * cax;
        const d = persp / (persp - z);
        return { sx: cx + x * scale * d, sy: cy + y * scale * d, z, d };
      };

      ctx.clearRect(0, 0, w, h);

      // wireframe — faint platinum filaments, depth-dimmed
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const pa = proj(a);
        const pb = proj(b);
        const zavg = (pa.z + pb.z) / 2;
        const alpha = Math.max(0, (zavg + 1) / 2) * 0.16;
        if (alpha < 0.012) continue;
        ctx.strokeStyle = `rgba(190, 205, 230, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }

      // points — painter's order back→front
      const drawn = pts
        .map((p) => ({ p, pr: proj(p) }))
        .sort((a, b) => a.pr.z - b.pr.z);

      for (const { p, pr } of drawn) {
        const depth = (pr.z + 1.6) / 3.2; // 0 far → 1 near
        if (p.ordered) {
          const r = (0.7 + depth * 1.9) * pr.d;
          const lum = 0.32 + depth * 0.68;
          // specular core
          const g = ctx.createRadialGradient(pr.sx, pr.sy, 0, pr.sx, pr.sy, r * 2.4);
          g.addColorStop(0, `rgba(255,255,255,${0.9 * lum})`);
          g.addColorStop(0.4, `rgba(214,221,232,${0.5 * lum})`);
          g.addColorStop(1, "rgba(150,165,190,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pr.sx, pr.sy, r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const r = (0.5 + depth * 0.9) * pr.d;
          const a = 0.06 + depth * 0.16;
          ctx.fillStyle = `rgba(160,176,200,${a})`;
          ctx.beginPath();
          ctx.arc(pr.sx, pr.sy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reduce) scheduleFrame();
    };

    function scheduleFrame() {
      if (rafScheduled || !visible || !pageVisible) return;
      rafScheduled = true;
      raf = requestAnimationFrame(render);
    }

    if (reduce) {
      render(0);
      render(0);
    } else {
      scheduleFrame();
    }

    return () => {
      cancelAnimationFrame(raf);
      rafScheduled = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ maskImage: "radial-gradient(120% 100% at 65% 45%, #000 55%, transparent 90%)" }}
    />
  );
}
