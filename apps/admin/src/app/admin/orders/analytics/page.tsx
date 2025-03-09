"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { OrderMetrics } from "@/components/orders/analytics/OrderMetrics";
import ChartCard from "@/components/charts/ChartCard";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

interface OrderAnalytics {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
  return_rate: number;
  total_profit: number;
  profit_margin: number;
  total_cost: number;
}

interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
  profit: number;
  returns: number;
}

export default function OrderAnalyticsPage() {
  const [metrics, setMetrics] = useState<OrderAnalytics | null>(null);
  const [trends, setTrends] = useState<OrderTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from("order_analytics")
          .select("*")
          .single();

        if (metricsError) throw metricsError;
        setMetrics(metricsData);

        // Fetch trends
        const { data: trendsData, error: trendsError } = await supabase
          .from("order_analytics")
          .select(
            "date, total_orders, total_revenue, total_profit, return_rate"
          )
          .order("date", { ascending: true })
          .limit(30);

        if (trendsError) throw trendsError;
        setTrends(
          (trendsData || []).map((data) => ({
            date: data.date,
            orders: data.total_orders,
            revenue: data.total_revenue,
            profit: data.total_profit,
            returns: Math.round(data.total_orders * (data.return_rate || 0)),
          }))
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  const trendsData = {
    labels: trends.map((trend) => trend.date),
    datasets: [
      {
        label: "Orders",
        data: trends.map((trend) => trend.orders),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "Revenue",
        data: trends.map((trend) => trend.revenue),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
      {
        label: "Profit",
        data: trends.map((trend) => trend.profit),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.5)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Order Analytics</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Monitor order performance and trends
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <OrderMetrics metrics={metrics} loading={loading} />

      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Order Trends"
          type="line"
          data={trendsData}
          className="w-full"
        />
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-medium text-white">
            Top Products by Revenue
          </h2>
          {/* Add top products table here */}
        </Card>
      </div>
    </div>
  );
}
