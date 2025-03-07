"use client";

import { useState } from "react";
import { useAdminAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-center text-white">
          Sign in to continue
        </h1>
        <p className="mt-2 text-sm text-neutral-400 text-center">
          Enter your admin credentials below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
          />

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
          />
        </div>

        <Button
          type="submit"
          className="ml-30 mt-2 w-35 h-11 bg-white text-neutral-900 hover:bg-neutral-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Need help?{" "}
          <a
            href="mailto:support@kurta.my"
            className="font-medium text-white hover:text-neutral-300"
          >
            Contact support
          </a>
        </p>
      </form>
    </div>
  );
}
