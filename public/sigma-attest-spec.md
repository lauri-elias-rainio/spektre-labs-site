# sigma-attest — Protocol Specification v1

**Status:** stable · **Wire version:** `v=1` · **Signature:** Ed25519 (RFC 8032) · **Encoding:** canonical JSON + base64url

A sigma-attest token is a portable, self-verifying record that **an AI output was checked for `declared == realized`
honesty** by a specific keyholder. It travels as one short string, carries its own public key, and is verified
with no server, no account, no shared secret, and no network call. This document is everything needed to write
an independent implementation and self-certify it against the canonical conformance vectors.

The value of a protocol is that anyone can implement it from the spec + test vectors and interoperate. Ed25519
has RFC 8032. TLS has its test vectors. sigma-attest has this document and `attest_conformance_vectors.json`.

---

## 1. Problem

An AI system's output cannot be trusted without re-running it through a party you already trust. That central
re-executor is a bottleneck and a gatekeeper. sigma-attest dissolves it: the checker signs a compact attestation
of the honesty check, and **any** party verifies the signature offline. Trust moves from "re-run it" to "verify
90 lines of math over bytes that carry their own key."

## 2. Wire format

```
token := base64url( canonical_json(payload) ) "." base64url( ed25519_signature )
```

- Two segments joined by a single `.` (JWT-shaped, but self-describing — the key is inside the payload).
- `base64url` is RFC 4648 §5 **without padding** (`=` stripped). Decoders MUST accept missing padding.
- `ed25519_signature` is the 64-byte Ed25519 signature over the **canonical payload bytes** (§4).

## 3. Payload

A JSON object. Fields:

| field | type | meaning |
|---|---|---|
| `v` | int | spec version (`1`) |
| `typ` | string | `"sigma-attest"` |
| `kind` | string | what was attested (`"ai_output"`, `"code"`, `"cmd"`, …) |
| `claim_sha256` | hex | sha-256 of the AI's declared claim/output |
| `realized_sha256` | hex | sha-256 of the realized evidence the claim was checked against |
| `sigma` | number | `declared==realized` distance in `[0,1]` (lower = more honest) |
| `verdict` | string | `"PASS"` if `sigma <= gate` else `"HALT"` |
| `gate` | number | the σ threshold used (default `0.34`) |
| `ts` | string | ISO-8601 UTC timestamp of the check |
| `attester` | hex | **32-byte Ed25519 public key of the checker** — the signature is verified against THIS |
| `model` | string? | optional: which model produced the claim |
| `note` | string? | optional honest-scope note |
| `nbf` / `exp` | string? | optional ISO-8601 not-before / expiry (replay window) |
| `aud` | string? | optional audience binding (domain) |

The signature binds *all* payload fields, including `attester` — an attacker cannot swap the key without
invalidating the signature (conformance vector `wrong_attester_key`).

## 4. Canonical encoding (normative)

The bytes that are signed and transmitted are the **canonical JSON encoding** of the payload:

```
canonical_json(payload) = JSON with:
  - object keys sorted by Unicode code point, recursively
  - compact separators: "," between items, ":" between key and value (NO spaces)
  - non-ASCII characters emitted as UTF-8 (NOT \uXXXX escaped)
  - UTF-8 byte output
```

Python reference: `json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")`.

> **Implementer note (number formatting).** JSON number serialization differs across languages (e.g. `1.0` vs
> `1`). To stay language-agnostic, a verifier **MUST verify the signature over the exact transmitted payload
> bytes**, NOT over a re-serialization. Because the signature was produced over the canonical bytes, any
> non-canonical or mutated transmission changes the bytes and the signature fails — canonicality is thereby
> enforced *implicitly*, with no need to reproduce another language's number formatting. A verifier MAY
> additionally recompute the canonical form and reject on mismatch (a stricter, equivalent check).

## 5. Signing

```
1. build payload (§3); set attester = hex(public_key)
2. msg = canonical_json(payload)                      # §4
3. sig = Ed25519_sign(private_key, msg)               # 64 bytes
4. token = base64url(msg) "." base64url(sig)
```

The signing seed is the checker's long-lived identity; keep it secret. The public key travels in `attester`.

## 6. Verification (normative)

A verifier returns `valid = true` for the `valid` vector and `valid = false` for every other. Algorithm:

```
1. split token on "." → [p_seg, s_seg]; MUST be exactly 2 segments, else valid=false
2. payload_bytes = base64url_decode(p_seg)
3. sig          = base64url_decode(s_seg); MUST be 64 bytes, else valid=false
4. payload      = JSON.parse(utf8(payload_bytes)); on error valid=false
5. pub          = hex_decode(payload.attester); MUST be 32 bytes, else valid=false
6. valid        = Ed25519_verify(pub, payload_bytes, sig)     # verify over TRANSMITTED bytes (§4 note)
```

Fail-closed: any malformed input yields `valid=false`, never an exception, never `true` on doubt.

**Optional claim enforcement** (a signature proves provenance, not freshness): if `nbf`/`exp` are present,
reject when now is outside `[nbf, exp]` (± small leeway); if `aud` is present, reject when it does not match the
verifying party's domain. Absent claims pass — a bare proof is timeless by design.

## 7. Honest scope (normative)

A sigma-attest token proves **WHO checked WHAT, and the σ distance they found** — signed over exact byte
hashes. It does **NOT** assert that the underlying claim is absolutely true. `sigma == 0` means the checker
found `declared == realized` exactly (1 = 1); it is a statement about a *check*, not about ground truth.
Implementations and UIs MUST NOT present a valid signature as proof the claim is true.

## 8. Conformance

An implementation conforms iff it returns the expected `valid` for every vector in
`attest_conformance_vectors.json`:

| vector | expect | exercises |
|---|---|---|
| `valid` | true | correctly signed canonical token |
| `tampered_signature` | false | mutated sig segment — the Ed25519 math must reject |
| `tampered_payload` | false | payload bytes changed, old signature reused |
| `wrong_attester_key` | false | attester replaced with a different valid pubkey |
| `non_canonical_payload` | false | valid sig over canonical bytes, non-canonical transmission |
| `malformed_structure` | false | not two base64url segments |

Regenerate/verify: `python3 runtime/attest_conformance.py run` → `CONFORMANCE: PASS`.

## 9. Reference implementations

Three independent implementations across two languages, all agreeing on every vector:

- **`runtime/sigma_attest.py`** — signer + verifier (native Ed25519 backend).
- **`runtime/attest_verify_pure.py`** — verifier, **pure Python stdlib** (RFC 8032 from scratch, zero deps).
- **`runtime/sigma_attest_verify.mjs`** — verifier, **JavaScript / WebCrypto** (browser + Node ≥18.4, zero npm).

The protocol certifies its own conformance: `python3 runtime/attest_conformance.py receipt` emits a signed
σ=0 attestation over the conformance result, itself verifiable under any of the three implementations.

## 10. Security considerations

- **Key compromise:** a leaked signing seed lets an attacker forge attestations. The seed is the identity.
- **Malleability:** verifying over transmitted bytes (§4 note) prevents accepting a re-encoded payload; the
  `non_canonical_payload` vector guards this.
- **Replay:** signatures are timeless; use `nbf`/`exp` (and `aud` for domain binding) when freshness matters.
- **Not confidentiality:** the payload is public (base64url, not encrypted). Never place secrets in it.
