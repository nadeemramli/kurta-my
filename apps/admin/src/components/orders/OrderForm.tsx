import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { malaysianStates } from "@/lib/constants";

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  initialData?: Partial<OrderFormData>;
  isLoading?: boolean;
}

export interface OrderFormData {
  // Customer Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  // Billing Address
  billing_address: {
    first_name: string;
    last_name: string;
    country: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    email: string;
  };

  // Shipping Address
  shipping_address: {
    first_name: string;
    last_name: string;
    country: string;
    address_line1: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
    email: string;
  };

  // Communication Preferences
  communication_channels: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };

  // Order Notes
  notes?: string;

  // Payment Method
  payment_method: "fpx" | "card" | "cod";

  // Delivery Option (you can expand this based on your needs)
  delivery_option: string;
}

export function OrderForm({
  onSubmit,
  initialData,
  isLoading,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>(() => ({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    billing_address: {
      first_name: "",
      last_name: "",
      country: "Malaysia",
      address_line1: "",
      city: "",
      state: "",
      postal_code: "",
      phone: "",
      email: "",
    },
    shipping_address: {
      first_name: "",
      last_name: "",
      country: "Malaysia",
      address_line1: "",
      city: "",
      state: "",
      postal_code: "",
      phone: "",
      email: "",
    },
    communication_channels: {
      whatsapp: true,
      email: false,
      sms: false,
    },
    notes: "",
    payment_method: "fpx",
    delivery_option: "standard",
    ...initialData,
  }));

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleInputChange = (
    field: string,
    value: string | boolean,
    addressType?: "billing" | "shipping"
  ) => {
    if (addressType) {
      setFormData((prev) => ({
        ...prev,
        [`${addressType}_address`]: {
          ...prev[`${addressType}_address`],
          [field]: value,
        },
      }));

      // If billing is same as shipping, update billing too
      if (sameAsShipping && addressType === "shipping") {
        setFormData((prev) => ({
          ...prev,
          billing_address: {
            ...prev.billing_address,
            [field]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shipping_first_name">First Name</Label>
            <Input
              id="shipping_first_name"
              value={formData.shipping_address.first_name}
              onChange={(e) =>
                handleInputChange("first_name", e.target.value, "shipping")
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="shipping_last_name">Last Name</Label>
            <Input
              id="shipping_last_name"
              value={formData.shipping_address.last_name}
              onChange={(e) =>
                handleInputChange("last_name", e.target.value, "shipping")
              }
              required
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="shipping_address">Street Address</Label>
            <Input
              id="shipping_address"
              value={formData.shipping_address.address_line1}
              onChange={(e) =>
                handleInputChange("address_line1", e.target.value, "shipping")
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="shipping_city">Town / City</Label>
            <Input
              id="shipping_city"
              value={formData.shipping_address.city}
              onChange={(e) =>
                handleInputChange("city", e.target.value, "shipping")
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="shipping_state">State</Label>
            <Select
              value={formData.shipping_address.state}
              onValueChange={(value) =>
                handleInputChange("state", value, "shipping")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {malaysianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="shipping_postal_code">Postcode / ZIP</Label>
            <Input
              id="shipping_postal_code"
              value={formData.shipping_address.postal_code}
              onChange={(e) =>
                handleInputChange("postal_code", e.target.value, "shipping")
              }
              required
            />
          </div>
        </div>
      </Card>

      {/* Billing Address */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="same_as_shipping"
            checked={sameAsShipping}
            onCheckedChange={(checked: boolean) => setSameAsShipping(checked)}
          />
          <Label htmlFor="same_as_shipping">
            Billing address same as shipping
          </Label>
        </div>

        {!sameAsShipping && (
          <div className="grid grid-cols-2 gap-4">
            {/* Billing address fields (similar to shipping) */}
            {/* ... */}
          </div>
        )}
      </Card>

      {/* Communication Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Communication Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="whatsapp"
              checked={formData.communication_channels.whatsapp}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  communication_channels: {
                    ...prev.communication_channels,
                    whatsapp: checked,
                  },
                }))
              }
            />
            <Label htmlFor="whatsapp">WhatsApp</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="email_comm"
              checked={formData.communication_channels.email}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  communication_channels: {
                    ...prev.communication_channels,
                    email: checked,
                  },
                }))
              }
            />
            <Label htmlFor="email_comm">Email</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="sms"
              checked={formData.communication_channels.sms}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({
                  ...prev,
                  communication_channels: {
                    ...prev.communication_channels,
                    sms: checked,
                  },
                }))
              }
            />
            <Label htmlFor="sms">SMS</Label>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <RadioGroup
          value={formData.payment_method}
          onValueChange={(value: "fpx" | "card" | "cod") =>
            handleInputChange("payment_method", value)
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fpx" id="fpx" />
            <Label htmlFor="fpx">Online Banking (FPX)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Credit/Debit Card</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod">Cash on Delivery (COD)</Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Order Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div>
          <Label htmlFor="notes">Order Notes (optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Notes about your order, e.g. special notes for delivery"
            className="h-24"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
