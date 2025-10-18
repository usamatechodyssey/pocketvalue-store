"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/app/context/StateContext";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, totalPrice, shippingAddress, clearCart } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    if (!shippingAddress) {
      toast.error("Shipping address is missing.");
      router.push('/checkout');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout-cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress, cartItems, totalPrice }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order placed successfully!");
        clearCart(); // Order place hone ke baad cart khali kar do
        router.push(`/order-success/${data.orderId}`);
      } else {
        toast.error(data.message || "Something went wrong.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  if (!shippingAddress) {
    // Agar address na ho, to user ko wapis bhejo, lekin client-side per
    if(typeof window !== 'undefined') {
        router.replace('/checkout');
    }
    return null; // Render hone se pehle redirect ho jayega
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Shipping To</h2>
          <Link href="/checkout" className="text-sm text-brand-primary hover:underline flex items-center gap-1 font-semibold">
            <Edit3 size={14} /> Change
          </Link>
        </div>
        <div className="text-gray-800 dark:text-gray-200 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold">{shippingAddress.fullName}</p>
          <address className="text-sm text-gray-600 dark:text-gray-400 mt-1 not-italic">
            {shippingAddress.address}, {shippingAddress.area},<br />
            {shippingAddress.city}, {shippingAddress.province}
          </address>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Phone: {shippingAddress.phone}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Payment Method</h2>
        <div className="space-y-4">
          <div onClick={() => setPaymentMethod("cod")} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === "cod" ? "border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10" : "border-gray-300 dark:border-gray-600 hover:border-brand-primary/50"}`}>
            <div className="flex items-center">
              <div className="h-5 w-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-all "
                style={{borderColor: paymentMethod === 'cod' ? '#f97316' : '#d1d5db',
                        backgroundColor: paymentMethod === 'cod' ? '#f97316' : 'transparent'}}>
                 {paymentMethod === 'cod' && <div className="h-2 w-2 rounded-full bg-white"/>}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <Truck size={18} /> Cash on Delivery
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pay with cash when your order is delivered.</p>
              </div>
            </div>
          </div>
          <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-60">
            <div className="flex items-center">
                <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600"/>
                <div className="ml-4">
                    <h3 className="font-semibold flex items-center gap-2 text-gray-400 dark:text-gray-500">
                        <CreditCard size={18} /> Pay with Credit/Debit Card
                    </h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This option is temporarily unavailable.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <span>Place Order (COD)</span>
          )}
        </button>
      </div>
    </div>
  );
}