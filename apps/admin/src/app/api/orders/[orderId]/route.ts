import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateOrderSchema } from "@/lib/validations/orders";
import { supabase } from "@/lib/supabase";
import { type Order } from "@/lib/types/orders";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: order, error } = await supabase
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
      .eq("id", params.orderId)
      .single();

    if (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { message: "Failed to fetch order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order as Order);
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateOrderSchema.parse(body);

    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update(validatedData)
      .eq("id", params.orderId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating order:", updateError);
      return NextResponse.json(
        { message: "Failed to update order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
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
      .eq("id", params.orderId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated order:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch updated order" },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow deletion of draft orders
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", params.orderId)
      .single();

    if (fetchError) {
      console.error("Error fetching order:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch order" },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "draft") {
      return NextResponse.json(
        { message: "Only draft orders can be deleted" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", params.orderId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      return NextResponse.json(
        { message: "Failed to delete order" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 