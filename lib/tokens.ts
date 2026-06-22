/**
 * Spektre Design Tokens
 * STYLE_LAW: OLED-black × platinum × one cold signal.
 * Single source of truth for TS/JS consumers (animations, Three.js, inline styles).
 * CSS counterparts live in app/globals.css @theme + :root.
 */

/* ----------------------------------------------------------
   Colour
   ---------------------------------------------------------- */
export const color = {
  /** Pure OLED black — base of everything */
  black:     "#000000",
  void:      "#030303",
  surface1:  "#0a0a0a",
  surface2:  "#111113",
  surface3:  "#1a1a1c",

  /** Platinum axis — hairline → brightest */
  ptDim:     "#3a3d44",
  ptMid:     "#6e737d",
  pt3:       "#888d97",
  pt2:       "#b9bdc6",
  pt1:       "#dadee5",
  ptHi:      "#edf0f4",
  white:     "#ffffff",

  /** ONE cold signal — never use more than one per view */
  signal:    "#cfe3ff",
  signalDim: "#6ba4d8",
} as const;

export type ColorToken = typeof color;

/* ----------------------------------------------------------
   Platinum gradient stops (for canvas / Three.js shaders)
   ---------------------------------------------------------- */
export const platinumGradient = [
  { stop: 0.00, hex: "#ffffff" },
  { stop: 0.15, hex: "#edf0f4" },
  { stop: 0.42, hex: "#b9bdc6" },
  { stop: 0.60, hex: "#dadee5" },
  { stop: 0.82, hex: "#888d97" },
  { stop: 1.00, hex: "#6e737d" },
] as const;

/* ----------------------------------------------------------
   Type scale
   ---------------------------------------------------------- */
export const fontSize = {
  "2xs":  "0.60rem",   /* 9.6px  — metadata micro */
  xs:     "0.66rem",   /* 10.5px — label */
  sm:     "0.82rem",   /* 13.1px — caption */
  base:   "0.96rem",   /* 15.4px — body */
  md:     "1.08rem",   /* 17.3px — lead */
  lg:     "1.32rem",   /* 21.1px — subhead */
  xl:     "1.72rem",   /* 27.5px — section title */
  "2xl":  "2.24rem",   /* 35.8px — page title */
  "3xl":  "3.00rem",   /* 48px   — display */
  "4xl":  "4.00rem",   /* 64px   — hero */
  "5xl":  "5.50rem",   /* 88px   — cinematic */
} as const;

export const lineHeight = {
  tight:   1.02,
  snug:    1.18,
  base:    1.55,
  relaxed: 1.84,
  loose:   1.96,
} as const;

export const letterSpacing = {
  display: "-0.04em",
  title:   "-0.03em",
  label:    "0.24em",
  micro:    "0.18em",
} as const;

/* ----------------------------------------------------------
   Spacing (4px base × 2× scale)
   ---------------------------------------------------------- */
export const spacing = {
  1:  "0.25rem",  /* 4px   */
  2:  "0.5rem",   /* 8px   */
  3:  "0.75rem",  /* 12px  */
  4:  "1rem",     /* 16px  */
  5:  "1.25rem",  /* 20px  */
  6:  "1.5rem",   /* 24px  */
  8:  "2rem",     /* 32px  */
  10: "2.5rem",   /* 40px  */
  12: "3rem",     /* 48px  */
  16: "4rem",     /* 64px  */
  20: "5rem",     /* 80px  */
  24: "6rem",     /* 96px  */
  32: "8rem",     /* 128px */
  40: "10rem",    /* 160px */
  48: "12rem",    /* 192px */
  64: "16rem",    /* 256px */
} as const;

/* ----------------------------------------------------------
   Motion  (STYLE_LAW §6: Apple-grade)
   ---------------------------------------------------------- */
export const ease = {
  /** Primary spring — most interactions */
  spektre: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** Decelerate — enter from above/below */
  out:     "cubic-bezier(0.0, 0, 0.3, 1)",
  /** Accelerate — exit */
  in:      "cubic-bezier(0.5, 0, 1, 0)",
  /** Ultra-fast snap — microinteractions */
  snap:    "cubic-bezier(0.18, 1, 0.22, 1)",
} as const;

export const duration = {
  instant: 80,    /* ms */
  fast:    160,
  base:    280,
  slow:    480,
  enter:   640,
  reveal:  900,
  scene:   1200,
} as const;

/** Stagger delays (ms) — compose with rise/fade animations */
export const stagger = {
  1:  80,
  2: 160,
  3: 280,
  4: 420,
  5: 600,
  6: 800,
} as const;

/* ----------------------------------------------------------
   Layout
   ---------------------------------------------------------- */
export const layout = {
  text:    "40rem",  /* prose column */
  content: "52rem",  /* content column */
  wide:    "72rem",  /* wide layout */
  full:    "90rem",  /* max site width */
} as const;

export const borderRadius = {
  none: "0px",
  xs:   "2px",
  sm:   "4px",
  md:   "8px",
  lg:   "12px",
  xl:   "20px",
  full: "9999px",
} as const;

/* ----------------------------------------------------------
   CSS variable helpers (for inline styles / JS)
   ---------------------------------------------------------- */

/** Returns a var(--spk-...) reference string */
export function spkVar(token: string): string {
  return `var(--spk-${token})`;
}

/**
 * Minimal inline-style object for Spektre motion.
 * @example <div style={motionStyle({ delay: stagger[2] })} className="spk-rise" />
 */
export function motionStyle({
  delay = 0,
  duration: dur = duration.reveal,
  easing = ease.spektre,
}: {
  delay?: number;
  duration?: number;
  easing?: string;
} = {}): React.CSSProperties {
  return {
    animationDelay:    `${delay}ms`,
    animationDuration: `${dur}ms`,
    animationTimingFunction: easing,
  };
}

/* ----------------------------------------------------------
   Film-grain opacity levels
   ---------------------------------------------------------- */
export const grain = {
  /** Subtle — full-page body texture */
  subtle: 0.025,
  /** Standard — section panels */
  base:   0.035,
  /** Strong — hero / cinematic contexts */
  strong: 0.048,
} as const;

/* ----------------------------------------------------------
   Type-safe CSS property token (for tailwind className builders)
   ---------------------------------------------------------- */
export const css = {
  color,
  ease,
  duration,
  fontSize,
  lineHeight,
  letterSpacing,
  spacing,
  layout,
  borderRadius,
  grain,
  stagger,
} as const;

export default css;
