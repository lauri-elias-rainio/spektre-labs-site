import type { Metadata } from "next";
import Link from "next/link";

import { EditorialLink } from "@/components/editorial-link";
import { Glyph } from "@/components/glyph";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { getArtifacts } from "@/lib/artifacts";
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
    name: "Research",
    sub: "The papers",
    status: "REAL" as const,
    description:
      "The papers. We map why systems stay coherent or collapse — and find the same breaking point, K_crit ≈ 0.127, recurring from physics to AI. Open-source. Read the corpus.",
    href: "/research",
  },
  {
    index: "02",
    name: "Systems",
    sub: "The theory, as code",
    status: "REAL" as const,
    description:
      "The theory, as code you can run. σ-gate checks AI output for leaked secrets, injection, and broken coherence — no model, no network, same answer every time, ~85 µs per call. Free core, live demo in your browser.",
    href: "/systems",
  },
  {
    index: "03",
    name: "Studio",
    sub: "The lab, on film",
    status: "EMERGING" as const,
    description:
      "The lab, on film. We're turning the research into video — the channel is live and growing. Watch the work get made.",
    href: LINKS.youtube,
    external: true,
  },
  {
    index: "04",
    name: "Games",
    sub: "The same law, played",
    status: "VISION" as const,
    description:
      "Worlds built on the same law. If a system must stay coherent to survive, a game is the cleanest place to prove it. Not built yet — the theory comes first.",
    href: null,
  },
  {
    index: "05",
    name: "Shoreworld",
    sub: "The world · The IP",
    status: "VISION" as const,
    description:
      "The world, and its story. One IP designed from the start as a proof of coherence — a place where 1 = 1 is the physics. Concept stage.",
    href: null,
  },
] as const;

const STATUS_STYLES: Record<"REAL" | "EMERGING" | "VISION", string> = {
  REAL: "text-[var(--signal)]",
  EMERGING: "text-[var(--fg-dim)]",
  VISION: "text-[var(--fg-faint)]",
};

