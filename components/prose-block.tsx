import * as React from "react";

import { cn } from "@/lib/utils";

export function ProseBlock({
  children,
  className,
  size = "body",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "lead" | "body";
}) {
  return (
    <div
      className={cn(
        // Tight editorial measure — no wide rivers
        "max-w-[52ch] space-y-6",
        // Ink: dim not muted — readable but recessive against headings
        "text-[var(--fg-dim)]",
        // Size tiers
        size === "lead"
          ? [
              "text-base leading-[1.84] sm:text-[1.05rem]",
              // Lead: slightly brighter
              "text-[var(--fg-dim)]",
            ]
          : [
              "text-[0.9375rem] leading-[1.9] sm:text-[0.975rem]",
              // Body: truly dim, comfortable in long runs
              "text-[var(--fg-mute)]",
            ],
        // Smooth prose transitions on hover contexts
        "transition-colors duration-500",
        className
      )}
    >
      {children}
    </div>
  );
}
