import { cn } from "@/lib/utils";
import { BentoGridItem } from "./bento-grid";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Section({
  className,
  children,
  title,
  description,
  action,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative py-8 md:py-12", "overflow-hidden", className)}
      {...props}
    >
      {(title || description || action) && (
        <BentoGridItem className="mb-8 text-center bg-transparent border-none">
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </BentoGridItem>
      )}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-b from-neutral-900/5 to-neutral-900/10",
            "dark:from-neutral-100/5 dark:to-neutral-100/10",
            "opacity-0 group-hover:opacity-100 transition duration-500"
          )}
        />
        {children}
      </div>
    </section>
  );
}
