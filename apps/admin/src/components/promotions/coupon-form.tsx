"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface CouponFormData {
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
}

interface CouponFormProps {
  initialData?: CouponFormData;
  onSubmit: (data: CouponFormData) => Promise<void>;
}

export function CouponForm({ initialData, onSubmit }: CouponFormProps) {
  const [formData, setFormData] = useState<CouponFormData>(
    initialData || {
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_purchase: 0,
      start_date: new Date().toISOString().split("T")[0],
      is_active: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting coupon:", error);
      setError("Failed to save coupon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                placeholder="e.g., SUMMER2024"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
                placeholder="Describe the coupon and its terms"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Discount Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Discount Settings
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discount_type">Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value: "percentage" | "fixed") =>
                  setFormData({ ...formData, discount_type: value })
                }
              >
                <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage Off</SelectItem>
                  <SelectItem value="fixed">Fixed Amount Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discount_value">
                {formData.discount_type === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount"}
              </Label>
              <Input
                id="discount_value"
                type="number"
                value={formData.discount_value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_value: parseFloat(e.target.value),
                  })
                }
                min={0}
                max={formData.discount_type === "percentage" ? 100 : undefined}
                className="bg-neutral-900 border-neutral-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="min_purchase">Minimum Purchase Amount</Label>
              <Input
                id="min_purchase"
                type="number"
                value={formData.min_purchase}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_purchase: parseFloat(e.target.value),
                  })
                }
                min={0}
                className="bg-neutral-900 border-neutral-800 text-white"
              />
            </div>

            {formData.discount_type === "percentage" && (
              <div>
                <Label htmlFor="max_discount">Maximum Discount Amount</Label>
                <Input
                  id="max_discount"
                  type="number"
                  value={formData.max_discount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_discount: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  min={0}
                  className="bg-neutral-900 border-neutral-800 text-white"
                  placeholder="No limit"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Usage Limits */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Usage Limits</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="usage_limit">Total Usage Limit</Label>
              <Input
                id="usage_limit"
                type="number"
                value={formData.usage_limit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usage_limit: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                min={0}
                className="bg-neutral-900 border-neutral-800 text-white"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <Label htmlFor="customer_limit">Per Customer Limit</Label>
              <Input
                id="customer_limit"
                type="number"
                value={formData.customer_limit || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customer_limit: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                min={0}
                className="bg-neutral-900 border-neutral-800 text-white"
                placeholder="Unlimited"
              />
            </div>
          </div>
        </Card>

        {/* Validity Period */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">
            Validity Period
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className="bg-neutral-900 border-neutral-800 text-white"
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    end_date: e.target.value || undefined,
                  })
                }
                min={formData.start_date}
                className="bg-neutral-900 border-neutral-800 text-white"
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Coupon"}
        </Button>
      </div>
    </form>
  );
}
