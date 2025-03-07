import { BarChart3, DollarSign, ShoppingCart, Users } from "lucide-react";

// Mock data for initial UI development
const stats = [
  {
    name: "Total Revenue",
    value: "RM 45,231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    name: "Orders",
    value: "356",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    value: "2,103",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    name: "Avg. Order Value",
    value: "RM 127",
    change: "-3.2%",
    trend: "down",
    icon: BarChart3,
  },
];

const recentOrders = [
  {
    id: "ORD001",
    customer: "Ahmad bin Abdullah",
    date: "2024-03-05",
    amount: "RM 250",
    status: "Completed",
  },
  {
    id: "ORD002",
    customer: "Sarah Lee",
    date: "2024-03-05",
    amount: "RM 180",
    status: "Processing",
  },
  {
    id: "ORD003",
    customer: "Raj Kumar",
    date: "2024-03-04",
    amount: "RM 320",
    status: "Completed",
  },
];

export default function RootPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
    </div>
  );
}
