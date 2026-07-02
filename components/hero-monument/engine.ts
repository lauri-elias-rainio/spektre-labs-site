/// <reference types="@webgpu/types" />
/**
 * THE MONUMENT — the home hero engine. Raw WebGPU, zero dependencies.
 *
 * One signed-distance field, two manifestations:
 *   · a fullscreen-raymarched platinum obelisk (fresnel metal, studio env
 *     strip, eight emissive signal slits — the octad — edge bloom, filmic
 *     grade), and
 *   · a compute-simulated particle atmosphere (65,536 particles × mirror)
 *     that condenses onto the SAME field — the law the light obeys is the
 *     law the matter obeys. 1 = 1 across passes.
 *
 * Perfect symmetry by construction: the obelisk is 8-fold domain-folded,
 * the particles render with their mirrors. Cheap per-vertex occlusion keeps
 * the atmosphere behind the monument from glowing through it.
 *
 * Caller falls back to the three.js obelisk (SignalWebGPU) → CSS monolith.
 */

export interface MonumentHandle {
  kind: "webgpu-monument";
  dispose: () => void;
}

export interface MonumentOptions {
  getActive: () => boolean;
}

/* ── shared WGSL ─────────────────────────────────────────────────── */

const UNIFORM_WGSL = /* wgsl */ `
struct U {
  viewProj : mat4x4f,
  camRo    : vec4f, // ro.xyz, time
  camRight : vec4f, // right.xyz, aspect
  camUp    : vec4f, // up.xyz, size scale
  camFwd   : vec4f, // fwd.xyz, dt
  pointer  : vec4f, // world x, y, strength, focal
  misc     : vec4f, // law, entropy, count (f32), exposure
}
@group(0) @binding(0) var<uniform> u : U;
`;

const OBELISK_WGSL = /* wgsl */ `
const TAU : f32 = 6.28318530718;
const PI8 : f32 = 0.39269908169;   // π/8

fn fmod(a : f32, b : f32) -> f32 { return a - floor(a / b) * b; }

/** 8-fold radial fold about Y — symmetry is guaranteed in the math. */
fn foldOct(p : vec3f) -> vec3f {
  let a = fmod(atan2(p.z, p.x), 2.0 * PI8) - PI8;
  let r = length(p.xz);
  return vec3f(cos(a) * r, p.y, sin(a) * r);
}

fn sdOcta(p : vec3f, s : f32) -> f32 {
  let q = abs(p);
  return (q.x + q.y + q.z - s) * 0.57735027;
}

fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/** the monument: tapered octagonal spire + crown/base octahedra + fluting. */
fn obeliskSDF(p : vec3f) -> f32 {
  let q = foldOct(p);
  // tapered face: half-width shrinks with height
  let w = 0.50 - 0.068 * q.y;
  var d = q.x - w;
  // machined vertical fluting on the shaft (fine, symmetric)
  d += 0.0028 * sin(q.y * 16.0);
  // body slab
  let dy = abs(p.y - 0.05) - 2.30;
  d = max(d, dy);
  // crown + base octahedra — the sealed monumental object
  d = smin(d, sdOcta(p - vec3f(0.0, 2.62, 0.0), 0.52), 0.14);
  d = smin(d, sdOcta(p + vec3f(0.0, 2.55, 0.0), 0.62), 0.14);
  // one equatorial machined ring groove
  let ring = max(abs(p.y - 0.62) - 0.028, q.x - (w + 0.012));
  d = min(d, ring);
  return d;
}

/** the eight signal slits — emissive strips on each folded face center. */
fn slitGlow(p : vec3f) -> f32 {
  let q = foldOct(p);
  let w = 0.50 - 0.068 * q.y;
  let onFace = smoothstep(0.10, 0.0, abs(q.x - w));
  let center = smoothstep(0.030, 0.004, abs(q.z));
  let band = smoothstep(2.05, 1.85, abs(q.y - 0.05));
  return onFace * center * band;
}
`;

