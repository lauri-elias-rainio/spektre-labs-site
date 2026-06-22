import * as React from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "grid gap-7 pb-12 sm:gap-8 sm:pb-16 lg:grid-cols-12 lg:gap-12 lg:pb-20",
        // Hairline bottom border using system token
        "border-b border-[var(--line)]",
        className
      )}
    >
      {/* Left gutter — metadata rail lives here on wide screens */}
      <div className="hidden lg:col-span-3 lg:block xl:col-span-3">
        {/* Vertical mono label — Abloh-style index mark */}
        <p className="label mt-2 text-[var(--fg-faint)] [writing-mode:horizontal-tb]">
          — SPEKTRE LABS
        </p>
      </div>

      {/* Right: title + description */}
      <div className="lg:col-span-9 xl:col-span-9">
        <h1
          className={cn(
            // Brushed platinum metal headline
            "metal-text",
            "text-balance font-semibold tracking-[-0.03em] leading-[1.04]",
            "text-[2.05rem] sm:text-[2.6rem] md:text-[3.1rem] lg:text-[3.6rem]",
            // Reveal on mount
            "rise"
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              "mt-5 max-w-[44ch] text-pretty leading-[1.82]",
              "text-[0.98rem] sm:text-[1.05rem]",
              "text-[var(--fg-dim)]",
              // Staggered reveal after title
              "rise"
            )}
            style={{ animationDelay: "120ms" }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
