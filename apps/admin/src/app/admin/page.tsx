"use client";

import { useAdminAuth } from "@/components/auth/auth-context";
import { Card } from "@/components/ui/card";
import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {stat.name}
                  </p>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                  <p
                    className={`text-sm ${
                      stat.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
