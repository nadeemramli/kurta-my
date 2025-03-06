import Link from "next/link";
import { Plus, Search } from "lucide-react";

// Mock data for initial UI development
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with Kurta Fashion",
    excerpt: "Learn about the history and styles of traditional kurta wear...",
    status: "Published",
    author: "Admin User",
    category: "Fashion",
    publishedAt: "2024-03-05",
  },
  {
    id: 2,
    title: "Top 10 Kurta Trends for 2024",
    excerpt: "Discover the latest trends in kurta fashion for the upcoming...",
    status: "Draft",
    author: "Content Writer",
    category: "Trends",
    publishedAt: null,
  },
  // Add more mock posts as needed
];

export default function BlogPostsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your blog posts and content
          </p>
        </div>
        <Link
          href="/admin/blog/posts/new"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="all">All Categories</option>
            <option value="fashion">Fashion</option>
            <option value="trends">Trends</option>
            <option value="culture">Culture</option>
          </select>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-500">{post.excerpt}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.category}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      post.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.publishedAt || "—"}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/admin/blog/posts/${post.id}`}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to {mockPosts.length} of {mockPosts.length} results
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
