import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { CustomerSegmentCriteria } from "@kurta-my/database/types/customer";

export async function GET(
  request: Request,
  { params }: { params: { segmentId: string } }
) {
  try {
    // Get segment details
    const { data: segment, error } = await supabase
      .from("customer_segments")
      .select("*")
      .eq("id", params.segmentId)
      .single();

    if (error) throw error;

    // Get customers in segment
    const { data: memberships, error: membershipError } = await supabase
      .from("customer_segment_memberships")
      .select(`
        customer:customers (
          id,
          first_name,
          last_name,
          email,
          total_spent,
          orders_count
        )
      `)
      .eq("segment_id", params.segmentId);

    if (membershipError) throw membershipError;

    const customers = memberships?.map((m: any) => m.customer) || [];

    return NextResponse.json({
      ...segment,
      customers,
    });
  } catch (error) {
    console.error("Error fetching segment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch segment details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { segmentId: string } }
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
    const { name, description, criteria } = body;

    // Validate criteria structure
    if (!isValidSegmentCriteria(criteria)) {
      return NextResponse.json(
        { error: "Invalid segment criteria format" },
        { status: 400 }
      );
    }

    // Update segment
    const { data: segment, error } = await supabase
      .from("customer_segments")
      .update({
        name,
        description,
        criteria,
      })
      .eq("id", params.segmentId)
      .select()
      .single();

    if (error) throw error;

    // Clear existing memberships
    const { error: clearError } = await supabase
      .from("customer_segment_memberships")
      .delete()
      .eq("segment_id", params.segmentId);

    if (clearError) throw clearError;

    // Reassign customers based on new criteria
    await assignCustomersToSegment(params.segmentId, criteria);

    return NextResponse.json(segment);
  } catch (error) {
    console.error("Error updating segment:", error);
    return NextResponse.json(
      { error: "Failed to update segment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { segmentId: string } }
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
      .from("customer_segments")
      .delete()
      .eq("id", params.segmentId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting segment:", error);
    return NextResponse.json(
      { error: "Failed to delete segment" },
      { status: 500 }
    );
  }
}

function isValidSegmentCriteria(criteria: any): criteria is CustomerSegmentCriteria {
  if (!criteria || typeof criteria !== "object") return false;
  if (!Array.isArray(criteria.conditions)) return false;
  if (typeof criteria.match_type !== "string" || !["all", "any"].includes(criteria.match_type)) {
    return false;
  }

  return criteria.conditions.every((condition: any) => {
    return (
      typeof condition === "object" &&
      typeof condition.field === "string" &&
      typeof condition.operator === "string" &&
      condition.value !== undefined
    );
  });
}

async function assignCustomersToSegment(segmentId: string, criteria: CustomerSegmentCriteria) {
  try {
    // Start with base query
    let baseQuery = supabase.from("customers").select("id");
    
    // Build filter conditions
    const filterConditions = criteria.conditions.map((condition) => {
      const { field, operator, value } = condition;
      
      switch (operator) {
        case "equals":
          return `${field}.eq.${value}`;
        case "not_equals":
          return `${field}.neq.${value}`;
        case "greater_than":
          return `${field}.gt.${value}`;
        case "less_than":
          return `${field}.lt.${value}`;
        case "contains":
          return `${field}.ilike.%${value}%`;
        case "not_contains":
          return `${field}.not.ilike.%${value}%`;
        case "in":
          return `${field}.in.(${(value as any[]).join(",")})`;
        case "not_in":
          return `${field}.not.in.(${(value as any[]).join(",")})`;
        default:
          return null;
      }
    }).filter(Boolean);

    // Apply filters based on match type
    const query = criteria.match_type === "all"
      ? baseQuery.or(filterConditions.join(","))
      : baseQuery.or(filterConditions.join(","));

    const { data: customers, error } = await query;

    if (error) throw error;

    if (customers && customers.length > 0) {
      const memberships = customers.map((customer) => ({
        customer_id: customer.id,
        segment_id: segmentId,
      }));

      const { error: insertError } = await supabase
        .from("customer_segment_memberships")
        .insert(memberships);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error assigning customers to segment:", error);
    throw error;
  }
} 