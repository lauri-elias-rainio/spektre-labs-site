import { cn } from "@/lib/utils";

export function ProseBlock({
  children,
  className,
  size = "body",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "lead" | "body";
}) {
  return (
    <div
      className={cn(
        "max-w-4xl space-y-6 text-neutral-600 dark:text-neutral-400",
        size === "lead"
          ? "text-base leading-[1.84] sm:text-[1.03rem]"
          : "text-sm leading-[1.88] sm:text-[1.01rem]",
        className
      )}
    >
      {children}
    </div>
  );
}

