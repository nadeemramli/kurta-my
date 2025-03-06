"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

interface ConversionMetrics {
  cart_views: number;
  checkout_starts: number;
  checkout_completions: number;
  successful_orders: number;
}

export default function ConversionFlowPage() {
  const [metrics, setMetrics] = useState<ConversionMetrics>({
    cart_views: 0,
    checkout_starts: 0,
    checkout_completions: 0,
    successful_orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversionMetrics() {
      try {
        // This is a placeholder query - you'll need to adjust based on your actual schema
        const { data, error } = await supabase
          .from("conversion_metrics")
          .select("*")
          .order("date", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        if (data) {
          setMetrics(data);
        }
      } catch (error) {
        console.error("Error fetching conversion metrics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConversionMetrics();
  }, []);

  const calculatePercentage = (value: number, total: number) => {
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Order Conversion Flow
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your order funnel and conversion rates
        </p>
      </div>

      {loading ? (
        <div className="text-center">Loading conversion metrics...</div>
      ) : (
        <div className="grid gap-6">
          {/* Funnel Visualization */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Conversion Funnel
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <div
                  className="bg-blue-100 h-12 rounded"
                  style={{ width: "100%" }}
                >
                  <div className="p-3 flex justify-between">
                    <span>Cart Views</span>
                    <span>{metrics.cart_views}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="bg-blue-200 h-12 rounded"
                  style={{
                    width: `${calculatePercentage(metrics.checkout_starts, metrics.cart_views)}%`,
                  }}
                >
                  <div className="p-3 flex justify-between">
                    <span>Started Checkout</span>
                    <span>{metrics.checkout_starts}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="bg-blue-300 h-12 rounded"
                  style={{
                    width: `${calculatePercentage(metrics.checkout_completions, metrics.cart_views)}%`,
                  }}
                >
                  <div className="p-3 flex justify-between">
                    <span>Completed Checkout</span>
                    <span>{metrics.checkout_completions}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div
                  className="bg-blue-400 h-12 rounded"
                  style={{
                    width: `${calculatePercentage(metrics.successful_orders, metrics.cart_views)}%`,
                  }}
                >
                  <div className="p-3 flex justify-between">
                    <span>Successful Orders</span>
                    <span>{metrics.successful_orders}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Rates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">
                Cart to Checkout
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {calculatePercentage(
                  metrics.checkout_starts,
                  metrics.cart_views
                )}
                %
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">
                Checkout to Completion
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {calculatePercentage(
                  metrics.checkout_completions,
                  metrics.checkout_starts
                )}
                %
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500">
                Overall Conversion
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">
                {calculatePercentage(
                  metrics.successful_orders,
                  metrics.cart_views
                )}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
