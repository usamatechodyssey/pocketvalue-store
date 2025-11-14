"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { CleanCartItem } from "@/sanity/types/product_types";
import { useStateContext } from "@/app/context/StateContext";

export default function CartItem({ item }: { item: CleanCartItem }) {
  const { onRemove, toggleCartItemQuantity } = useStateContext();

  return (
    <div className="flex items-start gap-4 p-4 sm:p-6">
      <Link href={`/product/${item.slug}`} className="shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <Image
            src={urlFor(item.image).url()}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-contain p-2"
          />
        </div>
      </Link>

      <div className="grow flex flex-col justify-between h-full">
        <div>
          <Link
            href={`/product/${item.slug}`}
            className="font-semibold text-gray-800 dark:text-gray-200 hover:text-brand-primary leading-tight line-clamp-2"
          >
            {item.name}
          </Link>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Unit Price: Rs. {item.price.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 bg-gray-100 dark:bg-gray-700/50 rounded-full p-1 w-fit">
          <button
            onClick={() => toggleCartItemQuantity(item.cartItemId, "dec")}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Minus size={14} />
          </button>
          <span className="font-bold w-8 text-center text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => toggleCartItemQuantity(item.cartItemId, "inc")}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="text-right flex flex-col items-end justify-between h-full shrink-0 ml-4">
        <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Rs. {(item.price * item.quantity).toLocaleString()}
        </p>
        <button
          onClick={() => onRemove(item)}
          className="text-gray-500 hover:text-brand-danger mt-auto"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