/* ── raymarch pass ───────────────────────────────────────────────── */

const RAYMARCH_WGSL = /* wgsl */ `
${UNIFORM_WGSL}
${OBELISK_WGSL}

struct VSOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f }

@vertex
fn vs(@builtin(vertex_index) vi : u32) -> VSOut {
  var out : VSOut;
  let p = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  out.pos = vec4f(p * 2.0 - 1.0, 0.0, 1.0);
  out.uv = p * 2.0 - 1.0;
  return out;
}

fn calcNormal(p : vec3f) -> vec3f {
  let e = 0.0018;
  return normalize(vec3f(
    obeliskSDF(p + vec3f(e,0.0,0.0)) - obeliskSDF(p - vec3f(e,0.0,0.0)),
    obeliskSDF(p + vec3f(0.0,e,0.0)) - obeliskSDF(p - vec3f(0.0,e,0.0)),
    obeliskSDF(p + vec3f(0.0,0.0,e)) - obeliskSDF(p - vec3f(0.0,0.0,e)),
  ));
}

/** OLED studio env: void gradient + ONE platinum strip + faint cold band. */
fn env(rd : vec3f) -> vec3f {
  let t = clamp(rd.y * 0.5 + 0.5, 0.0, 1.0);
  var c = mix(vec3f(0.010,0.011,0.016), vec3f(0.028,0.031,0.042), t);
  let strip = smoothstep(0.18, 0.0, abs(rd.y - 0.60)) * smoothstep(0.75, 0.0, abs(rd.x));
  c += vec3f(0.95,0.96,1.0) * strip * 1.30;
  let sig = smoothstep(0.10, 0.0, abs(rd.y + 0.34)) * smoothstep(0.9, 0.0, abs(rd.x + 0.5));
  c += vec3f(0.51,0.69,1.0) * sig * 0.28;
  return c;
}

fn hash(p : vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 456.21));
  q += dot(q, q + 45.32);
  return fract(q.x * q.y);
}

@fragment
fn fs(in : VSOut) -> @location(0) vec4f {
  let t = u.camRo.w;
  let aspect = u.camRight.w;
  let focal = u.pointer.w;
  let ro = u.camRo.xyz;
  let rd = normalize(u.camFwd.xyz * focal
                   + u.camRight.xyz * in.uv.x * aspect
                   + u.camUp.xyz * in.uv.y);

  var tt = 0.0;
  var glow = 0.0;
  var hit = false;
  var p = ro;
  for (var i = 0; i < 90; i++) {
    p = ro + rd * tt;
    let d = obeliskSDF(p);
    glow += 0.010 / (0.010 + d * d * 16.0);
    if (d < 0.0012) { hit = true; break; }
    if (tt > 18.0) { break; }
    tt += d * 0.88;
  }

  var col = vec3f(0.0);
  if (hit) {
    let n = calcNormal(p);
    let v = -rd;
    let keyDir = normalize(vec3f(0.45, 0.85, 0.55));
    let fres = pow(1.0 - max(dot(n, v), 0.0), 4.2);
    let diff = max(dot(n, keyDir), 0.0);
    let spec = pow(max(dot(reflect(-keyDir, n), v), 0.0), 90.0);
    col  = vec3f(0.78, 0.80, 0.86) * (0.045 + diff * 0.20);
    col += env(reflect(rd, n)) * (0.16 + fres * 1.9);
    col += vec3f(1.0, 1.0, 1.05) * spec * 1.6;
    // cold rim carves the silhouette from the void
    col += vec3f(0.51, 0.69, 1.0) * pow(1.0 - max(dot(n, v), 0.0), 2.4) * 0.30;
    // the octad signal slits — the ONE cold accent, breathing
    let breathe = 0.75 + 0.25 * sin(t * 0.6);
    col += vec3f(0.62, 0.78, 1.0) * slitGlow(p) * 1.5 * breathe;
    // brushed vertical grain
    col *= 0.95 + 0.05 * sin(p.y * 130.0);
    col *= mix(1.0, 0.6, clamp((tt - 6.0) / 8.0, 0.0, 1.0));
  }

  // edge bloom + sub-pixel dispersion
  col += vec3f(0.78, 0.83, 0.95) * glow * 0.14;
  col.r += glow * 0.011;
  col.b -= glow * 0.009;

  // grade: vignette · filmic · grain
  let vig = smoothstep(1.5, 0.3, length(in.uv * vec2f(aspect, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col = col / (col + vec3f(0.85));
  col = pow(col, vec3f(0.92));
  col += (hash(in.pos.xy + fract(t) * vec2f(91.7, 47.3)) - 0.5) * 0.032;

  return vec4f(max(col, vec3f(0.0)), 1.0);
}
`;

