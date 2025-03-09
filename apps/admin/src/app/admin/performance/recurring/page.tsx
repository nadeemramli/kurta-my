"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  billing_date: number;
  description?: string;
  status: "active" | "inactive";
  last_billed?: string;
  created_at: string;
}

interface ExpenseFormData {
  name: string;
  amount: number;
  category: string;
  billing_date: number;
  description?: string;
  status: "active" | "inactive";
}

export default function RecurringPage() {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<RecurringExpense | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: 0,
    category: "",
    billing_date: 1,
    status: "active",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("recurring_expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError("Failed to load expenses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedExpense) {
        const { error } = await supabase
          .from("recurring_expenses")
          .update(formData)
          .eq("id", selectedExpense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("recurring_expenses")
          .insert([formData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      setSelectedExpense(null);
      setFormData({
        name: "",
        amount: 0,
        category: "",
        billing_date: 1,
        status: "active",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      setError("Failed to save expense. Please try again.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  const categories = [
    "Infrastructure",
    "Marketing Tools",
    "Analytics",
    "Email Services",
    "Other",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Recurring Expenses</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage monthly recurring marketing expenses
          </p>
        </div>
        <Button
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          onClick={() => {
            setSelectedExpense(null);
            setFormData({
              name: "",
              amount: 0,
              category: "",
              billing_date: 1,
              status: "active",
            });
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
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

      <Card>
        <div className="rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Billing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Last Billed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
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
                ) : expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-neutral-400"
                    >
                      No recurring expenses found
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-neutral-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {expense.name}
                        </div>
                        {expense.description && (
                          <div className="text-sm text-neutral-400">
                            {expense.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {expense.billing_date}
                        {["1", "21", "31"].includes(
                          expense.billing_date.toString()
                        )
                          ? "st"
                          : ["2", "22"].includes(
                              expense.billing_date.toString()
                            )
                          ? "nd"
                          : ["3", "23"].includes(
                              expense.billing_date.toString()
                            )
                          ? "rd"
                          : "th"}{" "}
                        of month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            expense.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {expense.last_billed
                          ? format(new Date(expense.last_billed), "MMM d, yyyy")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setFormData({
                              name: expense.name,
                              amount: expense.amount,
                              category: expense.category,
                              billing_date: expense.billing_date,
                              description: expense.description,
                              status: expense.status,
                            });
                            setIsFormOpen(true);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-medium text-white">
              {selectedExpense ? "Edit Expense" : "Add New Expense"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white"
                  placeholder="e.g., AWS Hosting"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 text-white focus:border-neutral-700 focus:ring-neutral-700"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="amount">Monthly Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="billing_date">Billing Date</Label>
                <Input
                  id="billing_date"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.billing_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billing_date: parseInt(e.target.value) || 1,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white"
                  required
                />
                <p className="mt-1 text-sm text-neutral-400">
                  Day of the month when billing occurs
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
                  rows={3}
                  placeholder="Add any additional notes (optional)"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 text-white focus:border-neutral-700 focus:ring-neutral-700"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                className="bg-white text-neutral-900 hover:bg-neutral-100"
              >
                {selectedExpense ? "Save Changes" : "Add Expense"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
