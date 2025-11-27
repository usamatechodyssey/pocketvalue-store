
// /src/app/components/product/pdp-sections/ProductActions.tsx

"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useStateContext } from "@/app/context/StateContext";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import QuantitySelector from "../../ui/QuantitySelector";
import { ShoppingCart, Heart } from "lucide-react";

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

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select available options.");
      return;
    }
    if (!isSelectionInStock) {
      toast.error("This combination is currently out of stock.");
      return;
    }
    onAdd(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) {
      toast.error("Please select available options.");
      return;
    }
    if (!isSelectionInStock) {
      toast.error("This combination is currently out of stock.");
      return;
    }
    buyNow(product, selectedVariant, quantity);
  };

  return (
    <div className="flex flex-col gap-4 mt-auto">
      <div className="flex items-center justify-between">
        <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
        <button
          onClick={() => handleAddToWishlist(product)}
          className="flex items-center gap-2 p-3 text-text-secondary hover:text-brand-danger transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart size={20} />
          <span className="text-sm font-medium hidden sm:inline">
            Add to Wishlist
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleAddToCart}
          disabled={!isSelectionInStock}
          className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!isSelectionInStock}
          className="grow flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-secondary text-white font-bold rounded-lg shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