/* ── compute pass — the atmosphere obeys the same field ─────────── */

const COMPUTE_WGSL = /* wgsl */ `
${UNIFORM_WGSL}
${OBELISK_WGSL}
@group(0) @binding(1) var<storage, read_write> positions : array<vec4f>;
@group(0) @binding(2) var<storage, read_write> velocities : array<vec4f>;

fn sdfGrad(p : vec3f) -> vec3f {
  let e = 0.014;
  return vec3f(
    obeliskSDF(p + vec3f(e,0.0,0.0)) - obeliskSDF(p - vec3f(e,0.0,0.0)),
    obeliskSDF(p + vec3f(0.0,e,0.0)) - obeliskSDF(p - vec3f(0.0,e,0.0)),
    obeliskSDF(p + vec3f(0.0,0.0,e)) - obeliskSDF(p - vec3f(0.0,0.0,e)),
  ) / (2.0 * e);
}

fn drift(p : vec3f, t : f32, seed : f32) -> vec3f {
  let q = p * 1.4 + vec3f(seed * 17.0);
  return vec3f(
    sin(q.y * 2.1 + t) + cos(q.z * 1.7 - t * 0.7),
    sin(q.z * 2.3 - t * 0.8) + cos(q.x * 1.9 + t * 0.6),
    sin(q.x * 1.3 + t * 0.5) + cos(q.y * 2.7 - t),
  ) * 0.5;
}

@compute @workgroup_size(256)
fn simulate(@builtin(global_invocation_id) gid : vec3u) {
  let i = gid.x;
  let count = u32(u.misc.z);
  if (i >= count) { return; }

  var p = positions[i].xyz;
  let seed = positions[i].w;
  var v = velocities[i].xyz;
  let t = u.camRo.w;
  let dt = u.camFwd.w;

  let d = obeliskSDF(p);
  let g = sdfGrad(p);
  let shell = d - 0.14;                       // the aura floats off the surface
  let capture = exp(-abs(shell) * 4.0);

  // the law: flow toward the aura shell of the monument
  let law = -g * (shell / (abs(shell) + 0.14)) * u.misc.x;
  // slow ceremonial orbit around the axis
  let tang = normalize(vec3f(-p.z, 0.0, p.x) + vec3f(1e-4));
  let orbit = tang * (0.42 + 0.30 * capture);
  // entropy — never dies; ~12% wild veil
  let wild = step(0.88, fract(seed * 11.9));
  let entropy = drift(p, t * 0.4, seed) * u.misc.y
    * (0.25 + 0.75 * (1.0 - capture)) * (1.0 + 2.0 * wild);
  let lawScale = mix(1.0, 0.12, wild);

  // pointer stir
  let toP = p - vec3f(u.pointer.x, u.pointer.y, 0.0);
  let push = toP * (u.pointer.z * exp(-dot(toP, toP) * 1.8));

  v = v * mix(0.88, 0.74, capture) + (law * lawScale + orbit + entropy + push) * dt;
  p += v * dt;

  // containment: cylinder + height
  let r = length(p.xz);
  if (r > 4.6) { p = vec3f(p.x * 4.6 / r, p.y, p.z * 4.6 / r); v *= -0.3; }
  p.y = clamp(p.y, -3.4, 3.8);

  positions[i] = vec4f(p, seed);
  velocities[i] = vec4f(v, d);
}
`;

