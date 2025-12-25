// "use client";

// import { useState, useCallback } from "react";
// import SanityProduct from "@/sanity/types/product_types";
// import { getPaginatedProducts } from "@/sanity/lib/queries";

// import ProductCard from "@/app/components/product/ProductCard";
// import QuickViewModal from "@/app/components/product/QuickViewModal";
// import { BeatLoader } from "react-spinners";
// import { FiPlus } from "react-icons/fi";

// const BATCH_SIZE = 10; // Ek baar mein 12 products load karenge

// export default function LoadMoreProductGrid({
//   initialProducts,
// }: {
//   initialProducts: SanityProduct[];
// }) {
//   const [products, setProducts] = useState<SanityProduct[]>(initialProducts);
//   const [page, setPage] = useState(2);
//   const [hasMore, setHasMore] = useState(initialProducts.length === BATCH_SIZE);
//   const [isLoading, setIsLoading] = useState(false);
//   const [quickViewProduct, setQuickViewProduct] =
//     useState<SanityProduct | null>(null);

//   const loadMoreProducts = useCallback(async () => {
//     if (isLoading || !hasMore) return;

//     setIsLoading(true);
//     const newProducts = await getPaginatedProducts(page, BATCH_SIZE);

//     if (newProducts.length > 0) {
//       // Naye products ko aahista se fade-in karne ke liye thora sa delay
//       setTimeout(() => {
//         setProducts((prev) => [...prev, ...newProducts]);
//         setPage((prev) => prev + 1);
//         setHasMore(newProducts.length === BATCH_SIZE);
//         setIsLoading(false);
//       }, 500); // 0.5 second ka delay
//     } else {
//       setHasMore(false);
//       setIsLoading(false);
//     }
//   }, [page, isLoading, hasMore]);

//   const handleQuickView = (product: SanityProduct) =>
//     setQuickViewProduct(product);
//   const handleCloseModal = () => setQuickViewProduct(null);

//   return (
//     <>
//       {/* === NAYA, CLEAN DESIGN === */}
//       <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-16 md:py-20">
//         {/* Container ab poori width le raha hai */}
//         <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">
//               More to Explore
//             </h2>
//           </div>

//           {/* Wider Grid (xl par 6 columns, 2xl par 7) */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
//             {products.map((product) => (
//               <div key={product._id} className="h-full">
//                 <ProductCard
//                   product={product}
//                   onQuickView={handleQuickView}
//                   className="h-full"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* "Load More" Button aur Loader */}
//           <div className="mt-12 text-center">
//             {isLoading ? (
//               <BeatLoader color="var(--color-brand-primary)" size={15} />
//             ) : hasMore ? (
//               <button
//                 onClick={loadMoreProducts}
//                 className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-200 font-bold rounded-lg shadow-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all"
//               >
//                 <FiPlus size={18} />
//                 Load More Products
//               </button>
//             ) : (
//               <p className="text-text-secondary dark:text-gray-400">
//                 You've reached the end!
//               </p>
//             )}
//           </div>
//         </div>
//       </section>

//       <QuickViewModal
//         product={quickViewProduct}
//         isOpen={!!quickViewProduct}
//         onClose={handleCloseModal}
//       />
//     </>
//   );
// }
"use client";

import { useState, useCallback } from "react";
import SanityProduct from "@/sanity/types/product_types";
import { getPaginatedProducts } from "@/sanity/lib/queries";
import ProductCard from "@/app/components/product/ProductCard";
import QuickViewModal from "@/app/components/product/QuickViewModal";
import { BeatLoader } from "react-spinners";
import { FiPlus } from "react-icons/fi";

const BATCH_SIZE = 12; // Make sure this matches query limit

export default function InfiniteProductGrid({
  initialProducts,
}: {
  initialProducts: SanityProduct[];
}) {
  const [products, setProducts] = useState<SanityProduct[]>(
    initialProducts || []
  );
  const [page, setPage] = useState(2);

  // === LOGIC FIX ===
  // Agar shuru mein products aye hain aur wo batch size ke barabar hain, to 'Load More' dikhao
  const [hasMore, setHasMore] = useState(
    (initialProducts?.length || 0) >= BATCH_SIZE
  );

  const [isLoading, setIsLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] =
    useState<SanityProduct | null>(null);

  const loadMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const newProducts = await getPaginatedProducts(page, BATCH_SIZE);

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage((prev) => prev + 1);
        // Agar naye products kam aye hain batch size se, to matlab khatam ho gaye
        setHasMore(newProducts.length >= BATCH_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more products", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  const handleQuickView = (product: SanityProduct) =>
    setQuickViewProduct(product);
  const handleCloseModal = () => setQuickViewProduct(null);

  if (!initialProducts || initialProducts.length === 0) return null;

  return (
    <>
      <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-16 md:py-20">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">
              More to Explore
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id} className="h-full">
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView} // Correctly passed
                  className="h-full"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            {isLoading ? (
              <BeatLoader color="var(--color-brand-primary)" size={15} />
            ) : hasMore ? (
              <button
                onClick={loadMoreProducts}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-200 font-bold rounded-lg shadow-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all"
              >
                <FiPlus size={18} /> Load More Products
              </button>
            ) : (
              <p className="text-text-secondary dark:text-gray-400 mt-4">
                You've reached the end!
              </p>
            )}
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}
