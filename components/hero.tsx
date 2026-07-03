import Link from "next/link";

import MonumentHero from "@/components/monument";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

const hero = lab.home.hero;

/*
  The hero is a brand moment — a full-bleed cinematic scene (THE MONUMENT v2)
  with typography in its own reserved band at the base. Scene and text never
  compete: the monument owns the upper frame, the words sit on pure black
  behind a gradient shield. Centered on the page axis (Symmetry Law §5).
*/
export function Hero() {
  return (
    <section
      data-descent-stage="monolith"
      className="relative isolate -mx-6 -mt-4 min-h-[100svh] overflow-hidden px-6 sm:-mx-8 sm:px-8"
    >
      {/* the scene — full bleed behind everything in the hero */}
      <div className="absolute inset-0 z-0">
        <MonumentHero />
        {/* legibility shield: the text band floor — pure black, hard guarantee */}
        {/* light shield — the storm stays visible beneath the words */}
        <div className="absolute inset-x-0 bottom-0 h-[34svh] bg-gradient-to-t from-[rgba(0,0,0,0.88)] via-[rgba(0,0,0,0.5)] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* coordinates rail — top, out of the scene's way */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-8">
        <span className="label">Spektre</span>
        <span className="label hidden sm:inline">Helsinki&nbsp;·&nbsp;60.17°N</span>
        <span className="label hidden md:inline">Independent&nbsp;lab</span>
        <span className="label text-[var(--fg-faint)]">Est.&nbsp;MMXXVI</span>
      </div>

      {/* the words — their own band at the base, never over the monument */}
      <div className="absolute inset-x-6 bottom-0 z-10 flex flex-col items-center pb-14 text-center sm:inset-x-8 sm:pb-16">
        <h1 className="rise-blur metal-text hero-display max-w-[13ch] text-balance">
          {hero.headline}
        </h1>

        <p
          className="rise mt-6 max-w-[36rem] text-pretty text-[1rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.06rem]"
          style={{ animationDelay: "0.12s" }}
        >
          {hero.sub}
        </p>

        <div
          className="rise mt-7 flex items-center gap-6 sm:gap-10"
          style={{ animationDelay: "0.18s" }}
        >
          <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
          <span className="label text-[var(--fg-mute)]">{hero.axiom}</span>
          <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
        </div>

        <div
          className="rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.24s" }}
        >
          <Link
            href={hero.primaryCta.href}
            className="btn-metal rounded-[10px] px-7 py-3 text-[0.95rem] font-semibold tracking-tight"
          >
            {hero.primaryCta.label}&nbsp;→
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="rounded-[10px] border border-[var(--line-strong)] px-7 py-3 text-[0.95rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
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
