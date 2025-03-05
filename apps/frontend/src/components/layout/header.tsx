"use client";

import Link from "next/link";
import { Container } from "../ui/container";
import { Button } from "../ui/button";
import { useCart } from "../cart/cart-context";
import LogoIcon from "../icons/logo";
import { MobileNav } from "./mobile-nav";
import { ShoppingBag, User, Search } from "lucide-react";
import { BentoGridItem } from "../ui/bento-grid";

const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Blog", href: "/blog" },
] as const;

export function Header() {
  const { totalQuantity, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center">
          <BentoGridItem className="flex-1 flex items-center gap-4 p-0 bg-transparent border-none">
            <MobileNav />
            <Link href="/" className="flex items-center space-x-2">
              <LogoIcon className="h-8 w-8" />
              <span className="hidden text-xl font-bold sm:inline-block dark:text-white">
                Kurta MY
              </span>
            </Link>
          </BentoGridItem>

          <BentoGridItem className="flex-1 hidden md:block p-0 bg-transparent border-none">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-neutral-500" />
              </div>
            </div>
          </BentoGridItem>

          <BentoGridItem className="flex-1 flex items-center justify-end gap-2 p-0 bg-transparent border-none">
            <nav className="hidden md:flex gap-6 mr-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-neutral-100 dark:hover:bg-neutral-900"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-medium text-white">
                  {totalQuantity}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-100 dark:hover:bg-neutral-900"
              asChild
            >
              <Link href="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </BentoGridItem>
        </div>
      </Container>
    </header>
  );
}
