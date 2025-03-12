import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items: Array<{
    id: string;
    product: {
      title: string;
    };
    quantity: number;
  }>;
}

interface OrderListProps {
  initialOrders?: Order[];
}

export function OrderList({ initialOrders = [] }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [status]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "all") {
        params.append("status", status);
      }

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No orders found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Orders</h2>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order placed {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Order #{order.id.slice(0, 8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {formatPrice(order.total_amount)}
                </p>
                <div className="mt-1 space-x-2">
                  <OrderStatusBadge status={order.status as any} />
                  <PaymentStatusBadge status={order.payment_status as any} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium">Items</p>
              <ul className="mt-2 space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="text-sm">
                    {item.quantity}x {item.product.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" className="w-full">
                  View Order Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
