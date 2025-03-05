"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  soldOut?: boolean;
  className?: string;
  colors?: string[];
}

export function ProductCard({
  title,
  price,
  image,
  soldOut,
  colors = [],
  className,
}: ProductCardProps) {
  return (
    <div className={cn("group relative", className)}>
      <div className="aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={title}
          width={600}
          height={750}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {soldOut && (
          <div className="absolute top-4 left-4 bg-black text-white text-xs px-2 py-1 uppercase tracking-wider font-medium">
            Sold Out
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm text-white uppercase tracking-wide">{title}</h3>
        <p className="text-sm text-neutral-400">{price}</p>
        {colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {colors.map((color, i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full border border-neutral-700",
                  color === "white" && "bg-white",
                  color === "black" && "bg-black",
                  color === "gray" && "bg-neutral-400"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
