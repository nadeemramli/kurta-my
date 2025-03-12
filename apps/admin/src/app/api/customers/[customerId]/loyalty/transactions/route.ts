import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { TransactionType } from "@kurta-my/database/types/customer";

export async function GET(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let query = supabase
      .from("loyalty_transactions")
      .select("*", { count: "exact" })
      .eq("customer_id", params.customerId)
      .order("created_at", { ascending: false });

    if (startDate) {
      query = query.gte("created_at", startDate);
    }

    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data: transactions, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      transactions,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching loyalty transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch loyalty transactions" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { customerId: string } }
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
    const { points, type, description, orderId } = body;

    if (!points || !type) {
      return NextResponse.json(
        { error: "Points and transaction type are required" },
        { status: 400 }
      );
    }

    if (!isValidTransactionType(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
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
    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient points balance" },
        { status: 400 }
      );
    }

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
    const { data: transaction, error: txError } = await supabase
      .from("loyalty_transactions")
      .insert({
        customer_id: params.customerId,
        order_id: orderId,
        points_earned: points > 0 ? points : null,
        points_redeemed: points < 0 ? Math.abs(points) : null,
        transaction_type: type,
        description,
      })
      .select()
      .single();

    if (txError) throw txError;

    return NextResponse.json({
      success: true,
      new_balance: newBalance,
      transaction,
    });
  } catch (error) {
    console.error("Error creating loyalty transaction:", error);
    return NextResponse.json(
      { error: "Failed to create loyalty transaction" },
      { status: 500 }
    );
  }
}

function isValidTransactionType(type: string): type is TransactionType {
  const validTypes: TransactionType[] = [
    "order_completion",
    "points_redemption",
    "points_expiry",
    "manual_adjustment",
    "referral_bonus",
    "birthday_bonus",
  ];
  return validTypes.includes(type as TransactionType);
} 