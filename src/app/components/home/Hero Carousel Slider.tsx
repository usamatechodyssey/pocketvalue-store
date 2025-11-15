// app/components/ui/HeroCarousel.tsx (FINAL CODE - WITHOUT DRAGGING)

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useKeenSlider, KeenSliderInstance } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

// Main Carousel Component
export default function HeroCarousel({
  banners,
}: {
  banners: HeroCarouselSlide[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true, // Slides ko loop mein chalayein
    initial: 0,
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
    created: () => setLoaded(true), // Slider load hone par state update karein
  });

  // Autoplay functionality with pause-on-hover
  useEffect(() => {
    const startAutoplay = () => {
      autoplayTimerRef.current = setInterval(() => {
        instanceRef.current?.next();
      }, 4000); // Har 4 second mein slide change hogi
    };

    const stopAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };

    const sliderContainer = instanceRef.current?.container;
    if (sliderContainer) {
      // Jab user mouse slider par laye, to autoplay rok dein
      sliderContainer.addEventListener("mouseover", stopAutoplay);
      // Jab mouse hataye, to dobara shuru kar dein
      sliderContainer.addEventListener("mouseout", startAutoplay);
      startAutoplay(); // Initial autoplay start
    }

    // Component unmount hone par timer aur listeners saaf karein
    return () => {
      stopAutoplay();
      if (sliderContainer) {
        sliderContainer.removeEventListener("mouseover", stopAutoplay);
        sliderContainer.removeEventListener("mouseout", startAutoplay);
      }
    };
  }, [instanceRef]);

  // Agar Sanity se koi banners na aayein, to component ko render na karein
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 sm:px-2 md:px-4">
      <div className="w-full mx-auto relative group">
        <div
          ref={sliderRef}
          className={`keen-slider hero-carousel-slider rounded-lg md:rounded-xl overflow-hidden aspect-2/1 md:aspect-3/1 lg:aspect-[3.5/1] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: "opacity 0.5s" }}
        >
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="keen-slider__slide relative bg-gray-200 dark:bg-gray-800"
            >
              <Link
                href={banner.link || "#"}
                className="block w-full h-full outline-none"
                aria-label={`View deal: ${banner.title}`}
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={banner.mobileImage}
                  />
                  <source
                    media="(min-width: 768px)"
                    srcSet={banner.desktopImage}
                  />
                  <img
                    src={banner.desktopImage}
                    alt={banner.title || "Promotional banner"}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="sync"
                    fetchPriority="high"
                  />
                </picture>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Group-hover par nazar aayenge) */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              aria-label="Previous slide"
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
            >
              <FiChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              aria-label="Next slide"
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
            >
              <FiChevronRight size={24} className="text-gray-800" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  currentSlide === idx
                    ? "w-4 bg-orange-500 scale-110" // Active dot style
                    : "bg-white/70 hover:bg-white" // Inactive dot style
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// --- SUMMARY OF CHANGES ---
// - Dragging Plugin Removed: `DraggablePlugin` aur usse related tamam code (mousedown, mousemove, etc.) ko mukammal tor par hata diya gaya hai.
// - Clean Initialization: `useKeenSlider` ab seedha options object ke sath initialize ho raha hai, bina kisi external plugin ke.
// - Smooth Experience: Slider ab sirf arrows, dots, ya autoplay se hi chalega. Is se "mix plate" hone wala issue khatam ho gaya hai.
// - Cursor Fix: `cursor: grab` aur `cursor: grabbing` ka logic bhi hata diya gaya hai, is liye ab aam arrow cursor hi nazar aayega, jo links ke liye behtar hai.
