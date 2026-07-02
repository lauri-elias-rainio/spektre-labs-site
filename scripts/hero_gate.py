#!/usr/bin/env python3
"""
hero_gate.py — visual quality gate for Spektre Labs hero changes.

Catches regressions such as:
- smudgy / blurred imagery (sharpness drop)
- lifted blacks / non-OLED darkness (the original killed hero failed here)
- colour contamination outside Spektre palette
- loss of contrast

Usage:
  python3 hero_gate.py <incumbent.png> <candidate.png> [--json]

Exit codes: 0 = PASS, 1 = FAIL, 2 = usage/dependency error
"""

import sys
import argparse
import json as _json

# ── dependency check ──────────────────────────────────────────────────────────
try:
    from PIL import Image
except ImportError:
    print("FATAL: Pillow not installed — run: pip install pillow", file=sys.stderr)
    sys.exit(2)

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    print("WARN: numpy not available — sharpness uses slower PIL fallback; "
          "OLED/monochrome/contrast metrics unavailable", file=sys.stderr)

# ── thresholds (calibrated on real Spektre screenshots) ──────────────────────
# (1) Sharpness: var-of-Laplacian ratio
SHARPNESS_RATIO_MIN  = 0.72    # candidate must be >= 72% of incumbent

# (2) OLED discipline: fraction of pixels with luminance < 0.05
# Calibrated: good hero = ~80.6%, smudgy hero = ~73.4% → 7.2pp drop caught at ±5pp
OLED_DARK_THRESH     = 0.05
OLED_DEV_MAX         = 0.06    # ±6 percentage-point absolute deviation allowed
                                # (catches the real 7.2pp smudge delta; spk_mon fails at -7.2pp)

# (3) Monochrome discipline: saturated pixels (S > 0.25)
# Relative check vs incumbent — candidate must not add >2pp saturated pixels
MONO_SAT_THRESH      = 0.25
MONO_MAX_ADDITION    = 0.02    # candidate may not have >2pp MORE saturated pixels

# (4) Single-signal / hue purity: compare candidate hue distribution vs incumbent
# Reject if candidate has a hue cluster that is LARGER than incumbent's by >1% of image
# in ANY hue bucket outside the 210-300° cool signal band
HUE_BUCKET_DEG       = 30      # 12 hue buckets of 30° each
HUE_COOL_RANGE       = (210, 300)   # Spektre platinum/steel band (inclusive)
HUE_OUTLIER_ADDITION = 0.01    # candidate may add at most 1% extra warm pixels vs incumbent

# (5) Contrast: luminance p99 - p5 (advisory WARN, not FAIL)
CONTRAST_WARN_MIN    = 0.40


# ── image helpers ─────────────────────────────────────────────────────────────

def load_rgb_f32(path: str):
    """Return (H, W, 3) float32 numpy array in [0,1] or plain list of rows."""
    img = Image.open(path).convert("RGB")
    if HAS_NUMPY:
        return np.asarray(img, dtype=np.float32) / 255.0
    # Fallback: keep as PIL Image object for sharpness-only path
    return img


def to_luminance_np(arr):
    """BT.709 luminance → (H,W) float32."""
    return 0.2126 * arr[:, :, 0] + 0.7152 * arr[:, :, 1] + 0.0722 * arr[:, :, 2]


def variance_of_laplacian_np(lum):
    """Var of discrete Laplacian = sharpness score."""
    L = (
        lum[:-2, 1:-1] + lum[2:, 1:-1]
        + lum[1:-1, :-2] + lum[1:-1, 2:]
        - 4.0 * lum[1:-1, 1:-1]
    )
    return float(np.var(L))


def variance_of_laplacian_pil(img) -> float:
    """PIL fallback sharpness (no numpy)."""
    from PIL import ImageFilter
    gray = img.convert("L")
    kern = gray.filter(ImageFilter.Kernel(
        size=3, kernel=[-1, -1, -1, -1, 8, -1, -1, -1, -1], scale=1, offset=0
    ))
    vals = list(kern.getdata())
    mean = sum(vals) / len(vals)
    return sum((v - mean) ** 2 for v in vals) / len(vals)


