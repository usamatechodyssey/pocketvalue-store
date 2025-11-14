// "use client";

// import { useState, useMemo, useEffect, useCallback } from "react";
// import Link from "next/link";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import { useStateContext } from "@/app/context/StateContext";
// import QuantitySelector from "../ui/QuantitySelector";
// import { toast } from "react-hot-toast";

// // Icons
// import {
//   Heart,
//   ShoppingCart,
//   Star,
//   XCircle,
//   ChevronDown,
//   ShieldCheck,
//   Truck,
//   RotateCw,
// } from "lucide-react";

// // Swiper for variant options
// import { Swiper, SwiperSlide } from "swiper/react";
// import { FreeMode, Mousewheel } from "swiper/modules"; // <-- IMPORT FreeMode and Mousewheel
// import "swiper/css";

// interface ProductInfoProps {
//   product: SanityProduct;
//   selectedVariant: ProductVariant | null;
//   onVariantChange: (variant: ProductVariant | null) => void;
//   averageRating: number;
//   totalReviews: number;
// }

// type SelectedOptions = Record<string, string>;

// export default function ProductInfo({
//   product,
//   selectedVariant,
//   onVariantChange,
//   averageRating,
//   totalReviews,
// }: ProductInfoProps) {
//   const { onAdd, handleAddToWishlist } = useStateContext();
//   const [quantity, setQuantity] = useState(1);
//   const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
//   const [isTitleExpanded, setIsTitleExpanded] = useState(false);

//   useEffect(() => {
//     if (selectedVariant) {
//       const newSelectedOptions = selectedVariant.attributes.reduce(
//         (acc, attr) => {
//           acc[attr.name] = attr.value;
//           return acc;
//         },
//         {} as SelectedOptions
//       );
//       setSelectedOptions(newSelectedOptions);
//     } else {
//       setSelectedOptions({});
//     }
//   }, [selectedVariant]);

//   const options = useMemo(() => {
//     const opts: Record<string, Set<string>> = {};
//     product.variants.forEach((variant) => {
//       variant.attributes.forEach((attr) => {
//         if (!opts[attr.name]) opts[attr.name] = new Set();
//         opts[attr.name].add(attr.value);
//       });
//     });
//     return Object.fromEntries(
//       Object.entries(opts).map(([key, valueSet]) => [
//         key,
//         Array.from(valueSet).sort(),
//       ])
//     );
//   }, [product.variants]);

//   const handleOptionSelect = (optionName: string, optionValue: string) => {
//     const currentSelection = { ...selectedOptions, [optionName]: optionValue };
//     let bestMatch = product.variants.find((v) =>
//       Object.entries(currentSelection).every(([key, value]) =>
//         v.attributes.some((attr) => attr.name === key && attr.value === value)
//       )
//     );
//     if (!bestMatch) {
//       bestMatch = product.variants.find(
//         (v) =>
//           (v.stock ? v.stock > 0 : v.inStock) &&
//           v.attributes.some(
//             (a) => a.name === optionName && a.value === optionValue
//           )
//       );
//     }
//     onVariantChange(
//       bestMatch ||
//         product.variants.find((v) =>
//           Object.entries(currentSelection).every(([key, value]) =>
//             v.attributes.some(
//               (attr) => attr.name === key && attr.value === value
//             )
//           )
//         ) ||
//         null
//     );
//   };

//   const isOptionAvailable = useCallback(
//     (optionName: string, optionValue: string): boolean => {
//       const otherSelectedOptions = Object.entries(selectedOptions).filter(
//         ([key]) => key !== optionName
//       );
//       return product.variants.some((variant) => {
//         const matchesThisOption = variant.attributes.some(
//           (attr) => attr.name === optionName && attr.value === optionValue
//         );
//         if (!matchesThisOption) return false;
//         return otherSelectedOptions.every(([key, value]) =>
//           variant.attributes.some(
//             (attr) => attr.name === key && attr.value === value
//           )
//         );
//       });
//     },
//     [product.variants, selectedOptions]
//   );

//   const handleClearSelection = () => onVariantChange(product.defaultVariant);

//   const variantToUse = selectedVariant || product.defaultVariant;
//   const effectivePrice = variantToUse.salePrice ?? variantToUse.price;
//   const originalPrice = variantToUse.salePrice ? variantToUse.price : null;
//   const hasOptions = Object.keys(options).length > 0;

//   // === === === YAHAN ASAL, FINAL FIX HAI === === ===
//   const isSelectionInStock = useMemo(() => {
//     // Agar koi variant select hi nahi hua, to "Out of Stock"
//     if (!selectedVariant) {
//       return false;
//     }

