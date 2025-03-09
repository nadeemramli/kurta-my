"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Users, Star, Trophy, Settings } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface LoyaltyTier {
  id: string;
  name: string;
  minimum_points: number;
  benefits: string[];
  member_count: number;
}

interface LoyaltyStats {
  total_members: number;
  total_points_issued: number;
  total_points_redeemed: number;
  average_points_per_member: number;
}

export default function LoyaltyProgramPage() {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [stats, setStats] = useState<LoyaltyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch loyalty tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from("loyalty_tiers")
        .select("*, members:loyalty_members(count)")
        .order("minimum_points", { ascending: true });

      if (tiersError) throw tiersError;

      // Fetch loyalty statistics
      const { data: statsData, error: statsError } = await supabase
        .from("loyalty_stats")
        .select("*")
        .single();

      if (statsError) throw statsError;

      setTiers(tiersData || []);
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching loyalty data:", error);
      setError("Failed to load loyalty program data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-MY").format(num);
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
              <h1 className="text-xl font-medium text-white">
                Loyalty Program
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                Manage your loyalty program tiers and rewards
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-neutral-800 hover:bg-neutral-900"
          >
            <Settings className="mr-2 h-4 w-4" />
            Program Settings
          </Button>
          <Button className="bg-white text-neutral-900 hover:bg-neutral-100">
            <Plus className="mr-2 h-4 w-4" />
            New Tier
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {!loading && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Total Members
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.total_members)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Star className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Points Issued
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.total_points_issued)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Points Redeemed
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.total_points_redeemed)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Avg. Points/Member
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.average_points_per_member)}
                </h3>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tiers Table */}
      <Card>
        <div className="rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Tier Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Required Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Benefits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Members
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
                      <td colSpan={5} className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : tiers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-neutral-400"
                    >
                      No tiers found
                    </td>
                  </tr>
                ) : (
                  tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-neutral-900">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">
                          {tier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatNumber(tier.minimum_points)} points
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400">
                        <ul className="list-disc list-inside">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                        {formatNumber(tier.member_count)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          Edit
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          Delete
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
    </div>
  );
}
