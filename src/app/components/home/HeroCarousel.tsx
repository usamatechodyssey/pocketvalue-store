// // app/components/ui/HeroCarousel.tsx (FINAL CODE - WITHOUT DRAGGING)

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useKeenSlider, KeenSliderInstance } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

// // Main Carousel Component
// export default function HeroCarousel({
//   banners,
// }: {
//   banners: HeroCarouselSlide[];
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);
//   const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
//     loop: true, // Slides ko loop mein chalayein
//     initial: 0,
//     slideChanged: (s) => setCurrentSlide(s.track.details.rel),
//     created: () => setLoaded(true), // Slider load hone par state update karein
//   });

//   // Autoplay functionality with pause-on-hover
//   useEffect(() => {
//     const startAutoplay = () => {
//       autoplayTimerRef.current = setInterval(() => {
//         instanceRef.current?.next();
//       }, 4000); // Har 4 second mein slide change hogi
//     };

//     const stopAutoplay = () => {
//       if (autoplayTimerRef.current) {
//         clearInterval(autoplayTimerRef.current);
//       }
//     };

//     const sliderContainer = instanceRef.current?.container;
//     if (sliderContainer) {
//       // Jab user mouse slider par laye, to autoplay rok dein
//       sliderContainer.addEventListener("mouseover", stopAutoplay);
//       // Jab mouse hataye, to dobara shuru kar dein
//       sliderContainer.addEventListener("mouseout", startAutoplay);
//       startAutoplay(); // Initial autoplay start
//     }

//     // Component unmount hone par timer aur listeners saaf karein
//     return () => {
//       stopAutoplay();
//       if (sliderContainer) {
//         sliderContainer.removeEventListener("mouseover", stopAutoplay);
//         sliderContainer.removeEventListener("mouseout", startAutoplay);
//       }
//     };
//   }, [instanceRef]);

//   // Agar Sanity se koi banners na aayein, to component ko render na karein
//   if (!banners || banners.length === 0) {
//     return null;
//   }

//   return (
//     <section className="w-full py-4 sm:px-2 md:px-4">
//       <div className="w-full mx-auto relative group">
//         <div
//           ref={sliderRef}
//           className={`keen-slider hero-carousel-slider rounded-lg md:rounded-xl overflow-hidden aspect-2/1 md:aspect-3/1 lg:aspect-[3.5/1] ${
//             loaded ? "opacity-100" : "opacity-0"
//           }`}
//           style={{ transition: "opacity 0.5s" }}
//         >
//           {banners.map((banner) => (
//             <div
//               key={banner._id}
//               className="keen-slider__slide relative bg-gray-200 dark:bg-gray-800"
//             >
//               <Link
//                 href={banner.link || "#"}
//                 className="block w-full h-full outline-none"
//                 aria-label={`View deal: ${banner.title}`}
//               >
//                 <picture>
//                   <source
//                     media="(max-width: 767px)"
//                     srcSet={banner.mobileImage}
//                   />
//                   <source
//                     media="(min-width: 768px)"
//                     srcSet={banner.desktopImage}
//                   />
//                   <img
//                     src={banner.desktopImage}
//                     alt={banner.title || "Promotional banner"}
//                     className="w-full h-full object-cover"
//                     loading="eager"
//                     decoding="sync"
//                     fetchPriority="high"
//                   />
//                 </picture>
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* Navigation Arrows (Group-hover par nazar aayenge) */}
//         {loaded && instanceRef.current && (
//           <>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 instanceRef.current?.prev();
//               }}
//               aria-label="Previous slide"
//               className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
//             >
//               <FiChevronLeft size={24} className="text-gray-800" />
//             </button>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 instanceRef.current?.next();
//               }}
//               aria-label="Next slide"
//               className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/60 hover:bg-white p-2 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
//             >
//               <FiChevronRight size={24} className="text-gray-800" />
//             </button>
//           </>
//         )}

//         {/* Pagination Dots */}
//         {loaded && instanceRef.current && (
//           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
//             {banners.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => instanceRef.current?.moveToIdx(idx)}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none ${
//                   currentSlide === idx
//                     ? "w-4 bg-orange-500 scale-110" // Active dot style
//                     : "bg-white/70 hover:bg-white" // Inactive dot style
//                 }`}
//                 aria-label={`Go to slide ${idx + 1}`}
//               ></button>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - Dragging Plugin Removed: `DraggablePlugin` aur usse related tamam code (mousedown, mousemove, etc.) ko mukammal tor par hata diya gaya hai.
// // - Clean Initialization: `useKeenSlider` ab seedha options object ke sath initialize ho raha hai, bina kisi external plugin ke.
// // - Smooth Experience: Slider ab sirf arrows, dots, ya autoplay se hi chalega. Is se "mix plate" hone wala issue khatam ho gaya hai.
// // - Cursor Fix: `cursor: grab` aur `cursor: grabbing` ka logic bhi hata diya gaya hai, is liye ab aam arrow cursor hi nazar aayega, jo links ke liye behtar hai.
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";
// import HeroSkeleton from "./HeroSkeleton";

