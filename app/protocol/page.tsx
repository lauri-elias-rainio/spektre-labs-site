import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { ProseBlock } from "@/components/prose-block";
import { Section } from "@/components/section";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Protocol",
  description:
    "Creation OS — an open proof-carrying agent runtime. Proof travels with the capability; verify, don't re-run; no gatekeeper; any device. One citable, adoptable standard.",
  path: "/protocol",
});

// each layer is a real artifact already served on this origin — link, don't describe.
const LAYERS = [
  {
    name: "sigma-attest receipts",
    href: "/receipt",
    detail:
      "the wire object — ed25519-signed bytes carrying the public key and a claim hash; verifies offline, no key exchange",
  },
  {
    name: "reference verifiers, to the metal",
    href: "/verify.py",
    detail:
      "four independent single-file implementations agree byte-for-byte — pure Python, pure JavaScript, and C compiling freestanding (no OS)",
    also: [
      { label: "verify.js", href: "/verify.js" },
      { label: "verify.c", href: "/verify.c" },
    ],
  },
  {
    name: "conformance vectors",
    href: "/.well-known/sigma-attest-vectors.json",
    detail:
      "six vectors — one valid, five that MUST be rejected; any implementation that agrees on all six is conformant",
  },
  {
    name: "x402 discovery",
    href: "/.well-known/x402",
    detail:
      "the machine-readable payment terms — a live check answers HTTP 402 with price, chain, and pay-to; settle per verified call",
  },
  {
    name: "A2A Agent Card",
    href: "/.well-known/agent.json",
    detail:
      "the agent-to-agent discovery record — capabilities and endpoints a peer reads before it delegates",
  },
  {
    name: "interactive trust read",
    href: "/trust",
    detail:
      "paste any receipt and your browser verifies it locally — the whole layer, driven by a person, no account",
  },
] as const;

// pulled verbatim in mapping from RAILO_STATE/FORMAL_GROUNDING.md — stable canonical citations only.
const GROUNDING = [
  {
    part: "proof travels with the capability; a gateway that re-checks is an accelerator, never the trust root",
    result: "End-to-end argument — Saltzer, Reed & Clark, ACM TOCS 2(4), 1984",
  },
  {
    part: "authority is an unforgeable, delegable token; no ambient authority, no ACL lookup",
    result: "Object-capability model — Dennis & Van Horn, CACM 9(3), 1966",
  },
  {
    part: "the action ships with a machine-checkable proof; the host cheaply checks, never trusts the producer",
    result: "Proof-carrying code — Necula, POPL 1997",
  },
  {
    part: "every self-report is adversarial until its signed evidence is independently re-checked",
    result: "Byzantine Generals — Lamport, Shostak & Pease, ACM TOPLAS 4(3), 1982",
  },
  {
    part: "state becomes canonical through objectively-verifiable proof, not a permissioned authority",
    result: "Nakamoto consensus / PoW — Nakamoto, 2008",
  },
  {
    part: "a commit is the diagonal act that collapses a vast possibility-space onto one actualized point",
    result: "Cantor's theorem (|2^A| > |A|) — Cantor, 1891",
  },
  {
    part: "the unforgeable wire binding of every capability, attestation, and delegation link",
    result: "EdDSA / Ed25519 — RFC 8032 (Josefsson & Liusvaara), 2017",
  },
  {
    part: "a genuine commit is physically irreversible and cannot be silently undone",
    result: "Landauer's principle — Landauer, IBM J. R&D 5(3), 1961",
  },
] as const;

// real 2026 standards this substrate interoperates with — reachability, not reinvention.
const INTEROP = [
  { name: "A2A", detail: "agent-to-agent discovery and delegation — the Agent Card above is this surface" },
  { name: "x402 v2", detail: "HTTP-402 micropayments — value settles per verified call, no gatekeeper" },
  { name: "AP2", detail: "bounded agent wallets with approval thresholds" },
  { name: "Biscuit", detail: "attenuable capability tokens (POLA) — delegation only narrows" },
  { name: "AIVS", detail: "IETF signed audit archive — extends the receipt + audit chain" },
  { name: "C2PA", detail: "content provenance for signed media" },
  { name: "MCP", detail: "the tool surface — attest · verify · fence already served to any MCP agent" },
] as const;

