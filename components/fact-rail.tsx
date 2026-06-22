import type { ReactNode } from "react";

export function FactRail({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className="surface p-7 sm:p-8">
      <dl>
        {items.map((item, i) => (
          <div
            key={item.label}
            className="rise grid gap-2 border-b border-[var(--line)] py-5 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8 sm:items-baseline"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <dt className="label" style={{ color: "var(--fg-faint)", paddingTop: "0.1em" }}>
              {item.label}
            </dt>
            <dd
              className="text-[0.9rem] leading-[1.75]"
              style={{ color: "var(--fg-dim)" }}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

