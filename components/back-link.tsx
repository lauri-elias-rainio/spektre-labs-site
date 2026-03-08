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
        "inline-flex items-center gap-2 text-sm text-neutral-600 underline decoration-transparent underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-50 dark:hover:decoration-neutral-700",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      <span>{children}</span>
    </Link>
  );
}

