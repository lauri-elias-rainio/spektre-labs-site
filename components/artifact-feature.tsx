import { ExternalLink } from "@/components/external-link";
import type { Artifact } from "@/lib/artifacts";
import { cn } from "@/lib/utils";

export function ArtifactFeature({
  artifact,
  className,
}: {
  artifact: Artifact;
  className?: string;
}) {
  const isPrimary = artifact.prominence === "primary";

  return (
    <section className={cn(className)}>
      <div className={cn("max-w-5xl", isPrimary && "lg:pl-8")}>
        <h2
          className={cn(
            "text-balance font-semibold tracking-tight",
            isPrimary
              ? "max-w-[44rem] text-3xl sm:text-4xl lg:text-[3.38rem] lg:leading-[1.01]"
              : "text-2xl sm:text-3xl"
          )}
        >
          {artifact.title}
        </h2>
        <p
          className={cn(
            "mt-5 max-w-4xl text-pretty text-neutral-700 dark:text-neutral-300",
            isPrimary
              ? "max-w-[40rem] text-lg leading-[1.8] sm:text-[1.18rem]"
              : "text-base leading-[1.8]"
          )}
        >
          {artifact.summary}
        </p>
      </div>

      <div className={cn("mt-10 grid gap-8 lg:grid-cols-12", isPrimary ? "lg:gap-12" : "lg:gap-10")}>
        <div
          className={cn(
            "space-y-6 lg:col-span-8",
            isPrimary ? "max-w-4xl lg:pl-8" : "max-w-3xl"
          )}
        >
          {artifact.description.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(
                "text-neutral-600 dark:text-neutral-400",
                paragraph === "K(crit) ~= 0.127"
                  ? "font-mono text-lg text-neutral-800 dark:text-neutral-200"
                  : "text-sm leading-[1.9] sm:text-[1.02rem]"
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <div className="border-t border-neutral-200/80 pt-6 dark:border-neutral-800/80 lg:sticky lg:top-28 lg:w-full lg:max-w-[17rem]">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              Repository
            </p>
            {artifact.github ? (
              <div className="mt-4">
                <ExternalLink href={artifact.github}>{artifact.github}</ExternalLink>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

