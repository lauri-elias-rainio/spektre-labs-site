/// <reference types="@webgpu/types" />
/**
 * THE DESCENT — raw WebGPU compute engine.
 *
 * One persistent particle field (131,072 simulated · 262,144 rendered — every
 * particle drawn twice, once mirrored across the vertical axis) that carries
 * the whole homepage. A compute shader springs each particle toward the blend
 * of two formation targets (set by scroll), under a drifting curl field and
 * pointer entropy. The law always re-collapses the noise into the form.
 *
 * STYLE_LAW: OLED true-black · platinum ramp · ONE cold signal (#cfe3ff),
 * gated to the seal's axis/fixpoint only. Bilateral symmetry by construction.
 */

import { buildFormations, FORMATION_COUNT } from "./formations";

export interface DescentHandle {
  kind: "webgpu";
  count: number;
  setStage: (fA: number, fB: number, blend: number, sealWeight: number) => void;
  setPointer: (x: number, y: number, strength: number) => void;
  dispose: () => void;
}

export interface DescentOptions {
  onLive?: () => void;
  getActive: () => boolean;
}

const COUNT = 131072;
const WG = 256;

const SHARED_WGSL = /* wgsl */ `
struct U {
  viewProj : mat4x4f,
  right    : vec4f, // camera right.xyz · w = base sprite size
  up       : vec4f, // camera up.xyz    · w = time (s)
  pointer  : vec4f, // world x, y, strength, dt
  stage    : vec4f, // fA, fB, blend, sealWeight
  misc     : vec4f, // count, exposure, aspect, unused
}
@group(0) @binding(0) var<uniform> u : U;
`;

const COMPUTE_WGSL = /* wgsl */ `
${SHARED_WGSL}
@group(0) @binding(1) var<storage, read_write> pos : array<vec4f>; // xyz + seed
@group(0) @binding(2) var<storage, read_write> vel : array<vec4f>;
@group(0) @binding(3) var<storage, read> targets : array<vec4f>;   // 5 × COUNT

fn hash3(p : vec3f) -> vec3f {
  var q = vec3f(
    dot(p, vec3f(127.1, 311.7, 74.7)),
    dot(p, vec3f(269.5, 183.3, 246.1)),
    dot(p, vec3f(113.5, 271.9, 124.6)));
  return fract(sin(q) * 43758.5453) * 2.0 - 1.0;
}

/* cheap divergence-poor drift field — entropy that the law must beat */
fn drift(p : vec3f, t : f32) -> vec3f {
  let a = hash3(floor(p * 2.3) + floor(vec3f(t * 0.11)));
  let b = sin(p.yzx * 1.7 + t * 0.23) * 0.6 + sin(p.zxy * 2.9 - t * 0.17) * 0.4;
  return normalize(a + b + vec3f(1e-4)) * 0.5;
}

@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid : vec3u) {
  let i = gid.x;
  let n = u32(u.misc.x);
  if (i >= n) { return; }

  var p = pos[i];
  var v = vel[i];
  let dt = clamp(u.pointer.w, 0.001, 0.033);
  let t  = u.up.w;

  let fA = u32(u.stage.x);
  let fB = u32(u.stage.y);
  let bl = u.stage.z;
  let tgt = mix(targets[fA * n + i].xyz, targets[fB * n + i].xyz, bl);

  // the law — spring toward the declared form
  let toT = tgt - p.xyz;
  var acc = toT * 22.0;

  // entropy — drift + per-particle breath
  acc += drift(p.xyz, t) * (0.30 + 0.22 * sin(p.w * 6.2832 + t * 0.6));

  // pointer — a soft entropy injection the law re-collapses
  let pd = p.xyz - vec3f(u.pointer.x, u.pointer.y, 0.0);
  let pl = length(pd);
  if (pl < 0.9) {
    acc += (pd / max(pl, 0.05)) * (0.9 - pl) * 26.0 * u.pointer.z;
  }

  v = vec4f((v.xyz + acc * dt) * exp(-7.5 * dt), v.w);
  p = vec4f(p.xyz + v.xyz * dt, p.w);

  pos[i] = p;
  vel[i] = v;
}
`;

