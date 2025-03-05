"use client";

import { Percent } from "lucide-react";
import Marquee from "react-fast-marquee";

export function MarqueeBanner() {
  return (
    <div className="bg-gray-100 text-black border-y border-gray-200">
      <Marquee speed={50} gradient={false} className="py-2">
        <span className="mx-4 text-sm font-medium flex items-center gap-2">
          RAMADAN SALE: 3 HELAI RM100, 6 HELAI FREE SHIPPING
          <Percent className="w-4 h-6" />
        </span>
      </Marquee>
    </div>
  );
}
