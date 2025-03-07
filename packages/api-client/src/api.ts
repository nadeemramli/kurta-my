import type { Product, Category, Brand, Order, User } from '@kurta-my/types';

// Helper function to transform API response to match shared Product type
function transformProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: {
      amount: apiProduct.price,
      currencyCode: 'MYR' // Default to Malaysian Ringgit
    },
    ...(apiProduct.compareAtPrice && {
      compareAtPrice: {
        amount: apiProduct.compareAtPrice,
        currencyCode: 'MYR'
      }
    }),
    images: apiProduct.images.map((img: any) => ({
      url: img.url,
      altText: img.alt,
      width: 800, // Default width if not provided
      height: 800 // Default height if not provided
    }))
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Products
  getProducts: async (params?: URLSearchParams) => {
    const response = await fetchAPI<{ products: any[]; total: number }>(`/products${params ? `?${params}` : ''}`);
    return {
      products: response.products.map(transformProduct),
      total: response.total
    };
  },
  
  getProduct: async (slug: string) => {
    const response = await fetchAPI<any>(`/products/${slug}`);
    return transformProduct(response);
  },

  // Categories
  getCategories: () => 
    fetchAPI<Category[]>('/categories'),
  
  getCategory: (slug: string) => 
    fetchAPI<Category>(`/categories/${slug}`),

  // Brands
  getBrands: () => 
    fetchAPI<Brand[]>('/brands'),
  
  getBrand: (slug: string) => 
    fetchAPI<Brand>(`/brands/${slug}`),

  // Auth
  login: (email: string, password: string) =>
    fetchAPI<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: Partial<User> & { password: string }) =>
    fetchAPI<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  forgotPassword: (email: string) =>
    fetchAPI<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    fetchAPI<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),

  // User
  getCurrentUser: () => 
    fetchAPI<User>('/user/me'),

  updateUser: (data: Partial<User>) =>
    fetchAPI<User>('/user/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Orders
  getOrders: () => 
    fetchAPI<Order[]>('/orders'),

  getOrder: (id: string) => 
    fetchAPI<Order>(`/orders/${id}`),

  createOrder: (orderData: Partial<Order>) =>
    fetchAPI<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
}; 