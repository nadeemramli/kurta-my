import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Check inventory availability
    const { data: product } = await supabase
      .from('products')
      .select('inventory_quantity')
      .eq('id', body.product_id)
      .single();

    if (!product || product.inventory_quantity < body.quantity) {
      return NextResponse.json(
        { error: 'Insufficient inventory' },
        { status: 400 }
      );
    }

    // Add item to order
    const { data: orderItem, error } = await supabase.rpc('add_order_item', {
      p_order_id: params.orderId,
      p_product_id: body.product_id,
      p_variant_id: body.variant_id,
      p_quantity: body.quantity
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ orderItem });
  } catch (error) {
    console.error('Error adding order item:', error);
    return NextResponse.json(
      { error: 'Failed to add order item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Check inventory if quantity is increasing
    const { data: currentItem } = await supabase
      .from('order_items')
      .select('quantity, product:products(inventory_quantity)')
      .eq('id', body.item_id)
      .single();

    if (currentItem && body.quantity > currentItem.quantity) {
      const additionalQuantity = body.quantity - currentItem.quantity;
      if (currentItem.product.inventory_quantity < additionalQuantity) {
        return NextResponse.json(
          { error: 'Insufficient inventory' },
          { status: 400 }
        );
      }
    }

    // Update item quantity
    const { error } = await supabase.rpc('update_order_item_quantity', {
      p_order_item_id: body.item_id,
      p_quantity: body.quantity
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order item:', error);
    return NextResponse.json(
      { error: 'Failed to update order item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase.rpc('remove_order_item', {
      p_order_id: params.orderId,
      p_order_item_id: itemId
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing order item:', error);
    return NextResponse.json(
      { error: 'Failed to remove order item' },
      { status: 500 }
    );
  }
} 