/* ── particle render pass ────────────────────────────────────────── */

const PARTICLE_WGSL = /* wgsl */ `
${UNIFORM_WGSL}
${OBELISK_WGSL}
@group(0) @binding(1) var<storage, read> positions : array<vec4f>;
@group(0) @binding(2) var<storage, read> velocities : array<vec4f>;

struct VSOut {
  @builtin(position) clip : vec4f,
  @location(0) uv : vec2f,
  @location(1) tint : vec3f,
  @location(2) glow : f32,
}

@vertex
fn vs(@builtin(vertex_index) vi : u32, @builtin(instance_index) ii : u32) -> VSOut {
  var corners = array<vec2f, 6>(
    vec2f(-1.0,-1.0), vec2f(1.0,-1.0), vec2f(-1.0,1.0),
    vec2f(-1.0, 1.0), vec2f(1.0,-1.0), vec2f( 1.0,1.0),
  );
  let count = u32(u.misc.z);
  let mirrored = ii >= count;
  let base = select(ii, ii - count, mirrored);

  var p = positions[base].xyz;
  if (mirrored) { p.x = -p.x; }
  let seed = positions[base].w;
  let d = velocities[base].w;
  let capture = exp(-abs(d - 0.14) * 4.0);

  // cheap occlusion: is the monument between the camera and this particle?
  let ro = u.camRo.xyz;
  let toC = p - ro;
  var occl = 1.0;
  for (var s = 0; s < 3; s++) {
    let sp = ro + toC * (0.45 + 0.18 * f32(s));
    if (obeliskSDF(sp) < -0.04) { occl = 0.12; break; }
  }

  let size = mix(0.024, 0.008, capture)
    * (0.75 + 0.5 * fract(seed * 7.31)) * u.camUp.w;
  let corner = corners[vi];
  let world = p + (u.camRight.xyz * corner.x + u.camUp.xyz * corner.y) * size;

  var out : VSOut;
  out.clip = u.viewProj * vec4f(world, 1.0);
  out.uv = corner;
  let dim = vec3f(0.16, 0.18, 0.21);
  let hi  = vec3f(0.92, 0.94, 0.99);
  out.tint = mix(dim, hi, capture * capture);
  out.glow = (0.007 + 0.30 * capture * capture) * u.misc.w * occl;
  return out;
}

@fragment
fn fs(in : VSOut) -> @location(0) vec4f {
  let r = length(in.uv);
  if (r > 1.0) { discard; }
  let fall = pow(1.0 - r, 2.4);
  let core = pow(max(0.0, 1.0 - r * 2.6), 3.0) * 0.8;
  let w = (fall + core) * in.glow;
  return vec4f(in.tint * w, w);
}
`;

/* ── minimal mat4 (column-major) ─────────────────────────────────── */

function perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect; m[5] = f; m[10] = far * nf; m[11] = -1; m[14] = far * near * nf;
  return m;
}
function mul(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}
/** view matrix from an orthonormal camera basis. */
function viewFromBasis(
  ro: [number, number, number],
  right: [number, number, number],
  up: [number, number, number],
  fwd: [number, number, number],
): Float32Array {
  // rows are the basis vectors; translation = -basis·ro. fwd points at scene.
  const bz = [-fwd[0], -fwd[1], -fwd[2]];
  return new Float32Array([
    right[0], up[0], bz[0], 0,
    right[1], up[1], bz[1], 0,
    right[2], up[2], bz[2], 0,
    -(right[0] * ro[0] + right[1] * ro[1] + right[2] * ro[2]),
    -(up[0] * ro[0] + up[1] * ro[1] + up[2] * ro[2]),
    -(bz[0] * ro[0] + bz[1] * ro[1] + bz[2] * ro[2]),
    1,
  ]);
}

/* ── engine ──────────────────────────────────────────────────────── */

