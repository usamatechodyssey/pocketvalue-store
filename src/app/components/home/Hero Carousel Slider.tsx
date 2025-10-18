// app/components/ui/HeroCarousel.tsx (MUKAMMAL FINAL CODE)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css"; // Keen Slider ki CSS import karein
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

// Yeh plugin slider ko mouse se drag karne ki functionality deta hai
const DraggablePlugin: KeenSliderPlugin = (slider) => {
  let touchTimeout: ReturnType<typeof setTimeout>;
  let position: { x: number; y: number };
  let anabled = false;

  function unify(e: TouchEvent | MouseEvent) {
    return "changedTouches" in e ? e.changedTouches[0] : e;
  }

  function mousemove(e: MouseEvent) {
    e.preventDefault();
    if (!anabled) return;
    const p = unify(e);
    const deltaX = p.pageX - position.x;
    position = { x: p.pageX, y: p.pageY };
    if (Math.abs(deltaX) > Math.abs(p.pageY - position.y)) {
      slider.container.style.cursor = "grabbing";
      slider.track.add(deltaX);
    }
  }

  function mousedown(e: MouseEvent) {
    e.preventDefault();
    const p = unify(e);
    position = { x: p.pageX, y: p.pageY };
    anabled = true;
    slider.container.style.cursor = "grabbing";
    slider.container.addEventListener("mousemove", mousemove);
  }

  function mouseup(e: MouseEvent) {
    e.preventDefault();
    anabled = false;
    slider.container.style.cursor = "grab";
    slider.container.removeEventListener("mousemove", mousemove);
  }

  slider.on("created", () => {
    slider.container.style.cursor = "grab";
    slider.container.addEventListener("mousedown", mousedown);
    slider.container.addEventListener("mouseup", mouseup);
  });
};

// Main Carousel Component
export default function HeroCarousel({
  banners,
}: {
  banners: HeroCarouselSlide[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true, // Slides ko loop mein chalayein
      slideChanged: (s) => setCurrentSlide(s.track.details.rel),
      created() {
        setLoaded(true); // Slider load hone par state update karein
      },
    },
    [DraggablePlugin] // Dragging plugin ko yahan enable karein
  );

  // Auto-play functionality ke liye useEffect hook
  useEffect(() => {
    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, 4000); // Har 4 second mein slide change hogi
    return () => {
      clearInterval(timer); // Component unmount hone par timer saaf karein
    };
  }, [instanceRef]);

  // Agar Sanity se koi banners na aayein, to component ko render na karein
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    // Section ko side se padding di gayi hai taake yeh mobile par contained lage
    <section className="w-full px-0 md:px-2 lg:px-2 py-0 bg-surface-ground dark:bg-gray-950">
      <div className="w-full mx-auto relative">
        <div
          ref={sliderRef}
          // Slider ko rounded corners aur responsive height di gayi hai
          className={`keen-slider hero-carousel-slider rounded-xl overflow-hidden ${
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
                className="block w-full h-full"
                aria-label={banner.title || "Promotional banner"}
              >
                <picture>
                  {/* Mobile devices ke liye alag, choti image */}
                  <source
                    media="(max-width: 767px)"
                    srcSet={banner.mobileImage}
                  />
                  {/* Desktop devices ke liye alag, bari image */}
                  <source
                    media="(min-width: 768px)"
                    srcSet={banner.desktopImage}
                  />
                  {/* Fallback image agar browser <picture> support na kare */}
                  <img
                    src={banner.desktopImage}
                    alt={banner.title || "Promotional banner"}
                    className="w-full h-full object-cover"
                    loading="eager" // Pehli image ko foran load karein (LCP Optimization)
                  />
                </picture>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Sirf Tablet aur Desktop par nazar aayenge) */}
        {loaded && instanceRef.current && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              aria-label="Previous slide"
              className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 focus:outline-none"
            >
              <FiChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              aria-label="Next slide"
              className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110 focus:outline-none"
            >
              <FiChevronRight size={24} className="text-gray-800" />
            </button>
          </>
        )}

        {/* Pagination Dots (Image ke upar, neeche center mein) */}
        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
                  currentSlide === idx
                    ? "w-4 bg-orange-500" // Active dot ka style
                    : "bg-white/70 hover:bg-white" // Inactive dot ka style
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
