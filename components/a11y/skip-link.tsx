/**
 * SkipLink — visible-on-focus keyboard bypass for repetitive nav.
 *
 * Renders sr-only until focused; on focus it surfaces as a platinum-on-black
 * pill in the top-left corner so it reads against both light and OLED-dark
 * backgrounds (contrast ≥ 7:1 in both modes).
 *
 * STYLE_LAW: OLED true-black + platinum; Apple-grade motion (ease-spektre);
 * no animation when prefers-reduced-motion is set (CSS handles it globally).
 */

export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className={[
        // Visually hidden until focused
        "sr-only",
        "focus:not-sr-only",
        // Position & stacking
        "focus:absolute focus:left-4 focus:top-4 focus:z-[200]",
        // Shape
        "focus:inline-flex focus:h-9 focus:items-center focus:justify-center focus:rounded-sm",
        "focus:px-4 focus:text-sm focus:font-medium focus:tracking-[-0.01em]",
        // Light mode: black pill, white text
        "focus:bg-neutral-950 focus:text-white",
        // Dark mode: white pill, black text (inverted for OLED contrast)
        "dark:focus:bg-neutral-50 dark:focus:text-neutral-950",
        // Focus ring (redundant with the visible surface but belt-and-suspenders)
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
        "focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600",
      ].join(" ")}
    >
      Skip to content
    </a>
  );
}
