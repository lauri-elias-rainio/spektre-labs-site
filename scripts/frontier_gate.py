#!/usr/bin/env python3
"""
frontier_gate.py — the HARD standard. A quantitative award-tier rubric for the
Spektre hero, above hero_gate.py's pass/fail floor. Produces a 0-100 score
from nine measured metrics, each defensible from the pixels. No opinions —
the numbers make the claim (declared = realized).

Usage:
  python3 frontier_gate.py <hero.png> [--json]

The bar (each metric weighted; 100 = every dimension at award tier):
  1. Sharpness       — variance of Laplacian, silhouettes must be razor
  2. OLED discipline — dark fraction; luxury lives in the void
  3. Cold-hue law    — saturated color only in the 210-300 deg axis
  4. Contrast span   — p99-p5 luminance; a true black-to-highlight range
  5. Tonal richness  — luminance histogram entropy; micro-gradation, not banding
  6. Symmetry        — bilateral mirror match (STYLE_LAW: 1=1 rendered)
  7. Focal hierarchy — one dominant bright region; the eye knows where to land
  8. Negative space  — near-black fraction; restraint is the flex
  9. Material grain  — high-frequency floor; lit black, never sterile-flat
"""

import sys
import argparse
import json as _json

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("FATAL: needs pillow + numpy", file=sys.stderr)
    sys.exit(2)


def load_lum(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32) / 255.0
    lum = im @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    return im, lum


def m_sharpness(lum):
    # variance of Laplacian, normalized to an award reference (~0.02 = crisp)
    lap = (
        -4 * lum[1:-1, 1:-1]
        + lum[:-2, 1:-1] + lum[2:, 1:-1] + lum[1:-1, :-2] + lum[1:-1, 2:]
    )
    v = float(np.var(lap))
    return min(1.0, v / 0.020), {"var_laplacian": round(v, 5)}


def m_oled(lum):
    # award band: 62-90% of pixels below 0.05 luminance (deep but not empty)
    dark = float(np.mean(lum < 0.05))
    lo, hi = 0.62, 0.90
    if dark < lo:
        score = max(0.0, dark / lo)
    elif dark > hi:
        score = max(0.0, 1.0 - (dark - hi) / (1.0 - hi))
    else:
        score = 1.0
    return score, {"dark_fraction": round(dark, 4)}


def m_cold_hue(im):
    # ABSOLUTE chroma + brightness floor — dark/neutral pixels have unstable hue
    # (near-neutral → hue 0 → false "warm"); only real color counts.
    mx = im.max(2); mn = im.min(2)
    chroma = mx - mn
    colored = (chroma > 0.045) & (mx > 0.06)
    total = float(np.sum(colored))
    if total < 50:  # a monochrome frame is lawful by definition
        return 1.0, {"colored_frac": 0.0, "cold_share": 1.0}
    hsv = np.asarray(Image.fromarray((im * 255).astype(np.uint8)).convert("HSV"))
    hue = hsv[..., 0].astype(np.float32) * 360.0 / 255.0
    cold = (hue >= 195) & (hue <= 300)
    cold_share = float(np.sum(colored & cold)) / total
    warm_frac = 1.0 - cold_share
    return max(0.0, 1.0 - warm_frac * 6.0), {
        "colored_frac": round(total / im[..., 0].size, 4),
        "cold_share": round(cold_share, 3),
    }


def m_contrast(lum):
    p5, p99 = np.percentile(lum, 5), np.percentile(lum, 99)
    span = float(p99 - p5)
    return min(1.0, span / 0.80), {"span": round(span, 4)}


def m_richness(lum):
    # Shannon entropy of the 64-bin luminance histogram → micro-gradation
    idx = np.clip((lum.ravel() * 64).astype(np.int64), 0, 63)
    hist = np.bincount(idx, minlength=64).astype(np.float64)
    p = hist / (hist.sum() + 1e-9)
    p = p[p > 0]
    ent = float(-(p * np.log2(p)).sum())  # max ~6 for 64 bins
    return min(1.0, ent / 4.2), {"entropy_bits": round(ent, 3)}


def m_symmetry(lum):
    # bilateral mirror match on the central band (the subject axis)
    h, w = lum.shape
    band = lum[:, w // 6: w - w // 6]
    mirror = band[:, ::-1]
    diff = float(np.mean(np.abs(band - mirror)))
    return max(0.0, 1.0 - diff * 9.0), {"mirror_mae": round(diff, 4)}


def m_focal(lum):
    # one dominant bright region: ratio of the brightest 0.5% mean to global mean
    flat = np.sort(lum.ravel())
    top = float(flat[int(len(flat) * 0.995):].mean())
    glob = float(lum.mean()) + 1e-4
    ratio = top / glob
    return min(1.0, ratio / 14.0), {"focal_ratio": round(ratio, 2)}


def m_negspace(lum):
    ns = float(np.mean(lum < 0.03))
    # award restraint: 0.5-0.85 near-black; too little = busy, too much = empty
    lo, hi = 0.50, 0.85
    if ns < lo:
        score = ns / lo
    elif ns > hi:
        score = max(0.0, 1.0 - (ns - hi) / (1.0 - hi))
    else:
        score = 1.0
    return score, {"nearblack_fraction": round(ns, 4)}


def m_grain(lum):
    # high-frequency residual over dark regions → material, not dead flat
    hf = lum[1:, 1:] - lum[:-1, :-1]
    dark = lum[1:, 1:] < 0.12
    if dark.sum() < 100:
        return 0.5, {"grain_std": 0.0}
    g = float(np.std(hf[dark]))
    # award grain sits ~0.004-0.02; below = sterile, above = noisy
    lo, hi = 0.004, 0.020
    if g < lo:
        score = g / lo
    elif g > hi:
        score = max(0.0, 1.0 - (g - hi) / hi)
    else:
        score = 1.0
    return score, {"grain_std": round(g, 5)}


METRICS = [
    ("sharpness", m_sharpness, 0.16, "img"),
    ("oled", m_oled, 0.12, "lum"),
    ("cold_hue", m_cold_hue, 0.12, "img"),
    ("contrast", m_contrast, 0.10, "lum"),
    ("richness", m_richness, 0.12, "lum"),
    ("symmetry", m_symmetry, 0.12, "lum"),
    ("focal", m_focal, 0.10, "lum"),
    ("negative_space", m_negspace, 0.08, "lum"),
    ("grain", m_grain, 0.08, "lum"),
]


def run(path):
    im, lum = load_lum(path)
    rows = []
    total = 0.0
    for name, fn, weight, kind in METRICS:
        score, detail = fn(im if kind == "img" else lum)
        contrib = score * weight
        total += contrib
        rows.append({
            "metric": name, "score": round(score, 3), "weight": weight,
            "points": round(contrib * 100, 1), **detail,
        })
    return round(total * 100, 1), rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    score, rows = run(a.image)
    if a.json:
        print(_json.dumps({"score": score, "metrics": rows}, indent=1))
        return
    print("=" * 60)
    print(f"  FRONTIER GATE — {a.image}")
    print("=" * 60)
    for r in rows:
        bar = "#" * int(r["score"] * 20)
        print(f"  {r['metric']:15s} {r['score']:.2f}  {bar:<20s} +{r['points']:.1f}")
    print("-" * 60)
    tier = ("AWARD" if score >= 82 else "STRONG" if score >= 70
            else "SHIPPABLE" if score >= 58 else "BELOW BAR")
    print(f"  FRONTIER SCORE: {score:.1f} / 100   [{tier}]")
    print("=" * 60)


if __name__ == "__main__":
    main()