// export default function HeroCarousel({
//   banners,
// }: {
//   banners: HeroCarouselSlide[];
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
//     loop: true,
//     initial: 0,
//     drag: true,
//     slideChanged: (s) => setCurrentSlide(s.track.details.rel),
//     created: () => {
//         setTimeout(() => setLoaded(true), 500);
//     },
//   }, [
//     (slider) => {
//       let timeout: ReturnType<typeof setTimeout>;
//       let mouseOver = false;
//       function clearNextTimeout() { clearTimeout(timeout); }
//       function nextTimeout() {
//         clearTimeout(timeout);
//         if (mouseOver) return;
//         timeout = setTimeout(() => { slider.next(); }, 5000);
//       }
//       slider.on("created", () => {
//         slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNextTimeout(); });
//         slider.container.addEventListener("mouseout", () => { mouseOver = false; nextTimeout(); });
//         nextTimeout();
//       });
//       slider.on("dragStarted", clearNextTimeout);
//       slider.on("animationEnded", nextTimeout);
//       slider.on("updated", nextTimeout);
//     },
//   ]);

//   if (!banners || banners.length === 0) return null;

//   return (
//     <section className="w-full relative bg-gray-100 dark:bg-gray-900">
      
//       <div className="relative w-full aspect-4/5 md:aspect-3/1 group overflow-hidden">
        
//         {!loaded && (
//             <div className="absolute inset-0 z-20">
//                 <HeroSkeleton />
//             </div>
//         )}

//         <div
//           ref={sliderRef}
//           className={`keen-slider absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out
//             ${loaded ? "opacity-100" : "opacity-0"}
//           `}
//         >
//           {banners.map((banner, idx) => (
//             <div key={banner._id} className="keen-slider__slide relative w-full h-full">
//               <Link 
//                 href={banner.link || "#"} 
//                 className="block w-full h-full relative cursor-pointer"
//                 aria-label={`View Offer: ${banner.title}`}
//               >
//                 <div className="hidden md:block relative w-full h-full">
//                   <Image
//                     src={banner.desktopImage}
//                     alt={banner.title || "Banner"}
//                     fill
//                     priority={idx === 0}
//                     className="object-cover"
//                     sizes="100vw"
//                     quality={90}
//                   />
//                 </div>
//                 <div className="block md:hidden relative w-full h-full">
//                   <Image
//                     src={banner.mobileImage}
//                     alt={banner.title || "Banner"}
//                     fill
//                     priority={idx === 0}
//                     className="object-cover"
//                     sizes="100vw"
//                     quality={85}
//                   />
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* === CONTROLS (Fixed Z-Index & Colors) === */}
//         {loaded && instanceRef.current && (
//           <>
//             {/* Left Arrow */}
//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
//               className="hidden md:flex absolute left-6 -translate-y-1/2 
//               w-14 h-14 
//               /* Light Mode Colors */
//               bg-black/20 hover:bg-white/90 text-white hover:text-black
//               /* Dark Mode Colors */
//               dark:bg-black/40 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white
              
//               backdrop-blur-sm rounded-full items-center justify-center 
              
//               /* === Z-INDEX FIX (Reduced to 10) === */
//               z-10 
              
//               top-[60%] opacity-0 
//               group-hover:top-1/2 group-hover:opacity-100 
//               transition-all duration-500 ease-out
//               "
//             >
//               <ChevronLeft size={32} strokeWidth={2} className="group-hover/btn:-translate-x-1 transition-transform" />
//             </button>

//             {/* Right Arrow */}
//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
//               className="hidden md:flex absolute right-6 -translate-y-1/2 
//               w-14 h-14 
//               /* Light Mode Colors */
//               bg-black/20 hover:bg-white/90 text-white hover:text-black
//               /* Dark Mode Colors */
//               dark:bg-black/40 dark:hover:bg-gray-800 dark:text-gray-200 dark:hover:text-white

//               backdrop-blur-sm rounded-full items-center justify-center 
              
//               /* === Z-INDEX FIX (Reduced to 10) === */
//               z-10
              
//               top-[60%] opacity-0 
//               group-hover:top-1/2 group-hover:opacity-100 
//               transition-all duration-500 ease-out delay-75
//               "
//             >
//               <ChevronRight size={32} strokeWidth={2} className="group-hover/btn:translate-x-1 transition-transform" />
//             </button>

