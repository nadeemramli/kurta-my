export type Database = {
  orders: {
    Row: {
      id: string;
      customer_name: string;
      customer_email: string;
      status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'draft';
      total: number;
      items: {
        product_id: string;
        quantity: number;
        price: number;
      }[];
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      customer_name: string;
      customer_email: string;
      status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'draft';
      total: number;
      items: {
        product_id: string;
        quantity: number;
        price: number;
      }[];
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      customer_name?: string;
      customer_email?: string;
      status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'draft';
      total?: number;
      items?: {
        product_id: string;
        quantity: number;
        price: number;
      }[];
      created_at?: string;
      updated_at?: string;
    };
  };
  order_analytics: {
    Row: {
      id: string;
      date: string;
      total_orders: number;
      total_revenue: number;
      total_profit: number;
      average_order_value: number;
      return_rate: number;
      profit_margin: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      date: string;
      total_orders: number;
      total_revenue: number;
      total_profit: number;
      average_order_value: number;
      return_rate: number;
      profit_margin: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      date?: string;
      total_orders?: number;
      total_revenue?: number;
      total_profit?: number;
      average_order_value?: number;
      return_rate?: number;
      profit_margin?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
  conversion_metrics: {
    Row: {
      id: string;
      date: string;
      cart_views: number;
      checkout_starts: number;
      checkout_completions: number;
      successful_orders: number;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      date: string;
      cart_views: number;
      checkout_starts: number;
      checkout_completions: number;
      successful_orders: number;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      id?: string;
      date?: string;
      cart_views?: number;
      checkout_starts?: number;
      checkout_completions?: number;
      successful_orders?: number;
      created_at?: string;
      updated_at?: string;
    };
  };
}; 