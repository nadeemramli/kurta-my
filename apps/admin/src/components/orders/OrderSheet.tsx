import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { OrderForm, type OrderFormData } from "./OrderForm";
import { NewOrderWizard, type OrderData } from "./NewOrderWizard";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface OrderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = "products" | "customer";

export function OrderSheet({ open, onOpenChange, onSuccess }: OrderSheetProps) {
  const [step, setStep] = useState<Step>("products");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleProductStep = async (data: OrderData) => {
    setOrderData(data);
    setStep("customer");
  };

  const handleCustomerStep = async (data: OrderFormData) => {
    try {
      setLoading(true);

      if (!orderData) {
        throw new Error("No product data found");
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: null, // Will be created from form data
          items: orderData.products.map((product) => ({
            product_id: product.id,
            quantity: product.quantity,
            unit_price: product.price,
            total_price: product.quantity * product.price,
          })),
          shipping_address: data.shipping_address,
          billing_address: data.billing_address,
          payment_method: orderData.paymentMethod,
          notes: data.notes,
          communication_channels: data.communication_channels,
          customer: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
          },
          calculation: orderData.calculation,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      toast({
        title: "Order created successfully",
        description: "The order has been created and saved.",
      });

      // Reset state and close sheet
      setStep("products");
      setOrderData(null);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error creating order",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("products");
    setOrderData(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-3xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {step === "products" ? "New Order" : "Customer Information"}
          </SheetTitle>
          <SheetDescription>
            {step === "products"
              ? "Select products and configure order details"
              : "Enter customer and shipping information"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          {step === "products" ? (
            <NewOrderWizard
              onComplete={handleProductStep}
              onCancel={handleClose}
            />
          ) : (
            <div className="space-y-6">
              <OrderForm onSubmit={handleCustomerStep} isLoading={loading} />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setStep("products")}
                  disabled={loading}
                >
                  Back to Products
                </Button>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="rounded-lg bg-white p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
