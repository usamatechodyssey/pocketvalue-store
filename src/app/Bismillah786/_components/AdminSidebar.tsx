"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  BarChart,
  Tags,
  Settings,
  Shield,
  Lock,
  Undo2,
} from "lucide-react";
import { toast } from "react-hot-toast";
// --- Navigation Structure (UPDATED with roles & new item) ---
const navGroups = [
  {
    title: "Store",
    items: [
      {
        href: "/Bismillah786",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["Super Admin", "Store Manager", "Content Editor"],
      },
      {
        href: "/Bismillah786/orders",
        label: "Orders",
        icon: ShoppingCart,
        roles: ["Super Admin", "Store Manager"],
      },
      // === YAHAN NAYA LINK ADD HUA HAI ===
      {
        href: "/Bismillah786/returns",
        label: "Returns",
        icon: Undo2, // Naya, behtar icon
        roles: ["Super Admin", "Store Manager"],
      },
      // ===================================
      {
        href: "/Bismillah786/products",
        label: "Products",
        icon: Package,
        roles: ["Super Admin", "Content Editor"],
      },
      {
        href: "/Bismillah786/categories",
        label: "Categories",
        icon: Tags,
        roles: ["Super Admin", "Content Editor"],
      },
      {
        href: "/Bismillah786/users",
        label: "Customers",
        icon: Users,
        roles: ["Super Admin", "Store Manager"],
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        href: "/Bismillah786/analytics",
        label: "Reports",
        icon: BarChart,
        roles: ["Super Admin"],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        href: "/Bismillah786/settings",
        label: "Store Settings",
        icon: Settings,
        roles: ["Super Admin"],
      },
      {
        href: "/Bismillah786/admins",
        label: "Manage Admins",
        icon: Shield,
        roles: ["Super Admin"],
      },
    ],
  },
];

// --- Reusable NavLink Component (No changes needed) ---
const NavLink = ({
  href,
  label,
  icon: Icon,
  isLocked,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isLocked: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    href === "/Bismillah786" ? pathname === href : pathname.startsWith(href);

  const commonClasses =
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors";

  if (isLocked) {
    return (
      <div
        className={`${commonClasses} text-gray-400 dark:text-gray-600 cursor-not-allowed relative`}
        title="You do not have permission to access this page."
      >
        <Icon size={18} />
        <span>{label}</span>
        <Lock
          size={12}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        />
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`${commonClasses} ${
        isActive
          ? "bg-brand-primary/10 text-brand-primary font-semibold"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

// --- Main Sidebar Component (REFACTORED FOR TYPE SAFETY) ---
export default function AdminSidebar() {
  const { data: session } = useSession();

  // --- YAHAN BEHTARI KI GAYI HAI ---
  // "as any" ko hata diya gaya hai. Hamari next-auth.d.ts file ki wajah se
  // TypeScript ab janta hai ke session.user.role mojood hai.
  const userRole = session?.user?.role;

  const handleLogout = async () => {
    toast.loading("Logging out...");
    await signOut({ callbackUrl: "/login" });
    toast.dismiss();
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full">
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/Bismillah786"
          className="text-2xl font-bold text-brand-primary"
        >
          PocketValue
        </Link>
      </div>

      <nav className="grow overflow-y-auto mt-6 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                // Logic abhi bhi waisa hi hai, lekin ab 'userRole' type-safe hai
                const hasPermission =
                  userRole && item.roles
                    ? item.roles.includes(userRole)
                    : false;

                return (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      isLocked={!hasPermission}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Type Safety (Rule #3):** `(session?.user as any)?.role` ko hata kar direct `session?.user?.role` istemal kiya gaya hai. Is se "as any" ka shortcut khatam ho gaya hai aur code 100% type-safe hai.
// - **Robust Logic:** `hasPermission` ke logic ko thora behtar banaya gaya hai. Yeh ab yaqeeni banata hai ke `userRole` mojood ho, uske baad hi `includes` function call kiya jaye, taake potential runtime errors se bacha ja sake.
