"use client";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Product, Category, Brand } from "@/types";

// Mock category and brand
const mockCategory: Category = {
  id: "1",
  slug: "mens-kurta",
  name: "Men's Kurta",
};

const mockBrand: Brand = {
  id: "1",
  slug: "kurta-my",
  name: "Kurta MY",
};

// Mock data - replace with real data from your API
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "classic-white-kurta",
    name: "Classic White Kurta",
    description: "A timeless white kurta perfect for any occasion",
    price: 59.99,
    compareAtPrice: 79.99,
    category: mockCategory,
    brand: mockBrand,
    images: [
      {
        id: "1",
        url: "/images/products/kurta-1.jpg",
        alt: "Classic White Kurta",
        isPrimary: true,
      },
    ],
    variants: [],
    attributes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more mock products...
];

const CATEGORIES = [
  "All",
  "Men's Kurta",
  "Women's Kurta",
  "Kids' Kurta",
  "Accessories",
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [inStock, setInStock] = useState(true);
  const [onSale, setOnSale] = useState(false);

  const handleInStockChange = (checked: boolean) => {
    setInStock(checked);
  };

  const handleOnSaleChange = (checked: boolean) => {
    setOnSale(checked);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-2 py-1 rounded-lg ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={0}
              max={1000}
              step={10}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={handleInStockChange}
              />
              <label
                htmlFor="in-stock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                In Stock
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="on-sale"
                checked={onSale}
                onCheckedChange={handleOnSaleChange}
              />
              <label
                htmlFor="on-sale"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                On Sale
              </label>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full md:hidden"
            onClick={() => {
              // Handle mobile filter application
            }}
          >
            Apply Filters
          </Button>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
