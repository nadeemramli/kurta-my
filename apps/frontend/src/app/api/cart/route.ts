import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Cart } from '@/types/cart';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const items = body.items;

  // Mock response for now
  const cart: Cart = {
    id: 'mock-cart',
    items: items,
    totalQuantity: items.length,
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'MYR' },
      totalAmount: { amount: '0', currencyCode: 'MYR' },
      totalTaxAmount: { amount: '0', currencyCode: 'MYR' }
    }
  };

  return NextResponse.json(cart);
}

export async function GET(request: NextRequest) {
  // Mock empty cart response
  const cart: Cart = {
    id: 'mock-cart',
    items: [],
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'MYR' },
      totalAmount: { amount: '0', currencyCode: 'MYR' },
      totalTaxAmount: { amount: '0', currencyCode: 'MYR' }
    }
  };

  return NextResponse.json(cart);
} 