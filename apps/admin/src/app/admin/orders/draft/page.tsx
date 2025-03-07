"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@kurta-my/database";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

type Order = Database["orders"]["Row"] & {
  customer?: Database["customers"]["Row"];
};

export default function DraftOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDraftOrders() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            customer:customers(*)
          `
          )
          .eq("status", "draft")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching draft orders:", error);
        setError("Failed to load draft orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchDraftOrders();
  }, []);

  const handleComplete = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "pending" })
        .eq("id", orderId);

      if (error) throw error;

      // Refresh the orders list
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error completing draft order:", error);
      setError("Failed to complete the draft order. Please try again.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Draft Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage orders in draft status
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No draft orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">
                          {order.customer
                            ? `${order.customer.first_name} ${order.customer.last_name}`
                            : "N/A"}
                        </div>
                        <div className="text-gray-500">
                          {order.customer?.email || "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      RM {order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.updated_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        onClick={() => {
                          /* TODO: Implement edit */
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleComplete(order.id)}
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
