import type { Metadata } from "next";
import Link from "next/link";

import { CanonVideo } from "@/components/canon-video";
import { Glyph } from "@/components/glyph";
import { PageHeader } from "@/components/page-header";
import { GuardDemo } from "@/components/guard-demo";
import { ProductPanel, type ProductDimension } from "@/components/product-panel";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Systems · σ-gate",
  description:
    "σ-gate: deterministic trust gate for AI and agent output. Leaked secrets, prompt-injection, and PII halted without a model call. Zero dependencies. Open core on GitHub.",
  path: "/systems",
  image: "/generated/divisions/systems.png",
});

/* ─────────────────────────────────────────────────────────────────
   DIMENSIONS — left = right, declared = realized.
   Only real, verifiable facts. No fabricated numbers.
────────────────────────────────────────────────────────────────── */
const GUARD_DIMENSIONS = [
  { label: "Status", value: "REAL · SHIPPING", accent: true },
  { label: "Dependencies", value: "Zero" },
  { label: "Runtime", value: "deterministic · in-process" },
  { label: "Network", value: "None required" },
  { label: "Model", value: "None required" },
  { label: "License", value: "Open core" },
] as const;

const LAYER_ROWS = [
  {
    index: "01",
    name: "guard",
    sub: "Open core · GitHub",
    status: "Free",
    description:
      "Deterministic pre-ship gate. Checks leaked secrets (20+ providers, entropy), prompt-injection / jailbreak patterns, and PII (email, phone, card-Luhn, SSN, IBAN, IP) in a single call. Same input → same verdict, every time. Zero deps, standard-library Python.",
    href: "https://github.com/spektre-labs/sigma-gate",
    external: true,
  },
  {
    index: "02",
    name: "σ-coherence scoring",
    sub: "Hosted · HuggingFace",
    status: "Pay-per-call",
    description:
      "Coherence / hallucination σ-scoring on a hot path. No signup — permissionless pay-to via x402. For the classes of risk that are not structurally detectable, this layer adds model-assisted coherence measurement.",
    href: "https://swagletz-sigmagate.hf.space",
    external: true,
  },
] as const;

const GUARD_CODE_SNIPPET = `from guard import guard

result = guard("Here is the key: ghp_16C7e42F292c6912E7710c838347Ae178B4a")
# {
#   "safe_to_ship": False,
#   "severity":     "high",
#   "block_reasons": ["secret[high]: github_pat"],
#   "dimensions":   {...}
# }

# Idiomatic usage
output = call_your_model(prompt)
v = guard(output)
if not v["safe_to_ship"]:
    raise ValueError(v["block_reasons"])`;

const HOSTED_CODE_SNIPPET = `# 1 · call the live endpoint — no signup, no API key
curl "https://swagletz-sigmagate.hf.space/check?text=your+text"

# 2 · HTTP 402 — permissionless pay-per-call (x402)
# { "price_usdc": 0.001, "chain": "solana", "asset": "USDC",
#   "pay_to": "7oDg…BzxyG", "then": "re-call with &tx=<sig>" }

# 3 · pay 0.001 USDC on Solana, re-call with the signature
curl "…/check?text=your+text&tx=<solana_signature>"   # → σ-score`;

