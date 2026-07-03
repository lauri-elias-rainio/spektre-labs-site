/// <reference types="@webgpu/types" />
/**
 * THE MONUMENT v2 — progressive raw-WebGPU tracer. Hyper-real, zero particles.
 *
 * Lessons enforced from the killed v1 (69023bd): no additive particle veil
 * over the silhouette, no adaptive resolution on a hero object. The image is
 * a single razor-sharp SDF scene that CONVERGES: every frame stochastically
 * samples the overhead area light, one reflection bounce, and pixel-jittered
 * AA into an rgba16float history (EMA) — soft shadows, glossy reflections and
 * anti-aliasing emerge from accumulation instead of blur.
 *
 * Physics upgrades over the whole house style (from the frontier scan):
 *  - energy-based anisotropic GGX (brushed platinum), 3-band fresnel F0
 *  - stochastic area-light shadows (real penumbrae, not cone approximations)
 *  - one-bounce reflections with GGX-jittered directions (roughness-true)
 *  - 5-tap SDF ambient occlusion
 *  - R2 low-discrepancy sequence + per-pixel Cranley-Patterson rotation
 *  - ACES tonemap; house tail: in-march glow, grain, CA on glow, vignette
 *
 * STYLE_LAW: OLED black · platinum · ONE signal slit on the axis. The
 * monument is 8-fold folded — symmetric by construction. The light travels;
 * the monument does not.
 */

export interface MonumentHandle {
  kind: "monument-webgpu";
  setPointer: (nx: number, ny: number) => void;
  dispose: () => void;
}

export interface MonumentOptions {
  onLive?: () => void;
  getActive: () => boolean;
}

