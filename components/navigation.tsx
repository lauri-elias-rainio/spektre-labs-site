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
  { href: "/guard", label: "Guard" },
  { href: "/research", label: "Research" },
  { href: "/method", label: "Method" },
  { href: "/about", label: "About" },
];

/**
 * OLED navigation band — true-black glass, platinum type, hairline rule.
 * One system with the stage below it (STYLE_LAW §8: one theme).
 */
export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur-md",
        className
      )}
    >
      <Container className="py-4 sm:py-[1.15rem]">
        <div className="flex items-baseline justify-between gap-6">
          <Link
            href="/"
            className="spektre-metal-text text-[1.06rem] tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-display), 'Times New Roman', serif" }}
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
                    "relative text-[0.89rem] transition-colors after:absolute after:-bottom-[1.18rem] after:left-0 after:h-px after:w-full after:scale-x-[0.6] after:bg-[#edf0f4] after:opacity-0 after:transition-all",
                    isActive(item.href)
                      ? "text-[#edf0f4] after:scale-x-100 after:opacity-100"
                      : "text-[#888d97] hover:text-[#dadee5]"
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
          className="mt-3 flex gap-4 overflow-x-auto border-t border-white/10 pt-3 sm:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap border-b border-transparent pb-1 text-[0.95rem] transition-colors",
                isActive(item.href)
                  ? "border-[#edf0f4] text-[#edf0f4]"
                  : "text-[#888d97]"
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
