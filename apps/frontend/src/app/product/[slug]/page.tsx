"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/services/product";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import type { ProductWithDetails, ProductVariant } from "@/types";

interface SelectedOptions {
  [key: string]: string;
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await getProductBySlug(slug);
      if (data) {
        setProduct(data);
        // Initialize selected options with first value of each option
        const initialOptions: SelectedOptions = {};
        data.variantOptions.forEach((bracket) => {
          bracket.options.forEach((option) => {
            initialOptions[option.name] = option.values[0];
          });
        });
        setSelectedOptions(initialOptions);
      }
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      // Find matching variant based on selected options
      const variant = product.variants.find((v) => {
        return Object.entries(selectedOptions).every(
          ([key, value]) => v.attributes[key] === value
        );
      });
      setSelectedVariant(variant);
    }
  }, [product, selectedOptions]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, selectedVariant, quantity);
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-square bg-neutral-100" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-neutral-100" />
              <div className="h-4 w-1/3 bg-neutral-100" />
              <div className="h-24 w-full bg-neutral-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-4 text-neutral-600">
            The product you are looking for does not exist.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="mt-8"
            variant="outline"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const compareAtPrice =
    selectedVariant?.compareAtPrice || product.compareAtPrice;
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            className="object-cover"
            priority
          />
          {discount > 0 && (
            <div className="absolute left-4 top-4 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-2xl font-bold">
                {formatPrice(currentPrice)}
              </span>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="text-lg text-neutral-500 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {/* Variant Options */}
          {product.variantOptions.map((bracket) =>
            bracket.options.map((option) => (
              <div key={option.name}>
                <label className="mb-2 block text-sm font-medium">
                  {option.name}
                </label>
                <Select
                  value={selectedOptions[option.name]}
                  onValueChange={(value) =>
                    handleOptionChange(option.name, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))
          )}

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={!selectedVariant}
          >
            {selectedVariant ? "Add to Cart" : "Select Options"}
          </Button>
        </div>
      </div>
    </div>
  );
}
