"use client";

/*
  Shoreworld experience shell — on-canon HUD over the live procedural engine.
  The engine runs immediately (fixed, z-0); this layer is the platinum HUD
  + the ENTER gate. Canon: OLED black · platinum hairlines · one cold signal.
*/

import { useState } from "react";

import { Glyph } from "@/components/glyph";
import ShoreworldEngine from "@/components/shoreworld-engine";

export default function ShoreworldExperience() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <ShoreworldEngine />

      {/* ── HUD frame — thin platinum corners ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="absolute left-5 top-24 sm:left-8 sm:top-28">
          <p
            className="label text-[0.56rem] tracking-[0.28em]"
            style={{ color: "var(--metal-3)" }}
          >
            Spektre Labs · Shoreworld
          </p>
          <p
            className="mt-1 label text-[0.5rem] tracking-[0.22em]"
            style={{ color: "var(--fg-faint)" }}
          >
            Procedural reality engine
          </p>
        </div>

        <div className="absolute right-5 top-24 text-right sm:right-8 sm:top-28">
          <p
            className="label text-[0.5rem] tracking-[0.24em]"
            style={{ color: "var(--fg-faint)" }}
          >
            The world is the math
          </p>
          <p
            className="mt-1 label text-[0.5rem] tracking-[0.24em]"
            style={{ color: "var(--signal)" }}
          >
            1 = 1
          </p>
        </div>

        {/* back to Shoreworld */}
        <a
          href="/shoreworld"
          className="pointer-events-auto absolute bottom-5 left-5 no-underline sm:bottom-7 sm:left-8"
        >
          <span
            className="label text-[0.56rem] tracking-[0.24em] transition-colors duration-300 hover:text-[var(--fg)]"
            style={{ color: "var(--fg-mute)" }}
          >
            ← Shoreworld
          </span>
        </a>
      </div>

      {/* ── ENTER gate — fades out, engine already alive behind ──────── */}
      <div
        className={`fixed inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-[1400ms] ${
          entered ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.35), rgba(0,0,0,0.86) 70%)",
        }}
      >
        <Glyph variant="seal" size={132} strokeOpacity={0.4} />
        <h1
          className="metal-text mt-9 text-center text-[1.9rem] font-semibold tracking-[-0.03em] sm:text-[2.6rem]"
          style={{ maxWidth: "20ch" }}
        >
          The Coherence Capital
        </h1>
        <p
          className="mt-5 max-w-[40ch] text-center text-[0.95rem] leading-[1.8]"
          style={{ color: "var(--fg-dim)" }}
        >
          A world generated live by the axiom — perfect symmetry, rendered on
          your GPU. Nothing here is pre-baked. The structure holds because{" "}
          <span className="text-[var(--fg)]">declared = realized</span>.
        </p>
        <button
          onClick={() => setEntered(true)}
          className="btn-metal mt-10"
          aria-label="Enter the procedural capital"
        >
          Enter
        </button>
        <p
          className="mt-7 label text-[0.5rem] tracking-[0.24em]"
          style={{ color: "var(--fg-faint)" }}
        >
          WebGPU · real-time · procedural
        </p>
      </div>
    </>
  );
}
