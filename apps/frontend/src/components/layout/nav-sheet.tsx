"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Route } from "next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NavLink {
  label: string;
  href: Route;
}

interface NavDirectory {
  title: string;
  links: NavLink[];
}

const directories: NavDirectory[] = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" as Route },
      { label: "Brands", href: "/brands" as Route },
      { label: "Categories", href: "/categories" as Route },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Blog", href: "/blog" as Route },
      { label: "Latest Posts", href: "/blog/latest" as Route },
      { label: "Categories", href: "/blog/categories" as Route },
    ],
  },
  {
    title: "Program",
    links: [{ label: "The Kurta Royalty", href: "/loyalty" as Route }],
  },
];

export function NavSheet({ isOpen, onOpenChange }: NavSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-sm">
        <SheetHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
          <SheetTitle>Menu</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          {directories.map((directory) => (
            <div key={directory.title} className="space-y-3">
              <h2 className="text-lg font-semibold">{directory.title}</h2>
              <div className="grid gap-2">
                {directory.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                    onClick={() => onOpenChange(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
