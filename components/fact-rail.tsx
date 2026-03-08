import { SurfaceCard } from "@/components/surface-card";
import type { ReactNode } from "react";

export function FactRail({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <SurfaceCard className="p-7 sm:p-8">
      <dl className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
        {items.map((item) => (
          <div key={item.label} className="py-4 first:pt-0 last:pb-0">
            <dt className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              {item.label}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </SurfaceCard>
  );
}

