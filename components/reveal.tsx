"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/*
  Reveal — Apple-grade scroll reveal. Wraps content and fades/rises it into view once,
  on intersection. Respects prefers-reduced-motion (renders visible, no animation).
  Use `as` to pick the element and `delay` (ms) to stagger siblings.
*/

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  y = 18,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
