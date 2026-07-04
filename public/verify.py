#!/usr/bin/env python3
"""attest_verify_pure.py — the sigma-attest verifier with ZERO dependencies. Pure Python stdlib. Offline. Forever.

Why this file is the Cantor jump, not another module:
  attest_verify.py already dropped the paradigm-lab dependency — but it still needs a COMPILED ed25519
  (pynacl OR cryptography). That is a wall: verification still requires `pip install`, a build toolchain,
  a native wheel for your arch. A protocol whose verifier you must INSTALL is not TCP/IP — it is a service.

  This file implements ed25519 signature verification (RFC 8032) from scratch, using only `hashlib.sha512`.
  No pip. No native code. No network. No shared secret (the public key travels inside the token). It runs on
  any bare python3 — a Raspberry Pi, a locked-down CI runner, a browser via Pyodide, a machine from 2035 —
  and verifies that an AI-output honesty attestation was signed by the key it claims, over the bytes it claims.

  That makes sigma-attest a real protocol: anyone re-implements the verifier from ~90 lines + a test vector,
  and the whole edifice needs no central re-executor to be trusted. declared==realized, checkable by anyone.

σ-honest scope: this verifies the SIGNATURE and the byte-binding (who signed exactly what). It does not judge
whether the underlying claim is true — a signature proves provenance, not truth. That is the format's design.

Conformance is proved by construction: the baked-in TEST_VECTOR was signed by the production `cryptography`
backend; `selftest()` verifies it here under this independent from-scratch implementation. Two implementations
agreeing byte-for-byte on the same token = the format is substrate-independent = it is a protocol.

CLI:  python3 attest_verify_pure.py <token>     # verify a token, exit 0 iff valid
      python3 attest_verify_pure.py selftest    # verify the baked-in vector + a tamper-must-fail check
"""
from __future__ import annotations

import base64
import hashlib
import json
import sys


# ── ed25519 verification, RFC 8032, pure stdlib (only hashlib.sha512) ────────────────────────────────────────────
# Canonical reference arithmetic (public-domain, per the RFC 8032 appendix). Correctness over speed: a verify is
# a handful of scalar multiplications — milliseconds — and never a hot loop. Extended twisted-Edwards coords.
_p = 2 ** 255 - 19
_L = 2 ** 252 + 27742317777372353535851937790883648493


def _modp_inv(x: int) -> int:
    return pow(x, _p - 2, _p)


