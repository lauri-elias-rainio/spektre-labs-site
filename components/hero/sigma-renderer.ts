import * as THREE from "three";

import { buildSigmaScene, type SigmaHandle } from "./sigma-scene";

export type RendererKind = "webgpu" | "webgl";

export interface MountedSigma {
  kind: RendererKind;
  dispose: () => void;
}

/** Feature-detect WebGPU. Fallback to WebGL2 mandatory. */
export function hasWebGPU(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator;
}

/** Smoothed pointer in [-1,1], driven by the document; shared by both mounts. */
function makePointer() {
  const p = { x: 0, y: 0 };
  const onMove = (e: PointerEvent) => {
    p.x = (e.clientX / window.innerWidth) * 2 - 1;
    p.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onLeave = () => {
    p.x = 0;
    p.y = 0;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });
  return {
    p,
    dispose: () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    },
  };
}

/**
 * Procedural cold studio env → platinum reads as real metal + anisotropy is
 * visible, without shipping an external HDR asset (keeps palette monochrome).
 */
function attachPlatinumEnv(
  scene: SigmaHandle["scene"],
  renderer: THREE.WebGLRenderer,
): THREE.Texture {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(50, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x05070a, side: THREE.BackSide }),
  );
  envScene.add(shell);

  // a bright cold soft-box overhead (the dominant high source).
  const box = new THREE.Mesh(
    new THREE.PlaneGeometry(48, 48),
    new THREE.MeshBasicMaterial({ color: 0xc2ccdd }),
  );
  box.position.set(0, 34, 6);
  box.rotation.x = Math.PI / 2;
  envScene.add(box);

  // two dim cold side bars → the rim reflections that carve the silhouette.
  const barMat = new THREE.MeshBasicMaterial({ color: 0x35424f });
  const barL = new THREE.Mesh(new THREE.PlaneGeometry(8, 40), barMat);
  barL.position.set(-34, 0, -8);
  barL.rotation.y = Math.PI / 2;
  envScene.add(barL);
  const barR = barL.clone();
  barR.position.set(34, 0, -8);
  barR.rotation.y = -Math.PI / 2;
  envScene.add(barR);

  const env = pmrem.fromScene(envScene, 0.03).texture;
  scene.environment = env;

  pmrem.dispose();
  shell.geometry.dispose();
  (shell.material as THREE.Material).dispose();
  box.geometry.dispose();
  (box.material as THREE.Material).dispose();
  barL.geometry.dispose();
  barR.geometry.dispose();
  barMat.dispose();
  envScene.clear();
  return env;
}

/** WebGPU mount with TSL bloom over the single signal core. null on failure. */
async function mountWebGPU(
  canvas: HTMLCanvasElement,
  handle: SigmaHandle,
  pointer: { x: number; y: number },
  getReduced: () => boolean,
): Promise<MountedSigma | null> {
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

    const scenePass = pass(handle.scene, handle.camera);
    scenePass.setMRT(mrt({ output, emissive }));
    const outputPass = scenePass.getTextureNode("output");
    const emissivePass = scenePass.getTextureNode("emissive");
    // restrained platinum/signal bloom — strength, radius, threshold.
    const bloomPass = bloom(emissivePass, 0.5, 0.85, 0.6);

    const post = new PostProcessing(renderer);
    post.outputNode = outputPass.add(bloomPass);

    let raf = 0;
    const start = performance.now();
    let rendered = false;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = (performance.now() - start) / 1000;
      if (getReduced()) {
        if (!rendered) {
          handle.update(0, { x: 0, y: 0 });
          post.renderAsync();
          rendered = true;
        }
        return;
      }
      handle.update(now, pointer);
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

/** WebGL2 fallback — identical scene, ACES tonemap, PMREM platinum env. */
function mountWebGL(
  canvas: HTMLCanvasElement,
  handle: SigmaHandle,
  pointer: { x: number; y: number },
  getReduced: () => boolean,
): MountedSigma {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

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
        handle.update(0, { x: 0, y: 0 });
        renderer.render(handle.scene, handle.camera);
        rendered = true;
      }
      return;
    }
    handle.update(now, pointer);
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
 * Mount the Σ hero with graceful degradation:
 *   WebGPU (TSL bloom)  →  WebGL2 (same scene)  →  (caller: static poster)
 */
export async function mountSigma(
  canvas: HTMLCanvasElement,
  getReduced: () => boolean,
): Promise<MountedSigma> {
  const handle = buildSigmaScene(canvas.clientWidth, canvas.clientHeight);
  const { p: pointer, dispose: disposePointer } = makePointer();

  const wrap = (m: MountedSigma): MountedSigma => ({
    kind: m.kind,
    dispose: () => {
      disposePointer();
      m.dispose();
    },
  });

  if (hasWebGPU()) {
    const gpu = await mountWebGPU(canvas, handle, pointer, getReduced);
    if (gpu) return wrap(gpu);
  }
  return wrap(mountWebGL(canvas, handle, pointer, getReduced));
}
