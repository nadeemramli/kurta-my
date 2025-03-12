import { OrderDetails } from "@/components/orders/OrderDetails";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/orders/" + params.orderId);
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `
    )
    .eq("id", params.orderId)
    .eq("customer_id", session.user.id)
    .single();

  if (error || !order) {
    redirect("/orders");
  }

  return (
    <main className="container max-w-5xl py-8">
      <OrderDetails order={order} />
    </main>
  );
}
