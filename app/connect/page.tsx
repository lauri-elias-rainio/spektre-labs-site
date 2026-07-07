import type { Metadata } from "next";

import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";
import { LINKS } from "@/lib/links";

export const metadata: Metadata = createPageMetadata({
  title: "Connect · Spektre",
  description:
    "One path in: email. Bring the hard problem. Direct reply.",
  path: "/connect",
});

/*
  Connect page — rewritten for conviction.
  σ-honest: real links only. One primary CTA (email). Three-step hairline grid.
  Mono-Abloh voice. Terse. Prada restraint.
*/

const STEPS: {
  index: string;
  name: string;
  body: string;
  ctaHref: string | null;
  cta: string | null;
}[] = [
  {
    index: "01",
    name: "Write",
    body: "Email is the channel. No forms, no scheduling tools, no intake process.",
    ctaHref: LINKS.email,
    cta: "spektre.labs@proton.me",
  },
  {
    index: "02",
    name: "Bring the hard problem",
    body: "Not a brief for a commodity build. The hard part — the one that does not have a vendor template.",
    ctaHref: null,
    cta: null,
  },
  {
    index: "03",
    name: "Receive a direct reply",
    body: "If it is in scope, you get a real answer. If it is not, you get a clear no. Either way: direct.",
    ctaHref: null,
    cta: null,
  },
];

const SECONDARY = [
  { label: "GitHub", value: "spektre-labs", href: LINKS.github },
  { label: "LinkedIn", value: "Lauri Elias Rainio", href: LINKS.linkedin },
  { label: "YouTube", value: "@spektrelabs", href: LINKS.youtube },
  { label: "ORCID", value: "0009-0006-0903-8541", href: LINKS.orcid },
  { label: "Zenodo", value: "Research archive", href: LINKS.zenodo },
];

export default function ConnectPage() {
  return (
    <div>
      {/* ── Page Header ────────────────────────────────────────────── */}
      <PageHeader
        title="Connect"
        description="One path in. Bring the hard problem."
      />

      {/* ── Email CTA — the only entry ───────────────────────────── */}
      <Reveal delay={80} className="mt-20 sm:mt-28 lg:mt-36">
        <div className="surface overflow-hidden p-8 sm:p-12 lg:p-16">
          <p className="label mb-6 text-[var(--fg-faint)]">Primary channel</p>
          <h2 className="metal-text text-[2rem] font-semibold leading-[1.04] tracking-[-0.042em] sm:text-[2.8rem]">
            Write directly.
          </h2>
          <p className="mt-6 max-w-[38rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
            No scheduling tools, no calendar links, no intake survey.
            If the problem is real and hard, the address is below.
          </p>
          <div className="mt-10">
            <a
              href={LINKS.email}
              className="btn-metal inline-flex rounded-[10px] px-7 py-3.5 text-[0.92rem] font-semibold tracking-tight no-underline"
            >
              spektre.labs@proton.me
            </a>
          </div>
        </div>
      </Reveal>

      {/* ── Three steps — hairline grid ──────────────────────────── */}
      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <p className="label mb-12 text-[var(--fg-faint)]">How it works</p>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {STEPS.map((step, i) => (
            <Reveal key={step.index} delay={i * 80}>
              <div className="grid gap-4 border-b border-[var(--line)] py-8 sm:grid-cols-12 sm:gap-8 sm:py-10">
                <div className="sm:col-span-1">
                  <span className="label tabular-nums text-[var(--fg-faint)]">
                    {step.index}
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                    {step.name}
                  </p>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-[0.96rem] leading-[1.78] text-[var(--fg-dim)]">
                    {step.body}
                  </p>
                </div>
                <div className="sm:col-span-2 sm:text-right">
                  {step.ctaHref ? (
                    <a
                      href={step.ctaHref}
                      className="label text-[var(--signal)] transition-opacity duration-200 hover:opacity-70"
                    >
                      {step.cta}&nbsp;→
                    </a>
                  ) : (
                    <span className="label text-[var(--fg-faint)]">—</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Secondary channels — compact hairline table ─────────── */}
      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <p className="label mb-10 text-[var(--fg-faint)]">
            Secondary channels
          </p>
        </Reveal>

        <div className="max-w-[42rem] border-t border-[var(--line)]">
          {SECONDARY.map((ch, i) => (
            <Reveal key={ch.label} delay={i * 45}>
              <div className="flex items-center gap-6 border-b border-[var(--line)] py-5">
                <span className="label w-20 shrink-0 text-[var(--fg-faint)]">
                  {ch.label}
                </span>
                <ExternalLink href={ch.href} className="flex-1 text-[0.95rem]">
                  {ch.value}
                </ExternalLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Metadata rail ────────────────────────────────────────── */}
      <Reveal delay={0} className="mt-24 sm:mt-32">
        <div className="grid max-w-[42rem] grid-cols-2 gap-0 overflow-hidden rounded-[var(--radius)] border border-[var(--line)] sm:grid-cols-4">
          {[
            { label: "Location", value: "Helsinki" },
            { label: "Channels", value: "06" },
            { label: "Response", value: "Direct" },
            { label: "Standard", value: "σ = 1 = 1" },
          ].map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 55}
              className="border-r border-[var(--line)] px-5 py-4 last:border-r-0"
            >
              <p className="label mb-1.5 text-[var(--fg-faint)]">
                {item.label}
              </p>
              <p
                className="text-[0.92rem] tracking-[-0.01em]"
                style={{ color: "var(--fg-dim)" }}
              >
                {item.value}
              </p>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ── Closing seal ─────────────────────────────────────────── */}
      <Reveal
        delay={0}
        className="mb-20 mt-40 flex flex-col items-center gap-6 sm:mt-52 lg:mt-64"
      >
        <Glyph variant="seal" size={120} strokeOpacity={0.22} />
        <div className="text-center">
          <p className="label mb-2 text-[var(--fg-faint)]">
            Spektre Labs · Helsinki
          </p>
          <p
            className="label text-[0.6rem] tracking-[0.26em] text-[var(--fg-faint)]"
            style={{ opacity: 0.55 }}
          >
            σ — declared = realized
          </p>
        </div>
      </Reveal>

      <div className="mt-20 lg:mt-28" />
    </div>
  );
}
