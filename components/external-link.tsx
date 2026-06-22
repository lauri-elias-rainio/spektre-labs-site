import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-baseline gap-[0.2em] text-[0.95rem] text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-[0.3rem] decoration-[0.5px] transition-colors duration-500 hover:text-[var(--fg)] hover:decoration-[var(--metal-3)]",
        className
      )}
    >
      <span>{children}</span>
      <ArrowUpRight
        className="mb-px h-[0.8rem] w-[0.8rem] shrink-0 opacity-50 transition-opacity duration-500 group-hover:opacity-100"
        style={{ color: "var(--metal-3)" }}
        aria-hidden
      />
    </Link>
  );
}

