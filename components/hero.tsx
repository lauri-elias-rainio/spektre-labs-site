import Link from "next/link";

import { SigmaCollapse } from "@/components/hero/sigma-collapse";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

// On the OLED stage the buttons read against true-black: one platinum chrome
// CTA (the primary action) + one hairline-ghost secondary. One .btn-metal/view.
const PRIMARY_BTN =
  "inline-flex h-9 items-center justify-center rounded-sm border border-white/50 bg-gradient-to-b from-[#f6f7f9] via-[#cdd1d8] to-[#aeb3bc] px-4 text-sm font-medium tracking-[-0.01em] text-[#0a0b0d] transition-[filter] duration-300 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9bdc6]";
const GHOST_BTN =
  "inline-flex h-9 items-center justify-center rounded-sm border border-white/15 bg-transparent px-4 text-sm font-medium tracking-[-0.01em] text-[#f4f5f7] transition-colors duration-300 hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b9bdc6]";

/**
 * The bilateral hero — OLED true-black stage, the generative platinum seal
 * behind, the wordmark + thesis centered on the vertical axis (1 = 1 rendered).
 *
 * STYLE_LAW: monochrome + one cold signal, perfect bilateral symmetry, one
 * display size, one ornament system, generous void, reduced-motion safe.
 */
export function Hero() {
  return (
    <section className="spektre-stage relative -mx-6 -mt-10 overflow-hidden border-b border-white/10 px-6 pb-24 pt-24 sm:-mx-10 sm:px-10 sm:pb-28 sm:pt-28 lg:-mx-14 lg:px-14 lg:pb-36 lg:pt-32">
      {/* Σ-COLLAPSE — WebGPU compute → WebGL2 sculpture → poster; reduced-motion safe. */}
      <SigmaCollapse />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="spektre-label spektre-rise" style={{ animationDelay: "0ms" }}>
          “Research Laboratory” · {lab.location} · 60.17°N 24.94°E
        </p>

        <h1
          className="spektre-metal-text spektre-rise mt-8 text-balance text-[3.4rem] leading-[0.98] tracking-[-0.02em] sm:text-[4.8rem] lg:text-[6rem]"
          style={{ animationDelay: "80ms", fontFamily: "var(--font-display), 'Times New Roman', serif" }}
        >
          {lab.name}
        </h1>

        <p
          className="spektre-rise mt-7 max-w-[34rem] text-pretty text-[1.18rem] font-medium leading-[1.3] text-[#f4f5f7] sm:text-[1.5rem]"
          style={{ animationDelay: "160ms" }}
        >
          {lab.home.hero.tagline}
        </p>

        <div
          className="spektre-rise mt-8 max-w-[36rem] space-y-4 text-[0.98rem] leading-[1.85] text-[#b6bac1]"
          style={{ animationDelay: "240ms" }}
        >
          {lab.home.hero.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div
          className="spektre-rise mt-11 flex flex-wrap items-center justify-center gap-x-3 gap-y-3"
          style={{ animationDelay: "320ms" }}
        >
          <Link href="/artifacts" className={PRIMARY_BTN}>
            View Artifacts
          </Link>
          <Link
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={GHOST_BTN}
          >
            GitHub
          </Link>
        </div>

        {/* The closing axiom, centered on the bilateral axis. */}
        <p
          className="spektre-label spektre-rise mt-14"
          style={{ animationDelay: "420ms", color: "#cfe3ff" }}
        >
          1 = 1 · Declared = Realized
        </p>
      </div>
    </section>
  );
}
