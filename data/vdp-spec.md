# VDP — Verified Delta Protocol

**Status: SPEC + reference kernel running. Network adoption: roadmap.**
Draft 0.1 · Spektre Labs · 2026-07-04 · License: Apache-2.0

## The friction

Work produced by AI agents cannot be composed across trust boundaries.
Every agent system is a silo: you trust its outputs because you trust its
operator, its model vendor, its cloud. Compute is abundant and arbitrageable —
Mac Studios, gaming GPUs, rented H100s, spot instances — but work cannot flow
to the cheapest capable substrate because the *result* carries no proof.
This is the pre-TCP/IP condition: many networks, no internetwork.

## The invariant

TCP/IP solved heterogeneous links with one minimal envelope: the packet.
VDP solves heterogeneous producers with one minimal envelope: the
**verified delta** — a work unit that carries its own admission test.

A VDP envelope is five fields:

```
{
  "task":      { "id": "...", "coordinate": <input, machine-readable> },
  "artifact":  { "sha256": "...", "uri": "..." },
  "gate":      { "cmd": "<deterministic verifier>", "sha256": "<of the gate itself>" },
  "verdict":   { "score": <number>, "champion": <number>, "delta": <number> },
  "sig":       { "alg": "ed25519", "pub": "...", "over": "sha256(task|artifact|gate|verdict)" }
}
```

Rules — all four are load-bearing:

1. **The gate is part of the envelope.** The verifier travels with the work
   (by hash), so any node can re-run the admission test. Trust the math,
   not the producer.
2. **Only deltas count.** An artifact is admitted only if `score > champion`
   under the named gate. Ties and losses keep the incumbent. This is the
   champion–challenger ratchet as a wire format: no self-graded progress.
3. **Producers are anonymous-equivalent.** The envelope does not care whether
   a frontier model, a local script, a rented GPU, or a human produced the
   artifact. Substrate becomes a routing decision — price/latency arbitrage —
   exactly as links became invisible under IP.
4. **The ledger is append-only and signed.** Every admission (and every
   rejection) is recorded. History cannot be rewritten to fake progress.

## Why this is era-shaped

- Napster's move: user machines ARE the infrastructure. VDP's move: any
  compute ANYWHERE is the workforce — because admission is verifiable,
  supply can be permissionless.
- TCP/IP's move: smart edges, dumb network. VDP's move: smart gates, dumb
  producers. Intelligence concentrates in the verifier, which is small,
  deterministic, auditable — the opposite of trusting a large opaque model.
- The ratchet rule is what BSP trees were for Quake: a *precomputation of
  trust*. The expensive judgment (is this better?) is paid once, encoded in
  a gate, then evaluated cheaply forever.

## Reference implementation (running today)

The first VDP loop runs in this repository against a real production surface:

- **task coordinate**: an art-direction vector (12 floats) for the WebGPU
  hero renderer (`?ad=` runtime override — no rebuild per candidate)
- **artifact**: a headless-rendered frame (sha256-hashed PNG)
- **gate**: `scripts/frontier_gate.py` — nine deterministic pixel metrics,
  weighted to a 0–100 score (sharpness, OLED discipline, cold-hue law,
  contrast, tonal entropy, bilateral symmetry, focal hierarchy, negative
  space, material grain)
- **search**: `scripts/foundry.mjs` — golden-ratio low-discrepancy mutation
  with an annealing schedule; promotion only on verified beat
- **ledger**: `scripts/foundry_ledger.jsonl` — append-only generations
- **signature**: ed25519 via the sigma-attest toolchain (spec served live at
  the /attest/spec endpoint)

What is NOT claimed: no deployed multi-party network exists yet; the
reference loop runs single-node. The spec is published so that anyone can
implement a producer or a verifier. Adoption is the roadmap, exactly as with
VRP/CRP/SID/VTC.

## Relationship to the protocol family

VRP routes value. CRP routes capability. SID discloses identity minimally.
VTC chains transactions verifiably. **VDP routes WORK** — it is the layer
that lets the other four be produced by an open market of machines without
a trust authority. One axiom under all five: declared = realized, enforced
by construction.
