
"use client";

import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SanityProduct from "@/sanity/types/product_types";
import { urlFor } from "@/sanity/lib/image";
import ProductCard from "@/app/components/product/ProductCard";
import QuickViewModal from "@/app/components/product/QuickViewModal";

interface Banner {
  tag: string;
  bannerImage: any;
  link?: string;
}
interface ProductCarouselProps {
  title: string;
  products: SanityProduct[];
  banner?: Banner;
}

export default function ProductCarousel({
  title,
  products,
  banner,
}: ProductCarouselProps) {
  const [quickViewProduct, setQuickViewProduct] =
    useState<SanityProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    created: () => setLoaded(true),
    loop: products.length > 5,
    mode: "free-snap",
    slides: { perView: "auto", spacing: 24 },
  });

  if (!products || products.length === 0) return null;

  // --- FINAL FIX: DYNAMIC "VIEW ALL" LINK ---
  let viewAllLink = "/search";
  if (title.toLowerCase().includes("new arrivals")) {
    viewAllLink = "/search?sort=newest";
  } else if (title.toLowerCase().includes("best sellers")) {
    viewAllLink = "/search?sort=best-selling";
  } else if (title.toLowerCase().includes("featured")) {
    // isFeatured ab `filter` parameter mein jayega
    viewAllLink = "/search?filter=isFeatured";
  }
  // ------------------------------------------

  return (
    <>
      <section className="w-full bg-white dark:bg-gray-800/50 py-12 md:py-16 my-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h2>
            <Link
              href={viewAllLink}
              className="text-sm font-semibold flex items-center gap-1 text-brand-primary hover:underline transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex flex-row gap-6">
            {banner && (
              <div className="hidden lg:block shrink-0 w-60 rounded-xl overflow-hidden group shadow-lg">
                <Link
                  href={banner.link || "#"}
                  className="block w-full h-full relative"
                >
                  <Image
                    src={urlFor(banner.bannerImage).url()}
                    alt={`${title} Banner`}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
            )}
            <div className="relative flex-1 min-w-0">
              <div
                ref={sliderRef}
                className={`keen-slider h-full ${loaded ? "opacity-100" : "opacity-0"}`}
                style={{ transition: "opacity 0.4s ease-in" }}
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="keen-slider__slide py-2"
                    style={{ minWidth: "240px", maxWidth: "240px" }}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={setQuickViewProduct}
                      className="h-full"
                    />
                  </div>
                ))}
              </div>
              {loaded && instanceRef.current && products.length > 5 && (
                <>
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    aria-label="Previous Product"
                    className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronLeft
                      size={24}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    aria-label="Next Product"
                    className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronRight
                      size={24}
                      className="text-gray-700 dark:text-gray-200"
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
