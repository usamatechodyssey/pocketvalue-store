// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
// import { useStateContext } from "@/app/context/StateContext";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";

// // 🔥 STEP 1: Swiper ke components aur modules import karein
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";

// // 🔥 STEP 2: Swiper ki CSS files import karein
// import "swiper/css";
// import "swiper/css/pagination";

// interface ProductCardProps {
//   product: SanityProduct;
//   onQuickView?: (product: SanityProduct) => void;
//   className?: string;
// }

// export default function ProductCard({
//   product,
//   onQuickView,
//   className = "",
// }: ProductCardProps) {
//   const { onAdd, handleAddToWishlist } = useStateContext();
//   const defaultVariant: ProductVariant | undefined = product.defaultVariant;

//   if (!defaultVariant) return null;

//   const handleActionClick = (e: React.MouseEvent, action: () => void) => {
//     e.preventDefault();
//     e.stopPropagation();
//     action();
//   };

//   const originalPrice = defaultVariant.price;
//   const salePrice = defaultVariant.salePrice;
//   const displayPrice = salePrice ?? originalPrice;
//   const isOnSale = salePrice && salePrice < originalPrice;
//   const discount = isOnSale
//     ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
//     : 0;
//   const isAvailable =
//     defaultVariant.stock !== undefined
//       ? defaultVariant.stock > 0
//       : defaultVariant.inStock;

//   // 🔥 STEP 3: Images ko ek array mein le lein, fallback ke saath
//   const images =
//     defaultVariant.images && defaultVariant.images.length > 0
//       ? defaultVariant.images
//       : [{ _key: "placeholder", asset: { _ref: "/placeholder.png" } }]; // Placeholder agar koi image na ho

//   return (
//     <div
//       className={`h-full group relative flex flex-col bg-white dark:bg-gray-900 transition-all duration-300 border border-gray-200 dark:border-gray-800 ${className}`}
//     >
//       <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
//         {/* 🔥 STEP 4: Image section ko Swiper se replace karein */}
//         <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-50 dark:bg-gray-800 product-card-swiper">
//           <Swiper
//             // Swiper ke modules (autoplay, pagination) yahan batayein
//             modules={[Autoplay, Pagination]}
//             spaceBetween={0}
//             slidesPerView={1}
//             // Loop taaki slider chalta rahe
//             loop={true}
//             // Autoplay settings (har 2.5 second mein slide change ho)
//             autoplay={{
//               delay: 2500,
//               disableOnInteraction: false, // User interact kare tab bhi chalta rahe
//             }}
//             // Pagination dots ko clickable banayein
//             pagination={{ clickable: true }}
//             className="w-full h-full"
//           >
//             {images.map((image, index) => (
//               <SwiperSlide key={image._key || index}>
//                 <Image
//                   src={
//                     image.asset?._ref === "/placeholder.png"
//                       ? "/placeholder.png"
//                       : urlFor(image).width(400).height(500).url()
//                   }
//                   alt={`${product.title} image ${index + 1}`}
//                   fill
//                   sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 250px"
//                   className="object-contain" // object-cover se change karke contain kiya taake poori image dikhe
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* Baaki sab cheezein waisi hi rahengi */}
//           <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
//             {isOnSale && (
//               <span className="bg-brand-danger text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
//                 -{discount}%
//               </span>
//             )}
//             {product.isNewArrival && (
//               <span className="bg-brand-secondary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
//                 New
//               </span>
//             )}
//           </div>
//           <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300 z-10">
//             {onQuickView && (
//               <button
//                 onClick={(e) =>
//                   handleActionClick(e, () => onQuickView(product))
//                 }
//                 className="p-2 bg-white dark:bg-gray-800 text-gray-600 hover:text-brand-primary border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
//               >
//                 <FiEye size={18} />
//               </button>
//             )}
//             <button
//               onClick={(e) =>
//                 handleActionClick(e, () => handleAddToWishlist(product))
//               }
//               className="p-2 bg-white dark:bg-gray-800 text-gray-600 hover:text-brand-danger border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
//             >
//               <FiHeart size={18} />
//             </button>
//           </div>
//           <button
//             onClick={(e) =>
//               handleActionClick(
//                 e,
//                 () => isAvailable && onAdd(product, defaultVariant, 1)
//               )
//             }
//             disabled={!isAvailable}
//             className={`absolute bottom-0 left-0 w-full py-3 text-xs font-bold uppercase tracking-widest text-white transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-10 ${isAvailable ? "bg-brand-primary hover:bg-brand-primary-hover" : "bg-gray-500 cursor-not-allowed"}`}
//           >
//             {isAvailable ? (
//               <span className="flex items-center justify-center gap-2">
//                 <FiShoppingCart /> Add to Cart
//               </span>
//             ) : (
//               "Sold Out"
//             )}
//           </button>
//         </div>
//         <div className="flex flex-col grow p-4">
//           <h3 className="h-10 text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1 group-hover:text-brand-primary transition-colors">
//             {product.title}
//           </h3>
//           <div className="flex items-center gap-1 mb-auto">
//             {product.rating ? (
//               <>
//                 <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
//                 <span className="text-xs text-gray-500 font-medium">
//                   {product.rating.toFixed(1)}
//                 </span>
//                 <span className="text-[10px] text-gray-400">
//                   ({product.reviewCount})
//                 </span>
//               </>
//             ) : (
//               <span className="text-xs text-gray-400">No reviews</span>
//             )}
//           </div>
//           <div className="mt-3 flex items-baseline gap-2">
//             <span className="text-lg font-bold text-brand-primary">{`Rs. ${displayPrice.toLocaleString()}`}</span>
//             {isOnSale && (
//               <span className="text-xs text-gray-400 line-through decoration-gray-400">{`Rs. ${originalPrice.toLocaleString()}`}</span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
// import { useStateContext } from "@/app/context/StateContext";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import { urlFor } from "@/sanity/lib/image";
// import { useRef, useState, useEffect } from "react";

// // Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, EffectFade } from "swiper/modules";
// import { Swiper as SwiperType } from "swiper";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/effect-fade";

// interface ProductCardProps {
//   product: SanityProduct;
//   onQuickView?: (product: SanityProduct) => void;
//   className?: string;
// }

// export default function ProductCard({
//   product,
//   onQuickView,
//   className = "",
// }: ProductCardProps) {
//   const { onAdd, handleAddToWishlist } = useStateContext();
//   const defaultVariant: ProductVariant | undefined = product.defaultVariant;

//   const swiperRef = useRef<SwiperType | null>(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isDesktop, setIsDesktop] = useState(false);

//   // Screen Size Check (Hydration Safe)
//   useEffect(() => {
//     const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
//     checkScreen();
//     window.addEventListener("resize", checkScreen);
//     return () => window.removeEventListener("resize", checkScreen);
//   }, []);

//   if (!defaultVariant) return null;

//   const handleActionClick = (e: React.MouseEvent, action: () => void) => {
//     e.preventDefault();
//     e.stopPropagation();
//     action();
//   };

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     // Desktop: Play on Hover
//     if (isDesktop && swiperRef.current && swiperRef.current.autoplay) {
//       swiperRef.current.autoplay.start();
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     // Desktop: Stop on Leave
//     if (isDesktop && swiperRef.current && swiperRef.current.autoplay) {
//       swiperRef.current.autoplay.stop();
//       swiperRef.current.slideTo(0);
//     }
//   };

//   const originalPrice = defaultVariant.price;
//   const salePrice = defaultVariant.salePrice;
//   const displayPrice = salePrice ?? originalPrice;
//   const isOnSale = salePrice && salePrice < originalPrice;
//   const discount = isOnSale
//     ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
//     : 0;
//   const isAvailable =
//     defaultVariant.stock !== undefined
//       ? defaultVariant.stock > 0
//       : defaultVariant.inStock;

//   const images =
//     defaultVariant.images && defaultVariant.images.length > 0
//       ? defaultVariant.images
//       : [{ _key: "placeholder", asset: { _ref: "/placeholder.png" } }];

//   return (
//     // === FIXED BORDER (No Hover Change) ===
//     // Shadow add ki hai hover par taake lift feel ho
//     <div
//       className={`h-full group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <style jsx global>{`
//         .swiper-pagination-bullet-active {
//           background-color: #ff8f32 !important;
//           width: 12px;
//           border-radius: 4px;
//         }
//         .swiper-pagination-bullet {
//           background-color: #ccc;
//           opacity: 1;
//         }
//       `}</style>

