import * as THREE from "three";

/**
 * The cinematic post-processing layer for the hero — built on three's
 * EffectComposer (matching the installed three@0.180 addons).
 *
 * Chain (in order):
 *   RenderPass  → the scene
 *   UnrealBloom → selective platinum/signal bloom (only bright/emissive pixels)
 *   Bokeh (DoF) → shallow depth-of-field, the seal in focus, edges soft
 *   Film        → subtle film grain (no scanlines — luxury, not retro)
 *   Vignette    → cold OLED edge falloff into true-black
 *   Output      → ACES filmic tonemapping + sRGB (the final, color-correct pass)
 *
 * Performance / σ-honesty:
 *   - pixelRatio clamped <= 2 (high-DPR clamp) — set on the renderer by caller,
 *     and the composer is sized to match.
 *   - bloom resolution is half-res so it stays cheap at 60fps.
 *   - DoF can be disabled (mobile / low-end) without touching the rest.
 *
 * GRACEFUL DEGRADATION (the contract): if the postprocessing addons cannot be
 * imported for ANY reason (pruned bundle, CDN miss, future three reshuffle),
 * `createCinematicComposer` returns a NO-OP pass that simply renders the scene
 * directly to the screen with ACES tonemapping on the renderer. The hero never
 * goes blank and never throws — declared = realized.
 */

const MAX_DPR = 2;

export interface CinematicOptions {
  /** selective bloom strength over emissive/specular highlights. */
  bloomStrength?: number;
  bloomRadius?: number;
  /** luminance threshold — only platinum highlights + the signal bloom. */
  bloomThreshold?: number;
  /** enable shallow depth-of-field (the seal in focus). */
  depthOfField?: boolean;
  /** focus distance (world units) for DoF. */
  dofFocus?: number;
  dofAperture?: number;
  dofMaxBlur?: number;
  /** film-grain intensity (0..1). subtle by law — keep low. */
  grain?: number;
  /** vignette darkness at the edges. */
  vignette?: number;
}

const DEFAULTS: Required<CinematicOptions> = {
  bloomStrength: 0.42,
  bloomRadius: 0.9,
  bloomThreshold: 0.62,
  depthOfField: true,
  dofFocus: 7.2, // camera sits at z=7.2 looking at origin.
  dofAperture: 0.00018,
  dofMaxBlur: 0.006,
  grain: 0.045,
  vignette: 1.05,
};

/** What every cinematic pipeline (real or no-op) must expose to the caller. */
export interface CinematicPipeline {
  /** "composer" when post-processing is active, "passthrough" when degraded. */
  kind: "composer" | "passthrough";
  /** render one frame. */
  render: (deltaSeconds: number) => void;
  /** resize the pipeline; pass the renderer's clamped pixel ratio. */
  setSize: (width: number, height: number, pixelRatio: number) => void;
  dispose: () => void;
}

function clampDpr(dpr: number): number {
  return Math.min(Math.max(dpr || 1, 1), MAX_DPR);
}

/**
 * The NO-OP / passthrough pipeline. Renders the scene straight to the canvas
 * with ACES tonemapping on the renderer itself. This is the export that keeps
 * the hero alive when the postprocessing package/addons are absent.
 */
export function createPassthroughPipeline(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
): CinematicPipeline {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  return {
    kind: "passthrough",
    render: () => renderer.render(scene, camera),
    setSize: (w, h, dpr) => {
      renderer.setPixelRatio(clampDpr(dpr));
      renderer.setSize(w, h, false);
    },
    dispose: () => {},
  };
}

/**
 * Build the full cinematic EffectComposer. Async because the postprocessing
 * passes are dynamically imported so a missing/pruned addon degrades to the
 * passthrough pipeline instead of crashing the bundle.
 */
export async function createCinematicComposer(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number,
  opts: CinematicOptions = {},
): Promise<CinematicPipeline> {
  const o = { ...DEFAULTS, ...opts };

  try {
    const [
      { EffectComposer },
      { RenderPass },
      { UnrealBloomPass },
      { BokehPass },
      { FilmPass },
      { ShaderPass },
      { OutputPass },
      { VignetteShader },
    ] = await Promise.all([
      import("three/addons/postprocessing/EffectComposer.js"),
      import("three/addons/postprocessing/RenderPass.js"),
      import("three/addons/postprocessing/UnrealBloomPass.js"),
      import("three/addons/postprocessing/BokehPass.js"),
      import("three/addons/postprocessing/FilmPass.js"),
      import("three/addons/postprocessing/ShaderPass.js"),
      import("three/addons/postprocessing/OutputPass.js"),
      import("three/addons/shaders/VignetteShader.js"),
    ]);

    // tonemapping happens in OutputPass — keep the renderer linear so the
    // composer chain isn't double-tonemapped.
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const dpr = clampDpr(renderer.getPixelRatio());

    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(dpr);
    composer.setSize(width, height);

    composer.addPass(new RenderPass(scene, camera));

    // 1. Selective bloom — threshold gates it to platinum highlights + signal.
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      o.bloomStrength,
      o.bloomRadius,
      o.bloomThreshold,
    );
    composer.addPass(bloom);

    // 2. Depth of field — shallow, the seal in focus.
    let bokeh: InstanceType<typeof BokehPass> | null = null;
    if (o.depthOfField) {
      bokeh = new BokehPass(scene, camera, {
        focus: o.dofFocus,
        aperture: o.dofAperture,
        maxblur: o.dofMaxBlur,
      });
      composer.addPass(bokeh);
    }

    // 3. Film grain — subtle, no scanlines (count=0 disables lines in 0.180).
    //    FilmPass(intensity, grayscale) — keep grayscale on, palette is mono.
    const film = new FilmPass(o.grain, false);
    composer.addPass(film);

    // 4. Vignette — cold OLED edge falloff.
    const vignette = new ShaderPass(VignetteShader);
    vignette.uniforms.offset.value = 0.95;
    vignette.uniforms.darkness.value = o.vignette;
    composer.addPass(vignette);

    // 5. Output — ACES filmic tonemapping + sRGB conversion. Always last.
    const output = new OutputPass();
    // OutputPass reads renderer.toneMapping; set it to ACES so this pass applies it.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    composer.addPass(output);

    return {
      kind: "composer",
      render: (delta) => composer.render(delta),
      setSize: (w, h, ratio) => {
        const r = clampDpr(ratio);
        renderer.setPixelRatio(r);
        renderer.setSize(w, h, false);
        composer.setPixelRatio(r);
        composer.setSize(w, h);
        bloom.setSize(w, h);
        if (bokeh) bokeh.setSize(w, h);
      },
      dispose: () => {
        composer.dispose();
        bloom.dispose();
        // BokehPass/FilmPass/ShaderPass own no GPU resources beyond the
        // composer's render targets, which composer.dispose() releases.
      },
    };
  } catch {
    // postprocessing addons unavailable → graceful no-op passthrough.
    return createPassthroughPipeline(renderer, scene, camera);
  }
}
