"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CommunicationPreferences } from "@/components/orders/CommunicationPreferences";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OrderPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  async function fetchOrder() {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          customer:customers(*),
          items:order_items(
            *,
            product:products(*)
          )
        `
        )
        .eq("id", params.orderId)
        .single();

      if (error) throw error;
      setOrder(data as Order);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to fetch order details");
    }
  }

  const handleUpdateStatus = async (status: OrderStatus) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", params.orderId);

      if (error) throw error;

      await fetchOrder();
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePayment = async (payment_status: PaymentStatus) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("orders")
        .update({ payment_status })
        .eq("id", params.orderId);

      if (error) throw error;

      await fetchOrder();
      toast.success("Payment status updated");
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCommunication = async (preferences: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("orders")
        .update({ communication_channels: preferences })
        .eq("id", params.orderId);

      if (error) throw error;

      await fetchOrder();
      toast.success("Communication preferences updated");
    } catch (error) {
      console.error("Error updating communication preferences:", error);
      toast.error("Failed to update communication preferences");
    } finally {
      setIsLoading(false);
    }
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <OrderDetails
        order={order}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePayment={handleUpdatePayment}
        isLoading={isLoading}
      />

      <CommunicationPreferences
        orderId={order.id}
        initialPreferences={order.communication_channels}
        hasPhone={!!order.shipping_address.phone}
        hasEmail={!!order.shipping_address.email}
        onUpdate={handleUpdateCommunication}
      />
    </div>
  );
}
