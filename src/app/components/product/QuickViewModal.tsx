
// "use client";

// import { Fragment, useState, useEffect, useMemo } from "react";
// import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
// import { X } from "lucide-react";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import ProductGallery from "./ProductGallery";
// import ProductInfo from "./ProductInfo";

// interface QuickViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   product: SanityProduct | null;
// }

// export default function QuickViewModal({
//   isOpen,
//   onClose,
//   product,
// }: QuickViewModalProps) {
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

//   useEffect(() => {
//     if (product) {
//       setSelectedVariant(product.defaultVariant);
//     }
//   }, [product]);

//   const handleVariantChange = (variant: ProductVariant | null) => {
//     setSelectedVariant(variant);
//   };

//   const imagesToShow = useMemo(() => {
//     if (selectedVariant?.images && selectedVariant.images.length > 0) {
//       return selectedVariant.images;
//     }
//     return product?.defaultVariant.images || [];
//   }, [selectedVariant, product]);

//   if (!product) return null;

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-60" onClose={onClose}>
        
//         {/* Backdrop */}
//         <TransitionChild
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
//         </TransitionChild>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-end md:items-center justify-center p-0 md:p-4 text-center">
            
//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
//               enterTo="opacity-100 translate-y-0 md:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 md:scale-100"
//               leaveTo="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
//             >
//               <DialogPanel 
//                 className="
//                   w-full transform text-left align-middle transition-all shadow-2xl
//                   bg-white dark:bg-gray-900 
//                   rounded-t-4xl md:rounded-2xl 
//                   md:w-[90vw] lg:w-full lg:max-w-7xl
//                   max-h-[90vh] 
//                   flex flex-col
//                   overflow-hidden
//                 "
//               >
                
//                 {/* === 1. HANDLE BAR (MOBILE ONLY) === */}
//                 {/* Ye sirf mobile par dikhega, md (tablet) aur upar gayab ho jayega */}
//                 <div 
//                     className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0 cursor-pointer bg-white dark:bg-gray-900 z-10" 
//                     onClick={onClose}
//                 >
//                     <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
//                 </div>

//                 {/* === 2. CLOSE BUTTON (Absolute) === */}
//                 <div className="absolute top-4 right-4 z-50">
//                     <button
//                     onClick={onClose}
//                     className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors shadow-sm"
//                     >
//                     <X size={24} />
//                     </button>
//                 </div>

//                 {/* === 3. CONTENT AREA === */}
//                 <div className="overflow-y-auto custom-scrollbar p-0 grow">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
                    
//                     {/* LEFT: GALLERY */}
//                     {/* Mobile/Tablet: Edge-to-Edge (No Padding). Desktop: Padding. */}
//                     <div className="bg-gray-50 dark:bg-gray-800/50 p-6 lg:p-10 flex items-center justify-center">
//                       <div className="w-full h-full">
//                           <ProductGallery 
//                               images={imagesToShow} 
//                               productTitle={product.title} 
//                               videoUrl={product.videoUrl}
//                           />
//                       </div>
//                     </div>

//                     {/* RIGHT: INFO */}
//                     <div className="p-5 md:p-8 lg:p-10">
//                       <ProductInfo
//                         key={product._id}
//                         product={product}
//                         selectedVariant={selectedVariant}
//                         onVariantChange={handleVariantChange}
//                         averageRating={product.rating || 0}
//                         totalReviews={product.reviewCount || 0}
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </DialogPanel>
//             </TransitionChild>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
// // /src/app/components/product/QuickViewModal.tsx (FIXED)

// "use client";

// import { Fragment, useState, useEffect, useMemo } from "react";
// import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
// import { X } from "lucide-react";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import ProductGallery from "./ProductGallery";
// import ProductInfo from "./ProductInfo";

// interface QuickViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   product: SanityProduct | null;
// }

// export default function QuickViewModal({
//   isOpen,
//   onClose,
//   product,
// }: QuickViewModalProps) {
//   const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

//   // --- FIX: Prevent Cascading Renders ---
//   // Pehle yahan '[product]' tha jo object reference change hone par loop banata tha.
//   // Ab hum 'product._id' use kar rahe hain jo constant rehta hai.
//   useEffect(() => {
//     if (isOpen && product) {
//       setSelectedVariant(product.defaultVariant);
//     }
//   }, [isOpen, product?._id]); // Changed dependency to ID (Primitive)

//   const handleVariantChange = (variant: ProductVariant | null) => {
//     setSelectedVariant(variant);
//   };

//   const imagesToShow = useMemo(() => {
//     if (selectedVariant?.images && selectedVariant.images.length > 0) {
//       return selectedVariant.images;
//     }
//     return product?.defaultVariant.images || [];
//   }, [selectedVariant, product]); // Keeping 'product' here is fine as useMemo is cheap

//   if (!product) return null;

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-60" onClose={onClose}>
        
