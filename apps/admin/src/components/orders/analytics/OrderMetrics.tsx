"use client";

import MetricCard from "@/components/metrics/MetricCard";
import type { Database } from "@/lib/supabase";

type OrderAnalytics = Database["order_analytics"]["Row"];

interface OrderMetricsProps {
  metrics: OrderAnalytics | null;
  loading?: boolean;
}

export default function OrderMetrics({ metrics, loading }: OrderMetricsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Total Orders"
        value={metrics?.total_orders || 0}
        loading={loading}
      />
      <MetricCard
        title="Total Revenue"
        value={`RM ${metrics?.total_revenue.toFixed(2) || "0.00"}`}
        loading={loading}
      />
      <MetricCard
        title="Average Order Value"
        value={`RM ${metrics?.average_order_value.toFixed(2) || "0.00"}`}
        loading={loading}
      />
      <MetricCard
        title="Return Rate"
        value={`${metrics?.return_rate.toFixed(1) || "0"}%`}
        loading={loading}
      />
      <MetricCard
        title="Total Profit"
        value={`RM ${metrics?.total_profit.toFixed(2) || "0.00"}`}
        loading={loading}
      />
      <MetricCard
        title="Profit Margin"
        value={`${metrics?.profit_margin.toFixed(1) || "0"}%`}
        loading={loading}
      />
    </div>
  );
}
