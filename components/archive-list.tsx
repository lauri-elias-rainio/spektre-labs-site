import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import type { Artifact } from "@/lib/artifacts";

export function ArchiveList({ items }: { items: Artifact[] }) {
  return (
    <div className="surface overflow-hidden">
      {/* column headers — Abloh-style mono metadata row */}
      <div
        className="hidden grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-4 border-b px-6 py-4 md:grid"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="label">Title</div>
        <div className="label">Description</div>
        <div className="label">Links</div>
      </div>

      <div>
        {items.map((item, i) => (
          <div
            key={item.slug}
            className="rise grid gap-5 border-b px-6 py-7 last:border-b-0 transition-colors duration-500 hover:bg-[rgba(255,255,255,0.02)] md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] md:items-start md:px-8"
            style={{
              borderColor: "var(--line)",
              transitionTimingFunction: "var(--ease)",
              animationDelay: `${i * 60}ms`,
            }}
          >
            {/* title + slug */}
            <div>
              <Link
                href={`/artifacts/${item.slug}`}
                className="text-base font-medium tracking-tight text-[var(--fg)] transition-colors duration-500 hover:text-[var(--metal-1)]"
                style={{ transitionTimingFunction: "var(--ease)" }}
              >
                {item.title}
              </Link>
              <p className="label mt-1.5">/{item.slug}</p>
            </div>

            {/* summary */}
            <p className="text-sm leading-[1.82] text-[var(--fg-mute)]">
              {item.summary}
            </p>

            {/* actions */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
              <Link
                href={`/artifacts/${item.slug}`}
                className="label transition-colors duration-500 hover:text-[var(--metal-1)]"
                style={{ transitionTimingFunction: "var(--ease)" }}
              >
                Open
              </Link>
              {item.github ? (
                <ExternalLink href={item.github}>GitHub</ExternalLink>
              ) : null}
              {item.zenodo ? (
                <ExternalLink href={item.zenodo}>Zenodo</ExternalLink>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
