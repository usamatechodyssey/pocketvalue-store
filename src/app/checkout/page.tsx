// /src/app/checkout/page.tsx

import type { Metadata } from "next";
import CheckoutForm from "./_components/CheckoutForm"; // Hamara naya, smart client component

// Ab metadata export bilkul theek kaam karega
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// === Main Shipping Page (SERVER COMPONENT) ===
export default function ShippingPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Shipping Information
      </h1>

      {/* Tamam complex logic ab is client component ke andar hai */}
      <CheckoutForm />
    </div>
  );
}