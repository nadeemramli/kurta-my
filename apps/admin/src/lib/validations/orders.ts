import { z } from "zod";
import { malaysianStates } from "@/lib/constants";

export const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.enum(malaysianStates, {
    errorMap: () => ({ message: "Invalid state" }),
  }),
  postal_code: z.string().regex(/^\d{5}$/, "Invalid postal code"),
  country: z.literal("Malaysia"),
});

export const orderItemSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  variant_id: z.string().uuid("Invalid variant ID").optional(),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
  unit_price: z.number().positive("Unit price must be greater than 0"),
  total_price: z.number().positive("Total price must be greater than 0"),
});

export const communicationChannelsSchema = z.object({
  whatsapp: z.boolean(),
  email: z.boolean(),
  sms: z.boolean(),
}).refine(
  (data) => data.whatsapp || data.email || data.sms,
  "At least one communication channel must be selected"
);

export const createOrderSchema = z.object({
  customer: z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
  }),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  shipping_address: addressSchema,
  billing_address: addressSchema,
  payment_method: z.enum(["cod", "fpx", "card"]),
  notes: z.string().optional(),
  communication_channels: communicationChannelsSchema,
  calculation: z.object({
    subtotal_amount: z.number().positive(),
    tax_amount: z.number().min(0),
    shipping_amount: z.number().min(0),
    discount_amount: z.number().min(0),
    total_amount: z.number().positive(),
  }),
});

export const updateOrderSchema = z.object({
  status: z.enum([
    "draft",
    "pending",
    "processing",
    "completed",
    "cancelled",
    "returned",
    "refunded",
    "on_hold",
  ]),
  payment_status: z.enum([
    "pending",
    "processing",
    "succeeded",
    "failed",
    "refunded",
  ]),
  shipping_address: addressSchema.optional(),
  billing_address: addressSchema.optional(),
  notes: z.string().optional(),
  metadata: z.object({
    payment_id: z.string().optional(),
    payment_updated_at: z.string().optional(),
    tracking_number: z.string().optional(),
    shipping_provider: z.string().optional(),
    tags: z.array(z.string()).optional(),
    communication_channels: communicationChannelsSchema.optional(),
  }).optional(),
}); 