"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { OrderList } from "@/components/orders/OrderList";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

interface Order {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  shipping_address: {
    name: string;
    email: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?redirect=/orders");
  }

  const { data: orders } = await supabase
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
    .eq("customer_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="container max-w-5xl py-8">
      <OrderList initialOrders={orders || []} />
    </main>
  );
}
