
// "use client";

// import { ShieldCheck, Truck, RotateCw, Headphones } from "lucide-react";

// const BENEFITS = [
//     { icon: ShieldCheck, title: "100% Authentic", desc: "Original products guaranteed", color: "text-green-500" },
//     { icon: Truck, title: "Fast Delivery", desc: "Shipping across Pakistan", color: "text-blue-500" },
//     { icon: RotateCw, title: "Easy Returns", desc: "7-day replacement policy", color: "text-orange-500" },
//     { icon: Headphones, title: "24/7 Support", desc: "We are here to help", color: "text-purple-500" },
// ];

// export default function ProductMeta() {
//   return (
//     <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
      
//       {/* GRID LAYOUT */}
//       <div className="grid grid-cols-2 gap-4">
//         {BENEFITS.map((benefit, idx) => (
//             <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
//                 <benefit.icon size={24} className={`mb-2 ${benefit.color}`} />
//                 <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide">
//                     {benefit.title}
//                 </h4>
//                 <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
//                     {benefit.desc}
//                 </p>
//             </div>
//         ))}
//       </div>

//     </div>
//   );
// }
// /src/app/components/product/pdp-sections/ProductMeta.tsx

"use client";

import { ShieldCheck, Truck, RotateCw, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const BENEFITS = [
    { 
        icon: ShieldCheck, 
        title: "100% Authentic", 
        desc: "Original verified", 
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    { 
        icon: Truck, 
        title: "Fast Delivery", 
        desc: "Shipping across PK", 
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    { 
        icon: RotateCw, 
        title: "Easy Returns", 
        desc: "7-day replacement", 
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-100 dark:bg-orange-900/20"
    },
    { 
        icon: Headphones, 
        title: "24/7 Support", 
        desc: "Friendly assistance", 
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-100 dark:bg-purple-900/20"
    },
];

export default function ProductMeta() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
      
      {/* 
          GRID LAYOUT UPDATE:
          - grid-cols-2 (Mobile) -> grid-cols-4 (Desktop)
          - Is se desktop par ye section patla aur sleek lagega
      */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BENEFITS.map((benefit, idx) => (
            <motion.div 
                key={idx}
                whileHover={{ y: -2 }} // Subtle lift effect
                className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
            >
                {/* Icon Box with Colored Background */}
                <div className={`shrink-0 p-2.5 rounded-full ${benefit.bg} ${benefit.color}`}>
                    <benefit.icon size={20} strokeWidth={2.5} />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                        {benefit.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                        {benefit.desc}
                    </p>
                </div>
            </motion.div>
        ))}
      </div>
      
      {/* Optional: Safe Checkout Badge (Trust Booster) */}
      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-semibold opacity-60">
        <ShieldCheck size={12} />
        Guaranteed Safe Checkout
      </div>

    </div>
  );
}