import * as THREE from "three";

/**
 * The Spektre Σ centerpiece — a genuinely volumetric Atlantean sigma form.
 * Renderer-agnostic scene graph (consumed by both WebGPU + WebGL2 mounts so
 * declared = realized across paths).
 *
 * WHY this replaces the old flat seal:
 *  - The previous mark lived entirely in the Z=0 plane (rings + box bars): a
 *    2D wheel, no volume, no depth, no parallax, no anisotropy. It read as a
 *    logo, not a sculpted object.
 *  - This is a turned/lathed solid: a beveled sigma core inside concentric
 *    tilted toroidal frames, with real depth, anisotropic platinum, dual rim
 *    light, and a single cold-signal core. A sculpture that catches light.
 *
 * STYLE_LAW adherence:
 *  - OLED true-black (#000000). One platinum metal axis. ONE cold signal (#cfe3ff).
 *  - Perfect bilateral + N-fold radial symmetry (the octad) — 1 = 1 rendered.
 *  - Material, never flat: anisotropy, hairline bevels, specular fixpoint, depth.
 *  - Slow, monumental, deterministic motion; restraint over decoration.
 */

const METAL_HI = 0xf4f6fa;
const METAL_1 = 0xdfe3ea;
const METAL_2 = 0xb4b9c3;
const METAL_3 = 0x7d828c;
const SIGNAL = 0xcfe3ff;

const OCTAD = 8; // Atlantean octad — 8-fold radial symmetry.

export interface SigmaHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** the whole rotating sculpture — the only thing that moves. */
  sigma: THREE.Group;
  /** parent that absorbs pointer parallax (camera rig). */
  rig: THREE.Group;
  /** the single cold-signal core material (pulses with live state). */
  signalMat: THREE.MeshStandardMaterial;
  resize: (width: number, height: number) => void;
  /** advance deterministic animation; t in seconds since mount. */
  update: (t: number, pointer: { x: number; y: number }) => void;
  dispose: () => void;
}

/** Anisotropic brushed platinum — metal=1, low roughness, directional grain. */
function platinum(
  color: number,
  roughness = 0.22,
  anisotropy = 0.9,
): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    color,
    metalness: 1,
    roughness,
    envMapIntensity: 1.35,
  });
  // three r0.180 MeshStandardMaterial supports anisotropy (KHR_materials_anisotropy).
  // Typed loosely to stay compatible across @types/three minor drift.
  const anyMat = m as unknown as {
    anisotropy?: number;
    anisotropyRotation?: number;
  };
  anyMat.anisotropy = anisotropy;
  anyMat.anisotropyRotation = Math.PI / 2; // grain follows the turned profile.
  return m;
}

/**
 * Build the lathe profile of the sigma core: a turned solid whose silhouette
 * is a refined Σ-suggestive double-flare — wide chamfered shoulders tapering to
 * a slim waist, perfectly symmetric top/bottom (bilateral by construction).
 */
function sigmaCoreGeometry(): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  // half-profile (radius vs height), mirrored implicitly by the lathe sweep.
  // height runs -1 .. +1; profile is symmetric about y=0 → bilateral 1=1.
  const samples = 64;
  for (let i = 0; i <= samples; i++) {
    const y = (i / samples) * 2 - 1; // -1..1
    // double-flared waist: cosine shoulders + a tight central neck.
    const shoulder = Math.pow(Math.abs(y), 1.6); // 0 at center, 1 at poles
    const flare = 0.18 + 0.62 * shoulder; // slim waist → wide shoulders
    const bevel = 0.04 * Math.cos(y * Math.PI * 6); // fine turned hairlines
    const r = Math.max(0.02, flare + bevel);
    pts.push(new THREE.Vector2(r, y));
  }
  const geo = new THREE.LatheGeometry(pts, 256);
  geo.computeVertexNormals();
  return geo;
}

