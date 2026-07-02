/**
 * CapabilitiesSection — what the lab builds and ships
 *
 * STYLE_LAW: OLED true-black + platinum + one cold signal (#cfe3ff).
 * Perfect bilateral symmetry (1=1). Apple-grade restraint. σ-honest copy.
 * No fabricated metrics, customer counts, or revenue numbers.
 */
import { Reveal } from "@/components/reveal";

const CAPABILITIES = [
  {
    id: "trust-layer",
    domain: "Trust infrastructure",
    name: "σ-gate · /v1/guard",
    copy: "Deterministic secret / injection / PII membrane for LLM pipelines. Zero model dependency at runtime. Ships as a single deployable package.",
  },
  {
    id: "ci-audit",
    domain: "Supply-chain security",
    name: "CI audit",
    copy: "GitHub Actions supply-chain auditor with false-positive filtering. Deterministic severity ranking. Payable via x402 direct-to-wallet.",
  },
  {
    id: "fleet",
    domain: "Agent orchestration",
    name: "Creation OS fleet",
    copy: "Multi-cloud orchestrator-worker swarm with per-stage integrity gates. σ-gated shared state across five specialized nodes.",
  },
  {
    id: "research",
    domain: "Research engine",
    name: "arXiv → insight pipeline",
    copy: "Token-efficient scanner: stdlib fetch · local parse · cheap-model distillation. Output is actionable insight, never raw API dumps.",
  },
  {
    id: "reclaim",
    domain: "On-chain tooling",
    name: "SPL rent reclaim",
    copy: "Executable scanner that surfaces dormant SPL account rent. Read-only verify first; close-tx is the realization step.",
  },
  {
    id: "stdlib",
    domain: "Durability engineering",
    name: "Transaction monitor",
    copy: "WAL + saga + crash-recovery transaction monitor built on stdlib. Zero framework dependencies.",
  },
] as const;

export function CapabilitiesSection() {
  return (
    <section className="spektre-stage relative -mx-6 overflow-hidden border-b border-white/10 px-6 py-24 sm:-mx-10 sm:px-10 sm:py-28 lg:-mx-14 lg:px-14 lg:py-36">
      <Reveal className="relative z-10 mx-auto max-w-5xl">
        {/* eyebrow */}
        <p className="spektre-label" style={{ color: "#cfe3ff" }}>
          “Capabilities” · 03
        </p>

        {/* heading — centered bilateral axis */}
        <h2
          className="spektre-metal-text mt-6 max-w-xl text-balance text-[2.6rem] leading-[1.02] tracking-[-0.02em] sm:text-[3.2rem] lg:text-[3.9rem]"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
        >
          Built. Tested.
          <br />
          Deployable.
        </h2>

        <p className="mt-6 max-w-[36rem] text-[1.06rem] leading-[1.8] text-[#b6bac1]">
          Every capability listed here is a shipped, test-covered artifact — not
          a roadmap item. σ-honesty: realized = what compiles and runs.
        </p>

        {/* 3-column grid on large, 2 on sm, 1 on mobile */}
        <div className="mt-14 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ id, domain, name, copy }) => (
            <div
              key={id}
              className="bg-[#000000] p-7 transition-colors duration-300 hover:bg-white/[0.03]"
            >
              <p className="spektre-label" style={{ color: "#4a4f58" }}>
                {domain}
              </p>
              <p
                className="mt-3 text-[1.04rem] font-medium tracking-[-0.01em]"
                style={{ color: "#e8eaee" }}
              >
                {name}
              </p>
              <p className="mt-3 text-[0.93rem] leading-[1.82] text-[#888d97]">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
