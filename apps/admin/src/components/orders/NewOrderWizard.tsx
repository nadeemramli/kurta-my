import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  sku: string;
  inventory_quantity: number;
}

interface OrderCalculation {
  subtotal: number;
  tax: number;
  transaction_fee: number;
  delivery_cost: number;
  total: number;
}

interface NewOrderWizardProps {
  onComplete: (orderData: any) => void;
  onCancel: () => void;
}

const TRANSACTION_FEE = 1; // RM1
const TAX_RATE = 0.06; // 6%

const DELIVERY_COSTS = {
  cod: {
    peninsular: 10,
    eastMalaysia: 15,
  },
  postage: {
    peninsular: 8,
    eastMalaysia: 15,
  },
};

export function NewOrderWizard({ onComplete, onCancel }: NewOrderWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Form state
  const [selectedProducts, setSelectedProducts] = useState<
    {
      id: string;
      quantity: number;
      price: number;
    }[]
  >([]);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">(
    "online"
  );
  const [region, setRegion] = useState<"peninsular" | "eastMalaysia">(
    "peninsular"
  );
  const [calculation, setCalculation] = useState<OrderCalculation>({
    subtotal: 0,
    tax: 0,
    transaction_fee: TRANSACTION_FEE,
    delivery_cost: 0,
    total: 0,
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Recalculate totals when relevant values change
  useEffect(() => {
    calculateTotals();
  }, [selectedProducts, paymentMethod, region]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .gt("inventory_quantity", 0);

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function calculateTotals() {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const tax = subtotal * TAX_RATE;
    const deliveryCost =
      paymentMethod === "cod"
        ? DELIVERY_COSTS.cod[region]
        : DELIVERY_COSTS.postage[region];

    setCalculation({
      subtotal,
      tax,
      transaction_fee: TRANSACTION_FEE,
      delivery_cost: deliveryCost,
      total: subtotal + tax + TRANSACTION_FEE + deliveryCost,
    });
  }

  function handleProductSelect(productId: string, quantity: number) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === productId);
      if (existing) {
        return prev.map((p) => (p.id === productId ? { ...p, quantity } : p));
      }
      return [...prev, { id: productId, quantity, price: product.price }];
    });
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Select Products</h2>
            {products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-neutral-400">No products available.</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Please create some products first.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-sm text-neutral-400">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">
                          RM {product.price.toFixed(2)}
                        </p>
                        <Input
                          type="number"
                          min="0"
                          max={product.inventory_quantity}
                          className="w-20"
                          value={
                            selectedProducts.find((p) => p.id === product.id)
                              ?.quantity || 0
                          }
                          onChange={(e) =>
                            handleProductSelect(
                              product.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Order Details</h2>
            <div className="space-y-4">
              <div>
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: "cod" | "online") =>
                    setPaymentMethod(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Banking/Card</SelectItem>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Region</Label>
                <Select
                  value={region}
                  onValueChange={(value: "peninsular" | "eastMalaysia") =>
                    setRegion(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peninsular">
                      Peninsular Malaysia
                    </SelectItem>
                    <SelectItem value="eastMalaysia">Sabah/Sarawak</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Promo Code (Optional)</Label>
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                />
              </div>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>RM {calculation.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (6%)</span>
                    <span>RM {calculation.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Fee</span>
                    <span>RM {calculation.transaction_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Cost</span>
                    <span>RM {calculation.delivery_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>RM {calculation.total.toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  function handleNext() {
    if (step === 1 && selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (step === 2) {
      // Prepare final order data
      const orderData = {
        products: selectedProducts,
        payment_method: paymentMethod,
        region,
        promo_code: promoCode || null,
        ...calculation,
      };
      onComplete(orderData);
      return;
    }

    setStep(step + 1);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-400">Error</h3>
            <div className="mt-2 text-sm text-red-400">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderStep()}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Button onClick={handleNext}>
          {step === 2 ? "Continue to Customer Details" : "Next"}
        </Button>
      </div>
    </div>
  );
}
