import type { Metadata } from "next";
import Script from "next/script";

import { PageHeader } from "@/components/page-header";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Protocols",
  description:
    "Four open protocol specifications from Spektre Labs. VRP, CRP, SID, VTC — infrastructure anyone implements.",
  path: "/protocols",
});

/* ─────────────────────────────────────────────────────────────────
   PROTOCOL REGISTRY — σ-honest status on every cell.
   SPEC + KERNEL = code exists on GitHub today.
   NETWORK: ROADMAP = deployed network does not exist yet — stated plainly.
   KERNEL: IN PROGRESS = reference implementation underway, not shipped.
────────────────────────────────────────────────────────────────── */
const PROTOCOLS = [
  {
    index: "01",
    id: "VRP",
    name: "Value Routing Protocol",
    layer: "Settlement · Routing",
    problem: "One address, many settlement rails — send value to wherever the counterparty holds it.",
    /* Status pair — each must be honest. "has" = exists. "roadmap" = does not. */
    statusA: { label: "SPEC + KERNEL", exists: true },
    statusB: { label: "NETWORK: ROADMAP", exists: false },
    description:
      "An address broadcasts its supported rails. The sender resolves the optimal path at send-time — no custodian, no bridge, no hard-coded settlement layer. The specification and a reference routing kernel are open. A deployed peer network is a roadmap item, not a current claim.",
    href: "https://github.com/spektre-labs",
  },
  {
    index: "02",
    id: "CRP",
    name: "Capability Routing Protocol",
    layer: "Inference · Routing",
    problem: "Route a task to whichever AI substrate answers it best, right now.",
    statusA: { label: "SPEC", exists: true },
    statusB: { label: "KERNEL: IN PROGRESS", exists: false },
    description:
      "An orchestrator queries the capability graph, selects the substrate with the lowest cost-to-quality ratio for this task and this moment, and dispatches. No vendor lock-in encoded at the protocol level. The specification is open. A reference kernel is in active development; it is not shipped.",
    href: "https://github.com/spektre-labs",
  },
  {
    index: "03",
    id: "SID",
    name: "Selective Identity Disclosure",
    layer: "Identity · Privacy",
    problem: "Prove one fact — over 18, resident of — without revealing anything else.",
    statusA: { label: "SPEC", exists: true },
    statusB: { label: "KERNEL: IN PROGRESS", exists: false },
    description:
      "A zero-knowledge identity primitive. The credential holder generates a proof of exactly one predicate — age threshold, residency, membership — without exposing the underlying credential or any adjacent attribute. The verifier learns only: the predicate is true and the credential is valid. Specification is open; reference kernel under construction.",
    href: "https://github.com/spektre-labs",
  },
  {
    index: "04",
    id: "VTC",
    name: "Verifiable Transaction Chain",
    layer: "Trust · Verification",
    problem: "Signed value promises anyone verifies without asking an authority.",
    statusA: { label: "SPEC + KERNEL", exists: true },
    statusB: { label: "NETWORK: ROADMAP", exists: false },
    description:
      "A tamper-evident chain of signed value commitments. Each link references the previous hash. Any party holding the public keys can verify the full chain without a trusted third party. The kernel is open source. A deployed network is a roadmap item.",
    href: "https://github.com/spektre-labs",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────
   JSON-LD — TechArticle collection (one per protocol spec)
────────────────────────────────────────────────────────────────── */
const JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  name: "Spektre Labs Open Protocol Specifications",
  description:
    "Four open protocol specifications: VRP (value routing), CRP (capability routing), SID (selective identity disclosure), VTC (verifiable transaction chain).",
  author: {
    "@type": "Organization",
    name: "Spektre Labs",
    url: "https://spektrelabs.org",
  },
  publisher: {
    "@type": "Organization",
    name: "Spektre Labs",
    url: "https://spektrelabs.org",
  },
  datePublished: "2026-07-04",
  url: "https://spektrelabs.org/protocols",
  about: PROTOCOLS.map((p) => ({
    "@type": "SoftwareApplication",
    name: `${p.id} — ${p.name}`,
    description: p.problem,
    applicationCategory: "Protocol Specification",
    url: p.href,
  })),
};

/* ─────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */
export default function ProtocolsPage() {
  return (
    <>
      <Script
        id="protocols-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />

      <div>
        {/* ── Header ────────────────────────────────────────────────── */}
        <PageHeader
          title="Protocols"
          description="Four open specifications. No single deployment owns them."
        />

        {/* ── § 1 · THESIS ──────────────────────────────────────────── */}
        {/* Spacing: mt-20 = 5rem = 20×0.25rem; max-w-[40rem] = readable line length */}
        <section className="mt-20 sm:mt-28">
          <Reveal delay={0}>
            {/* Thesis — left-aligned editorial block, no centering on spec pages */}
            <div className="grid lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7 lg:col-start-4">
                <p className="label mb-6 text-[var(--fg-faint)]">
                  Premise · Open infrastructure
                </p>
                {/* h2 size: 1.75rem → 2.2rem — from established scale */}
                <h2 className="text-[1.75rem] font-semibold tracking-[-0.035em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                  Protocols outlive products.
                </h2>
                {/* Body: 1.02rem leading-[1.85] — matches existing pattern */}
                <p className="mt-6 max-w-[40rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
                  These four are open specifications anyone can implement. Spektre Labs
                  authors the spec and the reference kernel. Nobody owns the protocol.
                  No permission required to build on it.
                </p>
                <p className="mt-4 max-w-[40rem] text-[0.9rem] leading-[1.84] text-[var(--fg-mute)]">
                  Status is stated precisely: a kernel that exists is labeled{" "}
                  <span
                    className="font-mono text-[0.78em] tracking-[0.12em] uppercase"
                    style={{ color: "var(--signal)" }}
                  >
                    SPEC + KERNEL
                  </span>
                  {". "}
                  A network that does not exist yet is labeled{" "}
                  <span className="font-mono text-[0.78em] tracking-[0.12em] uppercase text-[var(--fg-faint)]">
                    ROADMAP
                  </span>
                  {". "}
                  These are not the same thing.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── § 2 · SPEC TABLE — primary artifact ───────────────────── */}
        {/* mt-24 = 6rem */}
        <section className="mt-24 sm:mt-32 lg:mt-40" aria-label="Protocol specifications">
          <Reveal delay={0}>
            <div className="rule mb-0" />
          </Reveal>

          {PROTOCOLS.map((proto, i) => (
            <Reveal key={proto.id} delay={i * 70}>
              <div className="group relative border-b border-[var(--line)] transition-colors duration-500 hover:border-[var(--line-strong)]">
                {/* Hairline accent — slides across top on hover */}
                <span
                  className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-[var(--metal-3)] transition-[width] duration-700 [transition-timing-function:var(--ease)] group-hover:w-full"
                  aria-hidden
                />

                {/* py-10 = 2.5rem, py-12 = 3rem */}
                <div className="grid gap-6 py-10 sm:py-12 lg:grid-cols-12 lg:gap-10">

                  {/* ── Col 1: Index + ID ─────────────────────────── */}
                  {/* col-span-1: narrow index gutter */}
                  <div className="flex items-start gap-5 lg:col-span-3">
                    {/* Index in mono label weight */}
                    <span className="label tabular-nums text-[var(--fg-faint)] shrink-0 pt-0.5">
                      {proto.index}
                    </span>
                    <div>
                      {/* Protocol ID — mono, large, signal-adjacent */}
                      <span
                        className="font-mono text-[1.35rem] font-light tracking-[-0.01em] leading-none"
                        style={{ color: "var(--metal-1)" }}
                      >
                        {proto.id}
                      </span>
                      {/* Full name — below the ID, smaller */}
                      <p className="mt-1.5 text-[0.8rem] leading-[1.3] text-[var(--fg-mute)]">
                        {proto.name}
                      </p>
                    </div>
                  </div>

                  {/* ── Col 2: Layer + Problem ────────────────────── */}
                  <div className="lg:col-span-4 lg:col-start-4">
                    {/* Layer label */}
                    <p className="label mb-3 text-[var(--fg-faint)]">{proto.layer}</p>
                    {/* Problem — the one-liner in plain English */}
                    <p className="text-[0.97rem] leading-[1.76] text-[var(--fg-dim)]">
                      {proto.problem}
                    </p>
                  </div>

                  {/* ── Col 3: Status pair ────────────────────────── */}
                  {/* Two status badges — one honest per dimension */}
                  <div className="flex flex-col gap-3 lg:col-span-3 lg:col-start-9">
                    {/* StatusA — spec/kernel existence */}
                    <span
                      className="label"
                      style={{
                        color: proto.statusA.exists ? "var(--signal)" : "var(--fg-faint)",
                      }}
                    >
                      {proto.statusA.label}
                    </span>
                    {/* StatusB — network existence */}
                    <span
                      className="label"
                      style={{
                        color: proto.statusB.exists ? "var(--signal)" : "var(--fg-faint)",
                      }}
                    >
                      {proto.statusB.label}
                    </span>
                  </div>

                  {/* ── Col 4: External link ─────────────────────── */}
                  <div className="flex items-start justify-end lg:col-span-1 lg:col-start-12">
                    <a
                      href={proto.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${proto.id} specification on GitHub`}
                      className="label text-[var(--fg-faint)] transition-colors duration-500 [transition-timing-function:var(--ease)] group-hover:text-[var(--fg)] mt-0.5"
                    >
                      ↗
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* ── § 3 · DETAIL CARDS — expanded per-protocol context ───── */}
        {/* mt-32 = 8rem */}
        <section className="mt-32 sm:mt-44 lg:mt-52">
          <Reveal delay={0}>
            <div className="rule mb-14" />
            <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <p className="label mb-4 text-[var(--fg-faint)]">Specifications · Detail</p>
                {/* h2: 1.75rem → 2.2rem */}
                <h2 className="text-[1.75rem] font-semibold tracking-[-0.035em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                  What each<br />one solves.
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end">
                <p className="text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] max-w-[38rem]">
                  Each protocol targets one unsolved friction in the infrastructure layer.
                  The problem is stated without jargon. The status is stated without optimism.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 2-column grid on lg, single on mobile — gap-px hairline grid */}
          <div className="grid gap-px bg-[var(--line-soft)] sm:grid-cols-2">
            {PROTOCOLS.map((proto, i) => (
              <Reveal key={proto.id} delay={i * 60}>
                <div className="group relative flex flex-col bg-[var(--bg)] p-8 transition-colors duration-500 hover:bg-[var(--bg-1)] sm:p-10 h-full">
                  {/* Corner bracket — top left */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[var(--line)] opacity-40 transition-opacity duration-500 group-hover:opacity-80 group-hover:border-[var(--metal-4)]" />

                  {/* Header row */}
                  <div className="flex items-baseline justify-between gap-4 mb-6">
                    {/* ID — mono display */}
                    <span
                      className="font-mono text-[1.1rem] font-light tracking-[-0.01em] leading-none"
                      style={{ color: "var(--signal)" }}
                    >
                      {proto.id}
                    </span>
                    <span className="label text-[var(--fg-faint)]">{proto.index}</span>
                  </div>

                  {/* Protocol name */}
                  <h3 className="text-[0.97rem] font-semibold tracking-[-0.022em] leading-[1.3] text-[var(--fg)] mb-2">
                    {proto.name}
                  </h3>

                  {/* Layer — small label */}
                  <p className="label text-[var(--fg-faint)] mb-5">{proto.layer}</p>

                  {/* Hairline rule */}
                  <div className="h-px bg-[var(--line-soft)] mb-5" />

                  {/* Description — the meat */}
                  <p className="text-[0.84rem] leading-[1.82] text-[var(--fg-mute)] flex-1 transition-colors duration-500 group-hover:text-[var(--fg-dim)]">
                    {proto.description}
                  </p>

                  {/* Status footer */}
                  <div className="mt-7 flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className="label"
                        style={{
                          color: proto.statusA.exists ? "var(--signal)" : "var(--fg-faint)",
                        }}
                      >
                        {proto.statusA.label}
                      </span>
                      <span
                        className="label"
                        style={{
                          color: proto.statusB.exists ? "var(--signal)" : "var(--fg-faint)",
                        }}
                      >
                        {proto.statusB.label}
                      </span>
                    </div>
                    <a
                      href={proto.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${proto.id} on GitHub`}
                      className="label text-[var(--fg-faint)] transition-colors duration-500 group-hover:text-[var(--metal-2)]"
                    >
                      GitHub&nbsp;↗
                    </a>
                  </div>

                  {/* Bottom signal bar — barely visible on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--signal)] to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-15" />
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── § 4 · CLOSING ─────────────────────────────────────────── */}
        {/* pb-40 = 10rem, mt-32 = 8rem */}
        <section className="mt-32 pb-40 sm:mt-44 lg:mt-52 lg:pb-56">
          <Reveal delay={0}>
            <div className="rule mb-14" />
          </Reveal>

          <div className="flex flex-col items-center gap-0 text-center">
            <Reveal delay={0}>
              <Glyph variant="seal" size={72} strokeOpacity={0.16} />
            </Reveal>

            <Reveal delay={60}>
              <p className="label mt-8 text-[var(--fg-faint)]">
                Spektre Labs&nbsp;·&nbsp;Open Protocol Program&nbsp;·&nbsp;2026
              </p>
            </Reveal>

            <Reveal delay={120}>
              {/* h2 display: matches closing pattern in research/systems pages */}
              <h2 className="metal-text mt-5 max-w-[32rem] text-balance text-[2.2rem] font-semibold tracking-[-0.04em] leading-[1.04] sm:text-[3rem]">
                The specifications<br />are public.
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-5 max-w-[30rem] text-pretty text-[1rem] leading-[1.85] text-[var(--fg-mute)]">
                The kernels are on GitHub. The networks are next. No permission required
                to implement, extend, or fork any of these.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-10">
                <a
                  href="https://github.com/spektre-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-metal rounded-[10px] px-8 py-3.5 text-[0.92rem] font-semibold tracking-tight"
                >
                  github.com/spektre-labs&nbsp;↗
                </a>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <Glyph variant="divider" size={140} strokeOpacity={0.15} className="mt-14" />
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
