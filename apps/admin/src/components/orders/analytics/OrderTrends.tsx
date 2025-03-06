"use client";

import ChartCard from "@/components/charts/ChartCard";

interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

interface OrderTrendsProps {
  trends: OrderTrend[];
  loading?: boolean;
}

export default function OrderTrends({ trends, loading }: OrderTrendsProps) {
  const trendData = {
    labels: trends.map((t) => t.date),
    datasets: [
      {
        label: "Orders",
        data: trends.map((t) => t.orders),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        yAxisID: "orders",
      },
      {
        label: "Revenue (RM)",
        data: trends.map((t) => t.revenue),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        yAxisID: "revenue",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      orders: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
      revenue: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard
        title="Orders & Revenue Trend"
        type="line"
        data={trendData}
        options={options}
        loading={loading}
        className="lg:col-span-2"
      />
    </div>
  );
}
