"use client";

import { Button } from "./button";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface HeroButtonProps {
  variant: "scroll" | "link";
  label: string;
}

export function HeroButton({ variant, label }: HeroButtonProps) {
  const baseStyles =
    "min-w-[160px] h-[45px] uppercase text-xs tracking-wider font-medium transition-all duration-200 flex items-center justify-center gap-2";

  if (variant === "scroll") {
    return (
      <Button
        size="lg"
        className={`${baseStyles} bg-white text-black hover:bg-white/90 shadow-[0_4px_14px_0_rgb(255,255,255,0.3)] hover:shadow-[0_6px_20px_0_rgb(255,255,255,0.4)] hover:transform hover:-translate-y-[1px]`}
        onClick={() => {
          document.getElementById("featured-products")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
      >
        {label}
        <ShoppingBag className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className={`${baseStyles} bg-transparent text-white border-[1.5px] border-white/70 hover:border-white hover:bg-white/10`}
    >
      <Link href="#">
        {label}
        <ArrowRight className="w-4 h-4 ml-1" />
      </Link>
    </Button>
  );
}
