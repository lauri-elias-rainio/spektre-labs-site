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
