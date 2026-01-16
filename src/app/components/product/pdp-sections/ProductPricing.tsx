// // /src/app/components/product/pdp-sections/ProductPricing.tsx

// "use client";

// import { ProductVariant } from "@/sanity/types/product_types";

// interface ProductPricingProps {
//   // We can accept a variant or null if no valid selection is made
//   selectedVariant: ProductVariant | null; 
// }

// export default function ProductPricing({ selectedVariant }: ProductPricingProps) {

//   // If no variant is selected for any reason, we can show a placeholder or nothing
//   if (!selectedVariant) {
//     return (
//         <div className="mb-6 h-[52px]">
//             {/* Placeholder to prevent layout shift */}
//         </div>
//     );
//   }
  
//   const effectivePrice = selectedVariant.salePrice ?? selectedVariant.price;
//   const originalPrice = selectedVariant.salePrice ? selectedVariant.price : null;

//   return (
//     <div className="flex items-baseline gap-3 mb-6">
//       <span className="text-4xl font-bold text-brand-primary">
//         Rs. {effectivePrice.toLocaleString()}
//       </span>
//       {originalPrice && (
//         <span className="text-xl text-text-secondary line-through">
//           Rs. {originalPrice.toLocaleString()}
//         </span>
//       )}
//     </div>
//   );
// }
// /src/app/components/product/pdp-sections/ProductPricing.tsx

"use client";

import { useMemo } from "react";
import { ProductVariant } from "@/sanity/types/product_types";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "lucide-react";

interface ProductPricingProps {
  selectedVariant: ProductVariant | null;
}

export default function ProductPricing({ selectedVariant }: ProductPricingProps) {
  
  // 1. Calculate Prices & Discount
  const { effectivePrice, originalPrice, discountPercentage } = useMemo(() => {
    if (!selectedVariant) return { effectivePrice: 0, originalPrice: null, discountPercentage: 0 };

    const price = selectedVariant.price;
    const sale = selectedVariant.salePrice;
    
    // Agar sale price exist karti hai
    if (sale && sale < price) {
        const discount = Math.round(((price - sale) / price) * 100);
        return { effectivePrice: sale, originalPrice: price, discountPercentage: discount };
    }

    return { effectivePrice: price, originalPrice: null, discountPercentage: 0 };
  }, [selectedVariant]);

  // 2. Loading State (Skeleton)
  if (!selectedVariant) {
    return (
        <div className="mb-6 flex flex-col gap-2 animate-pulse">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 mb-6">
      <div className="flex items-center gap-3 flex-wrap">
        
        {/* Main Price with Animation */}
        <AnimatePresence mode="popLayout">
            <motion.span
                key={effectivePrice} // Key change hone par animation trigger hogi
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, type: "spring" }}
                className="text-4xl font-clash font-bold text-brand-primary tracking-tight"
            >
                Rs. {effectivePrice.toLocaleString()}
            </motion.span>
        </AnimatePresence>

        {/* Discount Badge (Pill Style) */}
        {discountPercentage > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-brand-danger rounded-full shadow-sm animate-in fade-in zoom-in duration-300">
                <Tag size={12} fill="currentColor" />
                {discountPercentage}% OFF
            </span>
        )}
      </div>

      {/* Original Price (Crossed Out) */}
      {originalPrice && (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
           <span className="line-through decoration-gray-400 decoration-1">
             Rs. {originalPrice.toLocaleString()}
           </span>
           <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
           <span className="text-brand-success">
             Save Rs. {(originalPrice - effectivePrice).toLocaleString()}
           </span>
        </div>
      )}
    </div>
  );
}