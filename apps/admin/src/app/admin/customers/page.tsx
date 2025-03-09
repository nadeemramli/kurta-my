"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@kurta-my/database";
import {
  AlertCircle,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Customer = Database["customers"]["Row"] & {
  orders_count?: number;
  total_spent?: number;
  status: "active" | "inactive";
};

interface FilterOptions {
  search: string;
  status: "all" | "active" | "inactive";
  sortBy: "created_at" | "name" | "orders_count" | "total_spent";
  sortOrder: "asc" | "desc";
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    status: "all",
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("customers")
        .select("*, orders(count), orders(sum(total_amount))")
        .order(filters.sortBy, { ascending: filters.sortOrder === "asc" });

      if (filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      if (filters.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const customersWithStats = data?.map((customer) => ({
        ...customer,
        orders_count: customer.orders?.[0]?.count ?? 0,
        total_spent: customer.orders?.[0]?.sum ?? 0,
      }));

      setCustomers(customersWithStats || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: FilterOptions[typeof key]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
          <h1 className="text-xl font-medium text-white">Customers</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage your customer base
          </p>
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

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search customers..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-9 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() =>
              handleFilterChange(
                "sortOrder",
                filters.sortOrder === "asc" ? "desc" : "asc"
              )
            }
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[120px] justify-between">
                {filters.status === "all"
                  ? "All"
                  : filters.status.charAt(0).toUpperCase() +
                    filters.status.slice(1)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleFilterChange("status", "all")}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("status", "active")}
              >
                Active
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("status", "inactive")}
              >
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-between">
                Sort by: {filters.sortBy.split("_").join(" ")}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleFilterChange("sortBy", "created_at")}
              >
                Date created
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sortBy", "name")}
              >
                Name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sortBy", "orders_count")}
              >
                Orders count
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("sortBy", "total_spent")}
              >
                Total spent
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-800">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Customer
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
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Total Spent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                >
                  Created
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-neutral-400"
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-900">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-neutral-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">
                            {customer.first_name} {customer.last_name}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          customer.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {customer.orders_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {formatCurrency(customer.total_spent || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
