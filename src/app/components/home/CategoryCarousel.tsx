// // app/components/home/CategoryCarousel.tsx (THE FINAL POLISHED VERSION)

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import "@/app/styles/CategoryCarousel.css"; // Yeh file wesi hi rahegi

// interface Props {
//   title: string;
//   categories: SanityCategory[];
// }

// // Function ka naam bhi update kar diya gaya hai
// export default function CategoryCarousel({ title, categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   // tracks ki logic wesi hi rahegi
//   const tracks = [0, 1];

//   return (
//     // === 1. CONSISTENT BACKGROUND APPLIED ===
//     <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-12 md:py-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Title ko uncomment kar ke behtar style diya gaya hai */}
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary dark:text-gray-100 mb-10">
//           {/* {title || "Shop By Category"} */}
//         </h2>
//       </div>

//       {/* Aapka auto-scrolling container waisa hi rahega */}
//       <div className="category-carousel-container">
//         <div className="category-carousel-scroller">
//           {tracks.map((trackIndex) => (
//             <div
//               key={trackIndex}
//               className="category-carousel-track"
//               aria-hidden={trackIndex === 1}
//             >
//               {categories.map((category) => (
//                 // Wrapper ko thori si padding di gayi hai
//                 <div key={category._id} className="category-item-wrapper px-3">
//                   <Link
//                     href={`/category/${category.slug}`}
//                     className="group text-center block"
//                   >
//                     {/* === 2. "FLOATING GLASS" DESIGN APPLIED === */}
//                     <div
//                       className="
//                           relative aspect-square w-full max-w-[220px] mx-auto rounded-2xl 
//                           overflow-hidden transition-all duration-300
//                           group-hover:shadow-xl group-hover:-translate-y-1.5
//                           border border-white/20
//                           bg-white/60 dark:bg-white/10
//                           backdrop-blur-lg
//                         "
//                     >
//                       {category.image ? (
//                         <Image
//                           src={urlFor(category.image)
//                             .width(250)
//                             .height(250)
//                             .url()}
//                           alt={category.name}
//                           fill
//                           sizes="15vw"
//                           // 'object-cover' for edge-to-edge look
//                           className="object-cover transition-transform duration-300 group-hover:scale-110"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full">
//                           <span className="text-xs text-text-subtle p-2">
//                             {category.name}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                     {/* ======================================= */}

//                     <h3 className="mt-4 text-sm font-semibold text-text-primary dark:text-gray-200 group-hover:text-brand-primary transition-colors">
//                       {category.name}
//                     </h3>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ))}
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
// import "@/app/styles/CategoryCarousel.css"; 

// interface Props {
//   title: string;
//   categories: SanityCategory[];
// }

// export default function CategoryCarousel({ title, categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   const tracks = [0, 1];

//   return (
//     <section className="w-full py-8 md:py-12 overflow-hidden bg-white dark:bg-gray-950">
      
//       <div className="category-carousel-container relative">
        
//         {/* 
//             NO SIDE FADES HERE 
//             Humne koi side mask ya gradient div nahi lagaya.
//             Content edge-to-edge clear dikhega.
//         */}

//         <div className="category-carousel-scroller flex hover:pause-animation">
//           {tracks.map((trackIndex) => (
//             <div
//               key={trackIndex}
//               className="category-carousel-track flex gap-5 px-2.5"
//               aria-hidden={trackIndex === 1}
//             >
//               {categories.map((category) => (
//                 <div 
//                   key={category._id} 
//                   // === RESPONSIVE SIZING MAGIC ===
//                   // md (Tablet): 200px
//                   // lg (Laptop): 220px
//                   // xl (Large Screen): 250px
//                   // 2xl (1920px Full HD): 280px (Bada aur Clear)
//                   className="category-item-wrapper shrink-0 w-[200px] lg:w-[220px] xl:w-[250px] 2xl:w-[280px]"
//                 >
//                   <Link
//                     href={`/category/${category.slug}`}
//                     className="group block h-full relative"
//                   >
//                     <div
//                       className="
//                           relative aspect-3/4 w-full rounded-[20px] 
//                           overflow-hidden transition-all duration-500 ease-out
//                           bg-gray-100 dark:bg-gray-800
//                           border border-gray-200 dark:border-gray-700
//                           group-hover:shadow-xl group-hover:shadow-brand-primary/10
//                           group-hover:-translate-y-2
//                         "
//                     >
//                       {category.image ? (
//                         <Image
//                           src={urlFor(category.image).width(500).height(700).url()}
//                           alt={category.name}
//                           fill
//                           sizes="(max-width: 1200px) 25vw, 20vw"
//                           className="object-cover transition-transform duration-700 group-hover:scale-110"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-800">
//                           <span className="text-xs text-gray-400 font-medium">No Image</span>
//                         </div>
//                       )}

