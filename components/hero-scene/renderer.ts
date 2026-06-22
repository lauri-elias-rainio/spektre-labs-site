import * as THREE from "three";

import { buildScene, type SceneHandle } from "./scene";

export type RendererKind = "webgpu" | "webgl";

export interface MountedScene {
  kind: RendererKind;
  dispose: () => void;
}

/** Feature-detect WebGPU. ~70% browser support in 2026 — fallback mandatory. */
export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

function attachPlatinumEnv(
  scene: SceneHandle["scene"],
  renderer: THREE.WebGLRenderer,
) {
  // Procedural neutral environment so platinum reads as metal without an
  // external HDR asset (keeps the bundle lean + the palette monochrome).
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  // a cold, dim studio: top platinum glow, deep black floor — matches §3.7.
  const top = new THREE.Mesh(
    new THREE.SphereGeometry(50, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x0d1014, side: THREE.BackSide }),
  );
  envScene.add(top);
  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshBasicMaterial({ color: 0xaab4c4 }),
  );
  light.position.set(0, 30, 0);
  light.rotation.x = Math.PI / 2;
  envScene.add(light);
  const env = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = env;
  pmrem.dispose();
  top.geometry.dispose();
  (top.material as THREE.Material).dispose();
  light.geometry.dispose();
  (light.material as THREE.Material).dispose();
  envScene.clear();
  return env;
}

/**
 * Mount the WebGPU renderer with TSL bloom post-processing.
 * Returns null if WebGPU init fails (caller falls back to WebGL).
 */
async function mountWebGPU(
  canvas: HTMLCanvasElement,
  handle: SceneHandle,
  getReduced: () => boolean,
): Promise<MountedScene | null> {
  try {
    const { WebGPURenderer, PostProcessing } = await import("three/webgpu");
    const { pass, mrt, output, emissive } = await import("three/tsl");
    const { bloom } = await import(
      "three/examples/jsm/tsl/display/BloomNode.js"
    );

    const renderer = new WebGPURenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    await renderer.init();

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // platinum env via the underlying WebGL PMREM path is unavailable on the
    // GPU renderer; the standard materials still read via the lights, and the
    // signal keyline carries emissive into bloom.
    const scenePass = pass(handle.scene, handle.camera);
    scenePass.setMRT(mrt({ output, emissive }));
    const outputPass = scenePass.getTextureNode("output");
    const emissivePass = scenePass.getTextureNode("emissive");
    // restrained, single platinum bloom over the signal keyline + specular.
    const bloomPass = bloom(emissivePass, 0.42, 0.9, 0.55);

    const post = new PostProcessing(renderer);
    post.outputNode = outputPass.add(bloomPass);

    let raf = 0;
    const start = performance.now();
    let last = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = (performance.now() - start) / 1000;
      // reduced-motion: render exactly one frame, then hold (no animation).
      if (getReduced()) {
        if (last === 0) {
          handle.update(0);
          post.renderAsync();
          last = 1;
        }
        return;
      }
      handle.update(now);
      post.renderAsync();
    };
    loop();

    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      handle.resize(w, h);
    };
    window.addEventListener("resize", onResize);

    return {
      kind: "webgpu",
      dispose: () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        handle.dispose();
      },
    };
  } catch {
    return null;
  }
}

/** WebGL2 fallback — identical scene, classic UnrealBloom-free render. */
function mountWebGL(
  canvas: HTMLCanvasElement,
  handle: SceneHandle,
  getReduced: () => boolean,
): MountedScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const env = attachPlatinumEnv(handle.scene, renderer);

  let raf = 0;
  const start = performance.now();
  let rendered = false;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const now = (performance.now() - start) / 1000;
    if (getReduced()) {
      if (!rendered) {
        handle.update(0);
        renderer.render(handle.scene, handle.camera);
        rendered = true;
      }
      return;
    }
    handle.update(now);
    renderer.render(handle.scene, handle.camera);
  };
  loop();

  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    handle.resize(w, h);
  };
  window.addEventListener("resize", onResize);

  return {
    kind: "webgl",
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      env.dispose();
      renderer.dispose();
      handle.dispose();
    },
  };
}

/**
 * Mount the hero scene with graceful degradation:
 *   WebGPU (TSL bloom)  →  WebGL2 (same scene)  →  (caller: static poster)
 */
export async function mountHero(
  canvas: HTMLCanvasElement,
  getReduced: () => boolean,
): Promise<MountedScene> {
  const handle = buildScene(canvas.clientWidth, canvas.clientHeight);

  if (hasWebGPU()) {
    const gpu = await mountWebGPU(canvas, handle, getReduced);
    if (gpu) return gpu;
  }
  return mountWebGL(canvas, handle, getReduced);
}
