import * as React from "react";

import { cn } from "@/lib/utils";

export function SurfaceCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200/80 bg-[var(--panel)] shadow-[0_1px_0_rgba(23,23,23,0.02)] dark:border-neutral-800/80 dark:shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

