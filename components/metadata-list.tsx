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
    <dl className={cn("", className)}>
      {items.map((item, i) => (
        <div
          key={item.label}
          className="rise grid gap-2 border-b border-[var(--line)] py-5 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8 sm:items-baseline"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <dt className="label" style={{ color: "var(--fg-faint)", paddingTop: "0.12em" }}>
            {item.label}
          </dt>
          <dd
            className="min-w-0 text-[0.95rem] leading-[1.8]"
            style={{ color: "var(--fg-dim)" }}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