//     // Step 1: Naye 'stock' (number) field ko check karo. Yeh primary hai.
//     // 'null' aur `undefined` dono ko handle karega.
//     if (selectedVariant.stock != null) {
//       return selectedVariant.stock > 0;
//     }

//     // Step 2: Agar 'stock' field nahi hai, to purane 'inStock' (boolean) field par fallback karo.
//     // '!==' check ke bajaye '??' (nullish coalescing) behtar hai.
//     return selectedVariant.inStock ?? false;
//   }, [selectedVariant]);
//   // === === === END OF FIX === === ===

//   const handleAddToCart = () => {
//     if (!selectedVariant) {
//       toast.error("Please select available options.");
//       return;
//     }
//     if (!isSelectionInStock) {
//       toast.error("This combination is currently out of stock.");
//       return;
//     }
//     onAdd(product, selectedVariant, quantity);
//   };

//   const handleBuyNow = () => {
//     if (!selectedVariant) {
//       toast.error("Please select available options.");
//       return;
//     }
//     if (!isSelectionInStock) {
//       toast.error("This combination is currently out of stock.");
//       return;
//     }
//     toast.success("Redirecting to checkout..."); // Placeholder for actual checkout logic
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div>
//         <h1
//           className={`text-2xl md:text-3xl font-bold text-text-primary dark:text-gray-100 transition-all duration-300 ${isTitleExpanded ? "" : "line-clamp-2"}`}
//         >
//           {product.title}
//         </h1>
//         {product.title.length > 80 && (
//           <button
//             onClick={() => setIsTitleExpanded(!isTitleExpanded)}
//             className="text-sm text-brand-primary font-semibold mt-1 flex items-center gap-1"
//           >
//             {isTitleExpanded ? "Show Less" : "Show More"}
//             <ChevronDown
//               className={`w-4 h-4 transition-transform ${isTitleExpanded ? "rotate-180" : ""}`}
//             />
//           </button>
//         )}
//       </div>

//       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 my-4">
//         <div className="text-sm">
//           <span className="text-gray-500 dark:text-gray-400">Brand: </span>
//           {product.brand ? (
//             <Link
//               href={`/search?brand=${product.brand.slug}`}
//               className="font-semibold text-brand-primary hover:underline"
//             >
//               {product.brand.name}
//             </Link>
//           ) : (
//             <span className="font-semibold text-gray-700 dark:text-gray-300">
//               No Brand
//             </span>
//           )}
//         </div>
//         <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">
//           |
//         </span>
//         {averageRating > 0 && (
//           <div className="flex items-center gap-1.5">
//             <Star size={16} className="text-yellow-400 fill-yellow-400" />
//             <span className="text-sm font-semibold text-text-primary dark:text-gray-200">
//               {averageRating.toFixed(1)}
//             </span>
//             <span className="text-sm text-text-secondary dark:text-gray-400">
//               ({totalReviews} reviews)
//             </span>
//           </div>
//         )}
//         {/* === === === YAHAN NAYA UI ELEMENT ADD HUA HAI === === === */}
//         {selectedVariant && (
//           <>
//             <span className="text-gray-300 dark:text-gray-600 hidden sm:inline">
//               |
//             </span>
//             <div
//               className={`text-xs font-bold uppercase px-3 py-1 rounded-full
//               ${
//                 isSelectionInStock
//                   ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-500/20"
//                   : "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-500/20"
//               }`}
//             >
//               {isSelectionInStock ? "In Stock" : "Out of Stock"}
//             </div>
//           </>
//         )}
//       </div>

//       <div className="flex items-baseline gap-3 mb-6">
//         <span className="text-4xl font-bold text-brand-primary">
//           Rs. {effectivePrice.toLocaleString()}
//         </span>
//         {originalPrice && (
//           <span className="text-xl text-text-secondary line-through">
//             Rs. {originalPrice.toLocaleString()}
//           </span>
//         )}
//       </div>

