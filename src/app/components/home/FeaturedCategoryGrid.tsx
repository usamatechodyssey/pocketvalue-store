// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";

// interface GridCategory {
//   _key: string;
//   discountText: string;
//   category: SanityCategory;
// }

// interface Props {
//   title: string;
//   categories: GridCategory[];
// }

// export default function FeaturedCategoryGrid({ title, categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   return (
//     <section className="w-full py-12 md:py-16">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-gray-900">
//         <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 uppercase tracking-wider">
//           {title || "SHOP BY CATEGORY"}
//         </h2>
        
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
//           {categories.map((item, index) => {
//             // SAFETY CHECK: Agar category null ho to skip karo (Zaruri hai)
//             if (!item.category) return null;

//             // UNIQUE KEY: Combining _key and index
//             const uniqueKey = item._key || `cat-grid-${index}`;

//             return (
//               <Link
//                 key={uniqueKey} 
//                 href={`/category/${item.category.slug}`}
//                 className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
//               >
//                 <div className="relative aspect-3/4 w-full bg-gray-200 dark:bg-gray-800">
//                   {item.category.image ? (
//                     <Image
//                       src={urlFor(item.category.image).width(400).height(600).url()}
//                       alt={item.category.name}
//                       fill
//                       sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
//                       className="object-cover transition-transform duration-700 group-hover:scale-105"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
//                       <span className="text-sm text-gray-400 font-medium">
//                         {item.category.name}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Gradient Overlay for Text */}
//                   <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
//                   {/* Text Content */}
//                   <div className="absolute bottom-0 left-0 p-4 w-full">
//                     <h3 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-md">
//                         {item.category.name}
//                     </h3>
//                     {item.discountText && (
//                         <p className="text-sm font-bold text-brand-primary uppercase tracking-wider">
//                         {item.discountText}
//                         </p>
//                     )}
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import { ArrowRight } from "lucide-react";

// interface GridCategory {
//   _key: string;
//   discountText: string;
//   category: SanityCategory;
// }

// interface Props {
//   title: string;
//   categories: GridCategory[];
// }

// export default function FeaturedCategoryGrid({ title, categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   return (
//     <section className="w-full py-12 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        
//         {/* === HEADER (Consistent with BrandShowcase & InfiniteGrid) === */}
//         <div className="flex flex-col items-center text-center mb-10 md:mb-14">
//           <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
//             {title || "Shop By Category"}
//           </h2>
//           <div className="w-16 h-1 bg-brand-primary mt-3 rounded-full"></div>
//           <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400">
//             Explore our wide range of collections curated just for you.
//           </p>
//         </div>
        
//         {/* === GRID LAYOUT === */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
//           {categories.map((item, index) => {
//             if (!item.category) return null;
//             const uniqueKey = item._key || `cat-grid-${index}`;

//             return (
//               <Link
//                 key={uniqueKey} 
//                 href={`/category/${item.category.slug}`}
//                 className="group relative block w-full"
//               >
//                 {/* 
//                   CARD CONTAINER 
//                   - Mobile: Rounded-xl for app-feel
//                   - Desktop: Rounded-2xl for premium feel
//                   - Aspect Ratio: 3/4 (Vertical/Portrait) ideal for fashion
//                 */}
//                 <div className="
//                   relative w-full aspect-3/4 
//                   overflow-hidden rounded-xl md:rounded-2xl 
//                   bg-gray-100 dark:bg-gray-800 
//                   shadow-sm hover:shadow-xl dark:shadow-none
//                   transition-all duration-500 ease-out
//                   group-hover:-translate-y-1
//                 ">
                  
//                   {/* === IMAGE === */}
//                   {item.category.image ? (
//                     <Image
//                       // Server-side resize to 600x800 (3:4 Ratio) for performance
//                       src={urlFor(item.category.image).width(600).height(800).url()}
//                       alt={item.category.name}
//                       fill
//                       // Optimized sizes for 2-column mobile and 5-column desktop
//                       sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
//                       className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
//                     />
//                   ) : (
//                     // Fallback if no image
//                     <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-800">
//                       <span className="text-2xl font-bold text-gray-400 opacity-20 uppercase">
//                         {item.category.name.charAt(0)}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* === GRADIENT OVERLAY (For Text Readability) === */}
//                   <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  
//                   {/* === CONTENT === */}
//                   <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    
//                     {/* Discount Tag (Appears/Glows on Hover) */}
//                     {item.discountText && (
//                       <div className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold bg-brand-primary text-white uppercase tracking-wider shadow-lg transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
//                         {item.discountText}
//                       </div>
//                     )}

//                     {/* Category Name */}
//                     <div className="flex items-end justify-between gap-2">
//                       <h3 className="text-lg md:text-xl font-bold text-white leading-none tracking-wide drop-shadow-md">
//                         {item.category.name}
//                       </h3>
                      
//                       {/* Arrow Icon (Only shows on Desktop Hover) */}
//                       <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
//                         <ArrowRight size={14} />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }
// /src/app/components/home/FeaturedCategoryGrid.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight } from "lucide-react";

interface GridCategory {
  _key: string;
  discountText: string;
  category: SanityCategory;
}

interface Props {
  title: string;
  categories: GridCategory[];
}

export default function FeaturedCategoryGrid({ title, categories }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            {title || "Shop By Category"}
          </h2>
          <div className="w-16 h-1 bg-brand-primary mt-3 rounded-full"></div>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400">
            Explore our wide range of collections curated just for you.
          </p>
        </div>
        
        {/* === GRID LAYOUT (Finalized Breakpoints) === */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {categories.map((item, index) => {
            if (!item.category) return null;
            const uniqueKey = item._key || `cat-grid-${index}`;

            return (
              <Link
                key={uniqueKey} 
                href={`/category/${item.category.slug}`}
                className="group relative block w-full"
              >
                {/* CARD CONTAINER */}
                <div className="
                  relative w-full aspect-3/4 
                  overflow-hidden rounded-xl md:rounded-2xl 
                  bg-gray-100 dark:bg-gray-800 
                  shadow-md hover:shadow-xl dark:shadow-none
                  transition-all duration-500 ease-out
                  group-hover:-translate-y-1
                ">
                  
                  {/* IMAGE */}
                  {item.category.image ? (
                    <Image
                      src={urlFor(item.category.image).width(600).height(800).url()}
                      alt={item.category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    />
                  ) : (
                    // Fallback
                    <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-800">
                      <span className="text-2xl font-bold text-gray-400 opacity-20 uppercase">
                        {item.category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-opacity duration-300" />
                  
                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    
                    {/* Discount Tag */}
                    {item.discountText && (
                      <div className="inline-block mb-2 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold bg-brand-primary text-white uppercase tracking-wider shadow-lg transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                        {item.discountText}
                      </div>
                    )}

                    {/* Category Name */}
                    <div className="flex items-end justify-between gap-2">
                      <h3 className="text-lg md:text-xl font-bold text-white leading-none tracking-wide drop-shadow-md">
                        {item.category.name}
                      </h3>
                      
                      {/* Arrow Icon */}
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}