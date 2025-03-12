import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateProductSchema } from "@/lib/validations/products";
import { supabase } from "@/lib/supabase";
import { type Product } from "@/lib/types/products";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        variants:product_variants(*),
        images:product_images(*),
        collections:collection_products(
          collection:collections(
            id,
            title,
            handle,
            description
          )
        )
      `)
      .eq("id", params.productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return NextResponse.json(
        { message: "Failed to fetch product" },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product as Product);
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
  { params }: { params: { productId: string } }
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
    const validatedData = updateProductSchema.parse(body);

    // Start a transaction for the update
    const { data: product, error: updateError } = await supabase
      .from("products")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.productId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating product:", updateError);
      return NextResponse.json(
        { message: "Failed to update product" },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Update variants if provided
    if (validatedData.variants) {
      // Delete existing variants
      const { error: deleteVariantsError } = await supabase
        .from("product_variants")
        .delete()
        .eq("product_id", params.productId);

      if (deleteVariantsError) {
        console.error("Error deleting variants:", deleteVariantsError);
        return NextResponse.json(
          { message: "Failed to update product variants" },
          { status: 500 }
        );
      }

      // Insert new variants
      const variants = validatedData.variants.map((variant) => ({
        ...variant,
        product_id: params.productId,
      }));

      const { error: insertVariantsError } = await supabase
        .from("product_variants")
        .insert(variants);

      if (insertVariantsError) {
        console.error("Error creating variants:", insertVariantsError);
        return NextResponse.json(
          { message: "Failed to update product variants" },
          { status: 500 }
        );
      }
    }

    // Update images if provided
    if (validatedData.images) {
      // Delete existing images
      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", params.productId);

      if (deleteImagesError) {
        console.error("Error deleting images:", deleteImagesError);
        return NextResponse.json(
          { message: "Failed to update product images" },
          { status: 500 }
        );
      }

      // Insert new images
      const images = validatedData.images.map((image) => ({
        ...image,
        product_id: params.productId,
      }));

      const { error: insertImagesError } = await supabase
        .from("product_images")
        .insert(images);

      if (insertImagesError) {
        console.error("Error creating images:", insertImagesError);
        return NextResponse.json(
          { message: "Failed to update product images" },
          { status: 500 }
        );
      }
    }

    // Update collections if provided
    if (validatedData.collections) {
      // Delete existing collection associations
      const { error: deleteCollectionsError } = await supabase
        .from("collection_products")
        .delete()
        .eq("product_id", params.productId);

      if (deleteCollectionsError) {
        console.error(
          "Error deleting collection associations:",
          deleteCollectionsError
        );
        return NextResponse.json(
          { message: "Failed to update product collections" },
          { status: 500 }
        );
      }

      // Insert new collection associations
      const collectionProducts = validatedData.collections.map(
        (collection_id) => ({
          collection_id,
          product_id: params.productId,
        })
      );

      const { error: insertCollectionsError } = await supabase
        .from("collection_products")
        .insert(collectionProducts);

      if (insertCollectionsError) {
        console.error(
          "Error creating collection associations:",
          insertCollectionsError
        );
        return NextResponse.json(
          { message: "Failed to update product collections" },
          { status: 500 }
        );
      }
    }

    // Fetch updated product with all relations
    const { data: updatedProduct, error: fetchError } = await supabase
      .from("products")
      .select(`
        *,
        variants:product_variants(*),
        images:product_images(*),
        collections:collection_products(
          collection:collections(
            id,
            title,
            handle,
            description
          )
        )
      `)
      .eq("id", params.productId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated product:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch updated product" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct as Product);
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
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if product exists and get its status
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("status")
      .eq("id", params.productId)
      .single();

    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      return NextResponse.json(
        { message: "Failed to fetch product" },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of draft or archived products
    if (product.status === "active") {
      return NextResponse.json(
        { message: "Cannot delete active products" },
        { status: 400 }
      );
    }

    // Delete the product (this will cascade to variants, images, and collection associations)
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", params.productId);

    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      return NextResponse.json(
        { message: "Failed to delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
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