"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Settings,
  Users,
  DollarSign,
  Share2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ReferralStats {
  total_referrals: number;
  successful_conversions: number;
  total_rewards_given: number;
  conversion_rate: number;
}

interface ReferralHistory {
  id: string;
  referrer_name: string;
  referrer_email: string;
  referred_name: string;
  referred_email: string;
  status: "pending" | "converted" | "expired";
  reward_status: "pending" | "paid" | "failed";
  reward_amount: number;
  created_at: string;
}

export default function ReferralProgramPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [history, setHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch referral statistics
      const { data: statsData, error: statsError } = await supabase
        .from("referral_stats")
        .select("*")
        .single();

      if (statsError) throw statsError;

      // Fetch referral history
      const { data: historyData, error: historyError } = await supabase
        .from("referral_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (historyError) throw historyError;

      setStats(statsData);
      setHistory(historyData || []);
    } catch (error) {
      console.error("Error fetching referral data:", error);
      setError("Failed to load referral program data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-MY").format(num);
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
              <h1 className="text-xl font-medium text-white">
                Referral Program
              </h1>
              <p className="mt-1 text-sm text-neutral-400">
                Manage your customer referral program
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="border-neutral-800 hover:bg-neutral-900"
        >
          <Settings className="mr-2 h-4 w-4" />
          Program Settings
        </Button>
      </div>

      {/* Statistics */}
      {!loading && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Share2 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Total Referrals
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.total_referrals)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Successful Conversions
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatNumber(stats.successful_conversions)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Total Rewards Given
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {formatCurrency(stats.total_rewards_given)}
                </h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-400">
                  Conversion Rate
                </p>
                <h3 className="text-2xl font-semibold text-white">
                  {(stats.conversion_rate * 100).toFixed(1)}%
                </h3>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Referrals */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Recent Referrals
          </h2>
          <div className="rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Referred
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Reward
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Date
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
                  ) : history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-neutral-400"
                      >
                        No referrals found
                      </td>
                    </tr>
                  ) : (
                    history.map((referral) => (
                      <tr key={referral.id} className="hover:bg-neutral-900">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">
                            {referral.referrer_name}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {referral.referrer_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-white">
                            {referral.referred_name}
                          </div>
                          <div className="text-sm text-neutral-400">
                            {referral.referred_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              referral.status === "converted"
                                ? "text-success bg-success-light"
                                : referral.status === "pending"
                                ? "text-warning bg-warning-light"
                                : "text-error bg-error-light"
                            }`}
                          >
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-400">
                            {formatCurrency(referral.reward_amount)}
                          </div>
                          <div
                            className={`text-xs ${
                              referral.reward_status === "paid"
                                ? "text-success"
                                : referral.reward_status === "pending"
                                ? "text-warning"
                                : "text-error"
                            }`}
                          >
                            {referral.reward_status}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
