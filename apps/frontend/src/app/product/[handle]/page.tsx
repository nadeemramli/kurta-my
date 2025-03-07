"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { api } from "@kurta-my/api-client";
import { Product } from "@kurta-my/types";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const handle = params.handle as string;

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const handleAddToCart = () => {
    if (!selectedSize || !product) return;
    setLoading(true);
    // TODO: Implement add to cart logic
    setTimeout(() => setLoading(false), 1000);
  };

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      const productData = await api.getProduct(handle);
      setProduct(productData);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  }, [handle]);

  // Fetch product data when component mounts
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={product.images[0].url}
            alt={product.images[0].altText}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {product.description}
          </p>

          <div className="flex items-center space-x-4">
            <p className="text-2xl font-bold">
              {product.price.currencyCode} {product.price.amount.toFixed(2)}
            </p>
            {product.compareAtPrice && (
              <p className="text-lg text-neutral-500 line-through">
                {product.compareAtPrice.currencyCode}{" "}
                {product.compareAtPrice.amount.toFixed(2)}
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border p-2 text-center ${
                    selectedSize === size
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-neutral-200 hover:border-blue-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quantity</h3>
            <div className="flex w-32 items-center rounded-lg border border-neutral-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 rounded-l-lg border-r border-neutral-200 p-2 hover:bg-neutral-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
                className="w-12 border-none text-center focus:outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 rounded-r-lg border-l border-neutral-200 p-2 hover:bg-neutral-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSize || loading}
            className="w-full"
          >
            {loading ? "Adding to Cart..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
