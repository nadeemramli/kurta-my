import { Badge } from "@/components/ui/badge";

type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const statusConfig: Record<
  PaymentStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Pending", variant: "secondary" },
  processing: { label: "Processing", variant: "outline" },
  completed: { label: "Paid", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
  refunded: { label: "Refunded", variant: "destructive" },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
