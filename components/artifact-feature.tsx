import Link from "next/link";

import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import type { Artifact } from "@/lib/artifacts";
import { cn } from "@/lib/utils";

/* Inline product badge for σ-gate */
function ProductBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[0.68rem] font-mono tracking-widest uppercase"
      style={{
        border: "1px solid var(--line-strong)",
        color: "var(--signal)",
        background: "rgba(207, 227, 255, 0.05)",
      }}
    >
      {children}
    </span>
  );
}

export function ArtifactFeature({
  artifact,
  className,
}: {
  artifact: Artifact;
  className?: string;
}) {
  const isPrimary = artifact.prominence === "primary";
  const isSigmaGate = artifact.slug === "sigma-gate";
  const isCorpus = artifact.slug === "spektre-corpus";
  const github = artifact.github?.trim();

  return (
    <section className={cn(className)}>
      <div className={cn("max-w-5xl", isPrimary && "lg:pl-8")}>
        {/* Abloh quotation device + glyph */}
        <Reveal delay={0}>
          <div className="mb-6 flex items-center gap-4">
            <Glyph
              variant="node"
              size={16}
              strokeOpacity={isPrimary ? 0.65 : 0.45}
            />
            <p className="label text-[var(--fg-faint)]">
              &ldquo;{artifact.slug}&rdquo;
            </p>
            {isSigmaGate && (
              <ProductBadge>Open Core · Hosted</ProductBadge>
            )}
            {isCorpus && (
              <ProductBadge>Research Program</ProductBadge>
            )}
          </div>
        </Reveal>

        <Reveal delay={60}>
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
        </Reveal>

        <Reveal delay={100}>
          <p
            className={cn(
              "mt-6 text-pretty",
              isPrimary
                ? "max-w-[40rem] text-lg leading-[1.84] text-[var(--fg-dim)] sm:text-[1.18rem]"
                : "max-w-4xl text-base leading-[1.82] text-[var(--fg-mute)]"
            )}
          >
            {artifact.summary}
          </p>
        </Reveal>
      </div>

      <div
        className={cn(
          "mt-14 grid gap-8 lg:grid-cols-12",
          isPrimary ? "lg:gap-16" : "lg:gap-12"
        )}
      >
        {/* body prose */}
        <div
          className={cn(
            "space-y-7 lg:col-span-8",
            isPrimary ? "max-w-4xl lg:pl-8" : "max-w-3xl"
          )}
        >
          {artifact.description.map((paragraph, i) => (
            <Reveal key={paragraph} delay={120 + i * 50}>
              <p
                className={cn(
                  paragraph === "K(crit) ~= 0.127"
                    ? "font-mono text-lg text-[var(--signal)] tracking-tight"
                    : "text-[var(--fg-mute)] text-sm leading-[1.94] sm:text-[1.02rem]"
                )}
              >
                {paragraph}
              </p>
            </Reveal>
          ))}

          {/* σ-gate product block — CTA + feature bullets */}
          {isSigmaGate && (
            <Reveal delay={300}>
              <div
                className="surface mt-10 p-7 sm:p-8"
                style={{ borderColor: "var(--line-strong)" }}
              >
                {/* what it does */}
                <p className="label mb-5 text-[var(--fg-faint)]">
                  What it does
                </p>
                <ul className="space-y-3">
                  {[
                    "Deterministic secret-leak detection — zero model calls, zero network",
                    "Prompt-injection & jailbreak interception before AI output lands",
                    "Structural coherence (σ) scoring: declared vs. realized alignment",
                    "Sub-100µs per call — drop-in for any agent pipeline",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-[1.80] text-[var(--fg-mute)]"
                    >
                      <Glyph
                        variant="node"
                        size={12}
                        strokeOpacity={0.5}
                        className="mt-0.5 shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-7 flex flex-wrap items-center gap-5 border-t pt-6"
                  style={{ borderColor: "var(--line)" }}
                >
                  {github && (
                    <Link
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-metal inline-flex items-center gap-2 rounded-[8px] px-5 py-2.5 text-sm font-semibold tracking-tight"
                    >
                      Open on GitHub →
                    </Link>
                  )}
                  <span
                    className="label"
                    style={{ color: "var(--fg-faint)" }}
                  >
                    Open core · self-hostable · hosted API available
                  </span>
                </div>
              </div>
            </Reveal>
          )}

          {/* Corpus navigable-set feel */}
          {isCorpus && (
            <Reveal delay={280}>
              <div
                className="mt-8 border-t pt-7"
                style={{ borderColor: "var(--line)" }}
              >
                <p className="label mb-5 text-[var(--fg-faint)]">
                  Formal domains
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    "Physics",
                    "Information Theory",
                    "Artificial Intelligence",
                    "Cognition",
                    "Institutional Dynamics",
                    "Cosmological Systems",
                  ].map((domain) => (
                    <div
                      key={domain}
                      className="surface rounded-[8px] px-4 py-3"
                    >
                      <span className="text-xs leading-snug text-[var(--fg-mute)]">
                        {domain}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>

        {/* sticky sidebar */}
        <div className="lg:col-span-4 lg:flex lg:justify-end">
          <Reveal delay={160} className="w-full lg:max-w-[17rem]">
            <div
              className="border-t pt-6 lg:sticky lg:top-28"
              style={{ borderColor: "var(--line-strong)" }}
            >
              <p className="label mb-4">Repository</p>
              {artifact.github ? (
                <div className="surface rounded-[10px] p-4">
                  <ExternalLink href={artifact.github}>
                    {artifact.github}
                  </ExternalLink>
                </div>
              ) : (
                <p className="text-sm text-[var(--fg-faint)]">Unreleased</p>
              )}

              {/* cross-links — Palantir linkage */}
              <div className="mt-8">
                <p className="label mb-4 text-[var(--fg-faint)]">See also</p>
                <div className="space-y-2">
                  {artifact.slug !== "spektre-corpus" && (
                    <Link
                      href="/artifacts/spektre-corpus"
                      className="label flex items-center gap-2 transition-colors duration-500 hover:text-[var(--metal-1)]"
                      style={{
                        transitionTimingFunction: "var(--ease)",
                        color: "var(--fg-dim)",
                      }}
                    >
                      <Glyph variant="node" size={10} strokeOpacity={0.4} />
                      Spektre Corpus
                    </Link>
                  )}
                  {artifact.slug !== "spektre-protocol" && (
                    <Link
                      href="/artifacts/spektre-protocol"
                      className="label flex items-center gap-2 transition-colors duration-500 hover:text-[var(--metal-1)]"
                      style={{
                        transitionTimingFunction: "var(--ease)",
                        color: "var(--fg-dim)",
                      }}
                    >
                      <Glyph variant="node" size={10} strokeOpacity={0.4} />
                      Spektre Protocol
                    </Link>
                  )}
                  {artifact.slug !== "sigma-gate" && (
                    <Link
                      href="/artifacts/sigma-gate"
                      className="label flex items-center gap-2 transition-colors duration-500 hover:text-[var(--metal-1)]"
                      style={{
                        transitionTimingFunction: "var(--ease)",
                        color: "var(--fg-dim)",
                      }}
                    >
                      <Glyph variant="node" size={10} strokeOpacity={0.4} />
                      σ-gate
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
