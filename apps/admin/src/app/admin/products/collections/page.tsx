"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  product_count: number;
  created_at: string;
  thumbnail_url?: string;
}

interface Product {
  id: string;
  title: string;
  media: { url: string }[];
  variants: { sku: string }[];
}

export default function ProductCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [collectionProducts, setCollectionProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newCollection, setNewCollection] = useState({
    title: "",
    slug: "",
    description: "",
  });

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setActionLoading(false);

      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          *,
          product_count:product_collections(count)
        `
        )
        .order("title");

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setActionLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          title,
          media,
          variants (sku)
        `
        )
        .order("title");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  };

  const fetchCollectionProducts = async (collectionId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_collections")
        .select("product_id")
        .eq("collection_id", collectionId);

      if (error) throw error;
      setCollectionProducts(data.map((item) => item.product_id));
    } catch (error) {
      console.error("Error fetching collection products:", error);
      toast.error("Failed to load collection products");
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionProducts(selectedCollection);
    }
  }, [selectedCollection]);

  const handleCreateCollection = async () => {
    try {
      if (!newCollection.title) {
        toast.error("Collection title is required");
        return;
      }

      const slug =
        newCollection.slug ||
        newCollection.title.toLowerCase().replace(/\s+/g, "-");

      const { error } = await supabase.from("collections").insert({
        title: newCollection.title,
        slug,
        description: newCollection.description,
      });

      if (error) throw error;

      toast.success("Collection created successfully");
      setIsDialogOpen(false);
      setNewCollection({ title: "", slug: "", description: "" });
      fetchCollections();
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
    }
  };

  const handleDeleteCollection = async () => {
    if (!selectedCollection) return;

    try {
      setActionLoading(true);
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", selectedCollection);

      if (error) throw error;

      toast.success("Collection deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedCollection(null);
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductToggle = async (productId: string) => {
    try {
      if (!selectedCollection) return;

      setActionLoading(true);
      const isSelected = collectionProducts.includes(productId);

      if (isSelected) {
        const { error } = await supabase
          .from("product_collections")
          .delete()
          .eq("collection_id", selectedCollection)
          .eq("product_id", productId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("product_collections").insert({
          collection_id: selectedCollection,
          product_id: productId,
        });

        if (error) throw error;
      }

      await fetchCollectionProducts(selectedCollection);
      await fetchCollections();
    } catch (error) {
      console.error("Error toggling product:", error);
      toast.error("Failed to update collection products");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Product Collections</h1>
          <p className="text-neutral-400">Manage your product collections</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collections List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-neutral-900 rounded-lg p-4">
            {collections.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-400">No collections yet</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Create a collection to start organizing your products
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {collections.map((collection) => (
                  <Card
                    key={collection.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCollection === collection.id
                        ? "bg-neutral-800"
                        : "hover:bg-neutral-800/50"
                    }`}
                    onClick={() => setSelectedCollection(collection.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{collection.title}</h3>
                        <p className="text-sm text-neutral-400">
                          {collection.product_count} products
                        </p>
                      </div>
                      {selectedCollection === collection.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products List */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            {selectedCollection ? (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative aspect-square w-24 overflow-hidden rounded-lg">
                            <Image
                              src={
                                product.media?.[0]?.url || "/placeholder.png"
                              }
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 96px) 100vw, 96px"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-neutral-400">
                              {product.variants?.[0]?.sku || "No SKU"}
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={collectionProducts.includes(product.id)}
                          onCheckedChange={() =>
                            handleProductToggle(product.id)
                          }
                          disabled={actionLoading}
                        />
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-neutral-400">Select a collection</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Choose a collection to manage its products
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Add a new collection to organize your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newCollection.title}
                onChange={(e) =>
                  setNewCollection({ ...newCollection, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input
                id="slug"
                value={newCollection.slug}
                onChange={(e) =>
                  setNewCollection({ ...newCollection, slug: e.target.value })
                }
                placeholder="auto-generated-from-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={newCollection.description}
                onChange={(e) =>
                  setNewCollection({
                    ...newCollection,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection}>Create Collection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCollection}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Collection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
