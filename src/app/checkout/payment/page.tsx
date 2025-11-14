// /src/app/checkout/payment/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/app/context/StateContext";
import { toastError } from "@/app/_components/shared/CustomToasts";
import { Loader2, ShieldCheck } from "lucide-react";

// --- NAYE IMPORTS ---
// Chotay, focused components ko import karein
import ShippingSummary from "./_components/ShippingSummary";
import PaymentMethodSelector from "./_components/PaymentMethodSelector";

// === Main Component (REFACTORED & SIMPLIFIED) ===
export default function PaymentPage() {
  const router = useRouter();
  const { cartItems, grandTotal, shippingAddress, clearCart, appliedCoupon } =
    useStateContext();

  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Yeh useEffects ahtiyati tadabeer (safeguards) ke liye zaroori hain
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!shippingAddress) {
        router.replace("/checkout");
      } else if (
        cartItems.length === 0 &&
        !window.location.pathname.startsWith("/order-success")
      ) {
        router.replace("/cart");
      }
    }
  }, [shippingAddress, cartItems, router]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !selectedGateway) {
      toastError("Please select a payment method.");
      return;
    }
    setIsProcessing(true);
    let orderId = ""; // Order ID ko yahan store karein

    try {
      // Step 1: Order create karein
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress,
          cartItems,
          totalPrice: grandTotal,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData.message || "Failed to create order.");

      orderId = orderData.orderId;

      // Step 2: Payment process shuru karein
      const paymentRes = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, gatewayKey: selectedGateway }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok)
        throw new Error(paymentData.message || "Payment initiation failed.");

      // Step 3: Response ke mutabiq action lein
      if (paymentData.redirectUrl) {
        // External gateway par redirect karein
        clearCart();
        window.location.href = paymentData.redirectUrl;
      } else if (paymentData.success) {
        // Internal gateways (COD, Bank Transfer) ke liye verify karein
        const verifyRes = await fetch(
          `/api/payment/verify/${selectedGateway}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, ...paymentData.data }),
          }
        );
        if (verifyRes.ok && verifyRes.redirected) {
          clearCart();
          window.location.href = verifyRes.url; // Success page par redirect
        } else {
          const errorData = await verifyRes.json();
          throw new Error(
            errorData.message || "Failed to finalize your order."
          );
        }
      } else {
        throw new Error("An unknown error occurred during payment initiation.");
      }
    } catch (error: any) {
      toastError(
        error.message || "An unexpected error occurred.",
        "Order Failed"
      );
      setIsProcessing(false);
    }
  };

  // Loading state jab tak ke address ya cart load na ho jaye
  if (!shippingAddress || cartItems.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[300px]">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Shipping Summary Component */}
      <ShippingSummary />

      {/* 2. Payment Method Selector Component */}
      <PaymentMethodSelector
        selectedGateway={selectedGateway}
        onGatewaySelect={setSelectedGateway}
      />

      {/* 3. Final Action Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <ShieldCheck size={16} />
          <span>Secure SSL Encrypted Payment</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !selectedGateway}
          className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white font-bold text-lg rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-gray-400"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            `Pay Rs. ${grandTotal.toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Architectural Improvement (Rule #5):** Yeh component ab ek saaf suthra "orchestrator" hai. Isne tamam UI logic ko `ShippingSummary` aur `PaymentMethodSelector` components ko de diya hai.
// - **Code Simplification:** Component ka size bohot chota ho gaya hai. Iski zimmedariyan ab wazeh hain: page ki hifazat karna (redirects), state (selectedGateway, isProcessing) manage karna, aur `handlePlaceOrder` ke ahem action ko trigger karna.
// - **Improved Maintainability:** Ab agar aapko shipping summary ya payment list ke UI mein koi tabdeeli karni hai, to aapko is file ko cherne ki zaroorat nahi. Aap direct `ShippingSummary.tsx` ya `PaymentMethodSelector.tsx` mein ja kar kaam kar sakte hain.
