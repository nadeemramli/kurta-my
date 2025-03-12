"use client";

import { useAdminAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  total_customers: number;
}

interface RecentOrder {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
}

// Mock data for initial UI development
const stats = [
  {
    name: "Total Revenue",
    value: "RM 45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Orders",
    value: "356",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    value: "2,103",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Avg. Order Value",
    value: "RM 127",
    change: "-3.2%",
    trend: "down",
    icon: BarChart3,
  },
];

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_orders: 0,
    total_revenue: 0,
    average_order_value: 0,
    total_customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      const { data: statsData, error: statsError } = await supabase.rpc(
        "get_dashboard_stats"
      );

      if (statsError) throw statsError;
      setStats(statsData);

      // Fetch recent orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*, customer:customers(first_name, last_name)")
        .order("created_at", { ascending: false })
        .limit(5);

      if (ordersError) throw ordersError;
      setRecentOrders(ordersData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statItems = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingCart,
      change: "+12.5%",
    },
    {
      label: "Total Revenue",
      value: `RM ${stats.total_revenue.toFixed(2)}`,
      icon: DollarSign,
      change: "+8.2%",
    },
    {
      label: "Average Order Value",
      value: `RM ${stats.average_order_value.toFixed(2)}`,
      icon: BarChart3,
      change: "+3.1%",
    },
    {
      label: "Total Customers",
      value: stats.total_customers,
      icon: Users,
      change: "+5.4%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-400">
                    {stat.label}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    {stat.value}
                  </h3>
                  <p className="mt-1 text-sm text-green-400">{stat.change}</p>
                </div>
                <div className="rounded-full bg-neutral-900 p-3">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Rest of the dashboard content */}
    </div>
  );
}
