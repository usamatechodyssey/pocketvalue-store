// // app/components_copy/ProductReviews.tsx - FINAL WORLD-CLASS CODE

// "use client";

// import { useState } from "react"; // NAYA: State manage karne ke liye
// import { ProductReview } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import { Star, UserCircle, ChevronDown, ChevronUp } from "lucide-react"; // NAYA: Icons
// import Image from "next/image";

// // Yeh component waisa hi hai, ismein koi change nahi
// const StarRating = ({ rating }: { rating: number }) => (
//   <div className="flex items-center">
//     {[1, 2, 3, 4, 5].map((star) => (
//       <Star
//         key={star}
//         className={`w-5 h-5 ${
//           star <= rating
//             ? "text-brand-accent fill-current"
//             : "text-surface-border-darker"
//         }`}
//       />
//     ))}
//   </div>
// );

// export default function ProductReviews({
//   reviews,
// }: {
//   reviews: ProductReview[];
// }) {
//   // NAYA: Hum track karenge ke konsa review is waqt khula hua hai
//   const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

//   if (!reviews || reviews.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-text-secondary">
//           No reviews yet. Be the first to write one!
//         </p>
//       </div>
//     );
//   }

//   // NAYA: Review ko kholne/band karne ka function
//   const toggleReview = (id: string) => {
//     if (expandedReviewId === id) {
//       setExpandedReviewId(null); // Agar pehle se khula hai, to band kar do
//     } else {
//       setExpandedReviewId(id); // Warna naya wala khol do
//     }
//   };

//   return (
//     // NAYA: space-y-2 taake compact reviews ke darmiyan kam faasla ho
//     <div className="space-y-2">
//       {reviews.map((review) => {
//         const isExpanded = expandedReviewId === review._id;
//         // "Read More" ka button tab dikhayein jab comment lamba ho ya saath mein image ho
//         const showToggleButton =
//           review.comment.length > 200 || !!review.reviewImage;

//         return (
//           <div key={review._id} className="border-t border-surface-border py-4">
//             {/* User Info & Rating (Hamesha nazar aayega) */}
//             <div className="flex items-start gap-4">
//               {review.user?.image ? (
//                 <Image
//                   src={review.user.image}
//                   alt={review.user.name}
//                   width={40}
//                   height={40}
//                   className="rounded-full"
//                 />
//               ) : (
//                 <UserCircle className="w-10 h-10 text-text-subtle flex-shrink-0" />
//               )}
//               <div className="flex-grow">
//                 <p className="font-semibold text-text-primary">
//                   {review.user?.name || "Anonymous"}
//                 </p>
//                 <StarRating rating={review.rating} />
//               </div>
//             </div>

//             {/* Smart Comment Section */}
//             <div className="pl-14 pt-2">
//               <p
//                 className={`text-text-secondary text-sm transition-all duration-300 ${
//                   !isExpanded && showToggleButton ? "line-clamp-2" : ""
//                 }`}
//               >
//                 {review.comment}
//               </p>
//             </div>

//             {/* NAYA: Expandable Content (Image waghera) */}
//             <div
//               className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                 isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
//               }`}
//             >
//               {review.reviewImage && (
//                 <div className="mt-4 pl-14">
//                   <Image
//                     src={urlFor(review.reviewImage).width(400).url()}
//                     alt={`Review image by ${review.user?.name}`}
//                     width={400}
//                     height={400}
//                     className="rounded-lg object-cover max-h-80 w-auto"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* NAYA: Footer with "Read More" and Date */}
//             <div className="pl-14 mt-2 flex justify-between items-center">
//               {showToggleButton ? (
//                 <button
//                   onClick={() => toggleReview(review._id)}
//                   className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:underline"
//                 >
//                   {isExpanded ? "Read Less" : "Read More"}
//                   {isExpanded ? (
//                     <ChevronUp size={16} />
//                   ) : (
//                     <ChevronDown size={16} />
//                   )}
//                 </button>
//               ) : (
//                 <div /> // Khali div taake date hamesha right par rahe
//               )}

//               <p className="text-xs text-text-subtle">
//                 {new Date(review._createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
// "use client";

// import { useState } from "react";
// import { ProductReview } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import {
//   Star,
//   UserCircle,
//   ChevronDown,
//   ChevronUp,
//   ShieldCheck,
// } from "lucide-react";
// import Image from "next/image";

// // Star rating component (no changes needed)
// const StarRating = ({ rating }: { rating: number }) => (
//   <div className="flex items-center">
//     {[1, 2, 3, 4, 5].map((star) => (
//       <Star
//         key={star}
//         size={16}
//         className={` ${
//           star <= rating
//             ? "text-yellow-400 fill-yellow-400"
//             : "text-gray-300 dark:text-gray-600"
//         }`}
//       />
//     ))}
//   </div>
// );

// export default function ProductReviews({
//   reviews,
// }: {
//   reviews: ProductReview[];
// }) {
//   const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

//   if (!reviews || reviews.length === 0) {
//     return (
//       <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
//         <p className="text-gray-600 dark:text-gray-400">
//           No reviews yet. Be the first to share your thoughts!
//         </p>
//       </div>
//     );
//   }