const RENDER_WGSL = /* wgsl */ `
${SHARED_WGSL}
@group(0) @binding(1) var<storage, read> pos : array<vec4f>;
@group(0) @binding(3) var<storage, read> targets : array<vec4f>;

struct VOut {
  @builtin(position) clip : vec4f,
  @location(0) uv : vec2f,
  @location(1) col : vec3f,
  @location(2) fade : f32,
}

const QUAD = array<vec2f, 6>(
  vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  vec2f(-1.0, -1.0), vec2f(1.0, 1.0), vec2f(-1.0, 1.0));

@vertex
fn vs(@builtin(vertex_index) vi : u32, @builtin(instance_index) inst : u32) -> VOut {
  let i = vi / 6u;
  let corner = QUAD[vi % 6u];
  var p = pos[i];
  let mirror = select(1.0, -1.0, inst == 1u);
  var world = vec3f(p.x * mirror, p.y, p.z);

  let n = u32(u.misc.x);
  let fA = u32(u.stage.x);
  let fB = u32(u.stage.y);
  let tgt = mix(targets[fA * n + i].xyz, targets[fB * n + i].xyz, u.stage.z);

  // platinum ramp by depth + seed; the ONE signal, gated to the seal axis
  let plat = mix(vec3f(0.336, 0.357, 0.404), vec3f(0.910, 0.918, 0.933),
                 0.35 + 0.65 * fract(p.w * 7.31));
  let onAxis = select(0.0, 1.0, abs(tgt.x) < 0.0015 && abs(tgt.z) < 0.008);
  let sig = u.stage.w * onAxis;
  let col = mix(plat, vec3f(0.812, 0.890, 1.0) * 1.6, clamp(sig, 0.0, 1.0));

  let size = u.right.w * (0.6 + 0.8 * fract(p.w * 3.77));
  world += (u.right.xyz * corner.x + u.up.xyz * corner.y) * size;

  var o : VOut;
  o.clip = u.viewProj * vec4f(world, 1.0);
  o.uv = corner;
  o.col = col;
  o.fade = u.misc.y;
  return o;
}

@fragment
fn fs(in : VOut) -> @location(0) vec4f {
  let d2 = dot(in.uv, in.uv);
  if (d2 > 1.0) { discard; }
  let a = exp(-d2 * 4.2) * 0.075 * in.fade;
  return vec4f(in.col * a, a);
}
`;

/* ---------------- minimal mat4 (column-major) ---------------- */
function perspective(fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2);
  const out = new Float32Array(16);
  out[0] = f / aspect; out[5] = f;
  out[10] = far / (near - far); out[11] = -1;
  out[14] = (near * far) / (near - far);
  return out;
}
function lookAt(eye: number[], c: number[], upv: number[]) {
  const z = norm3([eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]]);
  const x = norm3(cross(upv, z));
  const y = cross(z, x);
  return {
    m: new Float32Array([
      x[0], y[0], z[0], 0,
      x[1], y[1], z[1], 0,
      x[2], y[2], z[2], 0,
      -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1,
    ]),
    right: x, up: y,
  };
}
function mul4(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}
const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function norm3(a: number[]) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

