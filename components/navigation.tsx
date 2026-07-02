"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

// Clarity-first funnel for the parent brand: systems, research, world, identity,
// and contact. Product names stay one level deeper.
const navItems: Array<{ href: string; label: string }> = [
  { href: "/systems", label: "Systems" },
  { href: "/web4", label: "Web4" },
  { href: "/studio", label: "Studio" },
  { href: "/research", label: "Research" },
  { href: "/universe", label: "World" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Contact" },
];

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(0,0,0,0.88)] backdrop-blur-xl",
        className
      )}
    >
      <Container className="py-[1.1rem] sm:py-[1.25rem]">
        <div className="flex items-baseline justify-between gap-6">
          {/* Wordmark — mono label weight, platinum on OLED */}
          <Link
            href="/"
            className="label text-[0.72rem] tracking-[0.28em] text-[var(--metal-1)] transition-colors duration-500 hover:text-[var(--metal-hi)]"
          >
            {lab.name}
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
            <div className="flex items-center gap-[1.6rem]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative text-[0.8rem] tracking-[0.04em] font-medium transition-colors duration-500",
                    "after:absolute after:-bottom-[1.28rem] after:left-0 after:h-px after:w-full",
                    "after:scale-x-0 after:bg-[var(--metal-2)] after:opacity-0",
                    "after:transition-all after:duration-500 after:[transition-timing-function:var(--ease)]",
                    isActive(item.href)
                      ? "text-[var(--fg)] after:scale-x-100 after:opacity-100"
                      : "text-[var(--fg-mute)] hover:text-[var(--fg-dim)] hover:after:scale-x-100 hover:after:opacity-60"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ExternalLink
              href={LINKS.github}
              className="label text-[0.66rem] tracking-[0.22em] text-[var(--fg-faint)] transition-colors duration-500 hover:text-[var(--fg-mute)]"
            >
              GitHub
            </ExternalLink>
          </nav>
        </div>

        {/* Mobile nav */}
        <nav
          aria-label="Primary mobile"
          className="mt-3 flex gap-5 overflow-x-auto border-t border-[var(--line-soft)] pt-3 sm:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b pb-1 text-[0.82rem] tracking-[0.02em] transition-colors duration-500",
                isActive(item.href)
                  ? "border-[var(--metal-3)] text-[var(--fg)]"
                  : "border-transparent text-[var(--fg-mute)] hover:text-[var(--fg-dim)]"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ExternalLink
            href={LINKS.github}
            className="whitespace-nowrap text-[0.82rem] text-[var(--fg-faint)] transition-colors duration-500 hover:text-[var(--fg-mute)]"
          >
            GitHub
          </ExternalLink>
        </nav>
      </Container>
    </header>
  );
}
