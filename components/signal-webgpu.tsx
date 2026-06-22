"use client";

import { useEffect, useRef } from "react";

/*
  SignalWebGPU — the hero's signal object, rendered on the most advanced web-graphics path available:
  Three.js WebGPURenderer with automatic WebGL2 fallback. A single perfectly-symmetric platinum form
  (PBR, hyperreal) suspended in OLED-black void, one slow rotation, one specular signal. STYLE_LAW:
  industrial-dark luxury minimalism, OLED-black + platinum + one signal, mathematically symmetric (1=1).

  Loaded dynamically (ssr:false) and self-disposing. If WebGPU+WebGL2 are both unavailable, it renders
  nothing and the caller's <Lattice/> fallback shows instead — never breaks the page.
*/

export default function SignalWebGPU() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const mount = mountRef.current;
      if (!mount) return;

      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      // dynamic imports keep three out of the SSR/build critical path
      const THREE = await import("three");
      let renderer: any;
      try {
        // WebGPU first; the renderer auto-falls back to WebGL2 when WebGPU is absent
        const { WebGPURenderer } = await import("three/webgpu");
        renderer = new WebGPURenderer({ antialias: true, alpha: true });
      } catch {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      }
      if (disposed) return;

      const w = mount.clientWidth || 600;
      const h = mount.clientHeight || 600;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5)); // OLED-crisp, capped
      renderer.setSize(w, h, false);
      renderer.setClearColor(0x000000, 0); // OLED-black, transparent over the page
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      // ── the signal: a perfectly symmetric icosahedral form, platinum PBR ──
      const geo = new THREE.IcosahedronGeometry(1.35, 6);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0xd8d8de,            // platinum
        metalness: 1.0,
        roughness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.18,
        reflectivity: 1.0,
        envMapIntensity: 1.4,
      });
      const signal = new THREE.Mesh(geo, mat);
      scene.add(signal);

      // faint platinum wire shell — the "structure" reading, perfectly concentric (1=1)
      const wire = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.72, 2),
        new THREE.MeshBasicMaterial({ color: 0x6a6a72, wireframe: true, transparent: true, opacity: 0.12 })
      );
      scene.add(wire);

      // ── lighting: one dominant specular signal + cold fill, on black ──
      const key = new THREE.DirectionalLight(0xffffff, 3.0);
      key.position.set(3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x9098b0, 1.2);
      rim.position.set(-5, -2, -3);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0x0a0a0c, 1.0));

      // a tiny procedural environment so the metal reads as real (hyperreal reflections)
      try {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const env = new THREE.Scene();
        env.background = new THREE.Color(0x05050a);
        const g1 = new THREE.Mesh(
          new THREE.SphereGeometry(40, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x10131c, side: THREE.BackSide })
        );
        env.add(g1);
        const strip = new THREE.Mesh(
          new THREE.PlaneGeometry(60, 6),
          new THREE.MeshBasicMaterial({ color: 0xf4f4f8 }) // the single platinum highlight strip
        );
        strip.position.set(0, 6, -10);
        env.add(strip);
        scene.environment = pmrem.fromScene(env, 0.04).texture;
      } catch {
        /* env optional — PBR still lit by the directional signal */
      }

      // pointer parallax (subtle) + slow rotation
      let px = 0, py = 0, tx = 0, ty = 0;
      const onMove = (e: PointerEvent) => {
        const r = mount.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
      };
      mount.addEventListener("pointermove", onMove);

      const onResize = () => {
        const nw = mount.clientWidth || w, nh = mount.clientHeight || h;
        renderer.setSize(nw, nh, false);
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      let raf = 0;
      const t0 = performance.now();
      const tick = () => {
        const t = (performance.now() - t0) / 1000;
        px += (tx - px) * 0.04;
        py += (ty - py) * 0.04;
        const spin = reduce ? 0 : t * 0.12;
        signal.rotation.y = spin + px;
        signal.rotation.x = py * 0.6;
        wire.rotation.y = -spin * 0.6 + px * 0.5;
        wire.rotation.x = py * 0.3;
        // a single coherent breathing — symmetric, 1=1
        const s = 1 + (reduce ? 0 : Math.sin(t * 0.6) * 0.012);
        signal.scale.setScalar(s);
        renderer.render(scene, camera);
        if (!disposed) raf = requestAnimationFrame(tick);
      };
      // WebGPURenderer.render returns a promise on first frame; guard either way
      try { await renderer.init?.(); } catch { /* WebGL path has no init */ }
      if (disposed) return;
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        mount.removeEventListener("pointermove", onMove);
        geo.dispose();
        mat.dispose();
        renderer.dispose?.();
        if (renderer.domElement?.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    })().catch(() => { /* swallow — caller's fallback shows */ });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
