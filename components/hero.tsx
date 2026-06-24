import Link from "next/link";

import { Lattice } from "@/components/lattice";
import SignalWebGPU from "@/components/signal-webgpu";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

// SignalWebGPU is a client component that renders an empty div on the server and only loads
// three.js (WebGPU → WebGL2 fallback) inside useEffect — so a plain import is SSR-safe, and if
// it fails to initialise the <Lattice/> underneath stays visible. No next/dynamic needed.

const hero = lab.home.hero;

export function Hero() {
  return (
    <section className="relative -mx-6 -mt-4 overflow-hidden px-6 pb-24 pt-10 sm:-mx-8 sm:px-8 sm:pb-28 sm:pt-14 lg:pb-36">
      {/* THE OBELISK — WebGPU signature monolith, layered over the canvas Lattice fallback */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 left-[14%] opacity-90">
          <Lattice />
          <SignalWebGPU />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* industrial metadata rail */}
      <div className="rise flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--line-soft)] pb-5">
        <span className="label">Spektre&nbsp;Labs</span>
        <span className="label hidden sm:inline">Helsinki&nbsp;·&nbsp;60.17°N</span>
        <span className="label hidden md:inline">Protocol&nbsp;v1.1</span>
        <span className="label hidden md:inline">σ&nbsp;:&nbsp;1&nbsp;=&nbsp;1</span>
        <span className="label ml-auto text-[var(--fg-faint)]">Est.&nbsp;MMXXVI</span>
      </div>

      <div className="relative max-w-[60rem] pt-16 sm:pt-24 lg:pt-28">
        {/* eyebrow */}
        <p className="rise label mb-7 text-[var(--fg-mute)]" style={{ animationDelay: "0.05s" }}>
          {hero.eyebrow}
        </p>

        {/* the question — the one thing a first-time visitor reads */}
        <h1
          className="rise-blur metal-text hero-display max-w-[18ch] text-balance"
          style={{ animationDelay: "0.1s" }}
        >
          {hero.headline}
        </h1>

        {/* the axiom — the answer, rendered as the one signature mark. Symmetric, 1=1. */}
        <div
          className="rise mt-9 flex items-center gap-5 sm:gap-7"
          style={{ animationDelay: "0.2s" }}
        >
          <span className="axis-signal h-12 sm:h-14" aria-hidden />
          <div>
            <p
              className="metal-text text-[2.2rem] font-semibold leading-none tracking-[-0.05em] sm:text-[2.8rem]"
              aria-label="One equals one"
            >
              1&thinsp;=&thinsp;1
            </p>
            <p className="mt-2 max-w-[32rem] text-[0.95rem] leading-[1.6] text-[var(--fg-mute)]">
              {hero.axiomGloss}
            </p>
          </div>
        </div>

        {/* the concrete proof — what's actually real */}
        <p
          className="rise mt-9 max-w-[38rem] text-pretty text-[1.08rem] leading-[1.8] text-[var(--fg-dim)] sm:text-[1.18rem] lg:mt-11"
          style={{ animationDelay: "0.28s" }}
        >
          {hero.sub}
        </p>

        {/* what to do */}
        <div
          className="rise mt-12 flex flex-wrap items-center gap-3 lg:mt-14"
          style={{ animationDelay: "0.36s" }}
        >
          <Link
            href={hero.primaryCta.href}
            className="btn-metal rounded-[10px] px-6 py-3 text-[0.95rem] font-semibold tracking-tight"
          >
            {hero.primaryCta.label}&nbsp;→
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="rounded-[10px] border border-[var(--line-strong)] px-6 py-3 text-[0.95rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
          >
            {hero.secondaryCta.label}
          </Link>
          <Link
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="label ml-2 hidden text-[var(--fg-faint)] transition-colors duration-500 hover:text-[var(--fg-mute)] sm:inline"
          >
            GitHub&nbsp;↗
          </Link>
        </div>
      </div>
    </section>
  );
}
