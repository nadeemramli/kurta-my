import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { PromotionType, PromotionStatus } from "@kurta-my/database/types/promotion";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as PromotionStatus | null;
    const type = url.searchParams.get("type") as PromotionType | null;
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let query = supabase
      .from("promotions")
      .select(`
        *,
        targets:promotion_targets(
          *,
          product:products(*),
          category:categories(*),
          collection:collections(*),
          customer_segment:customer_segments(*)
        ),
        exclusions:promotion_exclusions(
          *,
          product:products(*),
          category:categories(*),
          collection:collections(*),
          customer_segment:customer_segments(*)
        ),
        tiers:promotion_tiers(*),
        bxgy_rules:promotion_bxgy_rules(
          *,
          buy_product:products(*),
          get_product:products(*)
        )
      `, { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,code.ilike.%${search}%`);
    }

    const { data: promotions, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      promotions,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      code,
      description,
      type,
      value,
      min_purchase_amount,
      max_discount_amount,
      starts_at,
      ends_at,
      usage_limit,
      is_stackable,
      priority,
      conditions,
      targets,
      exclusions,
      tiers,
      bxgy_rules,
    } = body;

    // Start a Supabase transaction
    const { data: promotion, error: promotionError } = await supabase
      .from("promotions")
      .insert({
        name,
        code,
        description,
        type,
        value,
        min_purchase_amount,
        max_discount_amount,
        starts_at,
        ends_at,
        usage_limit,
        is_stackable,
        priority,
        conditions,
      })
      .select()
      .single();

    if (promotionError) throw promotionError;

    // Insert targets if provided
    if (targets && targets.length > 0) {
      const { error: targetsError } = await supabase
        .from("promotion_targets")
        .insert(
          targets.map((target: any) => ({
            promotion_id: promotion.id,
            target_type: target.target_type,
            target_id: target.target_id,
          }))
        );

      if (targetsError) throw targetsError;
    }

    // Insert exclusions if provided
    if (exclusions && exclusions.length > 0) {
      const { error: exclusionsError } = await supabase
        .from("promotion_exclusions")
        .insert(
          exclusions.map((exclusion: any) => ({
            promotion_id: promotion.id,
            target_type: exclusion.target_type,
            target_id: exclusion.target_id,
          }))
        );

      if (exclusionsError) throw exclusionsError;
    }

    // Insert tiers if provided
    if (tiers && tiers.length > 0) {
      const { error: tiersError } = await supabase
        .from("promotion_tiers")
        .insert(
          tiers.map((tier: any) => ({
            promotion_id: promotion.id,
            min_quantity: tier.min_quantity,
            discount_value: tier.discount_value,
          }))
        );

      if (tiersError) throw tiersError;
    }

    // Insert BXGY rules if provided
    if (bxgy_rules && bxgy_rules.length > 0) {
      const { error: bxgyError } = await supabase
        .from("promotion_bxgy_rules")
        .insert(
          bxgy_rules.map((rule: any) => ({
            promotion_id: promotion.id,
            buy_quantity: rule.buy_quantity,
            get_quantity: rule.get_quantity,
            buy_product_id: rule.buy_product_id,
            get_product_id: rule.get_product_id,
            discount_percentage: rule.discount_percentage,
          }))
        );

      if (bxgyError) throw bxgyError;
    }

    // Fetch the complete promotion with all relations
    const { data: completePromotion, error: fetchError } = await supabase
      .from("promotions")
      .select(`
        *,
        targets:promotion_targets(
          *,
          product:products(*),
          category:categories(*),
          collection:collections(*),
          customer_segment:customer_segments(*)
        ),
        exclusions:promotion_exclusions(
          *,
          product:products(*),
          category:categories(*),
          collection:collections(*),
          customer_segment:customer_segments(*)
        ),
        tiers:promotion_tiers(*),
        bxgy_rules:promotion_bxgy_rules(
          *,
          buy_product:products(*),
          get_product:products(*)
        )
      `)
      .eq("id", promotion.id)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(completePromotion);
  } catch (error) {
    console.error("Error creating promotion:", error);
    return NextResponse.json(
      { error: "Failed to create promotion" },
      { status: 500 }
    );
  }
} 