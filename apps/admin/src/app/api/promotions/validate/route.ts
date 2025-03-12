import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type {
  CartItem,
  PromotionValidationContext,
  PromotionCalculationResult,
  PromotionWithDetails,
  EnhancedProduct,
} from "@kurta-my/database/types/promotion";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cart_items, subtotal, customer_id, promotion_codes } = body;

    if (!cart_items || !Array.isArray(cart_items)) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Get customer segments if customer_id is provided
    let customer_segments: string[] = [];
    let is_first_time_customer = false;

    if (customer_id) {
      // Get customer segments
      const { data: memberships } = await supabase
        .from("customer_segment_memberships")
        .select("segment_id")
        .eq("customer_id", customer_id);

      customer_segments = memberships?.map((m) => m.segment_id) || [];

      // Check if first-time customer
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact" })
        .eq("customer_id", customer_id)
        .eq("status", "completed");

      is_first_time_customer = count === 0;
    }

    // Get product categories and collections
    const productIds = cart_items.map((item) => item.product_id);
    const { data: productCategories } = await supabase
      .from("product_categories")
      .select("product_id, category_id")
      .in("product_id", productIds);

    const { data: productCollections } = await supabase
      .from("product_collections")
      .select("product_id, collection_id")
      .in("product_id", productIds);

    // Create a map of product IDs to their categories and collections
    const productCategoryMap = new Map<string, string[]>();
    const productCollectionMap = new Map<string, string[]>();

    productCategories?.forEach((pc) => {
      const categories = productCategoryMap.get(pc.product_id) || [];
      categories.push(pc.category_id);
      productCategoryMap.set(pc.product_id, categories);
    });

    productCollections?.forEach((pc) => {
      const collections = productCollectionMap.get(pc.product_id) || [];
      collections.push(pc.collection_id);
      productCollectionMap.set(pc.product_id, collections);
    });

    // Get product details
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);

    // Create enhanced products
    const enhancedProducts = new Map<string, EnhancedProduct>();
    products?.forEach((product) => {
      enhancedProducts.set(product.id, {
        ...product,
        category_ids: productCategoryMap.get(product.id) || [],
        collection_ids: productCollectionMap.get(product.id) || [],
      });
    });

    // Enhance cart items with product information
    const enhancedCartItems: CartItem[] = cart_items.map((item) => ({
      ...item,
      product: enhancedProducts.get(item.product_id),
    }));

    const context: PromotionValidationContext = {
      cart_items: enhancedCartItems,
      subtotal,
      customer_id,
      customer_segments,
      is_first_time_customer,
    };

    // Get active promotions
    let query = supabase
      .from("promotions")
      .select(`
        *,
        targets:promotion_targets(
          *,
          product:products(*)
        ),
        exclusions:promotion_exclusions(
          *,
          product:products(*)
        ),
        tiers:promotion_tiers(*),
        bxgy_rules:promotion_bxgy_rules(
          *,
          buy_product:products(*),
          get_product:products(*)
        )
      `)
      .eq("status", "active")
      .lte("starts_at", new Date().toISOString());

    // If promotion codes are provided, filter by them
    if (promotion_codes && promotion_codes.length > 0) {
      query = query.in("code", promotion_codes);
    }

    const { data: promotions, error } = await query;

    if (error) throw error;

    // Calculate discounts for each promotion
    const results: PromotionCalculationResult[] = [];

    for (const promotion of promotions || []) {
      const result = await calculatePromotionDiscount(promotion, context);
      if (result) {
        results.push(result);
      }
    }

    // Sort results by priority and stackability
    results.sort((a, b) => {
      const promotionA = promotions?.find((p) => p.id === a.promotion_id);
      const promotionB = promotions?.find((p) => p.id === b.promotion_id);

      if (!promotionA || !promotionB) return 0;

      // Non-stackable promotions come first
      if (!promotionA.is_stackable && promotionB.is_stackable) return -1;
      if (promotionA.is_stackable && !promotionB.is_stackable) return 1;

      // Then sort by priority (higher priority first)
      return promotionB.priority - promotionA.priority;
    });

    // Apply stackable rules
    const finalResults = applyStackableRules(results, promotions as PromotionWithDetails[]);

    return NextResponse.json({
      applicable_promotions: finalResults,
      total_discount: finalResults.reduce((sum, r) => sum + r.discount_amount, 0),
    });
  } catch (error) {
    console.error("Error validating promotions:", error);
    return NextResponse.json(
      { error: "Failed to validate promotions" },
      { status: 500 }
    );
  }
}

