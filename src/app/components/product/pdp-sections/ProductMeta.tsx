// // /src/app/components/product/pdp-sections/ProductMeta.tsx

// "use client";

// import { ShieldCheck, Truck, RotateCw } from "lucide-react";

// export default function ProductMeta() {
//   return (
//     <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
//       <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//         <ShieldCheck size={16} className="text-green-500" />
//         <span>Secure Payments</span>
//       </div>
//       <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//         <Truck size={16} className="text-brand-secondary" />
//         <span>Nationwide Delivery</span>
//       </div>
//       <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//         <RotateCw size={16} className="text-brand-primary" />
//         <span>7-Day Returns</span>
//       </div>
//     </div>
//   );
// }
"use client";

import { ShieldCheck, Truck, RotateCw, Headphones } from "lucide-react";

const BENEFITS = [
    { icon: ShieldCheck, title: "100% Authentic", desc: "Original products guaranteed", color: "text-green-500" },
    { icon: Truck, title: "Fast Delivery", desc: "Shipping across Pakistan", color: "text-blue-500" },
    { icon: RotateCw, title: "Easy Returns", desc: "7-day replacement policy", color: "text-orange-500" },
    { icon: Headphones, title: "24/7 Support", desc: "We are here to help", color: "text-purple-500" },
];

export default function ProductMeta() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
      
      {/* GRID LAYOUT */}
      <div className="grid grid-cols-2 gap-4">
        {BENEFITS.map((benefit, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <benefit.icon size={24} className={`mb-2 ${benefit.color}`} />
                <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                    {benefit.title}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                    {benefit.desc}
                </p>
            </div>
        ))}
      </div>

    </div>
  );
}