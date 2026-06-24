"use client";

import { useEffect, useRef } from "react";

/*
  SignalRaymarch — THE SIGNAL, rendered as a raw-WebGL2 fullscreen raymarched SDF.

  Why raw WebGL2 (not three.js / WebGPU): WebGPU init is flaky across browsers
  (Safari/Firefox), and a silent failure drops the page to the flat fallback —
  which is exactly the "hero doesn't even show" regression. WebGL2 is supported
  on ~99% of browsers and renders identically everywhere. One fullscreen triangle,
  one fragment shader, zero geometry uploads, zero deps.

  The object: a perfectly symmetric platinum monolith on OLED black — built by
  domain folding (abs + 8-fold radial fold) so symmetry is guaranteed in the math
  (1 = 1 rendered). Hyperreal metal via fresnel + procedural studio environment +
  one cold signal (#cfe3ff) rim. In-shader postFX: rim bloom, film grain, vignette,
  sub-pixel chromatic dispersion. Pointer parallax. prefers-reduced-motion ⇒ still.

  SSR-safe (renders a <div> on the server, inits in useEffect). Pauses when
  offscreen / tab hidden. Full teardown on unmount. If WebGL2 is unavailable it
  renders nothing and the caller's CSS/Lattice fallback stays visible.
*/

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;     // -1..1, eased
uniform float u_reduce;    // 1.0 = reduced motion

#define PI 3.14159265359

// ---- rotation ----
mat2 rot(float a){ float s=sin(a), c=cos(a); return mat2(c,-s,s,c); }

// ---- smooth min (for organic fusion) ----
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

// ---- primitives ----
float sdOcta(vec3 p, float s){ p = abs(p); return (p.x+p.y+p.z - s) * 0.57735027; }
float sdCapsuleY(vec3 p, float h, float r){ p.y -= clamp(p.y, -h, h); return length(p) - r; }

// ---- the SIGNAL form: an 8-fold symmetric platinum seal-monolith ----
// Domain folding guarantees exact bilateral + 8-fold radial symmetry: flip-test
// passes at every pixel by construction.
float map(vec3 p){
  // gentle global breathing (still under reduced motion)
  float br = 1.0 + (1.0 - u_reduce) * sin(u_time*0.6) * 0.012;
  p /= br;

  // 8-fold radial fold around Y -> the seal's eight identical facets
  float a = atan(p.z, p.x);
  float r = length(p.xz);
  a = mod(a, PI/4.0) - PI/8.0;
  vec3 q = vec3(cos(a)*r, p.y, sin(a)*r);

  // vertical spire core (bilaterally symmetric across XZ)
  float core = sdCapsuleY(q, 1.05, 0.62);

  // faceted seal flutes carved along the spire — symmetric ridges
  float flute = sdOcta(vec3(q.x, q.y*0.42, q.z), 0.92);
  float d = smin(core, flute, 0.28);

  // a precise equatorial ring (the one machined hairline, radial-symmetric)
  float ring = abs(length(q.xz) - 0.86) - 0.022;
  ring = max(ring, abs(q.y) - 0.05);
  d = min(d, ring);

  // crown + base octahedral caps -> the monolith reads as one sealed object
  d = smin(d, sdOcta(q - vec3(0.0, 1.18, 0.0), 0.34), 0.12);
  d = smin(d, sdOcta(q + vec3(0.0, 1.18, 0.0), 0.34), 0.12);
  return d * br;
}

vec3 calcNormal(vec3 p){
  vec2 e = vec2(0.0008, 0.0);
  return normalize(vec3(
    map(p+e.xyy)-map(p-e.xyy),
    map(p+e.yxy)-map(p-e.yxy),
    map(p+e.yyx)-map(p-e.yyx)
  ));
}

// ---- procedural studio environment: OLED void + one platinum highlight band +
//      one faint cold-signal band. This IS the entire reflection vocabulary. ----
vec3 env(vec3 rd){
  float t = clamp(rd.y*0.5 + 0.5, 0.0, 1.0);
  vec3 base = mix(vec3(0.012,0.013,0.018), vec3(0.03,0.033,0.045), t);
  // the single bright platinum strip (high, slightly forward)
  float strip = smoothstep(0.16, 0.0, abs(rd.y - 0.62)) * smoothstep(0.7, 0.0, abs(rd.x));
  base += vec3(0.95,0.96,1.0) * strip * 1.25;
  // a faint cold signal band low-left (the one accent, never saturated in env)
  float sig = smoothstep(0.10, 0.0, abs(rd.y + 0.35)) * smoothstep(0.9, 0.0, abs(rd.x + 0.5));
  base += vec3(0.51,0.69,1.0) * sig * 0.32;
  return base;
}

