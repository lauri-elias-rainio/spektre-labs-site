import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { ReceiptVerifier } from "@/components/receipt-verifier";
import { Section } from "@/components/section";
import { GENESIS_CLAIM } from "@/lib/receipt";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Receipt",
  description:
    "A sigma-attest receipt — a signed record of an honesty check on AI output, verified in your browser with no server and no account.",
  path: "/receipt",
});

const EDGE_SNIPPET = `# the same check, live — no signup, no API key
curl "https://swagletz-sigmagate.hf.space/check?text=your+text"

# first call answers HTTP 402 with the terms, machine-readable:
# { "price_usdc": 0.001, "chain": "solana", "asset": "USDC",
#   "pay_to": "7oDg…BzxyG", "then": "re-call with &tx=<sig>" }

# pay 0.001 USDC on Solana, re-call with the signature → σ-score
curl "…/check?text=your+text&tx=<solana_signature>"`;

const VERIFY_STEPS = [
  {
    step: "decode",
    detail:
      "the token is two base64url segments: the payload bytes and an ed25519 signature over exactly those bytes",
  },
  {
    step: "import",
    detail:
      "the attester's public key is read from inside the payload — it travels with the receipt, so there is no key exchange",
  },
  {
    step: "verify",
    detail:
      "your browser's WebCrypto checks the signature locally; this page makes no network request to do it",
  },
] as const;

export default function ReceiptPage() {
  return (
    <div>
      <PageHeader
        title="Receipt"
        description="A portable, signed record that an honesty check was run on an AI output. The one below is real — your browser verified it before you finished reading this line."
      />

      <div className="mt-12 sm:mt-14">
        <ReceiptVerifier />
      </div>

      <Section title="What just happened">
        <div className="max-w-[42rem]">
          {VERIFY_STEPS.map((s) => (
            <div
              key={s.step}
              className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-[var(--line-soft)] py-4 sm:grid-cols-[9rem_1fr]"
            >
              <span className="label text-[var(--fg-faint)]">{s.step}</span>
              <p className="text-sm leading-relaxed text-[var(--fg-dim)]">{s.detail}</p>
            </div>
          ))}
          <p className="mt-6 text-sm leading-relaxed text-[var(--fg-mute)]">
            Paste any sigma-attest token into the box and the same check runs. Change one
            character anywhere and it fails — that is the whole point.
          </p>
        </div>
      </Section>

      <Section title="The signed words">
        <ProseBlock className="max-w-[42rem]">
          <p>
            A signature alone proves bytes, not meaning. So the claim text the genesis
            receipt covers is published here in full — the verifier above recomputes its
            sha-256 and shows that it equals the <code>claim_sha256</code> inside the
            signed payload:
          </p>
        </ProseBlock>
        <blockquote className="mt-6 max-w-[42rem] border-l border-[var(--line-strong)] pl-5 font-mono text-[0.8rem] leading-relaxed text-[var(--fg-dim)]">
          {GENESIS_CLAIM}
        </blockquote>
      </Section>

      <Section title="Run the check yourself">
        <ProseBlock className="max-w-[42rem]">
          <p>
            The check that signed this receipt runs as a live endpoint. One call, one
            answer — the first call returns the terms as an HTTP 402, you pay per call
            on-chain, and no account exists anywhere to create, manage, or lose.
          </p>
        </ProseBlock>
        <div className="mt-6 max-w-[42rem] border border-[var(--line-soft)]">
          <pre className="overflow-x-auto px-5 py-5 font-mono text-[0.82rem] leading-[1.75] text-[var(--fg-dim)]">
            <code>{EDGE_SNIPPET}</code>
          </pre>
        </div>
        <p className="mt-6 max-w-[42rem] text-sm leading-relaxed text-[var(--fg-mute)]">
          The full detector — secrets, injection, pii — and the offline SDK live on the{" "}
          <a href="/systems" className="text-[var(--fg-dim)] underline underline-offset-4">
            systems
          </a>{" "}
          page.
        </p>
      </Section>

      <Section title="Verify it anywhere — the protocol is open">
        <ProseBlock className="max-w-[42rem]">
          <p>
            The verifier is not ours to hold. Two single-file, zero-dependency reference
            implementations verify any sigma-attest receipt offline — one pure Python, one
            pure JavaScript, each ed25519 from scratch. Three independent implementations
            agree byte-for-byte on the same token; that is what makes it a protocol and not
            a service.
          </p>
        </ProseBlock>
        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="/verify.py"
            className="label border border-[var(--line-soft)] px-4 py-2 text-[var(--fg-dim)] transition-colors hover:border-[var(--line-strong)]"
          >
            verify.py — pure stdlib
          </a>
          <a
            href="/verify.js"
            className="label border border-[var(--line-soft)] px-4 py-2 text-[var(--fg-dim)] transition-colors hover:border-[var(--line-strong)]"
          >
            verify.js — zero npm
          </a>
          <a
            href="/.well-known/x402"
            className="label border border-[var(--line-soft)] px-4 py-2 text-[var(--fg-dim)] transition-colors hover:border-[var(--line-strong)]"
          >
            /.well-known/x402 — discovery
          </a>
        </div>
      </Section>

      <Section title="Honest scope">
        <ProseBlock className="max-w-[42rem]">
          <p>
            A receipt attests that a declared-equals-realized check was run over these
            exact bytes by the keyholder — who checked what, and the distance found. It
            does not attest that the claim is absolutely true, and this page does not
            pretend otherwise. sigma is the measured distance between what was declared
            and what was realized; zero means they were identical.
          </p>
        </ProseBlock>
      </Section>
    </div>
  );
}
