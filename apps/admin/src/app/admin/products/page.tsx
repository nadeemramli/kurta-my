"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@kurta-my/database";
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ProductSheet } from "@/components/products/product-sheet";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { ProductStatus } from "@/lib/types/products";

type Product = Database["products"]["Row"] & {
  collections?: {
    id: string;
    title: string;
  }[];
  variants?: {
    sku?: string;
    price: number;
  }[];
  variants_count?: number;
  media?: { url: string }[];
};

interface FilterOptions {
  search: string;
  status: ProductStatus | "all";
  sortBy: "created_at" | "title" | "price" | "stock";
  sortOrder: "asc" | "desc";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >();
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("products").select(`
          *,
          collections:product_collections(
            collection:collections(id, title)
          ),
          variants:product_variants(sku, price),
          variants_count:product_variants(count),
          media:product_images(url)
        `);

      // Apply filters
      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }

      // Apply sorting
      query = query.order(filters.sortBy, {
        ascending: filters.sortOrder === "asc",
      });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform the data to match our Product type
      const transformedProducts = data.map((product) => ({
        ...product,
        collections: product.collections?.map((c: any) => c.collection),
        variants: product.variants,
        variants_count: product.variants_count?.[0]?.count || 0,
        media: product.media,
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: FilterOptions[typeof key]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = () => {
    setSelectedProductId(undefined);
    setSheetOpen(true);
  };

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setSheetOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success-light text-success";
      case "draft":
        return "bg-warning-light text-warning";
      case "archived":
        return "bg-error-light text-error";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Products</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your products and inventory
          </p>
        </div>
        <Button
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          onClick={handleAddProduct}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error</h3>
              <div className="mt-2 text-sm text-red-400">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-9 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "all")}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "active")}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "draft")}
                >
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleFilterChange("status", "archived")}
                >
                  Archived
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "created_at");
                    handleFilterChange("sortOrder", "desc");
                  }}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "created_at");
                    handleFilterChange("sortOrder", "asc");
                  }}
                >
                  Oldest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "title");
                    handleFilterChange("sortOrder", "asc");
                  }}
                >
                  Title A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "price");
                    handleFilterChange("sortOrder", "desc");
                  }}
                >
                  Price: High to Low
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    handleFilterChange("sortBy", "price");
                    handleFilterChange("sortOrder", "asc");
                  }}
                >
                  Price: Low to High
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Collections
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Variants
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-neutral-400"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.media?.[0]?.url ? (
                          <Image
                            src={product.media[0].url}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-neutral-800" />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {product.title}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {product.collections
                              ?.map((c) => c.title)
                              .join(", ") || "Uncategorized"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {product.collections?.map((c) => c.title).join(", ") ||
                        "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {formatCurrency(product.variants?.[0]?.price || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {product.variants_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product.id)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400"
                            onClick={() => {
                              // TODO: Implement delete functionality
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add the ProductSheet */}
      <ProductSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        productId={selectedProductId}
        onSuccess={() => {
          fetchProducts();
        }}
      />
    </div>
  );
}
