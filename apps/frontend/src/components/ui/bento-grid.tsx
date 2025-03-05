import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";

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
  image?: string;
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
  icon,
  image,
  ...props
}: BentoItemProps) {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4",
        className
      )}
      {...props}
    >
      {image ? (
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={title || "Product image"}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover/bento:scale-105"
          />
        </div>
      ) : (
        icon && <div className="p-2">{icon}</div>
      )}
      <div>
        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 tracking-wide group-hover/bento:text-black dark:group-hover/bento:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 group-hover/bento:text-neutral-600 dark:group-hover/bento:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  );
}
