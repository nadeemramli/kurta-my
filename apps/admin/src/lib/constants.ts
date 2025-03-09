export const malaysianStates = [
  'Johor',
  'Kedah',
  'Kelantan',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Perak',
  'Perlis',
  'Pulau Pinang',
  'Sabah',
  'Sarawak',
  'Selangor',
  'Terengganu',
  'Kuala Lumpur',
  'Labuan',
  'Putrajaya'
] as const;

export type MalaysianState = typeof malaysianStates[number];

export const deliveryOptions = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: '3-5 working days',
    price: 10.00
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: '1-2 working days',
    price: 20.00
  }
] as const;

export type DeliveryOption = typeof deliveryOptions[number];

export const paymentMethods = {
  fpx: {
    id: 'fpx',
    name: 'Online Banking (FPX)',
    description: 'Pay directly from your bank account'
  },
  card: {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Secure payment with credit or debit card'
  },
  cod: {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order'
  }
} as const;

export type PaymentMethod = keyof typeof paymentMethods; 