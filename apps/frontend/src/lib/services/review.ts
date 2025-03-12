import { supabase } from "../supabase";
import type { ProductReview } from "@/types";

interface CreateReviewInput {
  productId: string;
  customerId: string;
  rating: number;
  title?: string;
  content?: string;
}

export async function createReview(input: CreateReviewInput): Promise<ProductReview | null> {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: input.productId,
        customer_id: input.customerId,
        rating: input.rating,
        title: input.title,
        content: input.content,
        is_verified_purchase: await checkVerifiedPurchase(input.customerId, input.productId)
      })
      .select()
      .single();

    if (error) throw error;
    return transformReview(data);
  } catch (error) {
    console.error("Error creating review:", error);
    return null;
  }
}

export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select()
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(transformReview);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
}

export async function getCustomerReviews(customerId: string): Promise<ProductReview[]> {
  try {
    const { data, error } = await supabase
      .from("product_reviews")
      .select()
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map(transformReview);
  } catch (error) {
    console.error("Error fetching customer reviews:", error);
    return [];
  }
}

export async function updateReviewHelpfulness(reviewId: string, increment: boolean = true): Promise<void> {
  try {
    await supabase.rpc('update_review_helpfulness', {
      review_id: reviewId,
      increment: increment
    });
  } catch (error) {
    console.error("Error updating review helpfulness:", error);
  }
}

async function checkVerifiedPurchase(customerId: string, productId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        items:order_items(product_id)
      `)
      .eq("customer_id", customerId)
      .eq("status", "completed");

    if (error) throw error;

    return data.some(order => 
      order.items.some((item: { product_id: string }) => item.product_id === productId)
    );
  } catch (error) {
    console.error("Error checking verified purchase:", error);
    return false;
  }
}

interface ReviewRow {
  id: string;
  product_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  status: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

function transformReview(data: ReviewRow): ProductReview {
  return {
    id: data.id,
    productId: data.product_id,
    customerId: data.customer_id,
    rating: data.rating,
    title: data.title || undefined,
    content: data.content || undefined,
    status: data.status,
    isVerifiedPurchase: data.is_verified_purchase,
    helpfulVotes: data.helpful_votes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
} 