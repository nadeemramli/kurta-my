"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ProductFormData,
  ProductMedia,
  ProductVariant,
} from "@/lib/types/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface ProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  onSuccess?: () => void;
}

export function ProductSheet({
  open,
  onOpenChange,
  productId,
  onSuccess,
}: ProductSheetProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    status: "draft",
    media: [],
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    requires_shipping: true,
    options: [],
    variants: [
      {
        title: "Default Variant",
        price: 0,
        inventory_quantity: 0,
      },
    ],
  });

  const handleMediaUpload = async (files: FileList) => {
    const newMedia: ProductMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { data, error } = await supabase.storage
          .from("product-media")
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        if (data) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("product-media").getPublicUrl(data.path);

          newMedia.push({
            id: data.path,
            url: publicUrl,
            type: file.type.startsWith("image/")
              ? "image"
              : file.type.startsWith("video/")
              ? "video"
              : "3d",
            position: formData.media.length + i,
          });
        }
      } catch (error) {
        console.error("Error uploading media:", error);
        toast.error("Failed to upload media");
      }
    }

    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...newMedia],
    }));
  };

  const handleVariantChange = (
    index: number,
    changes: Partial<ProductVariant>
  ) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, ...changes } : variant
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Generate SKU if not provided
      if (!formData.variants[0].sku && formData.title) {
        const { data: sku } = await supabase.rpc("generate_sku", {
          product_name: formData.title,
        });
        formData.variants[0].sku = sku;
      }

      if (!productId) {
        // Create new product
        const { data: product, error: productError } = await supabase
          .from("products")
          .insert([
            {
              title: formData.title,
              description: formData.description,
              status: formData.status,
              media: formData.media,
              weight: formData.weight,
              weight_unit: formData.weight_unit,
              vendor: formData.vendor,
              type: formData.type,
              tags: formData.tags,
              barcode: formData.barcode,
              customs_info: formData.customs_info,
              seo_title: formData.seo_title,
              seo_description: formData.seo_description,
              track_quantity: formData.track_quantity,
              continue_selling_when_out_of_stock:
                formData.continue_selling_when_out_of_stock,
              requires_shipping: formData.requires_shipping,
              published_at:
                formData.status === "active" ? new Date().toISOString() : null,
            },
          ])
          .select()
          .single();

        if (productError) throw productError;

        // Create variants
        if (product) {
          const { error: variantError } = await supabase
            .from("product_variants")
            .insert(
              formData.variants.map((variant) => ({
                ...variant,
                product_id: product.id,
              }))
            );

          if (variantError) throw variantError;
        }
      } else {
        // Update existing product
        const { error: productError } = await supabase
          .from("products")
          .update({
            title: formData.title,
            description: formData.description,
            status: formData.status,
            media: formData.media,
            weight: formData.weight,
            weight_unit: formData.weight_unit,
            vendor: formData.vendor,
            type: formData.type,
            tags: formData.tags,
            barcode: formData.barcode,
            customs_info: formData.customs_info,
            seo_title: formData.seo_title,
            seo_description: formData.seo_description,
            track_quantity: formData.track_quantity,
            continue_selling_when_out_of_stock:
              formData.continue_selling_when_out_of_stock,
            requires_shipping: formData.requires_shipping,
            updated_at: new Date().toISOString(),
          })
          .eq("id", productId);

        if (productError) throw productError;

        // Update variants
        for (const variant of formData.variants) {
          if (variant.id) {
            const { error: variantError } = await supabase
              .from("product_variants")
              .update(variant)
              .eq("id", variant.id);

            if (variantError) throw variantError;
          } else {
            const { error: variantError } = await supabase
              .from("product_variants")
              .insert({
                ...variant,
                product_id: productId,
              });

            if (variantError) throw variantError;
          }
        }
      }

      toast.success(productId ? "Product updated" : "Product created");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving product:", error);
      setError("Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{productId ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {productId
              ? "Update product information and settings"
              : "Create a new product"}
          </SheetDescription>
        </SheetHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-400">Error</h3>
                <div className="mt-2 text-sm text-red-400">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Product Type</Label>
                      <Input
                        id="type"
                        value={formData.type || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, vendor: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tags: e.target.value
                            .split(",")
                            .map((tag) => tag.trim()),
                        })
                      }
                      placeholder="Separate tags with commas"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>Product Media</Label>
                    <div className="mt-2 grid grid-cols-4 gap-4">
                      {formData.media.map((item, index) => (
                        <div
                          key={item.id}
                          className="relative aspect-square rounded-lg border border-neutral-200 overflow-hidden"
                        >
                          {item.type === "image" && (
                            <img
                              src={item.url}
                              alt={item.alt || "Product image"}
                              className="object-cover w-full h-full"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                media: formData.media.filter(
                                  (_, i) => i !== index
                                ),
                              })
                            }
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <label className="relative aspect-square rounded-lg border-2 border-dashed border-neutral-200 hover:border-neutral-300 cursor-pointer">
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*,video/*"
                          onChange={(e) =>
                            e.target.files && handleMediaUpload(e.target.files)
                          }
                        />
                        <div className="flex flex-col items-center justify-center h-full">
                          <Plus className="h-6 w-6 text-neutral-400" />
                          <span className="mt-2 text-sm text-neutral-500">
                            Add media
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="variants">
              <Card className="p-6">
                <div className="space-y-6">
                  {formData.variants.map((variant, index) => (
                    <div key={index} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                price: parseFloat(e.target.value),
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label>Compare at Price</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.compare_at_price || ""}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                compare_at_price: e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Cost per Item</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={variant.cost_price || ""}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                cost_price: e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="0"
                            value={variant.inventory_quantity}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                inventory_quantity: parseInt(e.target.value),
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SKU</Label>
                          <Input
                            value={variant.sku || ""}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                sku: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Barcode</Label>
                          <Input
                            value={variant.barcode || ""}
                            onChange={(e) =>
                              handleVariantChange(index, {
                                barcode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="shipping">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>This is a physical product</Label>
                      <p className="text-sm text-neutral-500">
                        Products that need to be shipped
                      </p>
                    </div>
                    <Switch
                      checked={formData.requires_shipping}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, requires_shipping: checked })
                      }
                    />
                  </div>

                  {formData.requires_shipping && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Weight</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.weight || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Weight Unit</Label>
                          <Select
                            value={formData.weight_unit || "kg"}
                            onValueChange={(value) =>
                              setFormData({ ...formData, weight_unit: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="g">g</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>Customs Information</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <Input
                            placeholder="Country of origin"
                            value={
                              formData.customs_info?.country_of_origin || ""
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customs_info: {
                                  ...formData.customs_info,
                                  country_of_origin: e.target.value,
                                },
                              })
                            }
                          />
                          <Input
                            placeholder="HS Code"
                            value={formData.customs_info?.hs_code || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                customs_info: {
                                  ...formData.customs_info,
                                  hs_code: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="seo">
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label>SEO Title</Label>
                    <Input
                      value={formData.seo_title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, seo_title: e.target.value })
                      }
                      placeholder="Enter SEO title"
                    />
                  </div>

                  <div>
                    <Label>SEO Description</Label>
                    <Textarea
                      value={formData.seo_description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo_description: e.target.value,
                        })
                      }
                      placeholder="Enter SEO description"
                      rows={4}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
