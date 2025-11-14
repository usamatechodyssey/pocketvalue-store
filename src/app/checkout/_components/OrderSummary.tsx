"use client";

import { useState, useTransition } from "react";
import { useStateContext } from "@/app/context/StateContext";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Loader2, Tag, X } from "lucide-react";
import { toast } from "react-hot-toast";

const inputStyles =
  "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition duration-200 sm:text-sm";

export default function OrderSummary() {
  const {
    cartItems,
    subtotal,
    shippingDetails,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
  } = useStateContext();

  const [couponCode, setCouponCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    startTransition(async () => {
      await applyCoupon(couponCode);
      setCouponCode("");
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-center text-sm text-gray-500 py-10">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Order Summary
      </h2>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 -mr-2 divide-y divide-gray-200 dark:divide-gray-700">
        {cartItems.map((item) => (
          <div
            key={item.cartItemId}
            className="flex items-start gap-4 pt-4 first:pt-0"
          >
            <div className="relative w-20 h-20 shrink-0 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
              {item.image && (
                <Image
                  src={urlFor(item.image).width(160).height(160).url()}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              )}
            </div>
            <div className="grow">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Qty: {item.quantity}
              </p>
              <p className="font-medium text-brand-primary text-sm mt-1">
                Rs. {item.price.toLocaleString()}
              </p>
            </div>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-base shrink-0">
              Rs. {(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4">
        {appliedCoupon ? (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Coupon Applied
            </label>
            <div className="mt-2 flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-300">
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span className="font-bold">{appliedCoupon.code}</span>
              </div>
              <button
                onClick={removeCoupon}
                className="p-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800/50"
                aria-label="Remove coupon"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <label
              htmlFor="coupon"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Have a discount code?
            </label>
            <div className="flex gap-2">
              <div className="relative grow">
                <Tag
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  size={16}
                />
                <input
                  id="coupon"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  disabled={isPending}
                  className={`${inputStyles} pl-10`}
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isPending || !couponCode}
                className="px-5 py-2 bg-brand-primary text-white text-sm font-bold rounded-md hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3 text-base">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-500">
            <span>Discount</span>
            <span className="font-medium">
              - Rs. {discountAmount.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Shipping Fee</span>
          {shippingDetails ? (
            <span
              className={`font-semibold ${
                shippingDetails.isFree || appliedCoupon?.type === "freeShipping"
                  ? "text-green-600 dark:text-green-500"
                  : ""
              }`}
            >
              {appliedCoupon?.type === "freeShipping"
                ? "FREE"
                : shippingDetails.displayText}
            </span>
          ) : (
            <Loader2 size={16} className="animate-spin" />
          )}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 flex justify-between font-bold text-xl text-gray-900 dark:text-gray-100">
          <span>Total Payable</span>
          {shippingDetails ? (
            <span>Rs. {grandTotal.toLocaleString()}</span>
          ) : (
            <Loader2 size={20} className="animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
}