"use client";

/*
  ReserveProof — live, in-browser proof-of-reserve check.

  The reader's own browser queries two independent Bitcoin indexers and the
  Solana network directly. Nothing passes through Spektre servers, so there is
  nothing to take on trust: the numbers on screen come from the chains.
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
    setState({ phase: "done", mempoolSats, blockstreamSats, supply, errors });
  };

  const rows =
    state.phase === "done"
      ? [
          {
            label: "Bitcoin reserve · mempool.space",
            value: state.mempoolSats,
            unit: "sats",
          },
          {
            label: "Bitcoin reserve · blockstream.info",
            value: state.blockstreamSats,
            unit: "sats",
          },
          {
            label: "Token supply · Solana mainnet",
            value: state.supply,
            unit: "SPEKTRE",
          },
        ]
      : [];

  const verdict = (() => {
    if (state.phase !== "done") return null;
    const { mempoolSats, blockstreamSats, supply } = state;
    if (mempoolSats == null || blockstreamSats == null || supply == null)
      return {
        pass: false,
        line: "Could not reach every source from this browser — open the links below and check by hand.",
      };
    const agree = mempoolSats === blockstreamSats;
    const covered = mempoolSats >= supply;
    if (agree && covered)
      return {
        pass: true,
        line: `Both indexers agree on ${mempoolSats.toLocaleString()} sats, and reserve ≥ supply. The balance claim holds.`,
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-6 sm:p-8">
        <div>
          <p className="label text-[var(--fg-faint)]">Live check · Your browser → the chains</p>
          <p className="mt-2 text-[0.95rem] leading-[1.7] text-[var(--fg-dim)]">
            Your browser queries two independent Bitcoin indexers and Solana
            directly. No Spektre server sits in between.
          </p>
        </div>
        <button
          onClick={run}
          disabled={state.phase === "running"}
          className="btn-metal rounded-[10px] px-6 py-3 text-[0.9rem] font-semibold tracking-tight disabled:opacity-60"
        >
          {state.phase === "running" ? "Checking…" : "Verify now"}
        </button>
      </div>

      {state.phase === "done" ? (
        <div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-6 border-b border-[var(--line-soft)] px-6 py-4 sm:px-8"
            >
              <span className="label">{row.label}</span>
              <span className="font-mono text-[1rem] tabular-nums text-[var(--fg)]">
                {row.value == null ? "unreachable" : `${row.value.toLocaleString()} ${row.unit}`}
              </span>
            </div>
          ))}
          <div className="flex items-baseline gap-4 px-6 py-5 sm:px-8">
            <span
              className={`label ${verdict?.pass ? "text-[var(--signal)]" : "text-[var(--fg)]"}`}
            >
              {verdict?.pass ? "PASS" : "CHECK FAILED"}
            </span>
            <span className="text-[0.92rem] leading-[1.7] text-[var(--fg-dim)]">
              {verdict?.line}
            </span>
          </div>
          {state.errors.length > 0 ? (
            <p className="border-t border-[var(--line-soft)] px-6 py-4 font-mono text-[0.75rem] text-[var(--fg-faint)] sm:px-8">
              {state.errors.join(" · ")}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="px-6 py-5 sm:px-8">
          <p className="text-[0.92rem] leading-[1.75] text-[var(--fg-mute)]">
            Or check by hand — the same three sources, in any browser, no
            account:{" "}
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
