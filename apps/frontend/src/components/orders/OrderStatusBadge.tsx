import { Badge } from "@/components/ui/badge";

type OrderStatus =
  | "draft"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "returned"
  | "refunded"
  | "on_hold";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  draft: { label: "Draft", variant: "outline" },
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "default" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  returned: { label: "Returned", variant: "destructive" },
  refunded: { label: "Refunded", variant: "destructive" },
  on_hold: { label: "On Hold", variant: "outline" },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
