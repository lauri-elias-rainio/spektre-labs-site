"use client";

import { useEffect, useRef } from "react";

/*
  ─────────────────────────────────────────────────────────────────────────────
  SignalWebGPU — THE OBELISK
  ─────────────────────────────────────────────────────────────────────────────
  One perfectly axisymmetric platinum monolith, suspended in OLED void, that the
  whole homepage descends past. The current rotating icosahedron is replaced by
  ONE signature object: a vertical Spektre seal-obelisk built as an 8-fold (radial)
  seal swept along Y and bilaterally mirrored across X and Z — so every flip-test
  passes BY CONSTRUCTION. Symmetry is the load-bearing idea: the object reads
  identically flipped left=right, and the camera path is itself axis-locked, so
  The brand geometry is rendered in both form and motion.

  Symmetry-by-construction: one 45° wedge geometry is instanced 8× via
  makeRotationY around the Y axis (one geometry, one draw path) — there is no way
  for one octant to differ from another. The single #cfe3ff signal is a thin
  emissive sliver bound to the object's exact vertical centerline — the only
  saturated pixel on the page, always on the axis.

  Render path: Three.js WebGPURenderer (TSL MeshPhysicalNodeMaterial + bloom +
  chromaticAberration + fxaa) → WebGL2 fallback (raw PBR, NO postFX, already
  premium) → if both fail, render nothing and the caller's <Lattice/> + Glyph seal
  stay visible. SSR-safe: nothing touches three until useEffect; all imports are
  dynamic. prefers-reduced-motion ⇒ a still, perfectly-centered monolith.

  STYLE_LAW: OLED true-black + ONE platinum metal axis + ONE cold signal (#cfe3ff).
  Monochrome. One ornament (the env strip). Symmetry, material, and restraint.
*/

