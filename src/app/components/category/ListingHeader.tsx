"use client";

import { ChevronDown } from "lucide-react";
import MobileFilterButton from "../ui/MobileFilterButton";

interface ListingHeaderProps {
  productsCount: number;
  totalCount: number;
  sortOrder: string;
  onSortChange: (value: string) => void;
  onMobileFilterClick: () => void;
}

export default function ListingHeader({
  productsCount,
  totalCount,
  sortOrder,
  onSortChange,
  onMobileFilterClick,
}: ListingHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        Showing{" "}
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {productsCount}
        </span>{" "}
        of{" "}
        <span className="font-bold text-gray-800 dark:text-gray-200">
          {totalCount}
        </span>{" "}
        results
      </p>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="lg:hidden">
          <MobileFilterButton onClick={onMobileFilterClick} />
        </div>
        <div className="relative">
          <select
            id="sort-by"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-gray-50 dark:bg-gray-800 pl-3 sm:pl-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary pr-8 sm:pr-9 cursor-pointer"
          >
            <option value="best-match">Best Match</option>
            <option value="best-selling">Best Selling</option>
            <option value="newest">Newest</option>
            <option value="price-low-to-high">Price: Low-High</option>
            <option value="price-high-to-low">Price: High-Low</option>
          </select>
          <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}