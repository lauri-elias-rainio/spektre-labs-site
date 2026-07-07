/**
 * THE STORM LIGHTHOUSE — WebGL2 / GLSL ES 3.00 fallback engine.
 *
 * Port of engine.ts (WGSL) targeting Safari / Firefox.
 * Omitted: CAS sharpening, crepuscular radial god-rays (WebGPU-exclusive).
 * Kept: full SDF tower, JONSWAP sea, GGX lighting, ACES, CA, vignette,
 *       shadow neutrality, display-space grain, EMA ping-pong accumulation.
 *
 * Resolution scale: 0.75 × dpr (vs 1.0 for WebGPU — no CAS to compensate).
 * Y-axis: gl_FragCoord.y=0 at bottom — no Y-flip on sc (WGSL has -ndc.y).
 */

import type { MonumentHandle, MonumentOptions } from "./engine";

const RES_SCALE_GL = 0.75;

/* ── Shared vertex shader — fullscreen triangle via gl_VertexID ──────── */
const VERT_SRC = /* glsl */ `#version 300 es
void main() {
  int  vi = gl_VertexID;
  vec2 xy = vec2(float((vi << 1) & 2), float(vi & 2));
  gl_Position = vec4(xy * 2.0 - 1.0, 0.0, 1.0);
}`;

/* ── Trace fragment shader ───────────────────────────────────────────── */
const TRACE_FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp int;

uniform vec4      uRes;      // w, h, aspect, dpr
uniform vec4      uCam;      // tiltX, tiltY, scroll, time
uniform vec4      uAcc;      // emaAlpha, frame, fade, introT (<0 = reducedMotion)
uniform sampler2D uPrevTex;

out vec4 fragColor;

const float PI = 3.14159265;

// ── pcg2d / R2 quasi-random ─────────────────────────────────────────────
uvec2 pcg2d(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> uvec2(16u);
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> uvec2(16u);
  return v;
}
vec2 rand2(uvec2 pix, uint frame, uint dim) {
  const float g = 1.32471795724;
  vec2  a  = vec2(1.0 / g, 1.0 / (g * g));
  vec2  r2 = fract(a * float(frame));
  uvec2 h  = pcg2d(pix + uvec2(dim * 7919u, dim * 104729u));
  vec2  cp = vec2(float(h.x & 0xffffu), float(h.y & 0xffffu)) / 65536.0;
  return fract(r2 + cp);
}

// ── THE LIGHTHOUSE SDF ──────────────────────────────────────────────────
const float APEX = 55.0;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdOcta(vec3 p, float s) {
  vec3 q = abs(p);
  return (q.x + q.y + q.z - s) * 0.57735027;
}
float twMasonry(float y, float ang) {
  float cF    = y * 0.45455;
  float cIdx  = floor(cF);
  float cT    = cF - cIdx;
  float hj    = clamp(min(cT, 1.0 - cT) * 16.0, 0.0, 1.0);
  float hDisp = 0.012 * (1.0 - hj);
  float aOff  = fract(cIdx * 0.5) * (PI / 6.0);
  float bT    = fract((ang + aOff) * (6.0 / PI));
  float vj    = clamp(min(bT, 1.0 - bT) * 14.0, 0.0, 1.0);
  float vDisp = 0.006 * (1.0 - vj);
  return hDisp + vDisp;
}
float tower(vec3 pin) {
  float rr    = length(pin.xz);
  float bound = max(rr - 5.2, max(pin.y - (APEX + 1.5), -(pin.y + 5.0)));
  if (bound > 1.2) return bound;

  float ang = atan(pin.z, pin.x); // 2-arg atan == atan2

  float taper    = 3.5 - 0.036 * pin.y;
  float fluteRaw = abs(sin(ang * 12.0));
  float flute    = 0.045 * sqrt(sqrt(fluteRaw));
  float masDisp  = twMasonry(pin.y, ang) * smoothstep(50.5, 48.5, pin.y);

  float d = rr - (taper - flute) + masDisp;
  d = max(d, pin.y - 49.5);
  d = max(d, -(pin.y + 4.0));
  d = smin(d, sdOcta(pin - vec3(0.0, -2.2, 0.0), 4.6), 0.9);

  float teeth = 0.04 * abs(sin(ang * 36.0));
  float bez   = max(abs(rr - (3.5 - 0.036 * 18.0 + 0.26)) + teeth - 0.2,
                    abs(pin.y - 18.0) - 0.9);
  d = min(d, bez);

  float gal1 = max(rr - 2.25, abs(pin.y - 49.9) - 0.22);
  float gal2 = max(rr - 1.95, abs(pin.y - 50.9) - 0.10);
  d = min(d, min(gal1, gal2));

  float mull = 0.05 * abs(sin(ang * 4.0));
  float lant = max(rr - (1.35 - mull), abs(pin.y - 51.9) - 1.7);
  d = min(d, lant);

  d = smin(d, sdOcta(pin - vec3(0.0, 54.2, 0.0), 1.65), 0.35);

  float seam = abs(fract(pin.y / 8.0 + 0.5) - 0.5) * 8.0;
  d = max(d, -max(0.05 - seam, -(rr - (taper - 0.10))));
  return d;
}
float scene(vec3 p) { return tower(p); }

