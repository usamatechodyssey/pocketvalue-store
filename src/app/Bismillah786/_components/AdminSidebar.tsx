// /app/admin/(dashboard)/_components/AdminSidebar.tsx - SIRF STYLING UPDATE

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";

const navItems = [
  { href: "/Bismillah786", label: "Dashboard", icon: LayoutDashboard },
  { href: "/Bismillah786/orders", label: "Orders", icon: ShoppingCart },
  { href: "/Bismillah786/products", label: "Products", icon: Package },
  { href: "/Bismillah786/users", label: "Users", icon: Users },
  { href: "/Bismillah786/categories", label: "categories", icon: Users },
  {
    href: "/Bismillah786/products/import",
    label: "Import Products",
    icon: Users,
  },
  {
    href: "/Bismillah786/categories/import",
    label: "Import Categories",
    icon: Users,
  },
  { href: "/Bismillah786/analytics", label: "analytics", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully.");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <aside className="w-64 flex-shrink-0 bg-surface-base border-r border-surface-border p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-brand-primary mb-8">
        PocketValue
      </h1>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-brand-primary/10 text-brand-primary" // Active state
                    : "text-text-secondary hover:bg-surface-input" // Default state
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-input"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
