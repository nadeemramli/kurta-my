"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ProductSummary } from "@/lib/types/products";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface ProductListProps {
  initialProducts?: ProductSummary[];
}

export function ProductList({ initialProducts = [] }: ProductListProps) {
  const [products, setProducts] = useState<ProductSummary[]>(initialProducts);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchProducts();
  }, [status, debouncedSearch]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "all") {
        params.append("status", status);
      }
      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/admin/products/new">
          <Button>New Product</Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <div className="h-40 bg-muted animate-pulse rounded-md" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No products found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group"
            >
              <Card className="overflow-hidden">
                <div className="aspect-[4/3] relative bg-muted">
                  {product.primary_image ? (
                    <img
                      src={product.primary_image}
                      alt={product.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 space-x-2">
                    {product.featured && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span
                      className={cn("text-xs px-2 py-1 rounded-full", {
                        "bg-yellow-500 text-white": product.status === "draft",
                        "bg-green-500 text-white": product.status === "active",
                        "bg-gray-500 text-white": product.status === "archived",
                      })}
                    >
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate group-hover:text-primary">
                    {product.title}
                  </h3>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {product.price_range.min === product.price_range.max ? (
                      formatCurrency(product.price_range.min)
                    ) : (
                      <>
                        {formatCurrency(product.price_range.min)} -{" "}
                        {formatCurrency(product.price_range.max)}
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {product.inventory_quantity} in stock
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
