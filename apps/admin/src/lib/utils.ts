import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatPhoneNumber(phone: string): string {
  // Format Malaysian phone numbers
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function generateOrderNumber(): string {
  return `ORD${Date.now().toString(36).toUpperCase()}`;
}

export function calculateTotalAmount(
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number
): number {
  return subtotal + shipping + tax - discount;
} 