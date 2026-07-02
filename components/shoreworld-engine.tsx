"use client";

/*
  SHOREWORLD ENGINE — a real procedural-reality / world-modeling engine.
  ───────────────────────────────────────────────────────────────────────
  The world IS the math. A deterministic seeded generator builds the
  Coherence Capital with PERFECT radial + bilateral symmetry (1 = 1):
  identical copies folded around the axis — declared = realized.

  Stack: Three.js r184 WebGPURenderer (the most advanced web-3D path),
  backend-agnostic — real WebGPU when the browser exposes navigator.gpu,
  automatic WebGL2 fallback via { forceWebGL } otherwise. One code path,
  TSL bloom post on both. GPU-instanced → hundreds of monoliths in a
  handful of draw calls → 60fps, no lag. Auto-degrades resolution under
  load; pauses when off-screen or backgrounded.

  Canon (STYLE_LAW, locked): OLED true-black void · platinum metal ·
  one cold signal (#cfe3ff) · perfect symmetry · no people · no fake.
  If WebGPU/WebGL both fail we report it honestly (ei feikki paskaa).
*/

import { useEffect, useRef, useState } from "react";

type Backend = "webgpu" | "webgl" | "error";

// deterministic PRNG — the world is reproducible (1 = 1 across loads)
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ShoreworldEngine({
  onReady,
  windowed = false,
}: {
  onReady?: (backend: Backend) => void;
  /** true → fill the nearest relative parent instead of the viewport,
      so the engine embeds directly into a page as a live plate. */
  windowed?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [backend, setBackend] = useState<Backend>("webgpu");
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import("three/webgpu");
        const { pass } = await import("three/tsl");
        const { bloom } = await import(
          "three/addons/tsl/display/BloomNode.js"
        );

        if (disposed) return;

        // ── canvas ───────────────────────────────────────────────────
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        host.appendChild(canvas);

        const hasGPU =
          typeof navigator !== "undefined" && "gpu" in navigator;
        const renderer = new THREE.WebGPURenderer({
          canvas,
          antialias: true,
          forceWebGL: !hasGPU,
          powerPreference: "high-performance",
        });
        await renderer.init();
        if (disposed) {
          renderer.dispose();
          return;
        }
        const isWebGPU = !!(
          renderer.backend as { isWebGPUBackend?: boolean } | undefined
        )?.isWebGPUBackend;
        const usedBackend: Backend = isWebGPU ? "webgpu" : "webgl";
        setBackend(usedBackend);
        onReady?.(usedBackend);

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        // ── scene · OLED void ────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        scene.fog = new THREE.FogExp2(0x000000, 0.0125);

        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 600);
        camera.position.set(0, 16, 52);

        // canon palette
        const PLATINUM = 0x9aa0aa;
        const SIGNAL = 0xcfe3ff;

        // ── lighting — cold, dim, so blacks stay true OLED ───────────
        scene.add(new THREE.AmbientLight(0x0b1018, 0.55));
        const key = new THREE.DirectionalLight(0xbfd2f0, 1.35);
        key.position.set(18, 34, 12);
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x33425e, 0.7);
        rim.position.set(-22, 10, -18);
        scene.add(rim);
        const coreGlow = new THREE.PointLight(SIGNAL, 26, 60, 2);
        coreGlow.position.set(0, 9, 0);
        scene.add(coreGlow);

        // ── materials ────────────────────────────────────────────────
        const platinum = new THREE.MeshStandardMaterial({
          color: PLATINUM,
          metalness: 0.94,
          roughness: 0.34,
        });
        const emissive = new THREE.MeshStandardMaterial({
          color: 0x0a0f16,
          emissive: SIGNAL,
          emissiveIntensity: 4.2,
          metalness: 0.2,
          roughness: 0.4,
        });

        // ── WORLD-MODELING ENGINE — deterministic symmetric capital ──
        const rng = mulberry32(0x5ec0de); // seed: "SECODE"
        const unit = new THREE.BoxGeometry(1, 1, 1);
        const mats: InstanceType<typeof THREE.Matrix4>[] = [];
        const dummy = new THREE.Object3D();

        const pushBox = (
          x: number,
          y: number,
          z: number,
          sx: number,
          sy: number,
          sz: number,
          ry = 0,
        ) => {
          dummy.position.set(x, y, z);
          dummy.scale.set(sx, sy, sz);
          dummy.rotation.set(0, ry, 0);
          dummy.updateMatrix();
          mats.push(dummy.matrix.clone());
        };

        // concentric stepped base — radial platforms (perfectly symmetric)
        for (let i = 0; i < 6; i++) {
          const s = 88 - i * 12;
          pushBox(0, i * 0.9 - 1.4, 0, s, 0.9, s);
        }

        // radial tower rings — K-fold symmetry: identical copy per spoke ⇒ 1=1
        const ringSpecs = [
          { r: 16, k: 12, seg: [4.0, 2.6, 1.6], hs: [9, 5.5, 3] },
          { r: 27, k: 12, seg: [3.0, 2.0, 1.2], hs: [6, 3.5, 2] },
          { r: 38, k: 24, seg: [2.2, 1.4], hs: [4, 2.2] },
          { r: 50, k: 24, seg: [1.6, 1.0], hs: [2.6, 1.4] },
        ];
        for (const ring of ringSpecs) {
          // one deterministic profile per ring (same for every spoke -> symmetry)
          const twist = rng() * 0.4;
          for (let k = 0; k < ring.k; k++) {
            const a = (k / ring.k) * Math.PI * 2;
            const x = Math.cos(a) * ring.r;
            const z = Math.sin(a) * ring.r;
            let y = 1.6;
            for (let s = 0; s < ring.seg.length; s++) {
              const w = ring.seg[s];
              const h = ring.hs[s];
              pushBox(x, y + h / 2, z, w, h, w, -a + twist);
              y += h;
            }
            // crown
            pushBox(x, y + 0.4, z, ring.seg[0] * 0.45, 0.8, ring.seg[0] * 0.45, -a);
          }
        }

        // ── THE GATE — central monolith, bilateral symmetry ──────────
        // twin pylons (mirrored across x) + lintel
        for (const sgn of [-1, 1]) {
          pushBox(sgn * 2.4, 9, 0, 1.7, 18, 1.7);
        }
        pushBox(0, 18.4, 0, 6.4, 1.4, 1.9); // lintel
        pushBox(0, 19.8, 0, 3.2, 1.0, 1.4); // capstone

        // build the instanced capital — hundreds of monoliths, few draw calls
        const capital = new THREE.InstancedMesh(unit, platinum, mats.length);
        mats.forEach((m, i) => capital.setMatrixAt(i, m));
        capital.instanceMatrix.needsUpdate = true;
        capital.frustumCulled = false;
        scene.add(capital);

        // ── THE CORE — emissive signal slit + 1=1 sigil ──────────────
        const coreGrp = new THREE.Group();
        const slit = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 13, 0.6),
          emissive,
        );
        slit.position.set(0, 9, 0);
        coreGrp.add(slit);
        // the equals sigil — two bars on the lintel (1 = 1)
        for (const yy of [18.0, 18.8]) {
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 0.26, 0.18),
            emissive,
          );
          bar.position.set(0, yy, 1.0);
          coreGrp.add(bar);
        }
        scene.add(coreGrp);

        // mirrored reflection of the core below the sea (cheap, beautiful)
        const coreReflect = coreGrp.clone();
        coreReflect.scale.y = -1;
        coreReflect.position.y = 0;
        scene.add(coreReflect);

        // ── OBSIDIAN SEA — dark mirror plane ─────────────────────────
        const sea = new THREE.Mesh(
          new THREE.CircleGeometry(280, 96),
          new THREE.MeshStandardMaterial({
            color: 0x04060a,
            metalness: 1.0,
            roughness: 0.16,
            transparent: true,
            opacity: 0.94,
          }),
        );
        sea.rotation.x = -Math.PI / 2;
        sea.position.y = -1.4;
        scene.add(sea);

        // ── TWIN MOONS — faint platinum, they bloom ──────────────────
        const moonMat = new THREE.MeshStandardMaterial({
          color: 0x0a0f16,
          emissive: 0x9fb4d6,
          emissiveIntensity: 2.0,
        });
        for (const [mx, my, mr] of [
          [-120, 78, 9],
          [134, 96, 6.2],
        ] as const) {
          const moon = new THREE.Mesh(new THREE.SphereGeometry(mr, 32, 32), moonMat);
          moon.position.set(mx, my, -240);
          scene.add(moon);
        }

        // ── sparse starfield — depth, near-OLED faint ────────────────
        {
          const N = 420;
          const pos = new Float32Array(N * 3);
          for (let i = 0; i < N; i++) {
            const a = Math.random() * Math.PI * 2;
            const r = 260 + Math.random() * 120;
            pos[i * 3] = Math.cos(a) * r;
            pos[i * 3 + 1] = 40 + Math.random() * 180;
            pos[i * 3 + 2] = Math.sin(a) * r - 80;
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
          const stars = new THREE.Points(
            g,
            new THREE.PointsMaterial({
              color: 0x9fb4d6,
              size: 0.9,
              sizeAttenuation: true,
              transparent: true,
              opacity: 0.5,
            }),
          );
          scene.add(stars);
        }

        // ── POST — TSL bloom (the dark-luxury luminous signature) ────
        let postProcessing: InstanceType<typeof THREE.PostProcessing> | null =
          null;
        try {
          const pp = new THREE.PostProcessing(renderer);
          const scenePass = pass(scene, camera);
          const color = scenePass.getTextureNode();
          const bloomPass = bloom(color, 0.9, 0.45, 0.12);
          pp.outputNode = color.add(bloomPass);
          postProcessing = pp;
        } catch {
          postProcessing = null; // still renders directly — emissive carries it
        }

        // ── sizing + pixel-ratio auto-degrade ────────────────────────
        let renderScale = Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          1.75,
        );
        const resize = () => {
          const w = host.clientWidth || window.innerWidth;
          const h = host.clientHeight || window.innerHeight;
          renderer.setPixelRatio(renderScale);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        // ── interaction — pointer parallax (eased) ───────────────────
        const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
        const onPointer = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
          pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
        };
        host.addEventListener("pointermove", onPointer);

        // ── visibility / off-screen pause ────────────────────────────
        let visible = true;
        const io = new IntersectionObserver(
          (entries) => {
            visible = entries[0]?.isIntersecting ?? true;
          },
          { threshold: 0.01 },
        );
        io.observe(host);
        const onVis = () => {
          if (document.hidden) visible = false;
        };
        document.addEventListener("visibilitychange", onVis);

        // ── render loop ──────────────────────────────────────────────
        let t = 0;
        let last = performance.now();
        let acc = 0;
        let frames = 0;
        let slow = 0;

        const animate = async () => {
          const now = performance.now();
          const dt = Math.min((now - last) / 1000, 0.05);
          last = now;
          if (!visible) return;
          t += dt;

          // fps + auto-degrade
          acc += dt;
          frames++;
          if (acc >= 0.5) {
            const f = frames / acc;
            setFps(Math.round(f));
            if (f < 45) {
              slow++;
              if (slow >= 2 && renderScale > 0.85) {
                renderScale = Math.max(0.85, renderScale - 0.25);
                resize();
                slow = 0;
              }
            } else slow = 0;
            acc = 0;
            frames = 0;
          }

          // eased pointer
          pointer.x += (pointer.tx - pointer.x) * 0.04;
          pointer.y += (pointer.ty - pointer.y) * 0.04;

          // cinematic auto-orbit + parallax
          const ang = t * 0.045 + pointer.x * 0.5;
          const rad = 50 + Math.sin(t * 0.25) * 4;
          const hgt = 15 + Math.sin(t * 0.18) * 3 - pointer.y * 6;
          camera.position.set(
            Math.sin(ang) * rad,
            hgt,
            Math.cos(ang) * rad,
          );
          camera.lookAt(0, 8.5, 0);

          // breathing signal core
          const pulse = 3.4 + Math.sin(t * 1.1) * 1.1;
          emissive.emissiveIntensity = pulse;
          coreGlow.intensity = 20 + Math.sin(t * 1.1) * 8;

          if (postProcessing) await postProcessing.renderAsync();
          else await renderer.renderAsync(scene, camera);
        };

        // a11y — respect prefers-reduced-motion: render ONE static frame, no loop
        const reduceMotion =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          camera.position.set(Math.sin(0.6) * 50, 15, Math.cos(0.6) * 50);
          camera.lookAt(0, 8.5, 0);
          emissive.emissiveIntensity = 3.4;
          coreGlow.intensity = 22;
          if (postProcessing) await postProcessing.renderAsync();
          else await renderer.renderAsync(scene, camera);
          setFps(0);
        } else {
          renderer.setAnimationLoop(animate);
        }

        cleanup = () => {
          renderer.setAnimationLoop(null);
          ro.disconnect();
          io.disconnect();
          host.removeEventListener("pointermove", onPointer);
          document.removeEventListener("visibilitychange", onVis);
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        };
      } catch (err) {
        console.error("[shoreworld-engine]", err);
        if (!disposed) {
          setBackend("error");
          onReady?.("error");
        }
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [onReady]);

  const layer = windowed
    ? "absolute inset-0 h-full w-full"
    : "fixed inset-0 z-0 h-dvh w-full";

  return (
    <>
      <div ref={hostRef} className={layer} aria-hidden />
      {/* honest fallback — ei feikki paskaa: if both backends fail, say so */}
      {backend === "error" && (
        <div
          className={`${windowed ? "absolute inset-0" : "fixed inset-0 z-0"} flex items-center justify-center bg-[var(--bg)]`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/generated/shoreworld/city.png"
            alt="Shoreworld — the Coherence Capital"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <p className="label relative z-10 text-[var(--fg-mute)]">
            Live engine needs WebGPU / WebGL2 — showing a generated still
          </p>
        </div>
      )}
      {/* live backend telemetry — σ-honest, no fake numbers */}
      {backend !== "error" && (
        <div
          className={`pointer-events-none ${windowed ? "absolute bottom-3 right-4" : "fixed bottom-5 right-5 z-20"} text-right`}
        >
          <p
            className="label text-[0.56rem] tracking-[0.24em]"
            style={{ color: "var(--fg-faint)" }}
          >
            {backend === "webgpu" ? "WebGPU" : "WebGL2"} · {fps || "—"} fps
          </p>
        </div>
      )}
    </>
  );
}
