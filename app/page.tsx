import type { Metadata } from "next";
import Link from "next/link";

import { EditorialLink } from "@/components/editorial-link";
import { Glyph } from "@/components/glyph";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: lab.name,
  description: lab.subtext,
  path: "/",
});

/* ─────────────────────────────────────────────────────────────────
   DIVISIONS — the five stations of the Spektre universe.
   Each carries an honest status tag. Lead with what is REAL.
───────────────────────────────────────────────────────────────── */
type Division = {
  index: string;
  name: string;
  sub: string;
  status: "REAL" | "EMERGING" | "VISION";
  description: string;
  href: string | null;
  external?: boolean;
};

const DIVISIONS: Division[] = [
  {
    index: "01",
    name: "Labs",
    sub: "Foundational research",
    status: "REAL" as const,
    description:
      "The research engine. Hard problems are reduced to structures, tests, papers, and executable hypotheses.",
    href: "/research",
  },
  {
    index: "02",
    name: "Systems",
    sub: "Products and infrastructure",
    status: "REAL" as const,
    description:
      "The research, made executable. Trust gates, protocols, and developer tools that ship.",
    href: "/systems",
  },
  {
    index: "03",
    name: "Studio",
    sub: "Media and culture",
    status: "EMERGING" as const,
    description:
      "Film, visual systems, interfaces, and public artifacts that turn abstract work into culture.",
    href: LINKS.youtube,
    external: true,
  },
  {
    index: "04",
    name: "Intelligence",
    sub: "AI and orchestration",
    status: "EMERGING" as const,
    description:
      "Agent systems, evaluation, memory, and orchestration. Intelligence measured the way everything here is: by what it realizes.",
    href: null,
  },
  {
    index: "05",
    name: "Compute",
    sub: "Markets and calculation",
    status: "EMERGING" as const,
    description:
      "Live computation with a number attached — fees, routing, simulation, optimization. Call the endpoint; it answers.",
    href: null,
  },
  {
    index: "06",
    name: "Health",
    sub: "Medicine and biology",
    status: "VISION" as const,
    description:
      "A future track. The same standard, pointed at medical and biological systems — named as vision, not product.",
    href: null,
  },
] as const;