export async function mountMonument(
  canvas: HTMLCanvasElement,
  opts: MonumentOptions,
): Promise<MonumentHandle | null> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return null;
  try {
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    if (!adapter) return null;
    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu");
    if (!context) return null;
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const COUNT = 1 << 16; // 65,536 simulated → 131,072 rendered

    const pos = new Float32Array(COUNT * 4);
    const vel = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      const r = 0.9 + Math.random() * 2.4;
      const th = Math.random() * Math.PI * 2;
      pos[i * 4 + 0] = Math.cos(th) * r;
      pos[i * 4 + 1] = -2.8 + Math.random() * 6.0;
      pos[i * 4 + 2] = Math.sin(th) * r;
      pos[i * 4 + 3] = Math.random();
      vel[i * 4 + 3] = 4;
    }

    const posBuf = device.createBuffer({ size: pos.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(posBuf, 0, pos);
    const velBuf = device.createBuffer({ size: vel.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(velBuf, 0, vel);
    const uniBuf = device.createBuffer({ size: 160, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

    const computePipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: device.createShaderModule({ code: COMPUTE_WGSL }), entryPoint: "simulate" },
    });
    const marchModule = device.createShaderModule({ code: RAYMARCH_WGSL });
    const marchPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module: marchModule, entryPoint: "vs" },
      fragment: { module: marchModule, entryPoint: "fs", targets: [{ format }] },
      primitive: { topology: "triangle-list" },
    });
    const partModule = device.createShaderModule({ code: PARTICLE_WGSL });
    const partPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module: partModule, entryPoint: "vs" },
      fragment: {
        module: partModule,
        entryPoint: "fs",
        targets: [{
          format,
          blend: {
            color: { srcFactor: "one", dstFactor: "one", operation: "add" },
            alpha: { srcFactor: "one", dstFactor: "one", operation: "add" },
          },
        }],
      },
      primitive: { topology: "triangle-list" },
    });

    const computeBind = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniBuf } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: velBuf } },
      ],
    });
    const marchBind = device.createBindGroup({
      layout: marchPipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: uniBuf } }],
    });
    const partBind = device.createBindGroup({
      layout: partPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniBuf } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: velBuf } },
      ],
    });

    // adaptive resolution — hold high fps by scaling render size, never stutter
    let resScale = 1;
    let emaFrame = 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const applySize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr * resScale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr * resScale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    };
    applySize();
    const ro2 = new ResizeObserver(applySize);
    ro2.observe(canvas);

    const pointer = { x: 0, y: 0, strength: 0 };
    let lastPX = 0, lastPY = 0, lastPT = 0;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = (((e.clientX - rect.left) / rect.width) * 2 - 1) * 3.2;
      pointer.y = -((((e.clientY - rect.top) / rect.height) * 2 - 1) * 2.4);
      const now = performance.now();
      if (lastPT > 0) {
        const speed = Math.hypot(e.clientX - lastPX, e.clientY - lastPY) / Math.max(8, now - lastPT);
        pointer.strength = Math.min(2.4, pointer.strength + speed * 1.1);
      }
      lastPX = e.clientX; lastPY = e.clientY; lastPT = now;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const uniforms = new Float32Array(40);
    let raf = 0;
    let disposed = false;
    let lastT = performance.now();
    let smX = 0, smY = 0;
    const start = lastT;
    const FOV = (30 * Math.PI) / 180;
    const FOCAL = 1 / Math.tan(FOV / 2);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dtms = now - lastT;
      const dt = Math.min(1 / 30, dtms / 1000);
      lastT = now;
      if (!opts.getActive() || document.hidden) return;

      // adaptive quality: hold 60fps by trading resolution, invisibly
      emaFrame = emaFrame * 0.92 + dtms * 0.08;
      if (emaFrame > 19 && resScale > 0.55) { resScale = Math.max(0.55, resScale - 0.06); applySize(); emaFrame = 16; }
      else if (emaFrame < 12.5 && resScale < 1) { resScale = Math.min(1, resScale + 0.03); applySize(); }

      const t = (now - start) / 1000;
      const ramp = Math.min(1, Math.max(0, (t - 0.3) / 2.0));
      const law = 5.5 * ramp * ramp * (3 - 2 * ramp);
      const entropy = 0.7 * (1 - 0.6 * ramp);
      pointer.strength *= 0.94;

      // camera: slow oscillating orbit + pointer parallax — never edge-on flat
      smX += (pointer.x / 3.2 - smX) * 0.04;
      smY += (pointer.y / 2.4 - smY) * 0.04;
      const ry = 0.42 * Math.sin(t * 0.05) + smX * 0.16 + 0.5;
      const el = 0.10 + 0.04 * Math.sin(t * 0.033) - smY * 0.06;
      const R = 11.2;
      const ro: [number, number, number] = [
        Math.sin(ry) * Math.cos(el) * R,
        0.4 + Math.sin(el) * R * 0.4,
        Math.cos(ry) * Math.cos(el) * R,
      ];
      const look: [number, number, number] = [0, 0.35, 0];
      const fv = [look[0] - ro[0], look[1] - ro[1], look[2] - ro[2]];
      const fl = Math.hypot(fv[0], fv[1], fv[2]);
      const fwd: [number, number, number] = [fv[0] / fl, fv[1] / fl, fv[2] / fl];
      const rt: [number, number, number] = [fwd[2], 0, -fwd[0]];
      const rl = Math.hypot(rt[0], rt[1], rt[2]);
      rt[0] /= rl; rt[1] /= rl; rt[2] /= rl;
      const up: [number, number, number] = [
        rt[1] * fwd[2] - rt[2] * fwd[1],
        rt[2] * fwd[0] - rt[0] * fwd[2],
        rt[0] * fwd[1] - rt[1] * fwd[0],
      ];
      const rect = canvas.getBoundingClientRect();
      const aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
      const vp = mul(perspective(FOV, aspect, 0.1, 100), viewFromBasis(ro, rt, up, fwd));
      const sizeScale = Math.min(1.25, Math.max(0.6, rect.height / 640));

      uniforms.set(vp, 0);
      uniforms.set([...ro, t], 16);
      uniforms.set([...rt, aspect], 20);
      uniforms.set([...up, sizeScale], 24);
      uniforms.set([...fwd, dt], 28);
      uniforms.set([pointer.x, pointer.y, pointer.strength, FOCAL], 32);
      uniforms.set([law, entropy, COUNT, 0.45], 36);
      device.queue.writeBuffer(uniBuf, 0, uniforms);

      const enc = device.createCommandEncoder();
      const cp = enc.beginComputePass();
      cp.setPipeline(computePipeline);
      cp.setBindGroup(0, computeBind);
      cp.dispatchWorkgroups(Math.ceil(COUNT / 256));
      cp.end();

      const view = context.getCurrentTexture().createView();
      const rp1 = enc.beginRenderPass({
        colorAttachments: [{ view, clearValue: { r: 0, g: 0, b: 0, a: 1 }, loadOp: "clear", storeOp: "store" }],
      });
      rp1.setPipeline(marchPipeline);
      rp1.setBindGroup(0, marchBind);
      rp1.draw(3);
      rp1.end();

      const rp2 = enc.beginRenderPass({
        colorAttachments: [{ view, loadOp: "load", storeOp: "store" }],
      });
      rp2.setPipeline(partPipeline);
      rp2.setBindGroup(0, partBind);
      rp2.draw(6, COUNT * 2);
      rp2.end();

      device.queue.submit([enc.finish()]);
    };
    raf = requestAnimationFrame(loop);

    return {
      kind: "webgpu-monument",
      dispose: () => {
        disposed = true;
        void disposed;
        cancelAnimationFrame(raf);
        ro2.disconnect();
        window.removeEventListener("pointermove", onMove);
        posBuf.destroy(); velBuf.destroy(); uniBuf.destroy();
        device.destroy();
      },
    };
  } catch {
    return null;
  }
}
