"use client";

import { useEffect, useRef } from "react";

/**
 * Reveal — restrained scroll-entrance (STYLE_LAW §6: Apple-grade motion).
 * Progressive: server-rendered visible; only elements still below the fold
 * at mount are hidden (direct DOM style — an external-system sync, no state)
 * and then revealed on intersection. No JS or prefers-reduced-motion →
 * content simply stays visible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.9s var(--spk-ease) ${delay}ms, transform 0.9s var(--spk-ease) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
