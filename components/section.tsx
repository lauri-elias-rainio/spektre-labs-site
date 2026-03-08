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
        "mt-24 border-t border-neutral-200/80 pt-12 dark:border-neutral-800/80 sm:mt-32 sm:pt-16 lg:mt-36 lg:pt-20",
        className
      )}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <header className="lg:col-span-2 xl:col-span-3">
          {eyebrow ? (
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-balance text-[1.6rem] font-semibold tracking-tight sm:text-[1.9rem] lg:text-[2rem]">
            {title}
          </h2>
        </header>
        <div className="lg:col-span-10 xl:col-span-9">{children}</div>
      </div>
    </section>
  );
}

