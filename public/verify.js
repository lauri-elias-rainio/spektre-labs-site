/*
 * verify.js — the sigma-attest verifier with ZERO npm dependencies. Pure JS. Offline. Forever.
 *
 * Drop this one file into any project — browser, Node 18+, Deno, Bun — and verify a
 * sigma-attest receipt with no install, no build, no network, no shared secret. The
 * attester's public key travels inside the token, so verification is fully local.
 *
 * ed25519 signature verification (RFC 8032) is implemented from scratch with BigInt;
 * SHA-512 / SHA-256 use the platform's built-in WebCrypto (crypto.subtle) — present in
 * every modern browser and Node runtime, never an npm package. That makes sigma-attest a
 * real protocol: this file and runtime attest_verify_pure.py agree byte-for-byte on the
 * same token, across two independent from-scratch implementations.
 *
 * σ-honest scope: a valid result proves "attester <pubkey> signed THESE exact bytes,
 * declaring σ at time T". It does NOT prove the AI's claim is absolutely true — a
 * signature proves provenance, not truth. An honest attestation of a check, never an oracle.
 *
 *   import { verifyToken } from "./verify.js";      // ESM
 *   const r = await verifyToken(token);             // { validSignature, canonicalOk, payload, reason }
 *
 * CLI (Node):  node verify.js <token>   |   node verify.js selftest
 */

/* ── ed25519 verification, RFC 8032, pure BigInt (mirrors attest_verify_pure.py) ───────── */
const _p = (1n << 255n) - 19n;
const _L = (1n << 252n) + 27742317777372353535851937790883648493n;

function _mod(a, m) { const r = a % m; return r >= 0n ? r : r + m; }
function _pow(b, e, m) { // modular exponentiation
  b = _mod(b, m); let r = 1n;
  while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; }
  return r;
}
function _modpInv(x) { return _pow(x, _p - 2n, _p); }

const _d = _mod(-121665n * _modpInv(121666n), _p);
const _sqrtM1 = _pow(2n, (_p - 1n) / 4n, _p);

function _recoverX(y, sign) {
  if (y >= _p) return null;
  const x2 = _mod((y * y - 1n) * _modpInv(_d * y * y + 1n), _p);
  if (x2 === 0n) return sign ? null : 0n;
  let x = _pow(x2, (_p + 3n) / 8n, _p);
  if (_mod(x * x - x2, _p) !== 0n) x = _mod(x * _sqrtM1, _p);
  if (_mod(x * x - x2, _p) !== 0n) return null;
  if ((x & 1n) !== BigInt(sign)) x = _p - x;
  return x;
}

const _gY = _mod(4n * _modpInv(5n), _p);
const _gX = _recoverX(_gY, 0);
const _G = [_gX, _gY, 1n, _mod(_gX * _gY, _p)];

function _pointAdd(P, Q) {
  const A = _mod((P[1] - P[0]) * (Q[1] - Q[0]), _p);
  const B = _mod((P[1] + P[0]) * (Q[1] + Q[0]), _p);
  const C = _mod(2n * P[3] * Q[3] * _d, _p);
  const D = _mod(2n * P[2] * Q[2], _p);
  const E = B - A, F = D - C, Gg = D + C, H = B + A;
  return [_mod(E * F, _p), _mod(Gg * H, _p), _mod(F * Gg, _p), _mod(E * H, _p)];
}
function _pointMul(s, P) {
  let Q = [0n, 1n, 1n, 0n];
  while (s > 0n) { if (s & 1n) Q = _pointAdd(Q, P); P = _pointAdd(P, P); s >>= 1n; }
  return Q;
}
function _pointEqual(P, Q) {
  if (_mod(P[0] * Q[2] - Q[0] * P[2], _p) !== 0n) return false;
  if (_mod(P[1] * Q[2] - Q[1] * P[2], _p) !== 0n) return false;
  return true;
}
function _leToBig(bytes) { let n = 0n; for (let i = bytes.length - 1; i >= 0; i--) n = (n << 8n) | BigInt(bytes[i]); return n; }
function _pointDecompress(s) {
  if (s.length !== 32) return null;
  let y = _leToBig(s);
  const sign = Number((y >> 255n) & 1n);
  y &= (1n << 255n) - 1n;
  const x = _recoverX(y, sign);
  if (x === null) return null;
  return [x, y, 1n, _mod(x * y, _p)];
}

async function _sha512(bytes) {
  const d = await crypto.subtle.digest("SHA-512", bytes);
  return new Uint8Array(d);
}
async function _sha256Hex(str) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** True iff `signature` (64 bytes) is a valid ed25519 signature by `pub` (32 bytes) over `msg`.
 *  Fail-closed: any malformed input returns false, never throws, never true on doubt. */
export async function ed25519Verify(pub, msg, signature) {
  try {
    if (pub.length !== 32 || signature.length !== 64) return false;
    const A = _pointDecompress(pub);
    if (A === null) return false;
    const Rs = signature.slice(0, 32);
    const R = _pointDecompress(Rs);
    if (R === null) return false;
    const s = _leToBig(signature.slice(32));
    if (s >= _L) return false;
    const hInput = new Uint8Array(Rs.length + pub.length + msg.length);
    hInput.set(Rs, 0); hInput.set(pub, Rs.length); hInput.set(msg, Rs.length + pub.length);
    const h = _mod(_leToBig(await _sha512(hInput)), _L);
    const sB = _pointMul(s, _G);
    const hA = _pointMul(h, A);
    return _pointEqual(sB, _pointAdd(R, hA));
  } catch { return false; }
}