/* ---------------- engine ---------------- */
export async function createDescentWebGPU(
  canvas: HTMLCanvasElement,
  opts: DescentOptions
): Promise<DescentHandle | null> {
  if (!("gpu" in navigator)) return null;
  const adapter = await navigator.gpu.requestAdapter().catch(() => null);
  if (!adapter) return null;
  const device = await adapter.requestDevice().catch(() => null);
  if (!device) return null;
  const dev = device; // narrowed capture for the hoisted frame loop

  /* σ-gate FIRST — prove the shaders compile before touching the canvas,
     so a failure here leaves the canvas free for the WebGL2 fallback. */
  const computeModule = device.createShaderModule({ code: COMPUTE_WGSL });
  const renderModule = device.createShaderModule({ code: RENDER_WGSL });
  const [ciC, ciR] = await Promise.all([
    computeModule.getCompilationInfo(),
    renderModule.getCompilationInfo(),
  ]);
  if (
    ciC.messages.some((m) => m.type === "error") ||
    ciR.messages.some((m) => m.type === "error")
  ) {
    device.destroy?.();
    return null;
  }

  const ctx = canvas.getContext("webgpu");
  if (!ctx) return null;

  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({ device, format, alphaMode: "premultiplied" });

  /* buffers */
  const posInit = new Float32Array(COUNT * 4);
  const velInit = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    // spawn as noise — the field begins as entropy and collapses into the monolith
    posInit[i * 4 + 0] = (Math.random() - 0.5) * 6;
    posInit[i * 4 + 1] = (Math.random() - 0.5) * 6;
    posInit[i * 4 + 2] = (Math.random() - 0.5) * 6;
    posInit[i * 4 + 3] = Math.random(); // seed
    velInit[i * 4 + 3] = 0;
  }
  const mkStorage = (data: Float32Array<ArrayBuffer>) => {
    const b = device.createBuffer({
      size: data.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(b, 0, data);
    return b;
  };
  const posBuf = mkStorage(posInit);
  const velBuf = mkStorage(velInit);

  const formations = buildFormations(COUNT);
  const targetData = new Float32Array(FORMATION_COUNT * COUNT * 4);
  for (let f = 0; f < FORMATION_COUNT; f++)
    for (let i = 0; i < COUNT; i++) {
      targetData[(f * COUNT + i) * 4 + 0] = formations[f][i * 3 + 0];
      targetData[(f * COUNT + i) * 4 + 1] = formations[f][i * 3 + 1];
      targetData[(f * COUNT + i) * 4 + 2] = formations[f][i * 3 + 2];
    }
  const targetBuf = mkStorage(targetData);

  const uniData = new Float32Array(16 + 4 * 5);
  const uniBuf = device.createBuffer({
    size: uniData.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  /* pipelines */

  const computePipeline = device.createComputePipeline({
    layout: "auto",
    compute: { module: computeModule, entryPoint: "main" },
  });
  const computeBind = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniBuf } },
      { binding: 1, resource: { buffer: posBuf } },
      { binding: 2, resource: { buffer: velBuf } },
      { binding: 3, resource: { buffer: targetBuf } },
    ],
  });

  const renderPipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: renderModule, entryPoint: "vs" },
    fragment: {
      module: renderModule,
      entryPoint: "fs",
      targets: [{
        format,
        blend: {
          color: { srcFactor: "one", dstFactor: "one" },
          alpha: { srcFactor: "one", dstFactor: "one" },
        },
      }],
    },
    primitive: { topology: "triangle-list" },
  });
  const renderBind = device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: uniBuf } },
      { binding: 1, resource: { buffer: posBuf } },
      { binding: 3, resource: { buffer: targetBuf } },
    ],
  });

  /* state */
  let fA = 0, fB = 0, blend = 0, sealW = 0;
  let px = 0, py = 0, pstr = 0;
  let disposed = false;
  let liveFrames = 0;
  let last = performance.now();
  let fade = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
  }

  function frame(now: number) {
    if (disposed) return;
    requestAnimationFrame(frame);
    if (!opts.getActive()) { last = now; return; }
    resize();

    const dt = Math.min((now - last) / 1000, 0.033);
    last = now;
    const t = now / 1000;
    fade = Math.min(1, fade + dt * 0.6);

    // camera — slow symmetric orbit breath, axis-locked target
    const stagePos = fA + blend;
    const dist = 3.4 + Math.sin(t * 0.07) * 0.15 + stagePos * 0.12;
    // camera arc: level → look down into the lattice → rise to face the seal
    const latticeW = Math.max(0, 1 - Math.abs(stagePos - 3));
    const sealWgt = Math.max(0, Math.min(1, stagePos - 3));
    const elev = 0.42 + 0.5 * latticeW - 0.38 * sealWgt;
    const ang = Math.PI / 2 + Math.sin(t * 0.05) * 0.10;
    const eye = [Math.cos(ang) * dist * Math.cos(elev), Math.sin(elev) * dist, Math.sin(ang) * dist * Math.cos(elev)];
    const { m: view, right, up } = lookAt(eye, [0, 0.1, 0], [0, 1, 0]);
    const aspect = canvas.width / Math.max(1, canvas.height);
    const proj = perspective(0.9, aspect, 0.1, 40);
    const vp = mul4(proj, view);

    uniData.set(vp, 0);
    uniData.set([right[0], right[1], right[2], 0.013], 16);
    uniData.set([up[0], up[1], up[2], t], 20);
    uniData.set([px, py, pstr, dt], 24);
    uniData.set([fA, fB, blend, sealW], 28);
    uniData.set([COUNT, fade, aspect, 0], 32);
    dev.queue.writeBuffer(uniBuf, 0, uniData);

    const enc = dev.createCommandEncoder();
    const cp = enc.beginComputePass();
    cp.setPipeline(computePipeline);
    cp.setBindGroup(0, computeBind);
    cp.dispatchWorkgroups(Math.ceil(COUNT / WG));
    cp.end();

    const rp = enc.beginRenderPass({
      colorAttachments: [{
        view: ctx!.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    rp.setPipeline(renderPipeline);
    rp.setBindGroup(0, renderBind);
    rp.draw(COUNT * 6, 2); // ×2 instances — the form and its mirror
    rp.end();
    dev.queue.submit([enc.finish()]);

    // decay pointer entropy — the law wins
    pstr *= Math.exp(-2.4 * dt);

    if (liveFrames < 4) {
      liveFrames++;
      if (liveFrames === 3) opts.onLive?.();
    }
  }
  requestAnimationFrame(frame);

  return {
    kind: "webgpu",
    count: COUNT * 2,
    setStage(a, b, bl, sw) { fA = a; fB = b; blend = bl; sealW = sw; },
    setPointer(x, y, s) { px = x; py = y; pstr = Math.min(1.4, pstr + s); },
    dispose() {
      disposed = true;
      posBuf.destroy(); velBuf.destroy(); targetBuf.destroy(); uniBuf.destroy();
      device.destroy?.();
    },
  };
}