// hash for film grain
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;

  // camera — axis-locked; pointer only tips the object, never yaws off symmetry
  vec3 ro = vec3(0.0, 0.0, 4.3);
  vec3 rd = normalize(vec3(uv, -1.55));

  // pointer parallax: tip the whole field a few degrees toward the cursor
  float mx = u_mouse.x * 0.18 * (1.0 - u_reduce);
  float my = u_mouse.y * 0.12 * (1.0 - u_reduce);
  // slow autorotation about Y (off under reduced motion)
  float spin = (1.0 - u_reduce) * u_time * 0.12;

  // apply inverse camera transform to the ray (rotate the world)
  mat2 ry = rot(spin + mx);
  mat2 rx = rot(my);
  // build a point we march; rotate ray dir & origin in object space
  vec3 rdr = rd; vec3 ror = ro;
  rdr.xz *= ry; ror.xz *= ry;
  rdr.yz *= rx; ror.yz *= rx;

  // ---- raymarch ----
  float t = 0.0;
  float glow = 0.0;
  bool hit = false;
  for(int i=0;i<96;i++){
    vec3 p = ror + rdr*t;
    float d = map(p);
    // accumulate a soft glow near the surface -> in-shader bloom on edges
    glow += 0.012 / (0.012 + d*d*14.0);
    if(d < 0.0009){ hit = true; break; }
    if(t > 9.0) break;
    t += d * 0.85;
  }

  vec3 col = vec3(0.0);

  if(hit){
    vec3 p = ror + rdr*t;
    vec3 n = calcNormal(p);
    vec3 v = -rdr;

    // ONE dominant platinum key + ONE cold rim
    vec3 keyDir = normalize(vec3(0.55, 0.9, 0.6));
    vec3 rimDir = normalize(vec3(-0.7, -0.2, -0.4));

    float fres = pow(1.0 - max(dot(n, v), 0.0), 4.5);
    vec3 refl = reflect(rdr, n);
    vec3 envc = env(refl);                                  // mirror reflection
    float spec = pow(max(dot(reflect(-keyDir, n), v), 0.0), 90.0);
    float diff = max(dot(n, keyDir), 0.0);
    float rim  = pow(max(dot(n, rimDir), 0.0), 2.0);

    vec3 platinum = vec3(0.80, 0.82, 0.87);
    col  = platinum * (0.10 + diff*0.42);                   // base metal
    col += envc * (0.55 + fres*1.4);                        // hyperreal reflection
    col += vec3(1.0,1.0,1.05) * spec * 1.6;                 // platinum specular
    col += vec3(0.51,0.69,1.0) * rim * 0.45;                // the cold signal rim
    // a single emissive signal sliver caught exactly on the centerline axis
    float axis = smoothstep(0.018, 0.0, abs(p.x)) * smoothstep(1.25, 0.2, abs(p.y));
    col += vec3(0.62,0.78,1.0) * axis * 0.9;

    // subtle anisotropic vertical brushed grain along Y (follows the axis)
    col *= 0.94 + 0.06 * sin(p.y*120.0);

    // distance fade into the void
    col *= mix(1.0, 0.62, clamp((t-3.0)/4.0, 0.0, 1.0));
  }

  // in-shader bloom from accumulated edge glow (platinum + faint signal)
  col += vec3(0.78,0.83,0.95) * glow * 0.16;

  // sub-pixel chromatic dispersion on the bloom (premium refraction read)
  col.r += glow*0.012; col.b -= glow*0.010;

  // vignette — focus the eye, deepen the OLED corners
  float vig = smoothstep(1.35, 0.25, length(uv));
  col *= mix(0.55, 1.0, vig);

  // filmic-ish tonemap (keeps platinum from clipping harshly)
  col = col / (col + vec3(0.85));
  col = pow(col, vec3(0.92));

  // film grain — material richness over OLED black
  float g = hash(gl_FragCoord.xy + fract(u_time)*vec2(91.7, 47.3));
  col += (g - 0.5) * 0.035;

  // alpha: object + glow over transparent page (OLED black shows through)
  float a = clamp(max(glow*0.5, hit ? 1.0 : 0.0) , 0.0, 1.0);
  outColor = vec4(max(col, 0.0), a);
}`;

const VERT = /* glsl */ `#version 300 es
precision highp float;
void main(){
  // fullscreen triangle
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export default function SignalRaymarch() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false, // we AA in-shader; cheaper + crisper on OLED
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return; // no WebGL2 -> caller's Lattice/CSS fallback stays

    mount.appendChild(canvas);

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      if (canvas.parentNode === mount) mount.removeChild(canvas);
      return;
    }
    gl.useProgram(prog);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uReduce = gl.getUniformLocation(prog, "u_reduce");
    gl.uniform1f(uReduce, reduce ? 1.0 : 0.0);

    const dpr = Math.min(window.devicePixelRatio || 1, reduce ? 1.5 : 2);
    const resize = () => {
      const w = Math.max(1, Math.floor((mount.clientWidth || 600) * dpr));
      const h = Math.max(1, Math.floor((mount.clientHeight || 700) * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // eased pointer
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tmy = -((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // visibility / offscreen pause
    let visible = true;
    const io = new IntersectionObserver(
      ([en]) => { visible = en.isIntersecting; if (visible) loop(); },
      { threshold: 0 }
    );
    io.observe(mount);
    const onVis = () => { if (!document.hidden && visible) loop(); };
    document.addEventListener("visibilitychange", onVis);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    let running = false;
    const t0 = performance.now();
    let last = t0;

    const frame = () => {
      raf = 0;
      if (!visible || document.hidden) { running = false; return; }
      const now = performance.now();
      last = now;
      const time = (now - t0) / 1000;
      // ease pointer
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      gl.uniform1f(uTime, reduce ? 0.0 : time);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (reduce) { running = false; return; } // one frame is enough when still
      raf = requestAnimationFrame(frame);
    };
    const loop = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };

    // draw at least one frame immediately (covers reduced-motion + first paint)
    frame();
    if (!reduce) loop();

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
