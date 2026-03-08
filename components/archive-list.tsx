import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { SurfaceCard } from "@/components/surface-card";
import type { Artifact } from "@/lib/artifacts";

export function ArchiveList({ items }: { items: Artifact[] }) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] gap-4 border-b border-neutral-200/80 px-6 py-4 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400 md:grid">
        <div>Title</div>
        <div>Description</div>
        <div>Links</div>
      </div>

      <div>
        {items.map((item) => (
          <div
            key={item.slug}
            className="grid gap-5 border-b border-neutral-200/80 px-6 py-6 last:border-b-0 dark:border-neutral-800/80 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] md:items-start md:px-8 md:py-7"
          >
            <div>
              <Link
                href={`/artifacts/${item.slug}`}
                className="text-base font-medium tracking-tight text-neutral-950 transition-colors hover:text-neutral-700 dark:text-neutral-50 dark:hover:text-neutral-200"
              >
                {item.title}
              </Link>
              <p className="mt-1 font-mono text-[0.7rem] text-neutral-400 dark:text-neutral-500">
                /{item.slug}
              </p>
            </div>

            <p className="text-sm leading-[1.75] text-neutral-600 dark:text-neutral-400">
              {item.summary}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 md:justify-end">
              <Link
                href={`/artifacts/${item.slug}`}
                className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              >
                Open
              </Link>
              {item.github ? <ExternalLink href={item.github}>GitHub</ExternalLink> : null}
              {item.zenodo ? <ExternalLink href={item.zenodo}>Zenodo</ExternalLink> : null}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

