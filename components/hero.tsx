import Link from "next/link";

import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

const hero = lab.home.hero;

/*
  The hero is a brand moment — centered on the page axis (Symmetry Law §5).
  The visual is THE DESCENT field behind the whole page; the hero owns the
  first station (the monolith), so this component is pure typography on void.
*/
export function Hero() {
  return (
    <section
      data-descent-stage="monolith"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center pb-24 pt-16 text-center sm:pb-28"
    >
      <div className="rise flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <span className="label">Spektre</span>
        <span className="label hidden sm:inline">Helsinki&nbsp;·&nbsp;60.17°N</span>
        <span className="label hidden md:inline">Independent&nbsp;lab</span>
        <span className="label text-[var(--fg-faint)]">Est.&nbsp;MMXXVI</span>
      </div>

      <h1
        className="rise-blur metal-text hero-display mt-12 max-w-[13ch] text-balance"
        style={{ animationDelay: "0.1s" }}
      >
        {hero.headline}
      </h1>

      <p
        className="rise mt-8 max-w-[36rem] text-pretty text-[1.02rem] leading-[1.8] text-[var(--fg-dim)] sm:text-[1.1rem]"
        style={{ animationDelay: "0.18s" }}
      >
        {hero.sub}
      </p>

      {/* symmetric hairline device — the axis, stated */}
      <div
        className="rise mt-10 flex items-center gap-6 sm:gap-10"
        style={{ animationDelay: "0.24s" }}
      >
        <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
        <span className="label text-[var(--fg-mute)]">{hero.axiom}</span>
        <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
      </div>

      <div
        className="rise mt-10 flex flex-wrap items-center justify-center gap-3"
        style={{ animationDelay: "0.3s" }}
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

      <p
        className="rise absolute bottom-8 label text-[var(--fg-faint)]"
        style={{ animationDelay: "0.5s" }}
      >
        Scroll&nbsp;·&nbsp;The&nbsp;descent
      </p>
    </section>
  );
}
