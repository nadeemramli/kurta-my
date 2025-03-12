import { supabase } from "../supabase";
import type { Customer, CustomerSegment, LoyaltyProgram } from "@/types";

interface CustomerRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  orders_count: number;
  total_spent: number;
  average_order_value: number;
  first_order_date: string | null;
  last_order_date: string | null;
  metadata: Record<string, any>;
}

interface CustomerSegmentRow {
  id: string;
  name: string;
  description: string | null;
  criteria: Record<string, any>;
}

interface LoyaltyProgramRow {
  id: string;
  customer_id: string;
  points_balance: number;
  lifetime_points: number;
  tier_level: string;
  tier_progress: number;
  last_points_earned_at: string | null;
}

interface CustomerSegmentMembershipRow {
  segment: CustomerSegmentRow;
}

export async function getCustomer(id: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select()
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformCustomer(data);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select()
      .eq("email", email)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformCustomer(data);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return null;
  }
}

export async function createCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
      })
      .select()
      .single();

    if (error) throw error;

    return transformCustomer(data);
  } catch (error) {
    console.error("Error creating customer:", error);
    return null;
  }
}

export async function updateCustomer(
  id: string,
  input: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>
): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return transformCustomer(data);
  } catch (error) {
    console.error("Error updating customer:", error);
    return null;
  }
}

export async function getCustomerSegments(customerId: string): Promise<CustomerSegment[]> {
  try {
    const { data, error } = await supabase
      .from("customer_segment_memberships")
      .select(`
        segment:customer_segments(
          id,
          name,
          description,
          criteria
        )
      `)
      .eq("customer_id", customerId);

    if (error) throw error;

    return data.map(row => transformCustomerSegment(row.segment[0]));
  } catch (error) {
    console.error("Error fetching customer segments:", error);
    return [];
  }
}

export async function getCustomerLoyalty(customerId: string): Promise<LoyaltyProgram | null> {
  try {
    const { data, error } = await supabase
      .from("loyalty_program")
      .select()
      .eq("customer_id", customerId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformLoyaltyProgram(data);
  } catch (error) {
    console.error("Error fetching customer loyalty:", error);
    return null;
  }
}

function transformCustomer(data: CustomerRow): Customer {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    ordersCount: data.orders_count,
    totalSpent: data.total_spent,
    averageOrderValue: data.average_order_value,
    firstOrderDate: data.first_order_date || undefined,
    lastOrderDate: data.last_order_date || undefined,
    metadata: data.metadata,
  };
}

function transformCustomerSegment(data: CustomerSegmentRow): CustomerSegment {
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    criteria: data.criteria,
  };
}

function transformLoyaltyProgram(data: LoyaltyProgramRow): LoyaltyProgram {
  return {
    id: data.id,
    customerId: data.customer_id,
    pointsBalance: data.points_balance,
    lifetimePoints: data.lifetime_points,
    tierLevel: data.tier_level,
    tierProgress: data.tier_progress,
    lastPointsEarnedAt: data.last_points_earned_at || undefined,
  };
} 