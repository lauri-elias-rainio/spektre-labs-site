/**
 * sigma-attest receipt verification — entirely client-side.
 *
 * Token shape: base64url(canonical_json(payload)) + "." + base64url(ed25519_sig)
 * The signature covers the exact decoded bytes of the first segment, and the
 * attester public key travels inside the payload — so verification needs no
 * server, no shared secret, and no account. WebCrypto Ed25519 does the check.
 */

export type ReceiptPayload = {
  attester: string; // ed25519 public key, hex (32 bytes)
  claim_sha256: string;
  realized_sha256: string;
  sigma: number;
  gate: number;
  verdict: string;
  kind: string;
  note: string;
  ts: string;
  typ: string;
  v: number;
};

export type VerifyResult =
  | { state: "valid"; payload: ReceiptPayload; engine: "webcrypto" }
  | { state: "invalid"; reason: string }
  | { state: "unsupported"; reason: string };

/** A real receipt, minted 2026-07-04. Its claim is exactly what this page does:
 *  it verifies in your browser against the key inside it, with no server consulted. */
export const GENESIS_TOKEN =
  "eyJhdHRlc3RlciI6Ijc0YTkzZTkyNTZlOGE1ZjUyOTNhNDU1NGE0ZTQ2OTBiYjEzNzdhMTNiMzZkOTBhZDkzN2Q3MGFiYjA4OGYyMjciLCJjbGFpbV9zaGEyNTYiOiJhZDY0ZjJhY2QzZTI3OTMyZmQ5ZjVlMDA4ZWY0OTZiMTNkNTRlN2MyNjZiZjc3YzQ4MjM2NjI2NmI4MzkxMjc1IiwiZ2F0ZSI6MC4zNCwia2luZCI6ImdlbmVzaXNfcmVjZWlwdCIsIm5vdGUiOiJhdHRlc3RzIGEgZGVjbGFyZWQ9PXJlYWxpemVkIENIRUNLIG92ZXIgdGhlc2UgYnl0ZS1oYXNoZXMg4oCUIE5PVCBhYnNvbHV0ZSB0cnV0aCBvZiB0aGUgY2xhaW0iLCJyZWFsaXplZF9zaGEyNTYiOiJhZDY0ZjJhY2QzZTI3OTMyZmQ5ZjVlMDA4ZWY0OTZiMTNkNTRlN2MyNjZiZjc3YzQ4MjM2NjI2NmI4MzkxMjc1Iiwic2lnbWEiOjAuMCwidHMiOiIyMDI2LTA3LTA0VDA4OjEwOjI2KzAwOjAwIiwidHlwIjoic2lnbWEtYXR0ZXN0IiwidiI6MSwidmVyZGljdCI6IlBBU1MifQ.a4P7SBiBUeAqz2xW-ou_jmtMnzfu5tWoS8_ImK8mQbEpItW_1z-eTiujDOLblM34_v8gXOo55g0AsJxp9NpqDA";

/** The exact claim the genesis token's claim_sha256 covers — published so anyone
 *  can recompute sha256(claim) and confirm the binding, not just the signature. */
export const GENESIS_CLAIM =
  "This receipt is a sigma-attestation: a portable, ed25519-signed record that a declared==realized check was run over these exact bytes. It verifies in your browser against the public key that travels inside it. No server is consulted, no account exists, no trust is requested. sigma = declared minus realized; this token's sigma is 0.0 because this claim and its realized evidence are the same bytes — the format's honest floor, demonstrated by the artifact itself.";

function b64urlToBytes(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyReceipt(token: string): Promise<VerifyResult> {
  const parts = token.trim().split(".");
  if (parts.length !== 2) return { state: "invalid", reason: "not a two-segment token" };

  let messageBytes: Uint8Array;
  let payload: ReceiptPayload;
  try {
    messageBytes = b64urlToBytes(parts[0]);
    payload = JSON.parse(new TextDecoder().decode(messageBytes));
  } catch {
    return { state: "invalid", reason: "payload segment does not decode" };
  }
  if (payload.typ !== "sigma-attest") return { state: "invalid", reason: "typ is not sigma-attest" };
  if (!/^[0-9a-f]{64}$/.test(payload.attester ?? ""))
    return { state: "invalid", reason: "attester is not a 32-byte hex key" };

  let sigBytes: Uint8Array;
  try {
    sigBytes = b64urlToBytes(parts[1]);
  } catch {
    return { state: "invalid", reason: "signature segment does not decode" };
  }

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      hexToBytes(payload.attester) as BufferSource,
      { name: "Ed25519" },
      false,
      ["verify"]
    );
    const ok = await crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      sigBytes as BufferSource,
      messageBytes as BufferSource
    );
    return ok
      ? { state: "valid", payload, engine: "webcrypto" }
      : { state: "invalid", reason: "ed25519 signature does not verify against the embedded key" };
  } catch {
    return {
      state: "unsupported",
      reason: "this browser's WebCrypto lacks Ed25519 — the check needs a current browser",
    };
  }
}
