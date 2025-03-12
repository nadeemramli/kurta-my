import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { LoyaltyProgramWithDetails } from "@kurta-my/database/types/customer";

const TIER_BENEFITS: LoyaltyProgramWithDetails["tier_benefits"] = {
  bronze: {
    points_multiplier: 1,
    benefits: [
      "Earn 1 point per $1 spent",
      "Birthday bonus points",
      "Access to member-only sales",
    ],
  },
  silver: {
    points_multiplier: 1.2,
    benefits: [
      "20% bonus points on purchases",
      "Free shipping on orders over $50",
      "Early access to sales",
      "Birthday double points",
    ],
  },
  gold: {
    points_multiplier: 1.5,
    benefits: [
      "50% bonus points on purchases",
      "Free shipping on all orders",
      "Priority customer support",
      "Exclusive early access to new products",
      "Birthday triple points",
    ],
  },
  platinum: {
    points_multiplier: 2,
    benefits: [
      "Double points on all purchases",
      "Free express shipping",
      "VIP customer support",
      "Exclusive access to limited editions",
      "Birthday quadruple points",
      "Annual bonus points",
    ],
  },
  diamond: {
    points_multiplier: 3,
    benefits: [
      "Triple points on all purchases",
      "Free priority shipping",
      "Dedicated account manager",
      "First access to new collections",
      "Birthday quintuple points",
      "Quarterly bonus points",
      "Exclusive VIP events",
    ],
  },
};

type Params = { customerId: string };

type RouteContext = {
  params: {
    customerId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
): Promise<NextResponse> {
  try {
    const { data: loyalty, error } = await supabase
      .from("loyalty_program")
      .select("*")
      .eq("customer_id", params.customerId)
      .single();

    if (error) throw error;

    // Get recent transactions
    const { data: transactions, error: txError } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("customer_id", params.customerId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (txError) throw txError;

    const response: LoyaltyProgramWithDetails & { recent_transactions: any[] } = {
      ...loyalty,
      tier_benefits: TIER_BENEFITS,
      recent_transactions: transactions || [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching loyalty program:", error);
    return NextResponse.json(
      { error: "Failed to fetch loyalty program" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
): Promise<Response> {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { points, type, description } = body;

    if (!points || !type) {
      return NextResponse.json(
        { error: "Points and transaction type are required" },
        { status: 400 }
      );
    }

    // Start a transaction
    const { data: loyalty, error: loyaltyError } = await supabase
      .from("loyalty_program")
      .select("points_balance, lifetime_points")
      .eq("customer_id", params.customerId)
      .single();

    if (loyaltyError) throw loyaltyError;

    const newBalance = loyalty.points_balance + points;
    const newLifetimePoints = loyalty.lifetime_points + (points > 0 ? points : 0);

    // Update loyalty program
    const { error: updateError } = await supabase
      .from("loyalty_program")
      .update({
        points_balance: newBalance,
        lifetime_points: newLifetimePoints,
        last_points_earned_at: points > 0 ? new Date().toISOString() : undefined,
      })
      .eq("customer_id", params.customerId);

    if (updateError) throw updateError;

    // Record transaction
    const { error: txError } = await supabase
      .from("loyalty_transactions")
      .insert({
        customer_id: params.customerId,
        points_earned: points > 0 ? points : null,
        points_redeemed: points < 0 ? Math.abs(points) : null,
        transaction_type: type,
        description,
      });

    if (txError) throw txError;

    return NextResponse.json({ success: true, new_balance: newBalance });
  } catch (error) {
    console.error("Error updating loyalty points:", error);
    return NextResponse.json(
      { error: "Failed to update loyalty points" },
      { status: 500 }
    );
  }
} 