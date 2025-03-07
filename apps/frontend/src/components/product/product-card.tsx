"use client";

import { cn } from "@kurta-my/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  className?: string;
  aspectRatio?: "portrait" | "square";
  loading?: "eager" | "lazy";
}

export function ProductCard({
  product,
  className,
  aspectRatio = "square",
  loading,
}: ProductCardProps) {
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      <div
        className={cn(
          "overflow-hidden bg-neutral-100 dark:bg-neutral-800",
          aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
        )}
      >
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          width={500}
          height={500}
          loading={loading}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {product.name}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center space-x-2">
          <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            ${product.price.toFixed(2)}
          </p>
          {product.compareAtPrice && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
