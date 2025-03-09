"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SegmentBuilder } from "@/components/customers/segment-builder";

interface CustomerGroup {
  id: string;
  name: string;
  description: string | null;
  customer_count: number;
  created_at: string;
  rules: Array<{
    field: string;
    operator: string;
    value: string | number | string[];
  }>;
}

interface Rule {
  field: string;
  operator: string;
  value: string | number | string[];
}

export default function CustomerGroupsPage() {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customer_groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError("Failed to load customer groups");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (rules: Rule[]) => {
    try {
      const { data, error } = await supabase.from("customer_groups").insert([
        {
          name: newGroup.name,
          description: newGroup.description,
          rules,
        },
      ]);

      if (error) throw error;

      setIsDialogOpen(false);
      setNewGroup({ name: "", description: "" });
      fetchGroups();
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Failed to create customer group");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Customer Groups</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Create and manage customer segments
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-white text-neutral-900 hover:bg-neutral-100"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
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

      <div className="grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-1/4 rounded bg-neutral-800" />
                <div className="h-4 w-1/2 rounded bg-neutral-800" />
              </div>
            </Card>
          ))
        ) : groups.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-neutral-400" />
              <h3 className="mt-2 text-sm font-medium text-white">
                No customer groups
              </h3>
              <p className="mt-1 text-sm text-neutral-400">
                Get started by creating a new customer group
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-white text-neutral-900 hover:bg-neutral-100"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Group
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          groups.map((group) => (
            <Card key={group.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="mt-1 text-sm text-neutral-400">
                      {group.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-neutral-400">
                    {group.customer_count} customers
                  </p>
                </div>
                <Button variant="outline">View Customers</Button>
              </div>
              {group.rules && (
                <div className="mt-4 rounded-lg bg-neutral-900 p-4">
                  <h4 className="text-sm font-medium text-white">
                    Segment Rules
                  </h4>
                  <pre className="mt-2 text-sm text-neutral-400 whitespace-pre-wrap">
                    {JSON.stringify(group.rules, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create Customer Group</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  className="mt-1.5"
                  placeholder="e.g., High Value Customers"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className="mt-1.5"
                  placeholder="Describe this customer group"
                />
              </div>
            </div>

            <div>
              <Label>Segment Rules</Label>
              <div className="mt-1.5">
                <SegmentBuilder onSave={handleSubmit} />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
