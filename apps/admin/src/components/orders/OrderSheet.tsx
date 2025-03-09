import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { OrderForm, OrderFormData } from "./OrderForm";
import { NewOrderWizard } from "./NewOrderWizard";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface OrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OrderSheet({ open, onOpenChange, onSuccess }: OrderSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  const handleOrderDetails = async (data: any) => {
    setOrderData(data);
  };

  const handleSubmit = async (customerData: OrderFormData) => {
    if (!orderData) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // First create or get customer
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .upsert({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: customerData.email,
          phone: customerData.phone,
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
          payment_method: orderData.payment_method,
          shipping_address: customerData.shipping_address,
          billing_address: customerData.billing_address,
          communication_channels: customerData.communication_channels,
          notes: customerData.notes,
          delivery_option:
            orderData.region === "peninsular" ? "standard" : "east_malaysia",
          total_amount: orderData.total,
          subtotal_amount: orderData.subtotal,
          tax_amount: orderData.tax,
          shipping_amount: orderData.delivery_cost,
          discount_amount: 0, // Will be handled by promotions system
          transaction_fee: orderData.transaction_fee,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      const orderItems = orderData.products.map((product: any) => ({
        order_id: order.id,
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.price,
        total_price: product.price * product.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product inventory
      for (const product of orderData.products) {
        await supabase.rpc("decrease_inventory", {
          p_product_id: product.id,
          p_quantity: product.quantity,
        });
      }

      toast.success("Order created successfully");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-3xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            Create a new order by following the steps below
          </SheetDescription>
        </SheetHeader>

        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-400">Error</h3>
                <div className="mt-2 text-sm text-red-400">{error}</div>
              </div>
            </div>
          </div>
        )}

        {!orderData ? (
          <NewOrderWizard
            onComplete={handleOrderDetails}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <OrderForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        )}
      </SheetContent>
    </Sheet>
  );
}
