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
        "relative grid gap-7 pb-14 sm:gap-8 sm:pb-18 lg:grid-cols-12 lg:gap-12 lg:pb-24",
        "border-b border-[var(--line)]",
        className
      )}
    >
      {/* Ambient specular — very faint horizontal streak behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(200,210,230,0.04) 0%, transparent 100%)",
        }}
      />

      {/* Left gutter — metadata rail */}
      <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:gap-5 xl:col-span-3">
        {/* Abloh vertical index mark */}
        <p className="label mt-2 text-[var(--fg-faint)]">— SPEKTRE LABS</p>

        {/* Hairline accent line that aligns with the headline baseline */}
        <div
          aria-hidden="true"
          className="mt-auto h-px w-8 bg-[var(--line-strong)]"
        />
      </div>

      {/* Right: title + description */}
      <div className="lg:col-span-9 xl:col-span-9">
        <h1
          className={cn(
            "metal-text",
            "text-balance font-semibold tracking-[-0.035em] leading-[1.03]",
            "text-[2.1rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem]",
            "rise"
          )}
        >
          {title}
        </h1>

        {description ? (
          <p
            className={cn(
              "mt-6 max-w-[46ch] text-pretty leading-[1.84]",
              "text-[1rem] sm:text-[1.08rem]",
              "text-[var(--fg-dim)]",
              "rise"
            )}
            style={{ animationDelay: "130ms" }}
          >
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}
