import { Metadata } from "next";
import { ProductDetails } from "@/components/products/ProductDetails";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { type Product } from "@/lib/types/products";

export const metadata: Metadata = {
  title: "Product Details - Admin Dashboard",
  description: "View and manage product details",
};

export default async function ProductDetailsPage({
  params,
}: {
  params: { productId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/admin/products/" + params.productId);
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      variants:product_variants(*),
      images:product_images(*),
      collections:collection_products(
        collection:collections(
          id,
          title,
          handle,
          description
        )
      )
    `
    )
    .eq("id", params.productId)
    .single();

  if (error || !product) {
    redirect("/admin/products");
  }

  // Transform the data to match Product type
  const transformedProduct: Product = {
    ...product,
    collections: product.collections?.map((cp: any) => cp.collection) || [],
    media:
      product.images?.map((image: any) => ({
        id: image.id,
        url: image.url,
        type: "image",
        alt: image.alt,
        position: image.position,
      })) || [],
    variant_brackets: [], // This would need to be populated if you're using variant brackets
    options: [], // This would need to be populated based on your variants
    images: product.images || [],
    seo: {
      title: product.seo_title,
      description: product.seo_description,
      keywords: product.seo_keywords,
      og_image: product.og_image,
    },
  };

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage product #{transformedProduct.id.slice(0, 8)}
        </p>
      </div>

      <ProductDetails product={transformedProduct} />
    </main>
  );
}
