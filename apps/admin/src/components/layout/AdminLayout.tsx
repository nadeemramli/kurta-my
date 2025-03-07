"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Tag,
  Users,
  Settings,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kurta-my/utils";
import LogoIcon from "@/components/icons/logo";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  submenu?: {
    name: string;
    href: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
    submenu: [
      { name: "All Orders", href: "/admin/orders" },
      { name: "Draft Orders", href: "/admin/orders/draft" },
      { name: "Order Analytics", href: "/admin/orders/analytics" },
      { name: "Conversion Flow", href: "/admin/orders/conversion-flow" },
    ],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    submenu: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
      { name: "Categories", href: "/admin/products/categories" },
    ],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    submenu: [
      { name: "All Customers", href: "/admin/customers" },
      { name: "Customer Groups", href: "/admin/customers/groups" },
    ],
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    submenu: [
      { name: "Pages", href: "/admin/content/pages" },
      { name: "Blog Posts", href: "/admin/blog/posts" },
      { name: "Categories", href: "/admin/blog/categories" },
      { name: "Tags", href: "/admin/blog/tags" },
      { name: "Media Library", href: "/admin/content/media" },
    ],
  },
  {
    name: "Promotions",
    href: "/admin/promotions",
    icon: Tag,
    submenu: [
      { name: "All Promotions", href: "/admin/promotions" },
      { name: "Discounts", href: "/admin/promotions/discounts" },
      { name: "Coupons", href: "/admin/promotions/coupons" },
    ],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: LayoutDashboard,
    submenu: [
      { name: "Overview", href: "/admin/analytics" },
      { name: "Sales", href: "/admin/analytics/sales" },
      { name: "Traffic", href: "/admin/analytics/traffic" },
      { name: "Customers", href: "/admin/analytics/customers" },
    ],
  },
];

function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-sm">
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;

        return (
          <div key={path} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            <Link
              href={href}
              className={cn(
                "capitalize hover:text-blue-600",
                isLast ? "text-gray-900 font-medium" : "text-gray-500"
              )}
            >
              {path}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((current) =>
      current.includes(itemName)
        ? current.filter((name) => name !== itemName)
        : [...current, itemName]
    );
  };

  return (
    <div className={cn("min-h-screen bg-gray-100", isDarkMode && "dark")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-900",
          isSidebarOpen && "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <LogoIcon className="h-8 w-8" />
            <span className="text-xl font-semibold dark:text-white">Kurta</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          >
            <X className="h-6 w-6 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex h-[calc(100vh-4rem)] flex-col justify-between">
          <nav className="overflow-y-auto p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.name}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                          pathname.startsWith(item.href) &&
                            "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500"
                        )}
                      >
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5" />
                          <span className="ml-3">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.name) && "rotate-180"
                          )}
                        />
                      </button>
                      {expandedItems.includes(item.name) && (
                        <ul className="mt-1 space-y-1 pl-11">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                                  pathname === subItem.href &&
                                    "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500"
                                )}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",
                        pathname === item.href &&
                          "bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-500"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div>
                <div className="font-medium dark:text-white">
                  admin@kurta.com
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/settings"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <button className="flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all",
          isSidebarOpen ? "lg:ml-64" : ""
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-16 items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
              >
                <Menu className="h-6 w-6 dark:text-gray-400" />
              </button>
              <Breadcrumb />
            </div>
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 dark:bg-gray-900">{children}</main>
      </div>
    </div>
  );
}
