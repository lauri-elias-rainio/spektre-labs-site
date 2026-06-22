import { Container } from "@/components/container";
import { EditorialLink } from "@/components/editorial-link";
import { ExternalLink } from "@/components/external-link";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <Container className="py-14 sm:py-20">
        {/* Hairline top accent — editorial column rule */}
        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left: identity block */}
          <div className="lg:col-span-6 xl:col-span-5">
            {/* Mono wordmark label */}
            <p className="label text-[0.64rem] tracking-[0.28em] text-[var(--fg-faint)]">
              Spektre Labs
            </p>

            {/* Location — generous vertical rhythm */}
            <p className="mt-5 text-[1.05rem] leading-[1.6] tracking-[-0.01em] text-[var(--fg-dim)]">
              {lab.location}
            </p>

            {/* Email — editorial link with subtle underline */}
            <div className="mt-2">
              <EditorialLink
                href={LINKS.email}
                className="text-[0.88rem] text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--fg-dim)]"
              >
                {lab.email}
              </EditorialLink>
            </div>
          </div>

          {/* Right: metadata grid — Abloh mono labels */}
          <div className="lg:col-span-6 xl:col-span-7 lg:justify-self-end">
            <div className="flex flex-col gap-1 border-t border-[var(--line-soft)] pt-5">
              {/* Column header label */}
              <p className="label mb-3 text-[0.62rem] tracking-[0.3em] text-[var(--fg-faint)]">
                External
              </p>

              <div className="flex flex-col items-start gap-[0.85rem]">
                <ExternalLink
                  href={LINKS.orcid}
                  className="label text-[0.72rem] tracking-[0.18em] text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--fg-dim)]"
                >
                  ORCID
                </ExternalLink>
                <ExternalLink
                  href={LINKS.github}
                  className="label text-[0.72rem] tracking-[0.18em] text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--fg-dim)]"
                >
                  GitHub
                </ExternalLink>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rule + copyright line — full-width editorial footer mark */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--line-soft)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-[0.6rem] tracking-[0.24em] text-[var(--fg-faint)]">
            {new Date().getFullYear()} — Spektre Labs
          </p>
          <p className="label text-[0.6rem] tracking-[0.24em] text-[var(--fg-faint)]">
            AI Research · Helsinki
          </p>
        </div>
      </Container>
    </footer>
  );
}