float glyphMask(vec3 p) {
  float ang  = atan(p.z, p.x);
  float band = smoothstep(2.0, 1.1, abs(p.y - 28.0));
  float g1   = smoothstep(0.10, 0.02, abs(abs(sin(ang * 4.0)) - 0.55));
  float g2   = smoothstep(0.35, 0.0, abs(sin(ang * 16.0 + p.y * 0.8)) - 0.5);
  return band * clamp(g1 * 0.6 + g2 * 0.25, 0.0, 1.0);
}
vec3 normalAt(vec3 p) {
  const float e = 0.004;
  return normalize(vec3(
    scene(p + vec3(e, 0.0, 0.0)) - scene(p - vec3(e, 0.0, 0.0)),
    scene(p + vec3(0.0, e, 0.0)) - scene(p - vec3(0.0, e, 0.0)),
    scene(p + vec3(0.0, 0.0, e)) - scene(p - vec3(0.0, 0.0, e))));
}
float march(vec3 ro, vec3 rd, float tmax) {
  float t = 0.02;
  for (int i = 0; i < 88; i++) {
    float d = scene(ro + rd * t);
    if (d < 0.0009 * t + 0.0012) return t;
    t += d * 0.95;
    if (t > tmax) break;
  }
  return -1.0;
}
float shadowRay(vec3 ro, vec3 rd, float tmax) {
  // Aaltonen-improved penumbra — banding-free soft shadow
  float res = 1.0;
  float ph  = 1e10;
  float t   = 0.10;
  for (int i = 0; i < 22; i++) {
    float h = scene(ro + rd * t);
    if (h < 0.008) return 0.0;
    float y = h * h / (2.0 * ph);
    float d = sqrt(h * h - y * y);
    res = min(res, d / (0.12 * max(t - y, 0.001)));
    ph  = h;
    t  += max(h, 0.14);
    if (t > tmax) break;
  }
  return clamp(res, 0.0, 1.0);
}
float ao(vec3 p, vec3 n) {
  float occ = 0.0;
  float w   = 0.75;
  for (int i = 1; i <= 4; i++) {
    float h = 0.09 + 0.38 * float(i);
    occ += (h - scene(p + n * h)) * w;
    w   *= 0.6;
  }
  return clamp(1.0 - 1.4 * occ, 0.0, 1.0);
}

// ── THE STORM SEA — JONSWAP Gerstner, mirrored by |x| ──────────────────
float hash21(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}
float vnoise(vec2 p) {
  vec2 i  = floor(p);
  vec2 f  = fract(p);
  vec2 uf = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i),             hash21(i + vec2(1.0, 0.0)), uf.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), uf.x),
    uf.y) * 2.0 - 1.0;
}
// Gerstner component: height + analytic gradient + Jacobian term
// Crest sharpening A*|sin phi|^(2-Q)
vec4 swComponent(vec2 pxz, float tt,
                 float k, float a, float om,
                 float dx, float dz) {
  float ph  = k * (dx * pxz.x + dz * pxz.y) - om * tt;
  float q   = k * a;
  float es  = 2.0 - q;
  float spv = sin(ph);
  float asp = max(abs(spv), 1e-7);
  float hi  = a * pow(asp, es);
  float dhp = a * es * pow(asp, es - 1.0) * sign(spv) * cos(ph);
  return vec4(hi, dhp * k * dx, dhp * k * dz, q * cos(ph));
}
// 8-component JONSWAP storm table (gamma 4-5), seaAmp=1.0 baked
vec4 swGradH(vec2 pxz, float tt) {
  vec4 acc = vec4(0.0);
  acc += swComponent(pxz, tt, 0.24166, 1.95, 1.5397,  0.19081, 0.98163);
  acc += swComponent(pxz, tt, 0.24166, 1.95, 1.5397, -0.19081, 0.98163);
  acc += swComponent(pxz, tt, 0.44880, 1.08, 2.0982,  0.37461, 0.92718);
  acc += swComponent(pxz, tt, 0.44880, 1.08, 2.0982, -0.37461, 0.92718);
  acc += swComponent(pxz, tt, 0.83776, 0.57, 2.8667,  0.61566, 0.78801);
  acc += swComponent(pxz, tt, 0.83776, 0.57, 2.8667, -0.61566, 0.78801);
  acc += swComponent(pxz, tt, 1.74533, 0.18, 4.1378,  0.84805, 0.52992);
  acc += swComponent(pxz, tt, 1.74533, 0.18, 4.1378, -0.84805, 0.52992);
  return vec4(acc.x, acc.y, acc.z, 1.0 - acc.w);
}
// coarse height (swell pairs only) for secant march
float swCoarseH(vec2 pxz, float tt) {
  float h = 0.0;
  h += swComponent(pxz, tt, 0.24166, 1.95, 1.5397,  0.19081, 0.98163).x;
  h += swComponent(pxz, tt, 0.24166, 1.95, 1.5397, -0.19081, 0.98163).x;
  h += swComponent(pxz, tt, 0.44880, 1.08, 2.0982,  0.37461, 0.92718).x;
  h += swComponent(pxz, tt, 0.44880, 1.08, 2.0982, -0.37461, 0.92718).x;
  return h;
}
float swVnoise2(vec2 p) {
  float v0 = vnoise(p) * 0.5 + 0.5;
  float v1 = vnoise(p * 2.17 + vec2(17.31, 41.73)) * 0.5 + 0.5;
  return v0 * 0.65 + v1 * 0.35;
}
float seaH(vec2 pxz0, float t) { return swCoarseH(pxz0, t); }

