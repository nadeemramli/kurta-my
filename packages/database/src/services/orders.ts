import type { SupabaseClient } from '../lib/supabase';
import type { Database } from '../types';

type Order = Database['orders']['Row'];

export class OrdersService {
  constructor(private supabase: SupabaseClient) {}

  async getAllOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getDraftOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('status', 'draft')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateOrderStatus(orderId: string, status: Order['status']) {
    const { error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  }
} 