const WGSL_COMMON = /* wgsl */ `
struct U {
  res     : vec4f, // w, h, aspect, dpr
  cam     : vec4f, // tiltX, tiltY, dist, time
  acc     : vec4f, // emaAlpha, frame, fade, reduced
}
@group(0) @binding(0) var<uniform> u : U;

const PI : f32 = 3.14159265;

/* ---- pcg / R2 sampling -------------------------------------------- */
fn pcg2d(v : vec2u) -> vec2u {
  var p = v * 1664525u + 1013904223u;
  p.x += p.y * 1664525u; p.y += p.x * 1664525u;
  p ^= p >> vec2u(16u);
  p.x += p.y * 1664525u; p.y += p.x * 1664525u;
  p ^= p >> vec2u(16u);
  return p;
}
fn rand2(pix : vec2u, frame : u32, dim : u32) -> vec2f {
  // R2 sequence over frames + Cranley-Patterson rotation per pixel/dimension
  let g = 1.32471795724474602596;
  let a = vec2f(1.0 / g, 1.0 / (g * g));
  let r2 = fract(a * f32(frame));
  let h = pcg2d(pix + vec2u(dim * 7919u, dim * 104729u));
  let cp = vec2f(f32(h.x & 0xffffu), f32(h.y & 0xffffu)) / 65536.0;
  return fract(r2 + cp);
}

/* ---- THE MONUMENT SDF — 8-fold folded, symmetric by construction --- */
fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
fn sdOcta(p : vec3f, s : f32) -> f32 {
  let q = abs(p);
  return (q.x + q.y + q.z - s) * 0.57735027;
}

fn monument(pin : vec3f) -> f32 {
  var p = pin;
  // 8-fold radial fold around Y — flip-test passes mathematically
  let ang = atan2(p.z, p.x);
  let seg = PI / 4.0;
  let a = abs((ang % seg + seg) % seg - seg * 0.5);
  let r = length(p.xz);
  p = vec3f(cos(a) * r, p.y, sin(a) * r);

  // tapered fluted shaft
  let taper = 0.34 - 0.052 * p.y;
  let flute = 0.0026 * sin(p.y * 18.0) + 0.0016 * sin(p.y * 47.0);
  var d = length(vec2f(p.x - 0.0, p.z)) - (taper + flute);
  d = max(d, abs(p.y) - 1.35);                    // shaft bounds
  // chamfered crown + base (octahedra, smin-fused)
  d = smin(d, sdOcta(pin - vec3f(0.0, 1.52, 0.0), 0.34), 0.10);
  d = smin(d, sdOcta(pin - vec3f(0.0, -1.42, 0.0), 0.46), 0.08);
  // equatorial ring groove
  let ring = abs(length(pin.xz) - (taper + 0.012)) - 0.006;
  d = max(d, -max(ring, abs(pin.y - 0.28) - 0.018));
  return d;
}

/* the ONE signal — a hairline emissive slit on the front axis */
fn slit(p : vec3f) -> f32 {
  let w = 0.0045;
  let core = max(abs(p.x) - w, abs(p.y) - 0.98);
  let front = max(core, -(p.z) + 0.28); // only where the face looks at camera
  return smoothstep(0.03, 0.0, front);
}

const FLOOR_Y : f32 = -1.86;

fn scene(p : vec3f) -> f32 {
  return monument(p);
}

fn normalAt(p : vec3f) -> vec3f {
  let e = 0.0009;
  return normalize(vec3f(
    scene(p + vec3f(e, 0.0, 0.0)) - scene(p - vec3f(e, 0.0, 0.0)),
    scene(p + vec3f(0.0, e, 0.0)) - scene(p - vec3f(0.0, e, 0.0)),
    scene(p + vec3f(0.0, 0.0, e)) - scene(p - vec3f(0.0, 0.0, e))));
}

/* sphere trace; returns t (<0 = miss), accumulates hairline glow */
fn march(ro : vec3f, rd : vec3f, tmax : f32, glow : ptr<function, f32>) -> f32 {
  var t = 0.002;
  for (var i = 0; i < 128; i++) {
    let p = ro + rd * t;
    let d = scene(p);
    *glow += 0.010 / (0.010 + d * d * 220.0) * 0.016; // carved-by-darkness halo
    if (d < 0.0008 * t + 0.0004) { return t; }
    t += d * 0.9;
    if (t > tmax) { break; }
  }
  return -1.0;
}

fn shadowRay(ro : vec3f, rd : vec3f, tmax : f32) -> f32 {
  var t = 0.012;
  for (var i = 0; i < 48; i++) {
    let d = scene(ro + rd * t);
    if (d < 0.0012) { return 0.0; }
    t += max(d, 0.012);
    if (t > tmax) { break; }
  }
  return 1.0;
}

fn ao(p : vec3f, n : vec3f) -> f32 {
  var occ = 0.0;
  var w = 0.72;
  for (var i = 1; i <= 5; i++) {
    let h = 0.012 + 0.05 * f32(i);
    occ += (h - scene(p + n * h)) * w;
    w *= 0.62;
  }
  return clamp(1.0 - 2.2 * occ, 0.0, 1.0);
}

/* ---- the overhead area light (the studio strip, physically sampled) */
const L_Y : f32 = 3.1;
const L_HALF : vec2f = vec2f(2.1, 0.55);   // x, z half-extents
const L_EMIT : vec3f = vec3f(5.0, 5.15, 5.6); // cold platinum-white

fn sampleLight(xi : vec2f) -> vec3f {
  return vec3f((xi.x * 2.0 - 1.0) * L_HALF.x, L_Y, (xi.y * 2.0 - 1.0) * L_HALF.y);
}

/* procedural void env — the reflection vocabulary: one strip, one cold band */
fn env(rd : vec3f) -> vec3f {
  var c = vec3f(0.0015, 0.0016, 0.0020);
  let strip = smoothstep(0.985, 0.998, rd.y) * smoothstep(0.75, 0.2, abs(rd.x));
  c += vec3f(0.9, 0.92, 1.0) * strip * 2.6;
  let band = exp(-40.0 * (rd.y - 0.12) * (rd.y - 0.12)) * 0.012;
  c += vec3f(0.72, 0.80, 1.0) * band;
  return c;
}

/* ---- anisotropic GGX (Heitz) — brushed platinum -------------------- */
fn f_schlick3(f0 : vec3f, u : f32) -> vec3f {
  return f0 + (vec3f(1.0) - f0) * pow(1.0 - u, 5.0);
}
fn d_ggx_aniso(NoH : f32, ToH : f32, BoH : f32, ax : f32, ay : f32) -> f32 {
  let a2 = ax * ay;
  let v = vec3f(ay * ToH, ax * BoH, a2 * NoH);
  let v2 = dot(v, v);
  let w2 = a2 / v2;
  return a2 * w2 * w2 / PI;
}
fn v_smith_aniso(NoV : f32, NoL : f32, ToV : f32, BoV : f32, ToL : f32, BoL : f32, ax : f32, ay : f32) -> f32 {
  let lV = NoL * length(vec3f(ax * ToV, ay * BoV, NoV));
  let lL = NoV * length(vec3f(ax * ToL, ay * BoL, NoL));
  return 0.5 / max(lV + lL, 1e-5);
}

struct Hit { p : vec3f, n : vec3f, isFloor : bool, }

/* shade one surface point from one stochastic light sample */
fn direct(h : Hit, v : vec3f, xi : vec2f, f0 : vec3f, ax : f32, ay : f32) -> vec3f {
  let lp = sampleLight(xi);
  let ld = lp - h.p;
  let dist2 = dot(ld, ld);
  let l = ld / sqrt(dist2);
  let NoL = dot(h.n, l);
  if (NoL <= 0.0) { return vec3f(0.0); }
  let vis = shadowRay(h.p + h.n * 0.004, l, sqrt(dist2));
  if (vis <= 0.0) { return vec3f(0.0); }

  // light geometry term (area light pointing down)
  let lightCos = max(-l.y * -1.0, 0.0); // facing down: normal (0,-1,0) → cos = l.y? l points up: cos = l.y
  let cosL = max(l.y, 0.0);
  let area = 4.0 * L_HALF.x * L_HALF.y;
  let pdfInv = area * cosL / max(dist2, 1e-4);

  // brushed tangent frame: grain runs vertically on the shaft
  var t = normalize(cross(vec3f(0.0, 1.0, 0.0), h.n) + vec3f(1e-4, 0.0, 0.0));
  if (h.isFloor) { t = vec3f(1.0, 0.0, 0.0); } // brushed radially → aniso along x
  let b = cross(h.n, t);

  let hv = normalize(l + v);
  let NoV = max(dot(h.n, v), 1e-4);
  let NoH = max(dot(h.n, hv), 0.0);
  let D = d_ggx_aniso(NoH, dot(t, hv), dot(b, hv), ax, ay);
  let Vs = v_smith_aniso(NoV, NoL, dot(t, v), dot(b, v), dot(t, l), dot(b, l), ax, ay);
  let F = f_schlick3(f0, max(dot(hv, v), 0.0));
  let spec = D * Vs * F;
  let diff = (vec3f(1.0) - F) * (0.012 / PI); // near-black dielectric floor under the metal? metals: tiny
  return (spec + diff) * L_EMIT * NoL * pdfInv * (0.5 + 0.5 * lightCos);
}
`;

