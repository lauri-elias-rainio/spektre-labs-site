import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";

export function BackLink({
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
      className={cn(
        "group inline-flex items-center gap-2.5 text-[0.8rem] tracking-[0.06em] uppercase font-mono transition-colors duration-500",
        className
      )}
      style={{ color: "var(--fg-faint)" }}
    >
      <ArrowLeft
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 group-hover:-translate-x-0.5"
        style={{ color: "var(--fg-mute)" }}
        aria-hidden
      />
      <span className="group-hover:text-[var(--fg-dim)] transition-colors duration-500">
        {children}
      </span>
    </Link>
  );
}

