import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { SurfaceCard } from "@/components/surface-card";
import { cn } from "@/lib/utils";
import type { Artifact } from "@/lib/artifacts";

export function ArtifactCard({
  artifact,
  description = artifact.summary,
  featured = false,
  className,
}: {
  artifact: Artifact;
  description?: string;
  featured?: boolean;
  className?: string;
}) {
  const github = artifact.github?.trim();
  const zenodo = artifact.zenodo?.trim();

  return (
    <article className={cn("group", className)}>
      <SurfaceCard
        className={cn(
          "transition-colors duration-200 hover:border-neutral-300 dark:hover:border-neutral-700",
          featured ? "p-8 sm:p-10" : "p-7 sm:p-8"
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="font-mono text-[0.7rem] text-neutral-400 dark:text-neutral-500">
            /{artifact.slug}
          </span>
        </div>
        <h3
          className={cn(
            "font-semibold tracking-tight",
            featured ? "text-2xl sm:text-[1.9rem] sm:leading-[1.1]" : "text-lg"
          )}
        >
          <Link
            href={`/artifacts/${artifact.slug}`}
            className="mt-3 inline-block text-balance transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            {artifact.title}
          </Link>
        </h3>
        <p
          className={cn(
            "mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400",
            featured ? "max-w-3xl text-base sm:mt-4 sm:text-[1.05rem] sm:leading-[1.8]" : "text-sm sm:mt-4"
          )}
        >
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-neutral-200/80 pt-5 dark:border-neutral-800/80">
          <Link
            href={`/artifacts/${artifact.slug}`}
            className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            View details
          </Link>
          {github ? <ExternalLink href={github}>GitHub</ExternalLink> : null}
          {zenodo ? <ExternalLink href={zenodo}>Zenodo</ExternalLink> : null}
        </div>
      </SurfaceCard>
    </article>
  );
}


