"use client";

import { cn } from "@kurta-my/utils";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = async () => {
    setIsLoading(true);
    // TODO: Implement add to cart functionality
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    setIsLoading(false);
  };

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <Card className="group overflow-hidden">
      <Link
        href={`/product/${product.slug}`}
        className={cn("relative block", className)}
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
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice &&
              product.compareAtPrice > product.price && (
                <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
          </div>
        </Link>
        <div className="mt-4">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
