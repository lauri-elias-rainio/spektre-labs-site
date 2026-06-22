import * as THREE from "three";

/**
 * Spektre hero materials — the single platinum metal axis + obsidian black,
 * both PBR and environment-map driven, with a cold fresnel rim so the form
 * reads against OLED true-black.
 *
 * STYLE_LAW adherence:
 *  - One platinum metal axis (METAL_*) + obsidian black. No second hue.
 *  - One cold signal (#cfe3ff) reserved for the fresnel rim + emissive signal.
 *  - Material, never flat: real metalness/roughness, env reflection, specular
 *    fresnel — restraint over decoration.
 *  - No fake shit: these are physically-based MeshStandard/Physical materials,
 *    not faked gradients. The env map is what makes platinum read as metal.
 *
 * Renderer-agnostic: plain three.js materials, consumed by the WebGL2 path and
 * (where the standard pipeline applies) any GPU path. The fresnel rim is added
 * via onBeforeCompile so it composes with the standard PBR lighting instead of
 * replacing it.
 */

// --- the platinum axis, sampled at depth (from the design-system spine) ---
export const PLATINUM = {
  HI: 0xffffff,
  P1: 0xe8eaee,
  P2: 0xb9bdc6,
  P3: 0x888d97,
  P4: 0x55585f,
} as const;

/** Obsidian — the near-black structural mass. Reads as wet volcanic glass. */
export const OBSIDIAN = 0x05060a;

/** The single cold signal. Used ONLY for the rim + the keyline emissive. */
export const SIGNAL = 0xcfe3ff;

const SIGNAL_RGB = new THREE.Color(SIGNAL);

export interface MetalOptions {
  color?: number;
  metalness?: number;
  roughness?: number;
  envMapIntensity?: number;
  /** strength of the cold fresnel rim (0 disables). */
  rimStrength?: number;
  /** fresnel falloff exponent — higher = tighter rim. */
  rimPower?: number;
  /** rim color; defaults to the cold signal. */
  rimColor?: number;
}

/**
 * Inject a cold fresnel rim into a standard/physical material. The rim is added
 * to the lit fragment so it never flattens the PBR shading — it only catches the
 * silhouette edge, the way a single cold backlight would in a studio.
 */
function applyFresnelRim(
  mat: THREE.MeshStandardMaterial,
  strength: number,
  power: number,
  color: THREE.Color,
) {
  if (strength <= 0) return mat;
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRimColor = { value: color };
    shader.uniforms.uRimStrength = { value: strength };
    shader.uniforms.uRimPower = { value: power };

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform vec3 uRimColor;
         uniform float uRimStrength;
         uniform float uRimPower;`,
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
         // view-space fresnel: 1 at grazing angles, 0 facing camera.
         float rimFresnel = pow(
           1.0 - clamp(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0),
           uRimPower
         );
         gl_FragColor.rgb += uRimColor * rimFresnel * uRimStrength;`,
      );
  };
  // force recompile if the material is reused across renderers.
  mat.customProgramCacheKey = () =>
    `spektre-rim-${strength}-${power}-${color.getHexString()}`;
  return mat;
}

/**
 * Platinum: the only metal. envMapIntensity > 1 so the procedural studio env
 * carries the highlight; default rim is a faint cold edge.
 */
export function createPlatinumMaterial(
  opts: MetalOptions = {},
): THREE.MeshStandardMaterial {
  const {
    color = PLATINUM.P1,
    metalness = 1,
    roughness = 0.3,
    envMapIntensity = 1.15,
    rimStrength = 0.18,
    rimPower = 3.2,
    rimColor = SIGNAL,
  } = opts;

  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity,
  });
  return applyFresnelRim(
    mat,
    rimStrength,
    rimPower,
    new THREE.Color(rimColor),
  );
}

/**
 * Obsidian: deep black glass. Low roughness + clearcoat-like specular via a
 * physical material so the env map streaks across it; a slightly stronger cold
 * rim defines its edge against true-black (otherwise it vanishes).
 */
export function createObsidianMaterial(
  opts: MetalOptions = {},
): THREE.MeshPhysicalMaterial {
  const {
    color = OBSIDIAN,
    metalness = 0.2,
    roughness = 0.12,
    envMapIntensity = 0.9,
    rimStrength = 0.35,
    rimPower = 2.6,
    rimColor = SIGNAL,
  } = opts;

  const mat = new THREE.MeshPhysicalMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    reflectivity: 0.6,
  });
  // MeshPhysicalMaterial extends MeshStandardMaterial — rim injection applies.
  applyFresnelRim(
    mat as unknown as THREE.MeshStandardMaterial,
    rimStrength,
    rimPower,
    new THREE.Color(rimColor),
  );
  return mat;
}

/**
 * The signal emissive material — the one cold keyline ("declared = realized").
 * Pure emissive so it drives selective bloom; not metal, not lit.
 */
export function createSignalMaterial(
  emissiveIntensity = 1.6,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: SIGNAL,
    emissive: SIGNAL,
    emissiveIntensity,
    metalness: 0,
    roughness: 1,
    toneMapped: false, // let the keyline punch into bloom before tonemap.
  });
}

/** Exposed for callers that want to tint things in the one signal hue. */
export const signalColor = (): THREE.Color => SIGNAL_RGB.clone();
