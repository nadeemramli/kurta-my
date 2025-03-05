"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CheckoutFormData {
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  billing: {
    sameAsShipping: boolean;
    firstName: string;
    lastName: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
}

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
    },
    billing: {
      sameAsShipping: true,
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    payment: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const shipping = 10;
  const tax = subtotal * 0.06; // 6% tax
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement checkout logic
    console.log("Checkout data:", formData);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="relative h-24 w-24 text-neutral-500 dark:text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400">
          Your cart is empty
        </p>
        <Button asChild variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium">Contact Information</h2>
              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h2 className="text-lg font-medium">Shipping Information</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="shipping.firstName"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="shipping.firstName"
                    name="shipping.firstName"
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                    value={formData.shipping.firstName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          firstName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                {/* Add more shipping fields similarly */}
              </div>
            </div>

            {/* Billing Information */}
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sameAsShipping"
                  name="sameAsShipping"
                  checked={formData.billing.sameAsShipping}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billing: {
                        ...formData.billing,
                        sameAsShipping: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-700"
                />
                <label
                  htmlFor="sameAsShipping"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Billing address same as shipping
                </label>
              </div>
              {!formData.billing.sameAsShipping && (
                <div className="mt-4">
                  <h2 className="text-lg font-medium">Billing Information</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Add billing fields */}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div>
              <h2 className="text-lg font-medium">Payment Information</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="payment.cardNumber"
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="payment.cardNumber"
                    name="payment.cardNumber"
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                    placeholder="1234 5678 9012 3456"
                    value={formData.payment.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment: {
                          ...formData.payment,
                          cardNumber: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                {/* Add more payment fields */}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Place Order
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:pl-8">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-6 space-y-4 divide-y divide-neutral-200 dark:divide-neutral-800">
              {items.map((item) => (
                <div key={item.id} className="flex py-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Qty {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Tax</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-base font-medium dark:border-neutral-800">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