const float SEA_HMAX = 6.5; // 6.5 * seaAmp(1.0)
float seaMarch(vec3 ro, vec3 rd, float tmax, float t) {
  if (rd.y >= -0.004) return -1.0;
  float tlo = max((SEA_HMAX - ro.y) / rd.y, 0.0);
  float thi = min((-ro.y) / rd.y, tmax);
  if (tlo >= thi) return -1.0;
  vec3  plo = ro + rd * tlo;
  float hlo = plo.y - seaH(plo.xz, t);
  if (hlo < 0.0) return tlo;
  vec3  pHi = ro + rd * thi;
  float hhi = pHi.y - seaH(pHi.xz, t);
  if (hhi > 0.0) return thi;
  float tm = tlo;
  for (int i = 0; i < 9; i++) {
    tm = mix(tlo, thi, hlo / (hlo - hhi));
    vec3  pm = ro + rd * tm;
    float hm = pm.y - seaH(pm.xz, t);
    if (hm < 0.0) { thi = tm; hhi = hm; } else { tlo = tm; hlo = hm; }
  }
  return tm;
}

// ── LIGHTING ────────────────────────────────────────────────────────────
const float L_Y    = 84.0;
const float L_Z    = -34.0;
const vec2  L_HALF = vec2(24.0, 8.0);
const vec3  L_EMIT = vec3(150.0, 155.0, 170.0);

vec3 sampleLight(vec2 xi) {
  return vec3((xi.x * 2.0 - 1.0) * L_HALF.x,
              L_Y,
              L_Z + (xi.y * 2.0 - 1.0) * L_HALF.y);
}
// twin mirrored moons + void sky
vec3 env(vec3 rd) {
  vec3  c  = vec3(0.0012, 0.0013, 0.0017);
  float up = smoothstep(0.86, 0.995, rd.y);
  c += vec3(0.55, 0.57, 0.64) * up * 0.008; // seaAmp=1.0 baked
  vec3  e  = normalize(vec3(0.42, 0.115, -0.9));
  vec3  m1 = vec3(-e.x, e.y, e.z);
  float d1 = max(dot(rd, e), 0.0);
  float d2 = max(dot(rd, m1), 0.0);
  float disc = smoothstep(0.99988, 0.99997, d1)
             + smoothstep(0.99988, 0.99997, d2);
  float halo = pow(d1, 3200.0) + pow(d2, 3200.0);
  c += vec3(0.82, 0.86, 0.95) * (disc * 1.6 + halo * 0.18);
  float dy   = rd.y - 0.10;
  float band = exp(-30.0 * dy * dy) * 0.0016;
  c += vec3(0.74, 0.80, 0.96) * band;
  return c;
}

const float FOG_T  = 0.04;
const float FOG_KY = 0.10;
float fogDensity(float y) {
  return FOG_T * exp(-max(y, 0.0) * FOG_KY);
}
float transmittance(vec3 ro, vec3 rd, float t) {
  float dy  = rd.y;
  float tau = 0.0;
  if (abs(dy) < 1e-4) {
    tau = fogDensity(ro.y) * t;
  } else {
    tau = abs((FOG_T / (-FOG_KY * dy)) *
      (exp(-FOG_KY * max(ro.y + dy * t, 0.0)) - exp(-FOG_KY * max(ro.y, 0.0))));
  }
  return exp(-tau);
}

const vec3 LANTERN = vec3(0.0, 51.9, 0.0);
vec3 beamDir(float t) {
  float th = t * 0.4; // beamSweep = 0.40
  return normalize(vec3(cos(th), -0.055, sin(th)));
}
float beamScatter(vec3 ro, vec3 rd, float tmaxv, float t) {
  vec3  bd    = beamDir(t);
  vec3  w0    = ro - LANTERN;
  float b     = dot(rd, bd);
  float d0    = dot(rd, w0);
  float e0    = dot(bd, w0);
  float denom = 1.0 - b * b;
  if (abs(denom) < 1e-4) return 0.0;
  float sray  = (b * e0 - d0) / denom;
  float sbeam = (e0 - b * d0) / denom;
  if (sray < 0.5 || sray > tmaxv || sbeam < 2.5 || sbeam > 160.0) return 0.0;
  vec3  pr   = ro + rd * sray;
  vec3  pb   = LANTERN + bd * sbeam;
  float r    = length(pr - pb);
  float R    = 0.55 + sbeam * 0.024;
  float q    = exp(-(r * r) / (R * R));
  float core = q * q;
  float att  = 1.0 / (1.0 + sbeam * sbeam * 0.0016);
  float mu   = dot(rd, bd);
  const float gHG = 0.5;
  float phg  = (1.0 - gHG * gHG) /
               (4.0 * PI * pow(1.0 + gHG * gHG - 2.0 * gHG * mu, 1.5));
  return core * att * phg * (fogDensity(pr.y) + 0.009) * 760.0; // beamK=760
}
float lanternIrr(vec3 p, float t) {
  vec3  bd    = beamDir(t);
  vec3  dl    = p - LANTERN;
  float dist2 = dot(dl, dl);
  float gate  = pow(max(dot(dl / sqrt(dist2), bd), 0.0), 380.0);
  return gate * 620.0 / (1.0 + dist2 * 0.9);
}

