// // app/components/home/ProductSectionWithBanner.tsx (THE FINAL POLISHED VERSION)

// "use client";

// import { useState } from "react";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import Link from "next/link";
// import Image from "next/image";
// import SanityProduct from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";

// // Components
// import ProductCard from "@/app/components/product/ProductCard"; // Hamara naya, upgraded card
// import QuickViewModal from "@/app/components/product/QuickViewModal";

// // Types
// interface Banner {
//   tag: string;
//   bannerImage: any;
//   link?: string;
// }

// interface ProductSectionProps {
//   title: string;
//   products: SanityProduct[];
//   banner?: Banner;
//   viewAllLink?: string;
// }

// export default function ProductSectionWithBanner({
//   title,
//   products,
//   banner,
//   viewAllLink = "#",
// }: ProductSectionProps) {
//   const [quickViewProduct, setQuickViewProduct] = useState<SanityProduct | null>(null);
//   const [loaded, setLoaded] = useState(false);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
//     created: () => setLoaded(true),
//     loop: products.length > 5,
//     mode: "free-snap",
//     slides: {
//       perView: "auto",
//       spacing: 24, // Thora sa zyada space
//     },
//   });

//   if (!products || products.length === 0) {
//     return null;
//   }

//   const handleQuickView = (product: SanityProduct) => setQuickViewProduct(product);
//   const handleCloseModal = () => setQuickViewProduct(null);

//   const bannerUrl = banner ? urlFor(banner.bannerImage).url() : "";

//   return (
//     <>
//       {/* === 1. SECTION BACKGROUND & PADDING UPDATED === */}
//       <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-12 md:py-16">
//         <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">

//           {/* === 2. SECTION HEADER UPDATED === */}
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">{title}</h2>
//             <Link
//               href={viewAllLink}
//               className="text-sm font-semibold flex items-center gap-1 text-brand-primary hover:underline transition-colors"
//             >
//               View All <FiChevronRight size={16} />
//             </Link>
//           </div>

//           <div className="flex flex-row gap-6">
//             {/* === 3. BANNER POLISHED === */}
//             {banner && bannerUrl && (
//               <div className="hidden lg:block flex-shrink-0 w-[240px] rounded-xl overflow-hidden group shadow-lg">
//                 <Link
//                   href={banner.link || "#"}
//                   className="block w-full h-full relative"
//                 >
//                   <Image
//                     src={bannerUrl}
//                     alt={`${title} Banner`}
//                     fill
//                     sizes="240px"
//                     className="object-cover transition-transform duration-300 group-hover:scale-105"
//                   />
//                 </Link>
//               </div>
//             )}

//             <div className="relative flex-1 min-w-0">
//               <div
//                 ref={sliderRef}
//                 className={`keen-slider h-full ${loaded ? "opacity-100" : "opacity-0"}`}
//                 style={{ transition: "opacity 0.4s ease-in" }}
//               >
//                 {products.map((product) => (
//                   // === 4. CARD WIDTH & HEIGHT UPDATED ===
//                   <div
//                     key={product._id}
//                     className="keen-slider__slide py-2" // py-2 for hover effect space
//                     style={{ minWidth: "240px", maxWidth: "240px" }}
//                   >
//                     <ProductCard
//                       product={product}
//                       onQuickView={handleQuickView}
//                       className="h-full" // Full height of the parent
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* === 5. ARROWS POLISHED === */}
//               {loaded && instanceRef.current && products.length > 5 && (
//                 <>
//                   <button
//                     onClick={() => instanceRef.current?.prev()}
//                     aria-label="Previous Product"
//                     className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition"
//                   >
//                     <FiChevronLeft size={24} className="text-gray-700" />
//                   </button>
//                   <button
//                     onClick={() => instanceRef.current?.next()}
//                     aria-label="Next Product"
//                     className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition"
//                   >
//                     <FiChevronRight size={24} className="text-gray-700" />
//                   </button>
//                 </>
//               )}
//             </div>
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

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SanityProduct from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import ProductCard from "@/app/components/product/ProductCard";
import QuickViewModal from "@/app/components/product/QuickViewModal";

interface Banner {
  tag: string;
  bannerImage: any;
  link?: string;
}
interface ProductCarouselProps {
  title: string;
  products: SanityProduct[];
  banner?: Banner;
}

export default function ProductCarousel({
  title,
  products,
  banner,
}: ProductCarouselProps) {
  const [quickViewProduct, setQuickViewProduct] =
    useState<SanityProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    created: () => setLoaded(true),
    loop: products.length > 5,
    mode: "free-snap",
    slides: { perView: "auto", spacing: 24 },
  });

  if (!products || products.length === 0) return null;

  // --- FINAL FIX: DYNAMIC "VIEW ALL" LINK ---
  let viewAllLink = "/search";
  if (title.toLowerCase().includes("new arrivals")) {
    viewAllLink = "/search?sort=newest";
  } else if (title.toLowerCase().includes("best sellers")) {
    viewAllLink = "/search?sort=best-selling";
  } else if (title.toLowerCase().includes("featured")) {
    // isFeatured ab `filter` parameter mein jayega
    viewAllLink = "/search?filter=isFeatured";
  }
  // ------------------------------------------

  return (
    <>
      <section className="w-full bg-white dark:bg-gray-800/50 py-12 md:py-16 my-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
            <Link
              href={viewAllLink}
              className="text-sm font-semibold flex items-center gap-1 text-brand-primary hover:underline transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex flex-row gap-6">
            {banner && (
              <div className="hidden lg:block flex-shrink-0 w-[240px] rounded-xl overflow-hidden group shadow-lg">
                <Link
                  href={banner.link || "#"}
                  className="block w-full h-full relative"
                >
                  <Image
                    src={urlFor(banner.bannerImage).url()}
                    alt={`${title} Banner`}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
            )}
            <div className="relative flex-1 min-w-0">
              <div
                ref={sliderRef}
                className={`keen-slider h-full ${loaded ? "opacity-100" : "opacity-0"}`}
                style={{ transition: "opacity 0.4s ease-in" }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="keen-slider__slide py-2"
                    style={{ minWidth: "240px", maxWidth: "240px" }}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={setQuickViewProduct}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
              {loaded && instanceRef.current && products.length > 5 && (
                <>
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    aria-label="Previous Product"
                    className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronLeft
                      size={24}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    aria-label="Next Product"
                    className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronRight
                      size={24}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
