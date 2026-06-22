import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import type { Artifact } from "@/lib/artifacts";

export function ArtifactCard({
  artifact,
  description = artifact.summary,
  featured = false,
  className,
  index = 0,
}: {
  artifact: Artifact;
  description?: string;
  featured?: boolean;
  className?: string;
  index?: number;
}) {
  const github = artifact.github?.trim();
  const zenodo = artifact.zenodo?.trim();

  return (
    <Reveal delay={index * 80} className={cn("group", className)}>
      <article>
        <div
          className={cn(
            "surface surface-hover relative overflow-hidden",
            featured ? "p-8 sm:p-10 lg:p-12" : "p-7 sm:p-8"
          )}
        >
          {/* top metadata rail — Abloh mono label + glyph node tick */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Glyph
                variant="node"
                size={14}
                strokeOpacity={featured ? 0.7 : 0.45}
              />
              <span className="label">/{artifact.slug}</span>
            </div>
            {featured && (
              <span
                className="label"
                style={{ color: "var(--signal)", opacity: 0.7 }}
              >
                Primary
              </span>
            )}
          </div>

          {/* title */}
          <h3
            className={cn(
              "tracking-tight",
              featured
                ? "metal-text font-semibold text-2xl sm:text-[2.1rem] sm:leading-[1.06]"
                : "font-semibold text-lg leading-[1.22] text-[var(--fg)]"
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
              "leading-relaxed text-[var(--fg-mute)]",
              featured
                ? "mt-5 max-w-3xl text-[1.02rem] leading-[1.84] sm:mt-6 sm:text-[1.06rem]"
                : "mt-4 text-sm sm:mt-4 sm:leading-[1.80]"
            )}
          >
            {description}
          </p>

          {/* hairline rule + action row */}
          <div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-5"
            style={{ borderColor: "var(--line)" }}
          >
            <Link
              href={`/artifacts/${artifact.slug}`}
              className="label transition-colors duration-500 hover:text-[var(--metal-1)]"
              style={{
                transitionTimingFunction: "var(--ease)",
                color: "var(--fg-dim)",
              }}
            >
              View details →
            </Link>
            {github ? (
              <ExternalLink href={github}>GitHub</ExternalLink>
            ) : null}
            {zenodo ? (
              <ExternalLink href={zenodo}>Zenodo</ExternalLink>
            ) : null}
          </div>

          {/* specular edge glint on featured */}
          {featured && (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.18) 60%, transparent 100%)",
              }}
            />
          )}
        </div>
      </article>
    </Reveal>
  );
}
