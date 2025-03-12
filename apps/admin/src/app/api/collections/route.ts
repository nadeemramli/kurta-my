import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createCollectionSchema } from "@/lib/validations/products";
import { supabase } from "@/lib/supabase";
import { type Collection } from "@/lib/types/products";
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
    const validatedData = createCollectionSchema.parse(body);

    // Generate handle if not provided
    if (!validatedData.handle) {
      validatedData.handle = slugify(validatedData.title, { lower: true });
    }

    // Insert the collection
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .insert({
        ...validatedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (collectionError) {
      console.error("Error creating collection:", collectionError);
      return NextResponse.json(
        { message: "Failed to create collection" },
        { status: 500 }
      );
    }

    // Add products to collection if specified
    if (validatedData.products?.length > 0) {
      const collectionProducts = validatedData.products.map((productId) => ({
        collection_id: collection.id,
        product_id: productId,
      }));

      const { error: productsError } = await supabase
        .from("collection_products")
        .insert(collectionProducts);

      if (productsError) {
        console.error("Error adding products to collection:", productsError);
        return NextResponse.json(
          { message: "Failed to add products to collection" },
          { status: 500 }
        );
      }
    }

    // Fetch complete collection with all relations
    const { data: completeCollection, error: fetchError } = await supabase
      .from("collections")
      .select(`
        *,
        products:collection_products(
          product:products(
            id,
            title,
            handle,
            status,
            featured,
            primary_image:product_images(url)
          )
        )
      `)
      .eq("id", collection.id)
      .single();

    if (fetchError) {
      console.error("Error fetching complete collection:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch complete collection" },
        { status: 500 }
      );
    }

    return NextResponse.json(completeCollection as Collection);
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
    const search = searchParams.get("search");
    const published = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    let query = supabase
      .from("collections")
      .select(
        `
        *,
        products:collection_products(count)
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (published !== null) {
      query = query.eq("published", published === "true");
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,handle.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching collections:", error);
      return NextResponse.json(
        { message: "Failed to fetch collections" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      collections: data,
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