//             {/* Pagination Dots */}
//             {/* === Z-INDEX FIX (Reduced to 10) === */}
//             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
//               {banners.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => instanceRef.current?.moveToIdx(idx)}
//                   className={`transition-all duration-500 rounded-full shadow-sm border border-white/20 backdrop-blur-[1px] ${
//                     currentSlide === idx
//                       // Active Dot: Theme Color (Orange)
//                       ? "w-10 h-2.5 bg-brand-primary border-brand-primary" 
//                       // Inactive Dot: Glassy White
//                       : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80" 
//                   }`}
//                   aria-label={`Go to slide ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

// export default function HeroCarousel({
//   banners,
// }: {
//   banners: HeroCarouselSlide[];
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
//     {
//       loop: true,
//       initial: 0,
//       drag: true,
//       created: () => setLoaded(true),
//       slideChanged: (s) => setCurrentSlide(s.track.details.rel),
//     },
//     [
//       (slider) => {
//         let timeout: ReturnType<typeof setTimeout>;
//         let mouseOver = false;
//         function clearNextTimeout() { clearTimeout(timeout); }
//         function nextTimeout() {
//           clearTimeout(timeout);
//           if (mouseOver) return;
//           timeout = setTimeout(() => { slider.next(); }, 6000);
//         }
//         slider.on("created", () => {
//           slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNextTimeout(); });
//           slider.container.addEventListener("mouseout", () => { mouseOver = false; nextTimeout(); });
//           nextTimeout();
//         });
//         slider.on("dragStarted", clearNextTimeout);
//         slider.on("animationEnded", nextTimeout);
//         slider.on("updated", nextTimeout);
//       },
//     ]
//   );

//   if (!banners || banners.length === 0) return null;

//   return (
//     <section className="w-full bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
//       {/* 
//          Aspect Ratio 3:1 for Desktop as requested 
//          Mobile: 4/5 (Taller) 
//          Desktop: 3/1 (Wider)
//       */}
//       <div className="relative w-full aspect-4/5 md:aspect-3/1">
        
//         <div ref={sliderRef} className="keen-slider h-full w-full absolute inset-0">
//           {banners.map((banner, idx) => (
//             <div 
//               key={banner._id} 
//               // 🔥 FIX IS HERE: 'min-w-full' add kiya hai.
//               // Is se slides squish nahi hongi, chahe JS load na hui ho.
//               className="keen-slider__slide relative w-full h-full min-w-full"
//             >
//               <Link
//                 href={banner.link || "#"}
//                 className="block w-full h-full relative cursor-pointer"
//                 aria-label={`View Offer: ${banner.title}`}
//               >
//                 {/* DESKTOP IMAGE */}
//                 <div className="hidden md:block w-full h-full relative">
//                   <Image
//                     src={banner.desktopImage}
//                     alt={banner.title || "Hero Banner"}
//                     fill
//                     priority={idx === 0}
//                     sizes="90vw"
//                     quality={95}
//                     className="object-cover"
//                   />
//                 </div>

//                 {/* MOBILE IMAGE */}
//                 <div className="block md:hidden w-full h-full relative">
//                   <Image
//                     src={banner.mobileImage}
//                     alt={banner.title || "Hero Banner"}
//                     fill
//                     priority={idx === 0}
//                     sizes="90vw"
//                     quality={90}
//                     className="object-cover"
//                   />
//                 </div>

//                 <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* CONTROLS */}
//         {loaded && instanceRef.current && banners.length > 1 && (
//           <>
//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
//               className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
//             >
//               <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
//             </button>

//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
//               className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
//             >
//               <ChevronRight size={24} strokeWidth={2.5} className="ml-0.5" />
//             </button>

//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
//               {banners.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => instanceRef.current?.moveToIdx(idx)}
//                   className={`transition-all duration-500 rounded-full ${
//                     currentSlide === idx
//                       ? "w-8 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
//                       : "w-2 h-2 bg-white/50 hover:bg-white/80"
//                   }`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }
// // /src/app/components/home/HeroCarousel.tsx (FIXED)

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

// export default function HeroCarousel({
//   banners,
// }: {
//   banners: HeroCarouselSlide[];
// }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loaded, setLoaded] = useState(false);

//   const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
//     {
//       loop: true,
//       initial: 0,
//       drag: true,
//       created: () => setLoaded(true),
//       slideChanged: (s) => setCurrentSlide(s.track.details.rel),
//     },
//     [
//       (slider) => {
//         let timeout: ReturnType<typeof setTimeout>;
//         let mouseOver = false;
//         function clearNextTimeout() { clearTimeout(timeout); }
//         function nextTimeout() {
//           clearTimeout(timeout);
//           if (mouseOver) return;
//           timeout = setTimeout(() => { slider.next(); }, 6000);
//         }
//         slider.on("created", () => {
//           slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNextTimeout(); });
//           slider.container.addEventListener("mouseout", () => { mouseOver = false; nextTimeout(); });
//           nextTimeout();
//         });
//         slider.on("dragStarted", clearNextTimeout);
//         slider.on("animationEnded", nextTimeout);
//         slider.on("updated", nextTimeout);
//       },
//     ]
//   );

