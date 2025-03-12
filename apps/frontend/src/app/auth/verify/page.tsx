"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="text-center text-gray-500">
            We have sent you an email with a link to verify your account. Please
            check your inbox and click the link to continue.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-neutral-200 p-4">
            <h2 className="text-sm font-medium">
              Didn&apos;t receive an email?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Check your spam folder or try signing up with a different email
              address.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Link href="/auth/sign-up">
              <Button variant="outline" className="w-full">
                Try Again with Different Email
              </Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button variant="link" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
