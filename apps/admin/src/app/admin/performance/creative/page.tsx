"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Palette } from "lucide-react";
import { cn } from "@kurta-my/utils";

type CreativeTab = "influencers" | "costs";

interface Influencer {
  id: string;
  name: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  cost_per_post: number;
  status: "active" | "pending" | "inactive";
  notes?: string;
}

interface CreativeCost {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  created_at: string;
}

export default function CreativePage() {
  const [activeTab, setActiveTab] = useState<CreativeTab>("influencers");

  const tabs = [
    {
      id: "influencers",
      name: "Influencers",
      icon: Users,
      description: "Manage influencer relationships and campaigns",
    },
    {
      id: "costs",
      name: "Creative Costs",
      icon: Palette,
      description: "Track creative and production expenses",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Creative</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage influencers and creative costs
          </p>
        </div>
        <Button className="bg-white text-neutral-900 hover:bg-neutral-100">
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === "influencers" ? "Add Influencer" : "Add Cost"}
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CreativeTab)}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-colors",
                activeTab === tab.id
                  ? "border-white bg-white/5 text-white"
                  : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              )}
            >
              <tab.icon
                className={cn(
                  "h-6 w-6 mb-2",
                  activeTab === tab.id ? "text-white" : "text-neutral-400"
                )}
              />
              <h3
                className={cn(
                  "text-sm font-medium",
                  activeTab === tab.id ? "text-white" : "text-neutral-400"
                )}
              >
                {tab.name}
              </h3>
              <p className="mt-1 text-xs text-neutral-400">{tab.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Content based on active tab */}
      <Card className="p-6">
        {activeTab === "influencers" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">
              Influencer Management
            </h2>
            <p className="text-sm text-neutral-400">
              Build and manage your influencer network
            </p>
            {/* Influencer list and management UI will go here */}
            <div className="rounded-lg border border-neutral-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Influencer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Followers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Engagement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Cost/Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-4 text-center text-sm text-neutral-400"
                      >
                        No influencers found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "costs" && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-white">Creative Costs</h2>
            <p className="text-sm text-neutral-400">
              Track expenses for content creation and production
            </p>
            {/* Creative costs list and management UI will go here */}
            <div className="rounded-lg border border-neutral-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-neutral-400"
                      >
                        No creative costs found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
