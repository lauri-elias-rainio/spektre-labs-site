import * as React from "react";

import { cn } from "@/lib/utils";

type Item = {
  label: string;
  value: React.ReactNode;
};

export function MetadataList({
  items,
  className,
}: {
  items: Item[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-neutral-200/80 dark:divide-neutral-800/80", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-1.5 py-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5"
        >
          <dt className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
            {item.label}
          </dt>
          <dd className="min-w-0 text-[0.96rem] leading-[1.8] text-neutral-700 dark:text-neutral-300">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

