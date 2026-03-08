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
        "text-[0.95rem] text-neutral-700 underline decoration-neutral-300 underline-offset-[0.28rem] transition-colors hover:text-neutral-950 hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-700 dark:hover:text-neutral-50 dark:hover:decoration-neutral-500",
        className
      )}
    >
      {children}
    </Link>
  );
}

