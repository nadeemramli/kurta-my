import type { Database } from './index';

// Convenient type aliases
export type DbOrder = Database['public']['Tables']['orders']['Row'];
export type DbOrderItem = Database['public']['Tables']['order_items']['Row'];
export type DbCustomer = Database['public']['Tables']['customers']['Row'];
export type DbProduct = Database['public']['Tables']['products']['Row'];
export type DbAddress = Database['public']['Tables']['addresses']['Row'];

// Extended types with relationships
export interface OrderWithRelations extends DbOrder {
  customer?: DbCustomer;
  items?: DbOrderItem[];
  shipping_address?: DbAddress;
  billing_address?: DbAddress;
}

export interface CustomerWithRelations extends DbCustomer {
  orders?: DbOrder[];
  addresses?: DbAddress[];
}

export interface ProductWithRelations extends DbProduct {
  variants?: Database['public']['Tables']['product_variants']['Row'][];
  images?: Database['public']['Tables']['product_images']['Row'][];
  collections?: Database['public']['Tables']['collections']['Row'][];
}

// Helper type for creating new orders
export interface CreateOrderData {
  customer_id: string;
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    price: number;
  }[];
  shipping_address_id: string;
  billing_address_id: string;
  payment_method: string;
  notes?: string;
}

// Helper type for order status updates
export interface UpdateOrderStatusData {
  status: DbOrder['status'];
  payment_status?: DbOrder['payment_status'];
} 