import { Metadata } from "next";
import { ProductList } from "@/components/products/ProductList";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { type ProductSummary } from "@/lib/types/products";

export const metadata: Metadata = {
  title: "Products - Admin Dashboard",
  description: "Manage your products",
};

export default async function ProductsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/admin/products");
  }

  const { data } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      handle,
      status,
      featured,
      published_at,
      updated_at,
      primary_image:product_images!inner(url),
      variants:product_variants(price, inventory_quantity)
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  // Transform the data to match ProductSummary type
  const products: ProductSummary[] = (data || []).map((product: any) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    status: product.status,
    featured: product.featured,
    primary_image: product.primary_image?.[0]?.url,
    price_range: {
      min: Math.min(...(product.variants?.map((v: any) => v.price) ?? [0])),
      max: Math.max(...(product.variants?.map((v: any) => v.price) ?? [0])),
    },
    inventory_quantity:
      product.variants?.reduce(
        (sum: number, v: any) => sum + (v.inventory_quantity || 0),
        0
      ) ?? 0,
    published_at: product.published_at,
    updated_at: product.updated_at,
  }));

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your products and inventory
        </p>
      </div>

      <ProductList initialProducts={products} />
    </main>
  );
}