//       <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
//         {/* IMAGE SWIPER */}
//         <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-50 dark:bg-gray-800">
//           <Swiper
//             modules={[Autoplay, Pagination, EffectFade]}
//             spaceBetween={0}
//             slidesPerView={1}
//             loop={images.length > 1}
//             effect="fade"
//             // Mobile: Touch Allow. Desktop: Mouse Allow (via Hover)
//             allowTouchMove={!isDesktop}
//             autoplay={{
//               delay: 1000,
//               disableOnInteraction: false,
//             }}
//             pagination={{
//               clickable: true,
//               dynamicBullets: true,
//             }}
//             onSwiper={(swiper) => {
//               swiperRef.current = swiper;
//               swiper.autoplay.stop(); // Default Stopped
//             }}
//             className="w-full h-full"
//           >
//             {images.map((image: any, index) => (
//               <SwiperSlide key={image._key || index}>
//                 <Image
//                   src={
//                     image.asset?._ref === "/placeholder.png"
//                       ? "/placeholder.png"
//                       : urlFor(image).width(600).height(750).url()
//                   }
//                   alt={`${product.title} - View ${index + 1}`}
//                   fill
//                   sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
//                   className="object-cover transition-transform duration-700 group-hover:scale-105"
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* BADGES */}
//           <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10 pointer-events-none">
//             {isOnSale && (
//               <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
//                 - {discount}%
//               </span>
//             )}
//             {product.isNewArrival && (
//               <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
//                 New
//               </span>
//             )}
//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 lg:translate-x-12 lg:group-hover:translate-x-0 transition-transform duration-300">
//             {onQuickView && (
//               <button
//                 onClick={(e) =>
//                   handleActionClick(e, () => onQuickView(product))
//                 }
//                 className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-brand-primary border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-full lg:rounded-none"
//               >
//                 <FiEye size={18} />
//               </button>
//             )}
//             <button
//               onClick={(e) =>
//                 handleActionClick(e, () => handleAddToWishlist(product))
//               }
//               className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-full lg:rounded-none"
//             >
//               <FiHeart size={18} />
//             </button>
//           </div>

//           {/* ADD TO CART */}
//           {/* Mobile: FAB */}
//           <button
//             onClick={(e) =>
//               handleActionClick(
//                 e,
//                 () => isAvailable && onAdd(product, defaultVariant, 1)
//               )
//             }
//             disabled={!isAvailable}
//             className={`lg:hidden absolute bottom-3 right-3 p-3 rounded-full shadow-lg z-20 transition-transform active:scale-90 ${isAvailable ? "bg-brand-primary text-white" : "bg-gray-400 cursor-not-allowed"}`}
//           >
//             <FiShoppingCart size={20} />
//           </button>

//           {/* Desktop: Bar */}
//           <button
//             onClick={(e) =>
//               handleActionClick(
//                 e,
//                 () => isAvailable && onAdd(product, defaultVariant, 1)
//               )
//             }
//             disabled={!isAvailable}
//             className={`hidden lg:flex absolute bottom-0 left-0 w-full py-3 items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-transform duration-300 translate-y-full group-hover:translate-y-0 z-20 ${isAvailable ? "bg-brand-primary hover:bg-brand-primary-hover" : "bg-gray-500 cursor-not-allowed"}`}
//           >
//             <FiShoppingCart size={16} />
//             {isAvailable ? "Add to Cart" : "Sold Out"}
//           </button>
//         </div>

//         {/* INFO */}
//         <div className="flex flex-col grow p-4 gap-1">
//           <div className="flex items-center gap-1 mb-1">
//             {product.rating ? (
//               <>
//                 <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
//                 <span className="text-xs text-gray-500 font-medium">
//                   {product.rating.toFixed(1)}
//                 </span>
//                 <span className="text-[10px] text-gray-400">
//                   ({product.reviewCount})
//                 </span>
//               </>
//             ) : (
//               <span className="text-xs text-gray-400">No reviews</span>
//             )}
//           </div>

//           <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors min-h-10">
//             {product.title}
//           </h3>