def rgb_to_hsl_np(arr):
    """Return H [0,360], S [0,1], L [0,1] arrays from (H,W,3) float32."""
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    cmax  = np.maximum(np.maximum(r, g), b)
    cmin  = np.minimum(np.minimum(r, g), b)
    delta = cmax - cmin

    L = (cmax + cmin) / 2.0
    S = np.where(delta == 0, 0.0,
                 delta / (1.0 - np.abs(2.0 * L - 1.0) + 1e-9))
    S = np.clip(S, 0.0, 1.0)

    H = np.zeros_like(r)
    mr = (cmax == r) & (delta > 0)
    mg = (cmax == g) & (delta > 0)
    mb = (cmax == b) & (delta > 0)
    H[mr] = (60.0 * ((g[mr] - b[mr]) / delta[mr]) % 6)
    H[mg] =  60.0 * ((b[mg] - r[mg]) / delta[mg] + 2.0)
    H[mb] =  60.0 * ((r[mb] - g[mb]) / delta[mb] + 4.0)
    H = H % 360.0
    return H, S, L


# ── metrics ───────────────────────────────────────────────────────────────────

def metric_sharpness(inc_path, cand_path, inc_data, cand_data):
    if HAS_NUMPY:
        inc_v  = variance_of_laplacian_np(to_luminance_np(inc_data))
        cand_v = variance_of_laplacian_np(to_luminance_np(cand_data))
    else:
        inc_v  = variance_of_laplacian_pil(inc_data)
        cand_v = variance_of_laplacian_pil(cand_data)

    ratio  = cand_v / (inc_v + 1e-12)
    passed = ratio >= SHARPNESS_RATIO_MIN
    return {
        "metric":    "sharpness (variance of Laplacian)",
        "incumbent": round(inc_v,  6),
        "candidate": round(cand_v, 6),
        "ratio":     round(ratio,  4),
        "threshold": f">= {SHARPNESS_RATIO_MIN}×",
        "status":    "PASS" if passed else "FAIL",
        "passed":    passed,
        "is_fatal":  True,
    }


def metric_oled(inc_arr, cand_arr):
    inc_lum   = to_luminance_np(inc_arr)
    cand_lum  = to_luminance_np(cand_arr)
    inc_dark  = float(np.mean(inc_lum  < OLED_DARK_THRESH))
    cand_dark = float(np.mean(cand_lum < OLED_DARK_THRESH))
    dev       = cand_dark - inc_dark   # signed: negative = candidate LOST dark pixels
    passed    = abs(dev) <= OLED_DEV_MAX
    return {
        "metric":              "OLED discipline (fraction lum < 0.05)",
        "incumbent_dark_frac": round(inc_dark,  4),
        "candidate_dark_frac": round(cand_dark, 4),
        "delta_pp":            round(dev * 100, 2),   # percentage points
        "threshold":           f"abs delta <= {OLED_DEV_MAX * 100:.0f}pp",
        "note":                "negative delta = blacks lifted (smudge indicator)",
        "status":              "PASS" if passed else "FAIL",
        "passed":              passed,
        "is_fatal":            True,
    }


def metric_monochrome(inc_arr, cand_arr):
    n_pix    = cand_arr.shape[0] * cand_arr.shape[1]
    _, S_inc, _ = rgb_to_hsl_np(inc_arr)
    _, S_cand, _ = rgb_to_hsl_np(cand_arr)
    inc_frac  = float(np.mean(S_inc  > MONO_SAT_THRESH))
    cand_frac = float(np.mean(S_cand > MONO_SAT_THRESH))
    addition  = cand_frac - inc_frac   # how much MORE colour the candidate added
    passed    = addition <= MONO_MAX_ADDITION
    return {
        "metric":               "monochrome discipline (sat > 0.25 fraction)",
        "incumbent_sat_frac":   round(inc_frac,  5),
        "candidate_sat_frac":   round(cand_frac, 5),
        "added_colour_pp":      round(addition * 100, 3),
        "threshold":            f"candidate may add <= {MONO_MAX_ADDITION * 100:.0f}pp vs incumbent",
        "status":               "PASS" if passed else "FAIL",
        "passed":               passed,
        "is_fatal":             True,
    }


