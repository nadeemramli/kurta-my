"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartCardProps {
  title: string;
  type: "line" | "bar";
  data: ChartData<"line" | "bar">;
  options?: ChartOptions<"line" | "bar">;
  loading?: boolean;
  className?: string;
}

export default function ChartCard({
  title,
  type,
  data,
  options,
  loading,
  className,
}: ChartCardProps) {
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full animate-pulse rounded bg-gray-200" />
        ) : (
          <div className="h-[300px]">
            {type === "line" ? (
              <Line data={data} options={options || defaultOptions} />
            ) : (
              <Bar data={data} options={options || defaultOptions} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
