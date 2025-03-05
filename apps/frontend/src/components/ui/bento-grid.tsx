import { cn } from "@/lib/utils";
import React from "react";

interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title?: string;
  description?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function BentoGrid({
  className,
  children,
  columns = 3,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 sm:grid-cols-2": columns === 2,
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": columns === 4,
          "grid-cols-1": columns === 1,
        },
        // Make max-width and padding conditional based on className
        !className?.includes("max-w-none") && "max-w-7xl mx-auto p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  children,
  size = "md",
  ...props
}: BentoItemProps) {
  return (
    <div
      className={cn(
        "group/bento relative overflow-hidden",
        "rounded-xl transition-all duration-200",
        "bg-neutral-900/5 dark:bg-neutral-100/5",
        "border border-neutral-200/10 dark:border-neutral-800",
        // 3D effect styles
        "transform perspective-1000",
        "hover:shadow-2xl hover:shadow-neutral-900/10 dark:hover:shadow-neutral-100/10",
        "hover:-translate-y-1 hover:translate-x-0",
        "hover:rotate-[0.5deg] hover:scale-[1.02]",
        // Size variations
        {
          "row-span-1": size === "sm",
          "row-span-1 sm:row-span-2": size === "lg",
          "p-4": size === "sm",
          "p-6": size === "md",
          "p-8": size === "lg",
        },
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-neutral-900/10 via-neutral-900/5 to-neutral-900/0",
          "dark:from-neutral-100/10 dark:via-neutral-100/5 dark:to-neutral-100/0",
          "opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500",
          // 3D lighting effect
          "after:absolute after:inset-0",
          "after:bg-gradient-to-br after:from-neutral-900/0 after:to-neutral-900/20",
          "after:dark:from-neutral-100/0 after:dark:to-neutral-100/20",
          "after:opacity-0 after:group-hover/bento:opacity-100",
          "after:transition-opacity after:duration-500"
        )}
      />

      <div className="relative h-full">
        {header && <div className="mb-4">{header}</div>}
        {icon && (
          <div className="mb-4 inline-flex rounded-lg bg-neutral-100/50 p-2 dark:bg-neutral-900/50">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 tracking-wide mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