// ── GGX anisotropic — brushed platinum ──────────────────────────────────
vec3 f_schlick3(vec3 f0, float uu) {
  return f0 + (vec3(1.0) - f0) * pow(1.0 - uu, 5.0);
}
float d_ggx_aniso(float NoH, float ToH, float BoH, float ax, float ay) {
  float a2 = ax * ay;
  vec3  v  = vec3(ay * ToH, ax * BoH, a2 * NoH);
  float v2 = dot(v, v);
  float w2 = a2 / v2;
  return a2 * w2 * w2 / PI;
}
float v_smith(float NoV, float NoL) {
  return 0.5 / max(NoL * NoV * 2.0 + 0.05, 1e-4);
}

struct Hit { vec3 p; vec3 n; uint kind; }; // 0 = tower, 1 = sea

vec3 direct(Hit h, vec3 v, vec2 xi, vec3 f0, float ax, float ay) {
  vec3  lp    = sampleLight(xi);
  vec3  ld    = lp - h.p;
  float dist2 = dot(ld, ld);
  vec3  l     = ld / sqrt(dist2);
  float NoL   = dot(h.n, l);
  if (NoL <= 0.0) return vec3(0.0);
  float vis = shadowRay(h.p + h.n * 0.03, l, sqrt(dist2));
  if (vis <= 0.001) return vec3(0.0);

  float cosL   = max(l.y, 0.0);
  float area   = 4.0 * L_HALF.x * L_HALF.y;
  float pdfInv = area * cosL / max(dist2, 1e-4);

  vec3 tang = normalize(cross(vec3(0.0, 1.0, 0.0), h.n) + vec3(1e-4, 0.0, 0.0));
  if (h.kind == 1u) tang = vec3(1.0, 0.0, 0.0);
  vec3 bit = cross(h.n, tang);

  vec3  hv  = normalize(l + v);
  float NoV = max(dot(h.n, v), 1e-4);
  float NoH = max(dot(h.n, hv), 0.0);
  float D   = d_ggx_aniso(NoH, dot(tang, hv), dot(bit, hv), ax, ay);
  float Vs  = v_smith(NoV, NoL);
  vec3  F   = f_schlick3(f0, max(dot(hv, v), 0.0));
  return (D * Vs * F) * L_EMIT * NoL * pdfInv * vis;
}

vec3 twHash3(vec3 p) {
  return fract(sin(vec3(
    dot(p.xy, vec2(127.1, 311.7)),
    dot(p.yz, vec2(269.5, 183.3)),
    dot(p.xz, vec2(113.5, 271.9))
  )) * 43758.5453) * 2.0 - 1.0;
}
const vec3 SIGNAL = vec3(0.812, 0.890, 1.0);

// intro envelopes — dark → ignition flash → steady
float introBeam(float introT) {
  if (introT < 0.0) return 1.0;
  const float t0 = 1.3;
  float ign   = smoothstep(t0, t0 + 0.18, introT);
  float flash = 1.0 + 2.2 * exp(-(introT - t0 - 0.18) * (introT - t0 - 0.18) * 14.0)
                           * step(t0, introT);
  return ign * flash;
}
float introSea(float introT) {
  if (introT < 0.0) return 1.0;
  return smoothstep(0.4, 2.0, introT); // introSeaAt=0.4, +1.6
}

// Beer-Lambert water transmission — physics gives the Atlantean blue, not paint
const vec3 W_ABSORB = vec3(1.35, 0.70, 0.20);
vec3 waterTint(float pathLen) { return exp(-W_ABSORB * pathLen); }