//           <div className="mt-auto pt-2 flex items-baseline gap-2">
//             <span className="text-lg font-bold text-brand-primary">{`Rs. ${displayPrice.toLocaleString()}`}</span>
//             {isOnSale && (
//               <span className="text-xs text-gray-400 line-through decoration-gray-400">{`Rs. ${originalPrice.toLocaleString()}`}</span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useStateContext } from "@/app/context/StateContext";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import { useRef, useState, useEffect } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface ProductCardProps {
  product: SanityProduct;
  onQuickView?: (product: SanityProduct) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  className = "",
}: ProductCardProps) {
  const { onAdd, handleAddToWishlist } = useStateContext();
  const defaultVariant: ProductVariant | undefined = product.defaultVariant;

  const swiperRef = useRef<SwiperType | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Screen Size Check
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (!defaultVariant) return null;

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (isDesktop && swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isDesktop && swiperRef.current && swiperRef.current.autoplay) {
      swiperRef.current.autoplay.stop();
      swiperRef.current.slideTo(0);
    }
  };

  const originalPrice = defaultVariant.price;
  const salePrice = defaultVariant.salePrice;
  const displayPrice = salePrice ?? originalPrice;
  const isOnSale = salePrice && salePrice < originalPrice;
  const discount = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;
  const isAvailable =
    defaultVariant.stock !== undefined
      ? defaultVariant.stock > 0
      : defaultVariant.inStock;

  const images =
    defaultVariant.images && defaultVariant.images.length > 0
      ? defaultVariant.images
      : [{ _key: "placeholder", asset: { _ref: "/placeholder.png" } }];

  return (
    // FIX 1: Main Container
    // Removed 'overflow-hidden' from here to prevent fighting with shadow
    // Added 'transform-gpu' to force a stable layer
    <div
      className={`h-full group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background-color: #ff8f32 !important;
          width: 12px;
          border-radius: 4px;
        }
        .swiper-pagination-bullet {
          background-color: #ccc;
          opacity: 1;
        }
      `}</style>

      <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
        {/* 
           FIX 2: Image Container 
           Kept 'overflow-hidden' HERE to clip the sliding button and zooming image.
           Added 'z-0' to keep it in context.
        */}
        <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-50 dark:bg-gray-800 z-0">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            loop={images.length > 1}
            effect="fade"
            allowTouchMove={!isDesktop}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.autoplay.stop();
            }}
            className="w-full h-full"
          >
            {images.map((image: any, index) => (
              <SwiperSlide key={image._key || index}>
                <Image
                  src={
                    image.asset?._ref === "/placeholder.png"
                      ? "/placeholder.png"
                      : urlFor(image).width(600).height(750).url()
                  }
                  alt={`${product.title} - View ${index + 1}`}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  // FIX 3: Smoother Image Scaling
                  // Added 'transform-gpu' and 'backface-invisible' (via style/class) to prevent pixel shaking
                  className="object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu backface-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* BADGES - Added z-index to stay above swiper */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20 pointer-events-none">
            {isOnSale && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
                - {discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider shadow-sm">
                New
              </span>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 lg:translate-x-12 lg:group-hover:translate-x-0 transition-transform duration-300 transform-gpu">
            {onQuickView && (
              <button
                onClick={(e) =>
                  handleActionClick(e, () => onQuickView(product))
                }
                className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-brand-primary border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-full lg:rounded-none"
              >
                <FiEye size={18} />
              </button>
            )}
            <button
              onClick={(e) =>
                handleActionClick(e, () => handleAddToWishlist(product))
              }
              className="p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-red-500 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-full lg:rounded-none"
            >
              <FiHeart size={18} />
            </button>
          </div>

          {/* ADD TO CART - MOBILE (FAB) */}
          <button
            onClick={(e) =>
              handleActionClick(
                e,
                () => isAvailable && onAdd(product, defaultVariant, 1)
              )
            }
            disabled={!isAvailable}
            className={`lg:hidden absolute bottom-3 right-3 p-3 rounded-full shadow-lg z-30 transition-transform active:scale-90 ${isAvailable ? "bg-brand-primary text-white" : "bg-gray-400 cursor-not-allowed"}`}
          >
            <FiShoppingCart size={20} />
          </button>

          {/* 
             ADD TO CART - DESKTOP (SLIDE UP BAR)
             FIX 4: Added 'transform-gpu' and 'will-change-transform'
             This tells the browser to use the GPU for the slide animation, preventing layout shift.
          */}
          <button
            onClick={(e) =>
              handleActionClick(
                e,
                () => isAvailable && onAdd(product, defaultVariant, 1)
              )
            }
            disabled={!isAvailable}
            className={`hidden lg:flex absolute bottom-0 left-0 w-full py-3 items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white z-20 transition-transform duration-300 transform-gpu will-change-transform translate-y-full group-hover:translate-y-0 ${isAvailable ? "bg-brand-primary hover:bg-brand-primary-hover" : "bg-gray-500 cursor-not-allowed"}`}
          >
            <FiShoppingCart size={16} />
            {isAvailable ? "Add to Cart" : "Sold Out"}
          </button>
        </div>

        {/* INFO */}
        <div className="flex flex-col grow p-4 gap-1 relative z-10 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-1 mb-1">
            {product.rating ? (
              <>
                <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-500 font-medium">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-gray-400">
                  ({product.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews</span>
            )}
          </div>

          <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors min-h-10">
            {product.title}
          </h3>

          <div className="mt-auto pt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-primary">{`Rs. ${displayPrice.toLocaleString()}`}</span>
            {isOnSale && (
              <span className="text-xs text-gray-400 line-through decoration-gray-400">{`Rs. ${originalPrice.toLocaleString()}`}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
