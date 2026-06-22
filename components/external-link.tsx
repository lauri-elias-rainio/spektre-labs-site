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
        "inline-flex items-center gap-1 text-[0.95rem] text-neutral-700 underline decoration-neutral-300 underline-offset-[0.28rem] transition-colors hover:text-neutral-950 hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-700 dark:hover:text-neutral-50 dark:hover:decoration-neutral-500",
        className
      )}
    >
      <span>{children}</span>
      {/* The icon is decorative; the SR hint below announces the new-tab behaviour */}
      <ArrowUpRight className="mt-px h-[0.88rem] w-[0.88rem]" aria-hidden />
      <span className="sr-only">(opens in new tab)</span>
    </Link>
  );
}
