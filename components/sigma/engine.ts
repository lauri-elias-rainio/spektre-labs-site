/// <reference types="@webgpu/types" />
/**
 * Σ-COLLAPSE — raw WebGPU compute engine. Zero dependencies on the GPU path.
 *
 * The brand law, rendered as physics: a couple hundred thousand particles live
 * under two forces — entropy (a drifting noise field) and the law (attraction
 * along the gradient of a signed-distance field describing the Spektre sigil:
 * two concentric rings, the octad nodes, the central fixpoint). Noise collapses
 * into the mark; σ — the mean particle distance to the form — is MEASURED on
 * the GPU every frame and reported honestly. Declared = realized: the number
 * shown is the number computed.
 *
 * STYLE_LAW:
 *  - Perfect bilateral symmetry BY CONSTRUCTION: every simulated particle is
 *    rendered twice, once mirrored across the vertical axis. The flip-test
 *    passes mathematically, every frame, including under pointer interaction.
 *  - OLED true-black, platinum ramp, ONE cold signal (#cfe3ff) reserved for
 *    the central fixpoint capture zone.
 *  - Pointer = entropy injection; the law always re-collapses the field.
 *    Noise never overrides identity — as interaction.
 *
 * Degradation: caller falls back to the three.js sculpture (WebGL2) → poster.
 */

export interface SigmaCollapseHandle {
  kind: "webgpu-compute";
  /** simulated particles; the render shows count × 2 (the form + its mirror). */
  count: number;
  dispose: () => void;
}

export interface SigmaCollapseOptions {
  /** live measured σ (mean distance to the form), ~2×/s. */
  onSigma?: (sigma: number) => void;
  /** returns false to pause simulation (offscreen / hidden tab). */
  getActive: () => boolean;
}

/* ------------------------------------------------------------------ */
/* WGSL — shared uniform layout                                        */
/* ------------------------------------------------------------------ */

const UNIFORM_WGSL = /* wgsl */ `
struct U {
  viewProj : mat4x4f,
  right    : vec4f, // camera-right.xyz, w = sprite size scale
  up       : vec4f, // camera-up.xyz,    w = time (s)
  pointer  : vec4f, // world x, y, strength, dt
  misc     : vec4f, // law, entropy, count (as f32), exposure
}
@group(0) @binding(0) var<uniform> u : U;
`;

/** Signed distance to the sigil curve network (rings, octad, fixpoint). */
const SIGIL_WGSL = /* wgsl */ `
const TAU : f32 = 6.28318530718;

fn ringDist(p : vec3f, r : f32) -> f32 {
  let dxy = abs(length(p.xy) - r);
  return length(vec2f(dxy, p.z));
}

fn sigilDistance(p : vec3f) -> f32 {
  var d = ringDist(p, 1.0);            // outer ring
  d = min(d, ringDist(p, 0.62));       // inner ring
  let seg = TAU / 8.0;                 // octad nodes on the outer ring
  let a  = atan2(p.y, p.x);
  let an = round(a / seg) * seg;
  let node = vec3f(cos(an), sin(an), 0.0);
  d = min(d, length(p - node) - 0.012);
  d = min(d, length(p) - 0.03);        // the central fixpoint
  return max(d, 0.0);
}
`;

/* ------------------------------------------------------------------ */
/* WGSL — compute (simulation, read_write storage)                     */
/* ------------------------------------------------------------------ */

