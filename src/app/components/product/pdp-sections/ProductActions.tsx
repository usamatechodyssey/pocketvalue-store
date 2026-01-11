
// // /src/app/components/product/pdp-sections/ProductActions.tsx

// "use client";

// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useStateContext } from "@/app/context/StateContext";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import QuantitySelector from "../../ui/QuantitySelector";
// import { ShoppingCart, Heart } from "lucide-react";

// interface ProductActionsProps {
//   product: SanityProduct;
//   selectedVariant: ProductVariant | null;
//   isSelectionInStock: boolean;
// }

// export default function ProductActions({
//   product,
//   selectedVariant,
//   isSelectionInStock,
// }: ProductActionsProps) {
//   const { onAdd, buyNow, handleAddToWishlist } = useStateContext();
//   const [quantity, setQuantity] = useState(1);

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
//     buyNow(product, selectedVariant, quantity);
//   };

//   return (
//     <div className="flex flex-col gap-4 mt-auto">
//       <div className="flex items-center justify-between">
//         <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
//         <button
//           onClick={() => handleAddToWishlist(product)}
//           className="flex items-center gap-2 p-3 text-text-secondary hover:text-brand-danger transition-colors"
//           aria-label="Add to wishlist"
//         >
//           <Heart size={20} />
//           <span className="text-sm font-medium hidden sm:inline">
//             Add to Wishlist
//           </span>
//         </button>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <button
//           onClick={handleAddToCart}
//           disabled={!isSelectionInStock}
//           className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           <ShoppingCart size={20} /> Add to Cart
//         </button>
//         <button
//           onClick={handleBuyNow}
//           disabled={!isSelectionInStock}
//           className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-secondary text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           Buy Now
//         </button>
//       </div>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { useStateContext } from "@/app/context/StateContext";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import QuantitySelector from "../../ui/QuantitySelector";
// import { ShoppingCart, Heart, Zap } from "lucide-react";

// interface ProductActionsProps {
//   product: SanityProduct;
//   selectedVariant: ProductVariant | null;
//   isSelectionInStock: boolean;
// }

// export default function ProductActions({
//   product,
//   selectedVariant,
//   isSelectionInStock,
// }: ProductActionsProps) {
//   const { onAdd, buyNow, handleAddToWishlist } = useStateContext();
//   const [quantity, setQuantity] = useState(1);
//   const [showStickyBar, setShowStickyBar] = useState(false);

//   // Scroll detection for Sticky Bar
//   useEffect(() => {
//     const handleScroll = () => {
//         // Show sticky bar only when user scrolls past the main button
//         if (window.scrollY > 600) {
//             setShowStickyBar(true);
//         } else {
//             setShowStickyBar(false);
//         }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleAddToCart = () => {
//     if (!selectedVariant) return toast.error("Please select options.");
//     if (!isSelectionInStock) return toast.error("Out of stock.");
//     onAdd(product, selectedVariant, quantity);
//   };

//   const handleBuyNow = () => {
//     if (!selectedVariant) return toast.error("Please select options.");
//     if (!isSelectionInStock) return toast.error("Out of stock.");
//     buyNow(product, selectedVariant, quantity);
//   };

//   return (
//     <>
//       {/* === STANDARD ACTION BLOCK === */}
//       <div className="flex flex-col gap-5 mt-6 pb-4 border-b border-gray-100 dark:border-gray-800 md:border-none">
        
//         {/* Wishlist & Quantity Row */}
//         <div className="flex items-center justify-between">
//           <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
//           <button
//             onClick={() => handleAddToWishlist(product)}
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium text-sm"
//           >
//             <Heart size={20} />
//             <span>Save to Wishlist</span>
//           </button>
//         </div>

//         {/* Buttons Row */}
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             onClick={handleAddToCart}
//             disabled={!isSelectionInStock}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ShoppingCart size={20} /> Add to Cart
//           </button>
//           <button
//             onClick={handleBuyNow}
//             disabled={!isSelectionInStock}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover transition-all shadow-lg shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Zap size={20} fill="currentColor" /> Buy Now
//           </button>
//         </div>
//       </div>

