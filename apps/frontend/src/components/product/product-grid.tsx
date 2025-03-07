import { BentoGrid } from "../ui/bento-grid";
import { ProductCard } from "./product-card";
import { cn } from "@kurta-my/utils";
import { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  className?: string;
  aspectRatio?: "portrait" | "square";
}

export function ProductGrid({
  products,
  className,
  aspectRatio = "square",
}: ProductGridProps) {
  if (!products?.length) return null;

  // For featured layout, first product spans 2 columns and rows
  const [firstProduct, ...restProducts] = products;

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-4 md:grid-cols-6">
        {firstProduct && (
          <div className="md:col-span-4">
            <ProductCard
              product={firstProduct}
              aspectRatio="square"
              className="h-full"
              loading="eager"
            />
          </div>
        )}
        {restProducts.slice(0, 2).map((product) => (
          <div key={product.id} className="md:col-span-1">
            <ProductCard
              product={product}
              aspectRatio="portrait"
              className="h-full"
              loading="eager"
            />
          </div>
        ))}
      </div>
      <BentoGrid columns={4} className="grid-rows-2">
        {restProducts.slice(2).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            aspectRatio={aspectRatio}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
