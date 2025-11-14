// /src/app/components/product/pdp-sections/ProductMeta.tsx

"use client";

import { ShieldCheck, Truck, RotateCw } from "lucide-react";

export default function ProductMeta() {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
        <ShieldCheck size={16} className="text-green-500" />
        <span>Secure Payments</span>
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
        <Truck size={16} className="text-brand-secondary" />
        <span>Nationwide Delivery</span>
      </div>
      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
        <RotateCw size={16} className="text-brand-primary" />
        <span>7-Day Returns</span>
      </div>
    </div>
  );
}
