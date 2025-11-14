// /src/app/cart/CartClient.tsx

"use client";

import { useStateContext } from "@/app/context/StateContext";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

// METADATA EXPORT HAS BEEN REMOVED FROM THIS FILE

export default function CartClient() { // Renamed from CartPage to CartClient
  const { cartItems, totalQuantities } = useStateContext();

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">My Shopping Cart</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 lg:mt-0">
              You have{" "}
              <span className="font-bold text-brand-primary">
                {totalQuantities} {totalQuantities > 1 ? "items" : "item"}
              </span>{" "}
              in your cart.
            </p>
          </div>
        </div>

        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </div>
          </div>
          <CartSummary />
        </div>
      </div>
    </main>
  );
}