// /src/app/components/product/pdp-sections/ProductHeader.tsx

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Star, ChevronDown } from 'lucide-react';
import SanityProduct, { ProductVariant } from '@/sanity/types/product_types';

interface ProductHeaderProps {
  product: SanityProduct;
  selectedVariant: ProductVariant | null;
  averageRating: number;
  totalReviews: number;
  isSelectionInStock: boolean;
}

export default function ProductHeader({
  product,
  selectedVariant,
  averageRating,
  totalReviews,
  isSelectionInStock,
}: ProductHeaderProps) {
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);

  return (
    <>
      <div>
        <h1
          className={`text-2xl md:text-3xl font-bold text-text-primary dark:text-gray-100 transition-all duration-300 ${isTitleExpanded ? "" : "line-clamp-2"}`}
        >
          {product.title}
        </h1>
        {/* Show More/Less button only appears if title is long */}
        {product.title.length > 80 && (
          <button
            onClick={() => setIsTitleExpanded(!isTitleExpanded)}
            className="text-sm text-brand-primary font-semibold mt-1 flex items-center gap-1"
          >
            {isTitleExpanded ? "Show Less" : "Show More"}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isTitleExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 my-4">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Brand: </span>
          {product.brand ? (
            <Link
              href={`/search?brand=${product.brand.slug}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {product.brand.name}
            </Link>
          ) : (
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              No Brand
            </span>
          )}
        </div>
        
        {/* Divider */}
        <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
        
        {/* Rating */}
        {averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-text-primary dark:text-gray-200">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-text-secondary dark:text-gray-400">
              ({totalReviews} reviews)
            </span>
          </div>
        )}

        {/* Stock Status Badge */}
        {selectedVariant && (
          <>
            <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">|</span>
            <div
              className={`text-xs font-bold uppercase px-3 py-1 rounded-full
              ${
                isSelectionInStock
                  ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-500/20"
                  : "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-500/20"
              }`}
            >
              {isSelectionInStock ? "In Stock" : "Out of Stock"}
            </div>
          </>
        )}
      </div>
    </>
  );
}