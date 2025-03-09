"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LoyaltySettingsData {
  points_per_currency: number;
  minimum_points_redeem: number;
  points_value_currency: number;
  points_expiry_months: number;
  enable_points_expiry: boolean;
  enable_birthday_bonus: boolean;
  birthday_bonus_points: number;
  enable_welcome_points: boolean;
  welcome_points: number;
  rounding_rule: "up" | "down" | "nearest";
}

interface LoyaltySettingsFormProps {
  initialData?: LoyaltySettingsData;
  onSubmit: (data: LoyaltySettingsData) => Promise<void>;
}

export function LoyaltySettingsForm({
  initialData,
  onSubmit,
}: LoyaltySettingsFormProps) {
  const [formData, setFormData] = useState<LoyaltySettingsData>(
    initialData || {
      points_per_currency: 1,
      minimum_points_redeem: 100,
      points_value_currency: 0.01,
      points_expiry_months: 12,
      enable_points_expiry: true,
      enable_birthday_bonus: true,
      birthday_bonus_points: 100,
      enable_welcome_points: true,
      welcome_points: 50,
      rounding_rule: "nearest",
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
      console.error("Error saving settings:", error);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>Loyalty Program Settings</DialogTitle>
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
          <Label htmlFor="points_per_currency">Points per Currency</Label>
          <div className="mt-1">
            <Input
              id="points_per_currency"
              type="number"
              min="0"
              step="0.01"
              value={formData.points_per_currency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  points_per_currency: parseFloat(e.target.value) || 0,
                })
              }
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              placeholder="Points earned per currency unit"
            />
            <p className="mt-1 text-sm text-neutral-400">
              Number of points earned for each currency unit spent
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="points_value_currency">
            Points Value in Currency
          </Label>
          <div className="mt-1">
            <Input
              id="points_value_currency"
              type="number"
              min="0"
              step="0.01"
              value={formData.points_value_currency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  points_value_currency: parseFloat(e.target.value) || 0,
                })
              }
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              placeholder="Value of each point in currency"
            />
            <p className="mt-1 text-sm text-neutral-400">
              Currency value of each point when redeemed
            </p>
          </div>
        </div>

        <div>
          <Label htmlFor="minimum_points_redeem">
            Minimum Points for Redemption
          </Label>
          <div className="mt-1">
            <Input
              id="minimum_points_redeem"
              type="number"
              min="0"
              value={formData.minimum_points_redeem}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  minimum_points_redeem: parseInt(e.target.value) || 0,
                })
              }
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              placeholder="Minimum points required for redemption"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="rounding_rule">Points Rounding Rule</Label>
          <Select
            value={formData.rounding_rule}
            onValueChange={(value: "up" | "down" | "nearest") =>
              setFormData({ ...formData, rounding_rule: value })
            }
          >
            <SelectTrigger className="bg-neutral-900 border-neutral-800 text-white">
              <SelectValue placeholder="Select rounding rule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Round Up</SelectItem>
              <SelectItem value="down">Round Down</SelectItem>
              <SelectItem value="nearest">Round to Nearest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 border-t border-neutral-800 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Points Expiry</Label>
              <p className="text-sm text-neutral-400">
                Points will expire after the specified period
              </p>
            </div>
            <Switch
              checked={formData.enable_points_expiry}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enable_points_expiry: checked })
              }
            />
          </div>

          {formData.enable_points_expiry && (
            <div>
              <Label htmlFor="points_expiry_months">
                Points Expiry Period (Months)
              </Label>
              <Input
                id="points_expiry_months"
                type="number"
                min="1"
                value={formData.points_expiry_months}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points_expiry_months: parseInt(e.target.value) || 12,
                  })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-neutral-800 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Birthday Bonus</Label>
              <p className="text-sm text-neutral-400">
                Award bonus points on member birthdays
              </p>
            </div>
            <Switch
              checked={formData.enable_birthday_bonus}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enable_birthday_bonus: checked })
              }
            />
          </div>

          {formData.enable_birthday_bonus && (
            <div>
              <Label htmlFor="birthday_bonus_points">
                Birthday Bonus Points
              </Label>
              <Input
                id="birthday_bonus_points"
                type="number"
                min="0"
                value={formData.birthday_bonus_points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    birthday_bonus_points: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-neutral-800 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Welcome Points</Label>
              <p className="text-sm text-neutral-400">
                Award points to new members upon sign up
              </p>
            </div>
            <Switch
              checked={formData.enable_welcome_points}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, enable_welcome_points: checked })
              }
            />
          </div>

          {formData.enable_welcome_points && (
            <div>
              <Label htmlFor="welcome_points">Welcome Points</Label>
              <Input
                id="welcome_points"
                type="number"
                min="0"
                value={formData.welcome_points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    welcome_points: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              />
            </div>
          )}
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
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
