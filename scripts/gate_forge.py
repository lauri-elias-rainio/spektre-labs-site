#!/usr/bin/env python3
"""
gate_forge.py — the META-RATCHET: the standard itself improves only through
a verified delta, under the same law as the work it judges.

The insight this encodes: a fixed fitness function gets gamed (Goodhart) and
ceilings out. But a MUTABLE fitness function is worse — unless gate changes
are themselves gated. The admission test for a new gate version:

  1. ORDER  — it must rank the calibration set correctly (Kendall tau = 1.0
              on frames whose quality ordering is established fact: a frame
              the tribunal blessed > a frozen half-render > a broken page).
  2. MARGIN — it must separate the calibration tiers by a WIDER normalized
              margin than the incumbent gate. Better standards discriminate
              more sharply; a gate that blurs tiers is a worse instrument.

Only if both hold is the candidate gate promoted, its sha256 recorded, and
all future foundry scores stamped with the new gate version. Scores are
comparable only within a gate version — exactly protocol versioning.

Usage:
  python3 gate_forge.py calibrate            # verify calibration set exists + show ordering
  python3 gate_forge.py judge <gate.py>      # admit or reject a candidate gate
  python3 gate_forge.py stamp                # print incumbent gate version (sha256)
"""

import hashlib
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).parent
INCUMBENT = HERE / "frontier_gate.py"
CAL_MANIFEST = HERE / "gate_calibration.json"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run_gate(gate: Path, image: str) -> float:
    out = subprocess.run(
        [sys.executable, str(gate), image, "--json"],
        capture_output=True, text=True, timeout=120,
    )
    if out.returncode != 0:
        raise RuntimeError(f"gate failed on {image}: {out.stderr[:200]}")
    return float(json.loads(out.stdout)["score"])


def load_calibration():
    """Calibration set: [(image_path, tier)] — tier 0 is best. Ordering is
    established FACT (tribunal-blessed / measured failure modes), never taste."""
    if not CAL_MANIFEST.exists():
        print(f"FATAL: no {CAL_MANIFEST.name}. Create it first.", file=sys.stderr)
        sys.exit(2)
    m = json.loads(CAL_MANIFEST.read_text())
    frames = [(f["image"], int(f["tier"]), f.get("why", "")) for f in m["frames"]]
    missing = [i for i, _, _ in frames if not Path(i).exists()]
    if missing:
        print(f"FATAL: missing calibration frames: {missing}", file=sys.stderr)
        sys.exit(2)
    return frames


def evaluate(gate: Path, frames):
    scored = [(img, tier, run_gate(gate, img)) for img, tier, _ in frames]
    # ORDER: every better-tier frame must outscore every worse-tier frame
    violations = 0
    pairs = 0
    for i in range(len(scored)):
        for j in range(len(scored)):
            if scored[i][1] < scored[j][1]:  # i is a strictly better tier
                pairs += 1
                if scored[i][2] <= scored[j][2]:
                    violations += 1
    order_ok = violations == 0
    # MARGIN: min gap between adjacent tiers, normalized by score range
    tiers = sorted(set(t for _, t, _ in scored))
    tier_means = {t: sum(s for _, tt, s in scored if tt == t) / max(1, sum(1 for _, tt, _ in scored if tt == t)) for t in tiers}
    gaps = [tier_means[tiers[k]] - tier_means[tiers[k + 1]] for k in range(len(tiers) - 1)]
    rng = max(s for _, _, s in scored) - min(s for _, _, s in scored) + 1e-9
    margin = min(gaps) / rng if gaps else 0.0
    return {
        "scores": [{"image": i, "tier": t, "score": s} for i, t, s in scored],
        "order_ok": order_ok, "violations": violations, "pairs": pairs,
        "margin": round(margin, 4),
    }


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "calibrate"

    if cmd == "stamp":
        print(json.dumps({"gate": INCUMBENT.name, "sha256": sha256(INCUMBENT)}))
        return

    frames = load_calibration()

    if cmd == "calibrate":
        res = evaluate(INCUMBENT, frames)
        print(json.dumps({"incumbent": sha256(INCUMBENT)[:16], **res}, indent=1))
        if not res["order_ok"]:
            print("\nINCUMBENT FAILS ITS OWN CALIBRATION — fix the gate first.", file=sys.stderr)
            sys.exit(1)
        return

    if cmd == "judge":
        cand = Path(sys.argv[2])
        inc = evaluate(INCUMBENT, frames)
        can = evaluate(cand, frames)
        admitted = can["order_ok"] and can["margin"] > inc["margin"]
        verdict = {
            "candidate": sha256(cand)[:16],
            "incumbent": sha256(INCUMBENT)[:16],
            "candidate_order_ok": can["order_ok"],
            "candidate_margin": can["margin"],
            "incumbent_margin": inc["margin"],
            "ADMITTED": admitted,
            "law": "order must be perfect AND margin must beat the incumbent",
        }
        print(json.dumps(verdict, indent=1))
        sys.exit(0 if admitted else 1)

    print(__doc__)


if __name__ == "__main__":
    main()
