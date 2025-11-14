// // app/components_copy/ReviewsSection.tsx (FINAL COMPLETE CODE)

// "use client";

// import { useState, useMemo } from "react";
// import { ProductReview } from "@/sanity/types/product_types";
// import ProductReviews from "./ProductReviews";
// import { Star, MessageSquarePlus } from "lucide-react";
// import ProductReviewModal from "./ProductReviewModal";
// import PaginationControls from "@/app/components/ui/PaginationControls";

// // Props ki type update hui hai
// interface ReviewsSectionProps {
//   productId: string;
//   allReviews: ProductReview[]; // Poori list summary ke liye
//   paginatedReviews: ProductReview[]; // Current page ke liye list
//   onNewReview: (review: ProductReview) => void;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// type RatingCounts = { [key: number]: number };

// export default function ReviewsSection({
//   productId,
//   allReviews,
//   paginatedReviews,
//   onNewReview,
//   currentPage,
//   totalPages,
//   onPageChange,
// }: ReviewsSectionProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   // Summary ab 'allReviews' prop se calculate hogi
//   const summary = useMemo(() => {
//     if (allReviews.length === 0) {
//       return {
//         averageRating: 0,
//         totalReviews: 0,
//         ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as RatingCounts,
//       };
//     }
//     const totalReviews = allReviews.length;
//     const averageRating =
//       allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
//     const ratingCounts: RatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     allReviews.forEach((review) => {
//       if (ratingCounts[review.rating] !== undefined) {
//         ratingCounts[review.rating]++;
//       }
//     });
//     return { averageRating, totalReviews, ratingCounts };
//   }, [allReviews]);

//   return (
//     <>
//       <div className="mt-16 pt-10 border-t border-surface-border">
//         <div className="space-y-10">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-text-primary">
//               Customer Reviews
//             </h2>
//             <button
//               onClick={openModal}
//               className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-on-primary font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors"
//             >
//               <MessageSquarePlus size={18} />
//               Write a Review
//             </button>
//           </div>

//           {summary.totalReviews > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-surface-ground rounded-lg">
//               <div className="flex flex-col items-center justify-center text-center md:border-r border-surface-border md:pr-8">
//                 <p className="text-5xl font-bold text-text-primary">
//                   {summary.averageRating.toFixed(1)}
//                 </p>
//                 <div className="flex my-2">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-6 h-6 ${
//                         i < Math.round(summary.averageRating)
//                           ? "text-brand-accent fill-current"
//                           : "text-surface-border-darker"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <p className="text-sm text-text-secondary">
//                   Based on {summary.totalReviews} reviews
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 {[5, 4, 3, 2, 1].map((star) => (
//                   <div key={star} className="flex items-center gap-2">
//                     <span className="text-sm font-medium text-text-secondary">
//                       {star} star
//                     </span>
//                     <div className="flex-grow bg-surface-border rounded-full h-2.5">
//                       <div
//                         className="bg-brand-accent h-2.5 rounded-full"
//                         style={{
//                           width: `${
//                             summary.totalReviews > 0
//                               ? (summary.ratingCounts[star] /
//                                   summary.totalReviews) *
//                                 100
//                               : 0
//                           }%`,
//                         }}
//                       ></div>
//                     </div>
//                     <span className="text-sm font-medium text-text-secondary w-10 text-right">
//                       {summary.totalReviews > 0
//                         ? Math.round(
//                             (summary.ratingCounts[star] /
//                               summary.totalReviews) *
//                               100
//                           )
//                         : 0}
//                       %
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ProductReviews ko ab 'paginatedReviews' pass karein */}
//           <ProductReviews reviews={paginatedReviews} />

//           {/* Pagination sirf tab dikhayein jab 1 se zyada page hon */}
//           {totalPages > 1 && (
//             <PaginationControls
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={onPageChange}
//             />
//           )}
//         </div>
//       </div>

//       <ProductReviewModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         productId={productId}
//         onReviewSubmit={onNewReview}
//       />
//     </>
//   );
// }
"use client";

import { useState, useMemo } from "react";
import { ProductReview } from "@/sanity/types/product_types";
import ProductReviews from "./ProductReviews";
import { Star, MessageSquarePlus } from "lucide-react";
import ProductReviewModal from "./ProductReviewModal";
import PaginationControls from "@/app/components/ui/PaginationControls";

interface ReviewsSectionProps {
  productId: string;
  allReviews: ProductReview[];
  paginatedReviews: ProductReview[];
  onNewReview: (review: ProductReview) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type RatingCounts = { [key: number]: number };

export default function ReviewsSection({
  productId,
  allReviews,
  paginatedReviews,
  onNewReview,
  currentPage,
  totalPages,
  onPageChange,
}: ReviewsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const summary = useMemo(() => {
    if (allReviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as RatingCounts,
      };
    }
    const totalReviews = allReviews.length;
    const averageRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
    const ratingCounts: RatingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((review) => {
      if (ratingCounts[review.rating] !== undefined) {
        ratingCounts[review.rating]++;
      }
    });
    return { averageRating, totalReviews, ratingCounts };
  }, [allReviews]);

  return (
    <>
      <div id="reviews" className="w-full mt-16 md:mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-10">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Customer Reviews
            </h2>
            <button
              onClick={openModal}
              className="shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all duration-300 transform hover:scale-105"
            >
              <MessageSquarePlus size={20} />
              Write a Review
            </button>
          </div>

          {summary.totalReviews > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="md:col-span-2 flex flex-col items-center justify-center text-center md:border-r border-gray-200 dark:border-gray-700 md:pr-8">
                <p className="text-6xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.averageRating.toFixed(1)}
                </p>
                <div className="flex my-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={24}
                      className={` ${
                        i < Math.round(summary.averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Based on {summary.totalReviews} reviews
                </p>
              </div>
              
              <div className="md:col-span-3 flex flex-col justify-center space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="grid grid-cols-[1rem_1.5rem_1fr_2rem] items-center gap-x-2">
                    
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
                      {star}
                    </span>
                    
                    <Star size={14} className="text-gray-400 dark:text-gray-500" />
                    
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${(summary.ratingCounts[star] / summary.totalReviews) * 100}%`,
                        }}
                      ></div>
                    </div>

                    {/* --- FINAL FIX APPLIED HERE --- */}
                    <span className="tabular-nums text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                      {summary.ratingCounts[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ProductReviews reviews={paginatedReviews} />

          {totalPages > 1 && (
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>

      <ProductReviewModal
        isOpen={isModalOpen}
        onClose={closeModal}
        productId={productId}
        onReviewSubmit={onNewReview}
      />
    </>
  );
}