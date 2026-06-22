/**
 * ParadigmSection — Creation OS · sovereign multi-cloud agent fleet
 *
 * STYLE_LAW: OLED true-black + platinum + one cold signal (#cfe3ff).
 * Perfect bilateral symmetry (1=1). Industrial dark-luxury × Atlantean cybernetics.
 * Apple-grade restraint. σ-honest — no fabricated deployment counts or uptime figures.
 */

const NODES = [
  { id: "orchestrator", label: "Orchestrator", copy: "Triage · task decomposition · worker integration. Inherits the strongest available model." },
  { id: "solver",       label: "Paradigm solver", copy: "Builds and ships. Does not critique. One role, full velocity." },
  { id: "scout",        label: "arXiv / web scout", copy: "Fan-out research on cheap inference. Distills findings — never raw dumps." },
  { id: "synthesizer",  label: "Synthesizer", copy: "Scout output → one committed build path. Sonnet tier. Structural, not editorial." },
  { id: "gate",         label: "Stage gate", copy: "Per-stage integrity check: schema full · on-topic · sources present · no poisoning. Haiku tier." },
  { id: "jarvis",       label: "Jarvis meta-agent", copy: "Proactive observe → decide → act loop. Outward actions are human-gated." },
] as const;

export function ParadigmSection() {
  return (
    <section className="spektre-stage relative -mx-6 overflow-hidden border-b border-white/10 px-6 py-24 sm:-mx-10 sm:px-10 sm:py-28 lg:-mx-14 lg:px-14 lg:py-36">
      {/* material grain */}
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
          Paradigm · Creation OS
        </p>

        {/* heading */}
        <h2
          className="spektre-metal-text mt-6 max-w-2xl text-balance text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.6rem]"
          style={{ fontFamily: "var(--font-display, 'Times New Roman', serif)" }}
        >
          Sovereign multi-cloud
          <br />
          agent fleet.
        </h2>

        {/* sub */}
        <p className="mt-6 max-w-[38rem] text-[1.06rem] leading-[1.8] text-[#b6bac1]">
          Creation OS is a local JARVIS: MCP tools + A2A agents + gateway models.
          Five specialized nodes share a single σ-gated state space. No private
          memory — every artifact is declared and realized against the same ledger.
        </p>

        {/* architecture spine — vertical hairline + node cards */}
        <div className="mt-14 flex flex-col gap-px border-l border-white/10 pl-8 sm:pl-12">
          {NODES.map(({ id, label, copy }, i) => (
            <div
              key={id}
              className="relative py-7 transition-colors duration-300 hover:bg-white/[0.02]"
            >
              {/* hairline tick on the spine */}
              <div
                aria-hidden
                className="absolute -left-8 top-[2.1rem] h-px w-6 bg-white/20 sm:-left-12 sm:w-8"
              />
              <p className="spektre-label" style={{ color: i === 0 ? "#cfe3ff" : "#7d828b" }}>
                {String(i + 1).padStart(2, "0")} · {label}
              </p>
              <p className="mt-3 max-w-[42rem] text-[0.97rem] leading-[1.82] text-[#b6bac1]">
                {copy}
              </p>
            </div>
          ))}
        </div>

        {/* doctrine line */}
        <p className="spektre-label mt-12" style={{ color: "#4a4f58" }}>
          Orchestrator-worker · 3–5 workers · σ-gate per stage · no free swarm
        </p>
      </div>
    </section>
  );
}
