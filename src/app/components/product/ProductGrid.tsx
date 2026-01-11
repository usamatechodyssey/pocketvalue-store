// "use client";

import SanityProduct from "@/sanity/types/product_types";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: SanityProduct[];
  onQuickView: (product: SanityProduct) => void;
}

export default function ProductGrid({
  products,
  onQuickView,
}: ProductGridProps) {
  return (
    <>
      {products.length > 0 ? (
        // ALIGNMENT FIX:
        // Mobile: gap-2 (Tight spacing like standard apps)
        // Desktop: gap-5 or gap-6 (Clean spacing)
        // Columns: Consistent breakpoints (2 -> 3 -> 4 -> 5)
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 ">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
              className="h-full" // Ensure cards stretch evenly
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <SlidersHorizontal size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-4 text-xl font-semibold text-text-primary dark:text-gray-200">
            No Products Found
          </h3>
          <p className="text-text-secondary dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Try adjusting your filters or clearing them to see all available
            products.
          </p>
        </div>
      )}
    </>
  );
}