"use client";

import { useState } from "react";
import SanityProduct from "@/sanity/types/product_types";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import ProductCard from "@/app/components/product/ProductCard";
import QuickViewModal from "@/app/components/product/QuickViewModal";

interface Props {
  title: string;
  products: SanityProduct[];
}

export default function RelatedProducts({ title, products }: Props) {
  const [quickViewProduct, setQuickViewProduct] = useState<SanityProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    created: () => setLoaded(true),
    loop: products.length > 5,
    mode: "free-snap",
    slides: { perView: "auto", spacing: 24 },
  });

  if (!products || products.length === 0) return null;

  const handleQuickView = (product: SanityProduct) => setQuickViewProduct(product);
  const handleCloseModal = () => setQuickViewProduct(null);

  return (
    <>
      <section className="w-full py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">{title}</h2>
          </div>
          
          <div className="relative">
            <div ref={sliderRef} className="keen-slider">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="keen-slider__slide py-2"
                  style={{ minWidth: "240px", maxWidth: "240px" }}
                >
                  <ProductCard
                    product={product}
                    onQuickView={handleQuickView}
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
                  className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <FiChevronLeft size={24} className="text-gray-700" />
                </button>
                <button
                  onClick={() => instanceRef.current?.next()}
                  aria-label="Next Product"
                  className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <FiChevronRight size={24} className="text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseModal}
      />
    </>
  );
}