vec3 shadeTower(Hit h, vec3 v, uvec2 pix, uint frame, uint dimBase, float t) {
  vec3  f0 = vec3(0.86, 0.84, 0.80);
  float ax = 0.14;
  float ay = 0.38;

  // wet band — rain film on lower stones
  float wetMask = smoothstep(6.0, 0.0, h.p.y);
  ax *= 1.0 - wetMask * 0.70;
  ay *= 1.0 - wetMask * 0.70;
  f0  = mix(f0, f0 + vec3(0.020, 0.020, 0.028), wetMask);

  // micro-normal breakup — grid-quantized so EMA converges
  vec3  mnGrid   = floor(h.p * 7.0) / 7.0;
  vec3  mn       = twHash3(mnGrid);
  float microAmp = 0.018 * max(0.0, dot(h.n, v));
  vec3  sn       = normalize(h.n + mn * microAmp);

  Hit hS; hS.p = h.p; hS.n = sn; hS.kind = h.kind;

  vec3  c   = min(direct(hS, v, rand2(pix, frame, dimBase), f0, ax, ay), vec3(5.0));
  float NoV = max(dot(sn, v), 0.0);
  vec3  F   = f_schlick3(f0, NoV);
  float occ = ao(h.p, h.n); // geometric normal for AO — stable under EMA
  c += env(reflect(-v, sn)) * F * occ * 1.8;
  // frontal fill — tower reads as form, not a void seam
  c += f0 * 0.0045 * max(dot(sn, normalize(vec3(0.0, 0.35, 1.0))), 0.0) * occ;
  c *= occ;
  c *= 1.0 - wetMask * 0.10;
  c *= 1.0 - glyphMask(h.p) * 0.45;

  // lantern room — beam glow + glass fresnel + mullion rim
  float band = smoothstep(1.9, 0.6, abs(h.p.y - 51.9));
  if (band > 0.0) {
    vec3  bd2    = beamDir(t);
    float facing = pow(max(dot(normalize(vec2(h.p.x, h.p.z)), normalize(bd2.xz)), 0.0), 6.0);
    c += SIGNAL * band * (0.05 + 1.0 * facing) * introBeam(uAcc.w);

    float hAng    = atan(h.p.z, h.p.x);
    float mullFac = abs(sin(hAng * 4.0));
    float grazing = pow(max(1.0 - dot(h.n, v), 0.0), 3.0);
    c += SIGNAL * band * mullFac * grazing * 0.22;

    float mullEdge = band * smoothstep(0.20, 0.03, mullFac);
    c += SIGNAL * mullEdge * 0.007;
  }
  return c;
}

