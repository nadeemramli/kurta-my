"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CouponForm } from "@/components/promotions/coupon-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase: number;
  max_discount?: number;
  start_date: string;
  end_date?: string;
  usage_limit?: number;
  is_active: boolean;
  customer_limit?: number;
  usage_count: number;
  total_discount: number;
  created_at: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setCoupons(data || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Failed to load coupons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from("coupons")
          .update(formData)
          .eq("id", selectedCoupon.id);
        if (error) throw error;
      } else {
        // Create new coupon
        const { error } = await supabase.from("coupons").insert([formData]);
        if (error) throw error;
      }

      setIsFormOpen(false);
      setSelectedCoupon(null);
      fetchCoupons();
    } catch (error) {
      console.error("Error saving coupon:", error);
      throw new Error("Failed to save coupon. Please try again.");
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
          <div className="flex items-center gap-4">
            <Link
              href="/admin/promotions"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-900 hover:text-white"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-xl font-medium text-white">Coupons</h1>
              <p className="mt-1 text-sm text-neutral-400">
                Create and manage discount coupons
              </p>
            </div>
          </div>
        </div>
        <Button
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          onClick={() => {
            setSelectedCoupon(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Coupon
        </Button>
      </div>

      <Card>
        <div className="rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Total Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Valid Until
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
                ) : coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-neutral-400"
                    >
                      No coupons found
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-neutral-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">
                          {coupon.code}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {coupon.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}% off`
                          : formatCurrency(coupon.discount_value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            coupon.is_active
                              ? "text-success bg-success-light"
                              : "text-error bg-error-light"
                          }`}
                        >
                          {coupon.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {coupon.usage_count} uses
                        {coupon.usage_limit && ` / ${coupon.usage_limit} limit`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatCurrency(coupon.total_discount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {coupon.end_date
                          ? format(new Date(coupon.end_date), "MMM d, yyyy")
                          : "No expiry"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          onClick={() => {
                            setSelectedCoupon(coupon);
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
        <DialogContent className="sm:max-w-[800px]">
          <CouponForm
            initialData={selectedCoupon || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
