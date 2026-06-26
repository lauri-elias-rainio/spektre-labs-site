import Link from "next/link";

import SignalRaymarch from "@/components/signal-raymarch";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

// SignalRaymarch is the hero's single signature object: a raw-WebGL2 fullscreen
// raymarched SDF that renders reliably across browsers and cleanly disappears
// when WebGL2 is unavailable.

const hero = lab.home.hero;

export function Hero() {
  return (
    <section className="relative -mx-6 -mt-4 overflow-hidden px-6 pb-24 pt-10 sm:-mx-8 sm:px-8 sm:pb-28 sm:pt-14 lg:pb-36">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-y-0 right-[-10%] w-[78vw] max-w-[58rem] opacity-95 sm:right-[-6%] sm:w-[60vw] lg:right-[-2%] lg:w-[46vw]">
          <SignalRaymarch />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(90%_72%_at_28%_22%,rgba(255,255,255,0.05),transparent_58%),radial-gradient(70%_55%_at_84%_16%,rgba(207,227,255,0.08),transparent_54%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="rise flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-[var(--line-soft)] pb-5">
        <span className="label">Spektre&nbsp;Labs</span>
        <span className="label hidden sm:inline">Helsinki&nbsp;·&nbsp;60.17°N</span>
        <span className="label hidden md:inline">Protocol&nbsp;v1.1</span>
        <span className="label hidden md:inline">σ&nbsp;:&nbsp;1&nbsp;=&nbsp;1</span>
        <span className="label ml-auto text-[var(--fg-faint)]">Est.&nbsp;MMXXVI</span>
      </div>

      <div className="relative max-w-[56rem] pt-16 sm:pt-24 lg:pt-28">
        <p className="rise label mb-7 text-[var(--fg-mute)]" style={{ animationDelay: "0.05s" }}>
          {hero.eyebrow}
        </p>

        <h1
          className="rise-blur metal-text hero-display max-w-[14ch] text-balance"
          style={{ animationDelay: "0.1s" }}
        >
          {hero.headline}
        </h1>

        <div
          className="rise mt-10 flex max-w-[34rem] items-center gap-5 sm:gap-7"
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
            <p className="mt-2 text-[0.95rem] leading-[1.6] text-[var(--fg-mute)] sm:text-[1rem]">
              {hero.axiomGloss}
            </p>
          </div>
        </div>

        <p
          className="rise mt-9 max-w-[36rem] text-pretty text-[1.05rem] leading-[1.8] text-[var(--fg-dim)] sm:text-[1.12rem] lg:mt-11"
          style={{ animationDelay: "0.28s" }}
        >
          {hero.sub}
        </p>

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
