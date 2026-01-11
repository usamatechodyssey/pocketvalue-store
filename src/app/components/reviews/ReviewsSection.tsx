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
import { Star, MessageSquarePlus, Filter, Camera, Check } from "lucide-react";
import ProductReviewModal from "./ProductReviewModal";
import PaginationControls from "@/app/components/ui/PaginationControls";
import { motion } from "framer-motion";

interface ReviewsSectionProps {
  productId: string;
  allReviews: ProductReview[];
  onNewReview: (review: ProductReview) => void;
}

type FilterType = "all" | "photos" | "5star" | "critical";
const REVIEWS_PER_PAGE = 4;

export default function ReviewsSection({
  productId,
  allReviews,
  onNewReview,
}: ReviewsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // === 1. SUMMARY LOGIC ===
  const summary = useMemo(() => {
    const total = allReviews.length;
    if (total === 0) return null;

    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / total;
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => (counts[r.rating] = (counts[r.rating] || 0) + 1));

    return { avg, total, counts };
  }, [allReviews]);

  // === 2. FILTERING LOGIC ===
  const filteredReviews = useMemo(() => {
    let data = [...allReviews];
    if (activeFilter === "photos") data = data.filter((r) => r.reviewImage);
    if (activeFilter === "5star") data = data.filter((r) => r.rating === 5);
    if (activeFilter === "critical") data = data.filter((r) => r.rating <= 3);
    return data;
  }, [allReviews, activeFilter]);

  // === 3. PAGINATION LOGIC ===
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  // Reset page when filter changes
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const filters = [
    { id: "all", label: "All Reviews", icon: null },
    { id: "photos", label: "With Photos", icon: Camera },
    { id: "5star", label: "5 Stars", icon: Star },
    { id: "critical", label: "Critical", icon: Filter },
  ];

  return (
    <>
      <div
        id="reviews"
        className="w-full mt-16 md:mt-24 pt-10 border-t border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col gap-12">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-clash font-bold text-gray-900 dark:text-white tracking-tight">
                Ratings & Reviews
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Authentic feedback from our customers
              </p>
            </div>

            <button
              onClick={openModal}
              className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <MessageSquarePlus
                size={20}
                className="group-hover:-rotate-12 transition-transform"
              />
              Write a Review
            </button>
          </div>

          {/* DASHBOARD */}
          {summary && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-10 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 pb-8 lg:pb-0 lg:pr-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                    {summary.avg.toFixed(1)}
                  </span>
                  <span className="text-2xl text-gray-400 font-medium">
                    / 5
                  </span>
                </div>
                <div className="flex items-center gap-1 my-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={24}
                      className={
                        s <= Math.round(summary.avg)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 dark:text-gray-600"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Based on {summary.total} verified reviews
                </p>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-center gap-4 w-full">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div
                    key={star}
                    className="grid grid-cols-[2rem_1fr_3rem] items-center gap-4 group w-full"
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {star}
                      </span>
                      <Star
                        size={14}
                        className="text-gray-400 group-hover:text-yellow-400 transition-colors"
                      />
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-full">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(summary.counts[star] / summary.total) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-yellow-400 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-500 text-right tabular-nums">
                      {summary.counts[star]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FILTER TABS (Mobile Grid / Desktop Flex) */}
          {summary && (
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 pb-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFilterChange(f.id as FilterType)}
                  className={`w-full md:w-auto flex items-center justify-center md:justify-start gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all border
                        ${
                          activeFilter === f.id
                            ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                >
                  {f.icon && <f.icon size={16} />}
                  {f.label}
                  {activeFilter === f.id && (
                    <Check size={16} className="ml-1" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* REVIEWS LIST & PAGINATION */}
          <div className="min-h-[200px]">
            {paginatedReviews.length > 0 ? (
              <>
                {/* Note: ProductReviews component now handles the single column layout */}
                <ProductReviews reviews={paginatedReviews} />

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 font-medium">
                  No reviews match this filter.
                </p>
                <button
                  onClick={() => handleFilterChange("all")}
                  className="text-brand-primary font-bold mt-2 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
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
// "use client";

// import { useState, useMemo } from "react";
// import { ProductReview } from "@/sanity/types/product_types";
// import ProductReviews from "./ProductReviews";
// import { Star, MessageSquarePlus, Filter, Camera, Check } from "lucide-react";
// import ProductReviewModal from "./ProductReviewModal";
// import PaginationControls from "@/app/components/ui/PaginationControls";
// import { motion } from "framer-motion";

// interface ReviewsSectionProps {
//   productId: string;
//   allReviews: ProductReview[];
//   onNewReview: (review: ProductReview) => void;
//   // Hum props se pagination nahi lenge kyunke hum client side filter kar rahe hain
// }

// type FilterType = "all" | "photos" | "5star" | "critical";
// const REVIEWS_PER_PAGE = 4; // 🔥 Restored Pagination Limit

// export default function ReviewsSection({
//   productId,
//   allReviews,
//   onNewReview,
// }: ReviewsSectionProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState<FilterType>("all");
//   const [currentPage, setCurrentPage] = useState(1); // Local Pagination State

//   const openModal = () => setIsModalOpen(true);
//   const closeModal = () => setIsModalOpen(false);

//   // === 1. SUMMARY LOGIC ===
//   const summary = useMemo(() => {
//     const total = allReviews.length;
//     if (total === 0) return null;

//     const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
//     const avg = sum / total;
//     const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     allReviews.forEach(r => counts[r.rating] = (counts[r.rating] || 0) + 1);

//     return { avg, total, counts };
//   }, [allReviews]);

//   // === 2. FILTERING LOGIC ===
//   const filteredReviews = useMemo(() => {
//     let data = [...allReviews];
//     if (activeFilter === "photos") data = data.filter(r => r.reviewImage);
//     if (activeFilter === "5star") data = data.filter(r => r.rating === 5);
//     if (activeFilter === "critical") data = data.filter(r => r.rating <= 3);
//     return data;
//   }, [allReviews, activeFilter]);

//   // === 3. PAGINATION LOGIC (The Fix) ===
//   const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);

//   const paginatedReviews = useMemo(() => {
//       const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
//       return filteredReviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);
//   }, [filteredReviews, currentPage]);

//   // Reset page when filter changes
//   const handleFilterChange = (filter: FilterType) => {
//       setActiveFilter(filter);
//       setCurrentPage(1);
//   };

//   const filters = [
//     { id: "all", label: "All Reviews", icon: null },
//     { id: "photos", label: "With Photos", icon: Camera },
//     { id: "5star", label: "5 Stars", icon: Star },
//     { id: "critical", label: "Critical", icon: Filter },
//   ];

//   return (
//     <>
//       <div id="reviews" className="w-full mt-16 md:mt-24 pt-10 border-t border-gray-100 dark:border-gray-800">
//         <div className="flex flex-col gap-12">

//           {/* HEADER */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//             <div>
//                 <h2 className="text-3xl md:text-4xl font-clash font-bold text-gray-900 dark:text-white tracking-tight">
//                 Ratings & Reviews
//                 </h2>
//                 <p className="text-gray-500 text-sm mt-1">
//                     Authentic feedback from our customers
//                 </p>
//             </div>

//             <button
//               onClick={openModal}
//               className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95"
//             >
//               <MessageSquarePlus size={20} className="group-hover:-rotate-12 transition-transform" />
//               Write a Review
//             </button>
//           </div>

//           {/* DASHBOARD */}
//           {summary && (
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-10 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-700">
//               <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 pb-8 lg:pb-0 lg:pr-10">
//                 <div className="flex items-baseline gap-2">
//                     <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
//                         {summary.avg.toFixed(1)}
//                     </span>
//                     <span className="text-2xl text-gray-400 font-medium">/ 5</span>
//                 </div>
//                 <div className="flex items-center gap-1 my-3">
//                     {[1, 2, 3, 4, 5].map((s) => (
//                         <Star key={s} size={24} className={s <= Math.round(summary.avg) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 dark:text-gray-600"} />
//                     ))}
//                 </div>
//                 <p className="text-sm font-medium text-gray-500">
//                     Based on {summary.total} verified reviews
//                 </p>
//               </div>

//               <div className="lg:col-span-8 flex flex-col justify-center gap-4 w-full">
//                 {[5, 4, 3, 2, 1].map((star) => (
//                     <div key={star} className="grid grid-cols-[2rem_1fr_3rem] items-center gap-4 group w-full">
//                         <div className="flex items-center gap-1 justify-end">
//                             <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{star}</span>
//                             <Star size={14} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
//                         </div>
//                         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden w-full">
//                             <motion.div
//                                 initial={{ width: 0 }}
//                                 whileInView={{ width: `${(summary.counts[star] / summary.total) * 100}%` }}
//                                 transition={{ duration: 1, ease: "easeOut" }}
//                                 className="h-full bg-yellow-400 rounded-full"
//                             />
//                         </div>
//                         <span className="text-sm font-medium text-gray-500 text-right tabular-nums">
//                             {summary.counts[star]}
//                         </span>
//                     </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* FILTER TABS */}
//           {summary && (
//               <div className="flex flex-wrap gap-3 pb-2">
//                 {filters.map((f) => (
//                     <button
//                         key={f.id}
//                         onClick={() => handleFilterChange(f.id as FilterType)}
//                         className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border
//                         ${activeFilter === f.id
//                             ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20"
//                             : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"}`}
//                     >
//                         {f.icon && <f.icon size={16} />}
//                         {f.label}
//                         {activeFilter === f.id && <Check size={16} className="ml-1" />}
//                     </button>
//                 ))}
//               </div>
//           )}

//           {/* REVIEWS LIST & PAGINATION */}
//           <div className="min-h-[200px]">
//             {paginatedReviews.length > 0 ? (
//                 <>
//                     <ProductReviews reviews={paginatedReviews} />

//                     {/* 🔥 PAGINATION CONTROLS RESTORED */}
//                     {totalPages > 1 && (
//                         <div className="mt-8 flex justify-center">
//                             <PaginationControls
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={setCurrentPage}
//                             />
//                         </div>
//                     )}
//                 </>
//             ) : (
//                 <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
//                     <p className="text-gray-500 font-medium">No reviews match this filter.</p>
//                     <button onClick={() => handleFilterChange('all')} className="text-brand-primary font-bold mt-2 hover:underline">Clear Filters</button>
//                 </div>
//             )}
//           </div>

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
// "use client";

// import { useState, useMemo } from "react";
// import { ProductReview } from "@/sanity/types/product_types";
// import ProductReviews from "./ProductReviews";
// import { Star, MessageSquarePlus } from "lucide-react";
// import ProductReviewModal from "./ProductReviewModal";
// import PaginationControls from "@/app/components/ui/PaginationControls";

// interface ReviewsSectionProps {
//   productId: string;
//   allReviews: ProductReview[];
//   paginatedReviews: ProductReview[];
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
//       <div id="reviews" className="w-full mt-16 md:mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
//         <div className="space-y-10">

//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
//               Customer Reviews
//             </h2>
//             <button
//               onClick={openModal}
//               className="shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all duration-300 transform hover:scale-105"
//             >
//               <MessageSquarePlus size={20} />
//               Write a Review
//             </button>
//           </div>

//           {summary.totalReviews > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
//               <div className="md:col-span-2 flex flex-col items-center justify-center text-center md:border-r border-gray-200 dark:border-gray-700 md:pr-8">
//                 <p className="text-6xl font-bold text-gray-900 dark:text-gray-100">
//                   {summary.averageRating.toFixed(1)}
//                 </p>
//                 <div className="flex my-2">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={24}
//                       className={` ${
//                         i < Math.round(summary.averageRating)
//                           ? "text-yellow-400 fill-yellow-400"
//                           : "text-gray-300 dark:text-gray-600"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   Based on {summary.totalReviews} reviews
//                 </p>
//               </div>

//               <div className="md:col-span-3 flex flex-col justify-center space-y-2">
//                 {[5, 4, 3, 2, 1].map((star) => (
//                   <div key={star} className="grid grid-cols-[1rem_1.5rem_1fr_2rem] items-center gap-x-2">

//                     <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
//                       {star}
//                     </span>

//                     <Star size={14} className="text-gray-400 dark:text-gray-500" />

//                     <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//                       <div
//                         className="bg-yellow-400 h-2 rounded-full"
//                         style={{
//                           width: `${(summary.ratingCounts[star] / summary.totalReviews) * 100}%`,
//                         }}
//                       ></div>
//                     </div>

//                     {/* --- FINAL FIX APPLIED HERE --- */}
//                     <span className="tabular-nums text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
//                       {summary.ratingCounts[star]}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <ProductReviews reviews={paginatedReviews} />

//           {totalPages > 1 && (
//             <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
//               <PaginationControls
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={onPageChange}
//               />
//             </div>
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
