"use client";

import { useStateContext } from "@/app/context/StateContext";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function OrderSummary() {
  const { cartItems, totalPrice } = useStateContext();
  
  if(cartItems.length === 0) return null; // Agar cart khali ho to kuch na dikhayein

  return (
    <div className="w-full bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Order Summary
      </h2>
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-6 divide-y divide-gray-200 dark:divide-gray-700">
        {cartItems.map((item) => (
          <div key={item.cartItemId} className="flex items-start gap-4 pt-4 first:pt-0">
            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md">
              <Image
                src={urlFor(item.image).url()}
                alt={item.name}
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </div>
            <div className="flex-grow">
              <p className="font-medium text-sm text-gray-800 dark:text-gray-200 leading-tight line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span className="font-medium">
            Rs. {totalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Shipping</span>
          <span className="font-medium text-green-600 dark:text-green-500">FREE</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100">
          <span>Total</span>
          <span>Rs. {totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};