//         {/* Backdrop */}
//         <TransitionChild
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
//         </TransitionChild>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-end md:items-center justify-center p-0 md:p-4 text-center">
            
//             <TransitionChild
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
//               enterTo="opacity-100 translate-y-0 md:scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 translate-y-0 md:scale-100"
//               leaveTo="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
//             >
//               <DialogPanel 
//                 className="
//                   w-full transform text-left align-middle transition-all shadow-2xl
//                   bg-white dark:bg-gray-900 
//                   rounded-t-4xl md:rounded-2xl 
//                   md:w-[90vw] lg:w-full lg:max-w-7xl
//                   max-h-[90vh] 
//                   flex flex-col
//                   overflow-hidden
//                 "
//               >
                
//                 {/* === 1. HANDLE BAR (MOBILE ONLY) === */}
//                 <div 
//                     className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0 cursor-pointer bg-white dark:bg-gray-900 z-10" 
//                     onClick={onClose}
//                 >
//                     <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
//                 </div>

//                 {/* === 2. CLOSE BUTTON (Absolute) === */}
//                 <div className="absolute top-4 right-4 z-50">
//                     <button
//                     onClick={onClose}
//                     className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors shadow-sm"
//                     >
//                     <X size={24} />
//                     </button>
//                 </div>

//                 {/* === 3. CONTENT AREA === */}
//                 <div className="overflow-y-auto custom-scrollbar p-0 grow">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
                    
//                     {/* LEFT: GALLERY */}
//                     <div className="bg-gray-50 dark:bg-gray-800/50 p-6 lg:p-10 flex items-center justify-center">
//                       <div className="w-full h-full">
//                           <ProductGallery 
//                               images={imagesToShow} 
//                               productTitle={product.title} 
//                               videoUrl={product.videoUrl}
//                           />
//                       </div>
//                     </div>

//                     {/* RIGHT: INFO */}
//                     <div className="p-5 md:p-8 lg:p-10">
//                       <ProductInfo
//                         key={product._id}
//                         product={product}
//                         selectedVariant={selectedVariant}
//                         onVariantChange={handleVariantChange}
//                         averageRating={product.rating || 0}
//                         totalReviews={product.reviewCount || 0}
//                       />
//                     </div>
//                   </div>
//                 </div>

//               </DialogPanel>
//             </TransitionChild>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
"use client";

import { Fragment, useState, useEffect, useMemo } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: SanityProduct | null;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
}: QuickViewModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // ✅ FIX: Performance & Infinite Loop
  // Only update state when the Modal opens or the Product ID changes.
  // We explicitly ignore 'product' object changes to prevent re-renders from unstable props.
  useEffect(() => {
    if (isOpen && product) {
      setSelectedVariant(product.defaultVariant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product?._id]);

  const handleVariantChange = (variant: ProductVariant | null) => {
    setSelectedVariant(variant);
  };

  const imagesToShow = useMemo(() => {
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }
    return product?.defaultVariant.images || [];
  }, [selectedVariant, product]);

  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-60" onClose={onClose}>
        
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end md:items-center justify-center p-0 md:p-4 text-center">
            
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-100 translate-y-full md:opacity-0 md:translate-y-0 md:scale-95"
            >
              <DialogPanel 
                className="
                  w-full transform text-left align-middle transition-all shadow-2xl
                  bg-white dark:bg-gray-900 
                  rounded-t-4xl md:rounded-2xl 
                  md:w-[90vw] lg:w-full lg:max-w-7xl
                  max-h-[90vh] 
                  flex flex-col
                  overflow-hidden
                "
              >
                
                {/* === 1. HANDLE BAR (MOBILE ONLY) === */}
                <div 
                    className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0 cursor-pointer bg-white dark:bg-gray-900 z-10" 
                    onClick={onClose}
                >
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* === 2. CLOSE BUTTON (Absolute) === */}
                <div className="absolute top-4 right-4 z-50">
                    <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                    >
                    <X size={24} />
                    </button>
                </div>

                {/* === 3. CONTENT AREA === */}
                <div className="overflow-y-auto custom-scrollbar p-0 grow">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
                    
                    {/* LEFT: GALLERY */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 lg:p-10 flex items-center justify-center">
                      <div className="w-full h-full">
                          <ProductGallery 
                              images={imagesToShow} 
                              productTitle={product.title} 
                              videoUrl={product.videoUrl}
                          />
                      </div>
                    </div>

                    {/* RIGHT: INFO */}
                    <div className="p-5 md:p-8 lg:p-10">
                      <ProductInfo
                        key={product._id}
                        product={product}
                        selectedVariant={selectedVariant}
                        onVariantChange={handleVariantChange}
                        averageRating={product.rating || 0}
                        totalReviews={product.reviewCount || 0}
                      />
                    </div>
                  </div>
                </div>

              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}