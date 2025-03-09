"use client";

import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

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

interface OrderMetricsProps {
  metrics: OrderAnalytics | null;
  loading?: boolean;
}

export function OrderMetrics({ metrics, loading }: OrderMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  const stats = [
    {
      name: "Total Orders",
      value: metrics?.total_orders || 0,
      change: "+12.3%",
      trend: "up",
    },
    {
      name: "Total Revenue",
      value: formatCurrency(metrics?.total_revenue || 0),
      change: "+15.1%",
      trend: "up",
    },
    {
      name: "Average Order Value",
      value: formatCurrency(metrics?.average_order_value || 0),
      change: "+2.3%",
      trend: "up",
    },
    {
      name: "Conversion Rate",
      value: `${(metrics?.conversion_rate || 0).toFixed(1)}%`,
      change: "+4.1%",
      trend: "up",
    },
    {
      name: "Return Rate",
      value: `${((metrics?.return_rate || 0) * 100).toFixed(1)}%`,
      change: "-2.1%",
      trend: "down",
    },
    {
      name: "Total Profit",
      value: formatCurrency(metrics?.total_profit || 0),
      change: "+8.2%",
      trend: "up",
    },
    {
      name: "Profit Margin",
      value: `${((metrics?.profit_margin || 0) * 100).toFixed(1)}%`,
      change: "+1.5%",
      trend: "up",
    },
    {
      name: "Total Cost",
      value: formatCurrency(metrics?.total_cost || 0),
      change: "+10.2%",
      trend: "up",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-24 rounded bg-neutral-800" />
              <div className="h-6 w-32 rounded bg-neutral-800" />
              <div className="h-4 w-16 rounded bg-neutral-800" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-400">
              {stat.name}
            </span>
            <span className="mt-2 text-2xl font-semibold text-white">
              {stat.value}
            </span>
            <div className="mt-2 flex items-center gap-1">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span
                className={`text-sm ${
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
