// app/components/home/CategoryCarousel.tsx (THE FINAL POLISHED VERSION)

"use client";

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import "@/app/styles/CategoryCarousel.css"; // Yeh file wesi hi rahegi

interface Props {
  title: string;
  categories: SanityCategory[];
}

// Function ka naam bhi update kar diya gaya hai
export default function CategoryCarousel({ title, categories }: Props) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // tracks ki logic wesi hi rahegi
  const tracks = [0, 1];

  return (
    // === 1. CONSISTENT BACKGROUND APPLIED ===
    <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title ko uncomment kar ke behtar style diya gaya hai */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-primary dark:text-gray-100 mb-10">
          {/* {title || "Shop By Category"} */}
        </h2>
      </div>

      {/* Aapka auto-scrolling container waisa hi rahega */}
      <div className="category-carousel-container">
        <div className="category-carousel-scroller">
          {tracks.map((trackIndex) => (
            <div
              key={trackIndex}
              className="category-carousel-track"
              aria-hidden={trackIndex === 1}
            >
              {categories.map((category) => (
                // Wrapper ko thori si padding di gayi hai
                <div key={category._id} className="category-item-wrapper px-3">
                  <Link
                    href={`/category/${category.slug}`}
                    className="group text-center block"
                  >
                    {/* === 2. "FLOATING GLASS" DESIGN APPLIED === */}
                    <div
                      className="
                          relative aspect-square w-full max-w-[220px] mx-auto rounded-2xl 
                          overflow-hidden transition-all duration-300
                          group-hover:shadow-xl group-hover:-translate-y-1.5
                          border border-white/20
                          bg-white/60 dark:bg-white/10
                          backdrop-blur-lg
                        "
                    >
                      {category.image ? (
                        <Image
                          src={urlFor(category.image)
                            .width(250)
                            .height(250)
                            .url()}
                          alt={category.name}
                          fill
                          sizes="15vw"
                          // 'object-cover' for edge-to-edge look
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-xs text-text-subtle p-2">
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* ======================================= */}

                    <h3 className="mt-4 text-sm font-semibold text-text-primary dark:text-gray-200 group-hover:text-brand-primary transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
