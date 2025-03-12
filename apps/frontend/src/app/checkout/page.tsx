"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface CheckoutFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_address: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method: "cod" | "online";
  notes?: string;
}

const initialFormData: CheckoutFormData = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  shipping_address: {
    address_line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "MY",
  },
  payment_method: "cod",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (state.items.length === 0) {
    router.push("/products");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Create or get customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .upsert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customer.id,
          status: "pending",
          payment_status: "pending",
          payment_method: formData.payment_method,
          shipping_address: {
            ...formData.shipping_address,
            email: formData.email,
            phone: formData.phone,
            name: `${formData.first_name} ${formData.last_name}`,
          },
          billing_address: {
            ...formData.shipping_address,
            email: formData.email,
            phone: formData.phone,
            name: `${formData.first_name} ${formData.last_name}`,
          },
          notes: formData.notes,
          total_amount: state.total,
          subtotal_amount: state.total,
          tax_amount: 0, // Will be calculated by backend
          shipping_amount: 0, // Will be calculated by backend
          discount_amount: 0,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = state.items.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.quantity * item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and redirect to success page
      clearCart();
      window.location.href = "/checkout/success";
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            <div>
              <h2 className="text-lg font-medium text-neutral-900 mt-8">
                Contact information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    type="text"
                    id="first_name"
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    type="text"
                    id="last_name"
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-medium text-neutral-900">
                Shipping address
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="address_line1">Address</Label>
                  <Input
                    type="text"
                    id="address_line1"
                    required
                    value={formData.shipping_address.address_line1}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: {
                          ...formData.shipping_address,
                          address_line1: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="address_line2">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    type="text"
                    id="address_line2"
                    value={formData.shipping_address.address_line2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: {
                          ...formData.shipping_address,
                          address_line2: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    required
                    value={formData.shipping_address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: {
                          ...formData.shipping_address,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    type="text"
                    id="state"
                    required
                    value={formData.shipping_address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: {
                          ...formData.shipping_address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal code</Label>
                  <Input
                    type="text"
                    id="postal_code"
                    required
                    value={formData.shipping_address.postal_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_address: {
                          ...formData.shipping_address,
                          postal_code: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-medium text-neutral-900">
                Payment method
              </h2>

              <RadioGroup
                value={formData.payment_method}
                onValueChange={(value: "cod" | "online") =>
                  setFormData({ ...formData, payment_method: value })
                }
                className="mt-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online">Online Payment</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-medium text-neutral-900">
                Additional notes
              </h2>

              <div className="mt-4">
                <textarea
                  rows={4}
                  id="notes"
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-neutral-900">
              Order summary
            </h2>

            <div className="mt-4 rounded-lg border border-neutral-200 bg-white shadow-sm">
              <ul className="divide-y divide-neutral-200">
                {state.items.map((item) => (
                  <li key={item.id} className="flex py-6 px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a
                              href={`/products/${item.productId}`}
                              className="font-medium text-neutral-700 hover:text-neutral-800"
                            >
                              {item.name}
                            </a>
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between">
                        <p className="text-sm text-neutral-500">
                          Qty {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-neutral-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    {formatPrice(state.total)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    Calculated at next step
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    Calculated at next step
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-neutral-900">
                    {formatPrice(state.total)}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Processing..." : "Confirm order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
