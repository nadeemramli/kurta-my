"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to orders analytics by default
    router.push("/admin/orders/analytics");
  }, [router]);

  return null; // No need to render anything as we're redirecting
}
