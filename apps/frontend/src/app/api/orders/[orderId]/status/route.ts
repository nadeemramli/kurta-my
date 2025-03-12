import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function POST(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status transition
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', params.orderId)
      .eq('customer_id', session.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      throw fetchError;
    }

    // Only allow cancellation by customer
    if (status !== 'cancelled') {
      return NextResponse.json(
        { error: 'Invalid status transition' },
        { status: 400 }
      );
    }

    // Only allow cancellation of pending orders
    if (currentOrder.status !== 'pending') {
      return NextResponse.json(
        { error: 'Order cannot be cancelled' },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', params.orderId)
      .eq('customer_id', session.user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
} 