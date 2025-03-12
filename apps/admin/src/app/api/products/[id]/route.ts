import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ProductFormData } from '@/lib/types/products';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        product_media (
          id,
          url,
          type,
          alt,
          position,
          metadata,
          sizes
        ),
        variant_brackets (
          id,
          name,
          description,
          position,
          variant_options (
            id,
            name,
            values,
            additional_costs,
            position
          )
        ),
        product_collections (
          collection:collections (
            id,
            title,
            slug,
            description
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const formData: ProductFormData = await request.json();

    // Update main product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update({
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
        continue_selling_when_out_of_stock: formData.continue_selling_when_out_of_stock,
        requires_shipping: formData.requires_shipping,
        meta_fields: {
          tags: formData.tags,
          slug: formData.slug,
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (productError) {
      throw productError;
    }

    // Delete existing variant brackets (cascade will handle options)
    const { error: deleteBracketsError } = await supabase
      .from('variant_brackets')
      .delete()
      .eq('product_id', params.id);

    if (deleteBracketsError) {
      throw deleteBracketsError;
    }

    // Insert new variant brackets and options
    if (formData.variant_brackets?.length > 0) {
      for (const bracket of formData.variant_brackets) {
        const { data: variantBracket, error: bracketError } = await supabase
          .from('variant_brackets')
          .insert({
            product_id: params.id,
            name: bracket.name,
            description: bracket.description,
          })
          .select()
          .single();

        if (bracketError) {
          throw bracketError;
        }

        // Insert variant options for this bracket
        if (bracket.options?.length > 0) {
          const variantOptions = bracket.options.map((option) => ({
            bracket_id: variantBracket.id,
            name: option.name,
            values: option.values,
            additional_costs: option.additional_costs,
          }));

          const { error: optionsError } = await supabase
            .from('variant_options')
            .insert(variantOptions);

          if (optionsError) {
            throw optionsError;
          }
        }
      }
    }

    // Update collections
    const { error: deleteCollectionsError } = await supabase
      .from('product_collections')
      .delete()
      .eq('product_id', params.id);

    if (deleteCollectionsError) {
      throw deleteCollectionsError;
    }

    if (formData.collections?.length > 0) {
      const productCollections = formData.collections.map((collection) => ({
        product_id: params.id,
        collection_id: collection.id,
      }));

      const { error: collectionsError } = await supabase
        .from('product_collections')
        .insert(productCollections);

      if (collectionsError) {
        throw collectionsError;
      }
    }

    // Update media
    const { error: deleteMediaError } = await supabase
      .from('product_media')
      .delete()
      .eq('product_id', params.id);

    if (deleteMediaError) {
      throw deleteMediaError;
    }

    if (formData.media?.length > 0) {
      const productMedia = formData.media.map((media, index) => ({
        product_id: params.id,
        url: media.url,
        type: media.type,
        alt: media.alt,
        position: media.position || index,
      }));

      const { error: mediaError } = await supabase
        .from('product_media')
        .insert(productMedia);

      if (mediaError) {
        throw mediaError;
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Delete product (cascade will handle related records)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 