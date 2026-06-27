import type { Metadata } from "next";
import Link from "next/link";

import { EditorialLink } from "@/components/editorial-link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Web4 · Spektre",
  description:
    "Spektre is building a cleaner, safer browser for the next internet: less noise, clearer trust, useful AI action, and paid pilots for serious teams.",
  path: "/web4",
});

const proofCards = [
  {
    label: "Felt proof",
    title: "Same sites. Less junk.",
    body:
      "A normal page opens with fewer interruptions, less tracking pressure, and a clearer signal for what the browser handled.",
  },
  {
    label: "Technical proof",
    title: "Claims must be checkable.",
    body:
      "Serious promises need evidence: logs, benchmarks, screenshots, test runs, recovery drills, or pilot results.",
  },
  {
    label: "Economic proof",
    title: "Useful work funds more useful work.",
    body:
      "Downloads, Pro, paid pilots, creator support, and infrastructure partners turn adoption into the next shipped improvement.",
  },
] as const;

const browserBlocks = [
  ["Cleaner pages", "The useful page stays. Ads, trackers, popups, and clutter get handled before they own attention."],
  ["One place to type", "Open a site, search, ask the page, summarize, find, and run common browser actions from one line."],
  ["Trust you can see", "The browser shows what it blocked, what it knows, and what is still unknown without fake certainty."],
  ["Your working memory", "Sessions, preferences, recovery, and future sync are designed around the person using the browser."],
  ["Useful AI action", "AI becomes a browser capability: read the page, explain it, fill simple workflows, and leave a trace."],
  ["Stronger network", "Over time the browser can help verify, cache, route, and strengthen the internet instead of only consuming it."],
] as const;

const teamRows = [
  {
    team: "Brand",
    owns: "The shift from noisy internet to cleaner work.",
    output: "One sentence, one visual standard, one proof-backed promise.",
  },
  {
    team: "Marketing",
    owns: "The translation for normal people.",
    output: "Demo first: same page, less junk, visible trust, one command line.",
  },
  {
    team: "Sales",
    owns: "The resource close.",
    output: "Beta, Pro, paid pilot, proof sponsorship, node operator, creator program.",
  },
  {
    team: "Design",
    owns: "99++ ease.",
    output: "No glossary at the door. The user feels Web4 before learning the name.",
  },
  {
    team: "Proof",
    owns: "Claim discipline.",
    output: "No public power claim without a test, artifact, status, and expiry.",
  },
] as const;

const resourceActions = [
  "Download beta",
  "See the proof",
  "Upgrade to Pro",
  "Start a paid pilot",
  "Sponsor the next proof",
  "Become a node operator",
] as const;

const standardRows = [
  ["Idea", "A clearer model for the next internet."],
  ["Instrument", "A browser people can actually use."],
  ["Proof", "Evidence before the promise gets stronger."],
  ["Design", "The value is visible in the first ten seconds."],
  ["Business", "Useful work funds the next shipped layer."],
  ["Evolution", "Every release teaches the system what to build next."],
] as const;

