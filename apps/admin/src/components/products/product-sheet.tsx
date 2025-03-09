"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  ProductFormData,
  ProductMedia,
  VariantOption,
  VariantAttributeType,
  VARIANT_ATTRIBUTE_TYPES,
  ProductCollection,
  VariantBracket,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { VariantOptionDialog } from "./variant-option-dialog";
import { VariantBracketDialog } from "./variant-bracket-dialog";
import { HelpCircle, AlertCircle } from "lucide-react";
import { MediaEditDialog } from "./media-edit-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollectionDialog } from "./collection-dialog";

interface ProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId?: string;
  onSuccess?: () => void;
}

interface ValidationErrors {
  title?: string;
  description?: string;
  weight?: string;
  price?: string;
  cost_per_item?: string;
  variant_brackets?: string;
}

const formatNumberInput = (value: string): string => {
  // Remove any non-digit characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, "");
  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  // Limit to 2 decimal places
  if (parts[1]) parts[1] = parts[1].slice(0, 2);
  // Join back with decimal point
  const formatted = parts.join(".");
  // Remove leading zeros unless it's "0." or "0.0"
  return formatted.replace(/^0+(?=\d)/, "");
};

export const TooltipWithLink = ({
  text,
  link,
}: {
  text: string;
  link?: string;
}) => (
  <div className="group relative">
    <HelpCircle className="h-4 w-4 text-neutral-500" />
    <div className="pointer-events-auto absolute -top-2 left-full p-4 w-80 rounded-md bg-neutral-800 text-xs opacity-0 transition-opacity group-hover:opacity-100 z-50">
      <p className="text-neutral-200 whitespace-pre-line">{text}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-blue-400 hover:underline"
        >
          Learn more →
        </a>
      )}
    </div>
  </div>
);

interface CollectionComboboxProps {
  collections: ProductCollection[];
  selectedCollections: ProductCollection[];
  onSelect: (collection: ProductCollection) => void;
  onCreateNew: () => void;
}

