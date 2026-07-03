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

const RES_SCALE = 0.62; // internal render scale — CSS upscales, EMA sharpens

const WGSL_COMMON = /* wgsl */ `
struct U {
  res     : vec4f, // w, h, aspect, dpr
  cam     : vec4f, // tiltX, tiltY, scroll, time
  acc     : vec4f, // emaAlpha, frame, fade, reduced
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

fn tower(pin : vec3f) -> f32 {
  // cheap bound — keeps sea/fog rays fast
  let rr = length(pin.xz);
  let bound = max(rr - 5.2, max(pin.y - (APEX + 1.5), -(pin.y + 5.0)));
  if (bound > 1.2) { return bound; }

  let ang = atan2(pin.z, pin.x);

  // the tapered shaft — a real lighthouse profile, Rolex-fluted
  let taper = 2.9 - 0.030 * pin.y;
  let flute = 0.045 * abs(sin(ang * 12.0));
  var d = rr - (taper - flute);
  d = max(d, pin.y - 49.5);
  d = max(d, -(pin.y + 4.0));

  // the plinth — octad base under the waves
  d = smin(d, sdOcta(pin - vec3f(0.0, -2.2, 0.0), 4.6), 0.9);

  // the bezel — precision band at the equator (watch-grade)
  let teeth = 0.04 * abs(sin(ang * 36.0));
  let bez = max(abs(rr - (2.9 - 0.030 * 18.0 + 0.26)) + teeth - 0.2, abs(pin.y - 18.0) - 0.9);
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
  var t = 0.10;
  for (var i = 0; i < 22; i++) {
    let d = scene(ro + rd * t);
    if (d < 0.012) { return 0.0; }
    t += max(d, 0.14);
    if (t > tmax) { break; }
  }
  return 1.0;
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
fn seaOctave(uv0 : vec2f, choppy : f32) -> f32 {
  let uv = uv0 + vnoise(uv0);
  var wv = 1.0 - abs(sin(uv));
  let swv = abs(cos(uv));
  wv = mix(wv, swv, wv);
  return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy);
}
const OCTM = mat2x2f(1.6, 1.2, -1.2, 1.6);

fn seaH(pxz0 : vec2f, t : f32) -> f32 {
  // |x| — the storm itself obeys the symmetry law by construction
  var uv = vec2f(abs(pxz0.x), pxz0.y) * 0.135;
  uv.x *= 0.75;
  var freq = 1.0;
  var amp = 1.05;
  var choppy = 4.2;
  var h = 0.0;
  let ts = t * 0.9;
  for (var i = 0; i < 4; i++) {
    var dsea = seaOctave((uv + ts) * freq, choppy);
    dsea += seaOctave((uv - ts) * freq, choppy);
    h += dsea * amp;
    uv = OCTM * uv;
    freq *= 1.9;
    amp *= 0.22;
    choppy = mix(choppy, 1.0, 0.2);
  }
  return h;
}
const SEA_HMAX : f32 = 3.1;

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

fn seaNormal(p : vec3f, t : f32, dist : f32) -> vec3f {
  let e = max(0.012, dist * 0.0022);
  let h0 = seaH(p.xz, t);
  let hx = seaH(p.xz + vec2f(e, 0.0), t);
  let hz = seaH(p.xz + vec2f(0.0, e), t);
  return normalize(vec3f(h0 - hx, e, h0 - hz));
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
const FOG_T : f32 = 0.055;
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
  if (vis <= 0.0) { return vec3f(0.0); }

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
  return (D * Vs * F) * L_EMIT * NoL * pdfInv;
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

fn shadeTower(h : Hit, v : vec3f, pix : vec2u, frame : u32, dimBase : u32, t : f32) -> vec3f {
  let f0 = vec3f(0.86, 0.84, 0.80);
  let ax = 0.14; let ay = 0.38;

  var c = min(direct(h, v, rand2(pix, frame, dimBase), f0, ax, ay), vec3f(5.0));

  let NoV = max(dot(h.n, v), 0.0);
  let F = f_schlick3(f0, NoV);
  let occ = ao(h.p, h.n);
  c += env(reflect(-v, h.n)) * F * occ * 0.6;
  c *= occ;

  c *= 1.0 - glyphMask(h.p) * 0.45;

  // the lantern room glows — brightest toward the beam heading
  let band = smoothstep(1.9, 0.6, abs(h.p.y - 51.9));
  if (band > 0.0) {
    let bd2 = beamDir(t);
    let facing = pow(max(dot(normalize(vec2f(h.p.x, h.p.z)), normalize(bd2.xz)), 0.0), 6.0);
    c += SIGNAL * band * (0.05 + 1.0 * facing);
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
  let ro = vec3f(0.0, 4.6 + scroll * 2.0, 46.0 + scroll * 18.0);
  let lookUp = 0.165 - scroll * 0.03 + u.cam.y * 0.026;
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
    /* ── THE STORM SEA ── */
    let p = ro + rd * tw;
    let n = seaNormal(p, time, tw);

    // base water — near-black, alive through shape
    let NoV = max(dot(n, -rd), 0.0);
    let Fw = 0.028 + 0.972 * pow(1.0 - NoV, 5.0); // wet Schlick
    var c = vec3f(0.011, 0.012, 0.015) * (0.35 + 0.65 * n.y); // deep water

    // whitecaps — crest height + steepness, broken by noise (the storm)
    let crest = smoothstep(1.5, 2.6, p.y);
    let steep = smoothstep(0.30, 0.62, 1.0 - n.y);
    let breakup = 0.35 + 0.65 * clamp(vnoise(p.xz * 0.9 + vec2f(0.0, time * 0.5)) * 0.5 + 0.5, 0.0, 1.0);
    let foam = clamp(crest * 1.1 + steep * 0.75, 0.0, 1.0) * breakup;

    // foam is lit matter: key light lambert (unshadowed approx) + lantern
    let lKey = normalize(vec3f(0.0, L_Y, L_Z) - p);
    let foamLit = max(dot(n, lKey), 0.0) * 0.30 + 0.022;
    c = mix(c, vec3f(0.72, 0.73, 0.76) * foamLit, foam);

    // the reflection — tower + moons in the heaving surface
    let rdir = reflect(rd, n);
    var rc : vec3f;
    let t2 = march(p + vec3f(0.0, 0.04, 0.0), rdir, 120.0);
    if (t2 > 0.0) {
      let p2 = p + vec3f(0.0, 0.04, 0.0) + rdir * t2;
      var h2 : Hit; h2.p = p2; h2.n = normalAt(p2); h2.kind = 0u;
      rc = shadeTower(h2, -rdir, pix, frame, 8u, time);
      rc *= transmittance(p, rdir, t2);
    } else { rc = env(rdir); }
    c += rc * Fw * (1.0 - foam * 0.85);

    // the beam over the swell — glitter on water, glow on foam
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

  let prev = textureSampleLevel(prevTex, smp, in.uv, 0.0).rgb;
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
  // chromatic dispersion — gated to bright pixels (mono law in the dark)
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

  // shadow neutrality — deep tones carry NO hue (OLED shadow is colorless)
  let lum2 = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col = mix(vec3f(lum2), col, smoothstep(0.0, 0.14, lum2));

  // vignette — symmetric
  let v = 1.0 - 0.34 * dot(dir * vec2f(1.6, 1.25), dir * vec2f(1.6, 1.25));
  col *= clamp(v, 0.0, 1.0);

  // sRGB FIRST — grain lives in display space (linear grain lifts blacks)
  col = pow(max(col, vec3f(0.0)), vec3f(1.0 / 2.2));

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
