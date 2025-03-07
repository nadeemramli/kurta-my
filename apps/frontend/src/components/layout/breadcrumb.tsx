"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { Route } from "next";
import { cn } from "@kurta-my/utils";

export function Breadcrumb() {
  const pathname = usePathname();

  // Don't show breadcrumb on homepage
  if (pathname === "/") return null;

  // Convert pathname to breadcrumb items
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = ("/" + pathSegments.slice(0, index + 1).join("/")) as Route;
    return {
      label:
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href,
    };
  });

  return (
    // Main container with dark semi-transparent background and blur effect
    <div className="w-full bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
      {/* Spacer div to prevent content from hiding behind fixed navbar */}
      <div className="h-[70px]" />

      {/* Content container with fixed height and padding */}
      <div className="container mx-auto h-[60px] flex items-center px-6">
        {/* Navigation with breadcrumb items */}
        <nav className="flex items-center space-x-2 text-sm text-neutral-400">
          {/* Home icon link - always shows as first item */}
          <Link
            href="/"
            className="hover:text-neutral-100 transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>

          {/* Map through breadcrumb items to create navigation path */}
          {breadcrumbItems.map((item, index) => (
            <div key={item.href} className="flex items-center">
              {/* Chevron separator between items */}
              <ChevronRight className="h-4 w-4 mx-2 text-neutral-500" />

              {/* Individual breadcrumb link */}
              <Link
                href={item.href}
                className={cn(
                  "hover:text-neutral-100 transition-colors",
                  // Make current page (last item) stand out
                  index === breadcrumbItems.length - 1
                    ? "font-small text-neutral-400"
                    : ""
                )}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
