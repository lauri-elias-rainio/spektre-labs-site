"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { LINKS } from "@/lib/links";
import lab from "@/data/lab.json";

const navItems: Array<{ href: string; label: string }> = [
  { href: "/artifacts", label: "Artifacts" },
  { href: "/research", label: "Research" },
  { href: "/method", label: "Method" },
  { href: "/about", label: "About" },
];

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-neutral-200/70 bg-white/96 backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-950/96",
        className
      )}
    >
      <Container className="py-4 sm:py-[1.15rem]">
        <div className="flex items-baseline justify-between gap-6">
          <Link
            href="/"
            className="text-[0.94rem] font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
          >
            {lab.name}
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
            <div className="flex items-center gap-[1.35rem]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative text-[0.89rem] transition-colors after:absolute after:-bottom-[1.18rem] after:left-0 after:h-px after:w-full after:scale-x-[0.6] after:bg-neutral-950 after:opacity-0 after:transition-all dark:after:bg-neutral-50",
                    isActive(item.href)
                      ? "text-neutral-950 after:scale-x-100 after:opacity-100 dark:text-neutral-50"
                      : "text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-neutral-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ExternalLink href={LINKS.github} className="text-[0.89rem]">
              GitHub
            </ExternalLink>
          </nav>
        </div>

        <nav
          aria-label="Primary mobile"
          className="mt-3 flex gap-4 overflow-x-auto border-t border-neutral-200/70 pt-3 sm:hidden dark:border-neutral-800/70"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b border-transparent pb-1 text-[0.95rem] transition-colors",
                isActive(item.href)
                  ? "border-neutral-950 text-neutral-950 dark:border-neutral-50 dark:text-neutral-50"
                  : "text-neutral-600 dark:text-neutral-400"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ExternalLink href={LINKS.github} className="whitespace-nowrap text-[0.95rem]">
            GitHub
          </ExternalLink>
        </nav>
      </Container>
    </header>
  );
}

