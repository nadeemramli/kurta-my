"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, X } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LoyaltyTierFormData {
  name: string;
  minimum_points: number;
  benefits: string[];
}

interface LoyaltyTierFormProps {
  initialData?: LoyaltyTierFormData;
  onSubmit: (data: LoyaltyTierFormData) => Promise<void>;
}

export function LoyaltyTierForm({
  initialData,
  onSubmit,
}: LoyaltyTierFormProps) {
  const [formData, setFormData] = useState<LoyaltyTierFormData>(
    initialData || {
      name: "",
      minimum_points: 0,
      benefits: [""],
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
      console.error("Error submitting tier:", error);
      setError("Failed to save tier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ""],
    });
  };

  const removeBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index),
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({
      ...formData,
      benefits: newBenefits,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>
          {initialData ? "Edit Tier" : "Create New Tier"}
        </DialogTitle>
      </DialogHeader>

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

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Tier Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
            placeholder="e.g., Gold, Platinum, Diamond"
          />
        </div>

        <div>
          <Label htmlFor="minimum_points">Required Points</Label>
          <Input
            id="minimum_points"
            type="number"
            min="0"
            value={formData.minimum_points}
            onChange={(e) =>
              setFormData({
                ...formData,
                minimum_points: parseInt(e.target.value) || 0,
              })
            }
            className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
            placeholder="Minimum points required for this tier"
          />
        </div>

        <div>
          <Label>Benefits</Label>
          <div className="space-y-2">
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) => updateBenefit(index, e.target.value)}
                  className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                  placeholder="e.g., Free shipping on all orders"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-neutral-800 hover:bg-neutral-900"
                  onClick={() => removeBenefit(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-neutral-800 hover:bg-neutral-900"
              onClick={addBenefit}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Benefit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          className="bg-white text-neutral-900 hover:bg-neutral-100"
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Create Tier"
          )}
        </Button>
      </div>
    </form>
  );
}
