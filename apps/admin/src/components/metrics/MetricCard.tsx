"use client";

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  loading?: boolean;
}

export default function MetricCard({
  title,
  value,
  change,
  loading,
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          )}
        </div>
        {change && (
          <div
            className={cn(
              "rounded-full p-2",
              change.trend === "up"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            )}
          >
            {change.trend === "up" ? (
              <ArrowUpIcon className="h-5 w-5" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" />
            )}
          </div>
        )}
      </div>
      {change && (
        <p
          className={cn(
            "mt-4 text-sm",
            change.trend === "up" ? "text-green-600" : "text-red-600"
          )}
        >
          {change.value}% from last period
        </p>
      )}
    </div>
  );
}
