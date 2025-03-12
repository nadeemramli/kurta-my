import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderItem {
  id: string;
  product: {
    title: string;
  };
  quantity: number;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  customer: Customer;
}

interface OrderListProps {
  initialOrders?: Order[];
}

export function OrderList({ initialOrders = [] }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [status, search]);

  async function fetchOrders() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== "all") {
        params.append("status", status);
      }
      if (search) {
        params.append("search", search);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="returned">Returned</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Link href="/admin/orders/new">
          <Button>New Order</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    Order #{order.id.slice(0, 8)}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
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

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {order.customer.first_name} {order.customer.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} items
                  </p>
                  <ul className="mt-1 text-sm text-muted-foreground">
                    {order.items.slice(0, 2).map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.product.title}
                      </li>
                    ))}
                    {order.items.length > 2 && (
                      <li>+{order.items.length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
