import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base — shared geometry, focus ring, disabled, smooth transition
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-[calc(var(--radius)*0.57)] text-sm font-medium tracking-[0.03em]",
    "transition-[filter,transform,border-color,background-color,opacity]",
    "duration-400 [transition-timing-function:var(--ease)]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--metal-2)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)]",
    "disabled:pointer-events-none disabled:opacity-40",
  ].join(" "),
  {
    variants: {
      variant: {
        // Primary — brushed chrome face (.btn-metal aligned)
        default: [
          "btn-metal",
          "text-[0.88rem] tracking-[0.02em] font-medium",
        ].join(" "),

        // Secondary — dark surface with hairline border
        secondary: [
          "bg-[var(--bg-3)] text-[var(--fg-dim)] border border-[var(--line)]",
          "hover:border-[var(--line-strong)] hover:text-[var(--fg)]",
          "hover:bg-[var(--bg-2)]",
        ].join(" "),

        // Outline — ghost border, no fill; signal on hover
        outline: [
          "border border-[var(--line-strong)] bg-transparent text-[var(--fg-mute)]",
          "hover:border-[var(--metal-4)] hover:text-[var(--fg-dim)]",
        ].join(" "),

        // Ghost — pure text, minimal footprint
        ghost: [
          "bg-transparent text-[var(--fg-mute)]",
          "hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--fg-dim)]",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3.5 text-[0.8rem]",
        lg: "h-11 px-6 text-[0.9rem] tracking-[0.03em]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function buttonClassName({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}) {
  return cn(buttonVariants({ variant, size, className }));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