const WGSL_TRACE = /* wgsl */ `
${WGSL_COMMON}
@group(0) @binding(1) var prevTex : texture_2d<f32>;
@group(0) @binding(2) var smp : sampler;

struct VOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, }

@vertex
fn vs(@builtin(vertex_index) vi : u32) -> VOut {
  var o : VOut;
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  o.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  o.uv = xy;
  return o;
}

fn shadePoint(h : Hit, v : vec3f, pix : vec2u, frame : u32, dimBase : u32) -> vec3f {
  var f0 = vec3f(0.85, 0.83, 0.79);            // platinum, 3-band
  var ax = 0.045; var ay = 0.30;               // brushed: tight across, long along
  var albedoScale = 1.0;
  if (h.isFloor) { f0 = vec3f(0.14, 0.145, 0.16); ax = 0.05; ay = 0.09; }

  var c = vec3f(0.0);
  // two stochastic light samples per frame — EMA converges the penumbra
  c += direct(h, v, rand2(pix, frame, dimBase), f0, ax, ay);
  c += direct(h, v, rand2(pix, frame, dimBase + 1u), f0, ax, ay);
  c *= 0.5;

  // env fresnel + AO
  let NoV = max(dot(h.n, v), 0.0);
  let F = f_schlick3(f0, NoV);
  let occ = ao(h.p, h.n);
  c += env(reflect(-v, h.n)) * F * occ * 0.55;
  c *= occ * albedoScale;

  // the ONE signal — emissive slit, breathing
  if (!h.isFloor) {
    let breathe = 0.75 + 0.25 * sin(u.cam.w * 0.5);
    c += vec3f(0.812, 0.890, 1.0) * slit(h.p) * 0.85 * breathe;
  }
  return c;
}

@fragment
fn fs(in : VOut) -> @location(0) vec4f {
  let pix = vec2u(in.pos.xy);
  let frame = u32(u.acc.y);

  // pixel-jittered primary ray — AA via accumulation
  let jit = rand2(pix, frame, 0u) - 0.5;
  let ndc = ((in.pos.xy + jit) / u.res.xy) * 2.0 - 1.0;
  let sc = vec2f(ndc.x * u.res.z, -ndc.y);

  // axis-locked camera; pointer tilts the world, never yaws off symmetry
  let dist = u.cam.z;
  let tilt = vec2f(u.cam.x, u.cam.y);
  let ro0 = vec3f(0.0, 0.52, dist);
  let fl = 2.35;
  var rd0 = normalize(vec3f(sc.x, sc.y, -fl));
  // small world tilt (rotation around X then Y)
  let cx = cos(tilt.y * 0.06); let sx = sin(tilt.y * 0.06);
  let cy = cos(tilt.x * 0.09); let sy = sin(tilt.x * 0.09);
  var ro = ro0; var rd = rd0;
  ro = vec3f(ro.x, ro.y * cx - ro.z * sx, ro.y * sx + ro.z * cx);
  rd = vec3f(rd.x, rd.y * cx - rd.z * sx, rd.y * sx + rd.z * cx);
  ro = vec3f(ro.x * cy + ro.z * sy, ro.y, -ro.x * sy + ro.z * cy);
  rd = vec3f(rd.x * cy + rd.z * sy, rd.y, -rd.x * sy + rd.z * cy);

  var glow = 0.0;
  var col = vec3f(0.0);

  let t = march(ro, rd, 14.0, &glow);
  // analytic polished floor
  let tf = select(1e9, (FLOOR_Y - ro.y) / rd.y, rd.y < -1e-4);

  if (t > 0.0 && t < tf) {
    let p = ro + rd * t;
    let n = normalAt(p);
    var h : Hit; h.p = p; h.n = n; h.isFloor = false;
    col = shadePoint(h, -rd, pix, frame, 2u);

    // one glossy bounce — GGX-jittered mirror
    let xi = rand2(pix, frame, 6u);
    let rdir = normalize(reflect(rd, n) + (vec3f(xi.x, rand2(pix, frame, 7u).x, xi.y) - 0.5) * 0.10);
    var g2 = 0.0;
    let t2 = march(p + n * 0.004, rdir, 8.0, &g2);
    var rc : vec3f;
    if (t2 > 0.0) {
      let p2 = p + n * 0.004 + rdir * t2;
      var h2 : Hit; h2.p = p2; h2.n = normalAt(p2); h2.isFloor = false;
      rc = shadePoint(h2, -rdir, pix, frame, 8u) * 0.9;
    } else {
      rc = env(rdir);
    }
    let F = f_schlick3(vec3f(0.85, 0.83, 0.79), max(dot(n, -rd), 0.0));
    col += rc * F * 0.35;
  } else if (tf < 14.0) {
    let p = ro + rd * tf;
    var h : Hit; h.p = p; h.n = vec3f(0.0, 1.0, 0.0); h.isFloor = true;
    col = shadePoint(h, -rd, pix, frame, 2u);

    // floor reflection of the monument — the mirror moment
    let xi = rand2(pix, frame, 6u);
    let rdir = normalize(reflect(rd, h.n) + (vec3f(xi.x - 0.5, 0.0, xi.y - 0.5)) * 0.045);
    var g2 = 0.0;
    let t2 = march(p + vec3f(0.0, 0.004, 0.0), rdir, 12.0, &g2);
    var rc : vec3f;
    if (t2 > 0.0) {
      let p2 = p + vec3f(0.0, 0.004, 0.0) + rdir * t2;
      var h2 : Hit; h2.p = p2; h2.n = normalAt(p2); h2.isFloor = false;
      rc = shadePoint(h2, -rdir, pix, frame, 8u);
      rc += vec3f(0.812, 0.890, 1.0) * slit(p2) * 1.2;
    } else {
      rc = env(rdir) * 0.6;
    }
    let Ff = f_schlick3(vec3f(0.14, 0.145, 0.16), max(-rd.y, 0.0));
    col += rc * Ff * glow * 0.0 + rc * Ff; // fresnel-weighted mirror
    glow += g2 * 0.4;
    // distance fade of the floor into void — text zone stays pure black
    col *= exp(-0.16 * tf) * smoothstep(-0.2, 0.9, 1.0 - abs(p.x) * 0.16);
  } else {
    col = env(rd) * 0.25;
  }

  // hairline halo — carved by darkness, kept subtle
  col += vec3f(0.85, 0.88, 0.97) * glow * 0.05;

  // EMA accumulation — soft shadows/gloss/AA converge over frames
  let prev = textureSampleLevel(prevTex, smp, in.uv, 0.0).rgb;
  let a = u.acc.x;
  let outc = mix(prev, col, a);
  return vec4f(outc, 1.0);
}
`;

