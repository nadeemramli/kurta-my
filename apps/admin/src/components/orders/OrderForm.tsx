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

interface Address {
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  shipping_address: Address;
  billing_address: Address;
  communication_channels: {
    whatsapp: boolean;
    email: boolean;
    sms: boolean;
  };
  notes?: string;
}

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  initialData?: Partial<OrderFormData>;
  isLoading?: boolean;
}

export function OrderForm({
  onSubmit,
  initialData,
  isLoading,
}: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    shipping_address: initialData?.shipping_address || {
      name: "",
      email: "",
      phone: "",
      address_line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Malaysia",
    },
    billing_address: initialData?.billing_address || {
      name: "",
      email: "",
      phone: "",
      address_line1: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Malaysia",
    },
    communication_channels: initialData?.communication_channels || {
      whatsapp: true,
      email: true,
      sms: false,
    },
    notes: initialData?.notes || "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  const handleInputChange = (
    field: keyof OrderFormData,
    value: string | boolean | object
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (
    type: "shipping" | "billing",
    field: keyof Address,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}_address`]: {
        ...prev[`${type}_address`],
        [field]: value,
      },
    }));

    if (type === "shipping" && sameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [field]: value,
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>
        </div>
      </Card>

      {/* Communication Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Communication Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="whatsapp"
              checked={formData.communication_channels.whatsapp}
              onCheckedChange={(checked) =>
                handleInputChange("communication_channels", {
                  ...formData.communication_channels,
                  whatsapp: checked,
                })
              }
            />
            <Label htmlFor="whatsapp">WhatsApp notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email_notifications"
              checked={formData.communication_channels.email}
              onCheckedChange={(checked) =>
                handleInputChange("communication_channels", {
                  ...formData.communication_channels,
                  email: checked,
                })
              }
            />
            <Label htmlFor="email_notifications">Email notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms"
              checked={formData.communication_channels.sms}
              onCheckedChange={(checked) =>
                handleInputChange("communication_channels", {
                  ...formData.communication_channels,
                  sms: checked,
                })
              }
            />
            <Label htmlFor="sms">SMS notifications</Label>
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shipping_name">Full Name</Label>
              <Input
                id="shipping_name"
                value={formData.shipping_address.name}
                onChange={(e) =>
                  handleAddressChange("shipping", "name", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_phone">Phone</Label>
              <Input
                id="shipping_phone"
                value={formData.shipping_address.phone}
                onChange={(e) =>
                  handleAddressChange("shipping", "phone", e.target.value)
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_email">Email</Label>
            <Input
              id="shipping_email"
              type="email"
              value={formData.shipping_address.email}
              onChange={(e) =>
                handleAddressChange("shipping", "email", e.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_address1">Address Line 1</Label>
            <Input
              id="shipping_address1"
              value={formData.shipping_address.address_line1}
              onChange={(e) =>
                handleAddressChange("shipping", "address_line1", e.target.value)
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_address2">Address Line 2 (Optional)</Label>
            <Input
              id="shipping_address2"
              value={formData.shipping_address.address_line2}
              onChange={(e) =>
                handleAddressChange("shipping", "address_line2", e.target.value)
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="shipping_city">City</Label>
              <Input
                id="shipping_city"
                value={formData.shipping_address.city}
                onChange={(e) =>
                  handleAddressChange("shipping", "city", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_state">State</Label>
              <Select
                value={formData.shipping_address.state}
                onValueChange={(value) =>
                  handleAddressChange("shipping", "state", value)
                }
              >
                <SelectTrigger id="shipping_state">
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
            <div className="space-y-2">
              <Label htmlFor="shipping_postal">Postal Code</Label>
              <Input
                id="shipping_postal"
                value={formData.shipping_address.postal_code}
                onChange={(e) =>
                  handleAddressChange("shipping", "postal_code", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Billing Address */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Billing Address</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same_as_shipping"
              checked={sameAsBilling}
              onCheckedChange={(checked) => {
                setSameAsBilling(!!checked);
                if (checked) {
                  setFormData((prev) => ({
                    ...prev,
                    billing_address: prev.shipping_address,
                  }));
                }
              }}
            />
            <Label htmlFor="same_as_shipping">Same as shipping</Label>
          </div>
        </div>

        {!sameAsBilling && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="billing_name">Full Name</Label>
                <Input
                  id="billing_name"
                  value={formData.billing_address.name}
                  onChange={(e) =>
                    handleAddressChange("billing", "name", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_phone">Phone</Label>
                <Input
                  id="billing_phone"
                  value={formData.billing_address.phone}
                  onChange={(e) =>
                    handleAddressChange("billing", "phone", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_email">Email</Label>
              <Input
                id="billing_email"
                type="email"
                value={formData.billing_address.email}
                onChange={(e) =>
                  handleAddressChange("billing", "email", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_address1">Address Line 1</Label>
              <Input
                id="billing_address1"
                value={formData.billing_address.address_line1}
                onChange={(e) =>
                  handleAddressChange(
                    "billing",
                    "address_line1",
                    e.target.value
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="billing_address2">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="billing_address2"
                value={formData.billing_address.address_line2}
                onChange={(e) =>
                  handleAddressChange(
                    "billing",
                    "address_line2",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="billing_city">City</Label>
                <Input
                  id="billing_city"
                  value={formData.billing_address.city}
                  onChange={(e) =>
                    handleAddressChange("billing", "city", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_state">State</Label>
                <Select
                  value={formData.billing_address.state}
                  onValueChange={(value) =>
                    handleAddressChange("billing", "state", value)
                  }
                >
                  <SelectTrigger id="billing_state">
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
              <div className="space-y-2">
                <Label htmlFor="billing_postal">Postal Code</Label>
                <Input
                  id="billing_postal"
                  value={formData.billing_address.postal_code}
                  onChange={(e) =>
                    handleAddressChange(
                      "billing",
                      "postal_code",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Order Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
        <div className="space-y-2">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Add any special instructions or notes for this order"
            className="h-32"
          />
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Order..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
}