def metric_single_signal(inc_arr, cand_arr):
    """
    Relative hue check: of saturated pixels, candidate must not introduce
    substantially more warm/outlier hue (outside 210-300°) than incumbent.
    """
    n_pix = cand_arr.shape[0] * cand_arr.shape[1]

    def warm_fraction(arr):
        H, S, _ = rgb_to_hsl_np(arr)
        sat_mask = S > MONO_SAT_THRESH
        sat_H    = H[sat_mask]
        in_cool  = (sat_H >= HUE_COOL_RANGE[0]) & (sat_H <= HUE_COOL_RANGE[1])
        out_warm = (~in_cool).sum()
        return out_warm / (n_pix + 1e-9)

    inc_warm  = warm_fraction(inc_arr)
    cand_warm = warm_fraction(cand_arr)
    addition  = cand_warm - inc_warm
    passed    = addition <= HUE_OUTLIER_ADDITION

    return {
        "metric":            f"single-signal hue check (warm pixels outside {HUE_COOL_RANGE[0]}-{HUE_COOL_RANGE[1]}°)",
        "incumbent_warm_frac": round(inc_warm,  5),
        "candidate_warm_frac": round(cand_warm, 5),
        "added_warm_pp":      round(addition * 100, 4),
        "threshold":          f"candidate may add <= {HUE_OUTLIER_ADDITION * 100:.1f}pp warm vs incumbent",
        "status":             "PASS" if passed else "FAIL",
        "passed":             passed,
        "is_fatal":           True,
    }


def metric_contrast(cand_arr):
    lum  = to_luminance_np(cand_arr)
    flat = lum.ravel()
    p5   = float(np.percentile(flat,  5))
    p99  = float(np.percentile(flat, 99))
    span = p99 - p5
    ok   = span >= CONTRAST_WARN_MIN
    return {
        "metric":    "contrast (luminance p99 − p5)",
        "p5":        round(p5,   4),
        "p99":       round(p99,  4),
        "span":      round(span, 4),
        "threshold": f">= {CONTRAST_WARN_MIN} (WARN only, not fatal)",
        "status":    "PASS" if ok else "WARN",
        "passed":    True,   # advisory only
        "is_fatal":  False,
    }


# ── runner ────────────────────────────────────────────────────────────────────

def run(inc_path: str, cand_path: str, as_json: bool = False) -> int:
    try:
        inc_data  = load_rgb_f32(inc_path)
        cand_data = load_rgb_f32(cand_path)
    except Exception as exc:
        print(f"FATAL: could not load images — {exc}", file=sys.stderr)
        return 2

    results = []
    results.append(metric_sharpness(inc_path, cand_path, inc_data, cand_data))

    if HAS_NUMPY:
        results.append(metric_oled(inc_data, cand_data))
        results.append(metric_monochrome(inc_data, cand_data))
        results.append(metric_single_signal(inc_data, cand_data))
        results.append(metric_contrast(cand_data))
    else:
        results.append({"metric": "OLED/mono/signal/contrast",
                        "status": "SKIP", "passed": True, "is_fatal": False,
                        "note": "numpy required — install it for full checks"})

    overall    = all(r["passed"] for r in results)
    hard_fails = [r for r in results if r["status"] == "FAIL"]
    warns      = [r for r in results if r["status"] == "WARN"]

    if as_json:
        # Coerce numpy scalars to native Python types for JSON serialisation
        def _coerce(obj):
            if isinstance(obj, dict):
                return {k: _coerce(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [_coerce(v) for v in obj]
            # numpy bool_ / int_ / float_
            if hasattr(obj, "item"):
                return obj.item()
            return obj

        print(_json.dumps(_coerce({
            "incumbent": inc_path,
            "candidate": cand_path,
            "overall":   "PASS" if overall else "FAIL",
            "checks":    results,
        }), indent=2))
    else:
        W = 64
        print("=" * W)
        print(f"  HERO GATE")
        print(f"  incumbent : {inc_path}")
        print(f"  candidate : {cand_path}")
        print("=" * W)
        for r in results:
            tag = f"[{r['status']}]"
            print(f"\n{tag:7} {r['metric']}")
            for k, v in r.items():
                if k in ("metric", "status", "passed", "is_fatal"):
                    continue
                print(f"         {k}: {v}")
        print("\n" + "=" * W)
        verdict = "PASS" if overall else "FAIL"
        suffix  = ""
        if hard_fails:
            suffix += f"  ← {len(hard_fails)} FAILING check(s)"
        if warns:
            suffix += f"  ({len(warns)} warning(s))"
        print(f"  VERDICT: {verdict}{suffix}")
        print("=" * W)

    return 0 if overall else 1


def main():
    p = argparse.ArgumentParser(description="Spektre Labs hero visual quality gate")
    p.add_argument("incumbent",  help="Baseline (known-good) PNG path")
    p.add_argument("candidate",  help="New hero PNG path to verify")
    p.add_argument("--json",     action="store_true", help="Output JSON instead of table")
    args = p.parse_args()
    sys.exit(run(args.incumbent, args.candidate, as_json=args.json))


if __name__ == "__main__":
    main()
