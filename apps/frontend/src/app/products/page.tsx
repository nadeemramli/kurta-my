"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProducts } from "@/lib/services/product";
import { ProductGrid } from "@/components/product/product-grid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types";

const sortOptions = [
  { label: "Latest", value: "created_at-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z", value: "title-asc" },
  { label: "Name: Z to A", value: "title-desc" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(sortOptions[0].value);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await getProducts({
        search,
        sort,
        collection: searchParams.get("collection") || undefined,
        category: searchParams.get("category") || undefined,
      });
      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, [search, sort, searchParams]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <div className="flex gap-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            No products found
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
