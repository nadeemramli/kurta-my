"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@kurta-my/database";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  AlertCircle,
  Calendar,
  Filter,
  Grid,
  List,
  Tag as TagIcon,
  User,
  Check,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Link from "next/link";
import { cn } from "@kurta-my/utils";
import React from "react";
import { OrderSheet } from "@/components/orders/OrderSheet";

type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "draft";

interface OrderTag {
  tag_name: string;
}

type Order = Database["orders"]["Row"] & {
  customer?: Database["customers"]["Row"];
  tags?: string[];
  status: OrderStatus;
  communication_channels?: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
};

type ViewMode = "list" | "kanban" | "calendar";

const viewOptions = [
  { label: "List", value: "list", icon: List },
  { label: "Kanban", value: "kanban", icon: Grid },
  { label: "Calendar", value: "calendar", icon: Calendar },
];

const orderStatuses = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" as OrderStatus },
  { label: "Processing", value: "processing" as OrderStatus },
  { label: "Completed", value: "completed" as OrderStatus },
  { label: "Cancelled", value: "cancelled" as OrderStatus },
];

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface FilterOptions {
  status: string;
  dateRange: DateRange;
  customerSearch: string;
  tags: string[];
}

const dateRangePresets = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    dateRange: {
      from: subDays(new Date(), 30),
      to: new Date(),
    },
    customerSearch: "",
    tags: [],
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewOrderSheet, setShowNewOrderSheet] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(*),
          tags:order_tags(tag_name)
        `
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.dateRange.from && filters.dateRange.to) {
        query = query
          .gte("created_at", startOfDay(filters.dateRange.from).toISOString())
          .lte("created_at", endOfDay(filters.dateRange.to).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      let filteredOrders =
        data?.map((order) => ({
          ...order,
          tags: order.tags?.map((t: { tag_name: string }) => t.tag_name) || [],
        })) || [];

      // Apply client-side filters
      if (filters.customerSearch) {
        const search = filters.customerSearch.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.customer?.first_name?.toLowerCase().includes(search) ||
            order.customer?.last_name?.toLowerCase().includes(search) ||
            order.customer?.email?.toLowerCase().includes(search)
        );
      }

      if (filters.tags.length > 0) {
        filteredOrders = filteredOrders.filter((order) =>
          filters.tags.some((tag) => order.tags?.includes(tag))
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data, error } = await supabase
          .from("order_tags")
          .select("tag_name")
          .eq("id", "id"); // This creates a unique constraint to get distinct values

        if (error) throw error;
        const uniqueTags = Array.from(
          new Set(data.map((t: OrderTag) => t.tag_name))
        );
        setAvailableTags(uniqueTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    }

    fetchTags();
  }, []);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: FilterOptions[typeof key]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dateRange: {
        from: subDays(new Date(), 30),
        to: new Date(),
      },
      customerSearch: "",
      tags: [],
    });
  };

  const renderFilters = () => (
    <div
      className={`space-y-4 rounded-lg border border-neutral-800 bg-neutral-950 p-4 ${
        showFilters ? "block" : "hidden"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-neutral-400 hover:text-white"
          onClick={clearFilters}
        >
          Clear all
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400">
            Date Range
          </label>
          <DateRangePicker
            value={filters.dateRange}
            onChange={(range) => handleFilterChange("dateRange", range)}
          />
          <div className="flex flex-wrap gap-2">
            {dateRangePresets.map((preset) => (
              <Button
                key={preset.days}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  handleFilterChange("dateRange", {
                    from: subDays(new Date(), preset.days),
                    to: new Date(),
                  })
                }
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400">
            Customer Search
          </label>
          <Input
            placeholder="Search by name or email"
            value={filters.customerSearch}
            onChange={(e) =>
              handleFilterChange("customerSearch", e.target.value)
            }
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neutral-700"
          >
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-400">Tags</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer ${
                  filters.tags.includes(tag)
                    ? "bg-white text-neutral-900"
                    : "bg-neutral-900"
                }`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/admin/orders/${order.id}`}
          className="block hover:bg-gray-50 transition-colors"
        >
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <Badge
                    className={cn(
                      order.status === "pending" && "bg-yellow-500",
                      order.status === "processing" && "bg-blue-500",
                      order.status === "completed" && "bg-green-500",
                      order.status === "cancelled" && "bg-red-500",
                      order.status === "draft" && "bg-gray-500"
                    )}
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {format(new Date(order.created_at), "PPp")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat("en-MY", {
                    style: "currency",
                    currency: "MYR",
                  }).format(order.total_amount)}
                </p>
                {order.customer && (
                  <p className="text-sm text-gray-500">
                    {order.customer.first_name} {order.customer.last_name}
                  </p>
                )}
              </div>
            </div>
            {/* Add communication preferences indicators */}
            {order.communication_channels && (
              <div className="mt-4 flex gap-2">
                {order.communication_channels.whatsapp && (
                  <Badge variant="outline">WhatsApp</Badge>
                )}
                {order.communication_channels.email && (
                  <Badge variant="outline">Email</Badge>
                )}
                {order.communication_channels.sms && (
                  <Badge variant="outline">SMS</Badge>
                )}
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );

  const renderKanbanView = () => (
    <div className="grid gap-6 lg:grid-cols-4">
      {orderStatuses
        .filter((status) => status.value !== "all")
        .map((status) => (
          <div key={status.value} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-primary">{status.label}</h3>
              <Badge variant="secondary" className="bg-neutral-900">
                {orders.filter((order) => order.status === status.value).length}
              </Badge>
            </div>
            <div className="space-y-4">
              {orders
                .filter((order) => order.status === status.value)
                .map((order) => (
                  <Card key={order.id} className="p-4 bg-card">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-info">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-sm text-secondary">
                          {format(new Date(order.created_at), "MMM d")}
                        </span>
                      </div>
                      <Link
                        href={`/admin/customers/${order.customer?.id}`}
                        className="flex items-center gap-2 text-sm text-secondary hover:text-primary"
                      >
                        <User className="h-4 w-4" />
                        <span>
                          {order.customer
                            ? `${order.customer.first_name} ${order.customer.last_name}`
                            : "N/A"}
                        </span>
                      </Link>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TagIcon className="h-4 w-4 text-secondary" />
                          <div className="flex gap-1">
                            {order.tags?.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-neutral-900"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <span className="font-medium text-primary">
                          RM {order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
    </div>
  );

  const renderCalendarView = () => {
    const today = new Date();
    const start = startOfWeek(startOfMonth(today));
    const end = endOfWeek(endOfMonth(today));
    const days = eachDayOfInterval({ start, end });

    const weeks: Date[][] = [];
    let week: Date[] = [];

    days.forEach((day) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    });

    if (week.length > 0) {
      weeks.push(week);
    }

    const getDayOrders = (day: Date) =>
      orders.filter((order) => isSameDay(new Date(order.created_at), day));

    return (
      <div className="rounded-lg border border-neutral-800 bg-card">
        <div className="grid grid-cols-7 gap-px border-b border-neutral-800 bg-neutral-800">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-neutral-950 px-2 py-3 text-center text-sm font-medium text-neutral-400"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-neutral-800">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayOrders = getDayOrders(day);
                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      "min-h-[8rem] bg-neutral-950 p-2",
                      !isSameMonth(day, today) && "bg-neutral-900/50"
                    )}
                  >
                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={cn(
                        "ml-auto flex h-6 w-6 items-center justify-center rounded-full text-sm",
                        isSameDay(day, today) &&
                          "bg-white font-semibold text-neutral-900"
                      )}
                    >
                      {format(day, "d")}
                    </time>
                    {dayOrders.length > 0 && (
                      <ol className="mt-2 space-y-1">
                        {dayOrders.slice(0, 2).map((order) => (
                          <li key={order.id}>
                            <Link
                              href={`/admin/orders/${order.id}`}
                              className="group flex text-sm"
                            >
                              <p
                                className={cn(
                                  "flex-auto truncate font-medium text-neutral-400 group-hover:text-white",
                                  {
                                    "text-green-400":
                                      order.status === "completed",
                                    "text-yellow-400":
                                      order.status === "pending",
                                    "text-blue-400":
                                      order.status === "processing",
                                    "text-red-400":
                                      order.status === "cancelled",
                                  }
                                )}
                              >
                                #{order.id.slice(0, 8)}
                              </p>
                              <p className="ml-3 w-16 text-right text-neutral-400">
                                RM {order.total_amount.toFixed(2)}
                              </p>
                            </Link>
                          </li>
                        ))}
                        {dayOrders.length > 2 && (
                          <li className="text-sm text-neutral-400">
                            + {dayOrders.length - 2} more
                          </li>
                        )}
                      </ol>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setShowNewOrderSheet(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      <OrderSheet
        open={showNewOrderSheet}
        onOpenChange={setShowNewOrderSheet}
        onSuccess={() => {
          fetchOrders();
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">All Orders</h1>
          <p className="mt-1 text-sm text-neutral-400">
            View and manage all orders from your store
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${
              showFilters ? "bg-white text-neutral-900" : ""
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {(filters.customerSearch ||
              filters.tags.length > 0 ||
              filters.status !== "all") && (
              <Badge className="ml-1 bg-neutral-900 text-white">
                {[
                  filters.status !== "all" && "1",
                  filters.customerSearch && "1",
                  filters.tags.length > 0 && filters.tags.length.toString(),
                ]
                  .filter(Boolean)
                  .reduce((a, b) => Number(a) + Number(b), 0)}
              </Badge>
            )}
          </Button>

          <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value as ViewMode)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                    viewMode === option.value
                      ? "bg-white text-neutral-900"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {renderFilters()}

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

      {loading && <div>Loading orders...</div>}

      {viewMode === "list" && renderListView()}
      {viewMode === "kanban" && renderKanbanView()}
      {viewMode === "calendar" && renderCalendarView()}
    </div>
  );
}
