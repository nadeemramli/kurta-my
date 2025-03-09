import * as React from "react";
import { cn } from "@kurta-my/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-neutral-900/10 text-neutral-900 dark:bg-neutral-50/10 dark:text-neutral-50":
            variant === "default",
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80":
            variant === "secondary",
          "border-transparent bg-red-500/10 text-red-500":
            variant === "destructive",
          "border border-neutral-200 dark:border-neutral-800":
            variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
