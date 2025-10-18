"use client";

import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Link from "next/link";
import { FiZap } from "react-icons/fi";
import { FlashSaleData } from "@/sanity/types/product_types";

import FlashSaleProductCard from "../product/FlashSaleProductCard";
import CountdownTimer from "./CountdownTimer";

// Auto-scrolling plugin
const AutoplayPlugin: KeenSliderPlugin = (slider) => {
  const DURATION = 4000;
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, DURATION);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

// Props ki type ab FlashSaleData hogi
interface Props {
  data: FlashSaleData | null;
}

export default function FlashSaleSection({ data }: Props) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: data?.products ? data.products.length > 5 : false,
      mode: "free-snap",
      slides: { perView: "auto", spacing: 24 },
    },
    [AutoplayPlugin]
  );

  // Agar Sanity se data nahi aaya, ya products khali hain, to section render hi na karo.
  if (!data || !data.products || data.products.length === 0) {
    return null;
  }

  // Sanity se aane wale dynamic data ko istemal karein
  const { title, endDate, products } = data;

  return (
    <section className="w-full py-12 md:py-16">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl animated-brand-gradient p-6 md:p-10 text-white shadow-2xl">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center gap-4">
              <FiZap className="w-10 h-10 text-white animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                {title || "Flash Sale"}
              </h2>
            </div>
            <CountdownTimer endDate={endDate} />
          </div>

          {/* The Carousel */}
          <div ref={sliderRef} className="keen-slider">
            {products.map((product) => (
              <div
                key={product._id}
                className="keen-slider__slide py-2"
                style={{ minWidth: "240px", maxWidth: "240px" }}
              >
                <FlashSaleProductCard product={product} />
              </div>
            ))}
          </div>

          {/* The Button */}
          <div className="mt-12 text-center">
            <Link
              href="/deals"
              className="inline-block bg-white/10 text-white font-bold py-3 px-10 rounded-lg border border-white/30 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300"
            >
              Shop All Deals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
