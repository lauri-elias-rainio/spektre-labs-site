/**
 * SiteFooter — terminal section, OLED stage, platinum-on-black
 *
 * STYLE_LAW: OLED true-black + platinum + one cold signal (#cfe3ff).
 * Perfect bilateral symmetry. Mono Abloh voice — terse, confident, no fluff.
 * σ-honest: no fabricated social proof or revenue claims.
 */
import Link from "next/link";

import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

const NAV = [
  { label: "Artifacts", href: "/artifacts" },
  { label: "Research",  href: "/research" },
  { label: "Method",    href: "/method" },
  { label: "About",     href: "/about" },
] as const;

const EXTERNAL = [
  { label: "GitHub",   href: LINKS.github },
  { label: "ORCID",    href: LINKS.orcid },
] as const;

export function SiteFooter() {
  return (
    <footer className="spektre-stage relative -mx-6 overflow-hidden border-t border-white/10 px-6 pb-14 pt-20 sm:-mx-10 sm:px-10 sm:pb-16 sm:pt-24 lg:-mx-14 lg:px-14 lg:pb-20 lg:pt-28">
      {/* material grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* wordmark row */}
        <div className="flex items-baseline justify-between">
          <span
            className="spektre-metal-text text-[1.5rem] font-semibold tracking-[-0.03em] sm:text-[1.8rem]"
            style={{ fontFamily: "var(--font-display, 'Times New Roman', serif)" }}
          >
            Spektre Labs
          </span>
          <p className="spektre-label hidden sm:block" style={{ color: "#cfe3ff" }}>
            1 = 1 · σ
          </p>
        </div>

        {/* hairline divider */}
        <div className="mt-8 h-px w-full bg-white/10" />

        {/* three-column grid: about / nav / external */}
        <div className="mt-10 grid gap-12 sm:grid-cols-3">
          {/* col 1 — identity */}
          <div>
            <p className="spektre-label" style={{ color: "#4a4f58" }}>
              Lab
            </p>
            <p className="mt-5 text-[0.92rem] leading-[1.85] text-[#888d97]">
              Independent research laboratory.
              <br />
              Helsinki · {lab.author}
            </p>
            <a
              href={LINKS.email}
              className="mt-4 inline-block text-[0.92rem] text-[#888d97] underline decoration-white/20 underline-offset-[0.28rem] transition-colors duration-200 hover:text-[#b9bdc6] hover:decoration-white/40"
            >
              {lab.email}
            </a>
          </div>

          {/* col 2 — site nav */}
          <div>
            <p className="spektre-label" style={{ color: "#4a4f58" }}>
              Site
            </p>
            <nav aria-label="Footer" className="mt-5 flex flex-col gap-3">
              {NAV.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[0.92rem] text-[#888d97] underline-offset-[0.28rem] transition-colors duration-200 hover:text-[#b9bdc6]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* col 3 — external */}
          <div>
            <p className="spektre-label" style={{ color: "#4a4f58" }}>
              External
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {EXTERNAL.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.92rem] text-[#888d97] underline-offset-[0.28rem] transition-colors duration-200 hover:text-[#b9bdc6]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* base row */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
          <p className="spektre-label" style={{ color: "#4a4f58" }}>
            &copy; {new Date().getFullYear()} Spektre Labs · Helsinki
          </p>
          <p className="spektre-label" style={{ color: "#4a4f58" }}>
            Industrial dark-luxury × Atlantean cybernetics
          </p>
        </div>
      </div>
    </footer>
  );
}
