"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";
import OrderMetrics from "@/components/orders/analytics/OrderMetrics";
import OrderTrends from "@/components/orders/analytics/OrderTrends";

type OrderAnalytics = Database["order_analytics"]["Row"];

interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

export default function OrderAnalyticsPage() {
  const [metrics, setMetrics] = useState<OrderAnalytics | null>(null);
  const [trends, setTrends] = useState<OrderTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from("order_analytics")
          .select("*")
          .order("date", { ascending: false })
          .limit(1)
          .single();

        if (metricsError) throw metricsError;

        // Fetch trends (last 30 days)
        const { data: trendsData, error: trendsError } = await supabase
          .from("order_analytics")
          .select("date, total_orders, total_revenue")
          .order("date", { ascending: true })
          .limit(30);

        if (trendsError) throw trendsError;

        setMetrics(metricsData);
        setTrends(
          trendsData.map((item) => ({
            date: format(new Date(item.date), "MMM d"),
            orders: item.total_orders,
            revenue: item.total_revenue,
          }))
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Order Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your store&apos;s order performance
        </p>
      </div>

      <OrderMetrics metrics={metrics} loading={loading} />
      <OrderTrends trends={trends} loading={loading} />
    </div>
  );
}
