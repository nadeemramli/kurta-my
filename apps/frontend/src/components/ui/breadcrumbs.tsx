import { cn } from "@kurta-my/utils";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Route } from "next";

export interface BreadcrumbItem {
  label: string;
  href?: Route;
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export function Breadcrumbs({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center text-sm text-neutral-500 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && <span className="mx-2">{separator}</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-neutral-900 dark:hover:text-neutral-50"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-neutral-900 dark:text-neutral-50">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
