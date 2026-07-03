import type { Metadata } from "next";

import { Glyph } from "@/components/glyph";
import { ReserveProof } from "@/components/reserve-proof";
import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "SPEKTRE token — a Bitcoin reserve you can verify in 60 seconds",
  description:
    "SPEKTRE is a fixed-supply token where every unit is matched by one satoshi of Bitcoin in a public reserve address. No auditor PDF — your own browser checks the chains. Includes what is proven and what is not.",
  path: "/token",
});

/* σ-honesty is the product here. Two registers, never blurred:
   VERIFIED = what any reader can machine-check right now.
   PENDING  = what is not yet proven, stated as plainly as the proof. */

const VERIFIED = [
  {
    k: "Supply",
    v: "31,000 SPEKTRE",
    line: "Fixed at 31,000 units, zero decimals, on Solana mainnet. Readable by anyone via getTokenSupply.",
  },
  {
    k: "Reserve",
    v: "31,000 satoshis",
    line: "One satoshi per token, held at a public Bitcoin address. Two independent block explorers report the same balance.",
  },
  {
    k: "Freeze authority",
    v: "None",
    line: "No one can freeze a holder's tokens — the freeze authority was never set.",
  },
] as const;

const PENDING = [
  {
    k: "Key-control proof",
    line: "A BIP-322 signed message proving Spektre controls the reserve key has not been published yet. Until it is, the balance is proven but the ownership is a claim.",
  },
  {
    k: "Mint authority",
    line: "The mint authority has not been renounced yet, which means supply could technically still be changed. Until it is renounced, treat SPEKTRE as a live experiment — it is not offered for sale and carries no price claim.",
  },
] as const;

const FAQ = [
  {
    q: "How do I verify a crypto token is actually backed?",
    a: "Don't read the project's PDF — query the chains. 1) Get the reserve address and check its balance on two independent block explorers (they must agree). 2) Read the token's total supply directly from its chain. 3) Compare: reserve ≥ supply, continuously, not on audit day. 4) Demand a signed message from the reserve key proving the project controls it. This page performs steps 1–3 live in your browser; step 4 is listed under 'not yet proven' because it isn't done.",
  },
  {
    q: "What is SPEKTRE?",
    a: "A fixed-supply token of 31,000 units on Solana, where each unit is matched by one satoshi of Bitcoin held at a public reserve address. It is an access unit and a working demonstration of machine-verifiable backing — not an investment product.",
  },
  {
    q: "Why should I trust this page?",
    a: "You shouldn't have to. The verify button makes your own browser query mempool.space, blockstream.info and the Solana network directly. If this page lied, the numbers would expose it.",
  },
  {
    q: "Is SPEKTRE for sale?",
    a: "No. Two proofs are still pending (key control and mint renouncement), and until both are published the token is a live experiment with no sale and no price claim.",
  },
] as const;

