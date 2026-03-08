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
        "grid gap-7 border-b border-neutral-200/80 pb-12 dark:border-neutral-800/80 sm:gap-8 sm:pb-16 lg:grid-cols-12 lg:gap-12 lg:pb-20",
        className
      )}
    >
      <div className="lg:col-span-2 xl:col-span-3" />

      <div className="lg:col-span-10 xl:col-span-9">
        <h1 className="text-balance text-[2.05rem] font-semibold tracking-tight sm:text-[2.42rem] md:text-[2.82rem] md:leading-[1.03] lg:text-[3.05rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-[38rem] text-pretty text-[0.98rem] leading-[1.85] text-neutral-600 dark:text-neutral-400 sm:text-[1.03rem] lg:mt-5">
            {description}
          </p>
        ) : null}
      </div>
    </header>
  );
}