export function buildSigmaScene(width: number, height: number): SigmaHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // OLED true-black, always.

  // --- camera rig (parallax target) → camera ---
  const rig = new THREE.Group();
  scene.add(rig);
  const camera = new THREE.PerspectiveCamera(
    30,
    width / Math.max(1, height),
    0.1,
    100,
  );
  camera.position.set(0, 0, 7.6);
  rig.add(camera);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T): T => {
    disposables.push(o);
    return o;
  };

  // --- the sculpture group ---
  const sigma = new THREE.Group();
  sigma.rotation.x = -0.18; // a slight monumental downward tilt, into depth.
  scene.add(sigma);

  // 1. The sigma core — turned platinum solid (the volumetric centerpiece).
  const coreGeo = track(sigmaCoreGeometry());
  const coreMat = track(platinum(METAL_1, 0.18, 0.95));
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.scale.set(1.35, 1.55, 1.35);
  sigma.add(core);

  // 2. A polished inner sleeve (slightly inset, darker platinum) → depth read.
  const sleeveGeo = track(sigmaCoreGeometry());
  const sleeveMat = track(platinum(METAL_3, 0.32, 0.6));
  const sleeve = new THREE.Mesh(sleeveGeo, sleeveMat);
  sleeve.scale.set(1.18, 1.42, 1.18);
  sigma.add(sleeve);

  // 3. Concentric beveled frames — toroidal rings tilted into depth, the
  //    Atlantean containment frames. Bilateral + radial symmetric by build.
  const frameRadii = [2.55, 2.18];
  const frameTilt = [0.42, -0.42];
  for (let f = 0; f < frameRadii.length; f++) {
    const geo = track(new THREE.TorusGeometry(frameRadii[f], 0.028, 24, 320));
    const ring = new THREE.Mesh(geo, track(platinum(METAL_2, 0.24, 0.92)));
    ring.rotation.x = Math.PI / 2 + frameTilt[f];
    sigma.add(ring);
  }

  // 4. The octad nodes — beveled platinum facets at each octad vertex on the
  //    outer frame; instanced. Octahedron facets catch sharp speculars.
  const nodeGeo = track(new THREE.OctahedronGeometry(0.075, 0));
  const nodeMat = track(platinum(METAL_HI, 0.12, 0.4));
  const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, OCTAD);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < OCTAD; i++) {
    const a = (i / OCTAD) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 2.55, 0, Math.sin(a) * 2.55);
    dummy.rotation.set(0, -a, 0);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  }
  nodes.instanceMatrix.needsUpdate = true;
  sigma.add(nodes);

  // 5. The fixpoint core — the single cold SIGNAL element. A small emissive
  //    sphere at dead center; the only non-platinum thing in the entire view.
  const signalGeo = track(new THREE.SphereGeometry(0.16, 48, 48));
  const signalMat = track(
    new THREE.MeshStandardMaterial({
      color: SIGNAL,
      emissive: SIGNAL,
      emissiveIntensity: 2.2,
      metalness: 0,
      roughness: 0.35,
    }),
  );
  const fixpoint = new THREE.Mesh(signalGeo, signalMat);
  sigma.add(fixpoint);

  // --- lighting: one dominant key + dual cold rim + volumetric fill ---
  const keyLight = new THREE.DirectionalLight(0xf2f5fb, 3.1);
  keyLight.position.set(2.5, 6, 5);
  scene.add(keyLight);

  // dual rim, cold, to carve the platinum silhouette out of true-black.
  const rimL = new THREE.DirectionalLight(0x86a8ff, 1.1);
  rimL.position.set(-6, 1, -3);
  scene.add(rimL);
  const rimR = new THREE.DirectionalLight(0x9fc0ff, 0.7);
  rimR.position.set(6, -2, -4);
  scene.add(rimR);

  // a tiny point light co-located with the signal core → it appears to glow.
  const coreGlow = new THREE.PointLight(SIGNAL, 1.4, 6, 2);
  coreGlow.position.set(0, 0, 0);
  sigma.add(coreGlow);

  const ambient = new THREE.AmbientLight(0x10131a, 1);
  scene.add(ambient);

  function resize(w: number, h: number) {
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  // smoothed pointer parallax state.
  let px = 0;
  let py = 0;

  function update(t: number, pointer: { x: number; y: number }) {
    // slow hypnotic dual-axis rotation about the vertical spine, with a
    // gentle nod — symmetry preserved every frame (the form is its own mirror).
    sigma.rotation.y = t * 0.14;
    sigma.rotation.x = -0.18 + Math.sin(t * 0.22) * 0.05;

    // parallax: ease the rig toward the pointer (Apple-grade restraint).
    px += (pointer.x - px) * 0.05;
    py += (pointer.y - py) * 0.05;
    rig.rotation.y = px * 0.12;
    rig.rotation.x = -py * 0.1;

    // near-imperceptible breathing of the single signal core (live state).
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.7);
    signalMat.emissiveIntensity = 1.7 + pulse * 0.9;
    coreGlow.intensity = 1.1 + pulse * 0.6;
  }

  function dispose() {
    for (const d of disposables) d.dispose();
  }

  return { scene, camera, sigma, rig, signalMat, resize, update, dispose };
}
