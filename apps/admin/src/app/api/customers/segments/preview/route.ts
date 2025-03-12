import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { CustomerSegmentCriteria } from "@kurta-my/database/types/customer";

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
    const { criteria } = body;

    if (!isValidSegmentCriteria(criteria)) {
      return NextResponse.json(
        { error: "Invalid segment criteria format" },
        { status: 400 }
      );
    }

    // Build base query for matching customers
    let query = supabase.from("customers").select(`
      id,
      orders (
        id,
        total_amount,
        created_at,
        order_items (
          product:products (
            id,
            name,
            category_id,
            categories (
              id,
              name
            )
          )
        )
      )
    `);

    // Apply segment criteria
    const { conditions, match_type } = criteria;
    const filterConditions = conditions.map((condition) => {
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

    query = match_type === "all"
      ? query.or(filterConditions.join(","))
      : query.or(filterConditions.join(","));

    const { data: customers, error } = await query;

    if (error) throw error;

    // Calculate segment analytics
    const analytics = calculateSegmentAnalytics(customers || []);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error generating segment preview:", error);
    return NextResponse.json(
      { error: "Failed to generate segment preview" },
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

function calculateSegmentAnalytics(customers: any[]) {
  const now = new Date();
  
  // Initialize counters and accumulators
  let totalRevenue = 0;
  let totalOrders = 0;
  const productCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const orderDates: Date[] = [];

  // Process customer data
  customers.forEach((customer) => {
    if (customer.orders) {
      customer.orders.forEach((order: any) => {
        totalRevenue += order.total_amount;
        totalOrders++;
        orderDates.push(new Date(order.created_at));

        // Count products and categories
        order.order_items?.forEach((item: any) => {
          if (item.product) {
            const productName = item.product.name;
            productCounts[productName] = (productCounts[productName] || 0) + 1;

            if (item.product.categories) {
              const categoryName = item.product.categories.name;
              categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
            }
          }
        });
      });
    }
  });

  // Calculate order frequency (average days between orders)
  let orderFrequency = 0;
  if (orderDates.length > 1) {
    orderDates.sort((a, b) => a.getTime() - b.getTime());
    const totalDays = (orderDates[orderDates.length - 1].getTime() - orderDates[0].getTime()) / (1000 * 60 * 60 * 24);
    orderFrequency = totalDays / (orderDates.length - 1);
  }

  // Sort and limit top products and categories
  const topProducts = Object.entries(productCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return {
    estimatedSize: customers.length,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    totalRevenue,
    orderFrequency,
    topProducts,
    topCategories,
  };
} 