export default function TokenPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* ── Hero ── */}
      <div className="mt-16 sm:mt-20 lg:mt-28">
        <Reveal delay={0}>
          <p className="label text-[var(--fg-faint)]">Token · Proof of reserve</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="metal-text mt-6 max-w-[16ch] text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[3.4rem] lg:text-[4.2rem]">
            A reserve you can check yourself.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-7 max-w-[40rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
            Fixed supply. One satoshi per unit. Public address. Your browser
            reads both chains directly — no auditor PDF, no snapshot, no
            middleman.
          </p>
        </Reveal>
      </div>

      {/* ── Live verification — the hero of this page ── */}
      <section className="mt-16 sm:mt-20">
        <Reveal delay={0}>
          <ReserveProof />
        </Reveal>
      </section>

      {/* ── Anatomy of the proof ── */}
      <section className="mt-24 sm:mt-32">
        <Reveal delay={0}>
          <div className="mb-10">
            <p className="label mb-3 text-[var(--fg-faint)]">Architecture · How the backing works</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-[var(--fg)] sm:text-[2rem]">
              Anatomy of the proof.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          {/* Symmetric proof diagram — pure HTML/CSS, hairlines, no images */}
          <div
            aria-label="Proof architecture: Bitcoin reserve connected 1-to-1 to SPEKTRE token supply on Solana"
            className="overflow-hidden rounded-[var(--radius)] border border-[var(--line)]"
          >
            <div className="grid grid-cols-[1fr_auto_1fr]">

              {/* Left node — Bitcoin chain */}
              <div className="bg-[var(--bg-1)] p-6 sm:p-8">
                <p className="label text-[var(--fg-faint)]">Bitcoin chain</p>
                <p className="metal-text mt-4 font-mono text-[1.6rem] font-semibold leading-none tabular-nums">
                  31,000
                </p>
                <p className="label mt-1.5 text-[var(--fg-mute)]">satoshis</p>
                <div
                  aria-hidden="true"
                  className="my-6 h-px"
                  style={{
                    background: "linear-gradient(90deg, var(--line-strong), transparent)",
                  }}
                />
                <p className="label mb-2.5 text-[var(--fg-faint)]">Verified by</p>
                <p className="label text-[var(--fg-dim)]">mempool.space</p>
                <p className="label mt-1 text-[var(--fg-dim)]">blockstream.info</p>
                <div className="mt-6">
                  <p className="label mb-1.5 text-[var(--fg-faint)]">Address</p>
                  <p className="font-mono text-[0.66rem] leading-snug text-[var(--fg-mute)]">
                    bc1qea8h···lgde9
                  </p>
                </div>
              </div>

              {/* Center bridge — the 1:1 axis, the page's one signal accent */}
              <div
                className="flex shrink-0 flex-col items-center justify-center self-stretch px-4 sm:px-6"
                style={{
                  borderLeft: "1px solid var(--line)",
                  borderRight: "1px solid var(--line)",
                }}
              >
                <div
                  aria-hidden="true"
                  className="w-px flex-1"
                  style={{
                    background: "linear-gradient(180deg, transparent, var(--line-strong))",
                    minHeight: "2rem",
                  }}
                />
                <div className="py-5 text-center">
                  <p
                    className="label tracking-[0.22em]"
                    style={{ color: "var(--signal)" }}
                  >
                    1 : 1
                  </p>
                  <p className="label mt-1.5 whitespace-nowrap text-[var(--fg-faint)]">
                    sat · unit
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="w-px flex-1"
                  style={{
                    background: "linear-gradient(180deg, var(--line-strong), transparent)",
                    minHeight: "2rem",
                  }}
                />
              </div>

              {/* Right node — Solana chain (bilateral mirror) */}
              <div className="bg-[var(--bg-1)] p-6 text-right sm:p-8">
                <p className="label text-[var(--fg-faint)]">Solana chain</p>
                <p className="metal-text mt-4 font-mono text-[1.6rem] font-semibold leading-none tabular-nums">
                  31,000
                </p>
                <p className="label mt-1.5 text-[var(--fg-mute)]">SPEKTRE</p>
                <div
                  aria-hidden="true"
                  className="my-6 h-px"
                  style={{
                    background: "linear-gradient(270deg, var(--line-strong), transparent)",
                  }}
                />
                <p className="label mb-2.5 text-[var(--fg-faint)]">Verified by</p>
                <p className="label text-[var(--fg-dim)]">getTokenSupply</p>
                <p className="label mt-1 text-[var(--fg-dim)]">Solana RPC</p>
                <div className="mt-6">
                  <p className="label mb-1.5 text-[var(--fg-faint)]">Mint</p>
                  <p className="font-mono text-[0.66rem] leading-snug text-[var(--fg-mute)]">
                    AaRuU···opAv
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom taxonomy bar */}
            <div
              className="grid grid-cols-[1fr_auto_1fr]"
              style={{ borderTop: "1px solid var(--line-soft)" }}
            >
              <div className="px-6 py-3 sm:px-8">
                <p className="label text-[var(--fg-faint)]">Chain A · Bitcoin</p>
              </div>
              <div
                className="shrink-0 px-4 py-3 text-center sm:px-6"
                style={{
                  borderLeft: "1px solid var(--line-soft)",
                  borderRight: "1px solid var(--line-soft)",
                }}
              >
                <p className="label text-[var(--fg-faint)]">Bridge</p>
              </div>
              <div className="px-6 py-3 text-right sm:px-8">
                <p className="label text-[var(--fg-faint)]">Chain B · Solana</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── What is proven ── */}
      <section className="mt-24 sm:mt-32">
        <Reveal delay={0}>
          <div className="mb-10">
            <p className="label mb-3 text-[var(--signal)]">Verified · machine-checkable now</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-[var(--fg)] sm:text-[2rem]">
              What is proven.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3">
          {VERIFIED.map((item, i) => (
            <Reveal key={item.k} delay={i * 80} className="h-full">
              <div className="flex h-full flex-col bg-[var(--bg-1)] p-8">
                <p className="label text-[var(--fg-faint)]">{item.k}</p>
                <p className="metal-text mt-3 text-[1.5rem] font-semibold tracking-[-0.02em]">
                  {item.v}
                </p>
                <p className="mt-4 text-[0.92rem] leading-[1.78] text-[var(--fg-dim)]">
                  {item.line}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── What is NOT proven — the honesty is the product ── */}
      <section className="mt-20 sm:mt-24">
        <Reveal delay={0}>
          <div className="mb-10">
            <p className="label mb-3 text-[var(--fg-faint)]">Pending · stated plainly</p>
            <h2 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-[var(--fg)] sm:text-[2rem]">
              What is not proven yet.
            </h2>
          </div>
        </Reveal>
        <div className="space-y-0">
          {PENDING.map((item, i) => (
            <Reveal key={item.k} delay={i * 80}>
              <div className="grid gap-4 border-t border-[var(--line)] py-8 lg:grid-cols-12">
                <p className="label pt-1 text-[var(--fg-mute)] lg:col-span-3">{item.k}</p>
                <p className="max-w-[42rem] text-[0.97rem] leading-[1.82] text-[var(--fg-dim)] lg:col-span-8 lg:col-start-5">
                  {item.line}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="rule" />
        </div>
        <Reveal delay={160}>
          <p className="mt-8 max-w-[44rem] text-[0.95rem] leading-[1.8] text-[var(--fg-mute)]">
            When these two proofs are published, they will appear on this page
            with the same verify-it-yourself treatment. Nothing on this page is
            an offer, a price claim, or investment advice.
          </p>
        </Reveal>
      </section>

      {/* ── The method — the generalizable value ── */}
      <section className="mt-24 sm:mt-32">
        <Reveal delay={0}>
          <div className="surface rounded-[var(--radius)] p-8 sm:p-12">
            <div className="mb-8 flex items-center justify-between">
              <p className="label text-[var(--fg-faint)]">The method · Use it on any token</p>
              <Glyph variant="node" size={20} strokeOpacity={0.35} />
            </div>
            <h2 className="max-w-[24ch] text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--fg)] sm:text-[1.9rem]">
              How to verify any backed token. Four steps.
            </h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                "Find the reserve address and check its balance on two independent explorers. They must agree.",
                "Read the token's total supply from the chain itself, not from the website.",
                "Compare: reserve must cover supply today — not on some past audit date.",
                "Demand a signed message from the reserve key. Balance without key-control proof is only half a proof.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="label mt-1 shrink-0 tabular-nums text-[var(--fg-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.95rem] leading-[1.8] text-[var(--fg-dim)]">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ (matches the JSON-LD above) ── */}
      <section className="mt-24 pb-24 sm:mt-32 sm:pb-32">
        <Reveal delay={0}>
          <p className="label mb-10 text-[var(--fg-faint)]">Questions</p>
        </Reveal>
        <div className="space-y-0">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <div className="border-t border-[var(--line)] py-8">
                <h3 className="text-[1.1rem] font-semibold tracking-[-0.015em] text-[var(--fg)]">
                  {f.q}
                </h3>
                <p className="mt-4 max-w-[46rem] text-[0.95rem] leading-[1.82] text-[var(--fg-dim)]">
                  {f.a}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="rule" />
        </div>
      </section>
    </div>
  );
}
