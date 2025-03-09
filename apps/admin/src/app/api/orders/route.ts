import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:customers(first_name, last_name, email),
        items:order_items(
          id,
          quantity,
          unit_price,
          total_price,
          product:products(title, sku)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      orders,
      page,
      limit,
      total: count || 0,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    const { data: order, error } = await supabase.rpc('create_draft_order', {
      p_customer_id: body.customer_id,
      p_shipping_address: body.shipping_address,
      p_billing_address: body.billing_address
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 