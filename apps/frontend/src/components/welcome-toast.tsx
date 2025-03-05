"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    toast("Welcome to Kurta MY", {
      description: "Your one-stop shop for kurtas",
      action: {
        label: "Learn More",
        onClick: () => (window.location.href = "/about"),
      },
    });
  }, []);

  return null;
}
