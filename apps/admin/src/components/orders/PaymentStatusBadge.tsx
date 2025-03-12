import { Badge } from "@/components/ui/badge";

type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
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
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  processing: {
    label: "Processing",
    variant: "secondary",
  },
  succeeded: {
    label: "Paid",
    variant: "default",
  },
  failed: {
    label: "Failed",
    variant: "destructive",
  },
  refunded: {
    label: "Refunded",
    variant: "destructive",
  },
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
