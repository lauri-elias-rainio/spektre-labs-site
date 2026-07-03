import type { Metadata } from "next";

import { EditorialLink } from "@/components/editorial-link";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Web4 · Spektre Browser",
  description:
    "Spektre is a cleaner browser for the next internet: fewer interruptions, visible trust, one place to work. Early beta, macOS, open source.",
  path: "/web4",
});

const DMG_URL =
  "https://github.com/spektre-labs/spektre/releases/download/v0.1.0/Spektre.dmg";

const FEATURES = [
  {
    index: "01",
    name: "Cleaner pages",
    body: "Ads, trackers, popups, and clutter are handled before they own the page. The useful content stays.",
    status: "Live",
  },
  {
    index: "02",
    name: "One command line",
    body: "Open a site, search, ask the page, summarize, or run a browser action — from one input. No mode switch.",
    status: "Live",
  },
  {
    index: "03",
    name: "Visible trust",
    body: "The browser shows what it blocked, what it knows, and what is still unknown. No false certainty.",
    status: "Live",
  },
  {
    index: "04",
    name: "Working memory",
    body: "Sessions, preferences, and recovery designed around the person using the browser, not the site.",
    status: "Live",
  },
  {
    index: "05",
    name: "In-page AI",
    body: "AI as a browser capability: read, explain, fill. Acts inside the page and leaves a trace.",
    status: "In development",
  },
  {
    index: "06",
    name: "Stronger network",
    body: "Verify, cache, route — the browser helps the internet instead of only consuming it.",
    status: "Planned",
  },
];

export default function Web4Page() {
  return (
    <div>
      {/* ── Page header ──────────────────────────────────────────── */}
      <PageHeader
        title="The internet, cleaned up."
        description="A browser in early beta. Fewer interruptions, visible blocking, one place to work."
      />

      {/* ── Download block — the product CTA ─────────────────────── */}
      <section className="mt-20 sm:mt-28 lg:mt-36">
        <Reveal delay={0}>
          <div className="surface overflow-hidden">
            <div className="grid gap-px bg-[var(--line)] lg:grid-cols-[1.1fr_0.9fr]">
              {/* Left — thesis */}
              <div className="bg-[var(--bg-1)] p-8 sm:p-10 lg:p-12">
                <p className="label mb-6 text-[var(--signal)]">
                  Spektre Browser · Web4
                </p>
                <h2 className="metal-text text-[2.4rem] font-semibold leading-[1.03] tracking-[-0.042em] sm:text-[3.2rem] lg:text-[4rem]">
                  Same web.<br />Better browser.
                </h2>
                <p className="mt-8 max-w-[36rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
                  This does not start with a new vocabulary. A page opens calmer.
                  The browser shows what it handled. One input replaces five
                  scattered controls.
                </p>
              </div>

              {/* Right — download + honest disclosure */}
              <div className="flex flex-col justify-between bg-[var(--bg-1)] p-8 sm:p-10 lg:p-12">
                <div>
                  <p className="label mb-5 text-[var(--fg-faint)]">
                    Download · macOS
                  </p>
                  <a
                    href={DMG_URL}
                    className="btn-metal inline-flex rounded-[10px] px-7 py-3.5 text-[0.92rem] font-semibold tracking-tight no-underline"
                  >
                    Spektre.dmg&nbsp;↓
                  </a>
                </div>

                <div className="mt-10 border-t border-[var(--line)] pt-8">
                  <p className="label mb-4 text-[var(--signal)]">
                    Early beta · v0.1.0
                  </p>
                  <div className="space-y-2.5">
                    {[
                      "macOS only at this stage.",
                      "Unsigned build — first-open shows a Gatekeeper warning.",
                      "Right-click → Open to bypass. Expected behavior, not a bug.",
                      "The warning is real. So is the browser.",
                    ].map((line) => (
                      <p
                        key={line}
                        className="text-[0.88rem] leading-[1.72] text-[var(--fg-mute)]"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                  <EditorialLink
                    href="https://github.com/spektre-labs/spektre"
                    external
                    className="mt-7 inline-flex text-[var(--fg-faint)]"
                  >
                    Source on GitHub&nbsp;↗
                  </EditorialLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Feature spec table ─────────────────────────────────────── */}
      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">
                Specification
              </p>
              <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
                What it does.
              </h2>
            </div>
            <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] lg:col-span-7 lg:col-start-6">
              Six capabilities in order. Items labeled &ldquo;In development&rdquo; or
              &ldquo;Planned&rdquo; are named as such — not as shipped.
            </p>
          </div>
        </Reveal>

        <div className="border-t border-[var(--line)]">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.name} delay={i * 55}>
              <div className="grid gap-4 border-b border-[var(--line)] py-7 sm:grid-cols-12 sm:gap-6 sm:py-8">
                <div className="sm:col-span-1">
                  <span className="label tabular-nums text-[var(--fg-faint)]">
                    {feature.index}
                  </span>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-[1rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                    {feature.name}
                  </p>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-[0.96rem] leading-[1.78] text-[var(--fg-dim)]">
                    {feature.body}
                  </p>
                </div>
                <div className="sm:col-span-2 sm:text-right">
                  <span
                    className="label"
                    style={{
                      color:
                        feature.status === "Live"
                          ? "var(--signal)"
                          : feature.status === "In development"
                          ? "var(--fg-mute)"
                          : "var(--fg-faint)",
                    }}
                  >
                    {feature.status}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Proof posture ──────────────────────────────────────────── */}
      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12">
            <p className="label mb-4 text-[var(--fg-faint)]">Proof posture</p>
            <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
              No promise without proof.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
          {[
            {
              label: "What exists",
              title: "A downloadable beta.",
              body: "A macOS build you can run today. The install works. The Gatekeeper warning is real, expected, and documented above.",
            },
            {
              label: "What is measured",
              title: "Claims need evidence.",
              body: "Every capability is either live in v0.1.0, in development, or named as planned. The site will not say more than that.",
            },
            {
              label: "What comes next",
              title: "Useful work funds the next layer.",
              body: "Downloads to pilots to Pro tier. Each step is a plan, not revenue. When one closes, it will say closed.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 80} className="h-full">
              <div className="h-full bg-[var(--bg-1)] p-8 sm:p-10">
                <p className="label mb-6 text-[var(--signal)]">{card.label}</p>
                <h3 className="text-[1.3rem] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--fg)]">
                  {card.title}
                </h3>
                <p className="mt-5 text-[0.96rem] leading-[1.78] text-[var(--fg-dim)]">
                  {card.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="mt-28 sm:mt-36 lg:mt-44">
        <Reveal>
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <Glyph variant="node" size={22} strokeOpacity={0.4} />
            <h2 className="metal-text mt-2 text-[2rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[2.8rem]">
              Start with a download.
            </h2>
            <p className="max-w-[32rem] text-[0.98rem] leading-[1.8] text-[var(--fg-mute)]">
              Free and open source. A pilot, a Pro tier, and node operator
              roles come next — named as plans, not products.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={DMG_URL}
                className="btn-metal rounded-[10px] px-8 py-3.5 text-[0.92rem] font-semibold tracking-tight no-underline"
              >
                Download Spektre.dmg
              </a>
              <EditorialLink href="/connect" className="self-center">
                Start a pilot&nbsp;→
              </EditorialLink>
            </div>
            <p className="label mt-4 text-[var(--fg-faint)]">
              macOS · v0.1.0 · Early beta
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
