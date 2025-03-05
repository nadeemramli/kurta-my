import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  is3D?: boolean;
  variant?: "default" | "contained" | "full";
}

export function Container({
  className,
  children,
  is3D = false,
  variant = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full relative",
        // Variant-specific styles
        variant === "default" && "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto",
        variant === "contained" && "max-w-7xl mx-auto px-4",
        variant === "full" && "",
        // Common styles
        "bg-gradient-to-b from-neutral-50/50 to-neutral-100/50",
        "dark:from-neutral-950 dark:to-neutral-900",
        "backdrop-blur-sm",
        // 3D effects
        is3D && [
          "transform perspective-1000",
          "hover:shadow-2xl hover:shadow-neutral-900/10 dark:hover:shadow-neutral-100/10",
          "hover:-translate-y-0.5 hover:translate-x-0",
          "hover:rotate-[0.1deg] hover:scale-[1.005]",
          "transition-all duration-200",
          "after:absolute after:inset-0",
          "after:bg-gradient-to-br after:from-neutral-900/0 after:to-neutral-900/10",
          "after:dark:from-neutral-100/0 after:dark:to-neutral-100/10",
          "after:opacity-0 after:hover:opacity-100",
          "after:transition-opacity after:duration-500",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
