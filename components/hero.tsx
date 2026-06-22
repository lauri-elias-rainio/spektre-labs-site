import Link from "next/link";

import { Lattice } from "@/components/lattice";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

export function Hero() {
  return (
    <section className="relative -mx-6 -mt-4 overflow-hidden px-6 pb-24 pt-10 sm:-mx-8 sm:px-8 sm:pb-28 sm:pt-14 lg:pb-36">
      {/* signal object */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 left-[8%] opacity-90">
          <Lattice />
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
        <p className="rise label mb-7 text-[var(--fg-mute)]" style={{ animationDelay: "0.05s" }}>
          &ldquo;Independent Research Laboratory&rdquo;
        </p>

        <h1
          className="rise metal-text max-w-[46rem] text-balance text-[3.1rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[4.4rem] md:text-[5.6rem] lg:text-[6.6rem]"
          style={{ animationDelay: "0.1s" }}
        >
          {lab.name}
        </h1>

        <p
          className="rise mt-8 max-w-[34rem] text-pretty text-[1.4rem] font-medium leading-[1.18] text-[var(--fg)] sm:text-[1.75rem] lg:mt-10 lg:text-[2rem]"
          style={{ animationDelay: "0.18s" }}
        >
          {lab.home.hero.tagline}
        </p>

        <div
          className="rise mt-9 max-w-[37rem] space-y-4 text-[1.02rem] leading-[1.85] text-[var(--fg-dim)] lg:mt-11"
          style={{ animationDelay: "0.26s" }}
        >
          {lab.home.hero.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div
          className="rise mt-12 flex flex-wrap items-center gap-3 lg:mt-14"
          style={{ animationDelay: "0.34s" }}
        >
          <Link
            href="/artifacts"
            className="btn-metal rounded-[10px] px-6 py-3 text-[0.95rem] font-semibold tracking-tight"
          >
            View Artifacts
          </Link>
          <Link
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] border border-[var(--line-strong)] px-6 py-3 text-[0.95rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
          >
            GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
