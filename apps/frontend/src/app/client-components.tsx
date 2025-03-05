"use client";

import { CartProvider } from "@/components/cart/cart-context";
import { AuthProvider } from "@/components/auth/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WelcomeToast } from "@/components/welcome-toast";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { CartSheet } from "@/components/cart/cart-sheet";

interface ClientComponentsProps {
  children?: ReactNode;
}

export function ClientComponents({ children }: ClientComponentsProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster richColors />
        <WelcomeToast />
        <Navbar />
        <CartSheet />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