const STATUS_STYLES: Record<"REAL" | "EMERGING" | "VISION", string> = {
  REAL: "text-[var(--signal)]",
  EMERGING: "text-[var(--fg-dim)]",
  VISION: "text-[var(--fg-faint)]",
};

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="mt-24 sm:mt-32 lg:mt-40">
        <Reveal delay={0}>
          <Link
            href="/web4"
            className="group block overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg-1)] transition-colors duration-500 hover:border-[var(--line-strong)] hover:bg-[var(--bg-2)]"
          >
            <div className="grid gap-px bg-[var(--line)] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-[var(--bg-1)] p-8 transition-colors duration-500 group-hover:bg-[var(--bg-2)] sm:p-10 lg:p-12">
                <p className="label mb-5 text-[var(--signal)]">Web4 · Spektre browser</p>
                <h2 className="text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] text-[var(--fg)] sm:text-[3rem] lg:text-[4rem]">
                  The internet,<br />cleaned up.
                </h2>
                <p className="mt-7 max-w-[40rem] text-[1rem] leading-[1.82] text-[var(--fg-dim)]">
                  A cleaner browser in early beta: fewer interruptions, visible
                  blocking, one place to work — and in-page AI in development.
                </p>
              </div>
              <div className="flex flex-col justify-between bg-[var(--bg-1)] p-8 transition-colors duration-500 group-hover:bg-[var(--bg-2)] sm:p-10 lg:p-12">
                <div className="space-y-5">
                  {[
                    "Same sites. Less junk.",
                    "No promise without logs, tests, demos, or pilots.",
                    "Every page ends in an action: download, pilot, or proof.",
                  ].map((line) => (
                    <p key={line} className="border-b border-[var(--line)] pb-5 text-[0.98rem] leading-[1.65] text-[var(--fg-dim)]">
                      {line}
                    </p>
                  ))}
                </div>
                <span className="label mt-10 text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                  Open Web4&nbsp;→
                </span>
              </div>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* Σ-COLLAPSE — the live proof-of-law experience. One hairline row. */}
      <section className="mt-6">
        <Reveal delay={60}>
          <Link
            href="/sigma"
            className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-t border-[var(--line)] py-6 transition-colors duration-500 hover:border-[var(--line-strong)]"
          >
            <span className="label text-[var(--signal)]">
              “Σ-COLLAPSE” · Live
            </span>
            <span className="text-[0.95rem] leading-[1.7] text-[var(--fg-dim)]">
              A compute field of up to 131,072 particles — each rendered with its
              mirror — collapses noise into the sigil. σ measured on your GPU, in
              real time.
            </span>
            <span className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
              Enter&nbsp;→
            </span>
          </Link>
        </Reveal>
      </section>

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12 sm:mb-14" />

        <Reveal delay={0}>
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Arenas</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.25rem] lg:text-[2.75rem]">
                One company.<br />Multiple hard domains.
              </h2>
            </div>
            <div className="flex flex-col justify-end lg:col-span-7 lg:col-start-6">
              <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)]">
                Labs, Systems, Studio, Intelligence, Compute — and Health, later.
                Each arena runs the same operation: a hard problem in, a working
                thing out.
              </p>
              <EditorialLink href="/universe" className="mt-6 self-start">
                See the map&nbsp;→
              </EditorialLink>
            </div>
          </div>
        </Reveal>

        <div className="space-y-0">
          {DIVISIONS.map((div, i) => (
            <Reveal key={div.index} delay={i * 70}>
              <div className="group relative border-t border-[var(--line)] py-9 transition-colors duration-500 hover:border-[var(--line-strong)] sm:py-11 lg:py-12">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
                  <div className="flex items-baseline gap-5 lg:col-span-4">
                    <span className="label shrink-0 tabular-nums text-[var(--fg-faint)]">
                      {div.index}
                    </span>
                    <div>
                      <h3 className="text-[1.45rem] font-semibold tracking-[-0.025em] leading-none text-[var(--fg)] sm:text-[1.75rem] lg:text-[2rem]">
                        {div.name}
                      </h3>
                      <p className="mt-1.5 label text-[var(--fg-faint)]">{div.sub}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:col-start-5">
                    <p className="text-[0.97rem] leading-[1.84] text-[var(--fg-dim)]">
                      {div.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:col-start-10 lg:flex-col lg:items-end lg:justify-start">
                    <span className={`label ${STATUS_STYLES[div.status]}`}>{div.status}</span>
                    {div.href ? (
                      div.external ? (
                        <a
                          href={div.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]"
                          aria-label={`Open ${div.name}`}
                        >
                          ↗
                        </a>
                      ) : (
                        <Link
                          href={div.href}
                          className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]"
                          aria-label={`View ${div.name}`}
                        >
                          →
                        </Link>
                      )
                    ) : (
                      <span className="label text-[var(--fg-faint)]">—</span>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rule mt-0" />
      </section>

      {/* ── § 1.5 · PROOF — WHAT RUNS TODAY ─────────────────────────────
          The σ-honesty answer to "is any of this real?": three endpoints
          that respond right now, plus the open source. Nothing floats.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-32 sm:mt-40 lg:mt-48">
        <Reveal delay={0}>
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label mb-3 text-[var(--fg-faint)]">Systems proof</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                What runs today.
              </h2>
              <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.75] text-[var(--fg-mute)]">
                Examples from Systems and Compute. They prove the build standard; they are
                not the full scope of Spektre.
              </p>
            </div>
            <EditorialLink href={LINKS.github} external className="shrink-0 self-start sm:self-auto">
              All open source&nbsp;↗
            </EditorialLink>
          </div>
        </Reveal>

        <div className="grid gap-px border border-[var(--line)] rounded-[var(--radius)] overflow-hidden bg-[var(--line)] sm:grid-cols-3">
          {[
            {
              name: "σ-gate",
              meta: "AI trust gate · deterministic, in-process",
              line: "A deterministic release gate for AI output: secrets, prompt injection, PII, and policy failures stopped before shipping.",
              href: "/systems",
              external: false,
            },
            {
              name: "sigma-collapse",
              meta: "Systems endpoint · live receipt",
              line: "A live API for comparing declared state to realized state and returning a deterministic verdict with a receipt.",
              href: "https://sigma-collapse-985332749804.europe-north1.run.app/collapse",
              external: true,
            },
            {
              name: "btc-edge",
              meta: "Compute edge · live mempool",
              line: "A live computation service for Bitcoin fees: reads the mempool and returns a mempool-derived fee target for fee spikes.",
              href: "https://btc-edge-985332749804.europe-north1.run.app/btc/fees",
              external: true,
            },
          ].map((sys, i) => (
            <Reveal key={sys.name} delay={i * 90} className="h-full">
              <a
                href={sys.href}
                {...(sys.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex h-full flex-col bg-[var(--bg-1)] p-8 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-10"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2.5">
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                    <span className="label text-[var(--signal)]">Live</span>
                  </span>
                  <span className="label text-[var(--fg-faint)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="metal-text text-[1.4rem] font-semibold tracking-[-0.03em] leading-[1.1]">
                  {sys.name}
                </h3>
                <p className="mt-1.5 label text-[var(--fg-faint)]">{sys.meta}</p>
                <p className="mt-5 flex-1 text-[0.94rem] leading-[1.8] text-[var(--fg-dim)]">
                  {sys.line}
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-[var(--line)] pt-6">
                  <span className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                    {sys.external ? "Call it" : "See it run"}
                  </span>
                  <span className="ml-auto label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                    {sys.external ? "↗" : "→"}
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 text-center text-[0.9rem] leading-[1.7] text-[var(--fg-mute)]">
            Open research and source code are public on{" "}
            <EditorialLink href={LINKS.github} external className="text-[var(--fg-dim)]">
              github.com/spektre-labs
            </EditorialLink>
            .
          </p>
        </Reveal>
      </section>

      <section className="mt-28 px-0 sm:mt-36 lg:mt-44">
        <Reveal delay={0}>
          <div className="mb-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label mb-3 text-[var(--fg-faint)]">Translation layer</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Theory becomes things people can use.
              </h2>
            </div>
            <EditorialLink href="/connect" className="shrink-0 self-start sm:self-auto">
              Work with Spektre&nbsp;→
            </EditorialLink>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Products",
              meta: "Software · AI · Tools",
              line: "Systems with a clear job: check, route, compute, protect, generate, or decide.",
              href: "/systems",
            },
            {
              name: "Services",
              meta: "Architecture · Builds",
              line: "Problem framing, technical architecture, prototypes, product builds, and AI workflows.",
              href: "/connect",
            },
            {
              name: "Research",
              meta: "Papers · Protocols",
              line: "Models, tests, protocols, and concepts that make the products stronger.",
              href: "/research",
            },
            {
              name: "Ventures",
              meta: "Studio · Compute · Health",
              line: "New domains where the same standard becomes a company, media property, or platform.",
              href: "/universe",
            },
          ].map((item, i) => (
            <Reveal key={item.name} delay={i * 80} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full min-h-[18rem] flex-col bg-[var(--bg-1)] p-8 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-9"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="label tabular-nums text-[var(--fg-faint)]">{String(i + 1).padStart(2, "0")}</span>
                  <Glyph variant="node" size={20} strokeOpacity={0.35} />
                </div>
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[var(--fg)] sm:text-[1.5rem]">
                  {item.name}
                </h3>
                <p className="mt-2 label text-[var(--fg-faint)]">{item.meta}</p>
                <p className="mt-5 flex-1 text-[0.94rem] leading-[1.8] text-[var(--fg-dim)]">
                  {item.line}
                </p>
                <div className="mt-8 border-t border-[var(--line)] pt-6">
                  <span className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                    Open&nbsp;→
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-36 sm:mt-44 lg:mt-56">
        <div className="rule mb-14" />

        <Reveal delay={0}>
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Operating model</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.25rem] lg:text-[2.75rem]">
                Hard problem.<br />Working system.
              </h2>
            </div>
            <div className="flex flex-col justify-end lg:col-span-7 lg:col-start-6">
              <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)]">
                The standard is simple: find the real problem, reduce it to structure,
                build the system, and prove it in use. Theory stays behind the product
                until someone needs the deep layer.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "Find",
              meta: "Problem",
              line: "Enter before the category is clean. Identify the actual load-bearing problem.",
            },
            {
              name: "Structure",
              meta: "Model",
              line: "Turn complexity into a usable model, protocol, test, interface, or system map.",
            },
            {
              name: "Build",
              meta: "Artifact",
              line: "Ship something that runs: code, demo, endpoint, workflow, media, or tool.",
            },
            {
              name: "Prove",
              meta: "Use",
              line: "Expose behavior in the world: open source, live endpoints, receipts, demos, and iteration.",
            },
          ].map((step, i) => (
            <Reveal key={step.name} delay={i * 70} className="h-full">
              <div className="flex h-full min-h-[16rem] flex-col bg-[var(--bg-1)] p-8 sm:p-9">
                <div className="mb-8 flex items-center justify-between">
                  <span className="label tabular-nums text-[var(--fg-faint)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label text-[var(--fg-faint)]">{step.meta}</span>
                </div>
                <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[var(--fg)] sm:text-[1.5rem]">
                  {step.name}
                </h3>
                <p className="mt-5 text-[0.94rem] leading-[1.8] text-[var(--fg-dim)]">
                  {step.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rule mt-0" />
      </section>

      {/* ── § 4 · STUDIO TEASER ─────────────────────────────────────────
          Film · YouTube channel active · structured as editorial spread.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-36 sm:mt-44 lg:mt-56">
        <Reveal delay={0}>
          <div className="surface overflow-hidden rounded-[var(--radius)]">
            <div className="grid lg:grid-cols-2">
              {/* Text side */}
              <div className="p-8 sm:p-12 lg:p-16 xl:p-20">
                <p className="label mb-6 text-[var(--fg-faint)]">Division&nbsp;03&nbsp;·&nbsp;Studio</p>

                <Reveal delay={80}>
                  <h2 className="metal-text text-[2rem] font-semibold tracking-[-0.035em] leading-[1.06] sm:text-[2.6rem] lg:text-[3rem]">
                    Spektre&nbsp;Studio
                  </h2>
                </Reveal>

                <Reveal delay={160}>
                  <p className="mt-5 max-w-[32rem] text-[1.05rem] leading-[1.84] text-[var(--fg-dim)]">
                    Film, visual systems, experiments, and public artifacts. The Studio turns
                    the same architecture into culture people can see before they can name it.
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a
                      href={LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-metal rounded-[10px] px-6 py-3 text-[0.88rem] font-semibold tracking-tight no-underline"
                    >
                      @spektrelabs&nbsp;→
                    </a>
                    <span className="label text-[var(--fg-faint)]">YouTube&nbsp;·&nbsp;Active</span>
                  </div>
                </Reveal>
              </div>

              {/* Data / ornament side */}
              <div className="relative flex items-center justify-center border-t border-[var(--line)] bg-[var(--bg-2)] p-16 lg:border-l lg:border-t-0">
                <Glyph variant="seal" size={220} strokeOpacity={0.18} className="absolute" />
                <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                  <Reveal delay={200}>
                    <p className="label text-[var(--fg-faint)]">Signal Chain</p>
                  </Reveal>
                  {["Research", "Insight", "Script", "Render", "Publish"].map((step, i) => (
                    <Reveal key={step} delay={220 + i * 60}>
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-[0.92rem] font-medium tracking-[-0.01em] text-[var(--fg-dim)]">
                          {step}
                        </p>
                        {i < 4 ? (
                          <span className="label text-[var(--fg-faint)]">↓</span>
                        ) : null}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── § 4.5 · VALUES ──────────────────────────────────────────────
          Six non-negotiables, a perfectly symmetric grid. Mono name + one
          terse σ-honest line each. The operating bar, rendered.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-40 sm:mt-52 lg:mt-64">
        <div className="rule mb-14 sm:mb-18" />
        <Reveal delay={0}>
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Brand law</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem] lg:text-[2.5rem]">
                Taste is operational.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end">
              <p className="text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] max-w-[38rem]">
                The design system is not decoration. It is the visible face of the operating
                standard: precise, fast, restrained, expensive, and impossible to confuse.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-px border border-[var(--line)] rounded-[var(--radius)] overflow-hidden bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Depth", line: "Every surface needs substance under it: research, product, proof, or craft." },
            { name: "Speed", line: "Show live systems early. Momentum is part of the brand." },
            { name: "Precision", line: "No vague claims. Say what exists, what works, and what is still forming." },
            { name: "Restraint", line: "Fewer objects, stronger objects. One signal earns more than ten effects." },
            { name: "Range", line: "AI, compute, medicine, media, and systems can share one operating grammar." },
            { name: "Independence", line: "Founder-led, Helsinki-based, and built without waiting for permission." },
          ].map((v, i) => (
            <Reveal key={v.name} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col bg-[var(--bg-1)] p-8 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-9">
                <div className="mb-6 flex items-center justify-between">
                  <span className="label text-[var(--fg-faint)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <Glyph variant="node" size={16} strokeOpacity={0.25} />
                </div>
                <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                  {v.name}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-[1.75] text-[var(--fg-dim)]">
                  {v.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── § 5 · FOUNDER TEASER ────────────────────────────────────────
          One architect. Restrained, editorial. Links to /about.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-36 sm:mt-44 lg:mt-56">
        <div className="rule mb-14" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left label column */}
          <Reveal delay={0} className="lg:col-span-3">
            <p className="label mb-4 text-[var(--fg-faint)]">Founder · Architect</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[var(--fg)] sm:text-[1.85rem]">
              Founder-led.<br />System-built.
            </h2>
          </Reveal>

          {/* Right content column */}
          <div className="lg:col-span-8 lg:col-start-5">
            <Reveal delay={80}>
              <p className="label mb-5 text-[var(--signal)]">
                {lab.about.authorSection.name}
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="label mb-8 text-[var(--fg-faint)]">
                {lab.about.authorSection.role}
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p className="max-w-[44rem] text-pretty text-[1.05rem] leading-[1.88] text-[var(--fg-dim)]">
                {/* Trimmed to the essential arc */}
                An independent systems architect and self-taught researcher building Spektre as a
                multi-domain lab: research, code, AI, computation, media, and future ventures. The
                work starts from hard problems and ends in systems people can run, inspect, and use.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <EditorialLink
                  href="/about"
                  className="btn-metal rounded-[8px] px-5 py-2.5 text-[0.82rem] font-medium tracking-[0.06em] uppercase no-underline"
                >
                  Full Profile
                </EditorialLink>
                <span className="h-px w-8 bg-[var(--line-strong)]" />
                <EditorialLink href={LINKS.linkedin} external>
                  LinkedIn&nbsp;↗
                </EditorialLink>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="rule mt-14" />
      </section>

      {/* ── § 6 · CLOSING ───────────────────────────────────────────────
          Strong terse statement. Two CTAs. Glyph seal. Perfect symmetry.
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative mt-44 overflow-hidden pb-28 sm:mt-56 sm:pb-36 lg:mt-72 lg:pb-48">
        <div className="rule mb-0" />

        {/* Glyph seal — centered absolute backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <Glyph variant="seal" size={560} strokeOpacity={0.06} />
        </div>

        <div className="relative flex flex-col items-center px-6 py-28 text-center sm:py-36 lg:py-48">
          {/* Label */}
          <Reveal delay={0}>
            <p className="label text-[var(--fg-faint)]">Start here</p>
          </Reveal>

          {/* Statement */}
          <Reveal delay={80}>
            <h2 className="metal-text mt-8 max-w-[28rem] text-balance text-[2.6rem] font-semibold tracking-[-0.045em] leading-[1.03] sm:text-[3.5rem] lg:text-[4.5rem]">
              Bring the hard problem.
            </h2>
          </Reveal>

          {/* Sub-copy */}
          <Reveal delay={160}>
            <p className="mt-7 max-w-[30rem] text-pretty text-[1rem] leading-[1.86] text-[var(--fg-mute)]">
              Spektre is built for problems that need research, architecture, product taste, and
              working systems at the same time.
            </p>
          </Reveal>

          {/* Symmetric hairline */}
          <Reveal delay={220}>
            <div className="mt-10 flex items-center gap-6 sm:gap-10">
              <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
              <Glyph variant="node" size={18} strokeOpacity={0.45} />
              <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
            </div>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/systems"
                className="btn-metal rounded-[10px] px-8 py-3.5 text-[0.92rem] font-semibold tracking-tight"
              >
                See live systems
              </Link>
              <Link
                href="/universe"
                className="rounded-[10px] border border-[var(--line-strong)] px-8 py-3.5 text-[0.92rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
              >
                Explore domains
              </Link>
              <Link
                href="/connect"
                className="rounded-[10px] border border-[var(--line-strong)] px-8 py-3.5 text-[0.92rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
              >
                Work with us
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="rule" />
      </section>
    </div>
  );
}
