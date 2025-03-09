"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Tag, Gift, Users, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface PromotionStats {
  total_orders: number;
  total_discount: number;
  average_discount: number;
  total_revenue: number;
  conversion_rate: number;
}

interface Promotion {
  id: string;
  name: string;
  type: "coupon" | "campaign" | "loyalty" | "referral";
  status: "active" | "scheduled" | "ended" | "draft";
  start_date: string;
  end_date: string | null;
  discount_type: "percentage" | "fixed" | "bogo";
  discount_value: number;
  usage_count: number;
  total_discount: number;
  min_purchase?: number;
  created_at: string;
}

export default function PromotionsPage() {
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch promotion statistics
        const { data: statsData, error: statsError } = await supabase
          .from("promotion_stats")
          .select("*")
          .single();

        if (statsError) throw statsError;

        // Fetch active promotions
        const { data: promoData, error: promoError } = await supabase
          .from("promotions")
          .select("*")
          .order("created_at", { ascending: false });

        if (promoError) throw promoError;

        setStats(statsData);
        setPromotions(promoData || []);
      } catch (error) {
        console.error("Error fetching promotions data:", error);
        setError("Failed to load promotions data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success bg-success-light";
      case "scheduled":
        return "text-warning bg-warning-light";
      case "ended":
        return "text-error bg-error-light";
      default:
        return "text-secondary bg-neutral-800/50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "coupon":
        return Tag;
      case "campaign":
        return Gift;
      case "loyalty":
      case "referral":
        return Users;
      default:
        return Tag;
    }
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
          <h1 className="text-xl font-medium text-white">Promotions</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your promotional campaigns and discounts
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href = "/admin/promotions/discounts")
            }
          >
            Manage Discounts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button className="bg-white text-neutral-900 hover:bg-neutral-100">
            <Plus className="mr-2 h-4 w-4" />
            New Promotion
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Error</h3>
              <div className="mt-2 text-sm text-red-400">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary">Total Orders</p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {loading ? "..." : stats?.total_orders.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-success">+12.3% from last month</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary">Total Discount</p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {loading ? "..." : formatCurrency(stats?.total_discount || 0)}
            </p>
            <p className="mt-1 text-sm text-error">
              -2.5% profit margin impact
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary">
              Average Discount
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {loading ? "..." : formatCurrency(stats?.average_discount || 0)}
            </p>
            <p className="mt-1 text-sm text-success">
              {stats?.conversion_rate.toFixed(1)}% conversion rate
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-secondary">
              Total Revenue (After Discount)
            </p>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {loading ? "..." : formatCurrency(stats?.total_revenue || 0)}
            </p>
            <p className="mt-1 text-sm text-success">+8.1% from last month</p>
          </div>
        </Card>
      </div>

      {/* Promotions List */}
      <Card>
        <div className="rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Usage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Total Discount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <tr key={index}>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : promotions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-neutral-400"
                    >
                      No promotions found
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => {
                    const Icon = getTypeIcon(promo.type);
                    return (
                      <tr key={promo.id} className="hover:bg-neutral-900">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">
                            {promo.name}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {promo.discount_type === "percentage"
                              ? `${promo.discount_value}% off`
                              : promo.discount_type === "fixed"
                              ? formatCurrency(promo.discount_value)
                              : "Buy 1 Get 1"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2 text-neutral-400" />
                            <span className="text-sm text-neutral-400 capitalize">
                              {promo.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              promo.status
                            )}`}
                          >
                            {promo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                          <div>
                            {format(new Date(promo.start_date), "MMM d, yyyy")}
                          </div>
                          {promo.end_date && (
                            <div className="text-neutral-500">
                              to{" "}
                              {format(new Date(promo.end_date), "MMM d, yyyy")}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                          {promo.usage_count} uses
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                          {formatCurrency(promo.total_discount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            Edit
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
