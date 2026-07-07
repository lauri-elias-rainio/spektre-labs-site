/**
 * THE DESCENT — formation targets.
 *
 * Each formation is a Float32Array of xyz targets (COUNT × 3) describing one
 * bilaterally-symmetric monument. The engine (WebGPU compute or WebGL2 vertex
 * morph) springs every particle toward mix(A, B, blend) as the page scrolls,
 * so the whole homepage is one continuous descent through five stations:
 *
 *   0 MONOLITH      — the hero obelisk, swept 8-fold column
 *   1 OCTAD         — eight nodes on a ring (the arenas)
 *   2 CONSTELLATION — three concentric orbit shells (live systems)
 *   3 LATTICE       — the research grid plane
 *   4 SEAL          — the sigil: two rings, octad, central fixpoint (1 = 1)
 *
 * Symmetry by construction: every generator mirrors across the vertical axis —
 * particle i and its pair sample mirrored positions, so the flip-test passes
 * mathematically in every formation and every in-between blend.
 */

export const FORMATION_COUNT = 5;

const TAU = Math.PI * 2;

/** deterministic pseudo-random (mulberry32) — same field every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** write xyz, mirroring odd indices across the vertical (x = 0) axis. */
function put(out: Float32Array, i: number, x: number, y: number, z: number) {
  const mirrored = i % 2 === 1;
  out[i * 3 + 0] = mirrored ? -x : x;
  out[i * 3 + 1] = y;
  out[i * 3 + 2] = z;
}

/* 0 — THE MONOLITH: a tall octagonal column with a chamfered crown. */
function monolith(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rand = rng(101);
  for (let i = 0; i < count; i++) {
    const t = rand();
    const y = (t - 0.5) * 3.6;
    // octagonal cross-section, radius narrows toward the crown
    const crown = Math.max(0, (y - 1.1) / 0.7);
    const r = (0.34 + 0.05 * Math.sin(y * 2.2)) * (1 - crown * 0.85);
    const seg = Math.floor(rand() * 8);
    const a0 = (seg / 8) * TAU + TAU / 16;
    const along = (rand() - 0.5) * (TAU / 8) * 0.92;
    const a = a0 + along;
    const rr = r * (0.96 + rand() * 0.08);
    put(out, i, Math.cos(a) * rr, y, Math.sin(a) * rr);
  }
  return out;
}

/* 1 — THE OCTAD: eight dense nodes on a ring + hairline spokes. */
function octad(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rand = rng(202);
  const R = 1.35;
  for (let i = 0; i < count; i++) {
    const pick = rand();
    if (pick < 0.62) {
      // the eight nodes — gaussian clusters
      const n = Math.floor(rand() * 8);
      const a = (n / 8) * TAU;
      const g = () => (rand() + rand() + rand() - 1.5) * 0.11;
      put(out, i, Math.cos(a) * R + g(), g() * 0.8, Math.sin(a) * R + g());
    } else if (pick < 0.88) {
      // the ring itself
      const a = rand() * TAU;
      const rr = R + (rand() - 0.5) * 0.02;
      put(out, i, Math.cos(a) * rr, (rand() - 0.5) * 0.02, Math.sin(a) * rr);
    } else {
      // radial spokes to the center
      const n = Math.floor(rand() * 8);
      const a = (n / 8) * TAU;
      const d = rand() * R;
      put(out, i, Math.cos(a) * d, 0, Math.sin(a) * d);
    }
  }
  return out;
}

/* 2 — THE CONSTELLATION: three concentric orbital shells, equator-weighted. */
function constellation(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rand = rng(303);
  const shells = [0.55, 0.95, 1.4];
  for (let i = 0; i < count; i++) {
    const shell = shells[Math.floor(rand() * 3)];
    const a = rand() * TAU;
    // bias toward the equator: luxury saturn-band look
    const lat = (rand() - 0.5) * (rand() < 0.7 ? 0.35 : Math.PI * 0.8);
    const y = Math.sin(lat) * shell * 0.55;
    const r = Math.cos(lat) * shell;
    const jitter = 1 + (rand() - 0.5) * 0.03;
    put(out, i, Math.cos(a) * r * jitter, y, Math.sin(a) * r * jitter);
  }
  return out;
}

/* 3 — THE LATTICE: a hairline grid plane, tilted toward the camera. */
function lattice(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rand = rng(404);
  const N = 14; // grid lines per side
  const S = 1.8; // half-extent
  for (let i = 0; i < count; i++) {
    const alongX = rand() < 0.5;
    const line = Math.floor(rand() * (N + 1));
    const u = (line / N - 0.5) * 2 * S;
    const v = (rand() - 0.5) * 2 * S;
    const x = alongX ? v : u;
    const z = alongX ? u : v;
    // gentle symmetric bowl so the plane reads as material, not flat
    const y = -0.35 + (x * x + z * z) * 0.06 + (rand() - 0.5) * 0.008;
    put(out, i, x, y, z);
  }
  return out;
}

/* 4 — THE SEAL: outer ring, inner ring, octad nodes, the fixpoint, the axis. */
function seal(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rand = rng(505);
  for (let i = 0; i < count; i++) {
    const pick = rand();
    if (pick < 0.34) {
      const a = rand() * TAU; // outer ring
      put(out, i, Math.cos(a), Math.sin(a), (rand() - 0.5) * 0.015);
    } else if (pick < 0.6) {
      const a = rand() * TAU; // inner ring
      put(out, i, Math.cos(a) * 0.62, Math.sin(a) * 0.62, (rand() - 0.5) * 0.015);
    } else if (pick < 0.82) {
      const n = Math.floor(rand() * 8); // octad nodes
      const a = (n / 8) * TAU;
      const g = () => (rand() + rand() + rand() - 1.5) * 0.05;
      put(out, i, Math.cos(a) + g(), Math.sin(a) + g(), g());
    } else if (pick < 0.94) {
      // the central fixpoint — the only signal-colored zone
      const g = () => (rand() + rand() + rand() - 1.5) * 0.06;
      put(out, i, g(), g(), g());
    } else {
      // the bilateral axis line — declared = realized
      put(out, i, 0, (rand() - 0.5) * 2.3, (rand() - 0.5) * 0.01);
    }
  }
  return out;
}

export function buildFormations(count: number): Float32Array[] {
  return [monolith(count), octad(count), constellation(count), lattice(count), seal(count)];
}
