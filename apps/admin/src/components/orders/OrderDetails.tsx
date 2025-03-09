import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types/orders";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (status: OrderStatus) => void;
  onUpdatePayment: (status: PaymentStatus) => void;
  isLoading?: boolean;
}

const statusColors: Record<OrderStatus, string> = {
  draft: "bg-gray-500",
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  failed: "bg-red-500",
};

export function OrderDetails({
  order,
  onUpdateStatus,
  onUpdatePayment,
  isLoading,
}: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h2>
          <p className="text-gray-500">
            Created on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[order.status]}>
            {order.status.toUpperCase()}
          </Badge>
          <Badge className={paymentStatusColors[order.payment_status]}>
            {order.payment_status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {order.customer.first_name} {order.customer.last_name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {order.customer.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {order.customer.phone}
            </p>
          </div>
        </Card>

        {/* Communication Preferences */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Communication Preferences
          </h3>
          <div className="space-y-2">
            {order.communication_channels?.whatsapp && (
              <p>✓ WhatsApp notifications enabled</p>
            )}
            {order.communication_channels?.email && (
              <p>✓ Email notifications enabled</p>
            )}
            {order.communication_channels?.sms && (
              <p>✓ SMS notifications enabled</p>
            )}
          </div>
        </Card>

        {/* Shipping Address */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="space-y-2">
            <p>{order.shipping_address.address_line1}</p>
            <p>
              {order.shipping_address.city}, {order.shipping_address.state}{" "}
              {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
          </div>
        </Card>

        {/* Billing Address */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
          <div className="space-y-2">
            <p>{order.billing_address.address_line1}</p>
            <p>
              {order.billing_address.city}, {order.billing_address.state}{" "}
              {order.billing_address.postal_code}
            </p>
            <p>{order.billing_address.country}</p>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b"
            >
              <div>
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
              </div>
              <div className="text-right">
                <p>
                  {item.quantity} × {formatCurrency(item.unit_price)}
                </p>
                <p className="font-medium">
                  {formatCurrency(item.total_price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Totals */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{formatCurrency(order.subtotal_amount)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping</p>
            <p>{formatCurrency(order.shipping_amount)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>{formatCurrency(order.tax_amount)}</p>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <p>Discount</p>
              <p>-{formatCurrency(order.discount_amount)}</p>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <p>Total</p>
            <p>{formatCurrency(order.total_amount)}</p>
          </div>
        </div>
      </Card>

      {/* Order Notes */}
      {order.notes && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
          <p className="whitespace-pre-wrap">{order.notes}</p>
        </Card>
      )}

      {/* Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Actions</h3>
        <div className="flex gap-4">
          {order.status !== "completed" && (
            <Button
              onClick={() => onUpdateStatus("completed")}
              disabled={isLoading}
            >
              Mark as Completed
            </Button>
          )}
          {order.status !== "cancelled" && (
            <Button
              variant="destructive"
              onClick={() => onUpdateStatus("cancelled")}
              disabled={isLoading}
            >
              Cancel Order
            </Button>
          )}
          {order.payment_status === "pending" && (
            <Button
              variant="outline"
              onClick={() => onUpdatePayment("paid")}
              disabled={isLoading}
            >
              Mark as Paid
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