_d = -121665 * _modp_inv(121666) % _p
_sqrt_m1 = pow(2, (_p - 1) // 4, _p)


def _recover_x(y: int, sign: int):
    if y >= _p:
        return None
    x2 = (y * y - 1) * _modp_inv(_d * y * y + 1) % _p
    if x2 == 0:
        return None if sign else 0
    x = pow(x2, (_p + 3) // 8, _p)
    if (x * x - x2) % _p != 0:
        x = x * _sqrt_m1 % _p
    if (x * x - x2) % _p != 0:
        return None
    if (x & 1) != sign:
        x = _p - x
    return x


_g_y = 4 * _modp_inv(5) % _p
_g_x = _recover_x(_g_y, 0)
_G = (_g_x, _g_y, 1, _g_x * _g_y % _p)   # base point in (X, Y, Z, T) with x=X/Z, y=Y/Z, xy=T/Z


def _point_add(P, Q):
    A = (P[1] - P[0]) * (Q[1] - Q[0]) % _p
    B = (P[1] + P[0]) * (Q[1] + Q[0]) % _p
    C = 2 * P[3] * Q[3] * _d % _p
    D = 2 * P[2] * Q[2] % _p
    E, F, G, H = B - A, D - C, D + C, B + A
    return (E * F % _p, G * H % _p, F * G % _p, E * H % _p)


def _point_mul(s: int, P):
    Q = (0, 1, 1, 0)   # neutral element
    while s > 0:
        if s & 1:
            Q = _point_add(Q, P)
        P = _point_add(P, P)
        s >>= 1
    return Q


def _point_equal(P, Q) -> bool:
    if (P[0] * Q[2] - Q[0] * P[2]) % _p != 0:
        return False
    if (P[1] * Q[2] - Q[1] * P[2]) % _p != 0:
        return False
    return True


def _point_decompress(s: bytes):
    if len(s) != 32:
        return None
    y = int.from_bytes(s, "little")
    sign = y >> 255
    y &= (1 << 255) - 1
    x = _recover_x(y, sign)
    if x is None:
        return None
    return (x, y, 1, x * y % _p)


def ed25519_verify(public: bytes, msg: bytes, signature: bytes) -> bool:
    """True iff `signature` (64 bytes) is a valid ed25519 signature by `public` (32 bytes) over `msg`.
    Fail-closed: any malformed input returns False, never raises, never True on doubt."""
    try:
        if len(public) != 32 or len(signature) != 64:
            return False
        A = _point_decompress(public)
        if A is None:
            return False
        Rs = signature[:32]
        R = _point_decompress(Rs)
        if R is None:
            return False
        s = int.from_bytes(signature[32:], "little")
        if s >= _L:
            return False
        h = int.from_bytes(hashlib.sha512(Rs + public + msg).digest(), "little") % _L
        sB = _point_mul(s, _G)
        hA = _point_mul(h, A)
        return _point_equal(sB, _point_add(R, hA))
    except Exception:
        return False


# ── sigma-attest token binding (byte-identical to the signer) ────────────────────────────────────────────────────
def _b64u_dec(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def _canonical_bytes(payload: dict) -> bytes:
    """The EXACT bytes the signer signed: sorted keys, compact separators, UTF-8. Deterministic across parties."""
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def verify_token(token: str) -> dict:
    """Verify a sigma-attest token with no dependencies. Returns a dict; `valid_signature` is the verdict.

    Checks, in order: structural shape → payload re-encodes canonically to the exact signed bytes (guards
    against a non-canonical wrapper) → the attester pubkey in the payload signed those bytes."""
    out = {"valid_signature": False, "canonical_ok": False, "payload": None, "reason": None, "backend": "pure-stdlib"}
    try:
        parts = token.strip().split(".")
        if len(parts) != 2:
            out["reason"] = "token must be <b64u_payload>.<b64u_sig>"
            return out
        payload_bytes = _b64u_dec(parts[0])
        sig = _b64u_dec(parts[1])
        payload = json.loads(payload_bytes.decode("utf-8"))
        out["payload"] = payload
        # the signer signs the canonical re-encoding; confirm the transmitted bytes ARE canonical
        canonical = _canonical_bytes(payload)
        out["canonical_ok"] = (canonical == payload_bytes)
        attester = payload.get("attester")
        if not attester:
            out["reason"] = "payload has no attester public key"
            return out
        pub = bytes.fromhex(attester)
        # verify over the canonical bytes (what the signer actually signed)
        ok = ed25519_verify(pub, canonical, sig)
        out["valid_signature"] = bool(ok and out["canonical_ok"])
        if not ok:
            out["reason"] = "signature does not verify under the attester key"
        elif not out["canonical_ok"]:
            out["reason"] = "payload is not canonically encoded (possible re-wrap)"
        else:
            out["reason"] = "ok"
        return out
    except Exception as e:
        out["reason"] = "malformed: %s" % (str(e)[:120])
        return out


# ── baked-in conformance vector: signed by the production `cryptography` backend, verified here from scratch ──────
TEST_VECTOR = "eyJhdHRlc3RlciI6Ijc0YTkzZTkyNTZlOGE1ZjUyOTNhNDU1NGE0ZTQ2OTBiYjEzNzdhMTNiMzZkOTBhZDkzN2Q3MGFiYjA4OGYyMjciLCJjbGFpbV9zaGEyNTYiOiI2MGNmZmNkODhhN2Q0NWM3ZjgyZjIzMjZiYWQ2MjBlOTUxNGM0NjYyNDk1NGNkMjExZGU3MjhiZTE2MGI4OWMwIiwiZ2F0ZSI6MC4zNCwia2luZCI6InByb3RvY29sX2NvbmZvcm1hbmNlX3ZlY3RvciIsIm5vdGUiOiJhdHRlc3RzIGEgZGVjbGFyZWQ9PXJlYWxpemVkIENIRUNLIG92ZXIgdGhlc2UgYnl0ZS1oYXNoZXMg4oCUIE5PVCBhYnNvbHV0ZSB0cnV0aCBvZiB0aGUgY2xhaW0iLCJyZWFsaXplZF9zaGEyNTYiOiIwOWI4YWU4MTQzMzlhZTgxMDE4YjMyNTg1NDlkNDg1OTIwYTE3M2I5ZWMwOTk3NTcxOTk0ZmFjYjkwMTA3NGIzIiwic2lnbWEiOjEuMCwidHMiOiIyMDI2LTA3LTA0VDE0OjQwOjE3KzAwOjAwIiwidHlwIjoic2lnbWEtYXR0ZXN0IiwidiI6MSwidmVyZGljdCI6IkhBTFQifQ.OUcP7-L1moy5yavASUh8Kd_2UPUJZ8fWZsSb4stI_pfT9f31uK1ZH4gEqzlqwiIAomXtr7PNMcbW3n-MhO18AQ"


def selftest() -> int:
    """Verify the baked-in vector, then prove a one-character tamper fails. Zero external anything."""
    good = verify_token(TEST_VECTOR)
    ok_good = good["valid_signature"] is True
    # flip one character in the SIGNATURE segment → a well-formed token whose ed25519 sig is wrong: exercises
    # the crypto rejection path (not merely a structural parse failure), the sharpest honesty test.
    seg0, seg1 = TEST_VECTOR.split(".")
    flipped = ("A" if seg1[8] != "A" else "B")
    tampered = seg0 + "." + seg1[:8] + flipped + seg1[9:]
    bad = verify_token(tampered)
    ok_tamper = bad["valid_signature"] is False
    print("baked vector verifies (from-scratch ed25519): %s  [%s]" % (ok_good, good["reason"]))
    print("bad-signature token rejected by the math:     %s  [%s]" % (ok_tamper, bad["reason"]))
    passed = ok_good and ok_tamper
    print("SELFTEST:", "PASS — sigma-attest verifies with zero dependencies" if passed else "FAIL")
    return 0 if passed else 1


def main(argv) -> int:
    if len(argv) < 2 or argv[1] in ("-h", "--help"):
        print(__doc__.strip().split("\n\n")[0])
        print("\nusage: attest_verify_pure.py <token> | selftest")
        return 0
    if argv[1] == "selftest":
        return selftest()
    res = verify_token(argv[1])
    print(json.dumps({k: res[k] for k in ("valid_signature", "canonical_ok", "reason", "backend")}, indent=2))
    if res.get("payload"):
        p = res["payload"]
        print("attester:", p.get("attester"), "| kind:", p.get("kind"), "| sigma:", p.get("sigma"), "| verdict:", p.get("verdict"))
    return 0 if res["valid_signature"] else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
