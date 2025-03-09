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
  LogOut,
  Menu,
  ChevronRight,
  BarChart,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  LineChart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@kurta-my/utils";
import { Logo } from "@/components/ui/logo";
import { useAdminAuth } from "@/components/auth/auth-context";

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
      { name: "Orders", href: "/admin/orders" },
      { name: "Conversion Flow", href: "/admin/orders/conversion-flow" },
      { name: "Analytics", href: "/admin/orders/analytics" },
    ],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    submenu: [
      { name: "Products", href: "/admin/products" },
      { name: "Collections", href: "/admin/products/collections" },
    ],
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    submenu: [
      { name: "Customers", href: "/admin/customers" },
      { name: "Segments", href: "/admin/customers/groups" },
    ],
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: FileText,
    submenu: [
      { name: "Posts", href: "/admin/blog/posts" },
      { name: "Taxonomies", href: "/admin/blog/taxonomies" },
    ],
  },
  {
    name: "Promotions",
    href: "/admin/promotions",
    icon: Tag,
    submenu: [
      { name: "Overview", href: "/admin/promotions" },
      { name: "Discounts", href: "/admin/promotions/discounts" },
      { name: "Coupons", href: "/admin/promotions/coupons" },
      { name: "Loyalty Program", href: "/admin/promotions/loyalty" },
      { name: "Referrals", href: "/admin/promotions/referrals" },
    ],
  },
  {
    name: "Performance",
    href: "/admin/performance",
    icon: LineChart,
    submenu: [
      { name: "Advertisement", href: "/admin/performance/advertisement" },
      { name: "Creative", href: "/admin/performance/creative" },
      { name: "Recurring", href: "/admin/performance/recurring" },
      { name: "Reports", href: "/admin/performance/reports" },
    ],
  },
];

function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/admin"
        className="flex items-center text-neutral-400 hover:text-neutral-200"
      >
        <Home className="h-4 w-4" />
      </Link>
      {paths.slice(1).map((path, index) => (
        <div key={path} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-neutral-500" />
          <Link
            href={`/admin/${paths.slice(1, index + 2).join("/")}`}
            className={cn(
              "capitalize hover:text-neutral-200",
              index === paths.length - 2
                ? "text-white font-medium"
                : "text-neutral-400"
            )}
          >
            {path}
          </Link>
        </div>
      ))}
    </div>
  );
}

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((current) =>
      current.includes(itemName)
        ? current.filter((name) => name !== itemName)
        : [...current, itemName]
    );
  };

  return (
    <div className="flex h-screen bg-neutral-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-neutral-800 bg-neutral-950 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          "lg:relative",
          isMobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo and Toggle */}
        <div className="flex h-16 shrink-0 items-center border-b border-neutral-800 px-4">
          {isCollapsed ? (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden h-10 w-10 items-center justify-center text-neutral-400 hover:text-white lg:flex"
            >
              <PanelLeftOpen className="h-6 w-6" />
            </button>
          ) : (
            <div className="flex w-full items-center justify-between">
              <Link href="/admin" className="flex items-center">
                <Logo size="sm" priority className="h-10 w-10 ml-2" />
              </Link>
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden h-10 w-10 items-center justify-center text-neutral-400 hover:text-white lg:flex"
              >
                <PanelLeftClose className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <nav
            className={cn(
              "flex-1 space-y-1 overflow-y-auto p-4",
              isCollapsed && "px-3"
            )}
          >
            {sidebarItems.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => !isCollapsed && toggleExpanded(item.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white",
                        pathname.startsWith(item.href) &&
                          "bg-neutral-900 text-white",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedItems.includes(item.name) && "rotate-180"
                          )}
                        />
                      )}
                    </button>
                    {!isCollapsed && expandedItems.includes(item.name) && (
                      <div className="mt-1 space-y-1 pl-10">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white",
                              pathname === subItem.href &&
                                "bg-neutral-900 text-white"
                            )}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white",
                      pathname === item.href && "bg-neutral-900 text-white",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="shrink-0 border-t border-neutral-800 p-4">
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed ? "flex-col-reverse" : "justify-between"
              )}
            >
              <div
                className={cn(
                  "flex min-w-0 items-center gap-3",
                  isCollapsed ? "flex-col" : "flex-1"
                )}
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-800" />
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-white">
                      {user?.email}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                      {user?.user_metadata?.role}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5",
                  isCollapsed ? "flex-col" : ""
                )}
              >
                <button
                  onClick={logout}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                </button>
                <Link
                  href="/admin/settings"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 border-b border-neutral-800 bg-neutral-950">
          <div className="flex h-full items-center px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-900 hover:text-white lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Breadcrumb />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
