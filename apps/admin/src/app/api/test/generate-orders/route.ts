import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { count = 10 } = await request.json();

    // Generate test orders
    const { error } = await supabase.rpc('generate_test_orders', {
      num_orders: count
    });

    if (error) {
      throw error;
    }

    // Update analytics for the current date
    await supabase.rpc('update_order_analytics', {
      p_date: new Date().toISOString().split('T')[0]
    });

    return NextResponse.json({ 
      success: true,
      message: `Generated ${count} test orders`
    });
  } catch (error) {
    console.error('Error generating test orders:', error);
    return NextResponse.json(
      { error: 'Failed to generate test orders' },
      { status: 500 }
    );
  }
} 