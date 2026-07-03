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
          <p className="mt-7 max-w-[42rem] text-[1.02rem] leading-[1.85] text-[var(--fg-dim)]">
            SPEKTRE is a fixed-supply token where every unit is matched by one
            satoshi of Bitcoin at a public address. Most “backed” tokens ask you
            to trust an auditor&apos;s snapshot. This one hands you the tools: your
            browser queries the chains directly, right here, in about a minute.
          </p>
        </Reveal>
      </div>

      {/* ── Live verification ── */}
      <section className="mt-16 sm:mt-20">
        <Reveal delay={0}>
          <ReserveProof />
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
            <h2 className="max-w-[24ch] text-[1.5rem] font-semibold tracking-[-0.03em] leading-[1.15] text-[var(--fg)] sm:text-[1.9rem]">
              How to verify any “backed” token — in four steps.
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
