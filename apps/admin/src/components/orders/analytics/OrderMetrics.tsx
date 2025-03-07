"use client";

import MetricCard from "@/components/metrics/MetricCard";

interface OrderAnalytics {
  date: string;
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  conversion_rate: number;
}

interface OrderMetricsProps {
  metrics: OrderAnalytics | null;
  loading: boolean;
}

export default function OrderMetrics({ metrics, loading }: OrderMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Orders"
        value={metrics?.total_orders || 0}
        loading={loading}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${metrics?.total_revenue.toFixed(2) || "0.00"}`}
        loading={loading}
      />
      <MetricCard
        title="Average Order Value"
        value={`$${metrics?.average_order_value.toFixed(2) || "0.00"}`}
        loading={loading}
      />
      <MetricCard
        title="Conversion Rate"
        value={`${metrics?.conversion_rate.toFixed(2) || "0.00"}%`}
        loading={loading}
      />
    </div>
  );
}
