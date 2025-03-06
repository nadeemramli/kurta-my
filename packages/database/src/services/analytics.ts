import type { SupabaseClient } from '../lib/supabase';
import type { Database } from '../types';

type OrderAnalytics = Database['order_analytics']['Row'];
type ConversionMetrics = Database['conversion_metrics']['Row'];

export class AnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  async getOrderAnalytics(date: string): Promise<OrderAnalytics | null> {
    const { data, error } = await this.supabase
      .from('order_analytics')
      .select('*')
      .eq('date', date)
      .single();

    if (error) throw error;
    return data;
  }

  async getConversionMetrics(date: string): Promise<ConversionMetrics | null> {
    const { data, error } = await this.supabase
      .from('conversion_metrics')
      .select('*')
      .eq('date', date)
      .single();

    if (error) throw error;
    return data;
  }

  async getOrderTrends(days: number = 30) {
    const { data, error } = await this.supabase
      .from('order_analytics')
      .select('*')
      .order('date', { ascending: true })
      .limit(days);

    if (error) throw error;
    return data;
  }

  async getConversionTrends(days: number = 30) {
    const { data, error } = await this.supabase
      .from('conversion_metrics')
      .select('*')
      .order('date', { ascending: true })
      .limit(days);

    if (error) throw error;
    return data;
  }
} 