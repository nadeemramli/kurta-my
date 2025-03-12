import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CustomerSegment, CustomerSegmentCriteria } from "@kurta-my/database/types/customer";

export async function GET() {
  try {
    const { data: segments, error } = await supabase
      .from("customer_segments")
      .select("*");

    if (error) throw error;

    return NextResponse.json(segments);
  } catch (error) {
    console.error("Error fetching customer segments:", error);
    return NextResponse.json({ error: "Failed to fetch customer segments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, criteria } = body;

    // Validate criteria structure
    if (!isValidSegmentCriteria(criteria)) {
      return NextResponse.json(
        { error: "Invalid segment criteria format" },
        { status: 400 }
      );
    }

    const { data: segment, error } = await supabase
      .from("customer_segments")
      .insert({
        name,
        description,
        criteria,
      })
      .select()
      .single();

    if (error) throw error;

    // After creating the segment, find and add matching customers
    await assignCustomersToSegment(segment.id, criteria);

    return NextResponse.json(segment);
  } catch (error) {
    console.error("Error creating customer segment:", error);
    return NextResponse.json(
      { error: "Failed to create customer segment" },
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