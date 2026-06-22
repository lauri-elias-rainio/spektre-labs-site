"use client";

/*
  CanonVideo — accessible, performant in-canon video.
  · respects prefers-reduced-motion: no autoplay (poster + user controls instead)
  · lazy: plays only while in the viewport, pauses off-screen (saves mobile data)
  · muted/loop/playsInline, preload=none so nothing downloads until needed
*/

import { useEffect, useRef } from "react";

export function CanonVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.controls = true; // honor the preference — let the user start it
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
      aria-label={label}
    />
  );
}
