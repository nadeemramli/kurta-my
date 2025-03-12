import { Metadata } from "next";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Order Details",
  description: "View and manage order details",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/admin/orders/" + params.orderId);
  }

  const { data: order, error } = await supabase
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

  if (error || !order) {
    redirect("/admin/orders");
  }

  return (
    <main className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage order #{order.id.slice(0, 8)}
        </p>
      </div>

      <OrderDetails order={order} isAdmin />
    </main>
  );
}
