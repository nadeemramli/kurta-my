"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function NewBlogPostPage() {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Content:", content);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog/posts"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New Blog Post
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and publish a new blog post
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter post title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter post excerpt"
              />
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-900">
              Status & Visibility
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="visibility"
                  className="mb-2 block text-sm text-gray-700"
                >
                  Visibility
                </label>
                <select
                  id="visibility"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories & Tags */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-900">
              Categories & Tags
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="fashion">Fashion</option>
                  <option value="trends">Trends</option>
                  <option value="culture">Culture</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="mb-2 block text-sm text-gray-700"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add tags separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-medium text-gray-900">
              Featured Image
            </h3>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
              <div className="text-center">
                <div className="mt-2 text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer font-medium text-blue-600 hover:text-blue-500"
                  >
                    Upload a file
                  </label>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