//                       {/* === TEXT AREA (NO FADE, CRYSTAL CLEAR) === */}
//                       {/* Gradient hata kar ek Glassy Bar lagaya hai */}
//                       <div className="absolute inset-x-0 bottom-0 p-4">
//                         <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md p-3 rounded-xl text-center shadow-sm border border-white/20">
//                           <h3 className="text-sm xl:text-base font-bold text-gray-900 dark:text-white tracking-wide leading-tight line-clamp-1 group-hover:text-brand-primary transition-colors">
//                             {category.name}
//                           </h3>
//                         </div>
//                       </div>

//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ))}
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
// import "@/app/styles/CategoryCarousel.css"; 

// interface Props {
//   title: string;
//   categories: SanityCategory[];
// }

// export default function CategoryCarousel({ title, categories }: Props) {
//   if (!categories || categories.length === 0) {
//     return null;
//   }

//   const tracks = [0, 1];

//   return (
//     <section className="w-full py-4 md:py-0 overflow-hidden bg-white dark:bg-gray-950  dark:border-gray-800">
      
//       <div className="category-carousel-container relative">
        
//         <div className="category-carousel-scroller flex hover:pause-animation">
//           {tracks.map((trackIndex) => (
//             <div
//               key={trackIndex}
//               className="category-carousel-track flex gap-6 px-3 py-6"
//               aria-hidden={trackIndex === 1}
//             >
//               {categories.map((category) => (
//                 <div 
//                   key={category._id} 
//                   // === RESPONSIVE SIZING CONTROL ===
//                   // Ab ye classes 100% kaam karengi
//                   // md: Tablet (130px)
//                   // lg: Laptop (150px)
//                   // xl: Desktop (170px)
//                   // 2xl: Full HD 1920px (190px - Bada Circle)
//                   className="category-item-wrapper shrink-0 w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px]"
//                 >
//                   <Link
//                     href={`/category/${category.slug}`}
//                     className="group flex flex-col items-center gap-4"
//                   >
//                     {/* === CIRCLE IMAGE === */}
//                     <div
//                       className="
//                           relative aspect-square w-full rounded-full 
//                           overflow-hidden transition-all duration-500 ease-out
//                           bg-gray-50 dark:bg-gray-800
//                           border-2 border-gray-200 dark:border-gray-700
                          
//                           /* Hover Effects */
//                           group-hover:border-brand-primary
//                           group-hover:shadow-xl group-hover:shadow-brand-primary/20
//                           group-hover:-translate-y-2
//                         "
//                     >
//                       {category.image ? (
//                         <Image
//                           src={urlFor(category.image).width(400).height(400).url()}
//                           alt={category.name}
//                           fill
//                           sizes="20vw"
//                           className="object-cover transition-transform duration-700 group-hover:scale-110"
//                         />
//                       ) : (
//                         <div className="flex items-center justify-center h-full text-gray-400">
//                           No Img
//                         </div>
//                       )}
//                     </div>

//                     {/* === TEXT === */}
//                     <h3 className="text-sm xl:text-base font-bold text-center text-gray-700 dark:text-gray-300 group-hover:text-brand-primary transition-colors leading-tight px-1">
//                       {category.name}
//                     </h3>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import "@/app/styles/CategoryCarousel.css"; 

interface Props {
  title: string;
  categories: SanityCategory[];
}

export default function CategoryCarousel({ title, categories }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Double tracks for seamless infinite scroll
  const tracks = [0, 1];

  return (
    <section className="w-full py-4 md:py-0 overflow-hidden bg-white dark:bg-gray-950">
      
      <div className="category-carousel-container relative">
        
        <div className="category-carousel-scroller flex hover:pause-animation">
          {tracks.map((trackIndex) => (
            <div
              key={trackIndex}
              className="category-carousel-track flex gap-6 px-3 py-6"
              aria-hidden={trackIndex === 1} // Accessibility: Hide duplicate track
            >
              {categories.map((category) => (
                <div 
                  key={`${trackIndex}-${category._id}`} 
                  // Responsive Sizing
                  className="category-item-wrapper shrink-0 w-[150px] lg:w-[170px] xl:w-[190px] 2xl:w-[210px]"
                >
                  <Link
                    href={`/category/${category.slug}`}
                    className="group flex flex-col items-center gap-4"
                  >
                    {/* === CIRCLE IMAGE === */}
                    <div
                      className="
                          relative aspect-square w-full rounded-full 
                          overflow-hidden transition-all duration-500 ease-out
                          bg-gray-50 dark:bg-gray-800
                          border-2 border-gray-200 dark:border-gray-700
                          group-hover:border-brand-primary
                          group-hover:shadow-xl group-hover:shadow-brand-primary/20
                          group-hover:-translate-y-2
                        "
                    >
                      {category.image ? (
                        <Image
                          src={urlFor(category.image).width(400).height(400).url()}
                          alt={category.name}
                          fill
                          sizes="20vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No Img
                        </div>
                      )}
                    </div>

                    {/* === TEXT === */}
                    <h3 className="text-sm xl:text-base font-bold text-center text-gray-700 dark:text-gray-300 group-hover:text-brand-primary transition-colors leading-tight px-1">
                      {category.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}