export default function SignalWebGPU() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── dynamic imports — kept entirely out of the SSR / build critical path ──
      const THREE = await import("three");
      if (disposed) return;

      // PLATINUM AXIS — #e8eaee→#565b65 ; the one metal. SIGNAL — #cfe3ff ; the one accent.
      const PLATINUM = 0xd8d8de; //  core color, mid of the platinum axis
      const SIGNAL = 0xcfe3ff; //   the single cold-signal sliver
      const RIM_COLD = 0x9098b0; //  cold rim light
      const AMBIENT = 0x0a0a0c; //   near-zero ambient on OLED black
      const STRIP_HI = 0xf4f4f8; //  the single env highlight strip (the whole reflection vocabulary)

      // ── try WebGPU; cleanly fall back to WebGL2; if neither, bail (Lattice shows) ──
      let renderer: any;
      let isWebGPU = false;
      try {
        const webgpuMod: any = await import("three/webgpu");
        const WebGPURenderer = webgpuMod.WebGPURenderer;
        const gpuSupported =
          typeof navigator !== "undefined" && "gpu" in navigator;
        if (WebGPURenderer && gpuSupported) {
          renderer = new WebGPURenderer({ antialias: true, alpha: true });
          isWebGPU = true;
        }
      } catch {
        /* WebGPU module unavailable — fall through to WebGL2 */
      }
      if (!renderer) {
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          isWebGPU = false;
        } catch {
          return; // no GPU path at all — caller's CSS/Lattice fallback stays
        }
      }
      if (disposed) {
        renderer.dispose?.();
        return;
      }

      // ── sizing — DPR clamped at 2 (OLED-crisp, capped) ──
      const getSize = () => ({
        w: mount.clientWidth || 600,
        h: mount.clientHeight || 700,
      });
      let { w, h } = getSize();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0); // transparent over OLED-black page
      const canvas: HTMLCanvasElement = renderer.domElement;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      mount.appendChild(canvas);

      const scene = new THREE.Scene();

      // ── camera: axis-locked. It only ever sits on / descends the object's Y axis.
      //    Scroll dollies it DOWN the axis; it never yaws, so the flip-test holds. ──
      const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
      const CAM_Z = 6.2;
      camera.position.set(0, 0, CAM_Z);
      camera.lookAt(0, 0, 0);

      // ─────────────────────────────────────────────────────────────────────────
      // GEOMETRY — the obelisk, built from ONE 45° wedge instanced 8×.
      // A vertical seal-monolith: an 8-pointed radial seal profile swept along Y,
      // tapering toward both ends (bilaterally symmetric across the XZ plane too).
      // Building one wedge and rotating it 8× guarantees exact n-fold symmetry —
      // no octant can drift. Mirrored verts inside the wedge guarantee bilateral.
      // ─────────────────────────────────────────────────────────────────────────
      function buildWedgeGeometry() {
        const HEIGHT = 3.0; // total monolith height (Y), centered on origin
        const HALF = HEIGHT / 2;
        const RINGS = 96; // vertical resolution
        const WEDGE = Math.PI / 4; // 45° — one of 8 identical octants
        const SEG = 10; // angular resolution within the wedge

        // radius profile along the axis (Y): a machined monolith silhouette —
        // a tapered shaft with a faceted crown + base, perfectly mirrored about y=0.
        const radiusAt = (yn: number) => {
          // yn in [-1,1]; |yn| guarantees bilateral symmetry across XZ (top=bottom)
          const a = Math.abs(yn);
          const shaft = 0.78 * (1.0 - 0.22 * a); // gentle taper toward the tips
          const crown = 0.16 * Math.pow(Math.max(0, 1 - a * 1.18), 2.2); // tip flare
          const collar = 0.06 * Math.exp(-Math.pow((a - 0.62) / 0.06, 2)); // machined ring
          const tip = 1.0 - Math.pow(a, 8); // round the very ends to a point-ish cap
          return Math.max(0.02, (shaft + crown + collar) * tip);
        };
        // 8-fold seal modulation across the wedge angle — a faceted seal flute,
        // symmetric within the wedge (peaks at both wedge edges) so adjacent
        // instances meet seamlessly and the result is exact radial symmetry.
        const sealAt = (an: number) => {
          // an in [0,1] across the wedge; cosine so edges match neighbor instance
          return 1.0 + 0.14 * Math.cos(an * Math.PI * 2) * 0.5 + 0.07 * Math.cos(an * Math.PI);
        };

        const positions: number[] = [];
        const normals: number[] = [];
        const indices: number[] = [];

        for (let i = 0; i <= RINGS; i++) {
          const yn = (i / RINGS) * 2 - 1; // -1..1
          const y = yn * HALF;
          const r = radiusAt(yn);
          for (let j = 0; j <= SEG; j++) {
            const an = j / SEG; // 0..1 across the wedge
            const ang = an * WEDGE;
            const rr = r * sealAt(an);
            const x = Math.cos(ang) * rr;
            const z = Math.sin(ang) * rr;
            positions.push(x, y, z);
            // approximate outward normal (radial + slight axial) — refined below
            normals.push(Math.cos(ang), 0, Math.sin(ang));
          }
        }
        const cols = SEG + 1;
        for (let i = 0; i < RINGS; i++) {
          for (let j = 0; j < SEG; j++) {
            const a = i * cols + j;
            const b = a + cols;
            const c = a + 1;
            const d = b + 1;
            indices.push(a, b, c, c, b, d);
          }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        geo.setAttribute(
          "normal",
          new THREE.Float32BufferAttribute(normals, 3),
        );
        geo.setIndex(indices);
        geo.computeVertexNormals(); // proper smooth normals for mirror-polish PBR
        return geo;
      }

      const wedgeGeo = buildWedgeGeometry();

      // ── material ── mirror-polished platinum, brushed-grain along Y only ──
      let material: any;
      if (isWebGPU) {
        // TSL node material — the high-fidelity path
        const tsl: any = await import("three/tsl");
        const webgpu: any = await import("three/webgpu");
        if (disposed) {
          renderer.dispose?.();
          return;
        }
        const { positionLocal, mx_noise_float, float, vec3 } = tsl;
        const m = new webgpu.MeshPhysicalNodeMaterial();
        m.color = new THREE.Color(PLATINUM);
        m.metalness = 1.0;
        m.roughness = 0.14; // tighter than the old 0.22 — mirror-polished
        m.clearcoat = 1.0;
        m.clearcoatRoughness = 0.05;
        m.anisotropy = 0.85;
        m.envMapIntensity = 1.5;
        // low-amplitude vertical brushed grain: noise sampled along Y ONLY, so the
        // grain follows the axis of symmetry and can NEVER break left=right.
        try {
          const yCoord = positionLocal.y;
          const grain = mx_noise_float(vec3(float(0.0), yCoord.mul(34.0), float(0.0)))
            .mul(0.05); // amplitude ≈ 0.05 roughness modulation
          m.roughnessNode = float(0.14).add(grain.abs());
        } catch {
          /* grain optional — base roughness already premium */
        }
        material = m;
      } else {
        // WebGL2 path — raw PBR, no node graph. Still hyperreal, no postFX needed.
        material = new THREE.MeshPhysicalMaterial({
          color: PLATINUM,
          metalness: 1.0,
          roughness: 0.14,
          clearcoat: 1.0,
          clearcoatRoughness: 0.05,
          reflectivity: 1.0,
          envMapIntensity: 1.5,
        });
        // anisotropy is supported on MeshPhysicalMaterial in r0.184
        try {
          (material as any).anisotropy = 0.85;
        } catch {
          /* ignore if unsupported */
        }
      }

      // ── INSTANCED 8× — symmetry guaranteed by construction (one geometry, one draw) ──
      const SECTORS = 8;
      const obelisk = new THREE.InstancedMesh(wedgeGeo, material, SECTORS);
      obelisk.frustumCulled = false;
      const mtx = new THREE.Matrix4();
      for (let s = 0; s < SECTORS; s++) {
        mtx.makeRotationY((s / SECTORS) * Math.PI * 2);
        obelisk.setMatrixAt(s, mtx);
      }
      obelisk.instanceMatrix.needsUpdate = true;

      // group lets us rotate / tilt / breathe the whole object about its own axis
      const obeliskGroup = new THREE.Group();
      obeliskGroup.add(obelisk);
      scene.add(obeliskGroup);

      // ── faint concentric wire shell — the "structure" reading, perfectly axial ──
      const shellGeo = new THREE.CylinderGeometry(0.96, 0.96, 3.0, 8, 24, true);
      const shell = new THREE.Mesh(
        shellGeo,
        new THREE.MeshBasicMaterial({
          color: 0x6a6a72,
          wireframe: true,
          transparent: true,
          opacity: 0.035,
        }),
      );
      obeliskGroup.add(shell);

      // ── THE SIGNAL — a thin emissive sliver locked to the exact centerline.
      //    The only saturated pixel on the page; it lives ON the Y axis only. ──
      const signalGeo = new THREE.PlaneGeometry(0.012, 3.0); // ~1px-wide line
      const signalMat = new THREE.MeshBasicMaterial({
        color: SIGNAL,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false, // stays saturated; drives bloom on the WebGPU path
      });
      const signalLine = new THREE.Mesh(signalGeo, signalMat);
      // billboarded to camera but pinned to x=0,z=0 so it can never leave the axis
      obeliskGroup.add(signalLine);

      // ── lighting — exactly ONE platinum key + ONE cold rim + near-zero ambient ──
      const key = new THREE.DirectionalLight(0xffffff, 3.0); // dominant platinum key
      key.position.set(4, 5, 4); // high-right
      scene.add(key);
      const rim = new THREE.DirectionalLight(RIM_COLD, 1.1); // cold rim
      rim.position.set(-5, -3, -2); // low-left
      scene.add(rim);
      scene.add(new THREE.AmbientLight(AMBIENT, 1.0));

      // ── procedural PMREM env — dark sphere + ONE bright strip = the one ornament ──
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = new THREE.Scene();
        env.background = new THREE.Color(0x05050a);
        env.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(40, 16, 16),
            new THREE.MeshBasicMaterial({
              color: 0x10131c,
              side: THREE.BackSide,
            }),
          ),
        );
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 5),
          new THREE.MeshBasicMaterial({ color: STRIP_HI }),
        );
        strip.position.set(0, 7, -10);
        env.add(strip);
        scene.environment = pmrem.fromScene(env, 0.04).texture;
        pmrem.dispose();
      } catch {
        /* env optional — directional key still carries the read */
      }

      // ─────────────────────────────────────────────────────────────────────────
      // POSTPROCESSING — WebGPU path ONLY, feature-gated. bloom + chromaticAberration
      // + fxaa. On WebGL2 we ship NO postFX (raw PBR is already premium).
      // ─────────────────────────────────────────────────────────────────────────
      let postProcessing: any = null;
      if (isWebGPU && !reduceMotion) {
        try {
          const tsl: any = await import("three/tsl");
          const webgpu: any = await import("three/webgpu");
          const { pass } = tsl;
          const bloomMod: any = await import(
            "three/examples/jsm/tsl/display/BloomNode.js"
          );
          const caMod: any = await import(
            "three/examples/jsm/tsl/display/ChromaticAberrationNode.js"
          );
          const fxaaMod: any = await import(
            "three/examples/jsm/tsl/display/FXAANode.js"
          );
          if (disposed) {
            renderer.dispose?.();
            return;
          }
          const scenePass = pass(scene, camera);
          // bloom: threshold 1.0 (only the brightest platinum edge + signal blooms)
          const bloomNode = bloomMod.bloom(scenePass, 0.26, 0.7, 1.05);
          // chromaticAberration: 0.0015 sub-pixel refraction
          const ca = caMod.chromaticAberration(
            scenePass.add(bloomNode),
            0.0015,
          );
          // fxaa for clean mobile edges
          const finalNode = fxaaMod.fxaa(ca);

          postProcessing = new webgpu.PostProcessing(renderer);
          postProcessing.outputNode = finalNode;
        } catch {
          postProcessing = null; // any node failure ⇒ silently fall back to raw render
        }
      }

      // ── interaction: AXIS-LOCKED tilt only. Pointer tips the object toward the
      //    cursor a MAX ±0.06 rad about X / Z (lerp 0.04). It can NEVER yaw off its
      //    symmetry axis, so the left=right flip-test holds at every single frame. ──
      const TILT_MAX = 0.035;
      let tiltTX = 0,
        tiltTZ = 0; // targets
      let tiltX = 0,
        tiltZ = 0; // smoothed
      const onMove = (e: PointerEvent) => {
        if (reduceMotion) return;
        const r = mount.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        tiltTX = ny * 2 * TILT_MAX; // tip toward cursor on X
        tiltTZ = -nx * 2 * TILT_MAX; // tip toward cursor on Z
      };
      if (!reduceMotion) mount.addEventListener("pointermove", onMove);

      // ── scroll-dolly: the camera descends PAST the obelisk along its axis ──
      //    progress 0 (top of hero) → 1 (hero scrolled out). Axis-locked: only Y/Z.
      let scrollProgress = 0;
      const computeScroll = () => {
        const r = mount.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 when hero top at viewport top; ramps as it scrolls up and out
        const p = -r.top / (r.height + vh);
        scrollProgress = Math.max(0, Math.min(1, p));
      };
      const onScroll = () => computeScroll();
      if (!reduceMotion) {
        window.addEventListener("scroll", onScroll, { passive: true });
        computeScroll();
      }

      const onResize = () => {
        const n = getSize();
        w = n.w;
        h = n.h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      // ── pause loop when tab hidden (Visibility API) or hero off-screen (IO) ──
      let visible = true;
      let onScreen = true;
      const onVisibility = () => {
        visible = !document.hidden;
        if (visible && onScreen) ensureRunning();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const io = new IntersectionObserver(
        (entries) => {
          onScreen = entries[0]?.isIntersecting ?? true;
          if (onScreen && visible) ensureRunning();
        },
        { threshold: 0.01 },
      );
      io.observe(mount);

      // ── render: delta-time driven (no frame-rate-dependent jank) ──
      let raf = 0;
      let running = false;
      let last = performance.now();
      let elapsed = 0;

      const draw = () => {
        if (postProcessing) {
          postProcessing.renderAsync?.() ?? postProcessing.render?.();
        } else {
          renderer.render(scene, camera);
        }
      };

      const renderFrame = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000); // clamp big gaps
        last = now;
        elapsed += dt;

        if (reduceMotion) {
          // STILL, perfectly-centered monolith — zero rotation/breathing/tilt.
          obeliskGroup.rotation.set(0, 0, 0);
          obeliskGroup.scale.setScalar(1);
          signalLine.lookAt(camera.position);
          draw();
          running = false; // single static frame; no loop
          return;
        }

        // Continuous y-rotation, restrained enough to read as material.
        obeliskGroup.rotation.y += 0.055 * dt;

        // axis-locked tilt — smoothed, clamped, X/Z only (never Y/yaw)
        tiltX += (tiltTX - tiltX) * 0.04;
        tiltZ += (tiltTZ - tiltZ) * 0.04;
        obeliskGroup.rotation.x = tiltX;
        obeliskGroup.rotation.z = tiltZ;

        // one coherent breathing scale — sin(t*0.6)*0.010, symmetric about axis
        obeliskGroup.scale.setScalar(1 + Math.sin(elapsed * 0.6) * 0.01);

        // scroll dollies the camera DOWN the obelisk's axis (axis-locked: Y & Z only)
        camera.position.y = -scrollProgress * 2.2; // descend
        camera.position.z = CAM_Z - scrollProgress * 1.4; // and slightly closer
        camera.position.x = 0; // never leaves the axis
        camera.lookAt(0, camera.position.y * 0.5, 0);

        // keep the signal sliver billboarded but pinned dead-center on the axis.
        // It lives at the group origin (0,0,0) — it can never leave the Y axis.
        signalLine.lookAt(camera.position);

        draw();
        if (!disposed && running) raf = requestAnimationFrame(renderFrame);
      };

      const ensureRunning = () => {
        if (disposed || running) return;
        if (reduceMotion) {
          renderFrame(); // one frame, then stop
          return;
        }
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(renderFrame);
      };

      // ── init (WebGPU needs async init; WebGL has none) then start ──
      try {
        await renderer.init?.();
      } catch {
        /* WebGL2 path — no init */
      }
      if (disposed) {
        renderer.dispose?.();
        return;
      }
      ensureRunning();

      // ── teardown — full dispose, leaves no GPU resources behind ──
      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        mount.removeEventListener("pointermove", onMove);
        io.disconnect();
        wedgeGeo.dispose();
        shellGeo.dispose();
        signalGeo.dispose();
        (shell.material as any)?.dispose?.();
        signalMat.dispose();
        material?.dispose?.();
        scene.environment?.dispose?.();
        postProcessing?.dispose?.();
        renderer.dispose?.();
        if (canvas.parentNode === mount) mount.removeChild(canvas);
      };
    })().catch(() => {
      /* any failure ⇒ swallow; the caller's <Lattice/> + Glyph fallback shows */
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
