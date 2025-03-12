import { supabase } from "../supabase";
import { Product } from "@/types";
import { transformProduct } from "./product";
import type { ProductRow } from "./types";

export interface ProductRecommendation {
  id: string;
  productId: string;
  recommendedProductId: string;
  type: 'similar' | 'frequently_bought_together' | 'custom';
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export async function getProductRecommendations(
  productId: string,
  type: 'similar' | 'frequently_bought_together' | 'custom',
  limit: number = 4
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("product_recommendations")
      .select(`
        *,
        recommended_product:products!product_recommendations_recommended_product_id_fkey(
          *,
          media:product_media(
            id,
            url,
            alt,
            type,
            position
          ),
          variants:product_variants(
            id,
            sku,
            name,
            price,
            compare_at_price,
            inventory_quantity,
            attributes,
            status
          ),
          collections:product_collections(
            collection:collections(
              id,
              title,
              slug
            )
          )
        )
      `)
      .eq("product_id", productId)
      .eq("type", type)
      .order("score", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(row => transformProduct(row.recommended_product as ProductRow));
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return [];
  }
}

export async function getSimilarProducts(productId: string, limit: number = 4): Promise<Product[]> {
  return getProductRecommendations(productId, 'similar', limit);
}

export async function getFrequentlyBoughtTogether(productId: string, limit: number = 4): Promise<Product[]> {
  return getProductRecommendations(productId, 'frequently_bought_together', limit);
}

export async function getCustomRecommendations(productId: string, limit: number = 4): Promise<Product[]> {
  return getProductRecommendations(productId, 'custom', limit);
}

interface RecommendationRow {
  id: string;
  product_id: string;
  recommended_product_id: string;
  type: 'similar' | 'frequently_bought_together' | 'custom';
  score: number | null;
  created_at: string;
  updated_at: string;
}

function transformRecommendation(data: RecommendationRow): ProductRecommendation {
  return {
    id: data.id,
    productId: data.product_id,
    recommendedProductId: data.recommended_product_id,
    type: data.type,
    score: data.score || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}