export type Cart = {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  images: {
    url: string;
    altText: string;
  }[];
  variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Money;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

// Mock implementation for now
export async function getCart(): Promise<Cart> {
  return {
    id: 'mock-cart',
    items: [],
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'MYR' },
      totalAmount: { amount: '0', currencyCode: 'MYR' },
      totalTaxAmount: { amount: '0', currencyCode: 'MYR' }
    }
  };
} 