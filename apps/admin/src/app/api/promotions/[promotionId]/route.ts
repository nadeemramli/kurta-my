import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { promotionId: string } }
) {
  try {
    const { data: promotion, error } = await supabase
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
        ),
        usage:promotion_usage(
          *,
          order:orders(*),
          customer:customers(*)
        )
      `)
      .eq("id", params.promotionId)
      .single();

    if (error) throw error;

    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotion" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { promotionId: string } }
) {
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

    // Update promotion
    const { error: promotionError } = await supabase
      .from("promotions")
      .update({
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
      .eq("id", params.promotionId);

    if (promotionError) throw promotionError;

    // Update targets
    if (targets) {
      // Delete existing targets
      const { error: deleteTargetsError } = await supabase
        .from("promotion_targets")
        .delete()
        .eq("promotion_id", params.promotionId);

      if (deleteTargetsError) throw deleteTargetsError;

      // Insert new targets
      if (targets.length > 0) {
        const { error: targetsError } = await supabase
          .from("promotion_targets")
          .insert(
            targets.map((target: any) => ({
              promotion_id: params.promotionId,
              target_type: target.target_type,
              target_id: target.target_id,
            }))
          );

        if (targetsError) throw targetsError;
      }
    }

    // Update exclusions
    if (exclusions) {
      // Delete existing exclusions
      const { error: deleteExclusionsError } = await supabase
        .from("promotion_exclusions")
        .delete()
        .eq("promotion_id", params.promotionId);

      if (deleteExclusionsError) throw deleteExclusionsError;

      // Insert new exclusions
      if (exclusions.length > 0) {
        const { error: exclusionsError } = await supabase
          .from("promotion_exclusions")
          .insert(
            exclusions.map((exclusion: any) => ({
              promotion_id: params.promotionId,
              target_type: exclusion.target_type,
              target_id: exclusion.target_id,
            }))
          );

        if (exclusionsError) throw exclusionsError;
      }
    }

    // Update tiers
    if (tiers) {
      // Delete existing tiers
      const { error: deleteTiersError } = await supabase
        .from("promotion_tiers")
        .delete()
        .eq("promotion_id", params.promotionId);

      if (deleteTiersError) throw deleteTiersError;

      // Insert new tiers
      if (tiers.length > 0) {
        const { error: tiersError } = await supabase
          .from("promotion_tiers")
          .insert(
            tiers.map((tier: any) => ({
              promotion_id: params.promotionId,
              min_quantity: tier.min_quantity,
              discount_value: tier.discount_value,
            }))
          );

        if (tiersError) throw tiersError;
      }
    }

    // Update BXGY rules
    if (bxgy_rules) {
      // Delete existing rules
      const { error: deleteBxgyError } = await supabase
        .from("promotion_bxgy_rules")
        .delete()
        .eq("promotion_id", params.promotionId);

      if (deleteBxgyError) throw deleteBxgyError;

      // Insert new rules
      if (bxgy_rules.length > 0) {
        const { error: bxgyError } = await supabase
          .from("promotion_bxgy_rules")
          .insert(
            bxgy_rules.map((rule: any) => ({
              promotion_id: params.promotionId,
              buy_quantity: rule.buy_quantity,
              get_quantity: rule.get_quantity,
              buy_product_id: rule.buy_product_id,
              get_product_id: rule.get_product_id,
              discount_percentage: rule.discount_percentage,
            }))
          );

        if (bxgyError) throw bxgyError;
      }
    }

    // Fetch updated promotion
    const { data: updatedPromotion, error: fetchError } = await supabase
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
        ),
        usage:promotion_usage(
          *,
          order:orders(*),
          customer:customers(*)
        )
      `)
      .eq("id", params.promotionId)
      .single();

    if (fetchError) throw fetchError;

    return NextResponse.json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion:", error);
    return NextResponse.json(
      { error: "Failed to update promotion" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { promotionId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("promotions")
      .delete()
      .eq("id", params.promotionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return NextResponse.json(
      { error: "Failed to delete promotion" },
      { status: 500 }
    );
  }
} 