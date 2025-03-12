export type OrderStatus = 'draft' | 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Address {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  accepts_marketing: boolean;
  total_spent: number;
  orders_count: number;
  last_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number;
  cost_per_item: number;
  sku: string;
  barcode?: string;
  inventory_quantity: number;
  status: ProductStatus;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
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
  communication_channels?: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  created_at: string;
  updated_at: string;
  // Relations
  customer?: Customer;
  items?: OrderItem[];
}

export interface Database {
  customers: {
    Row: Customer;
    Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'total_spent' | 'orders_count'>;
    Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
  };
  orders: {
    Row: Order;
    Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
  };
  order_items: {
    Row: OrderItem;
    Insert: Omit<OrderItem, 'id' | 'created_at'>;
    Update: Partial<Omit<OrderItem, 'id' | 'created_at'>>;
  };
  products: {
    Row: Product;
    Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
  };
} 