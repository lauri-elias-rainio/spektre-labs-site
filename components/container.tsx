import * as React from "react";

import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // Max-width editorial column — generous gutters at all breakpoints
        "mx-auto w-full max-w-[1200px]",
        "px-6 sm:px-10 lg:px-14 xl:px-16",
        className
      )}
      {...props}
    />
  );
}
