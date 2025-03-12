import { supabase } from "../supabase";
import type { Order, OrderItem, OrderStatus, PaymentStatus, PaymentMethod, Address } from "@/types";

interface CreateOrderInput {
  customerId: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  notes?: string;
  metadata?: Record<string, any>;
}

export async function createOrder(input: CreateOrderInput): Promise<Order | null> {
  try {
    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: input.customerId,
        status: "pending" as OrderStatus,
        payment_status: "pending" as PaymentStatus,
        payment_method: input.paymentMethod,
        shipping_address: input.shippingAddress,
        billing_address: input.billingAddress || input.shippingAddress,
        notes: input.notes,
        metadata: input.metadata,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.quantity * item.unitPrice,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("id", order.id)
      .single();

    if (fetchError) throw fetchError;

    return transformOrder(completeOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformOrder(data);
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map(transformOrder);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
}

interface OrderRow {
  id: string;
  customer_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  total_amount: number;
  subtotal_amount: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billing_address: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  metadata?: Record<string, any>;
  ordered_at: string;
  created_at: string;
  updated_at: string;
  items: OrderItemRow[];
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  metadata?: Record<string, any>;
}

function transformOrder(data: OrderRow): Order {
  return {
    id: data.id,
    customerId: data.customer_id,
    status: data.status,
    paymentStatus: data.payment_status,
    paymentMethod: data.payment_method,
    totalAmount: data.total_amount,
    subtotalAmount: data.subtotal_amount,
    taxAmount: data.tax_amount,
    shippingAmount: data.shipping_amount,
    discountAmount: data.discount_amount,
    shippingAddress: data.shipping_address,
    billingAddress: data.billing_address,
    notes: data.notes,
    metadata: data.metadata,
    orderedAt: data.ordered_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    items: data.items.map(transformOrderItem),
  };
}

function transformOrderItem(data: OrderItemRow): OrderItem {
  return {
    id: data.id,
    orderId: data.order_id,
    productId: data.product_id,
    variantId: data.variant_id,
    quantity: data.quantity,
    unitPrice: data.unit_price,
    totalPrice: data.total_price,
    metadata: data.metadata,
  };
} 