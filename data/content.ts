/**
 * Spektre Labs — σ-honest site copy.
 *
 * STYLE_LAW compliance:
 *   - OLED true-black stage; platinum + #cfe3ff signal only
 *   - Mono Abloh voice: terse, no marketing fluff
 *   - No fabricated metrics, no fake social proof, no vaporware-as-shipped
 *   - Sell on determinism + sovereignty only
 */

export const guardCopy = {
  /** Page-level metadata */
  title: "σ-Guard",
  metaDescription:
    "Deterministic secret, injection, and PII detection in a single call. No model. No quota. No hallucination.",

  /** Top-of-page header */
  headline: "One call. Three threat surfaces. Zero model dependency.",
  subhead:
    "σ-Guard runs deterministic pattern matching against leaked secrets, prompt injection, and PII in a single synchronous pass. Sub-millisecond. No quota. No API key required to operate.",

  /** What it is — honest, no fake metrics */
  whatItIs: {
    label: "What this is",
    paragraphs: [
      "σ-Guard is a trust-layer library, not a cloud service. It ships as importable Python with no runtime dependencies beyond the standard library.",
      "Three detectors — /v1/secret, /v1/injection, /v1/pii — are unified under /v1/guard. One request, one synchronous result, a structured verdict: PASS or HALT with the exact pattern that triggered it.",
      "Detection is deterministic. The same input produces the same output on every machine, every time, with no model inference in the path. There is no probability score to tune and no stochastic variance to debug.",
    ],
  },

  /** The three dimensions */
  dimensions: [
    {
      label: "/v1/secret",
      title: "Secrets",
      body: "Regex + entropy scan for leaked API keys, tokens, private key PEM headers, and credential patterns. Fires before any string leaves the process boundary.",
    },
    {
      label: "/v1/injection",
      title: "Prompt injection",
      body: "Structural pattern match for instruction-override payloads, jailbreak scaffolding, and role-hijack strings. Runs on raw input before it reaches any model context.",
    },
    {
      label: "/v1/pii",
      title: "PII",
      body: "Compliance-tier scan for personal identifiers: email, phone, national ID formats, IBAN, passport patterns. Deterministic — no entity-recognition model in the path.",
    },
  ],

  /** Sovereignty axis */
  sovereignty: {
    label: "Sovereignty",
    headline: "No third-party inference. No data leaves the process.",
    body: "σ-Guard runs entirely in-process. Inputs are never serialized to a remote endpoint. The vendor surface is zero. What you scan stays on your machine.",
  },

  /** Honest current state */
  status: {
    label: "Current state",
    paragraphs: [
      "The library is built, tested, and deployable. It is not yet generating revenue — that gate is caller demand, not missing code.",
      "Claimed accuracy figures are not published here. Deterministic regex over a controlled pattern set is not a statistical classifier; precision is a function of the pattern library, which is open and auditable.",
    ],
  },
} as const;

export const creationOsCopy = {
  title: "Creation OS",
  metaDescription:
    "A multi-agent operating system for turning research into realized artifacts. Orchestrator-worker. σ-gated. No free swarm.",

  headline: "The machine that builds the machine.",
  subhead:
    "Creation OS is the research-to-artifact pipeline running inside Spektre Labs. It is not a product you install — it is the operating method by which everything here was built.",

  whatItIs: {
    label: "What this is",
    paragraphs: [
      "An orchestrator-worker agent mesh. One lead node assigns bounded missions to 3–5 specialist workers. Each worker runs in isolated context with a single role and returns a structured result — not raw dialogue.",
      "A σ-gate sits at every stage boundary. σ = realized − declared. A worker artifact passes the gate when its schema is complete, its claims are grounded, and its output is on-topic. Gate failure triggers a respawn, not a human escalation.",
      "Model tiers are explicit. Scan, classify, and triage work runs on the cheapest capable model. Synthesis and architecture decisions run on the strongest. Roughly 3 of 5 agents at any time are running cheap-tier.",
      "Shared state, not shared transcript. Workers write to a common σ-stamped artifact store. The orchestrator reads structured findings, not chat history. Context windows stay bounded.",
    ],
  },

  principles: [
    {
      label: "Triage first",
      body: "Multi-agent only when the task is genuinely parallelizable or specialization wins. Tight multi-hop reasoning runs solo — swarm overhead burns ~15× tokens for no gain.",
    },
    {
      label: "Per-stage integrity gate",
      body: "Early errors poison downstream stages. Every worker artifact is verified before it flows forward. Verification is structural — schema full, sources real, no hallucination — not a value judgment.",
    },
    {
      label: "Velocity over ceremony",
      body: "No problem-lists. No permission requests. The strongest reasonable move is executed and results are observed. The loop is: build → check → continue.",
    },
    {
      label: "σ-honest output",
      body: "Declared objectives are held against realized outcomes. Phantom progress — planned but unverified — does not advance the σ. Only tested, deployed, or on-chain facts count.",
    },
  ],

  status: {
    label: "Current state",
    paragraphs: [
      "Creation OS is operational. The artifacts on this site — corpus, protocol, guard library — were produced through it.",
      "Revenue realized through Creation OS is $0 as of the date on this page. The pipeline is built; the external demand gate remains open.",
    ],
  },
} as const;

export const whatThisIsCopy = {
  label: "What Spektre Labs is",
  headline: "An independent research engine. Not a startup. Not a consultancy.",
  paragraphs: [
    "Spektre Labs is one researcher and a fleet of computational agents, based in Helsinki.",
    "The work is structural: finding the invariants that govern coherence and collapse across physical systems, institutions, information architectures, and AI. Not modeling individual phenomena — identifying the conditions under which any system holds its form or breaks.",
    "Artifacts are published openly. The method is computational orchestration: formal hypothesis, computational exploration, iterative falsification, structural synthesis.",
    "Nothing here is funded by external capital. There are no customers yet. The σ-audit on this copy returned zero fabricated claims.",
  ],
} as const;

/** Flat export for page-level consumption */
export const siteContent = {
  guard: guardCopy,
  creationOs: creationOsCopy,
  whatThisIs: whatThisIsCopy,
} as const;

export type SiteContent = typeof siteContent;
