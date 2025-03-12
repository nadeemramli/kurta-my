"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  id: string;
  product: {
    id: string;
    title: string;
    image: string;
  };
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Address {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Order {
  id: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  subtotal_amount: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderDetailsProps {
  order: Order;
  onCancel?: () => void;
}

export function OrderDetails({ order, onCancel }: OrderDetailsProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const canCancel =
    order.status === "pending" && order.payment_status === "pending";

  async function handleCancel() {
    try {
      setCancelling(true);
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setCancelDialogOpen(false);
      if (onCancel) onCancel();
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Order Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Order #{order.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <OrderStatusBadge status={order.status as any} />
            <PaymentStatusBadge status={order.payment_status as any} />
          </div>
        </div>

        {canCancel && (
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Order
            </Button>
          </div>
        )}
      </Card>

      {/* Order Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center">
              <div className="flex-1">
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.total_price)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.unit_price)} each
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal_amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping_amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatPrice(order.tax_amount)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </Card>

      {/* Shipping Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
        <div className="space-y-2">
          <p>{order.shipping_address.name}</p>
          <p>{order.shipping_address.address_line1}</p>
          {order.shipping_address.address_line2 && (
            <p>{order.shipping_address.address_line2}</p>
          )}
          <p>
            {order.shipping_address.city}, {order.shipping_address.state}{" "}
            {order.shipping_address.postal_code}
          </p>
          <p>{order.shipping_address.country}</p>
          <p className="text-sm text-muted-foreground">
            {order.shipping_address.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.shipping_address.email}
          </p>
        </div>
      </Card>

      {/* Additional Notes */}
      {order.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
          <p className="whitespace-pre-wrap">{order.notes}</p>
        </Card>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              disabled={cancelling}
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
