"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tag {
  id: string;
  name: string;
  slug: string;
  post_count: number;
  created_at: string;
}

export default function BlogTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("blog_tags")
          .select("*, posts(count)")
          .order("name");

        if (error) throw error;
        setTags(data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError("Failed to load tags. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-white">Blog Tags</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage tags for your blog posts
          </p>
        </div>
        <Button className="bg-white text-neutral-900 hover:bg-neutral-100">
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
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
                  Slug
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
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : tags.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-neutral-400"
                  >
                    No tags found
                  </td>
                </tr>
              ) : (
                tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-neutral-900">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {tag.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {tag.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {tag.post_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                      {new Date(tag.created_at).toLocaleDateString()}
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
    </div>
  );
}
