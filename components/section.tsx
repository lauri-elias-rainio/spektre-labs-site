import * as React from "react";

import { cn } from "@/lib/utils";

export function Section({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "mt-24 pt-10 sm:mt-32 sm:pt-14 lg:mt-40 lg:pt-18",
        className
      )}
    >
      {/* Hairline rule — full-bleed editorial divider */}
      <div className="rule mb-10 sm:mb-13 lg:mb-16" />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left column: eyebrow + title */}
        <header className="lg:col-span-3 xl:col-span-3">
          {eyebrow ? (
            <p className="label mb-4 text-[var(--fg-faint)]">{eyebrow}</p>
          ) : null}
          <h2
            className={cn(
              "text-balance font-semibold tracking-[-0.025em] leading-[1.12]",
              "text-[1.55rem] sm:text-[1.85rem] lg:text-[1.95rem]",
              "text-[var(--fg)]",
              "transition-colors duration-500"
            )}
          >
            {title}
          </h2>

          {/* Subtle accent tick below title */}
          <div
            aria-hidden="true"
            className="mt-5 h-px w-6 bg-[var(--line-strong)]"
          />
        </header>

        {/* Right column: content */}
        <div className="lg:col-span-9 xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}
