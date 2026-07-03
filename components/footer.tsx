import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { Glyph } from "@/components/glyph";
import { Reveal } from "@/components/reveal";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

/* Balanced link grid for the brand footer. */
const EXTERNAL_LINKS: Array<{ key: string; label: string; href: string; meta: string }> = [
  { key: "github",   label: "GitHub",   href: LINKS.github,   meta: "src" },
  { key: "youtube",  label: "YouTube",  href: LINKS.youtube,  meta: "studio" },
  { key: "orcid",    label: "ORCID",    href: LINKS.orcid,    meta: "research" },
  { key: "zenodo",   label: "Zenodo",   href: LINKS.zenodo,   meta: "corpus" },
  { key: "linkedin", label: "LinkedIn", href: LINKS.linkedin, meta: "contact" },
  { key: "email",    label: "Email",    href: LINKS.email,    meta: "direct" },
];

const LEFT_LINKS  = EXTERNAL_LINKS.slice(0, 3);
const RIGHT_LINKS = EXTERNAL_LINKS.slice(3);

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      {/* Glyph divider. */}
      <div className="flex justify-center pt-14 sm:pt-20">
        <Reveal delay={0} y={12}>
          <Glyph variant="divider" size={200} strokeOpacity={0.35} />
        </Reveal>
      </div>

      <Container className="pb-16 pt-10 sm:pb-24 sm:pt-14">
        {/* ── Seal + Wordmark ── */}
        <Reveal delay={60} y={20}>
          <div className="mb-16 flex flex-col items-center gap-5 sm:mb-20">
            <Glyph variant="seal" size={72} strokeOpacity={0.28} />
            <div className="flex flex-col items-center gap-1">
              <p className="label text-[0.62rem] tracking-[0.36em] text-[var(--fg-faint)]">
                {lab.name.toUpperCase()}
              </p>
              <p
                className="label text-[0.55rem] tracking-[0.22em] text-[var(--fg-faint)]"
                style={{ opacity: 0.52 }}
              >
                DECLARED = REALIZED
              </p>
            </div>
          </div>
        </Reveal>

        {/* ── Link grid — 3 left · 3 right ── */}
        <Reveal delay={100} y={16}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-0">
            {/* Left column */}
            <div className="flex flex-col gap-[0.9rem] sm:items-end sm:pr-12 lg:pr-20">
              <p className="label mb-1 text-[0.58rem] tracking-[0.32em] text-[var(--fg-faint)]"
                 style={{ opacity: 0.5 }}>
                EXTERNAL
              </p>
              {LEFT_LINKS.map((link) => (
                <div key={link.key} className="flex items-baseline gap-2 sm:flex-row-reverse">
                  <span
                    className="label text-[0.55rem] tracking-[0.18em] text-[var(--fg-faint)]"
                    style={{ opacity: 0.38 }}
                  >
                    [{link.meta}]
                  </span>
                  <ExternalLink
                    href={link.href}
                    className="label text-[0.7rem] tracking-[0.2em] text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--metal-2)]"
                  >
                    {link.label}
                  </ExternalLink>
                </div>
              ))}
            </div>

            {/* Center hairline rule. */}
            <div className="hidden sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-2">
              <div className="h-full w-px bg-gradient-to-b from-transparent via-[var(--line-strong)] to-transparent" />
              <Glyph variant="node" size={10} strokeOpacity={0.4} />
              <div className="h-full w-px bg-gradient-to-b from-transparent via-[var(--line-strong)] to-transparent" />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-[0.9rem] sm:items-start sm:pl-12 lg:pl-20">
              <p className="label mb-1 text-[0.58rem] tracking-[0.32em] text-[var(--fg-faint)]"
                 style={{ opacity: 0.5 }}>
                IDENTITY
              </p>
              {RIGHT_LINKS.map((link) => (
                <div key={link.key} className="flex items-baseline gap-2">
                  <ExternalLink
                    href={link.href}
                    className="label text-[0.7rem] tracking-[0.2em] text-[var(--fg-mute)] transition-colors duration-500 hover:text-[var(--metal-2)]"
                  >
                    {link.label}
                  </ExternalLink>
                  <span
                    className="label text-[0.55rem] tracking-[0.18em] text-[var(--fg-faint)]"
                    style={{ opacity: 0.38 }}
                  >
                    [{link.meta}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Coordinate stamp — closing brand moment ── */}
        <Reveal delay={140} y={12}>
          <div className="mt-14 flex flex-col items-center gap-[0.55rem] border-t border-[var(--line-soft)] pt-8 sm:mt-16">
            <p className="label text-[0.62rem] tracking-[0.28em] text-[var(--fg-faint)]">
              {lab.author}
            </p>
            <p
              className="label text-center text-[0.56rem] tracking-[0.22em] text-[var(--fg-faint)]"
              style={{ opacity: 0.45 }}
            >
              60.17°N · 24.94°E · HELSINKI · EST. MMXXVI · σ DECLARED=REALIZED
            </p>
            <p
              className="label text-[0.53rem] tracking-[0.22em] text-[var(--fg-faint)]"
              style={{ opacity: 0.35 }}
            >
              ORCID {lab.orcid}
            </p>
          </div>
        </Reveal>

        {/* ── Bottom mark — year · domains ── */}
        <Reveal delay={180} y={8}>
          <div className="mt-10 flex flex-col items-center gap-[0.4rem] sm:flex-row sm:justify-between">
            <p className="label text-[0.58rem] tracking-[0.24em] text-[var(--fg-faint)]"
               style={{ opacity: 0.4 }}>
              {new Date().getFullYear()} — {lab.name}
            </p>
            <p
              className="label text-[0.58rem] tracking-[0.24em] text-[var(--fg-faint)]"
              style={{ opacity: 0.4 }}
            >
              Labs · Systems · Studio · Intelligence · Compute · Health
            </p>
          </div>
        </Reveal>
      </Container>
    </footer>
  );
}
