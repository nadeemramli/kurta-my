"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/auth/auth-context";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-neutral-950 lg:grid-cols-2">
      {/* Left side - Welcome Message */}
      <div className="relative hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950" />
        <div className="relative flex h-full flex-col items-center justify-center px-8">
          <Logo size="lg" priority className="mb-12" />
          <div className="w-full max-w-xl text-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-medium tracking-tight text-white">
                Welcome to Kurta MY Admin
              </h1>
              <p className="text-lg text-neutral-400">
                Manage your e-commerce platform with ease
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-12">
            <Logo size="lg" priority />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
