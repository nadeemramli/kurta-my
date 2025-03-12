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
    const { payment_id, payment_status } = body;

    // Validate payment status
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select('payment_status, status')
      .eq('id', params.orderId)
      .eq('customer_id', session.user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      throw fetchError;
    }

    // Only allow payment updates for pending payments
    if (currentOrder.payment_status !== 'pending') {
      return NextResponse.json(
        { error: 'Payment already processed' },
        { status: 400 }
      );
    }

    const updates: any = {
      payment_status,
      metadata: {
        payment_id,
        payment_updated_at: new Date().toISOString(),
      },
    };

    // If payment is successful, update order status to processing
    if (payment_status === 'completed') {
      updates.status = 'processing';
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', params.orderId)
      .eq('customer_id', session.user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
} 