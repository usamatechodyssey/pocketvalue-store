// app/components/layout/HeaderActions.tsx (FINAL & COMPLETE CODE)

"use client";

import Link from "next/link";
import { FiUser, FiHeart, FiShoppingCart } from "react-icons/fi";
import { useStateContext } from "@/app/context/StateContext";
import { useSession } from "next-auth/react";

export default function HeaderActions({ isMobile = false }) {
  const { totalQuantities, wishlistItems } = useStateContext();
  const { data: session, status } = useSession();
  const iconSize = 28; // Icon size for desktop/tablet

  // === MOBILE VIEW LOGIC ===
  if (isMobile) {
    return (
      <div className="flex items-center space-x-4">
        {/* Account Icon */}
        <Link
          href="/account"
          className="text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
          title="My Account"
        >
          <FiUser size={22} />
        </Link>

        {/* Wishlist Icon */}
        <Link
          href="/wishlist"
          className="relative text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
          title="Wishlist"
        >
          <FiHeart size={22} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </Link>

        {/* Cart Icon */}
        <Link
          href="/cart"
          className="relative text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
          title="Cart"
        >
          <FiShoppingCart size={22} />
          {totalQuantities > 0 && (
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {totalQuantities}
            </span>
          )}
        </Link>
      </div>
    );
  }

  // === DESKTOP & TABLET VIEW LOGIC ===
  return (

    <div className="flex items-center space-x-6">
      {/* === ACCOUNT SECTION (THE FIX IS HERE) === */}
      <Link
        href={status === "authenticated" ? "/account" : "/login"}
        className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors group"
      >
        {/* Icon hamesha nazar aayega */}
        <FiUser size={iconSize} />

        <div className="hidden lg:flex flex-col text-sm">
          <span className="font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Account
          </span>

          {/* Is span par ab sirf tooltip rahegi */}
          <span
            className="text-xs text-gray-500 leading-tight group-hover:text-orange-500"
            title={
              status === "authenticated"
                ? session?.user?.name || ""
                : "Hello, Sign in"
            }
          >
            {(() => {
              if (status === "authenticated" && session?.user?.name) {
                const firstName = session.user.name.split(" ")[0];
                // Yahan hum check kar rahe hain ke naam 10 haroof se lamba hai ya nahi
                return firstName.length > 10
                  ? `${firstName.substring(0, 10)}...` // Agar lamba hai to kaat kar ... laga do
                  : firstName; // Warna poora pehla naam dikha do
              }
              return "Hello, Sign in";
            })()}
          </span>
        </div>
      </Link>

      {/* === WISHLIST SECTION (No Changes) === */}
      <Link
        href="/wishlist"
        className="relative flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
      >
        <FiHeart size={iconSize} />
        <div className="hidden lg:flex flex-col text-sm">
          <span className="font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Wishlist
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            {wishlistItems.length} item(s)
          </span>
        </div>
      </Link>

      {/* === CART SECTION (No Changes) === */}
      <Link
        href="/cart"
        className="relative flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors pr-4"
      >
        <FiShoppingCart size={iconSize} />
        {totalQuantities > 0 && (
          <span className="absolute top-0 -right-1 text-xs bg-blue-500 text-white font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalQuantities}
          </span>
        )}
        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 hidden lg:inline">
          Cart
        </span>
      </Link>
    </div>
  );
}
