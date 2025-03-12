import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createOrderSchema } from "@/lib/validations/orders";
import { supabase } from "@/lib/supabase";
import { type Order } from "@/lib/types/orders";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        first_name: validatedData.customer.first_name,
        last_name: validatedData.customer.last_name,
        email: validatedData.customer.email,
        phone: validatedData.customer.phone,
      })
      .select()
      .single();

    if (customerError) {
      console.error("Error creating customer:", customerError);
      return NextResponse.json(
        { message: "Failed to create customer" },
        { status: 500 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        status: "draft",
        payment_status: "pending",
        payment_method: validatedData.payment_method,
        total_amount: validatedData.calculation.total_amount,
        subtotal_amount: validatedData.calculation.subtotal_amount,
        tax_amount: validatedData.calculation.tax_amount,
        shipping_amount: validatedData.calculation.shipping_amount,
        discount_amount: validatedData.calculation.discount_amount,
        shipping_address: validatedData.shipping_address,
        billing_address: validatedData.billing_address,
        notes: validatedData.notes,
        metadata: {
          communication_channels: validatedData.communication_channels,
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { message: "Failed to create order" },
        { status: 500 }
      );
    }

    const orderItems = validatedData.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      return NextResponse.json(
        { message: "Failed to create order items" },
        { status: 500 }
      );
    }

    const { data: completeOrder, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        customer:customers(*),
        items:order_items(
          *,
          product:products(
            id,
            title,
            sku,
            image
          )
        )
      `)
      .eq("id", order.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete order:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch complete order" },
        { status: 500 }
      );
    }

    return NextResponse.json(completeOrder as Order);
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("orders")
      .select(
        `
        id,
        status,
        payment_status,
        total_amount,
        created_at,
        customer:customers(
          first_name,
          last_name,
          email
        ),
        items:order_items(count)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `customer.first_name.ilike.%${search}%,customer.last_name.ilike.%${search}%,customer.email.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { message: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      orders: data,
      total: count ?? 0,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 