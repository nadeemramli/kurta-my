"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { AlertCircle } from "lucide-react";

interface ConversionMetrics {
  cart_views: number;
  checkout_starts: number;
  checkout_completions: number;
  successful_orders: number;
}

interface AbandonedCheckout {
  id: string;
  customer: {
    email: string;
    name: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  abandoned_at: string;
  last_step: "shipping" | "payment" | "review";
  email_sent: boolean;
}

export default function ConversionFlowPage() {
  const [activeTab, setActiveTab] = useState("funnel");
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null);
  const [abandonedCheckouts, setAbandonedCheckouts] = useState<
    AbandonedCheckout[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch conversion metrics
        const { data: metricsData, error: metricsError } = await supabase
          .from("conversion_metrics")
          .select("*")
          .single();

        if (metricsError) throw metricsError;
        setMetrics(metricsData);

        // Fetch abandoned checkouts
        const { data: checkoutsData, error: checkoutsError } = await supabase
          .from("abandoned_checkouts")
          .select(
            `
            id,
            customers (
              email,
              first_name,
              last_name
            ),
            checkout_items (
              products (
                name
              ),
              quantity,
              price
            ),
            total_amount,
            abandoned_at,
            last_step,
            email_sent
          `
          )
          .order("abandoned_at", { ascending: false });

        if (checkoutsError) throw checkoutsError;
        setAbandonedCheckouts(
          (checkoutsData || []).map((data) => ({
            id: data.id,
            customer: {
              email: data.customers.email,
              name: `${data.customers.first_name} ${data.customers.last_name}`.trim(),
            },
            items: data.checkout_items.map((item) => ({
              product_name: item.products.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total_amount: data.total_amount,
            abandoned_at: data.abandoned_at,
            last_step: data.last_step,
            email_sent: data.email_sent,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  const calculatePercentage = (value: number, total: number) => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  };

  const conversionSteps = [
    {
      name: "Cart Views",
      value: metrics?.cart_views || 0,
      percentage: 100,
    },
    {
      name: "Started Checkout",
      value: metrics?.checkout_starts || 0,
      percentage: calculatePercentage(
        metrics?.checkout_starts || 0,
        metrics?.cart_views || 0
      ),
    },
    {
      name: "Completed Checkout",
      value: metrics?.checkout_completions || 0,
      percentage: calculatePercentage(
        metrics?.checkout_completions || 0,
        metrics?.cart_views || 0
      ),
    },
    {
      name: "Successful Orders",
      value: metrics?.successful_orders || 0,
      percentage: calculatePercentage(
        metrics?.successful_orders || 0,
        metrics?.cart_views || 0
      ),
    },
  ];

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
          <h1 className="text-xl font-medium text-white">Conversion Flow</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Track customer journey and abandoned checkouts
          </p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned Checkouts</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="mt-4">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Conversion Funnel
              </h2>
              <div className="space-y-4">
                {conversionSteps.map((step) => (
                  <div key={step.name} className="relative">
                    <div
                      className={`h-12 rounded ${
                        step.name === "Cart Views"
                          ? "bg-info-light text-info"
                          : step.name === "Started Checkout"
                          ? "bg-warning-light text-warning"
                          : step.name === "Completed Checkout"
                          ? "bg-success-light text-success"
                          : "bg-error-light text-error"
                      }`}
                      style={{ width: `${step.percentage}%` }}
                    >
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <span className="font-medium">{step.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{step.value}</span>
                          <span className="text-sm text-secondary">
                            ({step.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="abandoned" className="mt-4">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Abandoned Checkouts
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-20 animate-pulse rounded bg-neutral-800"
                    />
                  ))}
                </div>
              ) : abandonedCheckouts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-400">
                    No abandoned checkouts found
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800">
                  {abandonedCheckouts.map((checkout) => (
                    <div key={checkout.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-white">
                            {checkout.customer.name || checkout.customer.email}
                          </p>
                          <p className="text-sm text-neutral-400">
                            Abandoned at:{" "}
                            {new Date(checkout.abandoned_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-neutral-400">
                            Last step: {checkout.last_step}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">
                            {formatCurrency(checkout.total_amount)}
                          </p>
                          <p className="text-sm text-neutral-400">
                            {checkout.items.length} items
                          </p>
                          {!checkout.email_sent && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-400">
                              <AlertCircle className="h-3 w-3" />
                              Recovery email not sent
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-neutral-400">
                          {checkout.items.map((item, index) => (
                            <span key={index}>
                              {item.quantity}x {item.product_name}
                              {index < checkout.items.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