const DESIGN_PRINCIPLES = [
  {
    glyph: "Deterministic.",
    body:
      "No model, no network, no API key. Same input → same verdict. You can reproduce it, test it, and trust it in CI.",
  },
  {
    glyph: "Composable.",
    body:
      "Each dimension — secret, injection, pii — is independent and pluggable. A hallucination scorer can be wired in, but is off by default. You add only what you need.",
  },
  {
    glyph: "Honest.",
    body:
      "Severity and block-reasons are explicit strings. Nothing is hidden behind a confidence float that you cannot audit.",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────
   PAGE
────────────────────────────────────────────────────────────────── */
export default function SystemsPage() {
  return (
    <div>
      {/* ── Header — the platinum lattice glimmers through the void
             behind it (texture, not an embed): heavy radial mask into
             OLED so only the header's halo reveals the circuitry. ───── */}
      <div className="relative -mx-6 -mt-10 overflow-hidden px-6 pb-6 pt-10 sm:-mx-10 sm:px-10 sm:pt-14 lg:-mx-14 lg:px-14 lg:pt-16">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
          <CanonVideo
            src="/generated/systems-lattice.mp4"
            poster="/generated/systems-lattice-poster.jpg"
            label="Platinum circuit lattice, drifting — generated in-canon, graded monochrome."
            className="h-full w-full object-cover opacity-[0.22]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(85% 90% at 32% 20%, transparent 0%, #000 76%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black to-transparent" />
        </div>
        <PageHeader
          title="σ-gate"
          description="Deterministic trust gate for AI and agent output. 1 = 1, made executable."
        />
      </div>

      {/* ── § 1 · AXIOM STATEMENT ───────────────────────────────── */}
      <section className="relative mt-24 overflow-hidden sm:mt-32 lg:mt-40">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <Glyph variant="seal" size={340} strokeOpacity={0.06} />
        </div>

        <div className="rule" />
        <div className="relative flex flex-col items-center px-6 py-20 text-center sm:py-28">
          <Reveal delay={0}>
            <p className="label mb-6 text-[var(--fg-faint)]">
              Axiom · Systems · Division 02
            </p>
          </Reveal>

          <Reveal delay={60}>
            <p
              className="metal-text text-[4rem] font-semibold tracking-[-0.05em] leading-none sm:text-[6rem] lg:text-[8rem]"
              aria-label="One equals one"
            >
              1&thinsp;=&thinsp;1
            </p>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-8 max-w-[36rem] text-pretty text-[1.02rem] leading-[1.88] text-[var(--fg-mute)] sm:text-[1.1rem]">
              AI output that can&rsquo;t be checked can&rsquo;t be trusted. σ-gate closes the gap
              between what a model declares and what is safe to realize — deterministically,
              without a model call.
            </p>
          </Reveal>
        </div>
        <div className="rule" />
      </section>

      {/* ── § 2 · PRODUCT PANEL — guard (open core) ─────────────── */}
      <section className="mt-24 sm:mt-32 lg:mt-40">
        <Reveal delay={0}>
          <div className="mb-10 flex items-baseline justify-between gap-6">
            <p className="label text-[var(--fg-faint)]">Open core · guard</p>
            <span className="label" style={{ color: "var(--signal)" }}>
              REAL · SHIPPING
            </span>
          </div>
        </Reveal>

        <ProductPanel
          eyebrow="spektre-labs/sigma-gate"
          title="guard"
          signal="Zero deps"
          body={[
            "A zero-dependency, standard-library Python trust gate. One call. One verdict.",
            "Catches leaked secrets (20+ providers, entropy), prompt-injection / jailbreak, and PII — email, phone, card-Luhn, SSN, IBAN, IP — before output ships.",
            "No model. No network. No API key. The same input gives the same verdict every time. That is the point.",
          ]}
          dimensions={GUARD_DIMENSIONS as unknown as ProductDimension[]}
          code={{
            language: "python",
            snippet: GUARD_CODE_SNIPPET,
            caption: "guard · spektre-labs/sigma-gate · stdlib · zero deps",
          }}
          ctas={[
            {
              label: "GitHub →",
              href: "https://github.com/spektre-labs/sigma-gate",
              external: true,
              variant: "primary",
            },
            {
              label: "Clone & run",
              href: "https://github.com/spektre-labs/sigma-gate",
              external: true,
              variant: "ghost",
            },
          ]}
        />
      </section>

      {/* ── § 2.5 · TRY THE GATE — live, in-browser ─────────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52">
        <div className="rule mb-14" />
        <Reveal delay={0}>
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Proof · Try it</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Declared,<br />then realized.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-[34rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
                The gate runs right here — the open-core detectors, ported to your browser. No model,
                no network, no key. Type anything, or load an example. The verdict is deterministic:
                the same input gives the same answer, every time.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mx-auto max-w-[44rem]">
            <GuardDemo />
          </div>
        </Reveal>
      </section>

      {/* ── § 3 · TWO-LAYER ARCHITECTURE ────────────────────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52">
        <div className="rule mb-14" />

        <Reveal delay={0}>
          <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Architecture · Two layers</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Open core.<br />Hosted scoring.
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-end">
              <p className="text-[1.02rem] leading-[1.85] text-[var(--fg-mute)] max-w-[38rem]">
                Structurally detectable risk — an{" "}
                <code className="text-[var(--fg-dim)] text-[0.88em]">AKIA…</code> key,
                a{" "}
                <code className="text-[var(--fg-dim)] text-[0.88em]">4111…</code> card,
                an &ldquo;ignore all previous instructions&rdquo; — does not require a model.
                It requires a gate that gives the same answer every time. That is the open core.
                Coherence scoring — the part that needs a model — is the hosted layer, optional.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Layer rows — editorial list */}
        <div className="space-y-0">
          {LAYER_ROWS.map((row, i) => (
            <Reveal key={row.index} delay={i * 80}>
              <div className="group relative border-t border-[var(--line)] py-10 transition-colors duration-500 hover:border-[var(--line-strong)] sm:py-12">
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
                  {/* Index + name */}
                  <div className="flex items-baseline gap-5 lg:col-span-4">
                    <span className="label tabular-nums text-[var(--fg-faint)] shrink-0">
                      {row.index}
                    </span>
                    <div>
                      <h3 className="text-[1.35rem] font-semibold tracking-[-0.025em] leading-none text-[var(--fg)] sm:text-[1.6rem]">
                        {row.name}
                      </h3>
                      <p className="mt-1.5 label text-[var(--fg-faint)]">{row.sub}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-5 lg:col-start-5">
                    <p className="text-[0.97rem] leading-[1.84] text-[var(--fg-dim)]">
                      {row.description}
                    </p>
                  </div>

                  {/* Status + link */}
                  <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:col-start-10 lg:flex-col lg:items-end lg:justify-start">
                    <span
                      className="label"
                      style={{
                        color:
                          row.status === "Free"
                            ? "var(--signal)"
                            : "var(--fg-mute)",
                      }}
                    >
                      {row.status}
                    </span>
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label text-[var(--fg-mute)] transition-colors duration-500 group-hover:text-[var(--fg)]"
                      aria-label={`Open ${row.name}`}
                    >
                      ↗
                    </a>
                  </div>
                </div>

                {/* Hairline hover accent */}
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

      {/* ── § 4 · HOSTED ENDPOINT — code example ────────────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52">
        <Reveal delay={0}>
          <div className="mb-10">
            <p className="label mb-3 text-[var(--fg-faint)]">Hosted · σ-coherence scoring</p>
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
              No signup.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-10 max-w-[44ch] text-[1.02rem] leading-[1.85] text-[var(--fg-mute)]">
            Coherence / hallucination scoring without running anything yourself.
            Permissionless pay-to via x402. No account, no key, no lock-in.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-2)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
              <span className="label text-[var(--fg-faint)]">bash</span>
              <div className="flex items-center gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
                <span className="h-2 w-2 rounded-full bg-[var(--line-strong)]" />
              </div>
            </div>
            <pre className="overflow-x-auto px-5 py-5 text-[0.82rem] leading-[1.75] text-[var(--fg-dim)] font-mono">
              <code>{HOSTED_CODE_SNIPPET}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="https://swagletz-sigmagate.hf.space"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-metal rounded-[10px] px-6 py-3 text-[0.88rem] font-semibold tracking-tight"
            >
              Hosted endpoint ↗
            </a>
            <span className="label text-[var(--fg-faint)]">
              swagletz-sigmagate.hf.space
            </span>
          </div>
        </Reveal>
      </section>

      {/* ── § 4.5 · MCP TOOL — install into any agent ───────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52">
        <div className="rule mb-14" />
        <Reveal delay={0}>
          <div className="mb-10 grid gap-6 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="label mb-4 text-[var(--fg-faint)]">Distribution · MCP</p>
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
                Give any agent<br />the gate.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p className="mb-7 max-w-[40rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
                σ-gate ships a zero-dependency MCP server. One command and any agent — Claude Code,
                Claude Desktop, Cursor, Cline — has a deterministic <code className="text-[var(--fg)]">guard</code>{" "}
                tool it can call before shipping output. No model, no key, no token cost.
              </p>
              <div className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-2)] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
                  <span className="label text-[var(--fg-faint)]">bash</span>
                  <span className="label text-[var(--fg-faint)]">MCP</span>
                </div>
                <pre className="overflow-x-auto px-5 py-5 text-[0.82rem] leading-[1.75] text-[var(--fg-dim)] font-mono">
                  <code>claude mcp add guard -- python3 mcp_server.py</code>
                </pre>
              </div>
              <div className="mt-7">
                <a
                  href="https://github.com/spektre-labs/sigma-gate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-metal rounded-[10px] px-6 py-3 text-[0.88rem] font-semibold tracking-tight"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── § 5 · DESIGN PRINCIPLES ──────────────────────────────── */}
      <section className="mt-32 sm:mt-44 lg:mt-52">
        <div className="rule mb-14" />

        <Reveal delay={0}>
          <div className="mb-16">
            <p className="label mb-4 text-[var(--fg-faint)]">Design · Three principles</p>
            <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] leading-[1.08] text-[var(--fg)] sm:text-[2.2rem]">
              Why it works.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="flex justify-center mb-14">
            <Glyph variant="divider" size={200} strokeOpacity={0.3} />
          </div>
        </Reveal>

        <div className="grid gap-px border border-[var(--line)] rounded-[var(--radius)] overflow-hidden bg-[var(--line)] sm:grid-cols-3">
          {DESIGN_PRINCIPLES.map((p, i) => (
            <Reveal key={p.glyph} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col bg-[var(--bg-1)] p-8 sm:p-10">
                <div className="mb-5 flex items-center gap-3">
                  <Glyph variant="node" size={20} strokeOpacity={0.45} />
                  <span
                    className="label"
                    style={{ color: "var(--signal)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-[1.1rem] font-semibold tracking-[-0.02em] leading-none text-[var(--fg)] mb-4">
                  {p.glyph}
                </h3>
                <p className="text-[0.94rem] leading-[1.82] text-[var(--fg-dim)] flex-1">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rule mt-14" />
      </section>

      {/* ── § 6 · FINAL CTA ──────────────────────────────────────── */}
      <section className="mt-32 pb-40 sm:mt-44 lg:mt-52 lg:pb-56">
        <div className="flex flex-col items-center gap-0 text-center">
          <Reveal delay={0}>
            <Glyph variant="seal" size={88} strokeOpacity={0.2} />
          </Reveal>

          <Reveal delay={60}>
            <p className="label mt-8 text-[var(--fg-faint)]">
              Spektre Systems&nbsp;·&nbsp;Division 02&nbsp;·&nbsp;REAL
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="metal-text mt-5 max-w-[30rem] text-balance text-[2.2rem] font-semibold tracking-[-0.04em] leading-[1.04] sm:text-[3rem]">
              The gate is open.
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-5 max-w-[28rem] text-pretty text-[1rem] leading-[1.85] text-[var(--fg-mute)]">
              Zero deps. No model. No key. Clone and run — the test suite is the proof.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/spektre-labs/sigma-gate"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-metal rounded-[10px] px-8 py-3.5 text-[0.92rem] font-semibold tracking-tight"
              >
                GitHub — spektre-labs/sigma-gate
              </a>
              <a
                href="https://swagletz-sigmagate.hf.space"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[10px] border border-[var(--line-strong)] px-8 py-3.5 text-[0.92rem] font-medium tracking-tight text-[var(--fg-dim)] transition-colors duration-500 hover:border-[var(--metal-3)] hover:text-[var(--fg)]"
              >
                Hosted endpoint ↗
              </a>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-12 flex items-center gap-6">
              <Link
                href="/artifacts"
                className="text-[0.95rem] leading-snug text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-[0.3rem] decoration-[0.5px] transition-colors duration-500 hover:text-[var(--fg)] hover:decoration-[var(--metal-3)]"
              >
                Artifacts
              </Link>
              <span className="h-px w-4 bg-[var(--line-strong)]" />
              <Link
                href="/artifacts/sigma-gate"
                className="text-[0.95rem] leading-snug text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-[0.3rem] decoration-[0.5px] transition-colors duration-500 hover:text-[var(--fg)] hover:decoration-[var(--metal-3)]"
              >
                σ-gate artifact
              </Link>
              <span className="h-px w-4 bg-[var(--line-strong)]" />
              <Link
                href="/"
                className="text-[0.95rem] leading-snug text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-[0.3rem] decoration-[0.5px] transition-colors duration-500 hover:text-[var(--fg)] hover:decoration-[var(--metal-3)]"
              >
                Spektre Labs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