async function calculatePromotionDiscount(
  promotion: PromotionWithDetails,
  context: PromotionValidationContext
): Promise<PromotionCalculationResult | null> {
  try {
    // Check minimum purchase amount
    if (promotion.min_purchase_amount && context.subtotal < promotion.min_purchase_amount) {
      return null;
    }

    // Check customer segment restrictions
    if (promotion.targets?.some((t) => t.target_type === "customer_segment")) {
      const allowedSegments = promotion.targets
        .filter((t) => t.target_type === "customer_segment")
        .map((t) => t.target_id);

      if (!context.customer_segments?.some((s) => allowedSegments.includes(s))) {
        return null;
      }
    }

    // Check first-time customer condition
    if (promotion.conditions?.first_time_customer && !context.is_first_time_customer) {
      return null;
    }

    let discountAmount = 0;
    const appliedItems: PromotionCalculationResult["applied_items"] = [];

    switch (promotion.type) {
      case "percentage":
        discountAmount = calculatePercentageDiscount(promotion, context, appliedItems);
        break;
      case "fixed_amount":
        discountAmount = calculateFixedDiscount(promotion, context, appliedItems);
        break;
      case "buy_x_get_y":
        discountAmount = calculateBXGYDiscount(promotion, context, appliedItems);
        break;
      case "free_shipping":
        // Free shipping logic would be handled separately
        discountAmount = 0;
        break;
      case "tier_discount":
        discountAmount = calculateTierDiscount(promotion, context, appliedItems);
        break;
    }

    // Apply maximum discount if set
    if (promotion.max_discount_amount && discountAmount > promotion.max_discount_amount) {
      discountAmount = promotion.max_discount_amount;
    }

    return {
      promotion_id: promotion.id,
      discount_amount: discountAmount,
      applied_items,
      message: generatePromotionMessage(promotion, discountAmount),
    };
  } catch (error) {
    console.error("Error calculating promotion discount:", error);
    return null;
  }
}

function calculatePercentageDiscount(
  promotion: PromotionWithDetails,
  context: PromotionValidationContext,
  appliedItems: PromotionCalculationResult["applied_items"]
): number {
  let totalDiscount = 0;
  const percentage = promotion.value || 0;

  for (const item of context.cart_items) {
    if (isItemEligible(item, promotion)) {
      const itemDiscount = (item.price * item.quantity * percentage) / 100;
      totalDiscount += itemDiscount;

      appliedItems.push({
        item_id: item.id,
        original_price: item.price * item.quantity,
        discounted_price: item.price * item.quantity - itemDiscount,
        discount_amount: itemDiscount,
      });
    }
  }

  return totalDiscount;
}

function calculateFixedDiscount(
  promotion: PromotionWithDetails,
  context: PromotionValidationContext,
  appliedItems: PromotionCalculationResult["applied_items"]
): number {
  const fixedDiscount = promotion.value || 0;
  let totalDiscount = 0;

  // Calculate proportional distribution of fixed discount
  const eligibleItems = context.cart_items.filter((item) => isItemEligible(item, promotion));
  const totalEligibleAmount = eligibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  for (const item of eligibleItems) {
    const itemTotal = item.price * item.quantity;
    const itemDiscount = (itemTotal / totalEligibleAmount) * fixedDiscount;
    totalDiscount += itemDiscount;

    appliedItems.push({
      item_id: item.id,
      original_price: itemTotal,
      discounted_price: itemTotal - itemDiscount,
      discount_amount: itemDiscount,
    });
  }

  return totalDiscount;
}

