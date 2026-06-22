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
        // Base glass surface from design system
        "surface surface-hover",
        // Rounded to system radius
        "rounded-[var(--radius)]",
        // Reveal animation
        "rise",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
