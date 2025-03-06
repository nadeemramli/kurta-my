import { NextResponse } from 'next/server';
import chip from 'chip-sdk';

interface ChipConfig {
  brand_id: string;
  api_key: string;
  is_sandbox: boolean;
}

const config: ChipConfig = {
  brand_id: process.env.CHIP_BRAND_ID!,
  api_key: process.env.CHIP_LIVE_KEY!,
  is_sandbox: false,
};

interface ChipPurchase {
  create: (params: any, config: ChipConfig) => Promise<any>;
  get: (id: string, config: ChipConfig) => Promise<any>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, client, reference } = body;

    const purchase = new (chip.Purchase as any)() as ChipPurchase;
    const payment = await purchase.create({
      success_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      failure_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
      cancel_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      platform: 'web',
      transaction: {
        products: [{
          name: product.name,
          price: product.price,
          quantity: 1,
        }],
      },
      client: {
        email: client.email,
        full_name: client.full_name,
        phone_number: client.phone_number,
      },
      reference: reference,
      send_email: true,
    }, config);

    return NextResponse.json(payment);
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

    const purchase = new (chip.Purchase as any)() as ChipPurchase;
    const payment = await purchase.get(id, config);
    return NextResponse.json(payment);
  } catch (error) {
    console.error('Error getting payment:', error);
    return NextResponse.json(
      { error: 'Failed to get payment' },
      { status: 500 }
    );
  }
} 