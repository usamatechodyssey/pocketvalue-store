// app/components/home/FlashSaleProductCard.tsx (FINAL "EDGE-TO-EDGE" VERSION)

"use client";

import Link from "next/link";
import Image from "next/image";
import SanityProduct, { ProductVariant } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";

interface Props {
  product: SanityProduct;
}

export default function FlashSaleProductCard({ product }: Props) {
  const defaultVariant: ProductVariant | undefined = product.defaultVariant;

  if (!defaultVariant) return null;

  const originalPrice = defaultVariant.price;
  const salePrice = defaultVariant.salePrice;
  const displayPrice = salePrice ?? originalPrice;
  const isOnSale = salePrice && salePrice < originalPrice;
  const discount = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  const stockCount = defaultVariant.stock;
  const totalStock = 50;
  const itemsSold =
    stockCount !== undefined ? Math.max(0, totalStock - stockCount) : 20;
  const percentageClaimed = (itemsSold / totalStock) * 100;

  const imageUrl = defaultVariant.images?.[0]
    ? urlFor(defaultVariant.images[0]).width(300).height(300).url()
    : "/placeholder.png";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="block w-full h-full group"
    >
      {/* Card ka design ab "floating" hai */}
      <div className="bg-white dark:bg-gray-800 h-full flex flex-col transition-all duration-300 hover:-translate-y-2 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* === IMAGE SECTION (EDGE-TO-EDGE) === */}
        <div className="relative aspect-square w-full">
          {" "}
          {/* aspect-[4/3] se aspect-square kiya gaya hai behtar look ke liye */}
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="30vw"
            // object-cover image ko poori jagah par a_fit karega
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isOnSale && (
            <span className="absolute top-3 left-3 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full z-10 shadow-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* === CONTENT SECTION (WITH PADDING) === */}
        <div className="p-4 flex flex-col grow">
          <h3 className="text-sm text-text-primary dark:text-gray-200 font-semibold line-clamp-2 h-10">
            {product.title}
          </h3>

          <div className="mt-2 mb-3">
            <span className="text-2xl font-bold text-brand-primary">
              Rs. {displayPrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                Rs. {originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Progress Bar (mt-auto isay hamesha neeche rakhega) */}
          <div className="mt-auto">
            <div className="relative w-full h-2.5 bg-orange-100 dark:bg-gray-700 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full"
                style={{ width: `${percentageClaimed}%` }}
              />
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-1.5">
              ⚡️ {Math.round(percentageClaimed)}% Claimed
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
