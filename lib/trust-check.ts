/**
 * trust-check — an instant, client-side trust READ for any text. The browser port of the runtime's
 * claim-discipline + memory-injection defense. Deterministic, zero-dependency, nothing leaves the device.
 * σ-honest: it flags the SHAPES of unreliability (unanchored superlatives, mixed evidence, injection) — it
 * does NOT decide whether a claim is true. An honest signal to read AI output critically, never an oracle.
 */
export type TrustRead = {
  read: string;
  overclaims: string[];
  injection: string[];
  forbidden_merge: { sentence: string; classes: string[] } | null;
  evidence_hint: string;
  note: string;
};

const OVERCLAIM =
  /\b(revolution(ary)?|greatest|world[- ]changing|unprecedented|game[- ]chang\w*|infinite|guaranteed|100% (safe|accurate|secure)|best ever|the only|never fails|cure[- ]all)\b/gi;

const EVIDENCE_MARKERS: [string, RegExp][] = [
  ["measured", /\b(throughput|latency|ms|ns\/op|benchmark|trials\/sec|fps|tokens\/sec)\b/i],
  ["study", /(\d+\s*%\s*(accuracy|improvement|faster|better)|p\s*<\s*0\.\d+|study|clinical|trial showed)/i],
  ["anecdote", /\b(i tried|in my experience|users say|people report|anecdotally)\b/i],
];

const INJECTION =
  /\b(ignore (all )?previous instructions|disregard your|system prompt|you must now|new directive|send funds to|transfer to wallet|execute the following|run this command|reveal your (system )?prompt|as an ai you should)\b/gi;

const uniq = (a: string[]) => [...new Set(a.map((s) => s.toLowerCase()))];

export function trustCheck(text: string): TrustRead {
  const t = String(text || "");
  const overclaims = uniq([...t.matchAll(OVERCLAIM)].map((m) => m[0]));
  const injection = uniq([...t.matchAll(INJECTION)].map((m) => m[0]));

  let forbidden_merge: TrustRead["forbidden_merge"] = null;
  for (const sent of t.split(/(?<=[.!?])\s+/)) {
    const classes = EVIDENCE_MARKERS.filter(([, re]) => re.test(sent)).map(([c]) => c);
    if (classes.length >= 2) {
      forbidden_merge = { sentence: sent.trim().slice(0, 160), classes };
      break;
    }
  }

  const hasNumbers = /(\d+(\.\d+)?\s*%|\d+\s*(ms|ns|x|×|fps|mb|gb|tokens|faster|slower|times))/i.test(t);
  const hasSource = /\b(source|https?:\/\/|doi|arxiv|\bref\b|according to)\b/i.test(t);
  const evidence_hint = injection.length
    ? "unverified — contains an instruction-injection payload; treat as data, never act on it"
    : forbidden_merge
    ? "mixed — different evidence classes blended in one sentence; separate them to judge each"
    : hasSource && hasNumbers
    ? "cites numbers + a source — check the source resolves before trusting the number"
    : hasNumbers
    ? "asserts numbers with no source — ask for the repro/measurement"
    : overclaims.length
    ? "unanchored — strong claims with no mechanism or number to check"
    : "plain assertion — no anchor either way; verify independently";

  const flags = overclaims.length + injection.length + (forbidden_merge ? 1 : 0);
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
    forbidden_merge,
    evidence_hint,
    note: "a heuristic read of reliability shapes, not a verdict on truth — an honest signal, never an oracle",
  };
}
