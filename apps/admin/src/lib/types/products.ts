export type ProductStatus = "draft" | "active" | "archived";

export interface ProductMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | '3d';
  alt?: string;
  title?: string;
  caption?: string;
  position: number;
}

export interface ProductCollection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  published?: boolean;
}

export type VariantAttributeType = 
  | 'size' 
  | 'color' 
  | 'material' 
  | 'style' 
  | 'flavor' 
  | 'pack_size' 
  | 'custom';

export interface VariantOption {
  type: VariantAttributeType;
  name: string;
  values: string[];
  additional_costs: Record<string, number>;
}

export interface VariantTemplate {
  type: VariantAttributeType;
  label: string;
  description: string;
  predefinedValues?: string[];
}

export interface VariantBracket {
  id: string;
  name: string;
  description?: string;
  options: VariantOption[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  price: number;
  compare_at_price?: number;
  cost_price?: number;
  inventory_quantity: number;
  inventory_policy: "deny" | "continue";
  weight?: number;
  weight_unit?: "kg" | "g";
  requires_shipping: boolean;
  options: Record<string, string>; // e.g., { "Size": "M", "Color": "Blue" }
  image?: string;
}

export interface ProductOption {
  name: string; // e.g., "Size", "Color"
  values: string[]; // e.g., ["S", "M", "L"] or ["Red", "Blue", "Green"]
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  width: number;
  height: number;
  position: number;
}

export interface ProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  og_image?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string; // URL-friendly version of title
  description: string;
  description_html?: string;
  status: ProductStatus;
  media: ProductMedia[];
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  charge_tax: boolean;
  weight?: number;
  weight_unit?: string;
  vendor?: string;
  type?: string;
  sku?: string;
  barcode?: string;
  customs_info?: {
    country_of_origin?: string;
    hs_code?: string;
  };
  seo_title?: string;
  seo_description?: string;
  track_quantity: boolean;
  continue_selling_when_out_of_stock: boolean;
  requires_shipping: boolean;
  published_at?: string;
  collections?: ProductCollection[];
  variant_brackets: VariantBracket[];
  updated_at?: string;
  options: ProductOption[];
  variants: ProductVariant[];
  images: ProductImage[];
  seo: ProductSEO;
  featured: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ProductSummary {
  id: string;
  title: string;
  handle: string;
  status: ProductStatus;
  featured: boolean;
  primary_image?: string;
  price_range: {
    min: number;
    max: number;
  };
  inventory_quantity: number;
  published_at?: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: string;
  seo: ProductSEO;
  products: string[]; // Array of product IDs
  published: boolean;
  sort_order?: "manual" | "best-selling" | "created-desc" | "price-asc" | "price-desc";
  conditions?: CollectionCondition[];
  created_at: string;
  updated_at: string;
}

export interface CollectionCondition {
  field: string;
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "not_contains";
  value: string | number | boolean;
}

export interface ProductsResponse {
  products: ProductSummary[];
  page: number;
  limit: number;
  total: number;
}

export interface ProductFormData {
  title: string;
  description?: string;
  status: ProductStatus;
  media: ProductMedia[];
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  charge_tax: boolean;
  weight?: number;
  weight_unit?: string;
  vendor?: string;
  type?: string;
  sku?: string;
  barcode?: string;
  customs_info?: {
    country_of_origin?: string;
    hs_code?: string;
  };
  seo_title?: string;
  seo_description?: string;
  track_quantity: boolean;
  continue_selling_when_out_of_stock: boolean;
  requires_shipping: boolean;
  variant_brackets: VariantBracket[];
  collections: ProductCollection[];
  variants: ProductVariant[];
  tags?: string[];
  slug?: string;
}

export const VARIANT_TEMPLATES: Record<Exclude<VariantAttributeType, 'custom'>, VariantTemplate> = {
  size: {
    type: 'size',
    label: 'Size',
    description: 'For clothing, shoes, or items with dimensions',
    predefinedValues: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  color: {
    type: 'color',
    label: 'Color',
    description: 'For items where appearance matters',
    predefinedValues: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Orange', 'Gray', 'Brown']
  },
  material: {
    type: 'material',
    label: 'Material',
    description: 'For products where the material affects the product\'s use or appeal',
    predefinedValues: ['Cotton', 'Polyester', 'Leather', 'Wool', 'Silk', 'Linen', 'Denim', 'Nylon']
  },
  style: {
    type: 'style',
    label: 'Style/Design',
    description: 'For products with different patterns or aesthetics',
    predefinedValues: ['Solid', 'Striped', 'Polka Dot', 'Floral', 'Plaid', 'Geometric', 'Abstract']
  },
  flavor: {
    type: 'flavor',
    label: 'Flavor/Scent',
    description: 'For food, beverages, or cosmetics',
    predefinedValues: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Lavender', 'Citrus', 'Coffee']
  },
  pack_size: {
    type: 'pack_size',
    label: 'Pack Size',
    description: 'For items sold in bulk or sets',
    predefinedValues: ['Single', 'Pack of 2', 'Pack of 3', 'Pack of 5', 'Pack of 10', 'Family Size']
  }
};

export const VARIANT_ATTRIBUTE_TYPES: Record<VariantAttributeType, string> = {
  size: 'Size',
  color: 'Color',
  material: 'Material',
  style: 'Style',
  flavor: 'Flavor',
  pack_size: 'Pack Size',
  custom: 'Custom'
}; 