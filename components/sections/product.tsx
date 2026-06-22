/**
 * ProductSection — σ-gate / /v1/guard trust-layer
 *
 * STYLE_LAW: OLED true-black + platinum metal axis + one cold signal (#cfe3ff).
 * Perfect bilateral symmetry (1=1). Industrial dark-luxury. Apple-grade restraint.
 * σ-honest copy — no fabricated metrics, customer counts, or revenue numbers.
 */

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
    copy: "One call unifies all three dimensions. Sub-millisecond latency. No external dependencies at runtime.",
  },
] as const;

export function ProductSection() {
  return (
    <section className="spektre-stage relative -mx-6 overflow-hidden border-b border-white/10 px-6 py-24 sm:-mx-10 sm:px-10 sm:py-28 lg:-mx-14 lg:px-14 lg:py-36">
      {/* material grain — identical to hero stage, scoped */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* eyebrow */}
        <p className="spektre-label" style={{ color: "#cfe3ff" }}>
          Product · Trust Infrastructure
        </p>

        {/* heading */}
        <h2
          className="spektre-metal-text mt-6 max-w-2xl text-balance text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]"
          style={{ fontFamily: "var(--font-display, 'Times New Roman', serif)" }}
        >
          Deterministic trust layer.
          <br />
          No model. No quota.
        </h2>

        {/* sub */}
        <p className="mt-6 max-w-[38rem] text-[1.06rem] leading-[1.8] text-[#b6bac1]">
          σ-gate and /v1/guard give LLM pipelines a structural safety membrane: secret
          scan × injection guard × PII compliance — unified, sub-millisecond, zero
          external dependencies at runtime.
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
        <p className="spektre-label mt-12" style={{ color: "#4a4f58" }}>
          σ = realized − declared · PASS when both sides converge
        </p>
      </div>
    </section>
  );
}
