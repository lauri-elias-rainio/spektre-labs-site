import Link from "next/link";

import HeroMonument from "@/components/hero-monument";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

const hero = lab.home.hero;

export function Hero() {
  return (
    <section className="relative isolate -mx-6 -mt-4 min-h-[calc(100svh-5rem)] overflow-hidden px-6 pb-20 pt-10 sm:-mx-8 sm:px-8 sm:pb-24 sm:pt-14 lg:pb-28">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-y-[-8%] right-[-26%] h-[116%] w-[120vw] opacity-70 sm:right-[-18%] sm:w-[88vw] lg:right-0 lg:w-[56vw]"
          aria-hidden
        >
          <HeroMonument />
          <div className="hero-monolith-fallback" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,0.92)_28%,rgba(0,0,0,0.54)_58%,rgba(0,0,0,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(72%_58%_at_18%_16%,rgba(255,255,255,0.045),transparent_58%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[calc(100svh-11rem)] flex-col">
        <div className="max-w-[62rem]">
          <div className="rise flex max-w-[54rem] flex-wrap items-center gap-x-5 gap-y-2 border-b border-[var(--line-soft)] pb-4">
            <span className="label">Spektre</span>
            <span className="label hidden sm:inline">Helsinki&nbsp;·&nbsp;60.17°N</span>
            <span className="label hidden md:inline">Multi-domain</span>
            <span className="label hidden md:inline">Working&nbsp;systems</span>
            <span className="label ml-auto text-[var(--fg-faint)]">Est.&nbsp;MMXXVI</span>
          </div>

          <div className="pt-16 sm:pt-24 lg:pt-28">
            <p className="rise label mb-7 text-[var(--fg-mute)]" style={{ animationDelay: "0.05s" }}>
              {hero.eyebrow}
            </p>

            <h1
              className="rise-blur metal-text hero-display max-w-[11ch] text-balance"
              style={{ animationDelay: "0.1s" }}
            >
              {hero.headline}
            </h1>

            <p className="rise mt-7 max-w-[34rem] text-pretty text-[1rem] leading-[1.75] text-[var(--fg-dim)] sm:text-[1.08rem]" style={{ animationDelay: "0.18s" }}>
              {hero.sub}
            </p>

            <div className="rise mt-7 flex max-w-[36rem] flex-wrap gap-x-4 gap-y-2" style={{ animationDelay: "0.22s" }}>
              {["Labs", "Systems", "Studio", "Intelligence", "Compute", "Health"].map((domain) => (
                <span key={domain} className="label text-[var(--fg-faint)]">
                  {domain}
                </span>
              ))}
            </div>

            <div className="rise mt-10 flex flex-wrap items-center gap-3 lg:mt-12" style={{ animationDelay: "0.3s" }}>
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
        </div>
      </div>
    </section>
  );
}
