"use client";

import { useCart } from "../cart/cart-context";
import { useAuth } from "../auth/auth-context";
import { NavSheet } from "./nav-sheet";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@kurta-my/utils";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { state, setIsOpen: setCartOpen } = useCart();
  const { itemCount } = state;
  const { user, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 lg:px-6 transition-colors duration-300",
          isHomePage
            ? "bg-transparent"
            : "bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800"
        )}
      >
        {/* Left section - Hamburger menu */}
        <div className="flex w-1/3 justify-start">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
            onClick={() => setIsNavOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Center section - Logo */}
        <div className="flex flex-1 justify-center">
          <Link href="/" className="flex items-center justify-center">
            <div className="relative h-7 w-7">
              <Image
                src="/images/logo.png"
                alt="Kurta MY"
                width={32}
                height={32}
                className="rounded-[8px]"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right section - Actions */}
        <div className="flex w-1/3 justify-end">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className={cn(
                "absolute right-full mr-2 w-0 px-0 py-2 opacity-0 transition-all duration-300 focus:outline-none bg-transparent border-white/20 text-white placeholder:text-white/60",
                isSearchOpen && "w-[200px] px-4 opacity-100"
              )}
            />
            <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/10"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  aria-label={isSearchOpen ? "Close search" : "Open search"}
                >
                  {isSearchOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  onClick={() => setCartOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-white hover:bg-white/10 relative"
                  aria-label="Open cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <div className="absolute right-0 top-0 -mr-0.5 -mt-0.5 h-3.5 w-3.5 rounded-full bg-white text-[10px] font-medium text-black flex items-center justify-center">
                      {itemCount}
                    </div>
                  )}
                </Button>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-white hover:bg-white/10"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem className="text-sm">
                        Signed in as {user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href="/login">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <NavSheet isOpen={isNavOpen} onOpenChange={setIsNavOpen} />
    </>
  );
}
