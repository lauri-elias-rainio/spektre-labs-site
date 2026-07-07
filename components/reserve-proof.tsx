"use client";

/*
  ReserveProof — the definitive proof-of-reserve artifact.

  The reader's own browser queries two independent Bitcoin indexers and the
  Solana network directly. Nothing passes through Spektre servers, so there is
  nothing to take on trust: every number on screen comes straight from the chains.
*/

import { useState } from "react";

const RESERVE_ADDRESS = "bc1qea8hasdf3mls29lmmxexvjv32ks22uzkjlgde9";
const MINT = "AaRuUWZ3EozpwAmbPtFtkcxK1Q9JSSmkKSFivnwaopAv";

type CheckState =
  | { phase: "idle" }
  | { phase: "running" }
  | {
      phase: "done";
      mempoolSats: number | null;
      blockstreamSats: number | null;
      supply: number | null;
      errors: string[];
      timestamp: string;
    };

async function fetchIndexerSats(base: string): Promise<number> {
  const res = await fetch(`${base}/api/address/${RESERVE_ADDRESS}`);
  if (!res.ok) throw new Error(`${base} → HTTP ${res.status}`);
  const j = await res.json();
  return j.chain_stats.funded_txo_sum - j.chain_stats.spent_txo_sum;
}

const SOLANA_RPCS = [
  "https://solana-rpc.publicnode.com",
  "https://api.mainnet-beta.solana.com",
];

async function fetchSupply(): Promise<number> {
  let lastErr = "";
  for (const rpc of SOLANA_RPCS) {
    try {
      const res = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenSupply",
          params: [MINT],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      if (j.error) throw new Error(j.error.message);
      return Number(j.result.value.amount);
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(`Solana RPC → ${lastErr}`);
}

/* ── Copy-to-clipboard affordance ── */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable in this context — fail silently.
    }
  };
  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="label shrink-0 text-[var(--fg-faint)] hover:text-[var(--fg-mute)]"
      style={{ transition: "color 200ms var(--ease)" }}
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

