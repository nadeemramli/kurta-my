import { z } from "zod";

export const productImageSchema = z.object({
  url: z.string().url("Invalid image URL"),
  alt: z.string().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  position: z.number().int().min(0),
});

export const productOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  values: z.array(z.string()).min(1, "At least one option value is required"),
});

export const productVariantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  price: z.number().positive("Price must be greater than 0"),
  compare_at_price: z.number().positive().optional(),
  cost_price: z.number().positive().optional(),
  inventory_quantity: z.number().int().min(0),
  inventory_policy: z.enum(["deny", "continue"]),
  weight: z.number().positive().optional(),
  weight_unit: z.enum(["kg", "g"]).optional(),
  requires_shipping: z.boolean(),
  options: z.record(z.string()),
  image: z.string().url().optional(),
});

export const productSEOSchema = z.object({
  title: z.string().max(60).optional(),
  description: z.string().max(160).optional(),
  keywords: z.array(z.string()).optional(),
  og_image: z.string().url().optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid URL handle format"),
  description: z.string(),
  description_html: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
  vendor: z.string().optional(),
  product_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  options: z.array(productOptionSchema),
  variants: z.array(productVariantSchema),
  images: z.array(productImageSchema),
  seo: productSEOSchema,
  collections: z.array(z.string().uuid()).optional(),
  featured: z.boolean(),
  published_at: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const collectionConditionSchema = z.object({
  field: z.string(),
  operator: z.enum([
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "contains",
    "not_contains",
  ]),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const createCollectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  handle: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid URL handle format"),
  description: z.string().optional(),
  image: z.string().url().optional(),
  seo: productSEOSchema,
  products: z.array(z.string().uuid()),
  published: z.boolean(),
  sort_order: z
    .enum([
      "manual",
      "best-selling",
      "created-desc",
      "price-asc",
      "price-desc",
    ])
    .optional(),
  conditions: z.array(collectionConditionSchema).optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial(); 