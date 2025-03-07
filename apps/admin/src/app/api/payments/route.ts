import { NextResponse } from 'next/server';
import { ChipService, type CreatePaymentParams } from '@kurta-my/payments';

const chipService = new ChipService({
  brand_id: process.env.CHIP_BRAND_ID!,
  api_key: process.env.CHIP_LIVE_KEY!,
  is_sandbox: process.env.NODE_ENV === 'development',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, client, reference } = body;

    const params: CreatePaymentParams = {
      product,
      client,
      reference,
    };

    const checkoutUrl = await chipService.createPayment(params);
    return NextResponse.json({ checkout_url: checkoutUrl });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement payment status check using the payments package
    return NextResponse.json(
      { error: 'Not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error getting payment:', error);
    return NextResponse.json(
      { error: 'Failed to get payment' },
      { status: 500 }
    );
  }
} 