const WGSL_PRESENT = /* wgsl */ `
${WGSL_COMMON}
@group(0) @binding(1) var accTex : texture_2d<f32>;
@group(0) @binding(2) var smp : sampler;

struct VOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f, }

@vertex
fn vs(@builtin(vertex_index) vi : u32) -> VOut {
  var o : VOut;
  let xy = vec2f(f32((vi << 1u) & 2u), f32(vi & 2u));
  o.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
  o.uv = xy;
  return o;
}

fn aces(x : vec3f) -> vec3f {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}
fn hash12(p : vec2f) -> f32 {
  var p3 = fract(vec3f(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

@fragment
fn fs(in : VOut) -> @location(0) vec4f {
  // micro chromatic dispersion — sub-pixel, gated to bright pixels only:
  // in dim gradients per-channel offsets read as hue noise (kills mono law)
  let ca = 0.0007;
  let cc = vec2f(0.5);
  let dir = in.uv - cc;
  let base = textureSampleLevel(accTex, smp, in.uv, 0.0).rgb;
  let r = textureSampleLevel(accTex, smp, in.uv + dir * ca, 0.0).r;
  let b = textureSampleLevel(accTex, smp, in.uv - dir * ca, 0.0).b;
  let lum = dot(base, vec3f(0.2126, 0.7152, 0.0722));
  let caW = smoothstep(0.18, 0.5, lum);
  var col = mix(base, vec3f(r, base.g, b), caW);

  col = aces(col * 1.05);

  // shadow neutrality — deep tones carry NO hue (8-bit quantization otherwise
  // snaps faint cold tint to out-of-band hues; OLED shadow is colorless)
  let lum2 = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col = mix(vec3f(lum2), col, smoothstep(0.0, 0.14, lum2));

  // vignette — symmetric
  let v = 1.0 - 0.34 * dot(dir * vec2f(1.6, 1.25), dir * vec2f(1.6, 1.25));
  col *= clamp(v, 0.0, 1.0);

  // sRGB out FIRST — grain lives in display space (linear grain lifts blacks)
  col = pow(max(col, vec3f(0.0)), vec3f(1.0 / 2.2));

  // animated film grain (never accumulated, post-transform — OLED stays OLED)
  let gr = (hash12(in.uv * u.res.xy + vec2f(u.cam.w * 61.7, u.cam.w * 123.3)) - 0.5) * 0.02;
  col = max(col + vec3f(gr) * (0.25 + 0.75 * col.g), vec3f(0.0));
  let alpha = u.acc.z;
  return vec4f(col * alpha, alpha);
}
`;

