"use client";

import { useEffect, useState } from "react";

import {
  GENESIS_CLAIM,
  GENESIS_TOKEN,
  sha256Hex,
  verifyReceipt,
  type VerifyResult,
} from "@/lib/receipt";

function Row({ k, v, mono = true }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-2 sm:grid-cols-[9rem_1fr]">
      <span className="label text-[var(--fg-faint)]">{k}</span>
      <span
        className={`break-all text-[0.8rem] leading-relaxed text-[var(--fg-dim)] ${mono ? "font-mono" : ""}`}
      >
        {v}
      </span>
    </div>
  );
}

export function ReceiptVerifier() {
  const [token, setToken] = useState(GENESIS_TOKEN);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [claimHashMatch, setClaimHashMatch] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    setResult(null);
    setClaimHashMatch(null);
    verifyReceipt(token).then(async (r) => {
      if (!live) return;
      setResult(r);
      if (r.state === "valid" && token.trim() === GENESIS_TOKEN) {
        const h = await sha256Hex(GENESIS_CLAIM);
        if (live) setClaimHashMatch(h === r.payload.claim_sha256);
      }
    });
    return () => {
      live = false;
    };
  }, [token]);

  const valid = result?.state === "valid";
  const payload = result?.state === "valid" ? result.payload : null;

  return (
    <div className="surface rounded-[var(--radius)] p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="label text-[var(--fg-mute)]">Live · verified in your browser</p>
        <p className="label text-[var(--fg-faint)]">
          ed25519 · WebCrypto · no server · no account
        </p>
      </div>

      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        spellCheck={false}
        rows={5}
        aria-label="sigma-attest token"
        className="w-full resize-none rounded-[10px] border border-[var(--line)] bg-[var(--bg-1)] p-4 font-mono text-[0.72rem] leading-relaxed text-[var(--fg-dim)] outline-none transition-colors duration-300 focus:border-[var(--line-strong)]"
      />
      {token.trim() !== GENESIS_TOKEN && (
        <button
          type="button"
          onClick={() => setToken(GENESIS_TOKEN)}
          className="label mt-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-[0.6rem] text-[var(--fg-mute)] transition-colors duration-300 hover:border-[var(--line-strong)] hover:text-[var(--fg)]"
        >
          restore the genesis receipt
        </button>
      )}

      <div className="mt-5 flex items-center gap-4 border-t border-[var(--line-soft)] pt-5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border"
          style={{ borderColor: valid ? "var(--metal-3)" : "var(--signal)" }}
          aria-hidden
        >
          <span
            className="text-[1.1rem] leading-none"
            style={{ color: valid ? "var(--metal-1)" : "var(--signal)" }}
          >
            {result === null ? "·" : valid ? "✓" : "⊘"}
          </span>
        </span>
        <div>
          <p
            className="text-[1.05rem] font-semibold tracking-tight"
            style={{ color: valid ? "var(--fg)" : "var(--signal)" }}
          >
            {result === null
              ? "VERIFYING"
              : result.state === "valid"
                ? "SIGNATURE VALID"
                : result.state === "unsupported"
                  ? "BROWSER UNSUPPORTED"
                  : "INVALID"}
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-relaxed text-[var(--fg-mute)]">
            {result === null
              ? "importing the key that travels inside the token…"
              : result.state === "valid"
                ? "the ed25519 signature verifies against the public key embedded in the token itself"
                : result.reason}
          </p>
        </div>
      </div>

      {payload && (
        <div className="mt-5 border-t border-[var(--line-soft)] pt-4">
          <Row k="sigma" v={`${payload.sigma} — declared minus realized (0 means the two are identical)`} mono={false} />
          <Row k="verdict" v={`${payload.verdict} (gate ${payload.gate})`} />
          <Row k="kind" v={payload.kind} />
          <Row k="claim sha256" v={payload.claim_sha256} />
          <Row k="realized sha256" v={payload.realized_sha256} />
          <Row k="attester" v={payload.attester} />
          <Row k="minted" v={payload.ts} />
          <Row k="scope" v={payload.note} mono={false} />
          {claimHashMatch !== null && (
            <Row
              k="claim binding"
              v={
                claimHashMatch
                  ? "sha256 of the published claim text recomputed here equals claim_sha256 — the words below are the signed bytes"
                  : "published claim text does NOT hash to claim_sha256"
              }
              mono={false}
            />
          )}
        </div>
      )}
    </div>
  );
}
