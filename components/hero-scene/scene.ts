import * as THREE from "three";

/**
 * The Spektre 1 = 1 seal scene — renderer-agnostic.
 *
 * STYLE_LAW adherence:
 *  - OLED true-black background (#000000), no second hue.
 *  - Single platinum metal axis (--metal-1..4) as the only material.
 *  - One cold signal keyline (#cfe3ff) marking declared = realized.
 *  - PERFECT bilateral + 8-fold radial symmetry (the octad) — 1 = 1 rendered.
 *  - Single dominant high light source (matches the ambient glow from the spine).
 *  - Slow, monumental, deterministic motion; restraint over decoration.
 *
 * The same scene graph is consumed by the WebGPU renderer and the WebGL2
 * fallback so the form is identical across both — declared = realized.
 */

// Platinum axis sampled at five depths (from the design system spine).
const METAL_HI = 0xffffff;
const METAL_1 = 0xe8eaee;
const METAL_2 = 0xb9bdc6;
const METAL_3 = 0x888d97;
const SIGNAL = 0xcfe3ff;

const OCTAD = 8; // the Atlantean octad — 8-fold radial symmetry.

export interface SceneHandle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** the single rotating seal group — the only thing that moves. */
  seal: THREE.Group;
  signalKeyline: THREE.Mesh;
  resize: (width: number, height: number) => void;
  /** advance the deterministic animation; t is seconds since mount. */
  update: (t: number) => void;
  dispose: () => void;
}

function platinum(color: number, metalness = 1, roughness = 0.34) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness,
    envMapIntensity: 1.1,
  });
}

export function buildScene(width: number, height: number): SceneHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000); // OLED true-black, always.

  const camera = new THREE.PerspectiveCamera(
    34,
    width / Math.max(1, height),
    0.1,
    100,
  );
  camera.position.set(0, 0, 7.2);
  camera.lookAt(0, 0, 0);

  // --- the seal group (bilaterally + radially symmetric) ---
  const seal = new THREE.Group();
  scene.add(seal);

  const disposables: { dispose: () => void }[] = [];
  const track = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  // 1. Base ring — the containment circle of the octad.
  const baseRingGeo = track(new THREE.TorusGeometry(2.35, 0.012, 16, 256));
  const baseRingMat = track(platinum(METAL_2, 1, 0.3));
  const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
  seal.add(baseRing);

  const innerRingGeo = track(new THREE.TorusGeometry(1.62, 0.009, 16, 256));
  const innerRing = new THREE.Mesh(innerRingGeo, track(platinum(METAL_3, 1, 0.4)));
  seal.add(innerRing);

  // 2. The octad filigree — 8 mirrored spokes (instanced for 60fps).
  //    Each spoke is a thin platinum bar from center outward; the set is
  //    invariant under rotation by 360/8 AND under horizontal mirror.
  const spokeGeo = track(new THREE.BoxGeometry(0.016, 1.95, 0.016));
  const spokeMat = track(platinum(METAL_1, 1, 0.28));
  const spokes = new THREE.InstancedMesh(spokeGeo, spokeMat, OCTAD);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < OCTAD; i++) {
    const a = (i / OCTAD) * Math.PI * 2;
    dummy.position.set(Math.sin(a) * 0.98, Math.cos(a) * 0.98, 0);
    dummy.rotation.set(0, 0, -a);
    dummy.updateMatrix();
    spokes.setMatrixAt(i, dummy.matrix);
  }
  spokes.instanceMatrix.needsUpdate = true;
  seal.add(spokes);

  // 3. Vesica nodes — small platinum spheres at each octad vertex (the
  //    filigree intersections). Radially symmetric by construction.
  const nodeGeo = track(new THREE.SphereGeometry(0.05, 24, 24));
  const nodeMat = track(platinum(METAL_HI, 1, 0.18));
  const nodes = new THREE.InstancedMesh(nodeGeo, nodeMat, OCTAD);
  for (let i = 0; i < OCTAD; i++) {
    const a = (i / OCTAD) * Math.PI * 2;
    dummy.position.set(Math.sin(a) * 2.0, Math.cos(a) * 2.0, 0);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    nodes.setMatrixAt(i, dummy.matrix);
  }
  nodes.instanceMatrix.needsUpdate = true;
  seal.add(nodes);

  // 4. The central bilateral axis — the vertical spine (the 1 = 1 line),
  //    rendered in the single cold signal. This is the "declared = realized"
  //    keyline; exactly one signal element in the view.
  const keylineGeo = track(new THREE.BoxGeometry(0.018, 3.0, 0.018));
  const keylineMat = track(
    new THREE.MeshStandardMaterial({
      color: SIGNAL,
      emissive: SIGNAL,
      emissiveIntensity: 1.6,
      metalness: 0,
      roughness: 1,
    }),
  );
  const signalKeyline = new THREE.Mesh(keylineGeo, keylineMat);
  seal.add(signalKeyline);

  // 5. The fixpoint — a single specular node at the exact center.
  const centerGeo = track(new THREE.SphereGeometry(0.085, 32, 32));
  const center = new THREE.Mesh(centerGeo, track(platinum(METAL_HI, 1, 0.12)));
  seal.add(center);

  // --- lighting: one dominant high source (the spine's single light axis) ---
  const keyLight = new THREE.DirectionalLight(0xeef2f8, 2.6);
  keyLight.position.set(0, 6, 4);
  scene.add(keyLight);

  // a faint cold rim to read the platinum against true-black.
  const rim = new THREE.DirectionalLight(0x96beff, 0.5);
  rim.position.set(-3, -2, -4);
  scene.add(rim);

  const ambient = new THREE.AmbientLight(0x1a1d22, 1);
  scene.add(ambient);

  function resize(w: number, h: number) {
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  function update(t: number) {
    // slow, monumental rotation about the single vertical axis only.
    // bilateral symmetry is preserved at every frame: rotating the whole
    // octad keeps it mirror-identical (the mark is its own reflection).
    seal.rotation.y = t * 0.12;
    // a near-imperceptible breathing of the signal keyline (live state).
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
    keylineMat.emissiveIntensity = 1.2 + pulse * 0.7;
  }

  function dispose() {
    for (const d of disposables) d.dispose();
  }

  return { scene, camera, seal, signalKeyline, resize, update, dispose };
}