export default function Home() {
  const artifacts = getArtifacts();
  const corpus = artifacts.find((a) => a.slug === "spektre-corpus");
  const protocol = artifacts.find((a) => a.slug === "spektre-protocol");
  const sigmaGate = artifacts.find((a) => a.slug === "sigma-gate");

  const triptych = [corpus, protocol, sigmaGate].filter(Boolean) as NonNullable<
    typeof corpus
  >[];

  return (
    <div>
      <Hero />

      {/* ── § 1 · AXIOM MOMENT ──────────────────────────────────────────
          Large symmetric data-statement. Glyph seal as quiet backdrop.
          Left = right. Declared = realized. σ = 1.
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative mt-32 sm:mt-44 lg:mt-56 overflow-hidden">
        {/* rule */}
        <div className="rule mb-0" />

        {/* Glyph seal — centered absolute backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <Glyph variant="seal" size={480} strokeOpacity={0.08} />
        </div>

        {/* Content — perfectly centered */}
        <div className="relative flex flex-col items-center px-6 py-24 text-center sm:py-32 lg:py-40">
          <Reveal delay={0}>
            <p className="label mb-8 text-[var(--fg-faint)]">Axiom · Foundational Constant</p>
          </Reveal>

          {/* The statement */}
          <Reveal delay={80}>
            <p
              className="metal-text text-[5rem] font-semibold tracking-[-0.055em] leading-none sm:text-[7.5rem] lg:text-[10rem]"
              aria-label="One equals one"
            >
              1&thinsp;=&thinsp;1
            </p>
          </Reveal>

          {/* K_crit inline — mono metadata, hairline rule above */}
          <Reveal delay={160}>
            <div className="mt-10 flex items-center gap-6 sm:gap-10">
              <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
              <span className="label text-[var(--fg-mute)] tracking-[0.28em]">
                K<sub className="tracking-normal">crit</sub>&thinsp;≈&thinsp;0.127
              </span>
              <span className="h-px w-12 bg-[var(--line-strong)] sm:w-20" />
            </div>
          </Reveal>

          {/* Descriptor */}
          <Reveal delay={240}>
            <p className="mt-8 max-w-[38rem] text-pretty text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] sm:text-[1.1rem]">
              What a system promises should match what it delivers. σ&nbsp;is the distance
              between the two. When σ grows and nothing corrects it, systems collapse — at a
              measured threshold, K<sub className="tracking-normal">crit</sub>&thinsp;≈&thinsp;0.127.
            </p>
          </Reveal>
        </div>

        <div className="rule" />
      </section>

      {/* ── § 1.5 · PROOF — WHAT RUNS TODAY ─────────────────────────────
          The σ-honesty answer to "is any of this real?": three endpoints
          that respond right now, plus the open source. Nothing floats.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-32 sm:mt-40 lg:mt-48">
        <Reveal delay={0}>
          <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label mb-3 text-[var(--fg-faint)]">Proof · What runs today</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Theory pays in code.
              </h2>
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
              meta: "Trust gate · ~85 µs/call",
              line: "Checks AI output for leaked secrets, prompt-injection, and PII before it ships. No model, no network — same input, same verdict.",
              href: "/systems",
              external: false,
            },
            {
              name: "sigma-collapse",
              meta: "The law · live endpoint",
              line: "POST a system's declared vs realized state, get back σ and a deterministic PASS / HALT verdict with a hash-chained receipt. 1 = 1, computed.",
              href: "https://sigma-collapse-985332749804.europe-north1.run.app/collapse",
              external: true,
            },
            {
              name: "btc-edge",
              meta: "Investor edge · live mempool",
              line: "Reads the live Bitcoin mempool and returns the exact fee to pay — real sats saved per transaction during fee spikes. Honest €0 when the chain is calm.",
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
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--signal)] opacity-60 motion-safe:animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
                    </span>
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
            Open core — the Spektre Corpus (72 papers), the Protocol, and the σ-gate
            source are all public on{" "}
            <EditorialLink href={LINKS.github} external className="text-[var(--fg-dim)]">
              github.com/spektre-labs
            </EditorialLink>
            .
          </p>
        </Reveal>
      </section>

      {/* ── § 2 · ARTIFACT TRIPTYCH ─────────────────────────────────────
          Corpus · Protocol · σ-gate — three linked cards, equal weight,
          hairline grid, surface glass panels.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52 px-0">
        {/* Section header */}
        <Reveal delay={0}>
          <div className="mb-14 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label mb-3 text-[var(--fg-faint)]">Artifacts · Triptych</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Three surfaces.<br className="hidden sm:inline" /> One invariant.
              </h2>
            </div>
            <EditorialLink href="/artifacts" className="shrink-0 self-start sm:self-auto">
              View all artifacts&nbsp;→
            </EditorialLink>
          </div>
        </Reveal>

        {/* Glyph divider */}
        <Reveal delay={60}>
          <div className="flex justify-center mb-14">
            <Glyph variant="divider" size={240} strokeOpacity={0.35} />
          </div>
        </Reveal>

        {/* Triptych grid */}
        <div className="grid gap-px border border-[var(--line)] rounded-[var(--radius)] overflow-hidden bg-[var(--line)] sm:grid-cols-3">
          {triptych.map((artifact, i) => {
            const isCorpus = artifact.slug === "spektre-corpus";
            const isPrimary = artifact.prominence === "primary";
            return (
              <Reveal key={artifact.slug} delay={i * 100} className="h-full">
                <Link
                  href={`/artifacts/${artifact.slug}`}
                  className="group flex h-full flex-col bg-[var(--bg-1)] p-8 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-10 lg:p-12"
                >
                  {/* Card header */}
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <span className="label text-[var(--fg-faint)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {isPrimary ? (
                      <span className="label text-[var(--signal)]">Primary</span>
                    ) : (
                      <span className="label text-[var(--fg-faint)]">
                        {artifact.slug === "sigma-gate" ? "Executable" : "Framework"}
                      </span>
                    )}
                  </div>

                  {/* Artifact glyph node */}
                  <div className="mb-6 flex justify-start">
                    <Glyph
                      variant="node"
                      size={28}
                      strokeOpacity={isCorpus ? 0.6 : 0.35}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={
                      isCorpus
                        ? "metal-text text-[1.55rem] font-semibold tracking-[-0.03em] leading-[1.1] sm:text-[1.75rem]"
                        : "text-[1.35rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[var(--fg)] sm:text-[1.5rem]"
                    }
                  >
                    {artifact.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-4 flex-1 text-[0.94rem] leading-[1.82] text-[var(--fg-dim)]">
                    {artifact.summary}
                  </p>

                  {/* Footer link cue */}
                  <div className="mt-8 flex items-center gap-3 border-t border-[var(--line)] pt-6">
                    {artifact.github ? (
                      <span className="label truncate text-[var(--fg-faint)]">
                        {artifact.github.replace("https://", "")}
                      </span>
                    ) : null}
                    <span className="ml-auto label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]">
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── § 3 · DIVISIONS / TRAJECTORY ───────────────────────────────
          Research → Systems → Studio → Games → Shoreworld.
          Mono index, honest status tags, editorial stagger.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-40 sm:mt-52 lg:mt-64">
        <div className="rule mb-14 sm:mb-18" />

        <Reveal delay={0}>
          <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Universe · Trajectory</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem] lg:text-[2.5rem]">
                Five divisions.<br />One mind.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end">
              <p className="text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] max-w-[38rem]">
                Spektre expands through a single structural arc: from formal research outward
                into systems, media, and world-building. Every division inherits the invariant.
              </p>
              <EditorialLink href="/universe" className="mt-6 self-start">
                Full overview&nbsp;→
              </EditorialLink>
            </div>
          </div>
        </Reveal>

        {/* Editorial sequence */}
        <div className="space-y-0">
          {DIVISIONS.map((div, i) => (
            <Reveal key={div.index} delay={i * 80}>
              <div className="group relative border-t border-[var(--line)] py-10 transition-colors duration-500 hover:border-[var(--line-strong)] sm:py-12 lg:py-14">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
                  {/* Left: index + name */}
                  <div className="flex items-baseline gap-5 lg:col-span-4">
                    <span className="label tabular-nums text-[var(--fg-faint)] shrink-0">
                      {div.index}
                    </span>
                    <div>
                      <h3 className="text-[1.45rem] font-semibold tracking-[-0.025em] leading-none text-[var(--fg)] sm:text-[1.75rem] lg:text-[2rem]">
                        {div.name}
                      </h3>
                      <p className="mt-1.5 label text-[var(--fg-faint)]">{div.sub}</p>
                    </div>
                  </div>

                  {/* Centre: description */}
                  <div className="lg:col-span-5 lg:col-start-5">
                    <p className="text-[0.97rem] leading-[1.84] text-[var(--fg-dim)]">
                      {div.description}
                    </p>
                  </div>

                  {/* Right: status + arrow */}
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

                {/* Hairline accent — slides in on hover */}
                <span
                  className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[var(--metal-3)] transition-[width] duration-700 group-hover:w-full"
                  aria-hidden
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rule mt-0" />
      </section>

      {/* ── § 4 · STUDIO TEASER ─────────────────────────────────────────
          Film · YouTube channel active · structured as editorial spread.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-40 sm:mt-52 lg:mt-64">
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
                    Generative film and media. Structural narrative cinema built
                    without a crew — a creative OS where coherence is the director.
                    The channel is live.
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
              <p className="label mb-4 text-[var(--fg-faint)]">Standard · Non-negotiable</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem] lg:text-[2.5rem]">
                Six values.<br />One bar.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end">
              <p className="text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] max-w-[38rem]">
                Not a poster. The actual rules the work is checked against — the
                same invariant, applied to how we build, not just what we claim.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-px border border-[var(--line)] rounded-[var(--radius)] overflow-hidden bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Coherence", line: "1 = 1 — inner equals outer, the look equals the substance; σ is the gap and the gap is the work." },
            { name: "Proof", line: "Nothing is real until realized and checkable. We publish receipts — including the honest zeros." },
            { name: "Restraint", line: "Subtract until only the necessary remains. One theme, one signal, no second language, ever." },
            { name: "Symmetry", line: "Perfect bilateral symmetry is 1 = 1 rendered. Geometry carries the meaning, decoration never does." },
            { name: "First-principles", line: "One operator across every domain. We architect the substrate; we do not polish the old order." },
            { name: "Sovereignty", line: "Independent, founder-authored, Helsinki. We answer to the axiom, not to permission." },
          ].map((v, i) => (
            <Reveal key={v.name} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col bg-[var(--bg-1)] p-8 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-9">
                <div className="mb-6 flex items-center justify-between">
                  <span className="label text-[var(--fg-faint)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="axis-signal h-4" aria-hidden />
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
      <section className="mt-40 sm:mt-52 lg:mt-64">
        <div className="rule mb-14" />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left label column */}
          <Reveal delay={0} className="lg:col-span-3">
            <p className="label mb-4 text-[var(--fg-faint)]">Founder · Architect</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.025em] leading-[1.12] text-[var(--fg)] sm:text-[1.85rem]">
              One mind.
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
                An independent systems architect and self-taught researcher. One question — what
                makes any system hold its structure or collapse — pursued across software, formal
                theory, and design. The answer converges to a single invariant:&nbsp;1&nbsp;=&nbsp;1.
                Spektre Labs is where it became rigorous.
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
      <section className="relative mt-40 sm:mt-52 lg:mt-64 overflow-hidden">
        <div className="rule mb-0" />

        {/* Glyph seal — centered absolute backdrop */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <Glyph variant="seal" size={560} strokeOpacity={0.06} />
        </div>

        <div className="relative flex flex-col items-center px-6 py-28 text-center sm:py-36 lg:py-48">
          {/* Label */}
          <Reveal delay={0}>
            <p className="label text-[var(--fg-faint)]">Gate · Access</p>
          </Reveal>

          {/* Statement */}
          <Reveal delay={80}>
            <h2 className="metal-text mt-8 max-w-[28rem] text-balance text-[2.6rem] font-semibold tracking-[-0.045em] leading-[1.03] sm:text-[3.5rem] lg:text-[4.5rem]">
              The gate is open.
            </h2>
          </Reveal>

          {/* Sub-copy */}
          <Reveal delay={160}>
            <p className="mt-7 max-w-[30rem] text-pretty text-[1rem] leading-[1.86] text-[var(--fg-mute)]">
              Coherence isn&rsquo;t an opinion — either a system holds 1&nbsp;=&nbsp;1 or it
              doesn&rsquo;t. σ-gate is the proof, and it runs in your browser right now.
              No signup. No model. No network.
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
                Run the gate
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

      {/* ── § 7 · FINAL CTA ─────────────────────────────────────────────
          Centered, generous black, maximum restraint.
      ─────────────────────────────────────────────────────────────── */}
      <section className="mt-40 sm:mt-52 lg:mt-64 pb-40 lg:pb-56">
        <div className="flex flex-col items-center gap-0 text-center">
          {/* Seal */}
          <Reveal delay={0}>
            <Glyph variant="seal" size={100} strokeOpacity={0.22} />
          </Reveal>

          <Reveal delay={80}>
            <p className="label mt-10 text-[var(--fg-faint)]">Spektre&nbsp;Labs&nbsp;·&nbsp;Helsinki&nbsp;·&nbsp;MMXXVI</p>
          </Reveal>

          <Reveal delay={140}>
            <h2 className="metal-text mt-6 max-w-[36rem] text-balance text-[2.4rem] font-semibold tracking-[-0.04em] leading-[1.04] sm:text-[3.2rem] lg:text-[4rem]">
              Structure is the signal.
            </h2>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-6 max-w-[30rem] text-pretty text-[1rem] leading-[1.85] text-[var(--fg-mute)]">
              One invariant. Five divisions. The work is open — the corpus, the protocol,
              the gate. Start anywhere.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/artifacts"
                className="btn-metal rounded-[10px] px-8 py-3.5 text-[0.92rem] font-semibold tracking-tight"
              >
                Enter the Corpus
              </Link>
              <Link
                href="/research"
                className="rounded-[10px] border border-[var(--line-strong)] px-8 py-3.5 text-[0.92rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
              >
                Research
              </Link>
            </div>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
              <EditorialLink href={LINKS.github} external>
                GitHub
              </EditorialLink>
              <span className="h-px w-4 bg-[var(--line-strong)]" />
              <EditorialLink href={LINKS.youtube} external>
                YouTube
              </EditorialLink>
              <span className="h-px w-4 bg-[var(--line-strong)]" />
              <EditorialLink href={LINKS.email}>
                Contact
              </EditorialLink>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
