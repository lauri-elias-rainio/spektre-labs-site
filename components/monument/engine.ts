/// <reference types="@webgpu/types" />
/**
 * THE STORM LIGHTHOUSE — progressive raw-WebGPU tracer, v4.
 *
 * A true lighthouse in a storm sea: tapered fluted tower → gallery →
 * mullioned lantern room → the octad dome. The lantern sweeps one slow
 * beam over heaving swell; foam flashes where the light crosses a crest.
 * Twin mirrored moons hold the horizon. OLED void everywhere else.
 *
 * The sea is a raymarched animated heightfield (Seascape-style octaves,
 * secant tracing) shaped for storm: sharp crests, chop, whitecap foam by
 * crest + steepness heuristic. Mirrored across x = 0 BY CONSTRUCTION
 * (the field samples |x|) — the flip-test passes even in a storm.
 *
 * Performance architecture (the "laggy" fix): internal render scale 0.62,
 * dpr cap 1.5, ONE stochastic light sample per frame (EMA integrates),
 * analytic beam volumetric instead of stochastic god-rays, short shadow
 * rays. ~12x fewer shaded ops than v3. EMA accumulation carries quality.
 *
 * House law: grain in display space · CA gated to bright pixels · deep
 * shadows colorless · one signal (the beam) · hero_gate.py before ship.
 */

export interface MonumentHandle {
  kind: "monument-webgpu";
  setPointer: (nx: number, ny: number) => void;
  setScroll: (p: number) => void;
  dispose: () => void;
}

export interface MonumentOptions {
  onLive?: () => void;
  getActive: () => boolean;
}

const RES_SCALE = 0.9; // internal render scale — CAS + EMA carry the crisp

