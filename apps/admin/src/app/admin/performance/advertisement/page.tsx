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

interface MarketingExpense {
  id: string;
  date: string;
  facebook_ads?: number;
  google_ads?: number;
  tiktok_ads?: number;
  total_spend: number;
  notes?: string;
  created_at: string;
}

interface ExpenseFormData {
  date: string;
  facebook_ads?: number;
  google_ads?: number;
  tiktok_ads?: number;
  notes?: string;
}

export default function AdvertisementPage() {
  const [expenses, setExpenses] = useState<MarketingExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<MarketingExpense | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("marketing_expenses")
        .select("*")
        .order("date", { ascending: false })
        .limit(30);

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
      const total_spend =
        (formData.facebook_ads || 0) +
        (formData.google_ads || 0) +
        (formData.tiktok_ads || 0);

      if (selectedExpense) {
        const { error } = await supabase
          .from("marketing_expenses")
          .update({ ...formData, total_spend })
          .eq("id", selectedExpense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("marketing_expenses")
          .insert([{ ...formData, total_spend }]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      setSelectedExpense(null);
      setFormData({ date: format(new Date(), "yyyy-MM-dd") });
      fetchExpenses();
    } catch (error) {
      console.error("Error saving expense:", error);
      setError("Failed to save expense. Please try again.");
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "-";
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Advertisement</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Track your daily marketing expenses across different platforms
          </p>
        </div>
        <Button
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          onClick={() => {
            setSelectedExpense(null);
            setFormData({ date: format(new Date(), "yyyy-MM-dd") });
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
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Facebook Ads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Google Ads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    TikTok Ads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Total Spend
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
                      <td colSpan={6} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-neutral-400"
                    >
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-neutral-900">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {format(new Date(expense.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatCurrency(expense.facebook_ads)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatCurrency(expense.google_ads)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatCurrency(expense.tiktok_ads)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatCurrency(expense.total_spend)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setFormData({
                              date: expense.date,
                              facebook_ads: expense.facebook_ads,
                              google_ads: expense.google_ads,
                              tiktok_ads: expense.tiktok_ads,
                              notes: expense.notes,
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
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="facebook_ads">Facebook Ads Spend</Label>
                <Input
                  id="facebook_ads"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.facebook_ads || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      facebook_ads: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                  placeholder="Enter amount (optional)"
                />
              </div>

              <div>
                <Label htmlFor="google_ads">Google Ads Spend</Label>
                <Input
                  id="google_ads"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.google_ads || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      google_ads: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                  placeholder="Enter amount (optional)"
                />
              </div>

              <div>
                <Label htmlFor="tiktok_ads">TikTok Ads Spend</Label>
                <Input
                  id="tiktok_ads"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.tiktok_ads || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tiktok_ads: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                  placeholder="Enter amount (optional)"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
                  rows={3}
                  placeholder="Add any additional notes (optional)"
                />
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
