/**
 * THE DESCENT — WebGL2 fallback.
 *
 * Same five formations, same platinum/signal law, rendered as GPU-morphed
 * point sprites (three.js). No compute physics: the vertex shader blends the
 * two active formation targets and adds a seeded breath, so the field still
 * lives — at 49,152 × 2 mirrored points — on any WebGL2 device.
 */

import { buildFormations } from "./formations";
import type { DescentHandle, DescentOptions } from "./engine-webgpu";

const COUNT = 49152;

export async function createDescentWebGL(
  canvas: HTMLCanvasElement,
  opts: DescentOptions
): Promise<DescentHandle | null> {
  const THREE = await import("three");

  let renderer: import("three").WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 40);

  const formations = buildFormations(COUNT);
  const geometry = new THREE.BufferGeometry();
  // dummy position attribute (required); real position comes from targets
  geometry.setAttribute("position", new THREE.BufferAttribute(formations[0].slice(), 3));
  for (let f = 0; f < formations.length; f++) {
    geometry.setAttribute(`t${f}`, new THREE.BufferAttribute(formations[f], 3));
  }
  const seeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) seeds[i] = Math.random();
  geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uTime: { value: 0 },
    uFA: { value: 0 },
    uFB: { value: 0 },
    uBlend: { value: 0 },
    uSeal: { value: 0 },
    uFade: { value: 0 },
    uSize: { value: 1 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 t0; attribute vec3 t1; attribute vec3 t2;
      attribute vec3 t3; attribute vec3 t4;
      attribute float seed;
      uniform float uTime, uFA, uFB, uBlend, uSeal, uSize;
      varying vec3 vCol;

      vec3 pick(float f) {
        if (f < 0.5) return t0;
        if (f < 1.5) return t1;
        if (f < 2.5) return t2;
        if (f < 3.5) return t3;
        return t4;
      }
      void main() {
        vec3 target = mix(pick(uFA), pick(uFB), uBlend);
        // seeded breath — the field is alive, never frozen
        vec3 breath = vec3(
          sin(uTime * 0.5 + seed * 39.0),
          sin(uTime * 0.43 + seed * 51.0),
          sin(uTime * 0.61 + seed * 27.0)) * 0.012;
        vec3 p = target + breath;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.9 + 1.1 * fract(seed * 3.77)) * (26.0 / max(1.0, -mv.z));

        vec3 plat = mix(vec3(0.336, 0.357, 0.404), vec3(0.910, 0.918, 0.933),
                        0.35 + 0.65 * fract(seed * 7.31));
        float onAxis = (abs(target.x) < 0.0015 && abs(target.z) < 0.008) ? 1.0 : 0.0;
        float sig = uSeal * onAxis;
        vCol = mix(plat, vec3(0.812, 0.890, 1.0) * 1.6, clamp(sig, 0.0, 1.0));
      }
    `,
    fragmentShader: /* glsl */ `
      precision mediump float;
      uniform float uFade;
      varying vec3 vCol;
      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float d2 = dot(uv, uv);
        if (d2 > 1.0) discard;
        float a = exp(-d2 * 4.2) * 0.12 * uFade;
        gl_FragColor = vec4(vCol * a, a);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  const mirror = new THREE.Points(geometry, material);
  mirror.scale.x = -1;
  scene.add(points, mirror);

  let fA = 0, fB = 0, blend = 0, sealW = 0, exposure = 1;
  let disposed = false;
  let liveFrames = 0;
  let fade = 0;
  let last = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uSize.value = dpr;
    }
  }

  function frame(now: number) {
    if (disposed) return;
    requestAnimationFrame(frame);
    if (!opts.getActive()) { last = now; return; }
    resize();

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    fade = Math.min(1, fade + dt * 0.6);

    const stagePos = fA + blend;
    const dist = 3.4 + Math.sin(t * 0.07) * 0.15 + stagePos * 0.12;
    // camera arc: level → look down into the lattice → rise to face the seal
    const latticeW = Math.max(0, 1 - Math.abs(stagePos - 3));
    const sealWgt = Math.max(0, Math.min(1, stagePos - 3));
    const elev = 0.42 + 0.5 * latticeW - 0.38 * sealWgt;
    const ang = Math.PI / 2 + Math.sin(t * 0.05) * 0.10;
    camera.position.set(
      Math.cos(ang) * dist * Math.cos(elev),
      Math.sin(elev) * dist,
      Math.sin(ang) * dist * Math.cos(elev)
    );
    camera.lookAt(0, 0.1, 0);

    uniforms.uTime.value = t;
    uniforms.uFA.value = fA;
    uniforms.uFB.value = fB;
    uniforms.uBlend.value = blend;
    uniforms.uSeal.value = sealW;
    uniforms.uFade.value = fade * exposure;
    renderer.render(scene, camera);

    if (liveFrames < 4) {
      liveFrames++;
      if (liveFrames === 3) opts.onLive?.();
    }
  }
  requestAnimationFrame(frame);

  return {
    kind: "webgpu", // same contract
    count: COUNT * 2,
    setStage(a, b, bl, sw, ex) { fA = a; fB = b; blend = bl; sealW = sw; exposure = ex; },
    setPointer() { /* fallback keeps stillness — no physics to disturb */ },
    dispose() {
      disposed = true;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
