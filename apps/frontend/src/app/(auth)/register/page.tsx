"use client";

import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword)
      return;
    if (formData.password !== formData.confirmPassword) {
      // TODO: Show error message that passwords don't match
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement registration logic
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      // Redirect to email verification page or login page
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create an Account"
      description="Enter your details below to create your account"
      footer={
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium hover:underline text-blue-600 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            required
          />
        </div>
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
