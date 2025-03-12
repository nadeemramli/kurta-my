"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@kurta-my/utils";

type TaxonomyType = "category" | "tag";

interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
}

interface FormData {
  name: string;
  slug: string;
  description: string;
}

export default function TaxonomiesPage() {
  const [type, setType] = useState<TaxonomyType>("category");
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
  });

  const fetchTaxonomies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const table = type === "category" ? "blog_categories" : "blog_tags";
      const { data, error } = await supabase
        .from(table)
        .select("*, posts(count)")
        .order("name");

      if (error) throw error;

      const taxonomiesWithCount = data?.map((item) => ({
        ...item,
        post_count: item.posts?.[0]?.count ?? 0,
      }));

      setTaxonomies(taxonomiesWithCount || []);
    } catch (error) {
      console.error("Error fetching taxonomies:", error);
      setError(`Failed to load ${type}s. Please try again later.`);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchTaxonomies();
  }, [fetchTaxonomies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const table = type === "category" ? "blog_categories" : "blog_tags";
      const { error } = await supabase.from(table).insert([formData]);
      if (error) throw error;

      // Reset form and refresh taxonomies
      setFormData({ name: "", slug: "", description: "" });
      fetchTaxonomies();
    } catch (error) {
      console.error("Error adding taxonomy:", error);
      setError(`Failed to add ${type}. Please try again.`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const table = type === "category" ? "blog_categories" : "blog_tags";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      fetchTaxonomies();
    } catch (error) {
      console.error("Error deleting taxonomy:", error);
      setError(`Failed to delete ${type}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Blog Taxonomies</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage categories and tags for your blog posts
          </p>
        </div>
      </div>

      {/* Type Selector */}
      <div className="border-b border-neutral-800">
        <div className="flex space-x-8">
          <button
            onClick={() => setType("category")}
            className={cn(
              "py-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              type === "category"
                ? "border-white text-white"
                : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-400"
            )}
          >
            Categories
          </button>
          <button
            onClick={() => setType("tag")}
            className={cn(
              "py-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              type === "tag"
                ? "border-white text-white"
                : "border-transparent text-neutral-400 hover:text-white hover:border-neutral-400"
            )}
          >
            Tags
          </button>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Form */}
        <Card className="p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Add New {type === "category" ? "Category" : "Tag"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-400 mb-2"
              >
                Name
              </label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                placeholder={`${type === "category" ? "Category" : "Tag"} name`}
              />
            </div>
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-neutral-400 mb-2"
              >
                Slug
              </label>
              <Input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
                placeholder="url-friendly-slug"
              />
            </div>
            {type === "category" && (
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-400 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-2 text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:ring-neutral-700"
                  placeholder="Category description"
                />
              </div>
            )}
            <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100">
              <Plus className="h-4 w-4 mr-2" />
              Add {type === "category" ? "Category" : "Tag"}
            </Button>
          </form>
        </Card>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-800">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    {type === "category" && (
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                      >
                        Description
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Posts
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <td
                          colSpan={type === "category" ? 5 : 4}
                          className="px-6 py-4"
                        >
                          <div className="animate-pulse flex space-x-4">
                            <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : taxonomies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={type === "category" ? 5 : 4}
                        className="px-6 py-4 text-center text-sm text-neutral-400"
                      >
                        No {type === "category" ? "categories" : "tags"} found
                      </td>
                    </tr>
                  ) : (
                    taxonomies.map((taxonomy) => (
                      <tr key={taxonomy.id} className="hover:bg-neutral-900">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-white">
                              {taxonomy.name}
                            </div>
                            <div className="text-sm text-neutral-400">
                              {taxonomy.slug}
                            </div>
                          </div>
                        </td>
                        {type === "category" && (
                          <td className="px-6 py-4 text-sm text-neutral-400">
                            {taxonomy.description || "—"}
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-neutral-400">
                          {taxonomy.post_count}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-400">
                          {new Date(taxonomy.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(taxonomy.id)}
                            className="text-red-400 hover:text-red-300"
                          >
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
        </div>
      </div>
    </div>
  );
}
