import { Plus, X } from "lucide-react";

// Mock data for initial UI development
const mockTags = [
  {
    id: 1,
    name: "Traditional",
    slug: "traditional",
    postCount: 8,
  },
  {
    id: 2,
    name: "Modern",
    slug: "modern",
    postCount: 12,
  },
  {
    id: 3,
    name: "Casual",
    slug: "casual",
    postCount: 5,
  },
  {
    id: 4,
    name: "Formal",
    slug: "formal",
    postCount: 7,
  },
  {
    id: 5,
    name: "Wedding",
    slug: "wedding",
    postCount: 4,
  },
];

export default function BlogTagsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your blog tags</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Add Tag Form */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-medium text-gray-900">
              Add New Tag
            </h2>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tag name"
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="tag-slug"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 -ml-1 inline-block h-4 w-4" />
                Add Tag
              </button>
            </form>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{tag.name}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      <span className="text-gray-400">{tag.slug}</span>
                      <span className="mx-2">•</span>
                      <span>{tag.postCount} posts</span>
                    </div>
                  </div>
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
