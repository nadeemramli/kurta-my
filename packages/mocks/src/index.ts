import { Product } from '@kurta-my/types';

// This simulates what we would get from our admin backend
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Kurta',
    description: 'A timeless white kurta perfect for any occasion',
    price: { amount: 49.99, currencyCode: 'USD' },
    images: [
      {
        url: '/images/products/white-kurta-1.jpg',
        altText: 'Classic White Kurta - Front View',
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: '2',
    name: 'Black Embroidered Kurta',
    description: 'Elegant black kurta with traditional embroidery',
    price: { amount: 79.99, currencyCode: 'USD' },
    images: [
      {
        url: '/images/products/black-kurta-1.jpg',
        altText: 'Black Embroidered Kurta - Front View',
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: '3',
    name: 'Navy Blue Cotton Kurta',
    description: 'Comfortable cotton kurta in rich navy blue',
    price: { amount: 59.99, currencyCode: 'USD' },
    images: [
      {
        url: '/images/products/navy-kurta-1.jpg',
        altText: 'Navy Blue Cotton Kurta - Front View',
        width: 800,
        height: 800
      }
    ]
  }
]; 