/* ── Main component ── */
export function ReserveProof() {
  const [state, setState] = useState<CheckState>({ phase: "idle" });

  const run = async () => {
    setState({ phase: "running" });
    const errors: string[] = [];
    const grab = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        return await fn();
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
        return null;
      }
    };
    const [mempoolSats, blockstreamSats, supply] = await Promise.all([
      grab(() => fetchIndexerSats("https://mempool.space")),
      grab(() => fetchIndexerSats("https://blockstream.info")),
      grab(fetchSupply),
    ]);
    const d = new Date();
    const timestamp = `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 19)} UTC`;
    setState({ phase: "done", mempoolSats, blockstreamSats, supply, errors, timestamp });
  };

  const rows =
    state.phase === "done"
      ? [
          { label: "BTC reserve", source: "mempool.space", value: state.mempoolSats, unit: "sats" },
          { label: "BTC reserve", source: "blockstream.info", value: state.blockstreamSats, unit: "sats" },
          { label: "Token supply", source: "Solana mainnet", value: state.supply, unit: "SPEKTRE" },
        ]
      : [];

  const verdict = (() => {
    if (state.phase !== "done") return null;
    const { mempoolSats, blockstreamSats, supply } = state;
    if (mempoolSats == null || blockstreamSats == null || supply == null)
      return {
        pass: false,
        line: "Could not reach every source from this browser — open the manual links below and check by hand.",
      };
    const agree = mempoolSats === blockstreamSats;
    const covered = mempoolSats >= supply;
    if (agree && covered)
      return {
        pass: true,
        line: `Both indexers agree: ${mempoolSats.toLocaleString()} sats. Reserve covers supply. The balance claim holds.`,
      };
    return {
      pass: false,
      line: agree
        ? `Reserve ${mempoolSats.toLocaleString()} sats does not cover supply ${supply.toLocaleString()}.`
        : "The two indexers disagree — do not trust either number until they converge.",
    };
  })();

  return (
    <div className="surface overflow-hidden rounded-[var(--radius)]">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-6 sm:p-8">
        <div>
          <p className="label text-[var(--fg-faint)]">Reserve proof · live query · no proxy</p>
          <p className="mt-2 max-w-[38rem] text-[0.95rem] leading-[1.7] text-[var(--fg-dim)]">
            Your browser queries two independent Bitcoin indexers and Solana
            directly. No Spektre server sits between you and the chains.
          </p>
        </div>
        <button
          onClick={run}
          disabled={state.phase === "running"}
          className="btn-metal shrink-0 rounded-[10px] px-6 py-3 text-[0.9rem] font-semibold tracking-tight disabled:opacity-60"
        >
          {state.phase === "running" ? "Checking…" : "Verify now"}
        </button>
      </div>

      {/* ── Addresses — always visible, always copyable ── */}
      <div className="grid gap-px border-b border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
        <div className="bg-[var(--bg-1)] px-6 py-4 sm:px-8">
          <p className="label mb-2 text-[var(--fg-faint)]">BTC reserve address</p>
          <div className="flex items-center gap-3">
            <span className="min-w-0 break-all font-mono text-[0.74rem] leading-snug text-[var(--fg-dim)]">
              {RESERVE_ADDRESS}
            </span>
            <CopyButton value={RESERVE_ADDRESS} />
          </div>
        </div>
        <div className="bg-[var(--bg-1)] px-6 py-4 sm:px-8">
          <p className="label mb-2 text-[var(--fg-faint)]">Solana mint</p>
          <div className="flex items-center gap-3">
            <span className="min-w-0 break-all font-mono text-[0.74rem] leading-snug text-[var(--fg-dim)]">
              {MINT}
            </span>
            <CopyButton value={MINT} />
          </div>
        </div>
      </div>

      {/* ── Results / idle ── */}
      {state.phase === "done" ? (
        <div>

          {/* Timestamp coordinate */}
          <div className="border-b border-[var(--line-soft)] px-6 py-3 sm:px-8">
            <p className="label text-[var(--fg-faint)]">Queried · {state.timestamp}</p>
          </div>

          {/* Mono data table */}
          {rows.map((row) => (
            <div
              key={row.source}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 border-b border-[var(--line-soft)] px-6 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:px-8"
            >
              <span className="label text-[var(--fg-mute)]">{row.label}</span>
              <span className="label hidden text-[var(--fg-faint)] sm:block">{row.source}</span>
              <span className="font-mono text-[0.95rem] tabular-nums text-[var(--fg)]">
                {row.value == null ? (
                  <span className="text-[var(--fg-faint)]">unreachable</span>
                ) : (
                  `${row.value.toLocaleString()} ${row.unit}`
                )}
              </span>
            </div>
          ))}

          {/* Verdict — the signal moment */}
          {verdict?.pass ? (
            <div
              className="flex items-start gap-6 px-6 py-6 sm:px-8"
              style={{
                borderTop: "1px solid var(--line-soft)",
                borderLeft: "2px solid var(--signal)",
                boxShadow: "-6px 0 24px -8px var(--signal-glow)",
              }}
            >
              <span
                className="label shrink-0 tracking-[0.28em]"
                style={{ color: "var(--signal)" }}
              >
                σ — PASS
              </span>
              <span className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)]">
                {verdict.line}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-6 border-t border-[var(--line-soft)] px-6 py-6 sm:px-8">
              <span className="label shrink-0 text-[var(--fg-mute)]">FAIL</span>
              <span className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)]">
                {verdict?.line}
              </span>
            </div>
          )}

          {state.errors.length > 0 && (
            <p className="border-t border-[var(--line-soft)] px-6 py-4 font-mono text-[0.75rem] text-[var(--fg-faint)] sm:px-8">
              {state.errors.join(" · ")}
            </p>
          )}
        </div>
      ) : (
        <div className="px-6 py-5 sm:px-8">
          <p className="text-[0.92rem] leading-[1.75] text-[var(--fg-mute)]">
            Or verify by hand — three sources, any browser, no account:{" "}
            <a
              className="underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--fg)]"
              href={`https://mempool.space/address/${RESERVE_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              mempool.space
            </a>
            {" · "}
            <a
              className="underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--fg)]"
              href={`https://blockstream.info/address/${RESERVE_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              blockstream.info
            </a>
            {" · "}
            <a
              className="underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--fg)]"
              href={`https://solscan.io/token/${MINT}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              solscan.io
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
