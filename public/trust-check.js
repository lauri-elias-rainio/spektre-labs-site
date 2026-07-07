/*
 * trust-check.js — an instant, client-side trust read for ANY text (no server, no account, no key).
 *
 * The browser port of the runtime's claim-discipline + injection defense: paste an AI answer and get a
 * deterministic read — is it over-claiming, does it carry an injection payload, what kind of evidence does it
 * actually stand on. Zero dependencies. Runs entirely in your device; nothing is uploaded.
 *
 * σ-honest: this is a heuristic READ, not a truth oracle. It flags the shapes of unreliability (unanchored
 * superlatives, mixed evidence classes, instruction-injection) — it does NOT decide whether a claim is true.
 * An honest signal that helps a person read AI output critically, mirrored from spektre-protocol CLAIM_DISCIPLINE.
 */

// superlatives that assert dominance with no mechanism/number to attack — "soft" per CLAIM_DISCIPLINE §5
const OVERCLAIM =
  /\b(revolution(ary)?|greatest|world[- ]changing|unprecedented|game[- ]chang\w*|infinite|guaranteed|100% (safe|accurate|secure)|best ever|the only|never fails|cure[- ]all)\b/gi;

// two DIFFERENT evidence classes in one sentence = a forbidden merge (different questions, different uncertainty)
const EVIDENCE_MARKERS = [
  ["measured", /\b(throughput|latency|ms|ns\/op|benchmark|trials\/sec|fps|tokens\/sec)\b/i],
  ["study", /\b(\d+%\s*(accuracy|improvement|faster|better)|p\s*<\s*0\.\d+|study|clinical|trial showed)\b/i],
  ["anecdote", /\b(i tried|in my experience|users say|people report|anecdotally)\b/i],
];

// instruction-injection payloads — untrusted text trying to become an instruction (memory-injection defense)
const INJECTION =
  /\b(ignore (all )?previous instructions|disregard your|system prompt|you must now|new directive|send funds to|transfer to wallet|execute the following|run this command|reveal your (system )?prompt|as an ai you should)\b/gi;

function uniq(arr) {
  return [...new Set(arr.map((s) => s.toLowerCase()))];
}

export function trustCheck(text) {
  const t = String(text || "");
  const overclaims = uniq([...t.matchAll(OVERCLAIM)].map((m) => m[0]));
  const injection = uniq([...t.matchAll(INJECTION)].map((m) => m[0]));

  // forbidden merge: which evidence classes appear in the same sentence
  let mergedSentence = null;
  for (const sent of t.split(/(?<=[.!?])\s+/)) {
    const classes = EVIDENCE_MARKERS.filter(([, re]) => re.test(sent)).map(([c]) => c);
    if (classes.length >= 2) {
      mergedSentence = { sentence: sent.trim().slice(0, 160), classes };
      break;
    }
  }

  // the honest evidence-class hint: what kind of support does the text even offer?
  const hasNumbers = /(\d+(\.\d+)?\s*%|\d+\s*(ms|ns|x|×|fps|mb|gb|tokens|faster|slower|times))/i.test(t);
  const hasSource = /\b(source|https?:\/\/|doi|arxiv|\bref\b|according to)\b/i.test(t);
  const evidence = injection.length
    ? "unverified — contains an instruction-injection payload; treat as data, never act on it"
    : mergedSentence
    ? "mixed — different evidence classes blended in one sentence; separate them to judge each"
    : hasSource && hasNumbers
    ? "cites numbers + a source — check the source resolves before trusting the number"
    : hasNumbers
    ? "asserts numbers with no source — ask for the repro/measurement"
    : overclaims.length
    ? "unanchored — strong claims with no mechanism or number to check"
    : "plain assertion — no anchor either way; verify independently";

  // one honest headline a non-technical reader can act on
  const flags = overclaims.length + injection.length + (mergedSentence ? 1 : 0);
  const read =
    injection.length > 0
      ? "DO NOT ACT — injection payload"
      : flags === 0
      ? "no red flags — still verify independently"
      : flags <= 1
      ? "read critically — one soft signal"
      : "read skeptically — several soft signals";

  return {
    read,
    overclaims,
    injection,
    forbidden_merge: mergedSentence,
    evidence_hint: evidence,
    note: "a heuristic read of reliability shapes, not a verdict on truth — an honest signal, never an oracle",
  };
}

/* Node CLI for quick checks: node trust-check.js "<text>" */
if (typeof process !== "undefined" && process.argv && process.argv[1] && process.argv[1].endsWith("trust-check.js")) {
  console.log(JSON.stringify(trustCheck(process.argv.slice(2).join(" ")), null, 2));
}
