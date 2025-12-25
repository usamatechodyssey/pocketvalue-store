// "use client";

// import { useState } from "react";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import SanityProduct from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import ProductCard from "@/app/components/product/ProductCard";
// import QuickViewModal from "@/app/components/product/QuickViewModal";

// // ... (interfaces remain the same)
// interface Banner {
//   tag?: string;
//   bannerImage: any;
//   link?: string;
// }
// interface ProductCarouselProps {
//   title?: string;
//   products: SanityProduct[];
//   banner?: Banner;
//   viewAllLink?: string;
//   hideHeader?: boolean;
// }


// export default function ProductCarousel({
//   title,
//   products,
//   banner,
//   viewAllLink = "/search",
//   hideHeader = false,
// }: ProductCarouselProps) {
//   // ... (state and AnimationPlugin remain the same)
//   const [quickViewProduct, setQuickViewProduct] =
//     useState<SanityProduct | null>(null);
//   const [loaded, setLoaded] = useState(false);

//   const AnimationPlugin = (slider: any) => {
//     let timeout: ReturnType<typeof setTimeout>;
//     let mouseOver = false;
//     function clearNextTimeout() {
//       clearTimeout(timeout);
//     }
//     function nextTimeout() {
//       clearTimeout(timeout);
//       if (mouseOver) return;
//       timeout = setTimeout(() => {
//         slider.next();
//       }, 3000);
//     }
//     slider.on("created", () => {
//       slider.container.addEventListener("mouseover", () => {
//         mouseOver = true;
//         clearNextTimeout();
//       });
//       slider.container.addEventListener("mouseout", () => {
//         mouseOver = false;
//         nextTimeout();
//       });
//       nextTimeout();
//     });
//     slider.on("dragStarted", clearNextTimeout);
//     slider.on("animationEnded", nextTimeout);
//     slider.on("updated", nextTimeout);
//   };


//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
//     {
//       created: () => setLoaded(true),
//       loop: products.length > 2,
//       mode: "snap",
//       // Mobile: 2.2 items to show a hint of the next card, with spacing
//       slides: { perView: 2.2, spacing: 16 },
//       breakpoints: {
//         // CHANGE 1: Added spacing for md and up
//         "(min-width: 768px)": {
//           slides: { perView: 3, spacing: 16 },
//         },
//         "(min-width: 1024px)": {
//           slides: { perView: "auto", spacing: 16 },
//         },
//       },
//     },
//     [AnimationPlugin]
//   );

//   if (!products || products.length === 0) return null;

//   // ... (link logic remains the same)
//   let finalViewAllLink = viewAllLink;
//   if (title && viewAllLink === "/search") {
//     const lowerTitle = title.toLowerCase();
//     if (lowerTitle.includes("new")) finalViewAllLink = "/search?sort=newest";
//     else if (lowerTitle.includes("best"))
//       finalViewAllLink = "/search?sort=best-selling";
//     else if (lowerTitle.includes("featured"))
//       finalViewAllLink = "/search?filter=isFeatured";
//   }


//   return (
//     <section className="w-full py-12 md:py-8 bg-white dark:bg-gray-950">
//       {/* Removed border-t */}
//       <div className="max-w-[1920px] mx-auto">
//       <div className="px-4 md:px-8">
//         {!hideHeader && title && (
//           <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
//             <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
//               {title}
//             </h2>
//             <Link
//               href={finalViewAllLink}
//               className="group flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-all"
//             >
//               View All{" "}
//               <ArrowRight
//                 size={16}
//                 className="group-hover:translate-x-1 transition-transform"
//               />
//             </Link>
//           </div>
//         )}
//       </div>

//         {/* === CONTENT WRAPPER - Removed borders */}
//         <div className="flex flex-col xl:flex-row items-stretch">
//           {/* === SIDE BANNER (FIXED) === */}
//           {banner && banner.bannerImage && (
//             <div className="hidden xl:block shrink-0 w-[280px] relative group overflow-hidden z-20 ml-8">
//               <Link
//                 href={banner.link || "#"}
//                 className="block w-full h-full relative"
//               >
//                 <Image
//                   src={urlFor(banner.bannerImage).url()}
//                   alt={title || "Banner"}
//                   fill
//                   className="object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
//               </Link>
//             </div>
//           )}

//           {/* === PRODUCT SLIDER === */}
//           <div className="relative flex-1 min-w-0 group/slider z-10">
//             <div
//               ref={sliderRef}
//               className={`keen-slider h-full pl-4 md:pl-8 ${loaded ? "opacity-100" : "opacity-0"}`}
//               style={{ transition: "opacity 0.5s ease-in" }}
//             >
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   // CHANGE 2: Removed border class from here
//                   className="keen-slider__slide h-full min-w-0 lg:min-w-[220px] lg:max-w-[280px]"
//                 >
//                   <ProductCard
//                     product={product}
//                     onQuickView={setQuickViewProduct}
//                     // CHANGE 3: Removed all extra classes, as they are now on the card itself
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* === ARROWS (Hover Only) === */}
//             {loaded && instanceRef.current && products.length > 2 && (
//               <>
//                 <button
//                   onClick={() => instanceRef.current?.prev()}
//                   className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 dark:bg-black/50 hover:bg-white text-black items-center justify-center shadow-xl z-30 rounded-r-xl transition-all duration-300 opacity-0 -translate-x-full group-hover/slider:translate-x-0 group-hover/slider:opacity-100 border-y border-r border-gray-200 dark:border-gray-700"
//                 >
//                   <ChevronLeft size={24} />
//                 </button>
//                 <button
//                   onClick={() => instanceRef.current?.next()}
//                   className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 dark:bg-black/50 hover:bg-white text-black items-center justify-center shadow-xl z-30 rounded-l-xl transition-all duration-300 opacity-0 translate-x-full group-hover/slider:translate-x-0 group-hover/slider:opacity-100 border-y border-l border-gray-200 dark:border-gray-700"
//                 >
//                   <ChevronRight size={24} />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <QuickViewModal
//         product={quickViewProduct}
//         isOpen={!!quickViewProduct}
//         onClose={() => setQuickViewProduct(null)}
//       />
//     </section>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SanityProduct from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import ProductCard from "@/app/components/product/ProductCard";
import QuickViewModal from "@/app/components/product/QuickViewModal";
import ProductCardSkeleton from "@/app/components/product/ProductCardSkeleton"; 

