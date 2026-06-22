"use client";

/**
 * useReducedMotion — SSR-safe hook that returns true when the OS/browser
 * signals prefers-reduced-motion: reduce.
 *
 * - Initializes from the media query so there is no flash on first render.
 * - Listens for live changes (user toggles the OS setting).
 * - Falls back to `false` on the server (SSR) — animations are always
 *   suppressed server-side anyway since JS hasn't run yet.
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   if (reduced) return <StaticFallback />;
 *   return <AnimatedThing />;
 */

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    // Sync once on mount in case SSR value diverged
    setReduced(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