/* ── sigma-attest token binding (byte-identical to the signer) ─────────────────────────── */
function _b64uToBytes(s) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4);
  const bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function _hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
/** Advisory canonical re-encode check. NOTE: a JSON re-serialization in JS cannot reproduce
 *  Python's float formatting (0.0 vs 0), so this is an informational hint, never the verdict —
 *  the signature is checked over the EXACT transmitted bytes (JWT semantics). */
function _looksCanonical(payloadBytes, payload) {
  try {
    const sorted = {};
    for (const k of Object.keys(payload).sort()) sorted[k] = payload[k];
    const re = new TextEncoder().encode(JSON.stringify(sorted));
    return re.length === payloadBytes.length && re.every((b, i) => b === payloadBytes[i]);
  } catch { return false; }
}

/** Verify a sigma-attest token with zero npm dependencies. Resolves to a verdict object.
 *  The signature is verified over the EXACT payload segment bytes as transmitted — the bytes
 *  the signer signed — exactly like JWT. No re-serialization is trusted for the verdict. */
export async function verifyToken(token) {
  const out = { validSignature: false, canonicalOk: false, payload: null, reason: null, backend: "pure-js" };
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 2) { out.reason = "token must be <b64u_payload>.<b64u_sig>"; return out; }
    const payloadBytes = _b64uToBytes(parts[0]);
    const sig = _b64uToBytes(parts[1]);
    const payload = JSON.parse(new TextDecoder().decode(payloadBytes));
    out.payload = payload;
    if (payload.typ !== "sigma-attest") { out.reason = "typ is not sigma-attest"; return out; }
    if (!/^[0-9a-f]{64}$/.test(payload.attester || "")) { out.reason = "attester is not a 32-byte hex key"; return out; }
    out.canonicalOk = _looksCanonical(payloadBytes, payload);
    const ok = await ed25519Verify(_hexToBytes(payload.attester), payloadBytes, sig);
    out.validSignature = Boolean(ok);
    out.reason = ok ? "ok" : "signature does not verify under the attester key";
    return out;
  } catch (e) { out.reason = "malformed: " + String(e).slice(0, 120); return out; }
}

/** Recompute sha256 of a published claim and compare to the token's claim_sha256 — proves
 *  the signature covers THESE words, not just some bytes. */
export async function claimBinds(claimText, payload) {
  return (await _sha256Hex(claimText)) === payload.claim_sha256;
}

/* ── conformance vector: signed by the production backend, verified here from scratch ───── */
const TEST_VECTOR =
  "eyJhdHRlc3RlciI6Ijc0YTkzZTkyNTZlOGE1ZjUyOTNhNDU1NGE0ZTQ2OTBiYjEzNzdhMTNiMzZkOTBhZDkzN2Q3MGFiYjA4OGYyMjciLCJjbGFpbV9zaGEyNTYiOiI2MGNmZmNkODhhN2Q0NWM3ZjgyZjIzMjZiYWQ2MjBlOTUxNGM0NjYyNDk1NGNkMjExZGU3MjhiZTE2MGI4OWMwIiwiZ2F0ZSI6MC4zNCwia2luZCI6InByb3RvY29sX2NvbmZvcm1hbmNlX3ZlY3RvciIsIm5vdGUiOiJhdHRlc3RzIGEgZGVjbGFyZWQ9PXJlYWxpemVkIENIRUNLIG92ZXIgdGhlc2UgYnl0ZS1oYXNoZXMg4oCUIE5PVCBhYnNvbHV0ZSB0cnV0aCBvZiB0aGUgY2xhaW0iLCJyZWFsaXplZF9zaGEyNTYiOiIwOWI4YWU4MTQzMzlhZTgxMDE4YjMyNTg1NDlkNDg1OTIwYTE3M2I5ZWMwOTk3NTcxOTk0ZmFjYjkwMTA3NGIzIiwic2lnbWEiOjEuMCwidHMiOiIyMDI2LTA3LTA0VDE0OjQwOjE3KzAwOjAwIiwidHlwIjoic2lnbWEtYXR0ZXN0IiwidiI6MSwidmVyZGljdCI6IkhBTFQifQ.OUcP7-L1moy5yavASUh8Kd_2UPUJZ8fWZsSb4stI_pfT9f31uK1ZH4gEqzlqwiIAomXtr7PNMcbW3n-MhO18AQ";

export async function selftest() {
  const good = await verifyToken(TEST_VECTOR);
  const [seg0, seg1] = TEST_VECTOR.split(".");
  const flipped = seg1[8] !== "A" ? "A" : "B";
  const bad = await verifyToken(seg0 + "." + seg1.slice(0, 8) + flipped + seg1.slice(9));
  const pass = good.validSignature === true && bad.validSignature === false;
  console.log("baked vector verifies (from-scratch ed25519):", good.validSignature, "[" + good.reason + "]");
  console.log("bad-signature token rejected by the math:    ", !bad.validSignature, "[" + bad.reason + "]");
  console.log("SELFTEST:", pass ? "PASS — sigma-attest verifies with zero npm deps" : "FAIL");
  return pass;
}

/* Node CLI — no-op in the browser (import.meta.main is undefined there). */
if (typeof process !== "undefined" && process.argv && process.argv[1] && process.argv[1].endsWith("verify.js")) {
  const arg = process.argv[2];
  if (!arg || arg === "selftest") { selftest().then((ok) => process.exit(ok ? 0 : 1)); }
  else { verifyToken(arg).then((r) => { console.log(JSON.stringify({ validSignature: r.validSignature, canonicalOk: r.canonicalOk, reason: r.reason, backend: r.backend }, null, 2)); process.exit(r.validSignature ? 0 : 1); }); }
}
