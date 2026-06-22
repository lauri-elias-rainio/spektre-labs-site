import Link from "next/link";

import { cn } from "@/lib/utils";

export function EditorialLink({
  href,
  children,
  className,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "text-[0.95rem] leading-snug text-[var(--fg-dim)] underline decoration-[var(--line-strong)] underline-offset-[0.3rem] decoration-[0.5px] transition-colors duration-500 hover:text-[var(--fg)] hover:decoration-[var(--metal-3)]",
        className
      )}
    >
      {children}
    </Link>
  );
}

