import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createProductSchema } from "@/lib/validations/products";
import { supabase } from "@/lib/supabase";
import { type Product, type ProductSummary } from "@/lib/types/products";
import { ZodError } from "zod";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProductSchema.parse(body);

    // Generate handle if not provided
    if (!validatedData.handle) {
      validatedData.handle = slugify(validatedData.title, { lower: true });
    }

    // Insert the product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (productError) {
      console.error("Error creating product:", productError);
      return NextResponse.json(
        { message: "Failed to create product" },
        { status: 500 }
      );
    }

    // Insert variants
    if (validatedData.variants?.length > 0) {
      const variants = validatedData.variants.map((variant) => ({
        ...variant,
        product_id: product.id,
      }));

      const { error: variantsError } = await supabase
        .from("product_variants")
        .insert(variants);

      if (variantsError) {
        console.error("Error creating variants:", variantsError);
        return NextResponse.json(
          { message: "Failed to create product variants" },
          { status: 500 }
        );
      }
    }

    // Insert images
    if (validatedData.images?.length > 0) {
      const images = validatedData.images.map((image) => ({
        ...image,
        product_id: product.id,
      }));

      const { error: imagesError } = await supabase
        .from("product_images")
        .insert(images);

      if (imagesError) {
        console.error("Error creating images:", imagesError);
        return NextResponse.json(
          { message: "Failed to create product images" },
          { status: 500 }
        );
      }
    }

    // Add to collections if specified
    const collections = validatedData.collections ?? [];
    if (collections.length > 0) {
      const collectionProducts = collections.map((collection_id) => ({
        collection_id,
        product_id: product.id,
      }));

      const { error: collectionsError } = await supabase
        .from("collection_products")
        .insert(collectionProducts);

      if (collectionsError) {
        console.error("Error adding to collections:", collectionsError);
        return NextResponse.json(
          { message: "Failed to add product to collections" },
          { status: 500 }
        );
      }
    }

    // Fetch complete product with all relations
    const { data: completeProduct, error: fetchError } = await supabase
      .from("products")
      .select(`
        *,
        variants:product_variants(*),
        images:product_images(*),
        collections:collection_products(collection_id)
      `)
      .eq("id", product.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete product:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch complete product" },
        { status: 500 }
      );
    }

    return NextResponse.json(completeProduct as Product);
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const collection = searchParams.get("collection");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("products")
      .select(
        `
        id,
        title,
        handle,
        status,
        featured,
        published_at,
        updated_at,
        primary_image:product_images!inner(url),
        variants:product_variants(price, inventory_quantity)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,handle.ilike.%${search}%`
      );
    }

    if (collection) {
      const { data: collectionProducts } = await supabase
        .from("collection_products")
        .select("product_id")
        .eq("collection_id", collection);

      if (collectionProducts && collectionProducts.length > 0) {
        const productIds = collectionProducts.map((cp) => cp.product_id);
        query = query.in("id", productIds);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { message: "Failed to fetch products" },
        { status: 500 }
      );
    }

    // Transform the data to match ProductSummary type
    const products: ProductSummary[] = data.map((product: any) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      status: product.status,
      featured: product.featured,
      primary_image: product.primary_image?.[0]?.url,
      price_range: {
        min: Math.min(...(product.variants?.map((v: any) => v.price) ?? [0])),
        max: Math.max(...(product.variants?.map((v: any) => v.price) ?? [0])),
      },
      inventory_quantity: product.variants?.reduce(
        (sum: number, v: any) => sum + (v.inventory_quantity || 0),
        0
      ) ?? 0,
      published_at: product.published_at,
      updated_at: product.updated_at,
    }));

    return NextResponse.json({
      products,
      total: count ?? 0,
    });
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 