const WGSL_COMMON = /* wgsl */ `
struct U {
  res     : vec4f, // w, h, aspect, dpr
  cam     : vec4f, // tiltX, tiltY, scroll, time
  acc     : vec4f, // emaAlpha, frame, fade, reduced
  beam    : vec4f, // lantern uv.x, uv.y, facing (beam→camera), unused
}
@group(0) @binding(0) var<uniform> u : U;

const PI : f32 = 3.14159265;

/* ---- pcg / R2 low-discrepancy sampling ------------------------------ */
fn pcg2d(v : vec2u) -> vec2u {
  var p = v * 1664525u + 1013904223u;
  p.x += p.y * 1664525u; p.y += p.x * 1664525u;
  p ^= p >> vec2u(16u);
  p.x += p.y * 1664525u; p.y += p.x * 1664525u;
  p ^= p >> vec2u(16u);
  return p;
}
fn rand2(pix : vec2u, frame : u32, dim : u32) -> vec2f {
  let g = 1.32471795724474602596;
  let a = vec2f(1.0 / g, 1.0 / (g * g));
  let r2 = fract(a * f32(frame));
  let h = pcg2d(pix + vec2u(dim * 7919u, dim * 104729u));
  let cp = vec2f(f32(h.x & 0xffffu), f32(h.y & 0xffffu)) / 65536.0;
  return fract(r2 + cp);
}

/* ---- THE LIGHTHOUSE — 8-fold, symmetric by construction ------------- */
const APEX : f32 = 55.0;

fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
fn sdOcta(p : vec3f, s : f32) -> f32 {
  let q = abs(p);
  return (q.x + q.y + q.z - s) * 0.57735027;
}

/* stone-course recess — masonry carried as SDF, not texture */
fn twMasonry(y : f32, ang : f32) -> f32 {
  let cF    = y * 0.45455;          // y / 2.2 — course height
  let cIdx  = floor(cF);
  let cT    = cF - cIdx;
  let hj    = clamp(min(cT, 1.0 - cT) * 16.0, 0.0, 1.0);
  let hDisp = 0.012 * (1.0 - hj);
  let aOff  = fract(cIdx * 0.5) * (PI / 6.0); // running bond, no trig
  let bT    = fract((ang + aOff) * (6.0 / PI));
  let vj    = clamp(min(bT, 1.0 - bT) * 14.0, 0.0, 1.0);
  let vDisp = 0.006 * (1.0 - vj);
  return hDisp + vDisp;
}

fn tower(pin : vec3f) -> f32 {
  // cheap bound — keeps sea/fog rays fast
  let rr    = length(pin.xz);
  let bound = max(rr - 5.2, max(pin.y - (APEX + 1.5), -(pin.y + 5.0)));
  if (bound > 1.2) { return bound; }

  let ang = atan2(pin.z, pin.x);

  // tapered shaft — x^0.25 flute profile: ridges catch light as thin lines
  let taper    = 3.5 - 0.036 * pin.y;
  let fluteRaw = abs(sin(ang * 12.0));
  let flute    = 0.045 * sqrt(sqrt(fluteRaw));

  // masonry courses; fade out at the gallery transition
  let masDisp  = twMasonry(pin.y, ang) * smoothstep(50.5, 48.5, pin.y);

  var d = rr - (taper - flute) + masDisp;
  d = max(d, pin.y - 49.5);
  d = max(d, -(pin.y + 4.0));

  // the plinth — octad base under the waves
  d = smin(d, sdOcta(pin - vec3f(0.0, -2.2, 0.0), 4.6), 0.9);

  // the bezel — precision band at the equator (watch-grade)
  let teeth = 0.04 * abs(sin(ang * 36.0));
  let bez   = max(abs(rr - (3.5 - 0.036 * 18.0 + 0.26)) + teeth - 0.2,
                  abs(pin.y - 18.0) - 0.9);
  d = min(d, bez);

  // the gallery — two discs the keeper would walk
  let gal1 = max(rr - 2.25, abs(pin.y - 49.9) - 0.22);
  let gal2 = max(rr - 1.95, abs(pin.y - 50.9) - 0.10);
  d = min(d, min(gal1, gal2));

  // the lantern room — glass cylinder with 8 mullions
  let mull = 0.05 * abs(sin(ang * 4.0));
  let lant = max(rr - (1.35 - mull), abs(pin.y - 51.9) - 1.7);
  d = min(d, lant);

  // the dome — the octad crown, the brand seal at the summit
  d = smin(d, sdOcta(pin - vec3f(0.0, 54.2, 0.0), 1.65), 0.35);

  // gantry seams every 8 units — the human-scale cue
  let seam = (abs(fract(pin.y / 8.0 + 0.5) - 0.5)) * 8.0;
  d = max(d, -max(0.05 - seam, -(rr - (taper - 0.10))));

  return d;
}

fn scene(p : vec3f) -> f32 { return tower(p); }

/* 8-fold glyph etching — mystique carried in light, not paint */
fn glyphMask(p : vec3f) -> f32 {
  let ang = atan2(p.z, p.x);
  let band = smoothstep(2.0, 1.1, abs(p.y - 28.0));
  let g1 = smoothstep(0.10, 0.02, abs(abs(sin(ang * 4.0)) - 0.55));
  let g2 = smoothstep(0.35, 0.0, abs(sin(ang * 16.0 + p.y * 0.8)) - 0.5);
  return band * clamp(g1 * 0.6 + g2 * 0.25, 0.0, 1.0);
}

fn normalAt(p : vec3f) -> vec3f {
  let e = 0.006;
  return normalize(vec3f(
    scene(p + vec3f(e, 0.0, 0.0)) - scene(p - vec3f(e, 0.0, 0.0)),
    scene(p + vec3f(0.0, e, 0.0)) - scene(p - vec3f(0.0, e, 0.0)),
    scene(p + vec3f(0.0, 0.0, e)) - scene(p - vec3f(0.0, 0.0, e))));
}

fn march(ro : vec3f, rd : vec3f, tmax : f32) -> f32 {
  var t = 0.02;
  for (var i = 0; i < 88; i++) {
    let d = scene(ro + rd * t);
    if (d < 0.0014 * t + 0.002) { return t; }
    t += d * 0.95;
    if (t > tmax) { break; }
  }
  return -1.0;
}

fn shadowRay(ro : vec3f, rd : vec3f, tmax : f32) -> f32 {
  // Aaltonen-improved penumbra (iq rmshadows) — banding-free soft shadow
  var res = 1.0;
  var ph = 1e10;
  var t = 0.10;
  for (var i = 0; i < 22; i++) {
    let h = scene(ro + rd * t);
    if (h < 0.008) { return 0.0; }
    let y = h * h / (2.0 * ph);
    let d = sqrt(h * h - y * y);
    res = min(res, d / (0.12 * max(t - y, 0.001)));
    ph = h;
    t += max(h, 0.14);
    if (t > tmax) { break; }
  }
  return clamp(res, 0.0, 1.0);
}

fn ao(p : vec3f, n : vec3f) -> f32 {
  var occ = 0.0;
  var w = 0.75;
  for (var i = 1; i <= 4; i++) {
    let h = 0.09 + 0.38 * f32(i);
    occ += (h - scene(p + n * h)) * w;
    w *= 0.6;
  }
  return clamp(1.0 - 1.4 * occ, 0.0, 1.0);
}

/* ---- THE STORM SEA — raymarched heightfield, mirrored by |x| -------- */
fn hash21(p : vec2f) -> f32 {
  let h = dot(p, vec2f(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}
fn vnoise(p : vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let uf = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2f(1.0, 0.0)), uf.x),
    mix(hash21(i + vec2f(0.0, 1.0)), hash21(i + vec2f(1.0, 1.0)), uf.x),
    uf.y) * 2.0 - 1.0;
}
/* One Gerstner component: height + analytic gradient + Jacobian term.
   Crest sharpening A*|sin phi|^(2-Q) — flat troughs, pinched storm crests. */
fn swComponent(pxz : vec2f, tt : f32,
               k : f32, a : f32, om : f32,
               dx : f32, dz : f32) -> vec4f {
  let ph  = k * (dx * pxz.x + dz * pxz.y) - om * tt;
  let q   = k * a;                 // steepness Q = k*A
  let es  = 2.0 - q;
  let spv = sin(ph);
  let asp = max(abs(spv), 1e-7);
  let hi  = a * pow(asp, es);
  let dhp = a * es * pow(asp, es - 1.0) * sign(spv) * cos(ph);
  return vec4f(hi, dhp * k * dx, dhp * k * dz, q * cos(ph));
}

/* 8-component JONSWAP storm table (gamma 4-5), mirrored pairs across x=0:
   h(-x,z) = h(x,z) EXACTLY — the storm passes the flip-test by algebra.
   Deep-water dispersion om = sqrt(9.81*k), precomputed. */
fn swGradH(pxz : vec2f, tt : f32) -> vec4f {
  var acc = vec4f(0.0);
  // dominant swell  lambda~26  A=1.30  ±11°
  acc += swComponent(pxz, tt, 0.24166, 1.95, 1.5397,  0.19081, 0.98163);
  acc += swComponent(pxz, tt, 0.24166, 1.95, 1.5397, -0.19081, 0.98163);
  // medium swell    lambda~14  A=0.72  ±22°
  acc += swComponent(pxz, tt, 0.44880, 1.08, 2.0982,  0.37461, 0.92718);
  acc += swComponent(pxz, tt, 0.44880, 1.08, 2.0982, -0.37461, 0.92718);
  // chop            lambda~7.5 A=0.38  ±38°
  acc += swComponent(pxz, tt, 0.83776, 0.57, 2.8667,  0.61566, 0.78801);
  acc += swComponent(pxz, tt, 0.83776, 0.57, 2.8667, -0.61566, 0.78801);
  // detail          lambda~3.6 A=0.12  ±58°
  acc += swComponent(pxz, tt, 1.74533, 0.18, 4.1378,  0.84805, 0.52992);
  acc += swComponent(pxz, tt, 1.74533, 0.18, 4.1378, -0.84805, 0.52992);
  return vec4f(acc.x, acc.y, acc.z, 1.0 - acc.w); // .w = Jacobian proxy
}

/* coarse height (swell pairs only) — feeds the secant march */
fn swCoarseH(pxz : vec2f, tt : f32) -> f32 {
  var h = 0.0;
  h += swComponent(pxz, tt, 0.24166, 1.95, 1.5397,  0.19081, 0.98163).x;
  h += swComponent(pxz, tt, 0.24166, 1.95, 1.5397, -0.19081, 0.98163).x;
  h += swComponent(pxz, tt, 0.44880, 1.08, 2.0982,  0.37461, 0.92718).x;
  h += swComponent(pxz, tt, 0.44880, 1.08, 2.0982, -0.37461, 0.92718).x;
  return h;
}

fn swVnoise2(p : vec2f) -> f32 {
  let v0 = vnoise(p) * 0.5 + 0.5;
  let v1 = vnoise(p * 2.17 + vec2f(17.31, 41.73)) * 0.5 + 0.5;
  return v0 * 0.65 + v1 * 0.35;
}

fn seaH(pxz0 : vec2f, t : f32) -> f32 { return swCoarseH(pxz0, t); }

fn seaNormal(p : vec3f, t : f32, dist : f32) -> vec3f {
  let gH = swGradH(p.xz, t);
  let blend = smoothstep(18.0, 88.0, dist) * 0.52;
  return normalize(vec3f(mix(-gH.y, 0.0, blend), 1.0, mix(-gH.z, 0.0, blend)));
}

const SEA_HMAX : f32 = 6.5;

fn seaMarch(ro : vec3f, rd : vec3f, tmax : f32, t : f32) -> f32 {
  if (rd.y >= -0.004) { return -1.0; }
  var tlo = max((SEA_HMAX - ro.y) / rd.y, 0.0);
  var thi = min((0.0 - ro.y) / rd.y, tmax);
  if (tlo >= thi) { return -1.0; }
  var plo = ro + rd * tlo;
  var hlo = plo.y - seaH(plo.xz, t);
  if (hlo < 0.0) { return tlo; }
  let phi = ro + rd * thi;
  var hhi = phi.y - seaH(phi.xz, t);
  if (hhi > 0.0) { return thi; }
  var tm = tlo;
  for (var i = 0; i < 9; i++) {
    tm = mix(tlo, thi, hlo / (hlo - hhi));
    let pm = ro + rd * tm;
    let hm = pm.y - seaH(pm.xz, t);
    if (hm < 0.0) { thi = tm; hhi = hm; } else { tlo = tm; hlo = hm; }
  }
  return tm;
}



/* ---- the key light — one vast cold strip above-behind ---------------- */
const L_Y : f32 = 84.0;
const L_Z : f32 = -34.0;
const L_HALF : vec2f = vec2f(24.0, 8.0);
const L_EMIT : vec3f = vec3f(150.0, 155.0, 170.0);

fn sampleLight(xi : vec2f) -> vec3f {
  return vec3f((xi.x * 2.0 - 1.0) * L_HALF.x, L_Y, L_Z + (xi.y * 2.0 - 1.0) * L_HALF.y);
}

/* twin mirrored moons + void — the shoreworld sky */
fn env(rd : vec3f) -> vec3f {
  var c = vec3f(0.0012, 0.0013, 0.0017);
  let up = smoothstep(0.86, 0.995, rd.y);
  c += vec3f(0.55, 0.57, 0.64) * up * 0.008;
  let e = normalize(vec3f(0.42, 0.115, -0.9));
  let m1 = vec3f(-e.x, e.y, e.z);
  let d1 = max(dot(rd, e), 0.0);
  let d2 = max(dot(rd, m1), 0.0);
  let disc = smoothstep(0.99988, 0.99997, d1) + smoothstep(0.99988, 0.99997, d2);
  let halo = pow(d1, 3200.0) + pow(d2, 3200.0);
  c += vec3f(0.82, 0.86, 0.95) * (disc * 1.6 + halo * 0.18);
  let dy = rd.y - 0.10;
  let band = exp(-30.0 * dy * dy) * 0.0016;
  c += vec3f(0.74, 0.80, 0.96) * band;
  return c;
}

/* ---- THE LANTERN — the sweeping beam, the ONE signal ----------------- */
const LANTERN : vec3f = vec3f(0.0, 51.9, 0.0);

fn beamDir(t : f32) -> vec3f {
  let th = t * 0.40; // one sweep ≈ 16 s — lighthouse patience
  return normalize(vec3f(cos(th), -0.055, sin(th)));
}

/* analytic pencil scatter — closest approach between ray and beam line */
fn beamScatter(ro : vec3f, rd : vec3f, tmaxv : f32, t : f32) -> f32 {
  let bd = beamDir(t);
  let w0 = ro - LANTERN;
  let b = dot(rd, bd);
  let d0 = dot(rd, w0);
  let e0 = dot(bd, w0);
  let denom = 1.0 - b * b;
  if (abs(denom) < 1e-4) { return 0.0; }
  let sray = (b * e0 - d0) / denom;
  let sbeam = (e0 - b * d0) / denom;
  if (sray < 0.5 || sray > tmaxv || sbeam < 2.5 || sbeam > 160.0) { return 0.0; }
  let pr = ro + rd * sray;
  let pb = LANTERN + bd * sbeam;
  let r = length(pr - pb);
  let R = 0.55 + sbeam * 0.024;
  let q = exp(-(r * r) / (R * R));
  let core = q * q; // squared — no gamma-lifted tail
  let att = 1.0 / (1.0 + sbeam * sbeam * 0.0016);
  let mu = dot(rd, bd);
  let g = 0.5;
  let ph = (1.0 - g * g) / (4.0 * PI * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
  // storm spray keeps the beam readable even where height-fog thins
  return core * att * ph * (fogDensity(pr.y) + 0.009) * 760.0;
}

/* ---- storm atmosphere — mist hugs the sea, the summit stays clear ---- */
const FOG_T : f32 = 0.040;
const FOG_KY : f32 = 0.10;
fn fogDensity(y : f32) -> f32 {
  return FOG_T * exp(-max(y, 0.0) * FOG_KY);
}
fn transmittance(ro : vec3f, rd : vec3f, t : f32) -> f32 {
  let dy = rd.y;
  var tau : f32;
  if (abs(dy) < 1e-4) {
    tau = fogDensity(ro.y) * t;
  } else {
    tau = abs((FOG_T / (-FOG_KY * dy)) *
      (exp(-FOG_KY * max(ro.y + dy * t, 0.0)) - exp(-FOG_KY * max(ro.y, 0.0))));
  }
  return exp(-tau);
}

/* ---- anisotropic GGX — brushed platinum ------------------------------ */
fn f_schlick3(f0 : vec3f, uu : f32) -> vec3f {
  return f0 + (vec3f(1.0) - f0) * pow(1.0 - uu, 5.0);
}
fn d_ggx_aniso(NoH : f32, ToH : f32, BoH : f32, ax : f32, ay : f32) -> f32 {
  let a2 = ax * ay;
  let v = vec3f(ay * ToH, ax * BoH, a2 * NoH);
  let v2 = dot(v, v);
  let w2 = a2 / v2;
  return a2 * w2 * w2 / PI;
}
fn v_smith(NoV : f32, NoL : f32) -> f32 {
  return 0.5 / max(NoL * NoV * 2.0 + 0.05, 1e-4);
}

struct Hit { p : vec3f, n : vec3f, kind : u32, } // 0 = tower, 1 = sea

fn direct(h : Hit, v : vec3f, xi : vec2f, f0 : vec3f, ax : f32, ay : f32) -> vec3f {
  let lp = sampleLight(xi);
  let ld = lp - h.p;
  let dist2 = dot(ld, ld);
  let l = ld / sqrt(dist2);
  let NoL = dot(h.n, l);
  if (NoL <= 0.0) { return vec3f(0.0); }
  let vis = shadowRay(h.p + h.n * 0.03, l, sqrt(dist2));
  if (vis <= 0.001) { return vec3f(0.0); }

  let cosL = max(l.y, 0.0);
  let area = 4.0 * L_HALF.x * L_HALF.y;
  let pdfInv = area * cosL / max(dist2, 1e-4);

  var tang = normalize(cross(vec3f(0.0, 1.0, 0.0), h.n) + vec3f(1e-4, 0.0, 0.0));
  if (h.kind == 1u) { tang = vec3f(1.0, 0.0, 0.0); }
  let bit = cross(h.n, tang);

  let hv = normalize(l + v);
  let NoV = max(dot(h.n, v), 1e-4);
  let NoH = max(dot(h.n, hv), 0.0);
  let D = d_ggx_aniso(NoH, dot(tang, hv), dot(bit, hv), ax, ay);
  let Vs = v_smith(NoV, NoL);
  let F = f_schlick3(f0, max(dot(hv, v), 0.0));
  return (D * Vs * F) * L_EMIT * NoL * pdfInv * vis;
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

const SIGNAL : vec3f = vec3f(0.812, 0.890, 1.0);

/* the lantern's spot irradiance at a point (sector-gated inverse-square) */
fn lanternIrr(p : vec3f, t : f32) -> f32 {
  let bd = beamDir(t);
  let dl = p - LANTERN;
  let dist2 = dot(dl, dl);
  let gate = pow(max(dot(dl / sqrt(dist2), bd), 0.0), 380.0);
  return gate * 620.0 / (1.0 + dist2 * 0.9);
}

fn twHash3(p : vec3f) -> vec3f {
  return fract(sin(vec3f(
    dot(p.xy, vec2f(127.1, 311.7)),
    dot(p.yz, vec2f(269.5, 183.3)),
    dot(p.xz, vec2f(113.5, 271.9))
  )) * 43758.5453) * 2.0 - 1.0;
}

fn shadeTower(h : Hit, v : vec3f, pix : vec2u, frame : u32, dimBase : u32, t : f32) -> vec3f {
  var f0 = vec3f(0.86, 0.84, 0.80);
  var ax = 0.14; var ay = 0.38;

  // wet band — rain film on the lower stones: near-mirror above the waterline
  let wetMask = smoothstep(6.0, 0.0, h.p.y);
  ax *= 1.0 - wetMask * 0.70;
  ay *= 1.0 - wetMask * 0.70;
  f0  = mix(f0, f0 + vec3f(0.020, 0.020, 0.028), wetMask);

  // micro-normal breakup — grid-quantized so EMA converges (no shimmer)
  let mnGrid = floor(h.p * 7.0) / 7.0;
  let mn     = twHash3(mnGrid);
  let microAmp = 0.018 * max(0.0, dot(h.n, v));
  let sn       = normalize(h.n + mn * microAmp);

  var hS : Hit; hS.p = h.p; hS.n = sn; hS.kind = h.kind;

  var c = min(direct(hS, v, rand2(pix, frame, dimBase), f0, ax, ay), vec3f(5.0));

  let NoV = max(dot(sn, v), 0.0);
  let F   = f_schlick3(f0, NoV);
  let occ = ao(h.p, h.n); // geometric normal for AO — stable under EMA
  c += env(reflect(-v, sn)) * F * occ * 1.8;
  // frontal fill — the tower reads as form, not a void seam
  c += f0 * 0.0045 * max(dot(sn, normalize(vec3f(0.0, 0.35, 1.0))), 0.0) * occ;
  c *= occ;

  // wet stone absorbs a touch more
  c *= 1.0 - wetMask * 0.10;

  c *= 1.0 - glyphMask(h.p) * 0.45;

  // the lantern room — beam glow + glass fresnel + mullion rim
  let band = smoothstep(1.9, 0.6, abs(h.p.y - 51.9));
  if (band > 0.0) {
    let bd2    = beamDir(t);
    let facing = pow(max(dot(normalize(vec2f(h.p.x, h.p.z)), normalize(bd2.xz)), 0.0), 6.0);
    c += SIGNAL * band * (0.05 + 1.0 * facing);

    let hAng    = atan2(h.p.z, h.p.x);
    let mullFac = abs(sin(hAng * 4.0));
    let grazing = pow(max(1.0 - dot(h.n, v), 0.0), 3.0);
    c += SIGNAL * band * mullFac * grazing * 0.22;

    let mullEdge = band * smoothstep(0.20, 0.03, mullFac);
    c += SIGNAL * mullEdge * 0.007;
  }

  return c;
}

@fragment
fn fs(in : VOut) -> @location(0) vec4f {
  let pix = vec2u(in.pos.xy);
  let frame = u32(u.acc.y);
  let time = u.cam.w;
  let scroll = clamp(u.cam.z, 0.0, 1.0);

  let jit = rand2(pix, frame, 0u) - 0.5;
  let ndc = ((in.pos.xy + jit) / u.res.xy) * 2.0 - 1.0;
  let sc = vec2f(ndc.x * u.res.z, -ndc.y);

  // low camera in the swell, gazing up — scroll pulls back: the scale reveal
  let ro = vec3f(0.0, 8.6 + scroll * 1.6, 76.0 + scroll * 14.0);
  let lookUp = 0.235 - scroll * 0.02 + u.cam.y * 0.026;
  let yaw = u.cam.x * 0.038;
  let fl = 1.65;
  var rd = normalize(vec3f(sc.x, sc.y, -fl));
  let cp = cos(lookUp); let sp = sin(lookUp);
  rd = vec3f(rd.x, rd.y * cp + rd.z * -sp, rd.y * sp + rd.z * cp);
  let cy = cos(yaw); let sy = sin(yaw);
  rd = vec3f(rd.x * cy + rd.z * sy, rd.y, -rd.x * sy + rd.z * cy);

  var col = vec3f(0.0);

  let tc = march(ro, rd, 240.0);
  let tw = seaMarch(ro, rd, 200.0, time);
  let seaFirst = tw > 0.0 && (tc < 0.0 || tw < tc);

  if (!seaFirst && tc > 0.0) {
    /* ── THE TOWER ── */
    let p = ro + rd * tc;
    var h : Hit; h.p = p; h.n = normalAt(p); h.kind = 0u;
    col = shadeTower(h, -rd, pix, frame, 2u, time);

    // one glossy bounce
    let xi = rand2(pix, frame, 6u);
    let rdir = normalize(reflect(rd, h.n) +
      (vec3f(xi.x, rand2(pix, frame, 7u).x, xi.y) - 0.5) * 0.12);
    let t2 = march(p + h.n * 0.03, rdir, 90.0);
    var rc : vec3f;
    if (t2 > 0.0) {
      let p2 = p + h.n * 0.03 + rdir * t2;
      var h2 : Hit; h2.p = p2; h2.n = normalAt(p2); h2.kind = 0u;
      rc = shadeTower(h2, -rdir, pix, frame, 8u, time) * 0.9;
    } else { rc = env(rdir); }
    let F = f_schlick3(vec3f(0.86, 0.84, 0.80), max(dot(h.n, -rd), 0.0));
    col += rc * F * 0.32;
    col *= transmittance(ro, rd, tc);
  } else if (seaFirst) {
    /* ── THE STORM SEA — JONSWAP Gerstner · Jacobian foam · moon glitter ── */
    let p = ro + rd * tw;

    // one analytic call drives normal, foam and glitter
    let gH = swGradH(p.xz, time);
    let nBl = smoothstep(18.0, 88.0, tw) * 0.52;
    let n = normalize(vec3f(mix(-gH.y, 0.0, nBl), 1.0, mix(-gH.z, 0.0, nBl)));
    let NoV = max(dot(n, -rd), 0.0);
    let Fw = 0.028 + 0.972 * pow(1.0 - NoV, 5.0); // wet Schlick

    // graded body: trough → OLED void, crest body → cold dark grey
    let depthG = smoothstep(0.0, 4.5, p.y);
    var c = mix(vec3f(0.00090, 0.00105, 0.00140),
                vec3f(0.0068, 0.0078, 0.0104), depthG);
    c *= 0.48 + 0.52 * n.y;
    let lKey = normalize(vec3f(0.0, L_Y, L_Z) - p);
    c += vec3f(0.0032, 0.0035, 0.0045) * max(dot(n, lKey), 0.0);
    let sideF = (1.0 - n.y) * smoothstep(-0.1, 0.5, n.y) * 0.42;
    c += vec3f(0.00095, 0.00110, 0.00145) * sideF;

    // backlit crest subsurface — gated to tall water
    let crestH = smoothstep(1.4, 4.7, p.y);
    let backlit = pow(max(dot(rd, lKey), 0.0), 2.0) * 0.5 + 0.5;
    c += vec3f(0.042, 0.045, 0.058) * crestH * backlit * (0.38 + 0.62 * (1.0 - NoV));

    // Jacobian-proxy foam — compression + steepness + crest, noise-broken
    let slope = length(gH.yz);
    let foamJ = clamp(1.0 - gH.w, 0.0, 1.0);
    let foamS = smoothstep(0.26, 0.74, slope);
    let foamH = smoothstep(1.9, 4.8, p.y);
    let brup = swVnoise2(p.xz * 0.45 + vec2f(0.0, time * 0.22));
    let foam = clamp((foamH * 0.9 + foamS * 0.55 + foamJ * 0.3) * (0.28 + 0.72 * brup), 0.0, 1.0);
    let fLamb = clamp(dot(n, lKey) * 0.62 + 0.09, 0.0, 1.0);
    let fCol = vec3f(0.13, 0.132, 0.142) * fLamb;
    c = mix(c, fCol, foam);

    // the reflection — tower wet mirror + moons in the swell
    let rdir = reflect(rd, n);
    var rc : vec3f;
    let t2 = march(p + vec3f(0.0, 0.04, 0.0), rdir, 120.0);
    if (t2 > 0.0) {
      let p2 = p + vec3f(0.0, 0.04, 0.0) + rdir * t2;
      var h2 : Hit; h2.p = p2; h2.n = normalAt(p2); h2.kind = 0u;
      rc = shadeTower(h2, -rdir, pix, frame, 8u, time);
      rc *= transmittance(p, rdir, t2);
    } else { rc = env(rdir); }
    c += rc * Fw * (1.0 - foam * 0.88);

    // moon glitter — tight spec on detail normals, both moons
    let md1 = normalize(vec3f(0.42, 0.115, -0.9));
    let md2 = vec3f(-md1.x, md1.y, md1.z);
    let hm1 = normalize(md1 - rd);
    let hm2 = normalize(md2 - rd);
    let mS = pow(max(dot(n, hm1), 0.0), 280.0) * max(dot(n, md1), 0.0)
           + pow(max(dot(n, hm2), 0.0), 280.0) * max(dot(n, md2), 0.0);
    c += SIGNAL * mS * 0.06 * (1.0 - foam * 0.78);

    // the lantern beam — glitter on water, glow on foam
    let irr = lanternIrr(p, time);
    if (irr > 0.0005) {
      let Ld = normalize(LANTERN - p);
      let hv2 = normalize(Ld - rd);
      let gl = pow(max(dot(n, hv2), 0.0), 500.0) * (1.0 - foam);
      let fo = foam * max(dot(n, Ld), 0.0) * 0.5;
      c += SIGNAL * (gl * 1.6 + fo) * irr;
    }

    col = c * transmittance(ro, rd, tw);
  } else {
    col = env(rd);
  }

  // the beam through the storm air — THE signal
  var vtb = 240.0;
  if (seaFirst) { vtb = tw; } else if (tc > 0.0) { vtb = tc; }
  col += SIGNAL * beamScatter(ro, rd, vtb, time);

  // framebuffer-aligned uv — vertex uv is vertically flipped vs texel rows
  let suv = in.pos.xy / u.res.xy;
  let prev = textureSampleLevel(prevTex, smp, suv, 0.0).rgb;
  let outc = mix(prev, col, u.acc.x);
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
  // framebuffer-aligned uv — vertex uv is vertically flipped vs texel rows
  let suv = in.pos.xy / u.res.xy;
  // chromatic dispersion — gated to bright pixels (mono law in the dark)
  let ca = 0.0007;
  let cc = vec2f(0.5);
  let dir = suv - cc;
  let base = textureSampleLevel(accTex, smp, suv, 0.0).rgb;
  let r = textureSampleLevel(accTex, smp, suv + dir * ca, 0.0).r;
  let b = textureSampleLevel(accTex, smp, suv - dir * ca, 0.0).b;
  let lum = dot(base, vec3f(0.2126, 0.7152, 0.0722));
  let caW = smoothstep(0.18, 0.5, lum);
  var col = mix(base, vec3f(r, base.g, b), caW);

  // crepuscular radial god-rays (GPU Gems 3 ch.13) — when the beam sweeps
  // past the camera, the whole frame streaks toward the lantern
  let facing = u.beam.z;
  if (facing > 0.004 && u.beam.y > -0.5) {
    let lp = u.beam.xy;
    var uvr = suv;
    let stepv = (lp - suv) / 26.0;
    var accR = 0.0;
    var wgt = 1.0;
    for (var i = 0; i < 26; i++) {
      uvr += stepv;
      let sc = textureSampleLevel(accTex, smp, uvr, 0.0).rgb;
      accR += dot(sc, vec3f(0.2126, 0.7152, 0.0722)) * wgt;
      wgt *= 0.90;
    }
    col += vec3f(0.812, 0.890, 1.0) * accR * facing * 0.05;
  }

  col = aces(col * 1.05);

  // shadow neutrality — deep tones carry NO hue (OLED shadow is colorless)
  let lum2 = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col = mix(vec3f(lum2), col, smoothstep(0.0, 0.14, lum2));

  // vignette — symmetric
  let v = 1.0 - 0.34 * dot(dir * vec2f(1.6, 1.25), dir * vec2f(1.6, 1.25));
  col *= clamp(v, 0.0, 1.0);

  // sRGB FIRST — grain lives in display space (linear grain lifts blacks)
  col = pow(max(col, vec3f(0.0)), vec3f(1.0 / 2.2));

  // CAS-style sharpen in display space — local min/max clamp, no halos
  {
    let px = 1.0 / u.res.xy;
    let tone = vec3f(1.0 / 2.2);
    let nN = pow(max(aces(textureSampleLevel(accTex, smp, suv + vec2f(0.0, -px.y), 0.0).rgb * 1.05), vec3f(0.0)), tone);
    let nS = pow(max(aces(textureSampleLevel(accTex, smp, suv + vec2f(0.0,  px.y), 0.0).rgb * 1.05), vec3f(0.0)), tone);
    let nW = pow(max(aces(textureSampleLevel(accTex, smp, suv + vec2f(-px.x, 0.0), 0.0).rgb * 1.05), vec3f(0.0)), tone);
    let nE = pow(max(aces(textureSampleLevel(accTex, smp, suv + vec2f( px.x, 0.0), 0.0).rgb * 1.05), vec3f(0.0)), tone);
    let mn = min(col, min(min(nN, nS), min(nW, nE)));
    let mx = max(col, max(max(nN, nS), max(nW, nE)));
    let k = 0.16;
    col = clamp(col * (1.0 + 4.0 * k) - (nN + nS + nW + nE) * k, mn, mx);
  }

  let gr = (hash12(suv * u.res.xy + vec2f(u.cam.w * 61.7, u.cam.w * 123.3)) - 0.5) * 0.02;
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
  const wgslErrors = [...ciT.messages, ...ciP.messages].filter((m) => m.type === "error");
  if (wgslErrors.length) {
    // σ-gate diagnostics — a silent fallback hides the actual failure
    console.warn("[monument] WGSL compile errors:", wgslErrors.map((m) => `${m.lineNum}: ${m.message}`).join(" | "));
    device.destroy?.();
    return null;
  }

  const ctx = canvas.getContext("webgpu");
  if (!ctx) { device.destroy?.(); return null; }
  const format = navigator.gpu.getPreferredCanvasFormat();
  ctx.configure({ device, format, alphaMode: "premultiplied" });

  const uniData = new Float32Array(16);
  const uniBuf = device.createBuffer({
    size: 64,
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
    traceBinds = [mkTrace(texB!), mkTrace(texA!)];
    presentBinds = [mkPresent(texA!), mkPresent(texB!)];
  }

  let disposed = false;
  let frame = 0;
  let liveFrames = 0;
  let fade = 0;
  let last = performance.now();
  let tx = 0, ty = 0, tvx = 0, tvy = 0, px = 0, py = 0;
  let scroll = 0, scrollTarget = 0;

  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loop(now: number) {
    if (disposed) return;
    requestAnimationFrame(loop);
    if (!opts.getActive()) { last = now; return; }
    if (reduceMotion && frame > 110) return; // converged still — GPU off

    // performance law: internal scale + dpr cap; CSS upscales, EMA sharpens
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * RES_SCALE;
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h || !texA) {
      canvas.width = w; canvas.height = h;
      rebuildTargets(w, h);
      frame = 0;
    }

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    fade = Math.min(1, fade + dt * 0.5);

    // critically-damped springs — jitter never reaches the gaze
    const k = 12, c = 7.5;
    tvx += (k * (px - tx) - c * tvx) * dt; tx += tvx * dt;
    tvy += (k * (py - ty) - c * tvy) * dt; ty += tvy * dt;
    const scrollPrev = scroll;
    scroll += (scrollTarget - scroll) * Math.min(1, dt * 5);

    // EMA alpha: the sea MOVES — keep the integrator responsive, let the
    // jittered AA and light sampling average within a short window
    const motion = Math.min(
      1,
      Math.hypot(tvx, tvy) * 3 + Math.abs(scroll - scrollPrev) * 220
    );
    const base = frame < 8 ? 0.55 : 0.16;
    const alpha = reduceMotion
      ? 1 / Math.min(frame + 1, 64)
      : Math.min(0.7, base + motion * 0.35);

    uniData.set([w, h, w / h, dpr], 0);
    uniData.set([tx, ty, scroll, t], 4);
    uniData.set([alpha, frame, fade, reduceMotion ? 1 : 0], 8);

    // project the lantern into screen uv + how squarely the beam faces us
    // (mirrors the WGSL camera exactly — keep in sync)
    {
      const roY = 8.6 + scroll * 1.6, roZ = 76.0 + scroll * 14.0;
      const lookUp = 0.235 - scroll * 0.02 + ty * 0.026;
      const yaw = tx * 0.038;
      const fl = 1.65;
      // world → camera: inverse yaw, then inverse pitch
      let dx = 0 - 0, dy = 51.9 - roY, dz = 0 - roZ;
      const cyw = Math.cos(-yaw), syw = Math.sin(-yaw);
      const x1 = dx * cyw + dz * syw, z1 = -dx * syw + dz * cyw;
      const cpt = Math.cos(-lookUp), spt = Math.sin(-lookUp);
      const y2 = dy * cpt - z1 * spt, z2 = dy * spt + z1 * cpt;
      const lu = z2 < -0.1
        ? [((x1 / -z2) * fl / (w / h)) * 0.5 + 0.5, 0.5 - ((y2 / -z2) * fl) * 0.5]
        : [0.5, -1];
      const th = t * 0.40;
      const toCam = Math.atan2(roZ, 0.0001); // camera azimuth from the axis
      let facing = Math.cos(th - toCam) * 0.5 + 0.5;
      facing = Math.pow(Math.max(0, Math.cos(th - toCam)), 24);
      uniData.set([lu[0], lu[1], facing, 0], 12);
    }
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
    setScroll(p) { scrollTarget = Math.min(1, Math.max(0, p)); },
    dispose() {
      disposed = true;
      texA?.destroy(); texB?.destroy(); uniBuf.destroy();
      dev.destroy?.();
    },
  };
}
