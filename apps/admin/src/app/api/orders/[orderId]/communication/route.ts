import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CommunicationPreferences } from '@/lib/types/orders';

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json() as CommunicationPreferences;

    // Update communication preferences
    const { error } = await supabase
      .from('orders')
      .update({
        communication_channels: body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.orderId);

    if (error) {
      throw error;
    }

    // If WhatsApp is enabled, ensure we have a valid phone number
    if (body.whatsapp) {
      const { data: order } = await supabase
        .from('orders')
        .select('shipping_address->phone')
        .eq('id', params.orderId)
        .single();

      if (!order?.shipping_address?.phone) {
        return NextResponse.json(
          { error: 'Phone number is required for WhatsApp notifications' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating communication preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update communication preferences' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
      .from('orders')
      .select('communication_channels')
      .eq('id', params.orderId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ preferences: data.communication_channels });
  } catch (error) {
    console.error('Error fetching communication preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communication preferences' },
      { status: 500 }
    );
  }
} 