//   const toggleReview = (id: string) => {
//     setExpandedReviewId(expandedReviewId === id ? null : id);
//   };

//   return (
//     // Increased spacing between cards for better readability
//     <div className="space-y-4">
//       {reviews.map((review) => {
//         const isExpanded = expandedReviewId === review._id;
//         const showToggleButton =
//           review.comment.length > 200 || !!review.reviewImage;

//         return (
//           // Main Review Card
//           <div
//             key={review._id}
//             className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
//           >
//             {/* Card Header: User Info & Date */}
//             <div className="flex justify-between items-start">
//               <div className="flex items-start gap-4">
//                 {review.user?.image ? (
//                   <Image
//                     src={review.user.image}
//                     alt={review.user.name}
//                     width={40}
//                     height={40}
//                     className="rounded-full object-cover"
//                   />
//                 ) : (
//                   <UserCircle className="w-10 h-10 text-gray-400 dark:text-gray-500 shrink-0" />
//                 )}
//                 <div>
//                   <p className="font-semibold text-gray-800 dark:text-gray-100">
//                     {review.user?.name || "Anonymous"}
//                   </p>
//                   <StarRating rating={review.rating} />
//                 </div>
//               </div>
//               <p className="text-xs text-gray-500 dark:text-gray-400 shrink-0 pl-2">
//                 {new Date(review._createdAt).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>

//             {/* Verified Purchase Badge (Professional Touch) */}
//             <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 font-medium">
//               <ShieldCheck size={14} />
//               <span>Verified Purchase</span>
//             </div>

//             {/* Review Comment Section */}
//             <div className="mt-4">
//               <p
//                 className={`text-gray-600 dark:text-gray-300 text-sm transition-all duration-300 prose prose-sm max-w-none ${
//                   !isExpanded && showToggleButton ? "line-clamp-3" : ""
//                 }`}
//               >
//                 {review.comment}
//               </p>
//             </div>

//             {/* Expandable Content (Image) */}
//             <div
//               className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                 isExpanded
//                   ? "max-h-[1000px] opacity-100 pt-4"
//                   : "max-h-0 opacity-0"
//               }`}
//             >
//               {review.reviewImage && (
//                 <div>
//                   <Image
//                     src={urlFor(review.reviewImage).width(400).url()}
//                     alt={`Review image by ${review.user?.name}`}
//                     width={400}
//                     height={400}
//                     className="rounded-lg object-cover max-h-80 w-auto"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Read More Button */}
//             {showToggleButton && (
//               <div className="mt-3">
//                 <button
//                   onClick={() => toggleReview(review._id)}
//                   className="text-brand-primary font-semibold text-sm flex items-center gap-1 hover:underline"
//                 >
//                   {isExpanded ? "Show Less" : "Show More"}
//                   {isExpanded ? (
//                     <ChevronUp size={16} />
//                   ) : (
//                     <ChevronDown size={16} />
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { ProductReview } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import { Star, UserCircle, ChevronDown, ChevronUp, Check } from "lucide-react";
import Image from "next/image";

// Star Component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={` ${
          star <= rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-200 dark:text-gray-700"
        }`}
      />
    ))}
  </div>
);

export default function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  if (!reviews || reviews.length === 0) return null;

  const toggleReview = (id: string) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  return (
    // Gap Reduced
    <div className="flex flex-col space-y-4 md:space-y-6">
      {reviews.map((review) => {
        const isExpanded = expandedReviewId === review._id;
        const showToggleButton = review.comment.length > 100 || !!review.reviewImage; // Reduced check length

        return (
          // 🔥 PADDING REDUCED: p-5 -> p-4 (20px -> 16px)
          <div
            key={review._id}
            className="flex flex-col w-full bg-white dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            {/* Header */}
            {/* Gap Reduced */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-700 shrink-0">
                        {review.user?.image ? (
                            <Image src={review.user.image} alt={review.user.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <UserCircle size={22} />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                            {review.user?.name || "Customer"}
                        </p>
                        <StarRating rating={review.rating} />
                    </div>
                </div>
                
                {/* Date */}
                <span className="text-xs text-gray-400 shrink-0">
                    {new Date(review._createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
            </div>
            
            {/* Verified Badge Positioned Below User Info */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 mb-2">
                 <Check size={12} strokeWidth={3} />
                 <span>Verified Purchase</span>
            </div>


            {/* Content (By default line-clamp-2) */}
            <div className="grow">
                <p 
                    className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}
                >
                    {review.comment}
                </p>

                {/* Expandable Image */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded && review.reviewImage ? 'max-h-80 mt-4' : 'max-h-0'}`}>
                    {review.reviewImage && (
                        <div className="relative max-h-60 w-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 aspect-4/3">
                             <Image 
                                src={urlFor(review.reviewImage).url()} 
                                alt="Review" 
                                fill 
                                className="object-contain p-2"
                             />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions (Moved Button to the right corner) */}
            <div className="pt-2 flex justify-end">
                 {showToggleButton && (
                    <button onClick={() => toggleReview(review._id)} className="text-xs font-bold text-gray-500 hover:text-brand-primary flex items-center gap-1 transition-colors">
                        {isExpanded ? "Show Less" : "Show More"}
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                 )}
            </div>

          </div>
        );
      })}
    </div>
  );
}