function CollectionCombobox({
  collections,
  selectedCollections,
  onSelect,
  onCreateNew,
}: CollectionComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCollections.length > 0
            ? `${selectedCollections.length} collection${
                selectedCollections.length === 1 ? "" : "s"
              } selected`
            : "Select collections..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search collections..." />
          <CommandList>
            <CommandEmpty>No collections found.</CommandEmpty>
            <CommandGroup>
              {collections.map((collection) => (
                <CommandItem
                  key={collection.id}
                  onSelect={() => onSelect(collection)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4",
                      selectedCollections.some((c) => c.id === collection.id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {collection.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={onCreateNew}
                className="flex items-center gap-2 text-neutral-400 hover:text-neutral-50"
              >
                <Plus className="h-4 w-4" />
                Create new collection
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ProductSheet({
  open,
  onOpenChange,
  productId,
  onSuccess,
}: ProductSheetProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    status: "draft",
    media: [],
    price: 0,
    compare_at_price: undefined,
    cost_per_item: undefined,
    charge_tax: true,
    track_quantity: true,
    continue_selling_when_out_of_stock: false,
    requires_shipping: true,
    variant_brackets: [],
    collections: [],
  });
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [showVariantDialog, setShowVariantDialog] = useState(false);
  const [showBracketDialog, setShowBracketDialog] = useState(false);
  const [selectedBracketId, setSelectedBracketId] = useState<string | null>(
    null
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<ProductMedia | null>(null);
  const [newCollection, setNewCollection] = useState({
    title: "",
    slug: "",
    description: "",
  });
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);

  const handleMediaUpload = async (files: FileList) => {
    const newMedia: ProductMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { data, error } = await supabase.storage
          .from("products")
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        if (data) {
          const { data: publicUrl } = supabase.storage
            .from("products")
            .getPublicUrl(data.path);

          newMedia.push({
            id: data.path,
            url: publicUrl.publicUrl,
            type: file.type.startsWith("image/") ? "image" : "video",
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Basic required fields
    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Product description is required";
    }

    // Physical product validation
    if (formData.requires_shipping && !formData.weight) {
      newErrors.weight = "Weight is required for physical products";
    }

    // Pricing validation
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid sale price is required";
    }

    if (!formData.cost_per_item || formData.cost_per_item <= 0) {
      newErrors.cost_per_item = "Valid cost per item is required";
    }

    // Variant validation
    if (formData.variant_brackets && formData.variant_brackets.length > 0) {
      const invalidBrackets = formData.variant_brackets.some(
        (bracket) =>
          !bracket.name ||
          bracket.options.length === 0 ||
          bracket.options.some(
            (option) => !option.name || option.values.length === 0
          )
      );
      if (invalidBrackets) {
        newErrors.variant_brackets =
          "All variant brackets must have a name and at least one option with values";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("title");

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
    }
  };

  const fetchProductCollections = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("product_collections")
        .select("collection_id")
        .eq("product_id", productId);

      if (error) throw error;
      const collectionIds = data.map((item) => item.collection_id);
      setFormData((prev) => ({
        ...prev,
        collections: collections.filter((c) => collectionIds.includes(c.id)),
      }));
    } catch (error) {
      console.error("Error fetching product collections:", error);
      toast.error("Failed to load product collections");
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProductCollections(productId);
    }
  }, [productId, collections]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      // Create or update product
      const productData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        price: formData.price,
        compare_at_price: formData.compare_at_price,
        cost_per_item: formData.cost_per_item,
        charge_tax: formData.charge_tax,
        weight: formData.weight,
        weight_unit: formData.weight_unit,
        vendor: formData.vendor,
        type: formData.type,
        sku: formData.sku,
        barcode: formData.barcode,
        customs_info: formData.customs_info,
        seo_title: formData.seo_title,
        seo_description: formData.seo_description,
        track_quantity: formData.track_quantity,
        continue_selling_when_out_of_stock:
          formData.continue_selling_when_out_of_stock,
        requires_shipping: formData.requires_shipping,
      };

      let savedProductId = productId;

      if (savedProductId) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", savedProductId);

        if (updateError) throw updateError;
      } else {
        // Create new product
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (insertError) throw insertError;
        savedProductId = newProduct.id;
      }

      // Update product collections
      if (savedProductId) {
        // First, delete all existing product collections
        const { error: deleteError } = await supabase
          .from("product_collections")
          .delete()
          .eq("product_id", savedProductId);

        if (deleteError) throw deleteError;

        // Then, insert new product collections
        if (formData.collections.length > 0) {
          const { error: insertError } = await supabase
            .from("product_collections")
            .insert(
              formData.collections.map((collection) => ({
                product_id: savedProductId,
                collection_id: collection.id,
              }))
            );

          if (insertError) throw insertError;
        }
      }

      toast.success(
        `Product ${savedProductId ? "updated" : "created"} successfully`
      );
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCollection = async () => {
    try {
      if (!newCollection.title) {
        toast.error("Collection title is required");
        return;
      }

      const slug =
        newCollection.slug ||
        newCollection.title.toLowerCase().replace(/\s+/g, "-");

      const { data, error } = await supabase
        .from("collections")
        .insert({
          title: newCollection.title,
          slug,
          description: newCollection.description,
        })
        .select()
        .single();

      if (error) throw error;

      setCollections((prev) => [...prev, data]);
      setFormData((prev) => ({
        ...prev,
        collections: [...prev.collections, data],
      }));
      setNewCollection({ title: "", slug: "", description: "" });
      setShowNewCollectionForm(false);
      toast.success("Collection created successfully");
    } catch (error) {
      console.error("Error creating collection:", error);
      toast.error("Failed to create collection");
    }
  };

  const handleCollectionSelect = (collection: ProductCollection) => {
    setFormData((prev) => {
      const exists = prev.collections.some((c) => c.id === collection.id);
      return {
        ...prev,
        collections: exists
          ? prev.collections.filter((c) => c.id !== collection.id)
          : [...prev.collections, collection],
      };
    });
  };

  const handleCollectionCreated = (collection: ProductCollection) => {
    setCollections((prev) => [...prev, collection]);
    setFormData((prev) => ({
      ...prev,
      collections: [...prev.collections, collection],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{productId ? "Edit Product" : "New Product"}</SheetTitle>
          <SheetDescription>
            {productId
              ? "Update your product details"
              : "Add a new product to your store"}
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  Product Title
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={errors.title ? "border-red-500" : ""}
                  required
                />
                {errors.title && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-2"
                  >
                    Description
                    <span className="text-red-500">*</span>
                  </Label>
                  <TooltipWithLink
                    text={`You might consider including the following information in your product descriptions:

• Product specifications such as size, material, weight
• Suggested uses for the product
• Benefits of the product, including evidence
• Engaging details, such as stories about the product`}
                    link="https://help.shopify.com/en/manual/products/details/product-descriptions/write"
                  />
                </div>
                <RichTextEditor
                  value={formData.description || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
                {errors.description && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="track_quantity">Track quantity</Label>
                    <p className="text-sm text-neutral-500">
                      Keep track of your inventory
                    </p>
                  </div>
                  <Switch
                    id="track_quantity"
                    checked={formData.track_quantity}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, track_quantity: checked })
                    }
                  />
                </div>

                {formData.track_quantity && (
                  <div className="space-y-4 pl-6 border-l border-neutral-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="continue_selling">
                          Continue selling when out of stock
                        </Label>
                        <p className="text-sm text-neutral-500">
                          Allow customers to purchase this product when it's out
                          of stock
                        </p>
                      </div>
                      <Switch
                        id="continue_selling"
                        checked={formData.continue_selling_when_out_of_stock}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            continue_selling_when_out_of_stock: checked,
                          })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                          <TooltipWithLink
                            text="A SKU (Stock Keeping Unit) is a unique identifier for each product and variant in your store. SKUs help you track inventory and fulfill orders accurately."
                            link="https://help.shopify.com/en/manual/products/details/sku"
                          />
                        </div>
                        <Input
                          id="sku"
                          value={formData.sku || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                          placeholder="Enter SKU"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="barcode">
                          Barcode (ISBN, UPC, GTIN, etc.)
                        </Label>
                        <Input
                          id="barcode"
                          value={formData.barcode || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              barcode: e.target.value,
                            })
                          }
                          placeholder="Enter barcode"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requires_shipping">
                      This is a physical product
                    </Label>
                    <p className="text-sm text-neutral-500">
                      Products that need to be shipped
                    </p>
                  </div>
                  <Switch
                    id="requires_shipping"
                    checked={formData.requires_shipping}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, requires_shipping: checked })
                    }
                  />
                </div>

                {formData.requires_shipping && (
                  <div className="space-y-4 pl-6 border-l border-neutral-800">
                    <div className="space-y-2">
                      <Label
                        htmlFor="weight"
                        className="flex items-center gap-2"
                      >
                        Weight
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="weight"
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
                        placeholder="0.00"
                        className={errors.weight ? "border-red-500" : ""}
                      />
                      {errors.weight && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.weight}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight_unit">Weight unit</Label>
                      <Select
                        value={formData.weight_unit || "kg"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, weight_unit: value })
                        }
                      >
                        <SelectTrigger id="weight_unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Customs information</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Country of origin"
                          value={formData.customs_info?.country_of_origin || ""}
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
                          placeholder="HS (Harmonized System) code"
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
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              {/* Cost and Profit Margin */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="cost_per_item"
                    className="flex items-center gap-2"
                  >
                    Cost per item (RM)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cost_per_item"
                    type="text"
                    inputMode="decimal"
                    value={formData.cost_per_item?.toFixed(2) || ""}
                    onChange={(e) => {
                      const formatted = formatNumberInput(e.target.value);
                      if (formatted === "") {
                        setFormData({
                          ...formData,
                          cost_per_item: undefined,
                        });
                        return;
                      }
                      const value = parseFloat(formatted);
                      if (!isNaN(value)) {
                        setFormData({
                          ...formData,
                          cost_per_item: value,
                        });
                      }
                    }}
                    className={errors.cost_per_item ? "border-red-500" : ""}
                    required
                  />
                  {errors.cost_per_item && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.cost_per_item}</span>
                    </div>
                  )}
                </div>

                {/* Profit Margin Calculation */}
                {formData.cost_per_item && formData.price ? (
                  <div className="rounded-lg border border-neutral-800 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">
                        Cost per item
                      </span>
                      <span>{formatCurrency(formData.cost_per_item)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-400">
                        Sale price
                      </span>
                      <span>{formatCurrency(formData.price)}</span>
                    </div>
                    <div className="border-t border-neutral-800 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Profit margin
                        </span>
                        <div className="flex items-center gap-2">
                          <span>
                            {formatCurrency(
                              formData.price - formData.cost_per_item
                            )}
                          </span>
                          <span className="text-sm text-neutral-400">
                            (
                            {Math.round(
                              ((formData.price - formData.cost_per_item) /
                                formData.price) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Customer-facing prices */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    Sale Price (RM)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="text"
                    inputMode="decimal"
                    value={formData.price.toFixed(2)}
                    onChange={(e) => {
                      const formatted = formatNumberInput(e.target.value);
                      if (formatted === "") return;
                      const value = parseFloat(formatted);
                      if (!isNaN(value)) {
                        setFormData({
                          ...formData,
                          price: value,
                        });
                      }
                    }}
                    className={errors.price ? "border-red-500" : ""}
                    required
                  />
                  {errors.price && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.price}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">
                    Compare at Price (RM)
                    <span className="ml-1 text-xs text-neutral-500">
                      (Original price)
                    </span>
                  </Label>
                  <Input
                    id="compare_at_price"
                    type="text"
                    inputMode="decimal"
                    value={formData.compare_at_price?.toFixed(2) || ""}
                    onChange={(e) => {
                      const formatted = formatNumberInput(e.target.value);
                      if (formatted === "") {
                        setFormData({
                          ...formData,
                          compare_at_price: undefined,
                        });
                        return;
                      }
                      const value = parseFloat(formatted);
                      if (!isNaN(value)) {
                        setFormData({
                          ...formData,
                          compare_at_price: value,
                        });
                      }
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="charge_tax">Charge tax on this product</Label>
                  <p className="text-sm text-neutral-500">
                    Include this product in tax calculations
                  </p>
                </div>
                <Switch
                  id="charge_tax"
                  checked={formData.charge_tax}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, charge_tax: checked })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Variant Brackets</h3>
                    <p className="text-sm text-neutral-500">
                      Group your variant options into logical brackets
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowBracketDialog(true)}
                    variant="outline"
                  >
                    Add Bracket
                  </Button>
                </div>

                {formData.variant_brackets?.map((bracket) => (
                  <Card key={bracket.id} className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-medium">{bracket.name}</h4>
                        {bracket.description && (
                          <p className="text-sm text-neutral-500">
                            {bracket.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBracketId(bracket.id);
                            setShowVariantDialog(true);
                          }}
                        >
                          Add Option
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              variant_brackets:
                                prev.variant_brackets?.filter(
                                  (b) => b.id !== bracket.id
                                ) || [],
                            }));
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {bracket.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg border border-neutral-800 bg-neutral-900/50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {option.name}
                              </span>
                              <span className="text-xs text-neutral-500 shrink-0">
                                ({option.values.length})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {option.values.map((value) => (
                                <div
                                  key={value}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-800 text-xs"
                                >
                                  <span>{value}</span>
                                  {option.additional_costs[value] > 0 && (
                                    <span className="text-green-500">
                                      +
                                      {formatCurrency(
                                        option.additional_costs[value]
                                      )}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0"
                            onClick={() => {
                              const updatedBrackets =
                                formData.variant_brackets?.map((b) =>
                                  b.id === bracket.id
                                    ? {
                                        ...b,
                                        options: b.options.filter(
                                          (_, i) => i !== index
                                        ),
                                      }
                                    : b
                                );
                              setFormData((prev) => ({
                                ...prev,
                                variant_brackets: updatedBrackets || [],
                              }));
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
                {errors.variant_brackets && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.variant_brackets}</span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="grid gap-4">
                <div className="border border-dashed border-neutral-800 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-neutral-400">
                        Drag and drop your product images here, or click to
                        select files
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Supported formats: PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      className="cursor-pointer"
                      onChange={(e) =>
                        e.target.files && handleMediaUpload(e.target.files)
                      }
                    />
                  </div>
                </div>

                {formData.media.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.media.map((media, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={media.url}
                          alt={media.alt || ""}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedMedia(media);
                              setShowMediaDialog(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                media: formData.media.filter(
                                  (_, i) => i !== index
                                ),
                              })
                            }
                          >
                            Delete
                          </Button>
                        </div>
                        {media.alt && (
                          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/75 rounded text-xs text-white truncate">
                            {media.alt}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">
                  Product Organization
                </h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Collections</Label>
                    <CollectionCombobox
                      collections={collections}
                      selectedCollections={formData.collections}
                      onSelect={handleCollectionSelect}
                      onCreateNew={() => setShowCollectionDialog(true)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Brand</Label>
                    <Input
                      id="vendor"
                      value={formData.vendor || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, vendor: e.target.value })
                      }
                      placeholder="e.g., Nike, Apple"
                    />
                  </div>

                  <div className="space-y-2">
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
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-neutral-800" />

              <div>
                <h4 className="text-sm font-medium mb-4">On-Page SEO</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo-title">Page Title</Label>
                    <Input
                      id="seo-title"
                      value={formData.seo_title || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, seo_title: e.target.value })
                      }
                      placeholder="SEO-optimized page title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-description">Meta Description</Label>
                    <Textarea
                      id="seo-description"
                      value={formData.seo_description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seo_description: e.target.value,
                        })
                      }
                      placeholder="Brief description for search engines"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Handle</Label>
                    <Input
                      id="slug"
                      value={formData.slug || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="product-url-handle"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="organization">
              <div className="space-y-4">
                <div>
                  <Label>Collections</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {collections.map((collection) => (
                      <Card
                        key={collection.id}
                        className={`p-4 cursor-pointer transition-colors ${
                          formData.collections.some(
                            (c) => c.id === collection.id
                          )
                            ? "bg-neutral-800"
                            : "hover:bg-neutral-800/50"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            collections: prev.collections.some(
                              (c) => c.id === collection.id
                            )
                              ? prev.collections.filter(
                                  (c) => c.id !== collection.id
                                )
                              : [...prev.collections, collection],
                          }));
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{collection.title}</h3>
                            {collection.description && (
                              <p className="text-sm text-neutral-400">
                                {collection.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="flex justify-end gap-4 pt-4 border-t border-neutral-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </Tabs>
      </SheetContent>
      <VariantBracketDialog
        open={showBracketDialog}
        onOpenChange={setShowBracketDialog}
        onSave={(bracket) => {
          setFormData((prev) => ({
            ...prev,
            variant_brackets: [...(prev.variant_brackets || []), bracket],
          }));
        }}
      />
      <VariantOptionDialog
        open={showVariantDialog}
        onOpenChange={setShowVariantDialog}
        onSave={(option) => {
          if (selectedBracketId) {
            setFormData((prev) => ({
              ...prev,
              variant_brackets:
                prev.variant_brackets?.map((bracket) =>
                  bracket.id === selectedBracketId
                    ? {
                        ...bracket,
                        options: [...bracket.options, option],
                      }
                    : bracket
                ) || [],
            }));
            setSelectedBracketId(null);
          }
        }}
      />
      {selectedMedia && (
        <MediaEditDialog
          open={showMediaDialog}
          onOpenChange={setShowMediaDialog}
          media={selectedMedia}
          onSave={(updatedMedia) => {
            setFormData((prev) => ({
              ...prev,
              media: prev.media.map((m) =>
                m.id === updatedMedia.id ? updatedMedia : m
              ),
            }));
            setSelectedMedia(null);
          }}
        />
      )}
      <CollectionDialog
        open={showCollectionDialog}
        onOpenChange={setShowCollectionDialog}
        onSuccess={handleCollectionCreated}
      />
    </Sheet>
  );
}