export default function Web4Page() {
  return (
    <div>
      <PageHeader
        title="The internet, cleaned up."
        description="Spektre is a cleaner, safer browser for the next internet: fewer distractions, clearer trust, one place to work, and AI that acts inside the page instead of floating beside it."
      />

      <section className="mt-20 sm:mt-28 lg:mt-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7" delay={0}>
            <div className="surface p-8 sm:p-10 lg:p-12">
              <p className="label mb-6 text-[var(--signal)]">Public translation</p>
              <h2 className="text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--fg)] sm:text-[3rem] lg:text-[4rem]">
                Same web.<br />Better browser.
              </h2>
              <p className="mt-8 max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
                This does not start with a new vocabulary. It starts with a page that
                feels calmer, a browser that shows what it handled, and one input for
                opening, searching, asking, and acting.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/systems"
                  className="btn-metal rounded-full px-5 py-3 text-[0.78rem] font-medium"
                >
                  See systems
                </Link>
                <EditorialLink href="/connect" className="self-center">
                  Start a pilot&nbsp;→
                </EditorialLink>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={100}>
            <div className="grid h-full gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)]">
              {[
                ["Old internet", "Too much noise, tracking, account lock-in, hidden decisions, and AI tools disconnected from the page."],
                ["Web4", "The next internet standard: clearer trust, safer action, portable work, and less dependence on hidden middlemen."],
                ["Spektre", "The browser that makes that change feel normal: open, search, ask, verify, act."],
              ].map(([title, body]) => (
                <div key={title} className="bg-[var(--bg-1)] p-7 sm:p-8">
                  <p className="label mb-4 text-[var(--fg-faint)]">{title}</p>
                  <p className="text-[0.98rem] leading-[1.75] text-[var(--fg-dim)]">{body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">The standard</p>
              <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
                Ahead of time, usable now.
              </h2>
            </div>
            <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] lg:col-span-7 lg:col-start-6">
              The bar is not a clever theory or a polished page. The bar is a system
              that combines new thinking, a usable product, public proof, refined
              design, commercial fuel, and continuous improvement.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {standardRows.map(([title, body], index) => (
            <Reveal key={title} delay={index * 45} className="h-full">
              <div className="bg-[var(--bg-1)] p-7 sm:p-8">
                <p className="label mb-5 text-[var(--signal)]">{title}</p>
                <p className="text-[0.96rem] leading-[1.75] text-[var(--fg-dim)]">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Browser paradigm</p>
              <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
                Built for normal browsing first.
              </h2>
            </div>
            <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] lg:col-span-7 lg:col-start-6">
              The bar is high: sites still need to load, logins still need to work, work
              apps still need to behave. The next layer only matters if the basic browser
              is easier, cleaner, and more useful than what people already use.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {browserBlocks.map(([title, body], index) => (
            <Reveal key={title} delay={index * 55} className="h-full">
              <div className="flex h-full flex-col bg-[var(--bg-1)] p-7 transition-colors duration-500 hover:bg-[var(--bg-2)] sm:p-8">
                <span className="label mb-8 text-[var(--fg-faint)] tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
                  {title}
                </h3>
                <p className="mt-4 text-[0.94rem] leading-[1.78] text-[var(--fg-dim)]">
                  {body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="label mb-4 text-[var(--fg-faint)]">Proof ladder</p>
              <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
                No promise without proof.
              </h2>
            </div>
            <p className="max-w-[31rem] text-[0.98rem] leading-[1.75] text-[var(--fg-mute)]">
              The site, sales deck, and product must say only what the browser can show,
              test, or prove in a pilot.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {proofCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80} className="h-full">
              <div className="surface surface-hover h-full p-7 sm:p-8">
                <p className="label mb-6 text-[var(--signal)]">{card.label}</p>
                <h3 className="text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--fg)]">
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

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <div className="rule mb-12" />
        <Reveal>
          <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Team responsibility</p>
              <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.4rem]">
                Teams turn the idea into adoption.
              </h2>
            </div>
            <p className="max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] lg:col-span-7 lg:col-start-6">
              The deep architecture stays behind the product. Marketing, sales, brand,
              design, proof, and resource teams make it understandable, desirable,
              testable, and fundable.
            </p>
          </div>
        </Reveal>

        <div className="space-y-0">
          {teamRows.map((row, index) => (
            <Reveal key={row.team} delay={index * 55}>
              <div className="grid gap-4 border-t border-[var(--line)] py-7 sm:grid-cols-12 sm:gap-8 sm:py-8">
                <div className="sm:col-span-3">
                  <p className="label text-[var(--signal)]">{row.team}</p>
                </div>
                <div className="sm:col-span-4">
                  <p className="text-[1rem] leading-[1.65] text-[var(--fg)]">{row.owns}</p>
                </div>
                <div className="sm:col-span-5">
                  <p className="text-[0.95rem] leading-[1.75] text-[var(--fg-dim)]">{row.output}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="rule" />
      </section>

      <section className="mt-28 sm:mt-36 lg:mt-44">
        <Reveal>
          <div className="surface overflow-hidden">
            <div className="grid gap-px bg-[var(--line)] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-[var(--bg-1)] p-8 sm:p-10 lg:p-12">
                <p className="label mb-5 text-[var(--signal)]">Resource loop</p>
                <h2 className="text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--fg)] sm:text-[2.6rem]">
                  Every useful step funds the next one.
                </h2>
                <p className="mt-7 max-w-[42rem] text-[1rem] leading-[1.85] text-[var(--fg-dim)]">
                  The business cannot depend on selling attention. The loop is simpler:
                  people use the browser, serious teams pay for pilots, power users upgrade,
                  partners fund proof, and the next layer gets built.
                </p>
              </div>
              <div className="bg-[var(--bg-1)] p-8 sm:p-10 lg:p-12">
                <div className="grid gap-3">
                  {resourceActions.map((action) => (
                    <div key={action} className="flex items-center justify-between border-b border-[var(--line)] py-3">
                      <span className="text-[0.96rem] text-[var(--fg-dim)]">{action}</span>
                      <span className="label text-[var(--fg-faint)]">→</span>
                    </div>
                  ))}
                </div>
                <EditorialLink href="/connect" className="mt-8 inline-flex">
                  Build with Spektre&nbsp;→
                </EditorialLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
