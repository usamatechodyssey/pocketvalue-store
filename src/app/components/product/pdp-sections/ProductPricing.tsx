// /src/app/components/product/pdp-sections/ProductPricing.tsx

"use client";

import { ProductVariant } from "@/sanity/types/product_types";

interface ProductPricingProps {
  // We can accept a variant or null if no valid selection is made
  selectedVariant: ProductVariant | null; 
}

export default function ProductPricing({ selectedVariant }: ProductPricingProps) {

  // If no variant is selected for any reason, we can show a placeholder or nothing
  if (!selectedVariant) {
    return (
        <div className="mb-6 h-[52px]">
            {/* Placeholder to prevent layout shift */}
        </div>
    );
  }
  
  const effectivePrice = selectedVariant.salePrice ?? selectedVariant.price;
  const originalPrice = selectedVariant.salePrice ? selectedVariant.price : null;

  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span className="text-4xl font-bold text-brand-primary">
        Rs. {effectivePrice.toLocaleString()}
      </span>
      {originalPrice && (
        <span className="text-xl text-text-secondary line-through">
          Rs. {originalPrice.toLocaleString()}
        </span>
      )}
    </div>
  );
}