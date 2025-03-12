export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: {
    id: string;
    slug: string;
    name: string;
  };
  brand: {
    id: string;
    slug: string;
    name: string;
  };
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  collections: ProductCollection[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  type: 'image' | 'video';
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  status: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Category {
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
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo?: {
    url: string;
    alt: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  addresses?: Address[];
  orders?: Order[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  metadata?: Record<string, any>;
  orderedAt: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  metadata?: Record<string, any>;
}

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'on_hold';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type PaymentMethod = 'cod' | 'online';

export interface ProductCollection {
  id: string;
  title: string;
  slug: string;
}

export interface VariantOption {
  name: string;
  values: string[];
  additionalCosts: Record<string, number>;
}

export interface VariantBracket {
  name: string;
  description?: string;
  options: VariantOption[];
}

export interface ProductWithDetails extends Product {
  variantOptions: VariantBracket[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  averageOrderValue: number;
  firstOrderDate?: string;
  lastOrderDate?: string;
  metadata?: Record<string, any>;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description?: string;
  criteria: Record<string, any>;
}

export interface LoyaltyProgram {
  id: string;
  customerId: string;
  pointsBalance: number;
  lifetimePoints: number;
  tierLevel: string;
  tierProgress: number;
  lastPointsEarnedAt?: string;
}

export type PromotionType = 
  | 'percentage'
  | 'fixed_amount'
  | 'buy_x_get_y'
  | 'free_shipping'
  | 'tier_discount';

export type PromotionStatus = 
  | 'draft'
  | 'active'
  | 'scheduled'
  | 'expired'
  | 'cancelled';

export type PromotionTargetType = 
  | 'all'
  | 'product'
  | 'category'
  | 'collection'
  | 'customer_segment';

export interface Promotion {
  id: string;
  name: string;
  code?: string;
  description?: string;
  type: PromotionType;
  value?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startsAt: string;
  endsAt?: string;
  usageLimit?: number;
  usedCount: number;
  status: PromotionStatus;
  isStackable: boolean;
  priority: number;
  conditions?: Record<string, any>;
}

export interface PromotionTarget {
  id: string;
  promotionId: string;
  targetType: PromotionTargetType;
  targetId: string;
}

export interface PromotionTier {
  id: string;
  promotionId: string;
  minQuantity: number;
  discountValue: number;
}

export interface BuyXGetYRule {
  id: string;
  promotionId: string;
  buyQuantity: number;
  getQuantity: number;
  buyProductId?: string;
  getProductId?: string;
  discountPercentage: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title?: string;
  content?: string;
  status: string;
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  createdAt: string;
}

export interface ContentBlock {
  id: string;
  name: string;
  type: 'banner' | 'slider' | 'menu' | 'static_page';
  content: Record<string, any>;
  status: string;
  position: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  type: 'received' | 'shipped' | 'adjusted' | 'returned';
  referenceType?: 'order' | 'purchase' | 'adjustment';
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  variantId?: string;
  type: 'low_stock' | 'out_of_stock' | 'overstock';
  threshold: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSubscription {
  id: string;
  email: string;
  status: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AbandonedCart {
  id: string;
  customerId?: string;
  email?: string;
  cartData: Record<string, any>;
  recoveryStatus: string;
  recoveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRecommendation {
  id: string;
  productId: string;
  recommendedProductId: string;
  type: 'similar' | 'frequently_bought_together' | 'custom';
  score?: number;
  createdAt: string;
  updatedAt: string;
} 