//       {/* === 🔥 MOBILE STICKY BAR (Only shows on scroll) === */}
//       <div 
//         className={`fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 md:hidden transition-transform duration-300
//         ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}
//       >
//          <div className="flex gap-3">
//             <div className="grow">
//                 <p className="text-xs text-gray-500 truncate">{product.title}</p>
//                 <p className="font-bold text-brand-primary">
//                     Rs. {(selectedVariant?.salePrice ?? selectedVariant?.price ?? 0).toLocaleString()}
//                 </p>
//             </div>
//             <button
//                 onClick={handleAddToCart}
//                 disabled={!isSelectionInStock}
//                 className="px-6 py-2 bg-brand-primary text-white font-bold rounded-lg shadow-md disabled:opacity-50"
//             >
//                 Add to Cart
//             </button>
//          </div>
//       </div>
//     </>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";
// import { toast } from "react-hot-toast";
// import { useStateContext } from "@/app/context/StateContext";
// import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
// import QuantitySelector from "../../ui/QuantitySelector";
// import { ShoppingCart, Heart, Zap, X } from "lucide-react";
// import { motion } from "framer-motion";

// interface ProductActionsProps {
//   product: SanityProduct;
//   selectedVariant: ProductVariant | null;
//   isSelectionInStock: boolean;
// }

// const MOBILE_NAV_HEIGHT = 60; 

// export default function ProductActions({
//   product,
//   selectedVariant,
//   isSelectionInStock,
// }: ProductActionsProps) {
//   const { onAdd, buyNow, handleAddToWishlist } = useStateContext();
//   // Quantity State ko Sticky Bar ke liye yahan rakhenge
//   const [quantity, setQuantity] = useState(1); 
//   const [showStickyBar, setShowStickyBar] = useState(false);
//   const [isDismissed, setIsDismissed] = useState(false);

//   // Scroll detection for Sticky Bar
//   useEffect(() => {
//     const handleScroll = () => {
//         if (window.scrollY > 600 && !isDismissed) {
//             setShowStickyBar(true);
//         } else if (window.scrollY < 100) {
//             setIsDismissed(false);
//             setShowStickyBar(false);
//         } else {
//             setShowStickyBar(false);
//         }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isDismissed]);

//   const handleAddToCart = () => {
//     if (!selectedVariant) return toast.error("Please select options.");
//     if (!isSelectionInStock) return toast.error("Out of stock.");
//     onAdd(product, selectedVariant, quantity);
//   };

//   const handleBuyNow = () => {
//     if (!selectedVariant) return toast.error("Please select options.");
//     if (!isSelectionInStock) return toast.error("Out of stock.");
//     buyNow(product, selectedVariant, quantity);
//   };

//   const effectivePrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? 0;
//   const isButtonDisabled = !isSelectionInStock || !selectedVariant;

//   return (
//     <>
//       {/* === 1. STANDARD ACTION BLOCK (DESKTOP/MAIN) === */}
//       <div className="flex flex-col gap-5 mt-6 pb-4 border-b border-gray-100 dark:border-gray-800 md:border-none">
        
//         {/* Wishlist & Quantity Row */}
//         <div className="flex items-center justify-between">
//           <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
//           <button
//             onClick={() => handleAddToWishlist(product)}
//             className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium text-sm"
//           >
//             <Heart size={20} />
//             <span>Save to Wishlist</span>
//           </button>
//         </div>

//         {/* Buttons Row */}
//         <div className="grid grid-cols-2 gap-3">
//           <button
//             onClick={handleAddToCart}
//             disabled={!isSelectionInStock}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ShoppingCart size={20} /> Add to Cart
//           </button>
//           <button
//             onClick={handleBuyNow}
//             disabled={!isSelectionInStock}
//             className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover transition-all shadow-lg shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Zap size={20} fill="currentColor" /> Buy Now
//           </button>
//         </div>
//       </div>

//       {/* === 🔥 2. MOBILE STICKY BAR (ULTIMATE FIX with Quantity) === */}
//       <motion.div
//         initial={false}
//         animate={{ y: showStickyBar ? 0 : 100 }}
//         transition={{ type: "spring", stiffness: 350, damping: 35 }}
        
//         className="fixed left-0 right-0 p-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.15)] z-40 md:hidden"
//         style={{ 
//             bottom: `${MOBILE_NAV_HEIGHT}px`, // Stop just above the bottom nav
//             paddingBottom: `calc(12px + env(safe-area-inset-bottom))` 
//         }}
//       >
//          <div className="flex items-center gap-3">
            
//             {/* Price & Quantity Selector */}
//             <div className="flex flex-col grow">
               
