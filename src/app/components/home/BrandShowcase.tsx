// // app/components_copy/BrandShowcase.tsx (THE FINAL, PERFECTED VERSION)

// "use client";

// import { useState } from "react";
// import { SanityBrand } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import Link from "next/link";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// interface BrandShowcaseProps {
//   brands: SanityBrand[];
// }

// const INITIAL_VISIBLE_BRANDS = 8; // Shuru mein kitne brands dikhane hain

// export default function BrandShowcase({ brands }: BrandShowcaseProps) {
//   const [showAll, setShowAll] = useState(false);

//   if (!brands || brands.length === 0) return null;

//   // Shuru mein dikhane wale brands, ya saare (agar 'showAll' true hai)
//   const visibleBrands = showAll
//     ? brands
//     : brands.slice(0, INITIAL_VISIBLE_BRANDS);

//   return (
//     <div className="bg-surface-ground py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
//             Shop by Top Brands
//           </h2>
//           <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary">
//             We partner with the best to bring you quality you can trust.
//           </p>
//         </div>

//         {/* NAYA COMPACT GRID */}
//         {/* 'transition-all' aur 'duration-700' smooth animation ke liye hain */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 transition-all duration-700 ease-in-out">
//           {visibleBrands.map((brand) => (
//             <Link
//               key={brand._id}
//               href={`/search?brand=${brand.slug}`}
//               className="group"
//             >
//               <div className="relative p-4 bg-white rounded-lg border border-surface-border flex items-center justify-center aspect-square overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-brand-primary">
//                 <Image
//                   src={urlFor(brand.logo).url()}
//                   alt={`${brand.name} Logo`}
//                   width={100}
//                   height={100}
//                   className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-90" // NAYA: Zoom out effect
//                 />
//                 {/* Hover Magic: Overlay Effect */}
//                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <span className="text-white text-sm font-bold tracking-wider">
//                     {brand.name}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* NAYA "SHOW MORE / SHOW LESS" BUTTON */}
//         {brands.length > INITIAL_VISIBLE_BRANDS && (
//           <div className="text-center mt-12">
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="flex items-center gap-2 mx-auto px-6 py-3 bg-surface-base text-text-primary font-semibold rounded-lg shadow-sm border border-surface-border hover:bg-surface-border transition-colors"
//             >
//               <span>{showAll ? "Show Less Brands" : "View All Brands"}</span>
//               {showAll ? (
//                 <FiChevronUp size={18} />
//               ) : (
//                 <FiChevronDown size={18} />
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { SanityBrand } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface BrandShowcaseProps {
  brands: SanityBrand[];
}

