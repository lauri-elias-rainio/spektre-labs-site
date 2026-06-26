"use client";

import { useEffect, useRef } from "react";

/**
 * σ-MEMBRANE — the hero centerpiece nobody has shipped: a live fragment-shader
 * field where OLED-black NOISE continuously resolves into ONE breathing platinum
 * signal membrane (the browser's whole thesis — signal over noise — made visual).
 * Resolution-independent (renders crisp at any DPR → "8K"), reduced-motion safe,
 * pure WebGL (no three.js dependency, can't break the existing scene). STYLE_LAW:
 * OLED base, platinum ink, ONE #cfe3ff signal, generous void, one slow motion.
 *
 * Drop-in: import { SigmaMembrane } and use it in place of <SigmaScene/> to A/B.
 */
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_motion;          // 0 = reduced motion (frozen), 1 = alive

// hash + value noise + fbm (classic, stable, cheap)
float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
  return v;
}

void main(){
  vec2 uv=(gl_FragCoord.xy*2.0-u_res)/min(u_res.x,u_res.y);
  float t=u_time*0.05*u_motion;

  // the NOISE field — faint platinum static, drifting slowly
  float n=fbm(uv*2.2+vec2(t,t*0.6));
  float n2=fbm(uv*5.0-vec2(t*0.4,t));

  // the SIGNAL membrane — a single horizontal band that the noise warps; it is
  // sharp at the centre line and dissolves into the void above/below (signal>noise).
  float warp=(n-0.5)*0.55 + (n2-0.5)*0.18;
  float band=uv.y + warp;
  float membrane=exp(-band*band*14.0);                 // the one bright line
  float halo=exp(-band*band*2.2)*0.28;                 // its soft platinum aura

  // platinum noise base (cold, near-black) + the single cyan signal on the membrane
  vec3 platinum=vec3(0.72,0.75,0.80);
  vec3 signal=vec3(0.81,0.89,1.0);                     // #cfe3ff-ish
  float grain=(n*0.06+n2*0.04);                        // barely-there platinum static
  vec3 col=vec3(0.004)+platinum*grain*0.5;             // OLED void + faint static
  col+=platinum*halo;                                   // membrane aura (platinum)
  col+=signal*membrane;                                 // THE signal (one cyan line)

  // gentle vignette to seat it on true black (≥60% void preserved)
  float r=length(uv*vec2(0.7,1.0));
  col*=smoothstep(1.5,0.2,r);
  col=clamp(col,0.0,1.0);
  gl_FragColor=vec4(col,1.0);
}`;

const VERT = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.0,1.0); }`;

export function SigmaMembrane() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 1;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMotion = gl.getUniformLocation(prog, "u_motion");
    gl.uniform1f(uMotion, reduce);

    let raf = 0; const t0 = performance.now();
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth * dpr, h = cv.clientHeight * dpr;
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
      gl.uniform2f(uRes, w, h);
    };
    const frame = () => {
      resize();
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) return;            // reduced motion → render once, don't loop
      raf = requestAnimationFrame(frame);
    };
    frame();
    const onResize = () => { if (reduce) frame(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* seat the field on true black so ≥60% void is preserved around the lockup */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 50% 50%, transparent 30%, #000 82%)" }} />
    </div>
  );
}
