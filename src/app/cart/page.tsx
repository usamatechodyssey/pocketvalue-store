"use client";

import { useStateContext } from "@/app/context/StateContext";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export default function CartPage() {
  const {
    cartItems,
    totalPrice,
    totalQuantities,
    onRemove,
    toggleCartItemQuantity,
  } = useStateContext();

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-md mx-auto text-center p-8 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <ShoppingCart
            size={56}
            className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
            strokeWidth={1.5}
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything yet. Let's find something you'll love!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-transform transform hover:scale-105"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  // Main Cart View
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            My Shopping Cart
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 lg:mt-0">
            You have{" "}
            <span className="font-bold text-brand-primary">
              {totalQuantities} {totalQuantities > 1 ? "items" : "item"}
            </span>{" "}
            in your cart.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Product List Section */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {/* FUTURE-PROOF: Added max-height and scroll for many items */}
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-start gap-4 p-4 sm:p-6">
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={urlFor(item.image).url()}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 96px, 112px"
                        className="object-contain p-2"
                      />
                    </div>
                  </Link>

                  <div className="flex-grow flex flex-col justify-between h-full">
                    <div>
                      <Link href={`/product/${item.slug}`} className="font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-primary leading-tight line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Unit Price: Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3 bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 w-fit">
                      <button onClick={() => toggleCartItemQuantity(item.cartItemId, "dec")} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-400" aria-label="Decrease quantity">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold w-8 text-center text-sm text-gray-800 dark:text-gray-200">{item.quantity}</span>
                      <button onClick={() => toggleCartItemQuantity(item.cartItemId, "inc")} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-400" aria-label="Increase quantity">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end justify-between h-full flex-shrink-0 ml-4">
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => onRemove(item)} className="text-gray-500 hover:text-brand-danger mt-auto transition-colors" aria-label={`Remove ${item.name}`}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm sticky top-24 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal ({totalQuantities} items)</span>
                  <span className="font-medium">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600 dark:text-green-500">FREE</span>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100">
                <span>Grand Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="mt-6">
                <Link href="/checkout/" className="block w-full">
                  <button
                    className="w-full py-3.5 bg-brand-primary text-text-on-accent font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                    disabled={cartItems.length === 0}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}