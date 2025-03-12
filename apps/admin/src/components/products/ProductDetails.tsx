import { useState } from "react";
import { type Product, type ProductStatus } from "@/lib/types/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: ProductStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      toast({
        title: "Status updated",
        description: `Product status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });

      // Redirect to products list
      window.location.href = "/admin/products";
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {product.handle}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant={
                product.status === "active"
                  ? "default"
                  : product.status === "draft"
                  ? "secondary"
                  : "destructive"
              }
            >
              {product.status}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  handleStatusChange(
                    product.status === "active" ? "draft" : "active"
                  )
                }
                disabled={loading}
              >
                {product.status === "active" ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Product Content */}
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                  {product.description || "No description provided"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Vendor</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.vendor || "No vendor specified"}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Type</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.type || "No type specified"}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between py-4 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {Object.entries(variant.options)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" / ") || "Default Variant"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      SKU: {variant.sku}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(variant.price)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {variant.inventory_quantity} in stock
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.media.map((item) => (
                <div key={item.id} className="aspect-square relative">
                  <img
                    src={item.url}
                    alt={item.alt || ""}
                    className="object-cover w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              {product.collections?.length ? (
                product.collections.map((collection) => (
                  <div
                    key={collection.id}
                    className="flex items-center justify-between py-4 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{collection.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {collection.description || "No description"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  This product is not in any collections
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">SEO Title</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.seo.title || product.title}
                </p>
              </div>
              <div>
                <h3 className="font-medium">SEO Description</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.seo.description || "No SEO description provided"}
                </p>
              </div>
              {product.seo.keywords && product.seo.keywords.length > 0 && (
                <div>
                  <h3 className="font-medium">Keywords</h3>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.seo.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