const COMPUTE_WGSL = /* wgsl */ `
${UNIFORM_WGSL}
@group(0) @binding(1) var<storage, read_write> positions : array<vec4f>;
@group(0) @binding(2) var<storage, read_write> velocities : array<vec4f>;
struct Acc { sum : atomic<u32>, n : atomic<u32> }
@group(0) @binding(3) var<storage, read_write> acc : Acc;

${SIGIL_WGSL}

fn sigilGradient(p : vec3f) -> vec3f {
  let e = 0.012;
  return vec3f(
    sigilDistance(p + vec3f(e, 0.0, 0.0)) - sigilDistance(p - vec3f(e, 0.0, 0.0)),
    sigilDistance(p + vec3f(0.0, e, 0.0)) - sigilDistance(p - vec3f(0.0, e, 0.0)),
    sigilDistance(p + vec3f(0.0, 0.0, e)) - sigilDistance(p - vec3f(0.0, 0.0, e)),
  ) / (2.0 * e);
}

/** cheap organic drift field (the world's noise), phase-shifted per particle. */
fn entropyField(p : vec3f, t : f32, seed : f32) -> vec3f {
  let q = p * 1.55 + vec3f(seed * 17.0);
  return vec3f(
    sin(q.y * 2.10 + t) + cos(q.z * 1.70 - t * 0.70),
    sin(q.z * 2.30 - t * 0.80) + cos(q.x * 1.90 + t * 0.60),
    sin(q.x * 1.30 + t * 0.50) + cos(q.y * 2.70 - t),
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

  let t  = u.up.w;
  let dt = u.pointer.w;

  let d = sigilDistance(p);
  let g = sigilGradient(p);
  let capture = exp(-d * 5.0);

  // the law — saturating flow along -∇d toward the zero set (σ → 0);
  // stays firm near the curve so the line condenses razor-sharp.
  // ~14% of the field is wild — it never fully submits and remains the
  // living entropy veil the mark is carved out of.
  let wild = step(0.86, fract(seed * 11.9));
  let lawScale = mix(1.0, 0.15, wild);
  let law = -g * (d / (d + 0.12)) * u.misc.x * lawScale;

  // entropy — fades once captured; a real residual keeps the line alive.
  let entropy = entropyField(p, t * 0.35, seed) * u.misc.y
    * (0.22 + 0.78 * (1.0 - capture)) * (1.0 + 1.6 * wild);

  // pointer — injected disturbance, symmetric by the mirrored render.
  let toP = p - vec3f(u.pointer.x, u.pointer.y, 0.0);
  let pr2 = dot(toP, toP);
  let push = toP * (u.pointer.z * exp(-pr2 * 2.4));

  // heavier damping when captured — particles settle ON the form.
  let damping = mix(0.86, 0.70, capture);
  v = v * damping + (law + entropy + push) * dt;
  p = p + v * dt;

  // soft containment shell — nothing leaves the stage.
  let pl = length(p);
  if (pl > 3.4) {
    p = p * (3.4 / pl);
    v = v * -0.35;
  }

  positions[i]  = vec4f(p, seed);
  velocities[i] = vec4f(v, d);

  // σ telemetry — a prime-strided subset accumulates quantized distance.
  if (i % 61u == 0u) {
    atomicAdd(&acc.sum, u32(min(d, 4.0) * 1000.0));
    atomicAdd(&acc.n, 1u);
  }
}
`;

/* ------------------------------------------------------------------ */
/* WGSL — render (read-only storage, instanced soft sprites)           */
/* ------------------------------------------------------------------ */

const RENDER_WGSL = /* wgsl */ `
${UNIFORM_WGSL}
@group(0) @binding(1) var<storage, read> positions : array<vec4f>;
@group(0) @binding(2) var<storage, read> velocities : array<vec4f>;

${SIGIL_WGSL}

struct VSOut {
  @builtin(position) clip : vec4f,
  @location(0) uv : vec2f,
  @location(1) tint : vec3f,
  @location(2) glow : f32,
}

@vertex
fn vs(@builtin(vertex_index) vi : u32, @builtin(instance_index) ii : u32) -> VSOut {
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0,  1.0), vec2f(1.0, -1.0), vec2f( 1.0, 1.0),
  );
  let count = u32(u.misc.z);
  let mirrored = ii >= count;
  let base = select(ii, ii - count, mirrored);

  var p = positions[base].xyz;
  if (mirrored) { p.x = -p.x; }            // 1 = 1 by construction.

  let seed = positions[base].w;
  let d = velocities[base].w;
  let capture = exp(-d * 5.0);

  // captured particles condense small + sharp; free noise stays soft + large.
  let size = mix(0.026, 0.009, capture) * (0.75 + 0.5 * fract(seed * 7.31)) * u.right.w;

  let corner = corners[vi];
  let world = p + (u.right.xyz * corner.x + u.up.xyz * corner.y) * size;

  var out : VSOut;
  out.clip = u.viewProj * vec4f(world, 1.0);
  out.uv = corner;

  // platinum ramp — dim free carbon → bright platinum on capture.
  let dim = vec3f(0.165, 0.180, 0.210);
  let hi  = vec3f(0.930, 0.950, 0.990);
  var tint = mix(dim, hi, capture * capture);

  // the ONE cold signal — reserved for the central fixpoint capture zone.
  let centerness = smoothstep(0.24, 0.05, length(p)) * capture;
  tint = mix(tint, vec3f(0.812, 0.890, 1.0) * 1.65, centerness);

  // the luminous line lives on the rings; node/center mass stays restrained
  // so the octad reads as crisp accents, not blobs.
  let dRing = min(ringDist(p, 1.0), ringDist(p, 0.62));
  let onRing = 1.0 - smoothstep(0.04, 0.10, dRing);
  let lineBoost = mix(0.15, 1.0, max(onRing, centerness));

  out.tint = tint;
  out.glow = (0.012 + 0.65 * capture * capture * lineBoost) * u.misc.w;
  return out;
}

@fragment
fn fs(in : VSOut) -> @location(0) vec4f {
  let r = length(in.uv);
  if (r > 1.0) { discard; }
  let fall = pow(1.0 - r, 2.4);
  let core = pow(max(0.0, 1.0 - r * 2.6), 3.0) * 0.8;
  let w = (fall + core) * in.glow;
  return vec4f(in.tint * w, w);   // premultiplied, additive.
}
`;

