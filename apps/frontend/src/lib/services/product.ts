import { supabase } from "../supabase";
import type {
  Product,
  ProductWithDetails,
  ProductImage,
  ProductVariant,
  ProductCollection,
  VariantBracket,
  VariantOption,
} from "@/types";
import type {
  ProductRow,
  ProductMediaRow,
  ProductVariantRow,
  ProductAttributeRow,
  VariantBracketRow,
  VariantOptionRow,
} from "./types";

interface ProductCollectionRow {
  collection: {
    id: string;
    title: string;
    slug: string;
  };
}

export async function getProducts(options?: {
  collection?: string;
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
}) {
  try {
    let query = supabase
      .from("products")
      .select(`
        *,
        media:product_media(
          id,
          url,
          alt,
          type,
          position
        ),
        variants:product_variants(
          id,
          sku,
          name,
          price,
          compare_at_price,
          inventory_quantity,
          attributes,
          status
        ),
        collections:product_collections(
          collection:collections(
            id,
            title,
            slug
          )
        )
      `)
      .eq("status", "active");

    // Apply filters
    if (options?.collection) {
      query = query.eq("collections.collection.slug", options.collection);
    }

    if (options?.category) {
      query = query.eq("category_slug", options.category);
    }

    if (options?.search) {
      query = query.ilike("title", `%${options.search}%`);
    }

    // Apply sorting
    if (options?.sort) {
      const [field, order] = options.sort.split("-");
      query = query.order(field, { ascending: order === "asc" });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(transformProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        media:product_media(
          id,
          url,
          alt,
          type,
          position
        ),
        variants:product_variants(
          id,
          sku,
          name,
          price,
          compare_at_price,
          inventory_quantity,
          attributes,
          status
        ),
        collections:product_collections(
          collection:collections(
            id,
            title,
            slug
          )
        ),
        variant_brackets(
          id,
          name,
          description,
          variant_options(
            id,
            name,
            values,
            additional_costs
          )
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) throw error;
    if (!data) return null;

    return transformProductWithDetails(data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export function transformProduct(data: ProductRow): Product {
  return {
    id: data.id,
    slug: data.slug,
    name: data.title,
    description: data.description,
    price: data.price,
    compareAtPrice: data.compare_at_price,
    images: data.media.map((media: ProductMediaRow): ProductImage => ({
      id: media.id,
      url: media.url,
      alt: media.alt || data.title,
      type: media.type || 'image',
      position: media.position,
      isPrimary: media.position === 0
    })),
    category: {
      id: data.category_id,
      slug: data.category_slug || '',
      name: data.category_name || ''
    },
    brand: {
      id: data.brand_id,
      slug: data.brand_slug || '',
      name: data.brand_name || ''
    },
    variants: data.variants.map((variant: ProductVariantRow): ProductVariant => ({
      id: variant.id,
      sku: variant.sku,
      name: variant.name || '',
      price: variant.price,
      compareAtPrice: variant.compare_at_price,
      stockQuantity: variant.inventory_quantity,
      attributes: variant.attributes || {},
      status: variant.status
    })),
    attributes: data.attributes?.map((attr: ProductAttributeRow) => ({
      name: attr.name,
      value: attr.value
    })) || [],
    collections: data.collections.map((col: ProductCollectionRow): ProductCollection => ({
      id: col.collection.id,
      title: col.collection.title,
      slug: col.collection.slug
    })),
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

function transformProductWithDetails(data: ProductRow & { variant_brackets: VariantBracketRow[] }): ProductWithDetails {
  return {
    ...transformProduct(data),
    variantOptions: data.variant_brackets.map((bracket: VariantBracketRow): VariantBracket => ({
      name: bracket.name,
      description: bracket.description,
      options: bracket.variant_options.map((option: VariantOptionRow): VariantOption => ({
        name: option.name,
        values: option.values,
        additionalCosts: option.additional_costs
      }))
    }))
  };
} 