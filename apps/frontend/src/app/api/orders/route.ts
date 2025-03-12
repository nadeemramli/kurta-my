import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('customer_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error, count } = await query;

    if (error) throw error;

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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = body;

    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: session.user.id,
        status: 'pending',
        payment_status: 'pending',
        payment_method: paymentMethod,
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
        notes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.quantity * item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
} 