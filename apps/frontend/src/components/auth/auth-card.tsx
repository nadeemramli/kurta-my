import { BentoGridItem } from "@/components/ui/bento-grid";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <BentoGridItem
      className={cn("w-full max-w-md mx-auto", className)}
      {...props}
    >
      <div className="flex flex-col items-center text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">{children}</div>

      {footer && (
        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          {footer}
        </div>
      )}
    </BentoGridItem>
  );
}
