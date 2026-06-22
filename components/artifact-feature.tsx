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
        {/* Abloh quotation-mark device + kicker label */}
        <p className="label mb-5 text-[var(--fg-faint)]">
          &ldquo;{artifact.slug}&rdquo;
        </p>

        <h2
          className={cn(
            "text-balance tracking-tight",
            isPrimary
              ? "metal-text font-semibold max-w-[44rem] text-3xl sm:text-4xl lg:text-[3.38rem] lg:leading-[1.01]"
              : "font-semibold text-2xl sm:text-3xl text-[var(--fg)]"
          )}
        >
          {artifact.title}
        </h2>

        <p
          className={cn(
            "mt-6 text-pretty text-[var(--fg-dim)]",
            isPrimary
              ? "max-w-[40rem] text-lg leading-[1.82] sm:text-[1.18rem]"
              : "max-w-4xl text-base leading-[1.80]"
          )}
        >
          {artifact.summary}
        </p>
      </div>

      <div
        className={cn(
          "mt-12 grid gap-8 lg:grid-cols-12",
          isPrimary ? "lg:gap-14" : "lg:gap-10"
        )}
      >
        {/* body paragraphs */}
        <div
          className={cn(
            "space-y-7 lg:col-span-8",
            isPrimary ? "max-w-4xl lg:pl-8" : "max-w-3xl"
          )}
        >
          {artifact.description.map((paragraph) => (
            <p
              key={paragraph}
              className={cn(
                paragraph === "K(crit) ~= 0.127"
                  ? "font-mono text-lg text-[var(--signal)] tracking-tight"
                  : "text-[var(--fg-mute)] text-sm leading-[1.92] sm:text-[1.02rem]"
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* sticky sidebar — repository metadata */}
        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <div
            className="border-t pt-6 lg:sticky lg:top-28 lg:w-full lg:max-w-[17rem]"
            style={{ borderColor: "var(--line-strong)" }}
          >
            <p className="label mb-4">Repository</p>
            {artifact.github ? (
              <div
                className="surface rounded-[10px] p-4"
              >
                <ExternalLink href={artifact.github}>
                  {artifact.github}
                </ExternalLink>
              </div>
            ) : (
              <p className="text-sm text-[var(--fg-faint)]">Unreleased</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
