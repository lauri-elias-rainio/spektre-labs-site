import { Container } from "@/components/container";
import { EditorialLink } from "@/components/editorial-link";
import { ExternalLink } from "@/components/external-link";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
              Spektre Labs
            </p>
            <p className="mt-4 text-[0.95rem] text-neutral-600 dark:text-neutral-400">
              {lab.location}
            </p>
            <div className="mt-2">
              <EditorialLink href={LINKS.email} className="text-neutral-600 dark:text-neutral-400">
                {lab.email}
              </EditorialLink>
            </div>
          </div>

          <div className="lg:col-span-7 lg:justify-self-end">
            <div className="min-w-[11rem] border-t border-neutral-200/80 pt-5 dark:border-neutral-800/80">
              <div className="flex flex-col items-start gap-3">
                <ExternalLink href={LINKS.orcid}>ORCID</ExternalLink>
                <ExternalLink href={LINKS.github}>GitHub</ExternalLink>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

