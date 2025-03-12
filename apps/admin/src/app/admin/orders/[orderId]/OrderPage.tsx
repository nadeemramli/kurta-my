"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { CommunicationPreferences } from "@/components/orders/CommunicationPreferences";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types/orders";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export function OrderPage({ params }: OrderPageProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("orders")
        .select("*, customer:customers(*)")
        .eq("id", params.orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [params.orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async (status: OrderStatus) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleUpdatePayment = async (payment_status: PaymentStatus) => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleUpdateCommunication = async (preferences: any) => {
    try {
      setLoading(true);
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
      setLoading(false);
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
        isLoading={loading}
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
