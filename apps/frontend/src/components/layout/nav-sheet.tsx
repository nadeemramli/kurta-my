"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Route } from "next";
import { cn } from "@/lib/utils";
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
      { label: "New Arrivals", href: "/products/new" as Route },
      { label: "Best Sellers", href: "/products/best-sellers" as Route },
      { label: "Sale", href: "/products/sale" as Route },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", href: "/contact" as Route },
      { label: "FAQs", href: "/faqs" as Route },
      { label: "Shipping", href: "/shipping" as Route },
      { label: "Returns", href: "/returns" as Route },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy" as Route },
      { label: "Terms of Service", href: "/terms" as Route },
      { label: "Refund Policy", href: "/refund" as Route },
    ],
  },
  {
    title: "Blog",
    links: [
      { label: "Latest Posts", href: "/blog" as Route },
      { label: "Style Guide", href: "/blog/style-guide" as Route },
      { label: "Lookbook", href: "/blog/lookbook" as Route },
    ],
  },
  {
    title: "Loyalty",
    links: [
      { label: "Rewards Program", href: "/rewards" as Route },
      { label: "Referral Program", href: "/referral" as Route },
    ],
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
