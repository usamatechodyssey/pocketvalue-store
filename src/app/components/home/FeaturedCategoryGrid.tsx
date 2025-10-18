// app/components/home/FeaturedCategoryGrid.tsx - THE NEW MYNTRA-STYLE GRID

"use client";

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";

// Nayi, behtar type jo discount text bhi handle karti hai
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
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 bg-surface-ground ">
        <h2 className="text-3xl  text-center text-text-primary mb-8 uppercase tracking-wider">
          {title || "SHOP BY CATEGORY"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 ">
          {categories.map((item) => (
            <Link
              key={item._key}
              href={`/category/${item.category.slug}`}
              className="group relative block overflow-hidden"
            >
              <div className="relative aspect-[3/4] w-full">
                {item.category.image ? (
                  <Image
                    src={urlFor(item.category.image)
                      .width(300)
                      .height(400)
                      .url()}
                    alt={item.category.name}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 15vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-sm text-text-subtle p-2">
                      {item.category.name}
                    </span>
                  </div>
                )}
              </div>
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div> */}
              <div className="absolute bottom-0 left-0 p-4 text-white">
                {/* <h3 className="font-bold text-md">{item.category.name}</h3> */}
                <p className="text-lg font-extrabold text-yellow-300 uppercase">
                  {/* {item.discountText} */}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
