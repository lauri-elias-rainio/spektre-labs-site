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
        "mt-24 pt-12 sm:mt-32 sm:pt-16 lg:mt-36 lg:pt-20",
        className
      )}
    >
      {/* Hairline rule — full-bleed editorial divider */}
      <div className="rule mb-10 sm:mb-12 lg:mb-14" />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left column: eyebrow + title */}
        <header className="lg:col-span-3 xl:col-span-3">
          {eyebrow ? (
            <p className="label mb-4 text-[var(--fg-mute)]">{eyebrow}</p>
          ) : null}
          <h2
            className={cn(
              "text-balance text-[1.6rem] font-semibold tracking-[-0.02em] leading-[1.12]",
              "text-[var(--fg)] sm:text-[1.9rem] lg:text-[2rem]",
              "transition-colors duration-500"
            )}
          >
            {title}
          </h2>
        </header>

        {/* Right column: content */}
        <div className="lg:col-span-9 xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}
