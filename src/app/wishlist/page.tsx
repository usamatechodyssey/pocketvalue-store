"use client";

import { useState, useEffect, useMemo } from "react";
import { useStateContext } from "@/app/context/StateContext";
import Link from "next/link";
import { Heart, Loader2, Trash2 } from "lucide-react";
import SanityProduct from "@/sanity/types/product_types";
import { CleanWishlistItem } from "@/sanity/types/product_types";
import { getLiveProductDataForCards } from "@/sanity/lib/queries";
import ProductCard from "../components/product/ProductCard";
import PaginationControls from "../components/ui/PaginationControls"; // <-- IMPORTED

const PRODUCTS_PER_PAGE = 12; // <-- DEFINED

type LiveWishlistItem = CleanWishlistItem & {
  liveData?: SanityProduct;
};

export default function WishlistPage() {
  const { wishlistItems, handleAddToWishlist } = useStateContext();
  const [liveWishlist, setLiveWishlist] = useState<LiveWishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // <-- PAGINATION STATE

  useEffect(() => {
    const fetchLiveProductData = async () => {
      // ... existing logic is perfect
      if (wishlistItems.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const productIds = wishlistItems.map((item) => item._id);
      const liveProducts: SanityProduct[] =
        await getLiveProductDataForCards(productIds);
      const liveDataMap = new Map(liveProducts.map((p) => [p._id, p]));
      const updatedWishlist = wishlistItems.map((item) => ({
        ...item,
        liveData: liveDataMap.get(item._id),
      }));
      setLiveWishlist(updatedWishlist);
      setIsLoading(false);
    };
    fetchLiveProductData();
  }, [wishlistItems]);

  const handleRemoveFromWishlist = (item: LiveWishlistItem) => {
    const productToRemove = {
      _id: item._id,
      title: item.name,
      defaultVariant: item.liveData?.defaultVariant,
    } as SanityProduct;
    handleAddToWishlist(productToRemove);
  };

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(liveWishlist.length / PRODUCTS_PER_PAGE);
  const paginatedWishlist = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return liveWishlist.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [liveWishlist, currentPage]);

  if (isLoading) {
    /* ... Loading state ... */ return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-brand-primary" />
        <p className="ml-4 text-lg text-gray-600 dark:text-gray-400">
          Loading Your Wishlist...
        </p>
      </div>
    );
  }
  if (liveWishlist.length === 0) {
    /* ... Empty state ... */ return (
      <main className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center text-center">
            <Heart
              size={56}
              className="text-gray-300 dark:text-gray-600 mb-6"
              strokeWidth={1.5}
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
              Looks like you haven't saved any items yet. Tap the heart on
              products you love to add them here.
            </p>
            <Link
              href="/"
              className="px-6 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {liveWishlist.length} {liveWishlist.length > 1 ? "items" : "item"}
          </p>
        </div>

        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {/* Mapped over paginated list now */}
          {paginatedWishlist.map((item) => {
            const product = item.liveData;
            if (!product || !product.defaultVariant) {
              return null;
            }
            return (
              <div key={item._id} className="relative group">
                <ProductCard
                  product={product}
                  onQuickView={() => {}}
                  className="h-full"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item)}
                  className="absolute top-3 right-3 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-red-500 hover:text-white transition-all z-20"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* --- PAGINATION CONTROLS ADDED --- */}
        {totalPages > 1 && (
          <div className="mt-8 md:mt-12">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
