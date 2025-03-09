export type OrderStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  inventory_quantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: Product;
}

export interface CommunicationPreferences {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
}

export interface Address {
  first_name: string;
  last_name: string;
  country: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total_amount: number;
  subtotal_amount: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  shipping_address: Address;
  billing_address: Address;
  payment_status: PaymentStatus;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  items: OrderItem[];
  communication_channels: CommunicationPreferences;
  delivery_option: string;
}

export interface OrderSummary {
  order_id: string;
  customer_name: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  items_count: number;
  created_at: string;
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