const INITIAL_VISIBLE_BRANDS = 14; 

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
  const [showAll, setShowAll] = useState(false);

  if (!brands || brands.length === 0) return null;

  const visibleBrands = showAll ? brands : brands.slice(0, INITIAL_VISIBLE_BRANDS);

  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            Official Partners
          </h2>
          <div className="w-16 h-1 bg-brand-primary mt-3 rounded-full"></div>
          <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400">
            We collaborate with the world's best brands for guaranteed quality.
          </p>
        </div>

        {/* BRAND GRID */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 gap-4 md:gap-6">
          {visibleBrands.map((brand) => (
            <Link
              key={brand._id}
              href={`/search?brand=${brand.slug}`}
              className="group block"
            >
              <div 
                className="
                  relative w-full aspect-4/3 
                  bg-white dark:bg-gray-800 
                  rounded-xl border border-gray-200 dark:border-gray-700 
                  flex items-center justify-center p-0 /* Padding removed from outer div */
                  overflow-hidden transition-all duration-300 
                  hover:shadow-xl hover:border-brand-primary/30
                  group-hover:-translate-y-1
                "
              >
                {/* LOGO: BRIGHT & CONTAIN */}
                <Image
                  src={urlFor(brand.logo).url()}
                  alt={`${brand.name} Logo`}
                  fill
                  className="
                    /* 🔥 FIX 1: Grayscale & Opacity Hata Diye */
                    object-contain p-2 /* 🔥 FIX 2: Halka Sa Padding for Contain */
                    transition-all duration-500 ease-in-out
                  "
                  sizes="(max-width: 640px) 33vw, 15vw" 
                />
                
              </div>
              <p className="mt-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-brand-primary transition-colors">
                {brand.name}
              </p>
            </Link>
          ))}
        </div>

        {/* LOAD MORE BUTTON */}
        {brands.length > INITIAL_VISIBLE_BRANDS && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="
                group relative inline-flex items-center gap-2 
                px-8 py-3 
                bg-white dark:bg-gray-900 
                text-gray-900 dark:text-white 
                font-bold text-sm uppercase tracking-widest 
                rounded-full border border-gray-200 dark:border-gray-800 
                hover:border-brand-primary dark:hover:border-brand-primary 
                hover:text-brand-primary dark:hover:text-brand-primary 
                transition-all duration-300 shadow-sm hover:shadow-md
              "
            >
              <span>{showAll ? "Show Less" : "View All Brands"}</span>
              {showAll ? (
                <FiChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <FiChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
// "use client";

// import { useState } from "react";
// import { SanityBrand } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import Link from "next/link";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// interface BrandShowcaseProps {
//   brands: SanityBrand[];
// }

// const INITIAL_VISIBLE_BRANDS = 12; // Start showing 12 brands (2 rows on desktop)

// export default function BrandShowcase({ brands }: BrandShowcaseProps) {
//   const [showAll, setShowAll] = useState(false);

//   if (!brands || brands.length === 0) return null;

//   const visibleBrands = showAll ? brands : brands.slice(0, INITIAL_VISIBLE_BRANDS);

//   return (
//     <section className="w-full py-12 md:py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
//       <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        
//         {/* === HEADER (Matches ProductCarousel Style) === */}
//         <div className="flex flex-col items-center text-center mb-10 md:mb-12">
//           <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
//             Our Top Brands
//           </h2>
//           <div className="w-16 h-1 bg-brand-primary mt-3 rounded-full"></div>
//           <p className="mt-4 max-w-2xl text-sm md:text-base text-gray-500 dark:text-gray-400">
//             Official partners providing the quality you trust.
//           </p>
//         </div>

//         {/* === BRAND GRID === */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
//           {visibleBrands.map((brand) => (
//             <Link
//               key={brand._id}
//               href={`/search?brand=${brand.slug}`}
//               className="group block"
//             >
//               <div 
//                 className="
//                   relative w-full aspect-4/3 
//                   bg-gray-50 dark:bg-white/5 
//                   rounded-xl border border-gray-100 dark:border-gray-800 
//                   flex items-center justify-center p-6 
//                   overflow-hidden transition-all duration-300 
//                   hover:shadow-lg hover:border-brand-primary/30 dark:hover:border-brand-primary/30
//                   group-hover:-translate-y-1
//                 "
//               >
//                 {/* 
//                    🔥 PERFORMANCE FIX:
//                    - 'fill' use kiya taake responsive container mein fit ho.
//                    - 'sizes' prop batata hai ke image actual mein kitni bari hai.
//                    - 'object-contain' taake logo kate nahi.
//                 */}
//                 <Image
//                   src={urlFor(brand.logo).url()}
//                   alt={`${brand.name} Logo`}
//                   fill
//                   className="
//                     object-contain p-4 
//                     filter grayscale opacity-70 
//                     group-hover:grayscale-0 group-hover:opacity-100 
//                     transition-all duration-500 ease-in-out
//                   "
//                   sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
//                 />
//               </div>
//               <p className="mt-3 text-center text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-brand-primary transition-colors">
//                 {brand.name}
//               </p>
//             </Link>
//           ))}
//         </div>

//         {/* === LOAD MORE BUTTON (Matches InfiniteGrid Style) === */}
//         {brands.length > INITIAL_VISIBLE_BRANDS && (
//           <div className="mt-12 flex justify-center">
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="
//                 group relative inline-flex items-center gap-2 
//                 px-8 py-3 
//                 bg-white dark:bg-gray-900 
//                 text-gray-900 dark:text-white 
//                 font-bold text-sm uppercase tracking-widest 
//                 rounded-full border border-gray-200 dark:border-gray-800 
//                 hover:border-brand-primary dark:hover:border-brand-primary 
//                 hover:text-brand-primary dark:hover:text-brand-primary 
//                 transition-all duration-300 shadow-sm hover:shadow-md
//               "
//             >
//               <span>{showAll ? "Show Less" : "View All Brands"}</span>
//               {showAll ? (
//                 <FiChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
//               ) : (
//                 <FiChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
// // app/components/home/BrandShowcase.tsx (THE FINAL, POLISHED VERSION)

// "use client";

// import { useState } from "react";
// import { SanityBrand } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import Link from "next/link";
// import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// interface BrandShowcaseProps {
//   brands: SanityBrand[];
// }

// const INITIAL_VISIBLE_BRANDS = 8;

// export default function BrandShowcase({ brands }: BrandShowcaseProps) {
//   const [showAll, setShowAll] = useState(false);

//   if (!brands || brands.length === 0) return null;

//   const visibleBrands = showAll ? brands : brands.slice(0, INITIAL_VISIBLE_BRANDS);

//   return (
//     // === 1. CONSISTENT BACKGROUND APPLIED ===
//     <div className="w-full brand-gradient-bg dark:bg-gray-900/50 py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100 tracking-tight">
//             Shop by Top Brands
//           </h2>
//           <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary dark:text-gray-300">
//             We partner with the best to bring you quality you can trust.
//           </p>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 transition-all duration-700 ease-in-out">
//           {visibleBrands.map((brand) => (
//             <Link
//               key={brand._id}
//               href={`/search?brand=${brand.slug}`}
//               className="group"
//             >
//               <div className="relative p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-square overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-brand-primary/50 hover:-translate-y-1.5">
//                 <Image
//                   src={urlFor(brand.logo).url()}
//                   alt={`${brand.name} Logo`}
//                   width={100}
//                   height={100}
//                   // === 2. GRAYSCALE HOVER EFFECT ADDED ===
//                   className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
//                 />
//                 {/* Aapka behtareen overlay effect waisa hi hai */}
//                 <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <span className="text-white text-base font-bold tracking-wider">
//                     {brand.name}
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {brands.length > INITIAL_VISIBLE_BRANDS && (
//           <div className="text-center mt-12">
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="flex items-center gap-2 mx-auto px-6 py-3 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-200 font-semibold rounded-lg shadow-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all"
//             >
//               <span>{showAll ? "Show Less Brands" : "View All Brands"}</span>
//               {showAll ? (
//                 <FiChevronUp size={18} />
//               ) : (
//                 <FiChevronDown size={18} />
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }