"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  created_at: string;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("blog_categories")
          .select("*, posts(count)")
          .order("name");

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("blog_categories")
        .insert([formData]);
      if (error) throw error;

      // Reset form and refresh categories
      setFormData({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Blog Categories</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage categories for your blog posts
          </p>
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
        {/* Add Category Form */}
        <Card className="bg-neutral-950 border-neutral-800 p-6">
          <h2 className="text-lg font-medium text-white mb-4">
            Add New Category
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
                placeholder="Category name"
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
                placeholder="category-slug"
              />
            </div>
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
            <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </form>
        </Card>

        {/* Categories List */}
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      Description
                    </th>
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan={4} className="px-6 py-4">
                          <div className="animate-pulse flex space-x-4">
                            <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : categories.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-sm text-neutral-400"
                      >
                        No categories found
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="hover:bg-neutral-900">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-white">
                              {category.name}
                            </div>
                            <div className="text-sm text-neutral-400">
                              {category.slug}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-400">
                          {category.description || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-400">
                          {category.post_count || 0}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
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
        </div>
      </div>
    </div>
  );
}
