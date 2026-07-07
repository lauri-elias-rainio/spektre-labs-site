import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { ReceiptVerifier } from "@/components/receipt-verifier";
import { Section } from "@/components/section";
import { TrustCheckBox } from "@/components/trust-check-box";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Trust",
  description:
    "Trust any AI output. Paste a signed receipt and your browser verifies it — no account, no server, no key. The same check runs on any device, from a phone to a server.",
  path: "/trust",
});

// three doors, one substrate — the whole spectrum from a person to an enterprise to an agent.
const YOU_SNIPPET = `1. paste a sigma-attest receipt below
2. your browser checks the signature locally — no upload
3. VALID means the keyholder really signed those exact words`;

const DEV_SNIPPET = `# verify a receipt on any device — one file, zero dependencies
curl -O https://spektre.org/verify.py     # pure Python, no pip
python3 verify.py <token>                  # → VALID / INVALID

# or check an AI output live (permissionless, pay-per-call via x402)
curl "https://spektre.org/.well-known/x402"`;

const AGENT_SNIPPET = `// any MCP agent (Claude, Cursor, Cline, OpenHands) plugs in the whole layer
{ "mcpServers": { "trust": {
  "command": "python3",
  "args": ["/path/to/trust_mcp.py"] } } }
// tools: attest · verify · fence · build · classify · integrity`;

export default function TrustPage() {
  return (
    <div>
      <PageHeader
        title="Trust any AI output"
        description="A signed receipt that verifies in your browser — no account, no server, no key. The same check runs on any device, from a phone to a bare-metal chip. Proof travels with the claim; you never have to trust us to check it."
      />

      <Section title="Read any AI answer">
        <ProseBlock className="mb-6 max-w-[42rem]">
          <p>
            Not sure whether to trust an AI answer? Paste it. You get an instant read of
            its reliability shapes — over-claiming, mixed evidence, or a hidden instruction
            trying to hijack you — computed on your device, nothing uploaded. It flags how
            to read the text; it does not decide the truth for you.
          </p>
        </ProseBlock>
        <TrustCheckBox />
      </Section>

      <Section title="Verify a signed receipt">
        <ReceiptVerifier />
      </Section>

      <Section title="Three doors, one layer">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="border border-[var(--line-soft)] p-5">
            <p className="label mb-3 text-[var(--fg-faint)]">for you</p>
            <pre className="whitespace-pre-wrap font-mono text-[0.78rem] leading-relaxed text-[var(--fg-dim)]">
              {YOU_SNIPPET}
            </pre>
          </div>
          <div className="border border-[var(--line-soft)] p-5">
            <p className="label mb-3 text-[var(--fg-faint)]">for developers</p>
            <pre className="overflow-x-auto font-mono text-[0.78rem] leading-relaxed text-[var(--fg-dim)]">
              {DEV_SNIPPET}
            </pre>
          </div>
          <div className="border border-[var(--line-soft)] p-5">
            <p className="label mb-3 text-[var(--fg-faint)]">for agents</p>
            <pre className="overflow-x-auto font-mono text-[0.78rem] leading-relaxed text-[var(--fg-dim)]">
              {AGENT_SNIPPET}
            </pre>
          </div>
        </div>
      </Section>

      <Section title="Why it is different">
        <ProseBlock className="max-w-[42rem]">
          <p>
            The internet you know extracts value from your attention and asks you to
            trust a platform. This layer inverts it: every claim carries its own proof,
            anyone verifies it independently with a file they own, and value settles
            per verified call with no gatekeeper taking a cut. It runs the same on a
            $40 Android phone as in a data centre — the places with the least legacy
            infrastructure can adopt it first.
          </p>
        </ProseBlock>
      </Section>

      <Section title="Honest scope">
        <ProseBlock className="max-w-[42rem]">
          <p>
            A verified receipt proves the keyholder signed those exact bytes at that
            time — it does not prove the underlying claim is universally true. An honest
            attestation of a check, never an oracle. The reference verifiers
            (<a href="/verify.py" className="underline underline-offset-4">Python</a>,{" "}
            <a href="/verify.js" className="underline underline-offset-4">JavaScript</a>,{" "}
            <a href="/verify.c" className="underline underline-offset-4">C</a>) and the
            full spec live under{" "}
            <a href="/receipt" className="underline underline-offset-4">/receipt</a> and{" "}
            <a href="/systems" className="underline underline-offset-4">/systems</a>.
          </p>
        </ProseBlock>
      </Section>
    </div>
  );
}