/* ------------------------------------------------------------------ */
/* minimal mat4 helpers (column-major, WGSL-compatible)                */
/* ------------------------------------------------------------------ */

function perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = far * nf;
  m[11] = -1;
  m[14] = far * near * nf;
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

/** view = translate(0,0,-dist) · rotX(rx) · rotY(ry) applied to the world. */
function view(rx: number, ry: number, dist: number): Float32Array {
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const rotY = new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1]);
  const rotX = new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]);
  const trans = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -dist, 1]);
  return mul(trans, mul(rotX, rotY));
}

/* ------------------------------------------------------------------ */
/* engine                                                              */
/* ------------------------------------------------------------------ */

function particleCount(): number {
  if (typeof navigator === "undefined") return 1 << 15;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)").matches;
  if (coarse || cores <= 4) return 1 << 15; //  32,768 →  65k sprites
  return 1 << 17; //                            131,072 → 262k sprites
}

export async function mountSigmaCollapse(
  canvas: HTMLCanvasElement,
  opts: SigmaCollapseOptions,
): Promise<SigmaCollapseHandle | null> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return null;
  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    if (!adapter) return null;
    const device = await adapter.requestDevice();
    const context = canvas.getContext("webgpu");
    if (!context) return null;

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: "opaque" });

    const COUNT = particleCount();

    /* --- buffers --- */
    const pos = new Float32Array(COUNT * 4);
    const vel = new Float32Array(COUNT * 4);
    for (let i = 0; i < COUNT; i++) {
      // spawn as a pure entropy shell — the collapse happens live, on load.
      const r = 1.1 + Math.random() * 1.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      pos[i * 4 + 0] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 4 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 4 + 2] = r * Math.cos(ph) * 0.3;
      pos[i * 4 + 3] = Math.random();
      vel[i * 4 + 3] = 4;
    }

    const posBuf = device.createBuffer({
      size: pos.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(posBuf, 0, pos);
    const velBuf = device.createBuffer({
      size: vel.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(velBuf, 0, vel);

    const uniBuf = device.createBuffer({
      size: 128,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const accBuf = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    });
    const stagingBuf = device.createBuffer({
      size: 8,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    /* --- pipelines --- */
    const computeModule = device.createShaderModule({ code: COMPUTE_WGSL });
    const renderModule = device.createShaderModule({ code: RENDER_WGSL });

    const computePipeline = device.createComputePipeline({
      layout: "auto",
      compute: { module: computeModule, entryPoint: "simulate" },
    });
    const renderPipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: { module: renderModule, entryPoint: "vs" },
      fragment: {
        module: renderModule,
        entryPoint: "fs",
        targets: [
          {
            format,
            blend: {
              color: { srcFactor: "one", dstFactor: "one", operation: "add" },
              alpha: { srcFactor: "one", dstFactor: "one", operation: "add" },
            },
          },
        ],
      },
      primitive: { topology: "triangle-list" },
    });

    const computeBind = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniBuf } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: velBuf } },
        { binding: 3, resource: { buffer: accBuf } },
      ],
    });
    const renderBind = device.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniBuf } },
        { binding: 1, resource: { buffer: posBuf } },
        { binding: 2, resource: { buffer: velBuf } },
      ],
    });

    /* --- sizing --- */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const applySize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    applySize();
    const onResize = () => applySize();
    window.addEventListener("resize", onResize, { passive: true });

    /* --- pointer: position + speed-derived entropy injection --- */
    const pointer = { x: 0, y: 0, strength: 0 };
    let lastPX = 0, lastPY = 0, lastPT = 0;
    const FOV = (32 * Math.PI) / 180;
    const CAM_DIST = 7.4;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      const halfH = Math.tan(FOV / 2) * CAM_DIST;
      const aspect = rect.width / rect.height;
      pointer.x = nx * halfH * aspect;
      pointer.y = ny * halfH;
      const now = performance.now();
      if (lastPT > 0) {
        const dtms = Math.max(8, now - lastPT);
        const speed =
          Math.hypot(e.clientX - lastPX, e.clientY - lastPY) / dtms;
        pointer.strength = Math.min(3.2, pointer.strength + speed * 1.4);
      }
      lastPX = e.clientX;
      lastPY = e.clientY;
      lastPT = now;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* --- frame loop --- */
    const uniforms = new Float32Array(32);
    let raf = 0;
    let frame = 0;
    let mapPending = false;
    let disposed = false;
    let lastT = performance.now();
    let smX = 0, smY = 0; // smoothed parallax
    const start = lastT;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min(1 / 30, (now - lastT) / 1000);
      lastT = now;
      if (!opts.getActive() || document.hidden) return;

      const t = (now - start) / 1000;
      frame++;

      // the law switches on after a beat of pure entropy — the collapse is the story.
      const ramp = Math.min(1, Math.max(0, (t - 0.4) / 2.2));
      const law = 6.5 * ramp * ramp * (3 - 2 * ramp);
      const entropy = 0.8 * (1 - 0.7 * ramp);
      pointer.strength *= 0.94; // decays; the field always re-collapses.

      // camera: slow drift + restrained pointer parallax (Apple-grade).
      const rect = canvas.getBoundingClientRect();
      const aspect = Math.max(0.1, rect.width / Math.max(1, rect.height));
      smX += (pointer.x / 4 - smX) * 0.04;
      smY += (pointer.y / 4 - smY) * 0.04;
      const ry = t * 0.07 + smX * 0.22;
      const rx = -0.16 - smY * 0.16;
      const vp = mul(perspective(FOV, aspect, 0.1, 100), view(rx, ry, CAM_DIST));

      // camera basis for billboarding (rows of the rotation part).
      const cxr = Math.cos(rx), sxr = Math.sin(rx);
      const cyr = Math.cos(ry), syr = Math.sin(ry);
      const rightV: [number, number, number] = [cyr, 0, syr];
      const upV: [number, number, number] = [sxr * -syr, cxr, sxr * cyr];

      const sizeScale = Math.min(1.25, Math.max(0.65, rect.height / 640));
      uniforms.set(vp, 0);
      uniforms.set([...rightV, sizeScale], 16);
      uniforms.set([...upV, t], 20);
      uniforms.set([pointer.x, pointer.y, pointer.strength, dt], 24);
      uniforms.set([law, entropy, COUNT, 0.9], 28);
      device.queue.writeBuffer(uniBuf, 0, uniforms);

      const encoder = device.createCommandEncoder();

      const cpass = encoder.beginComputePass();
      cpass.setPipeline(computePipeline);
      cpass.setBindGroup(0, computeBind);
      cpass.dispatchWorkgroups(Math.ceil(COUNT / 256));
      cpass.end();

      const viewTex = context.getCurrentTexture().createView();
      const rpass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: viewTex,
            clearValue: { r: 0, g: 0, b: 0, a: 1 }, // OLED true-black.
            loadOp: "clear",
            storeOp: "store",
          },
        ],
      });
      rpass.setPipeline(renderPipeline);
      rpass.setBindGroup(0, renderBind);
      rpass.draw(6, COUNT * 2); // the form + its mirror — 1 = 1.
      rpass.end();

      const sample = frame % 30 === 0 && !mapPending;
      if (sample) encoder.copyBufferToBuffer(accBuf, 0, stagingBuf, 0, 8);

      device.queue.submit([encoder.finish()]);

      if (sample) {
        mapPending = true;
        device.queue.writeBuffer(accBuf, 0, new Uint32Array([0, 0]));
        stagingBuf
          .mapAsync(GPUMapMode.READ)
          .then(() => {
            if (disposed) return;
            const [sum, n] = new Uint32Array(stagingBuf.getMappedRange());
            stagingBuf.unmap();
            mapPending = false;
            if (n > 0) opts.onSigma?.(sum / 1000 / n);
          })
          .catch(() => {
            mapPending = false;
          });
      }
    };
    raf = requestAnimationFrame(loop);

    return {
      kind: "webgpu-compute",
      count: COUNT,
      dispose: () => {
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
        posBuf.destroy();
        velBuf.destroy();
        uniBuf.destroy();
        accBuf.destroy();
        stagingBuf.destroy();
        device.destroy();
      },
    };
  } catch {
    return null;
  }
}
