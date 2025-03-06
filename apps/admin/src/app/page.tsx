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

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`rounded-full p-2 ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p
              className={`mt-4 text-sm ${
                stat.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Orders
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {order.amount}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
