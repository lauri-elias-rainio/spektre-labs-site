import * as THREE from "three";

import {
  createCinematicComposer,
  type CinematicPipeline,
} from "../hero/effects";
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

/**
 * WebGL2 fallback — identical scene, now driven through the cinematic
 * post-processing layer (selective bloom · DoF · film grain · vignette · ACES).
 * If the postprocessing addons are absent the pipeline degrades to a no-op
 * passthrough (still ACES-tonemapped) — never blank, never throws.
 *
 * Performance: pixelRatio clamped <= 2; the RAF loop pauses on tab-blur
 * (document hidden) and resumes on focus — no compute while unseen.
 */
async function mountWebGL(
  canvas: HTMLCanvasElement,
  handle: SceneHandle,
  getReduced: () => boolean,
): Promise<MountedScene> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // high-DPR clamp — caps fill cost on retina/4K so we hold 60fps.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const env = attachPlatinumEnv(handle.scene, renderer);

  // the cinematic layer (separate module; graceful no-op if addons missing).
  const pipeline: CinematicPipeline = await createCinematicComposer(
    renderer,
    handle.scene,
    handle.camera,
    canvas.clientWidth,
    canvas.clientHeight,
  );

  const clock = new THREE.Clock();
  let raf = 0;
  let rendered = false;
  let paused = false;

  const renderFrame = (delta: number) => pipeline.render(delta);

  const loop = () => {
    raf = requestAnimationFrame(loop);
    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;
    if (getReduced()) {
      // reduced-motion: render exactly one still frame, then hold.
      if (!rendered) {
        handle.update(0);
        renderFrame(0);
        rendered = true;
      }
      return;
    }
    handle.update(elapsed);
    renderFrame(delta);
  };
  loop();

  // pause on tab-blur — no animation/compute while the page is hidden.
  const onVisibility = () => {
    const hidden = document.hidden;
    if (hidden && !paused) {
      paused = true;
      cancelAnimationFrame(raf);
      clock.stop();
    } else if (!hidden && paused) {
      paused = false;
      clock.start();
      loop();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    handle.resize(w, h);
    pipeline.setSize(w, h, window.devicePixelRatio || 1);
  };
  window.addEventListener("resize", onResize);

  return {
    kind: "webgl",
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      pipeline.dispose();
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
  return await mountWebGL(canvas, handle, getReduced);
}
