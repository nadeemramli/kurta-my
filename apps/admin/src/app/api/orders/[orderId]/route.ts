import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        items:order_items(
          id,
          quantity,
          unit_price,
          total_price,
          product:products(
            id,
            title,
            sku,
            inventory_quantity
          )
        )
      `)
      .eq('id', params.orderId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
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

    // Handle different update types
    switch (body.action) {
      case 'update_status':
        await supabase.rpc('update_order_status', {
          p_order_id: params.orderId,
          p_status: body.status,
          p_payment_status: body.payment_status
        });
        break;

      case 'cancel_order':
        // First check if order can be cancelled
        const { data: order } = await supabase
          .from('orders')
          .select('status')
          .eq('id', params.orderId)
          .single();

        if (order?.status === 'completed') {
          return NextResponse.json(
            { error: 'Cannot cancel completed order' },
            { status: 400 }
          );
        }

        await supabase.rpc('update_order_status', {
          p_order_id: params.orderId,
          p_status: 'cancelled',
          p_payment_status: 'failed'
        });
        break;

      case 'update_shipping':
        await supabase.rpc('apply_shipping_cost', {
          p_order_id: params.orderId,
          p_shipping_amount: body.shipping_amount
        });
        break;

      case 'update_tax':
        await supabase.rpc('apply_tax', {
          p_order_id: params.orderId,
          p_tax_amount: body.tax_amount
        });
        break;

      case 'apply_discount':
        await supabase.rpc('apply_discount', {
          p_order_id: params.orderId,
          p_discount_amount: body.discount_amount
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Fetch and return updated order
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
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

    // Only allow deletion of draft orders
    const { data: order } = await supabase
      .from('orders')
      .select('status')
      .eq('id', params.orderId)
      .single();

    if (order?.status !== 'draft') {
      return NextResponse.json(
        { error: 'Can only delete draft orders' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', params.orderId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 