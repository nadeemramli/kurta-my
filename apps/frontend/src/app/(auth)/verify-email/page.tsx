"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >(token ? "pending" : "error");

  // Function to handle email verification
  const verifyEmail = useCallback(async () => {
    if (!token) return;
    try {
      // TODO: Implement email verification logic with the token
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setVerificationStatus("success");
    } catch {
      setVerificationStatus("error");
    }
  }, [token]);

  // Function to resend verification email
  async function resendVerificationEmail() {
    if (!email) return;
    setIsResending(true);
    try {
      // TODO: Implement resend verification email logic with the email
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
    } finally {
      setIsResending(false);
    }
  }

  // If there's a token, attempt to verify the email
  useEffect(() => {
    if (token && verificationStatus === "pending") {
      verifyEmail();
    }
  }, [token, verificationStatus, verifyEmail]);

  if (verificationStatus === "success") {
    return (
      <AuthCard
        title="Email Verified!"
        description="Your email has been successfully verified. You can now sign in to your account."
        footer={
          <p>
            <Link
              href="/login"
              className="font-medium hover:underline text-blue-600 dark:text-blue-400"
            >
              Sign in
            </Link>
          </p>
        }
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </AuthCard>
    );
  }

  if (verificationStatus === "error" && !email) {
    return (
      <AuthCard
        title="Invalid Verification Link"
        description="The verification link is invalid or has expired. Please request a new verification email."
        footer={
          <p>
            <Link
              href="/login"
              className="font-medium hover:underline text-blue-600 dark:text-blue-400"
            >
              Return to sign in
            </Link>
          </p>
        }
      >
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
            <svg
              className="h-6 w-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verify Your Email"
      description={
        email
          ? `We sent a verification link to ${email}. Click the link in the email to verify your account.`
          : "Please check your email for the verification link."
      }
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
            <svg
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        {email && (
          <Button
            className="w-full"
            variant="outline"
            disabled={isResending}
            onClick={() => resendVerificationEmail()}
          >
            {isResending ? "Resending..." : "Resend verification email"}
          </Button>
        )}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline text-neutral-600 dark:text-neutral-400"
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
