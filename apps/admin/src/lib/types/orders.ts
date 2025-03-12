import { MalaysianState } from "@/lib/constants";

export type OrderStatus =
  | "draft"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "returned"
  | "refunded"
  | "on_hold";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded";

export type PaymentMethod = "cod" | "fpx" | "card";

export interface Address {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: MalaysianState;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    title: string;
    sku: string;
    image?: string;
  };
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface OrderMetadata {
  payment_id?: string;
  payment_updated_at?: string;
  tracking_number?: string;
  shipping_provider?: string;
  tags?: string[];
  communication_channels?: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Order {
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
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  metadata?: OrderMetadata;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer: Customer;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  created_at: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  items_count: number;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  limit: number;
  total: number;
}

export type OrderUpdateAction = 
  | { action: 'update_status'; status: OrderStatus; payment_status?: PaymentStatus }
  | { action: 'cancel_order' }
  | { action: 'update_shipping'; shipping_amount: number }
  | { action: 'update_tax'; tax_amount: number }
  | { action: 'apply_discount'; discount_amount: number }; 