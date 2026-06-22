import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
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
      <div
        className={cn(
          "surface surface-hover",
          featured ? "p-8 sm:p-10" : "p-7 sm:p-8"
        )}
      >
        {/* Abloh-grade slug label */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="label">/{artifact.slug}</span>
          {/* hairline indicator dot */}
          <span
            className="block h-1 w-1 rounded-full"
            style={{ background: "var(--metal-4)" }}
          />
        </div>

        {/* title — metal-text on featured, fg-dim on standard */}
        <h3
          className={cn(
            "tracking-tight",
            featured
              ? "metal-text font-semibold text-2xl sm:text-[1.9rem] sm:leading-[1.08]"
              : "font-semibold text-lg text-[var(--fg)]"
          )}
        >
          <Link
            href={`/artifacts/${artifact.slug}`}
            className="inline-block text-balance transition-colors duration-500 hover:text-[var(--metal-1)]"
            style={{ transitionTimingFunction: "var(--ease)" }}
          >
            {artifact.title}
          </Link>
        </h3>

        <p
          className={cn(
            "mt-4 leading-relaxed text-[var(--fg-mute)]",
            featured
              ? "max-w-3xl text-[1.02rem] leading-[1.82] sm:mt-5 sm:text-[1.06rem]"
              : "text-sm sm:mt-4 sm:leading-[1.78]"
          )}
        >
          {description}
        </p>

        {/* hairline rule + meta row */}
        <div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5"
          style={{ borderColor: "var(--line)" }}
        >
          <Link
            href={`/artifacts/${artifact.slug}`}
            className="label transition-colors duration-500 hover:text-[var(--metal-1)]"
            style={{ transitionTimingFunction: "var(--ease)" }}
          >
            View details
          </Link>
          {github ? <ExternalLink href={github}>GitHub</ExternalLink> : null}
          {zenodo ? <ExternalLink href={zenodo}>Zenodo</ExternalLink> : null}
        </div>
      </div>
    </article>
  );
}