//                 <p className="text-lg font-black text-brand-primary leading-tight">
//                     Rs. {effectivePrice.toLocaleString()}
//                 </p>
               
//             </div>
//  {/* Quantity Selector (Smaller) */}
//                 <div >
//                     <QuantitySelector 
//                         quantity={quantity} 
//                         onQuantityChange={setQuantity}
//                         // Smaller size for sticky bar
                        
//                     />
//                 </div>
//             {/* Actions Buttons (Buy Now & Add to Cart) */}
//             <div className="grid grid-cols-2 gap-2 w-1/2 shrink-0">
//                 <button
//                     onClick={handleAddToCart}
//                     disabled={isButtonDisabled}
//                     className="flex items-center justify-center py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
//                 >
//                     <ShoppingCart size={16} />
//                 </button>
//                 <button
//                     onClick={handleBuyNow}
//                     disabled={isButtonDisabled}
//                     className="flex items-center justify-center py-2.5 bg-brand-primary text-white font-bold rounded-lg text-sm hover:bg-brand-primary-hover disabled:opacity-50"
//                 >
//                      Buy now
//                 </button>
//             </div>
//          </div>
//       </motion.div>
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useStateContext } from "@/app/context/StateContext";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import QuantitySelector from "../../ui/QuantitySelector";
import { ShoppingCart, Heart, Zap, ChevronsUp } from "lucide-react"; // ChevronsUp added
import { motion, AnimatePresence } from "framer-motion";
import ProductActionSheet from "./ProductActionSheet";

interface ProductActionsProps {
  product: SanityProduct;
  selectedVariant: ProductVariant | null;
  isSelectionInStock: boolean;
}

export default function ProductActions({
  product,
  selectedVariant,
  isSelectionInStock,
}: ProductActionsProps) {
  const { onAdd, buyNow, handleAddToWishlist } = useStateContext();
  
  const [quantity, setQuantity] = useState(1); 
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
        // Show sticky bar after scrolling past 400px
        if (window.scrollY > 400) {
            setShowStickyBar(true);
        } else {
            setShowStickyBar(false);
            setIsSheetOpen(false);
        }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant) return toast.error("Please select options.");
    if (!isSelectionInStock) return toast.error("Out of stock.");
    onAdd(product, selectedVariant, quantity);
    setIsSheetOpen(false);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return toast.error("Please select options.");
    if (!isSelectionInStock) return toast.error("Out of stock.");
    buyNow(product, selectedVariant, quantity);
    setIsSheetOpen(false);
  };

  const effectivePrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? 0;

  return (
    <>
      {/* === 1. DESKTOP/MAIN ACTIONS (Standard View) === */}
      <div className="flex flex-col gap-5 mt-6 pb-4 border-b border-gray-100 dark:border-gray-800 md:border-none">
        <div className="flex items-center justify-between">
          <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
          <button
            onClick={() => handleAddToWishlist(product)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-brand-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium text-sm"
          >
            <Heart size={20} />
            <span>Save to Wishlist</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!isSelectionInStock}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={!isSelectionInStock}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary-hover transition-all shadow-lg shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={20} fill="currentColor" /> Buy Now
          </button>
        </div>
      </div>

      {/* === 2. MOBILE STICKY BUTTON (Matches Cart Page Style) === */}
      <AnimatePresence>
        {showStickyBar && (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                
                // Positioned EXACTLY like Cart Page button
                // bottom-16 (64px) ensures it sits above Bottom Nav
                className="fixed bottom-14.5 left-0 right-0 p-4 z-40 md:hidden pointer-events-none"
            >
                <button
                    onClick={() => setIsSheetOpen(true)}
                    // pointer-events-auto is needed because parent has pointer-events-none
                    className="w-full pointer-events-auto flex items-center justify-between px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(255,143,50,0.4)] active:scale-[0.98] transition-all duration-200"
                >
                    <span className="flex items-center gap-2 text-lg font-clash">
                        <ChevronsUp size={20} className="animate-bounce" />
                        Add to Cart
                    </span>
                    <span className="text-xl font-extrabold bg-white/20 px-2 py-0.5 rounded-md">
                        Rs. {effectivePrice.toLocaleString()}
                    </span>
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* === 3. THE ACTION SHEET === */}
      <ProductActionSheet 
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        product={product}
        selectedVariant={selectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isSelectionInStock={isSelectionInStock}
      />
    </>
  );
}