//       {hasOptions && (
//         <div className="space-y-5 mb-6">
//           {Object.entries(options).map(([name, values]) => (
//             <div key={name}>
//               <h4 className="text-sm font-medium text-text-secondary mb-2">
//                 {name}:{" "}
//                 <span className="text-text-primary dark:text-gray-200 font-semibold">
//                   {selectedOptions[name]}
//                 </span>
//               </h4>
//               {/* --- SWIPER UPGRADED HERE --- */}
//               <Swiper
//                 modules={[FreeMode, Mousewheel]} // Added FreeMode and Mousewheel
//                 freeMode={true} // Enabled free mode for smooth swiping
//                 mousewheel={true} // Enabled mousewheel control for desktop
//                 spaceBetween={10}
//                 slidesPerView={"auto"}
//                 className="variant-swiper"
//               >
//                 {values.map((value) => {
//                   const isSelected = selectedOptions[name] === value;
//                   const isAvailable = isOptionAvailable(name, value);
//                   return (
//                     <SwiperSlide key={value} style={{ width: "auto" }}>
//                       <button
//                         onClick={() => handleOptionSelect(name, value)}
//                         disabled={!isAvailable}
//                         className={`px-4 py-2 text-sm rounded-lg border-2 transition-all duration-200
//                           ${isSelected ? "border-brand-primary bg-brand-primary/10 text-brand-primary font-semibold" : "border-gray-300 bg-white hover:border-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:hover:border-gray-500"}
//                           disabled:opacity-40 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-700`}
//                       >
//                         {value}
//                       </button>
//                     </SwiperSlide>
//                   );
//                 })}
//               </Swiper>
//             </div>
//           ))}
//           {selectedVariant && selectedVariant !== product.defaultVariant && (
//             <button
//               onClick={handleClearSelection}
//               className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-danger transition-colors"
//             >
//               <XCircle size={12} /> Clear Selection
//             </button>
//           )}
//         </div>
//       )}

//       <div className="flex flex-col gap-4 mt-auto">
//         <div className="flex items-center justify-between">
//           <QuantitySelector
//             quantity={quantity}
//             onQuantityChange={setQuantity}
//           />
//           <button
//             onClick={() => handleAddToWishlist(product)}
//             className="flex items-center gap-2 p-3 text-text-secondary hover:text-brand-danger transition-colors"
//             aria-label="Add to wishlist"
//           >
//             <Heart size={20} />
//             <span className="text-sm font-medium hidden sm:inline">
//               Add to Wishlist
//             </span>
//           </button>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <button
//             onClick={handleAddToCart}
//             disabled={!isSelectionInStock}
//             className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ShoppingCart size={20} /> Add to Cart
//           </button>
//           <button
//             onClick={handleBuyNow}
//             disabled={!isSelectionInStock}
//             className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-secondary text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>

//       <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
//         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//           <ShieldCheck size={16} className="text-green-500" />
//           <span>Secure Payments</span>
//         </div>
//         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//           <Truck size={16} className="text-brand-secondary" />
//           <span>Nationwide Delivery</span>
//         </div>
//         <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-text-secondary">
//           <RotateCw size={16} className="text-brand-primary" />
//           <span>7-Day Returns</span>
//         </div>
//       </div>
//     </div>
//   );
// }
// /src/app/components/product/ProductInfo.tsx

"use client";

import { useMemo } from "react";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import ProductHeader from "./pdp-sections/ProductHeader";
import ProductPricing from "./pdp-sections/ProductPricing";
import ProductVariantSelector from "./pdp-sections/ProductVariantSelector";
import ProductActions from "./pdp-sections/ProductActions"; // <-- Verify this import
import ProductMeta from "./pdp-sections/ProductMeta";

interface ProductInfoProps {
  product: SanityProduct;
  selectedVariant: ProductVariant | null;
  onVariantChange: (variant: ProductVariant | null) => void;
  averageRating: number;
  totalReviews: number;
}

export default function ProductInfo({
  product,
  selectedVariant,
  onVariantChange,
  averageRating,
  totalReviews,
}: ProductInfoProps) {
  const isSelectionInStock = useMemo(() => {
    if (!selectedVariant) return false;
    if (selectedVariant.stock != null) return selectedVariant.stock > 0;
    return selectedVariant.inStock ?? false;
  }, [selectedVariant]);

  return (
    <div className="flex flex-col h-full">
      <ProductHeader
        product={product}
        selectedVariant={selectedVariant}
        averageRating={averageRating}
        totalReviews={totalReviews}
        isSelectionInStock={isSelectionInStock}
      />
      <ProductPricing selectedVariant={selectedVariant} />
      <ProductVariantSelector
        variants={product.variants}
        defaultVariant={product.defaultVariant}
        selectedVariant={selectedVariant}
        onVariantChange={onVariantChange}
      />

      {/* --- VERIFY THIS SECTION --- */}
      <ProductActions
        product={product}
        selectedVariant={selectedVariant}
        isSelectionInStock={isSelectionInStock}
      />
      {/* --------------------------- */}

      <ProductMeta />
    </div>
  );
}
