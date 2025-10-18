// app/components/product/ProductGrid.tsx (MUKAMMAL FINAL CODE)

"use client";

import SanityProduct from "@/sanity/types/product_types";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: SanityProduct[]; // Yeh ab hamesha filtered aur paginated products honge
  onQuickView: (product: SanityProduct) => void;
  // Is component ko ab sorting se koi lena dena nahi
}

export default function ProductGrid({
  products,
  onQuickView,
}: ProductGridProps) {
  // Sorting logic aur "Sort by" dropdown yahan se poori tarah se HATA diya gaya hai.

  return (
    <>
      {/* Product Grid and "No Results" State */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
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