function calculateBXGYDiscount(
  promotion: PromotionWithDetails,
  context: PromotionValidationContext,
  appliedItems: PromotionCalculationResult["applied_items"]
): number {
  let totalDiscount = 0;

  for (const rule of promotion.bxgy_rules || []) {
    const buyItem = context.cart_items.find((item) => 
      item.product_id === rule.buy_product_id
    );

    const getItem = context.cart_items.find((item) =>
      item.product_id === rule.get_product_id
    );

    if (buyItem && getItem) {
      const sets = Math.floor(buyItem.quantity / rule.buy_quantity);
      const discountedQuantity = Math.min(
        sets * rule.get_quantity,
        getItem.quantity
      );

      const itemDiscount = (getItem.price * discountedQuantity * rule.discount_percentage) / 100;
      totalDiscount += itemDiscount;

      appliedItems.push({
        item_id: getItem.id,
        original_price: getItem.price * discountedQuantity,
        discounted_price: getItem.price * discountedQuantity - itemDiscount,
        discount_amount: itemDiscount,
      });
    }
  }

  return totalDiscount;
}

function calculateTierDiscount(
  promotion: PromotionWithDetails,
  context: PromotionValidationContext,
  appliedItems: PromotionCalculationResult["applied_items"]
): number {
  let totalDiscount = 0;

  // Get eligible items
  const eligibleItems = context.cart_items.filter((item) => isItemEligible(item, promotion));
  const totalQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);

  // Find applicable tier
  const applicableTier = promotion.tiers
    ?.sort((a, b) => b.min_quantity - a.min_quantity)
    .find((tier) => totalQuantity >= tier.min_quantity);

  if (applicableTier) {
    for (const item of eligibleItems) {
      const itemDiscount = (item.price * item.quantity * applicableTier.discount_value) / 100;
      totalDiscount += itemDiscount;

      appliedItems.push({
        item_id: item.id,
        original_price: item.price * item.quantity,
        discounted_price: item.price * item.quantity - itemDiscount,
        discount_amount: itemDiscount,
      });
    }
  }

  return totalDiscount;
}

function isItemEligible(item: CartItem, promotion: PromotionWithDetails): boolean {
  if (!item.product) return false;

  // Check if item is explicitly targeted
  const isTargeted = promotion.targets?.some((target) => {
    switch (target.target_type) {
      case "product":
        return target.target_id === item.product_id;
      case "category":
        return item.product?.category_ids?.includes(target.target_id) ?? false;
      case "collection":
        return item.product?.collection_ids?.includes(target.target_id) ?? false;
      case "all":
        return true;
      default:
        return false;
    }
  }) ?? true; // If no targets, promotion applies to all items

  // Check if item is excluded
  const isExcluded = promotion.exclusions?.some((exclusion) => {
    switch (exclusion.target_type) {
      case "product":
        return exclusion.target_id === item.product_id;
      case "category":
        return item.product?.category_ids?.includes(exclusion.target_id) ?? false;
      case "collection":
        return item.product?.collection_ids?.includes(exclusion.target_id) ?? false;
      default:
        return false;
    }
  }) ?? false;

  return isTargeted && !isExcluded;
}

function generatePromotionMessage(
  promotion: PromotionWithDetails,
  discountAmount: number
): string {
  switch (promotion.type) {
    case "percentage":
      return `${promotion.value}% off selected items`;
    case "fixed_amount":
      return `$${promotion.value} off your purchase`;
    case "buy_x_get_y":
      return "Buy X get Y discount applied";
    case "free_shipping":
      return "Free shipping applied";
    case "tier_discount":
      return "Volume discount applied";
    default:
      return `Saved $${discountAmount.toFixed(2)}`;
  }
}

function applyStackableRules(
  results: PromotionCalculationResult[],
  promotions: PromotionWithDetails[]
): PromotionCalculationResult[] {
  const finalResults: PromotionCalculationResult[] = [];
  let hasNonStackable = false;

  for (const result of results) {
    const promotion = promotions.find((p) => p.id === result.promotion_id);
    if (!promotion) continue;

    if (!promotion.is_stackable) {
      if (!hasNonStackable) {
        finalResults.push(result);
        hasNonStackable = true;
      }
    } else if (!hasNonStackable) {
      finalResults.push(result);
    }
  }

  return finalResults;
} 