import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateCollectionSchema } from "@/lib/validations/products";
import { supabase } from "@/lib/supabase";
import { type Collection } from "@/lib/types/products";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: collection, error } = await supabase
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
      .eq("id", params.collectionId)
      .single();

    if (error) {
      console.error("Error fetching collection:", error);
      return NextResponse.json(
        { message: "Failed to fetch collection" },
        { status: 500 }
      );
    }

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection as Collection);
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateCollectionSchema.parse(body);

    // Update the collection
    const { data: collection, error: updateError } = await supabase
      .from("collections")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.collectionId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating collection:", updateError);
      return NextResponse.json(
        { message: "Failed to update collection" },
        { status: 500 }
      );
    }

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    // Update products if provided
    if (validatedData.products) {
      // Delete existing product associations
      const { error: deleteProductsError } = await supabase
        .from("collection_products")
        .delete()
        .eq("collection_id", params.collectionId);

      if (deleteProductsError) {
        console.error(
          "Error deleting product associations:",
          deleteProductsError
        );
        return NextResponse.json(
          { message: "Failed to update collection products" },
          { status: 500 }
        );
      }

      // Insert new product associations
      if (validatedData.products.length > 0) {
        const collectionProducts = validatedData.products.map(
          (productId) => ({
            collection_id: params.collectionId,
            product_id: productId,
          })
        );

        const { error: insertProductsError } = await supabase
          .from("collection_products")
          .insert(collectionProducts);

        if (insertProductsError) {
          console.error(
            "Error creating product associations:",
            insertProductsError
          );
          return NextResponse.json(
            { message: "Failed to update collection products" },
            { status: 500 }
          );
        }
      }
    }

    // Fetch updated collection with all relations
    const { data: updatedCollection, error: fetchError } = await supabase
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
      .eq("id", params.collectionId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated collection:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch updated collection" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCollection as Collection);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { collectionId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if collection exists
    const { data: collection, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("id", params.collectionId)
      .single();

    if (fetchError) {
      console.error("Error fetching collection:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch collection" },
        { status: 500 }
      );
    }

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found" },
        { status: 404 }
      );
    }

    // Delete the collection (this will cascade to collection_products)
    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", params.collectionId);

    if (deleteError) {
      console.error("Error deleting collection:", deleteError);
      return NextResponse.json(
        { message: "Failed to delete collection" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Collection deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 