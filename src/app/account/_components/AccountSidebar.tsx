// /src/app/account/_components/AccountSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingBag,
  User as UserIcon,
  MapPin,
  LogOut,
  Loader2,
} from "lucide-react";

const sidebarNavItems = [
  { title: "Dashboard", href: "/account", icon: LayoutDashboard },
  { title: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { title: "My Profile", href: "/account/profile", icon: UserIcon },
  { title: "Address Book", href: "/account/addresses", icon: MapPin },
  { title: "Return", href: "/account/returns", icon: MapPin },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Loading state for user info
  if (status === "loading") {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex justify-center items-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* User Info Box */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
            {session?.user?.name || "Valued Customer"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {session?.user?.email}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 grow">
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => {
            // More robust check: also highlights child routes like /account/orders/[orderId]
            const isActive =
              item.href === "/account"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {/* Active state indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-primary rounded-r-full"></div>
                  )}
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
