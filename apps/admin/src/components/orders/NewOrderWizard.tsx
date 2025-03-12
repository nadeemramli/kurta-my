import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Search, Plus, Minus, Loader2 } from "lucide-react";

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

export interface OrderData {
  products: {
    id: string;
    quantity: number;
    price: number;
    title: string;
  }[];
  promoCode?: string;
  paymentMethod: "cod" | "online";
  region: "peninsular" | "eastMalaysia";
  calculation: OrderCalculation;
}

interface NewOrderWizardProps {
  onComplete: (orderData: OrderData) => void;
  onCancel: () => void;
}

export function NewOrderWizard({ onComplete, onCancel }: NewOrderWizardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { product: Product; quantity: number }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [region, setRegion] = useState<"peninsular" | "eastMalaysia">(
    "peninsular"
  );
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Constants for calculations
  const TAX_RATE = 0.06; // 6% SST
  const TRANSACTION_FEE_RATE = 0.02; // 2% for online payments
  const DELIVERY_RATES = {
    peninsular: {
      base: 10,
      additional: 5,
    },
    eastMalaysia: {
      base: 15,
      additional: 8,
    },
  };

  // Search products
  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, sku, inventory_quantity")
        .ilike("title", `%${query}%`)
        .limit(10);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle product selection
  const addProduct = (product: Product) => {
    if (selectedProducts.some((p) => p.product.id === product.id)) return;
    setSelectedProducts([...selectedProducts, { product, quantity: 1 }]);
    setProducts([]);
    setSearchQuery("");
  };

  // Handle quantity changes
  const updateQuantity = (productId: string, change: number) => {
    setSelectedProducts(
      selectedProducts.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove product
  const removeProduct = (productId: string) => {
    setSelectedProducts(
      selectedProducts.filter((item) => item.product.id !== productId)
    );
  };

  // Calculate order totals
  const calculateOrder = (): OrderCalculation => {
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const tax = subtotal * TAX_RATE;
    const transactionFee =
      paymentMethod === "online" ? subtotal * TRANSACTION_FEE_RATE : 0;

    const rates = DELIVERY_RATES[region];
    const itemCount = selectedProducts.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const deliveryCost =
      rates.base + Math.max(0, itemCount - 1) * rates.additional;

    const total = subtotal + tax + transactionFee + deliveryCost;

    return {
      subtotal,
      tax,
      transaction_fee: transactionFee,
      delivery_cost: deliveryCost,
      total,
    };
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedProducts.length === 0) return;

    const calculation = calculateOrder();
    const orderData: OrderData = {
      products: selectedProducts.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        title: item.product.title,
      })),
      paymentMethod,
      region,
      calculation,
    };

    onComplete(orderData);
  };

  return (
    <div className="space-y-6">
      {/* Product Search */}
      <div className="space-y-4">
        <Label>Search Products</Label>
        <div className="relative">
          <Input
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) searchProducts(e.target.value);
            }}
          />
          {loading && (
            <div className="absolute right-2 top-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Search Results */}
        {products.length > 0 && (
          <Card className="absolute z-10 w-full max-h-60 overflow-auto p-2">
            {products.map((product) => (
              <button
                key={product.id}
                className="w-full text-left px-4 py-2 hover:bg-accent rounded-md"
                onClick={() => addProduct(product)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  </div>
                  <p className="font-medium">RM {product.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </Card>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Selected Products</h3>
          <div className="space-y-4">
            {selectedProducts.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">
                    RM {item.product.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeProduct(item.product.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Order Settings */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={paymentMethod}
            onValueChange={(value: "cod" | "online") => setPaymentMethod(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
              <SelectItem value="online">Online Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Delivery Region</Label>
          <Select
            value={region}
            onValueChange={(value: "peninsular" | "eastMalaysia") =>
              setRegion(value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="peninsular">Peninsular Malaysia</SelectItem>
              <SelectItem value="eastMalaysia">East Malaysia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Summary */}
      {selectedProducts.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>RM {calculateOrder().subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (6%)</span>
              <span>RM {calculateOrder().tax.toFixed(2)}</span>
            </div>
            {paymentMethod === "online" && (
              <div className="flex justify-between">
                <span>Transaction Fee (2%)</span>
                <span>RM {calculateOrder().transaction_fee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>RM {calculateOrder().delivery_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>RM {calculateOrder().total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={selectedProducts.length === 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}