void main() {
  uvec2 pix    = uvec2(gl_FragCoord.xy);
  uint  frame  = uint(uAcc.y);
  float time   = uCam.w;
  float scroll = clamp(uCam.z, 0.0, 1.0);

  // Sub-pixel jitter for temporal AA
  vec2 jit = rand2(pix, frame, 0u) - 0.5;
  // WebGL: gl_FragCoord.y=0 at bottom (opposite of WebGPU @builtin(position))
  // → no Y-flip on sc (WGSL had -ndc.y; here ndc.y is already +1 at top)
  vec2 ndc = ((gl_FragCoord.xy + jit) / uRes.xy) * 2.0 - 1.0;
  vec2 sc  = vec2(ndc.x * uRes.z, ndc.y);

  // Camera — identical math to WGSL (camY=8.6, camZ=76.0, lookUp=0.235)
  vec3  ro     = vec3(0.0, 8.6 + scroll * 1.6, 76.0 + scroll * 14.0);
  float lookUp = 0.235 - scroll * 0.02 + uCam.y * 0.026;
  float yaw    = uCam.x * 0.038;
  const float fl = 1.65;
  vec3 rd = normalize(vec3(sc.x, sc.y, -fl));
  float cp = cos(lookUp); float sp = sin(lookUp);
  rd = vec3(rd.x, rd.y * cp + rd.z * -sp, rd.y * sp + rd.z * cp);
  float cy = cos(yaw); float sy = sin(yaw);
  rd = vec3(rd.x * cy + rd.z * sy, rd.y, -rd.x * sy + rd.z * cy);

  vec3 col = vec3(0.0);

  float tc = march(ro, rd, 240.0);
  float tw = seaMarch(ro, rd, 200.0, time);
  bool  seaFirst = tw > 0.0 && (tc < 0.0 || tw < tc);

  if (!seaFirst && tc > 0.0) {
    // ── THE TOWER ──────────────────────────────────────────────────────
    vec3 p = ro + rd * tc;
    Hit h; h.p = p; h.n = normalAt(p); h.kind = 0u;
    col = shadeTower(h, -rd, pix, frame, 2u, time);

    // one glossy bounce
    vec2  xi   = rand2(pix, frame, 6u);
    vec3  rdir = normalize(reflect(rd, h.n) +
                 (vec3(xi.x, rand2(pix, frame, 7u).x, xi.y) - 0.5) * 0.12);
    float t2 = march(p + h.n * 0.03, rdir, 90.0);
    vec3  rc;
    if (t2 > 0.0) {
      vec3 p2 = p + h.n * 0.03 + rdir * t2;
      Hit  h2; h2.p = p2; h2.n = normalAt(p2); h2.kind = 0u;
      rc = shadeTower(h2, -rdir, pix, frame, 8u, time) * 0.9;
    } else { rc = env(rdir); }
    vec3 Ft = f_schlick3(vec3(0.86, 0.84, 0.80), max(dot(h.n, -rd), 0.0));
    col += rc * Ft * 0.32;
    col *= transmittance(ro, rd, tc);

  } else if (seaFirst) {
    // ── THE STORM SEA ──────────────────────────────────────────────────
    vec3  p   = ro + rd * tw;
    vec4  gH  = swGradH(p.xz, time);
    float nBl = smoothstep(18.0, 88.0, tw) * 0.52;
    vec3  n   = normalize(vec3(mix(-gH.y, 0.0, nBl), 1.0, mix(-gH.z, 0.0, nBl)));
    float NoV = max(dot(n, -rd), 0.0);
    float Fw  = 0.028 + 0.972 * pow(1.0 - NoV, 5.0);

    // Beer-Lambert body — crests transmit Atlantean blue, troughs absorb to void
    float depthG = smoothstep(0.0, 4.5, p.y);
    float path   = mix(3.4, 0.75, depthG);
    vec3  tint   = waterTint(path);
    vec3  c      = tint * 0.011 * (0.48 + 0.52 * n.y);
    vec3  lKey   = normalize(vec3(0.0, L_Y, L_Z) - p);
    c += tint * 0.0062 * max(dot(n, lKey), 0.0);
    float sideF = (1.0 - n.y) * smoothstep(-0.1, 0.5, n.y) * 0.42;
    c += tint * 0.0024 * sideF;

    // backlit crest subsurface
    float crestH  = smoothstep(1.4, 4.7, p.y);
    float backlit = pow(max(dot(rd, lKey), 0.0), 2.0) * 0.5 + 0.5;
    c += waterTint(0.55) * 0.075 * crestH * backlit * (0.38 + 0.62 * (1.0 - NoV));

    // Jacobian-proxy foam — foamK=1.0 baked: 0.9, 0.55, 0.3
    float slope = length(gH.yz);
    float foamJ = clamp(1.0 - gH.w, 0.0, 1.0);
    float foamS = smoothstep(0.26, 0.74, slope);
    float foamH = smoothstep(1.9, 4.8, p.y);
    float brup  = swVnoise2(p.xz * 0.45 + vec2(0.0, time * 0.22));
    float foam  = clamp((foamH * 0.9 + foamS * 0.55 + foamJ * 0.3) *
                        (0.28 + 0.72 * brup), 0.0, 1.0);
    float fLamb = clamp(dot(n, lKey) * 0.62 + 0.09, 0.0, 1.0);
    vec3  fCol  = vec3(0.13, 0.132, 0.142) * fLamb;
    c = mix(c, fCol, foam);

    // reflection — tower wet mirror + moons in the swell
    vec3  rdir = reflect(rd, n);
    vec3  rc;
    float t2 = march(p + vec3(0.0, 0.04, 0.0), rdir, 120.0);
    if (t2 > 0.0) {
      vec3 p2 = p + vec3(0.0, 0.04, 0.0) + rdir * t2;
      Hit  h2; h2.p = p2; h2.n = normalAt(p2); h2.kind = 0u;
      rc  = shadeTower(h2, -rdir, pix, frame, 8u, time);
      rc *= transmittance(p, rdir, t2);
    } else { rc = env(rdir); }
    c += rc * Fw * (1.0 - foam * 0.88);

    // moon glitter — tight spec on detail normals, both moons
    vec3  md1 = normalize(vec3(0.42, 0.115, -0.9));
    vec3  md2 = vec3(-md1.x, md1.y, md1.z);
    vec3  hm1 = normalize(md1 - rd);
    vec3  hm2 = normalize(md2 - rd);
    float mS  = pow(max(dot(n, hm1), 0.0), 280.0) * max(dot(n, md1), 0.0)
              + pow(max(dot(n, hm2), 0.0), 280.0) * max(dot(n, md2), 0.0);
    c += SIGNAL * mS * 0.06 * (1.0 - foam * 0.78);

    // the lantern beam — glitter on water, glow on foam
    float irr = lanternIrr(p, time);
    if (irr > 0.0005) {
      vec3  Ld  = normalize(LANTERN - p);
      vec3  hv2 = normalize(Ld - rd);
      float gl  = pow(max(dot(n, hv2), 0.0), 500.0) * (1.0 - foam);
      float fo  = foam * max(dot(n, Ld), 0.0) * 0.5;
      c += SIGNAL * (gl * 1.6 + fo) * irr * introBeam(uAcc.w);
    }

    col = c * transmittance(ro, rd, tw) * (0.25 + 0.75 * introSea(uAcc.w));
  } else {
    col = env(rd);
  }

  // the beam through storm air — THE signal
  float vtb = 240.0;
  if (seaFirst) vtb = tw; else if (tc > 0.0) vtb = tc;
  col += SIGNAL * beamScatter(ro, rd, vtb, time) * introBeam(uAcc.w);

  // EMA accumulation — sample previous frame at same pixel (bottom-left UV)
  vec2 suv  = gl_FragCoord.xy / uRes.xy;
  vec3 prev = textureLod(uPrevTex, suv, 0.0).rgb;
  vec3 outc = mix(prev, col, uAcc.x);
  fragColor  = vec4(outc, 1.0);
}
`;

/* ── Present fragment shader ─────────────────────────────────────────── */
const PRESENT_FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp int;

uniform vec4      uRes;     // w, h, aspect, dpr
uniform vec4      uCam;     // .w = time (grain seed)
uniform vec4      uAcc;     // .z = fade alpha
uniform sampler2D uAccTex;

out vec4 fragColor;

vec3 aces(vec3 x) {
  float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3(0.0), vec3(1.0));
}
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 suv = gl_FragCoord.xy / uRes.xy;
  vec2 dir = suv - vec2(0.5);

  // chromatic aberration — luminance-gated (mono law in the dark)
  const float ca = 0.0007;
  vec3  base = textureLod(uAccTex, suv, 0.0).rgb;
  float rCh  = textureLod(uAccTex, suv + dir * ca, 0.0).r;
  float bCh  = textureLod(uAccTex, suv - dir * ca, 0.0).b;
  float lum  = dot(base, vec3(0.2126, 0.7152, 0.0722));
  float caW  = smoothstep(0.18, 0.5, lum);
  vec3  col  = mix(base, vec3(rCh, base.g, bCh), caW);

  // crepuscular god-rays omitted (WebGPU-exclusive)

  col = aces(col * 1.05);

  // shadow neutrality — deep tones carry NO hue (OLED shadow is colorless)
  float lum2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(lum2), col, smoothstep(0.0, 0.045, lum2));

  // vignette — symmetric ellipse
  float vig = 1.0 - 0.34 * dot(dir * vec2(1.6, 1.25), dir * vec2(1.6, 1.25));
  col *= clamp(vig, 0.0, 1.0);

  // sRGB FIRST — grain MUST live in display space (linear grain lifts blacks)
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));

  // CAS sharpening omitted (WebGL — no readback from adjacent pixels)

  // grain after 1/2.2 pow
  float gr = (hash12(suv * uRes.xy + vec2(uCam.w * 61.7, uCam.w * 123.3)) - 0.5) * 0.02;
  col = max(col + vec3(gr) * (0.25 + 0.75 * col.g), vec3(0.0));

  float alpha = uAcc.z;
  fragColor = vec4(col * alpha, alpha); // premultiplied alpha
}
`;

