export type Product = {
  id: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: number;
    currencyCode: string;
  };
  images: {
    url: string;
    altText: string;
    width: number;
    height: number;
  }[];
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  parent?: Category;
  children?: Category[];
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: {
    url: string;
    alt: string;
  };
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  orders?: Order[];
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: string | undefined;
  };
};

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded';

export type SortFilterItem = {
  title: string;
  slug: string;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
  reverse?: boolean;
};

export * from './database';
export * from './error'; 