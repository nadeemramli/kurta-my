import { Database } from "../index";

export type Promotion = Database["public"]["Tables"]["promotions"]["Row"];
export type PromotionTarget = Database["public"]["Tables"]["promotion_targets"]["Row"];
export type PromotionUsage = Database["public"]["Tables"]["promotion_usage"]["Row"];
export type PromotionExclusion = Database["public"]["Tables"]["promotion_exclusions"]["Row"];
export type PromotionTier = Database["public"]["Tables"]["promotion_tiers"]["Row"];
export type PromotionBXGYRule = Database["public"]["Tables"]["promotion_bxgy_rules"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];

export type PromotionType = 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping' | 'tier_discount';
export type PromotionStatus = 'draft' | 'active' | 'scheduled' | 'expired' | 'cancelled';
export type PromotionTargetType = 'all' | 'product' | 'category' | 'collection' | 'customer_segment';

export interface PromotionCondition {
  type: 'min_purchase' | 'min_quantity' | 'customer_segment' | 'first_time_customer' | 'specific_products';
  value: number | string | string[];
}

export interface PromotionWithDetails extends Promotion {
  targets?: Array<PromotionTarget & {
    product?: Product;
  }>;
  exclusions?: Array<PromotionExclusion & {
    product?: Product;
  }>;
  tiers?: PromotionTier[];
  bxgy_rules?: Array<PromotionBXGYRule & {
    buy_product?: Product;
    get_product?: Product;
  }>;
  usage?: Array<PromotionUsage & {
    order?: Database["public"]["Tables"]["orders"]["Row"];
    customer?: Database["public"]["Tables"]["customers"]["Row"];
  }>;
}

export interface PromotionCalculationResult {
  promotion_id: string;
  discount_amount: number;
  applied_items: Array<{
    item_id: string;
    original_price: number;
    discounted_price: number;
    discount_amount: number;
  }>;
  message?: string;
}

export interface EnhancedProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  sku: string;
  category_ids: string[];
  collection_ids: string[];
  [key: string]: any;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  total: number;
  product?: EnhancedProduct;
  variant?: Database["public"]["Tables"]["product_variants"]["Row"];
}

export interface PromotionValidationContext {
  cart_items: CartItem[];
  subtotal: number;
  customer_id?: string;
  customer_segments?: string[];
  is_first_time_customer?: boolean;
} 