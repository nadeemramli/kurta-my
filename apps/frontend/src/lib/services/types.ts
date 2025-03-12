export interface ProductMediaRow {
  id: string;
  url: string;
  alt: string | null;
  type: 'image' | 'video';
  position: number;
}

export interface ProductVariantRow {
  id: string;
  sku: string;
  name?: string;
  price: number;
  compare_at_price?: number;
  inventory_quantity: number;
  attributes?: Record<string, string>;
  status: string;
}

export interface ProductCollectionRow {
  collection: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface ProductAttributeRow {
  name: string;
  value: string;
}

export interface VariantBracketRow {
  id: string;
  name: string;
  description?: string;
  variant_options: VariantOptionRow[];
}

export interface VariantOptionRow {
  id: string;
  name: string;
  values: string[];
  additional_costs: Record<string, number>;
}

export interface ProductRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id: string;
  category_slug: string;
  category_name: string;
  brand_id: string;
  brand_slug: string;
  brand_name: string;
  created_at: string;
  updated_at: string;
  media: ProductMediaRow[];
  variants: ProductVariantRow[];
  attributes?: ProductAttributeRow[];
  collections: ProductCollectionRow[];
  variant_brackets?: VariantBracketRow[];
} 