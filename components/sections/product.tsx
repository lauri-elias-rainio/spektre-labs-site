/**
 * ProductSection — σ-gate / /v1/guard trust-layer
 *
 * STYLE_LAW: OLED true-black + platinum metal axis + one cold signal (#cfe3ff).
 * Perfect bilateral symmetry (1=1). Industrial dark-luxury. Apple-grade restraint.
 * σ-honest copy — no fabricated metrics, customer counts, or revenue numbers.
 */
import { Reveal } from "@/components/reveal";

const PILLARS = [
  {
    id: "secrets",
    label: "Secret scan",
    copy: "Deterministic leaked-credential detection. No model dependency, no quota, no false-economy tradeoffs.",
  },
  {
    id: "injection",
    label: "Injection guard",
    copy: "Structural prompt-injection and jailbreak detection at the parse layer — before the model sees the input.",
  },
  {
    id: "pii",
    label: "PII compliance",
    copy: "Deterministic PII and compliance surface detection. Runs in-process, zero network round-trips.",
  },
  {
    id: "unified",
    label: "Unified /v1/guard",
    copy: "One call unifies all three dimensions. Deterministic result, no external dependencies at runtime.",
  },
] as const;

export function ProductSection() {
  return (
    <section className="spektre-stage relative -mx-6 overflow-hidden border-b border-white/10 px-6 py-24 sm:-mx-10 sm:px-10 sm:py-28 lg:-mx-14 lg:px-14 lg:py-36">
      <Reveal className="relative z-10 mx-auto max-w-5xl">
        {/* eyebrow */}
        <p className="spektre-label" style={{ color: "#cfe3ff" }}>
          “Trust Infrastructure” · 01
        </p>

        {/* heading */}
        <h2
          className="spektre-metal-text mt-6 max-w-2xl text-balance text-[2.6rem] leading-[1.02] tracking-[-0.02em] sm:text-[3.2rem] lg:text-[3.9rem]"
          style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
        >
          Deterministic trust layer.
          <br />
          No model. No quota.
        </h2>

        {/* sub */}
        <p className="mt-6 max-w-[38rem] text-[1.06rem] leading-[1.8] text-[#b6bac1]">
          σ-gate and /v1/guard give LLM pipelines a structural safety membrane:
          secret scan × injection guard × PII compliance — one deterministic call,
          zero external dependencies at runtime.
        </p>

        {/* pillar grid — 2×2 symmetric */}
        <div className="mt-14 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2">
          {PILLARS.map(({ id, label, copy }) => (
            <div
              key={id}
              className="bg-[#000000] p-8 transition-colors duration-300 hover:bg-white/[0.03]"
            >
              <p className="spektre-label" style={{ color: "#7d828b" }}>
                {label}
              </p>
              <p className="mt-4 text-[0.97rem] leading-[1.82] text-[#b6bac1]">
                {copy}
              </p>
            </div>
          ))}
        </div>

        {/* closing axiom */}
        <p
          className="spektre-label mt-12"
          style={{ color: "#4a4f58", textTransform: "none" }}
        >
          σ = DECLARED − REALIZED · PASS WHEN BOTH SIDES CONVERGE
        </p>
      </Reveal>
    </section>
  );
}