export default function ProtocolPage() {
  return (
    <div>
      <PageHeader
        title="Creation OS — an open proof-carrying agent runtime"
        description="Proof travels with the capability; verify, don't re-run; no gatekeeper; any device. One citable, adoptable standard — every layer below is a real artifact already served on this origin."
      />

      <Section title="The thesis">
        <ProseBlock className="max-w-[42rem]">
          <p>
            An agent runtime where <strong>proof travels with the capability</strong>. The
            receiver verifies the carried proof rather than re-running the work, so there is
            no central re-executor to trust and no gatekeeper to take a cut. Verification is
            a pure function — public key, message, signature to a boolean — which runs the
            same on a $40 phone as on a data-centre node. That is the whole standard:{" "}
            <strong>verify, don&apos;t re-run; no gatekeeper; any device.</strong>
          </p>
        </ProseBlock>
      </Section>

      <Section title="The layers — each a served artifact">
        <div className="max-w-[46rem]">
          {LAYERS.map((l) => (
            <div
              key={l.name}
              className="grid grid-cols-1 gap-2 border-b border-[var(--line-soft)] py-5 sm:grid-cols-[16rem_1fr] sm:gap-5"
            >
              <div>
                <a
                  href={l.href}
                  className="label text-[var(--fg-dim)] underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
                >
                  {l.name}
                </a>
                {"also" in l && l.also ? (
                  <span className="mt-1 block font-mono text-[0.72rem] text-[var(--fg-faint)]">
                    {l.also.map((a, i) => (
                      <span key={a.href}>
                        {i > 0 ? " · " : ""}
                        <a href={a.href} className="underline underline-offset-4">
                          {a.label}
                        </a>
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-[var(--fg-mute)]">{l.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Formal grounding">
        <ProseBlock className="mb-6 max-w-[42rem]">
          <p>
            Not a manifesto. Every load-bearing property maps to a classic, correctly-cited
            result, so a reviewer can attack it line by line.
          </p>
        </ProseBlock>
        <div className="max-w-[52rem] border border-[var(--line-soft)]">
          {GROUNDING.map((g, i) => (
            <div
              key={g.result}
              className={`grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[1fr_20rem] sm:gap-6 ${
                i > 0 ? "border-t border-[var(--line-soft)]" : ""
              }`}
            >
              <p className="text-sm leading-relaxed text-[var(--fg-dim)]">{g.part}</p>
              <p className="font-mono text-[0.72rem] leading-relaxed text-[var(--fg-mute)]">
                {g.result}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Ecosystem interop">
        <ProseBlock className="mb-6 max-w-[42rem]">
          <p>
            Positioned to interoperate, not to reinvent. The classics above are the rigor;
            these are the adoption surfaces.
          </p>
        </ProseBlock>
        <div className="grid max-w-[52rem] gap-x-8 gap-y-4 sm:grid-cols-2">
          {INTEROP.map((s) => (
            <div key={s.name} className="border-b border-[var(--line-soft)] pb-4">
              <p className="label mb-1 text-[var(--fg-dim)]">{s.name}</p>
              <p className="text-sm leading-relaxed text-[var(--fg-mute)]">{s.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Honest scope">
        <ProseBlock className="max-w-[42rem]">
          <p>
            A receipt proves <strong>provenance, not truth</strong> — that the keyholder
            signed those exact bytes at that time, not that the underlying claim is
            universally true. The standard itself is real and rigorous: four independent
            verifiers agree byte-for-byte, the vectors are conformant, and the citations
            hold. Adoption is the open question — this page does not claim users or
            dominance, only that the substrate is built and citable today.
          </p>
        </ProseBlock>
      </Section>
    </div>
  );
}