export async function createMonument(
  canvas: HTMLCanvasElement,
  opts: MonumentOptions
): Promise<MonumentHandle | null> {
  if (!("gpu" in navigator)) return null;
  const adapter = await navigator.gpu.requestAdapter().catch(() => null);
  if (!adapter) return null;
  const device = await adapter.requestDevice().catch(() => null);
  if (!device) return null;
  const dev = device;

  /* σ-gate: shaders must compile BEFORE the canvas is claimed */
  const traceModule = device.createShaderModule({ code: WGSL_TRACE });
  const presentModule = device.createShaderModule({ code: WGSL_PRESENT });
  const [ciT, ciP] = await Promise.all([
    traceModule.getCompilationInfo(),
    presentModule.getCompilationInfo(),
  ]);
  if (
    ciT.messages.some((m) => m.type === "error") ||
    ciP.messages.some((m) => m.type === "error")
  ) {
    device.destroy?.();
    return null;
  }

  const ctx = canvas.getContext("webgpu");
  if (!ctx) { device.destroy?.(); return null; }
  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({ device, format, alphaMode: "premultiplied" });

  const uniData = new Float32Array(12);
  const uniBuf = device.createBuffer({
    size: 48,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });

  const tracePipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: traceModule, entryPoint: "vs" },
    fragment: { module: traceModule, entryPoint: "fs", targets: [{ format: "rgba16float" }] },
    primitive: { topology: "triangle-list" },
  });
  const presentPipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: presentModule, entryPoint: "vs" },
    fragment: {
      module: presentModule,
      entryPoint: "fs",
      targets: [{
        format,
        blend: {
          color: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
          alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha" },
        },
      }],
    },
    primitive: { topology: "triangle-list" },
  });

  let texA: GPUTexture | null = null;
  let texB: GPUTexture | null = null;
  let traceBinds: GPUBindGroup[] = [];
  let presentBinds: GPUBindGroup[] = [];
  let texW = 0, texH = 0;

  function rebuildTargets(w: number, h: number) {
    texA?.destroy(); texB?.destroy();
    const mk = () =>
      dev.createTexture({
        size: { width: w, height: h },
        format: "rgba16float",
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      });
    texA = mk(); texB = mk();
    const mkTrace = (prev: GPUTexture) =>
      dev.createBindGroup({
        layout: tracePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniBuf } },
          { binding: 1, resource: prev.createView() },
          { binding: 2, resource: sampler },
        ],
      });
    const mkPresent = (acc: GPUTexture) =>
      dev.createBindGroup({
        layout: presentPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: uniBuf } },
          { binding: 1, resource: acc.createView() },
          { binding: 2, resource: sampler },
        ],
      });
    traceBinds = [mkTrace(texB!), mkTrace(texA!)];   // writing A samples B, and vice versa
    presentBinds = [mkPresent(texA!), mkPresent(texB!)];
    texW = w; texH = h;
  }

  /* state */
  let disposed = false;
  let frame = 0;
  let liveFrames = 0;
  let fade = 0;
  let last = performance.now();
  // critically-damped spring for pointer → tilt (k=12, c=7.5 — house feel)
  let tx = 0, ty = 0, tvx = 0, tvy = 0, px = 0, py = 0;

  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loop(now: number) {
    if (disposed) return;
    requestAnimationFrame(loop);
    if (!opts.getActive()) { last = now; return; }
    if (reduceMotion && frame > 90) return; // converged still frame — stop burning GPU

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h || !texA) {
      canvas.width = w; canvas.height = h;
      rebuildTargets(w, h);
      frame = 0; // reset accumulation on resize
    }

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    fade = Math.min(1, fade + dt * 0.5);

    // pointer spring — jitter never reaches the specular
    const k = 12, c = 7.5;
    tvx += (k * (px - tx) - c * tvx) * dt; tx += tvx * dt;
    tvy += (k * (py - ty) - c * tvy) * dt; ty += tvy * dt;

    // EMA alpha: fast warmup, then deep convergence; livelier under pointer motion
    const motion = Math.min(1, Math.hypot(tvx, tvy) * 3);
    const base = frame < 8 ? 0.5 : 0.065;
    const alpha = reduceMotion ? 1 / Math.min(frame + 1, 64) : Math.min(0.6, base + motion * 0.25);

    uniData.set([w, h, w / h, dpr], 0);
    uniData.set([tx, ty, 4.15, t], 4);
    uniData.set([alpha, frame, fade, reduceMotion ? 1 : 0], 8);
    dev.queue.writeBuffer(uniBuf, 0, uniData);

    const parity = frame % 2;
    const enc = dev.createCommandEncoder();
    const rp1 = enc.beginRenderPass({
      colorAttachments: [{
        view: (parity === 0 ? texA! : texB!).createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
        storeOp: "store",
      }],
    });
    rp1.setPipeline(tracePipeline);
    rp1.setBindGroup(0, traceBinds[parity]);
    rp1.draw(3);
    rp1.end();

    const rp2 = enc.beginRenderPass({
      colorAttachments: [{
        view: ctx!.getCurrentTexture().createView(),
        loadOp: "clear",
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        storeOp: "store",
      }],
    });
    rp2.setPipeline(presentPipeline);
    rp2.setBindGroup(0, presentBinds[parity]);
    rp2.draw(3);
    rp2.end();
    dev.queue.submit([enc.finish()]);

    frame++;
    if (liveFrames < 4) {
      liveFrames++;
      if (liveFrames === 3) opts.onLive?.();
    }
  }
  requestAnimationFrame(loop);

  return {
    kind: "monument-webgpu",
    setPointer(nx, ny) { px = nx; py = ny; },
    dispose() {
      disposed = true;
      texA?.destroy(); texB?.destroy(); uniBuf.destroy();
      dev.destroy?.();
    },
  };
}