/* ── createMonumentGL ────────────────────────────────────────────────── */
export async function createMonumentGL(
  canvas: HTMLCanvasElement,
  opts: MonumentOptions
): Promise<MonumentHandle | null> {
  // Claim canvas for WebGL2 (canvas context is claimed here — acceptable per
  // spec since the prism fallback uses its own separate canvas element)
  const _glCtx = canvas.getContext("webgl2", { premultipliedAlpha: true });
  if (!_glCtx) return null;
  // Re-bind as an explicitly non-nullable type so all inner function closures
  // can use it without TypeScript's cross-closure narrowing limitation.
  const gl: WebGL2RenderingContext = _glCtx;

  // EXT_color_buffer_float enables RGBA16F as a render target in WebGL2
  if (!gl.getExtension("EXT_color_buffer_float")) return null;
  const loseCtx = gl.getExtension("WEBGL_lose_context") as WEBGL_lose_context | null;

  // σ-gate: compile all shaders, log and bail on any error
  function compileShader(type: GLenum, src: string): WebGLShader | null {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[monument-gl] shader compile error:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }
  function linkProgram(vsh: WebGLShader, fsh: WebGLShader): WebGLProgram | null {
    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("[monument-gl] link error:", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }
    return prog;
  }

  const vert = compileShader(gl.VERTEX_SHADER, VERT_SRC);
  if (!vert) { loseCtx?.loseContext(); return null; }

  const traceFrag = compileShader(gl.FRAGMENT_SHADER, TRACE_FRAG);
  if (!traceFrag) { gl.deleteShader(vert); loseCtx?.loseContext(); return null; }

  const presentFrag = compileShader(gl.FRAGMENT_SHADER, PRESENT_FRAG);
  if (!presentFrag) {
    gl.deleteShader(vert); gl.deleteShader(traceFrag);
    loseCtx?.loseContext(); return null;
  }

  const traceProg = linkProgram(vert, traceFrag);
  if (!traceProg) { loseCtx?.loseContext(); return null; }

  const presentProg = linkProgram(vert, presentFrag);
  if (!presentProg) { gl.deleteProgram(traceProg); loseCtx?.loseContext(); return null; }

  gl.deleteShader(vert);
  gl.deleteShader(traceFrag);
  gl.deleteShader(presentFrag);

  // Cache uniform locations (getUniformLocation returns null for unknown names;
  // gl.uniform4f silently ignores null locations — no special handling needed)
  const TU = {
    uRes:     gl.getUniformLocation(traceProg,   "uRes"),
    uCam:     gl.getUniformLocation(traceProg,   "uCam"),
    uAcc:     gl.getUniformLocation(traceProg,   "uAcc"),
    uPrevTex: gl.getUniformLocation(traceProg,   "uPrevTex"),
  };
  const PU = {
    uRes:    gl.getUniformLocation(presentProg, "uRes"),
    uCam:    gl.getUniformLocation(presentProg, "uCam"),
    uAcc:    gl.getUniformLocation(presentProg, "uAcc"),
    uAccTex: gl.getUniformLocation(presentProg, "uAccTex"),
  };

  // Empty VAO — best practice in WebGL2 even with zero vertex attributes
  const vao = gl.createVertexArray();
  if (vao) gl.bindVertexArray(vao);

  // Ping-pong RGBA16F framebuffers for EMA accumulation
  interface FBO { tex: WebGLTexture; fb: WebGLFramebuffer }
  let fboA: FBO | null = null;
  let fboB: FBO | null = null;

  function createFBO(w: number, h: number): FBO | null {
    const tex = gl.createTexture();
    if (!tex) return null;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    if (!fb) { gl.deleteTexture(tex); return null; }
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return { tex, fb };
  }
  function destroyFBO(fbo: FBO): void {
    gl.deleteTexture(fbo.tex);
    gl.deleteFramebuffer(fbo.fb);
  }

  // Animation state — exact mirror of the WebGPU engine
  let disposed   = false;
  let frame      = 0;
  const startTime = performance.now();
  let liveFrames = 0;
  let fade       = 0;
  let last       = performance.now();
  let tx = 0, ty = 0, tvx = 0, tvy = 0, px = 0, py = 0;
  let scroll = 0, scrollTarget = 0;

  const reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loop(now: number): void {
    if (disposed) return;
    requestAnimationFrame(loop);
    if (!opts.getActive()) { last = now; return; }
    if (reduceMotion && frame > 110) return; // converged still — GPU off

    // dpr cap 1.5 × RES_SCALE_GL (0.75 — no CAS)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * RES_SCALE_GL;
    const w   = Math.max(1, Math.floor(canvas.clientWidth  * dpr));
    const h   = Math.max(1, Math.floor(canvas.clientHeight * dpr));

    if (canvas.width !== w || canvas.height !== h || !fboA || !fboB) {
      canvas.width  = w;
      canvas.height = h;
      if (fboA) destroyFBO(fboA);
      if (fboB) destroyFBO(fboB);
      fboA  = createFBO(w, h);
      fboB  = createFBO(w, h);
      if (!fboA || !fboB) return;
      frame = 0;
    }

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;
    fade = Math.min(1, fade + dt * 0.5);

    // critically-damped springs k=12 c=7.5 — jitter never reaches the gaze
    const k = 12, c = 7.5;
    tvx += (k * (px - tx) - c * tvx) * dt; tx += tvx * dt;
    tvy += (k * (py - ty) - c * tvy) * dt; ty += tvy * dt;
    const scrollPrev = scroll;
    scroll += (scrollTarget - scroll) * Math.min(1, dt * 5);

    // EMA alpha schedule — keep integrator responsive to sea motion
    const motion = Math.min(
      1,
      Math.hypot(tvx, tvy) * 3 + Math.abs(scroll - scrollPrev) * 220
    );
    const base  = frame < 8 ? 0.55 : 0.16;
    const alpha = reduceMotion
      ? 1 / Math.min(frame + 1, 64)
      : Math.min(0.7, base + motion * 0.35);

    const introT = (now - startTime) / 1000;
    const parity = frame % 2;
    // parity=0: trace reads fboB (prev), writes fboA; present reads fboA
    // parity=1: trace reads fboA (prev), writes fboB; present reads fboB
    const readFBO  = (parity === 0 ? fboB : fboA) as FBO;
    const writeFBO = (parity === 0 ? fboA : fboB) as FBO;

    // ── Trace pass → writeFBO (RGBA16F) ──────────────────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO.fb);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(traceProg);
    gl.uniform4f(TU.uRes, w, h, w / h, dpr);
    gl.uniform4f(TU.uCam, tx, ty, scroll, t);
    gl.uniform4f(TU.uAcc, alpha, frame, fade, reduceMotion ? -1 : introT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, readFBO.tex);
    gl.uniform1i(TU.uPrevTex, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // ── Present pass → canvas (default framebuffer) ───────────────────
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(presentProg);
    gl.uniform4f(PU.uRes, w, h, w / h, dpr);
    gl.uniform4f(PU.uCam, tx, ty, scroll, t);
    gl.uniform4f(PU.uAcc, alpha, frame, fade, reduceMotion ? -1 : introT);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, writeFBO.tex);
    gl.uniform1i(PU.uAccTex, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    frame++;
    if (liveFrames < 4) {
      liveFrames++;
      if (liveFrames === 3) opts.onLive?.();
    }
  }

  requestAnimationFrame(loop);

  return {
    kind: "monument-webgpu",
    setPointer(nx: number, ny: number) { px = nx; py = ny; },
    setScroll(p: number) { scrollTarget = Math.min(1, Math.max(0, p)); },
    dispose() {
      disposed = true;
      if (fboA) destroyFBO(fboA);
      if (fboB) destroyFBO(fboB);
      gl.deleteProgram(traceProg);
      gl.deleteProgram(presentProg);
      if (vao) gl.deleteVertexArray(vao);
      loseCtx?.loseContext();
    },
  };
}
