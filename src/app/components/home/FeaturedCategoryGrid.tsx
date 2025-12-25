"use client";

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";

interface GridCategory {
  _key: string;
  discountText: string;
  category: SanityCategory;
}

interface Props {
  title: string;
  categories: GridCategory[];
}

export default function FeaturedCategoryGrid({ title, categories }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10 uppercase tracking-wider">
          {title || "SHOP BY CATEGORY"}
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((item, index) => {
            // SAFETY CHECK: Agar category null ho to skip karo (Zaruri hai)
            if (!item.category) return null;

            // UNIQUE KEY: Combining _key and index
            const uniqueKey = item._key || `cat-grid-${index}`;

            return (
              <Link
                key={uniqueKey} 
                href={`/category/${item.category.slug}`}
                className="group relative block overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-3/4 w-full bg-gray-200 dark:bg-gray-800">
                  {item.category.image ? (
                    <Image
                      src={urlFor(item.category.image).width(400).height(600).url()}
                      alt={item.category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                      <span className="text-sm text-gray-400 font-medium">
                        {item.category.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay for Text */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  
                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 p-4 w-full">
                    <h3 className="text-lg font-bold text-white leading-tight mb-1 drop-shadow-md">
                        {item.category.name}
                    </h3>
                    {item.discountText && (
                        <p className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                        {item.discountText}
                        </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}