//   if (!banners || banners.length === 0) return null;

//   return (
//     <section className="w-full bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
//       <div className="relative w-full aspect-4/5 md:aspect-3/1">
        
//         <div ref={sliderRef} className="keen-slider h-full w-full absolute inset-0">
//           {banners.map((banner, idx) => (
//             <div 
//               key={banner._id} 
//               className="keen-slider__slide relative w-full h-full min-w-full"
//             >
//               <Link
//                 href={banner.link || "#"}
//                 className="block w-full h-full relative cursor-pointer"
//                 aria-label={`View Offer: ${banner.title}`}
//               >
//                 {/* DESKTOP IMAGE */}
//                 <div className="hidden md:block w-full h-full relative">
//                   <Image
//                     src={banner.desktopImage}
//                     alt={banner.title || "Hero Banner"}
//                     fill
//                     priority={idx === 0}
//                     sizes="90vw"
//                     quality={95}
//                     className="object-cover"
//                   />
//                 </div>

//                 {/* MOBILE IMAGE */}
//                 <div className="block md:hidden w-full h-full relative">
//                   <Image
//                     src={banner.mobileImage}
//                     alt={banner.title || "Hero Banner"}
//                     fill
//                     priority={idx === 0}
//                     sizes="90vw"
//                     quality={90}
//                     className="object-cover"
//                   />
//                 </div>

//                 <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
//               </Link>
//             </div>
//           ))}
//         </div>

//         {/* 
//           --- FIX HERE --- 
//           Removed 'instanceRef.current' from the condition. 
//           Accessing refs during render is not allowed. 
//           'loaded' state is sufficient to know if slider is ready.
//         */}
//         {loaded && banners.length > 1 && (
//           <>
//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
//               className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
//             >
//               <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
//             </button>

//             <button
//               onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
//               className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
//             >
//               <ChevronRight size={24} strokeWidth={2.5} className="ml-0.5" />
//             </button>

//             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
//               {banners.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => instanceRef.current?.moveToIdx(idx)}
//                   className={`transition-all duration-500 rounded-full ${
//                     currentSlide === idx
//                       ? "w-8 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
//                       : "w-2 h-2 bg-white/50 hover:bg-white/80"
//                   }`}
//                 />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";

export default function HeroCarousel({
  banners,
}: {
  banners: HeroCarouselSlide[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      drag: true,
      created: () => setLoaded(true),
      slideChanged: (s) => setCurrentSlide(s.track.details.rel),
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;
        function clearNextTimeout() { clearTimeout(timeout); }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => { slider.next(); }, 6000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => { mouseOver = true; clearNextTimeout(); });
          slider.container.addEventListener("mouseout", () => { mouseOver = false; nextTimeout(); });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full bg-gray-100 dark:bg-gray-900 overflow-hidden relative">
      <div className="relative w-full aspect-4/5 md:aspect-3/1">
        
        <div ref={sliderRef} className="keen-slider h-full w-full absolute inset-0">
          {banners.map((banner, idx) => (
            <div 
              key={banner._id} 
              className="keen-slider__slide relative w-full h-full min-w-full"
            >
              <Link
                href={banner.link || "#"}
                className="block w-full h-full relative cursor-pointer"
                aria-label={`View Offer: ${banner.title}`}
              >
                {/* DESKTOP IMAGE */}
                <div className="hidden md:block w-full h-full relative">
                  <Image
                    src={banner.desktopImage}
                    alt={banner.title || "Hero Banner"}
                    fill
                    priority={idx === 0}
                    sizes="90vw"
                    quality={95}
                    className="object-cover"
                  />
                </div>

                {/* MOBILE IMAGE */}
                <div className="block md:hidden w-full h-full relative">
                  <Image
                    src={banner.mobileImage}
                    alt={banner.title || "Hero Banner"}
                    fill
                    priority={idx === 0}
                    sizes="90vw"
                    quality={90}
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
              </Link>
            </div>
          ))}
        </div>

        {loaded && banners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); instanceRef.current?.prev(); }}
              // ✅ ARIA-LABEL ADDED
              aria-label="Previous Slide"
              className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
            >
              <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); instanceRef.current?.next(); }}
              // ✅ ARIA-LABEL ADDED
              aria-label="Next Slide"
              className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full items-center justify-center text-white hover:text-black z-20 transition-all duration-300 ease-out border border-white/20 hover:scale-110 shadow-lg"
            >
              <ChevronRight size={24} strokeWidth={2.5} className="ml-0.5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  // ✅ ARIA-LABEL ADDED (Dynamic)
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-500 rounded-full ${
                    currentSlide === idx
                      ? "w-8 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      : "w-2 h-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}