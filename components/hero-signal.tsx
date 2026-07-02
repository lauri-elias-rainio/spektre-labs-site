"use client";

/*
  HeroSignal — the home hero visual with a σ-honest handoff:
  the CSS monolith renders instantly (0ms) and yields to THE SIGIL PRISM —
  a raw-WebGL2 raymarch whose silhouette is traced 1:1 from this same CSS
  polygon — once the engine has PROVEN it draws (3 real frames). Same shape,
  now with a traveling specular, chamfer facets and a breathing signal.
  If WebGL2 is missing or the shader fails, the CSS art simply stays.
*/

import { useState } from "react";

import SignalRaymarch from "@/components/signal-raymarch";

export default function HeroSignal() {
  const [live, setLive] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          opacity: live ? 1 : 0,
          transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <SignalRaymarch variant="prism" onLive={() => setLive(true)} />
      </div>
      <div
        className="hero-monolith-fallback"
        aria-hidden
        style={{
          opacity: live ? 0 : undefined,
          transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
    </>
  );
}
