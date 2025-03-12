"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any checkout-related state if needed
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="relative h-24 w-24 text-green-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold">Order Successful!</h1>
      <p className="text-center text-neutral-500">
        Thank you for your order. We will send you a confirmation email shortly.
      </p>
      <div className="flex space-x-4">
        <Button onClick={() => router.push("/orders")} variant="outline">
          View Orders
        </Button>
        <Button onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