// --- Interfaces ---
interface Banner {
  tag?: string;
  bannerImage: any;
  link?: string;
}

interface ProductCarouselProps {
  title?: string;
  products: SanityProduct[];
  banner?: Banner;
  viewAllLink?: string;
  hideHeader?: boolean;
}

// --- Animation Plugin ---
const AnimationPlugin = (slider: any) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;
  function clearNextTimeout() { clearTimeout(timeout); }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => { slider.next(); }, 3000);
  }
  slider.on("created", nextTimeout);
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
  slider.on("destroyed", clearNextTimeout);
  slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNextTimeout(); });
  slider.container.addEventListener("mouseout", () => { mouseOver = false; nextTimeout(); });
};

// --- Main Component ---
export default function ProductCarousel({
  title,
  products,
  banner,
  viewAllLink = "/search",
  hideHeader = false,
}: ProductCarouselProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<SanityProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      created: () => setLoaded(true),
      loop: products.length > 3,
      mode: "snap",
      // CHANGE 1: Spacing 0 kardia (gap hum CSS padding se control karenge taake layout shift na ho)
      slides: { perView: 2, spacing: 0 }, 
      breakpoints: {
        "(min-width: 768px)": { slides: { perView: 3, spacing: 0 } }, 
        "(min-width: 1024px)": { slides: { perView: "auto", spacing: 0 } }, 
      },
    },
    [AnimationPlugin]
  );

  useEffect(() => {
    if (loaded && instanceRef.current) {
      instanceRef.current.update();
    }
  }, [loaded, instanceRef, products]);

  if (!products || products.length === 0) return null;

  // Link Logic
  let finalViewAllLink = viewAllLink;
  if (title && viewAllLink === "/search") {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("new")) finalViewAllLink = "/search?sort=newest";
    else if (lowerTitle.includes("best")) finalViewAllLink = "/search?sort=best-selling";
    else if (lowerTitle.includes("featured")) finalViewAllLink = "/search?filter=isFeatured";
  }

  return (
    <section className="w-full py-12 md:py-12 bg-white dark:bg-gray-950">
      <div className="max-w-[1920px] mx-auto">
        <div className="px-4 md:px-8">
          {!hideHeader && title && (
            <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
              <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                {title}
              </h2>
              <Link
                href={finalViewAllLink}
                className="group flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-brand-primary hover:text-brand-secondary transition-all"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col xl:flex-row items-stretch">
          {banner && banner.bannerImage && (
            <div className="hidden xl:block shrink-0 w-[280px] relative group overflow-hidden z-20">
              <Link href={banner.link || "#"} className="block w-full h-full relative">
                <Image 
                  src={urlFor(banner.bannerImage).url()} 
                  alt={title || "Banner"} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </Link>
            </div>
          )}

          <div className="relative flex-1 min-w-0 group/slider z-10">
            <div ref={sliderRef} className="keen-slider h-full flex">
              {products.map((product, index) => (
                <div
                  key={product._id || index}
                  // CHANGE 2: 'px-2' ko hata kar 'px-1' kardia.
                  // px-1 = 4px padding left + 4px padding right = 8px Total Gap.
                  className={`
                    keen-slider__slide h-full px-1
                    min-w-[50%] max-w-[50%]                 
                    md:min-w-[33.333%] md:max-w-[33.333%]   
                    lg:min-w-[220px] lg:max-w-[280px]       
                  `}
                >
                  {!loaded ? (
                    <ProductCardSkeleton />
                  ) : (
                    <ProductCard product={product} onQuickView={setQuickViewProduct} />
                  )}
                </div>
              ))}
            </div>

            {/* Arrows */}
            {loaded && instanceRef.current && products.length > 2 && (
              <>
                <button
                  onClick={() => instanceRef.current?.prev()}
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 dark:bg-black/50 hover:bg-white text-black items-center justify-center shadow-xl z-30 rounded-r-xl transition-all duration-300 opacity-0 -translate-x-full group-hover/slider:translate-x-0 group-hover/slider:opacity-100 border-y border-r border-gray-200 dark:border-gray-700"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 w-10 h-20 bg-white/90 dark:bg-black/50 hover:bg-white text-black items-center justify-center shadow-xl z-30 rounded-l-xl transition-all duration-300 opacity-0 translate-x-full group-hover/slider:translate-x-0 group-hover/slider:opacity-100 border-y border-l border-gray-200 dark:border-gray-700"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}