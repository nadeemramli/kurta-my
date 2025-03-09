"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import ChartCard from "@/components/charts/ChartCard";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

interface PerformanceMetrics {
  total_ad_spend: number;
  total_creative_cost: number;
  total_recurring_cost: number;
  total_cost: number;
  revenue: number;
  roas: number;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Mock data for demonstration
  const metrics: PerformanceMetrics = {
    total_ad_spend: 15000,
    total_creative_cost: 5000,
    total_recurring_cost: 2000,
    total_cost: 22000,
    revenue: 45000,
    roas: 2.05,
  };

  const spendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Ad Spend",
        data: [3500, 4200, 3800, 3500],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "Revenue",
        data: [8000, 12000, 15000, 10000],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
      },
    ],
  };

  const platformData = {
    labels: ["Facebook Ads", "Google Ads", "TikTok Ads"],
    datasets: [
      {
        label: "Spend by Platform",
        data: [8000, 4500, 2500],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(34, 197, 94, 0.5)",
        ],
        borderColor: [
          "rgb(59, 130, 246)",
          "rgb(239, 68, 68)",
          "rgb(34, 197, 94)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">
            Performance Reports
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            View marketing performance metrics and ROI
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-400">
              Total Ad Spend
            </span>
            <span className="mt-2 text-2xl font-semibold text-white">
              {formatCurrency(metrics.total_ad_spend)}
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-400">
              Total Revenue
            </span>
            <span className="mt-2 text-2xl font-semibold text-white">
              {formatCurrency(metrics.revenue)}
            </span>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-400">ROAS</span>
            <span className="mt-2 text-2xl font-semibold text-white">
              {metrics.roas.toFixed(2)}x
            </span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Spend vs Revenue Trend"
          type="line"
          data={spendData}
          className="w-full"
        />
        <ChartCard
          title="Spend by Platform"
          type="bar"
          data={platformData}
          className="w-full"
        />
      </div>

      {/* Cost Breakdown */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-medium text-white">Cost Breakdown</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Ad Spend</span>
            <span className="text-sm font-medium text-white">
              {formatCurrency(metrics.total_ad_spend)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Creative Costs</span>
            <span className="text-sm font-medium text-white">
              {formatCurrency(metrics.total_creative_cost)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">Recurring Costs</span>
            <span className="text-sm font-medium text-white">
              {formatCurrency(metrics.total_recurring_cost)}
            </span>
          </div>
          <div className="border-t border-neutral-800 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-400">
                Total Costs
              </span>
              <span className="text-sm font-medium text-white">
                {formatCurrency(metrics.total_cost)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
