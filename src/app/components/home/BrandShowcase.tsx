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
// app/components/home/BrandShowcase.tsx (THE FINAL, POLISHED VERSION)

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

const INITIAL_VISIBLE_BRANDS = 8;

export default function BrandShowcase({ brands }: BrandShowcaseProps) {
  const [showAll, setShowAll] = useState(false);

  if (!brands || brands.length === 0) return null;

  const visibleBrands = showAll ? brands : brands.slice(0, INITIAL_VISIBLE_BRANDS);

  return (
    // === 1. CONSISTENT BACKGROUND APPLIED ===
    <div className="w-full brand-gradient-bg dark:bg-gray-900/50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100 tracking-tight">
            Shop by Top Brands
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary dark:text-gray-300">
            We partner with the best to bring you quality you can trust.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6 transition-all duration-700 ease-in-out">
          {visibleBrands.map((brand) => (
            <Link
              key={brand._id}
              href={`/search?brand=${brand.slug}`}
              className="group"
            >
              <div className="relative p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center aspect-square overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-brand-primary/50 hover:-translate-y-1.5">
                <Image
                  src={urlFor(brand.logo).url()}
                  alt={`${brand.name} Logo`}
                  width={100}
                  height={100}
                  // === 2. GRAYSCALE HOVER EFFECT ADDED ===
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-in-out"
                />
                {/* Aapka behtareen overlay effect waisa hi hai */}
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-base font-bold tracking-wider">
                    {brand.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {brands.length > INITIAL_VISIBLE_BRANDS && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-white dark:bg-gray-800 text-text-primary dark:text-gray-200 font-semibold rounded-lg shadow-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-lg transition-all"
            >
              <span>{showAll ? "Show Less Brands" : "View All Brands"}</span>
              {showAll ? (
                <FiChevronUp size={18} />
              ) : (
                <FiChevronDown size={18} />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}