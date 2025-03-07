export interface Cart {
  id: string;
  items: CartItem[];
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    image: {
      url: string;
      altText: string;
    };
  };
}

export interface Money {
  amount: string;
  currencyCode: string;
} 