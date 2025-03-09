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

type ChartType = "line" | "bar";

interface ChartCardProps<T extends ChartType> {
  title: string;
  type: T;
  data: ChartData<T>;
  options?: ChartOptions<T>;
  loading?: boolean;
  className?: string;
}

export default function ChartCard<T extends ChartType>({
  title,
  type,
  data,
  options,
  loading,
  className,
}: ChartCardProps<T>) {
  const baseOptions = {
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
          <div className="h-[300px] w-full animate-pulse rounded bg-neutral-800" />
        ) : (
          <div className="h-[300px]">
            {type === "line" ? (
              <Line
                data={data as ChartData<"line">}
                options={(options || baseOptions) as ChartOptions<"line">}
              />
            ) : (
              <Bar
                data={data as ChartData<"bar">}
                options={(options || baseOptions) as ChartOptions<"bar">}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
