export type ProductStatus = 'active' | 'draft' | 'archived';

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

export interface Product {
  id?: string;
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
  published_at?: string;
  collections?: ProductCollection[];
  variant_brackets: VariantBracket[];
  updated_at?: string;
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