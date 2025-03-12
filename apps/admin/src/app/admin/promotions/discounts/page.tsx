"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Tag, Gift, Users, ArrowLeft, Heart, Share2 } from "lucide-react";
import { cn } from "@kurta-my/utils";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

type DiscountTypeId = "coupon" | "campaign" | "loyalty" | "referral";

interface DiscountType {
  id: DiscountTypeId;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const discountTypes: DiscountType[] = [
  {
    id: "coupon",
    name: "Coupons",
    description: "Create and manage discount coupons",
    icon: Gift,
    href: "/admin/promotions/coupons",
  },
  {
    id: "campaign",
    name: "Campaigns",
    description: "Run time-limited promotional campaigns",
    icon: Users,
    href: "/admin/promotions/campaigns",
  },
  {
    id: "loyalty",
    name: "Loyalty Program",
    description: "Reward your loyal customers",
    icon: Heart,
    href: "/admin/promotions/loyalty",
  },
  {
    id: "referral",
    name: "Referral Program",
    description: "Encourage customers to refer friends",
    icon: Share2,
    href: "/admin/promotions/referrals",
  },
];

export default function DiscountsPage() {
  const [selectedType, setSelectedType] = useState<DiscountTypeId>("coupon");

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
              <h1 className="text-xl font-medium text-white">Discounts</h1>
              <p className="mt-1 text-sm text-neutral-400">
                Manage different types of discounts and rewards
              </p>
            </div>
          </div>
        </div>
        <Button className="bg-white text-neutral-900 hover:bg-neutral-100">
          <Plus className="mr-2 h-4 w-4" />
          New{" "}
          {selectedType === "coupon"
            ? "Coupon"
            : selectedType === "campaign"
            ? "Campaign"
            : selectedType === "loyalty"
            ? "Program"
            : "Referral"}
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {discountTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors",
                selectedType === type.id
                  ? "border-white bg-white/5 text-white"
                  : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              )}
            >
              <type.icon
                className={cn(
                  "h-6 w-6 mb-2",
                  selectedType === type.id ? "text-white" : "text-neutral-400"
                )}
              />
              <h3
                className={cn(
                  "text-sm font-medium",
                  selectedType === type.id ? "text-white" : "text-neutral-400"
                )}
              >
                {type.name}
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                {type.description}
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Content based on active tab */}
      <Card className="p-6">
        {selectedType === "coupon" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">Coupon Settings</h2>
            <p className="text-sm text-neutral-400">
              Create discount coupons with percentage or fixed amount off
            </p>
            {/* Coupon form and list will go here */}
          </div>
        )}

        {selectedType === "campaign" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">
              Campaign Settings
            </h2>
            <p className="text-sm text-neutral-400">
              Set up promotional campaigns like Buy 1 Free 1, bundle deals, or
              flash sales
            </p>
            {/* Campaign form and list will go here */}
          </div>
        )}

        {selectedType === "loyalty" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">
              Loyalty Program Settings
            </h2>
            <p className="text-sm text-neutral-400">
              Configure points system, rewards, and tiers for your loyalty
              program
            </p>
            {/* Loyalty program settings will go here */}
          </div>
        )}

        {selectedType === "referral" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">
              Referral Program Settings
            </h2>
            <p className="text-sm text-neutral-400">
              Set up referral rewards for both referrers and new customers
            </p>
            {/* Referral program settings will go here */}
          </div>
        )}
      </Card>
    </div>
  );
}
