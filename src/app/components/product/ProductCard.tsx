// app/components/product/ProductCard.tsx (THE FINAL UPGRADED "EVERYDAY" CARD)

"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useStateContext } from "@/app/context/StateContext";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";

interface ProductCardProps {
  product: SanityProduct;
  onQuickView: (product: SanityProduct) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onQuickView,
  className,
}: ProductCardProps) {
  const { onAdd, handleAddToWishlist } = useStateContext();
  const defaultVariant: ProductVariant | undefined = product.defaultVariant;

  if (!defaultVariant) return null;

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const originalPrice = defaultVariant.price;
  const salePrice = defaultVariant.salePrice;
  const displayPrice = salePrice ?? originalPrice;
  const isOnSale = salePrice && salePrice < originalPrice;
  const discount = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  // "Smart" stock logic jo dono (number aur boolean) ko handle karti hai
  const stockCount = defaultVariant.stock;
  const isAvailable =
    stockCount !== undefined ? stockCount > 0 : defaultVariant.inStock;

  const imageUrl = defaultVariant.images?.[0]
    ? urlFor(defaultVariant.images[0]).width(400).height(400).url()
    : "/placeholder.png";

  return (
    <div className={className}>
      <Link
        href={`/product/${product.slug}`}
        className="w-full h-full block group"
      >
        <div className="bg-white dark:bg-gray-800 h-full flex flex-col transition-all duration-300 hover:-translate-y-2  overflow-hidden shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700">
          {/* Image Section */}
          <div className="relative overflow-hidden aspect-square w-full">
            <div className="bg-white p-4 h-full">
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            {isOnSale && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md z-10 shadow-lg">
                -{discount}%
              </span>
            )}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button
                onClick={(e) =>
                  handleActionClick(e, () => onQuickView(product))
                }
                aria-label="Quick View"
                className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-brand-primary hover:text-white transition-all"
              >
                <FiEye size={18} />
              </button>
              <button
                onClick={(e) =>
                  handleActionClick(e, () => handleAddToWishlist(product))
                }
                aria-label="Add to Wishlist"
                className="p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-red-500 hover:text-white transition-all"
              >
                <FiHeart size={18} />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-sm text-text-primary dark:text-gray-200 font-semibold line-clamp-2 h-10">
              {product.title}
            </h3>

            {/* === RATING & REVIEWS (WAPIS AA GAYE HAIN!) === */}
            <div className="mt-2 mb-3 h-5 flex items-center">
              {product.rating && product.rating > 0 ? (
                <div className="flex items-center gap-1">
                  <FiStar
                    size={14}
                    className="text-yellow-400 fill-yellow-400"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({product.reviewCount || 0})
                  </span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">No reviews yet</span>
              )}
            </div>

            <div className="mt-auto pt-2">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-bold text-text-primary dark:text-gray-100">{`Rs. ${displayPrice.toLocaleString()}`}</span>
                {isOnSale && (
                  <span className="text-sm text-text-subtle line-through">{`Rs. ${originalPrice.toLocaleString()}`}</span>
                )}
              </div>
              <button
                onClick={(e) =>
                  handleActionClick(e, () => onAdd(product, defaultVariant, 1))
                }
                disabled={!isAvailable}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <FiShoppingCart size={16} />
                <span>{isAvailable ? "Add to Cart" : "Out of Stock"}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
