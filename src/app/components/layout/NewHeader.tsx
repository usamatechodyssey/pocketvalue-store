// // "use client";

// // import React, { useRef, useEffect, useState } from "react";
// // import Link from "next/link";
// // import Image from "next/image";
// // import { SanityCategory } from "@/sanity/types/product_types";
// // import SearchBar from "./SearchBar";
// // import HeaderActions from "./HeaderActions";
// // import { Menu } from "lucide-react";
// // import { gsap } from "gsap";

// // interface SearchSuggestions {
// //   trendingKeywords: string[];
// //   popularCategories: SanityCategory[];
// // }
// // interface NewHeaderProps {
// //   categories: SanityCategory[];
// //   onMenuClick: () => void;
// //   searchSuggestions: SearchSuggestions;
// // }

// // export default function NewHeader({
// //   categories,
// //   onMenuClick,
// //   searchSuggestions,
// // }: NewHeaderProps) {
// //   const logoIconRef = useRef(null);
// //   const [isAnimating, setIsAnimating] = useState(false);

// //   const playLogoAnimation = () => {
// //     if (isAnimating || !logoIconRef.current) return;
// //     setIsAnimating(true);
// //     const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

// //     tl.to(logoIconRef.current, {
// //       x: -120,
// //       rotation: -360,
// //       scale: 1.1,
// //       duration: 1.5,
// //       ease: "power2.inOut",
// //     }).to(logoIconRef.current, {
// //       x: 0,
// //       rotation: 0,
// //       scale: 1,
// //       duration: 1.2,
// //       ease: "elastic.out(1, 0.5)",
// //       delay: 0.1,
// //     });
// //   };

// //   useEffect(() => {
// //     const timer = setTimeout(() => playLogoAnimation(), 1500);
// //     return () => clearTimeout(timer);
// //   }, []);

// //   return (
// //     <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 w-full z-50 relative">

// //       {/* === 🖥️ DESKTOP & TABLET VIEW === */}
// //       <div className="hidden md:flex items-center justify-between h-28 w-full px-6 lg:px-12 gap-8">
// //         <div className="flex items-center gap-6 shrink-0">
// //           <button onClick={onMenuClick} className="p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
// //             <Menu size={28} className="text-gray-700 dark:text-gray-200" />
// //           </button>

// //           <Link href="/" className="flex items-center gap-3 group" onMouseEnter={playLogoAnimation}>
// //             <div ref={logoIconRef} className="relative h-20 w-20 filter drop-shadow-sm">
// //               <Image src="/usamabrand.svg" alt="PocketValue Logo" fill className="object-contain" priority />
// //             </div>
// //             <div className="hidden xl:flex flex-col justify-center">
// //               <span className="text-gray-900 dark:text-white text-2xl font-clash font-bold tracking-tight leading-none">
// //                 PocketValue
// //               </span>
// //               <span className="text-xs text-brand-primary font-medium tracking-widest uppercase mt-0.5">
// //                 Premium Store
// //               </span>
// //             </div>
// //           </Link>
// //         </div>

// //         <div className="grow max-w-2xl xl:max-w-4xl px-4">
// //           <SearchBar searchSuggestions={searchSuggestions} />
// //         </div>

// //         <div className="flex items-center gap-6 shrink-0">
// //           <HeaderActions isMobile={false} />
// //         </div>
// //       </div>

// //       {/* === 📱 MOBILE VIEW (UPDATED FOR BIGGER LOGO & TAGLINE) === */}
// //       {/* Height increased to h-20 (80px) to fit content comfortably */}
// //       <div className="md:hidden flex items-center justify-between w-full h-20 px-4 relative overflow-hidden">

// //         {/* Decoration Line */}
// //         <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-80" />

// //         <Link href="/" className="flex items-center gap-3 z-10">
// //           {/* MOBILE LOGO INCREASED: h-14 w-14 (56px) */}
// //           <div className="relative h-14 w-14 filter drop-shadow-sm shrink-0">
// //             <Image
// //               src="/usamabrand.svg"
// //               alt="PocketValue Logo"
// //               fill
// //               className="object-contain"
// //               priority
// //             />
// //           </div>

// //           {/* MOBILE TEXT STACK (Name + Tagline) */}
// //           <div className="flex flex-col justify-center">
// //             <span className="text-xl font-clash font-bold text-gray-900 dark:text-white tracking-tight leading-none">
// //               PocketValue
// //             </span>
// //             <span className="text-[10px] text-brand-primary font-medium tracking-wider uppercase mt-0.5">
// //               Premium Store
// //             </span>
// //           </div>
// //         </Link>

// //         {/* Mobile Actions */}
// //         <div className="z-10">
// //           <HeaderActions isMobile={true} />
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }
// "use client";

// import { useRef, useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import SearchBar from "./SearchBar";
// import HeaderActions from "./HeaderActions";
// // Menu/LayoutGrid icons hata diye
// import { gsap } from "gsap";

// interface SearchSuggestions {
//   trendingKeywords: string[];
//   popularCategories: SanityCategory[];
// }
// interface NewHeaderProps {
//   categories: SanityCategory[];
//   onMenuClick: () => void;
//   searchSuggestions: SearchSuggestions;
// }
// export default function NewHeader({ searchSuggestions }: NewHeaderProps) {
//   const logoIconRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const playLogoAnimation = () => {
//     if (isAnimating || !logoIconRef.current) return;
//     setIsAnimating(true);
//     const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

//     tl.to(logoIconRef.current, {
//       x: -120,
//       rotation: -360,
//       scale: 1.1,
//       duration: 1.5,
//       ease: "power2.inOut",
//     }).to(logoIconRef.current, {
//       x: 0,
//       rotation: 0,
//       scale: 1,
//       duration: 1.2,
//       ease: "elastic.out(1, 0.5)",
//       delay: 0.1,
//     });
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => playLogoAnimation(), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 w-full z-50 relative">
//       {/* === 🖥️ DESKTOP & TABLET VIEW === */}
//       <div className="hidden md:flex items-center justify-between h-20 lg:h-28 w-full px-4 lg:px-12 gap-4 lg:gap-8">
//         {/* LEFT: Logo Only (Menu button removed) */}
//         <div className="flex items-center gap-3 lg:gap-6 shrink-0">
//           <Link
//             href="/"
//             className="flex items-center gap-2 lg:gap-3 group"
//             onMouseEnter={playLogoAnimation}
//           >
//             <div
//               ref={logoIconRef}
//               className="relative h-14 w-14 lg:h-20 lg:w-20 filter drop-shadow-sm transition-all duration-300"
//             >
//               <Image
//                 src="/usamabrand.svg"
//                 alt="PocketValue Logo"
//                 fill
//                 className="object-contain"
//                 priority
//               />
//             </div>
//             <div className="hidden xl:flex flex-col justify-center">
//               <span className="text-gray-900 dark:text-white text-2xl font-clash font-bold tracking-tight leading-none">
//                 PocketValue
//               </span>
//               <span className="text-xs text-brand-primary font-medium tracking-widest uppercase mt-0.5">
//                 Premium Store
//               </span>
//             </div>
//           </Link>
//         </div>

//         {/* CENTER: Search Bar */}
//         <div className="grow max-w-xl lg:max-w-4xl px-2 lg:px-4">
//           <SearchBar searchSuggestions={searchSuggestions} />
//         </div>

//         {/* RIGHT: Actions */}
//         <div className="flex items-center gap-2 shrink-0">
//           <HeaderActions isMobile={false} />
//         </div>
//       </div>

//       {/* === 📱 MOBILE VIEW (Same as before) === */}
//       <div className="md:hidden flex items-center justify-between w-full h-20 px-4 relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-80" />
//         <Link href="/" className="flex items-center gap-3 z-10">
//           <div className="relative h-14 w-14 filter drop-shadow-sm shrink-0">
//             <Image
//               src="/usamabrand.svg"
//               alt="PocketValue Logo"
//               fill
//               className="object-contain"
//               priority
//             />
//           </div>
//           <div className="flex flex-col justify-center">
//             <span className="text-xl font-clash font-bold text-gray-900 dark:text-white tracking-tight leading-none">
//               PocketValue
//             </span>
//             <span className="text-[10px] text-brand-primary font-medium tracking-wider uppercase mt-0.5">
//               Premium Store
//             </span>
//           </div>
//         </Link>
//         <div className="z-10">
//           <HeaderActions isMobile={true} />
//         </div>
//       </div>
//     </header>
//   );
// }
// "use client";

// import React, { useRef, useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { SanityCategory } from "@/sanity/types/product_types";
// import SearchBar from "./SearchBar";
// import HeaderActions from "./HeaderActions";
// import { LayoutGrid, Search, ArrowLeft, X } from "lucide-react";
// import { gsap } from "gsap";
// import { AnimatePresence, motion } from "framer-motion";

// interface SearchSuggestions {
//   trendingKeywords: string[];
//   popularCategories: SanityCategory[];
// }
// interface NewHeaderProps {
//   categories: SanityCategory[];
//   onMenuClick: () => void;
//   searchSuggestions: SearchSuggestions;
// }

// export default function NewHeader({
//   categories,
//   onMenuClick,
//   searchSuggestions,
// }: NewHeaderProps) {
//   const logoIconRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isTabletSearchOpen, setIsTabletSearchOpen] = useState(false);

//   const playLogoAnimation = () => {
//     if (isAnimating || !logoIconRef.current) return;
//     setIsAnimating(true);

//     // 🔥 SMART ANIMATION LOGIC
//     // Check screen width to decide animation type
//     const isLargeScreen = window.innerWidth >= 1024;

//     const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

//     if (isLargeScreen) {
//         // Desktop: Move Left + Rotate (Full Animation)
//         tl.to(logoIconRef.current, { x: -120, rotation: -360, scale: 1.1, duration: 1.5, ease: "power2.inOut" })
//           .to(logoIconRef.current, { x: 0, rotation: 0, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)", delay: 0.1 });
//     } else {
//         // Tablet/Mobile: ONLY Rotate + Scale (No Left Movement to avoid collision)
//         tl.to(logoIconRef.current, { rotation: -360, scale: 1.2, duration: 1.5, ease: "power2.inOut" })
//           .to(logoIconRef.current, { rotation: 0, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" });
//     }
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => playLogoAnimation(), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 w-full z-50 relative">

//       {/* === 🖥️ DESKTOP VIEW (Large Screens - lg:flex) === */}
//       <div className="hidden lg:flex items-center justify-between h-28 w-full px-12 gap-8">
//         <div className="flex items-center gap-6 shrink-0">
//           <Link href="/" className="flex items-center gap-4 group" onMouseEnter={playLogoAnimation}>
//             {/* Desktop: Logo Big */}
//             <div ref={logoIconRef} className="relative h-20 w-20 filter drop-shadow-sm">
//               <Image src="/usamabrand.svg" alt="Logo" fill className="object-contain" priority />
//             </div>
//             <div className="flex flex-col justify-center">
//               <span className="text-gray-900 dark:text-white text-3xl font-clash font-bold tracking-tight leading-none">PocketValue</span>
//               <span className="text-sm text-brand-primary font-medium tracking-widest uppercase mt-1">Premium Store</span>
//             </div>
//           </Link>
//         </div>
//         <div className="grow max-w-4xl px-4">
//           <SearchBar searchSuggestions={searchSuggestions} />
//         </div>
//         <div className="flex items-center gap-6 shrink-0">
//           <HeaderActions isMobile={false} />
//         </div>
//       </div>

//       {/* === 📱 TABLET VIEW (Medium Screens - md:flex lg:hidden) === */}
//       <div className="hidden md:flex lg:hidden items-center justify-between h-24 w-full px-6 gap-4 relative overflow-hidden">

//         <AnimatePresence mode="wait">
//             {!isTabletSearchOpen ? (
//                 <motion.div
//                     key="normal-nav"
//                     initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//                     className="w-full flex items-center justify-between"
//                 >
//                     {/* LEFT: Menu & Logo */}
//                     <div className="flex items-center gap-4">
//                         <button onClick={onMenuClick} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-brand-primary hover:text-white transition-colors shrink-0">
//                             <LayoutGrid size={24} />
//                         </button>

//                         <Link href="/" className="flex items-center gap-3" onMouseEnter={playLogoAnimation}>
//                             {/* Tablet: Logo Bigger than text (h-16) */}
//                             <div className="relative h-16 w-16 shrink-0">
//                                 <Image src="/usamabrand.svg" alt="Logo" fill className="object-contain" priority />
//                             </div>
//                             <div className="flex flex-col justify-center">
//                                 <span className="text-2xl font-clash font-bold text-gray-900 dark:text-white leading-none">PocketValue</span>
//                                 <span className="text-xs text-brand-primary font-medium tracking-widest uppercase mt-0.5">Premium Store</span>
//                             </div>
//                         </Link>
//                     </div>

//                     {/* RIGHT: Search & Actions */}
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() => setIsTabletSearchOpen(true)}
//                             className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-brand-primary/10 text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-all"
//                         >
//                             <Search size={22} strokeWidth={2.5} />
//                         </button>
//                         <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
//                         <HeaderActions isMobile={false} />
//                     </div>
//                 </motion.div>
//             ) : (
//                 <motion.div
//                     key="search-nav"
//                     initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
//                     transition={{ duration: 0.2 }}
//                     className="w-full flex items-center gap-3"
//                 >
//                     <button onClick={() => setIsTabletSearchOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
//                         <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
//                     </button>
//                     <div className="grow">
//                         <SearchBar searchSuggestions={searchSuggestions} />
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//       </div>

//       {/* === 📱 MOBILE VIEW (Small Screens - md:hidden) === */}
//       <div className="md:hidden flex items-center justify-between w-full h-20 px-4 relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-80" />
//         <Link href="/" className="flex items-center gap-3 z-10" onMouseEnter={playLogoAnimation}>
//           {/* Mobile: Logo h-14, Text lg */}
//           <div className="relative h-16 w-16 filter drop-shadow-sm shrink-0">
//             <Image src="/usamabrand.svg" alt="PocketValue Logo" fill className="object-contain" priority />
//           </div>
//           <div className="flex flex-col justify-center">
//             <span className="text-xl font-clash font-bold text-gray-900 dark:text-white tracking-tight leading-none">
//               PocketValue
//             </span>
//             <span className="text-xs text-brand-primary font-medium tracking-tight uppercase mt-0.5">
//               Premium Store
//             </span>
//           </div>
//         </Link>
//         <div className="z-10">
//           <HeaderActions isMobile={true} />
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";
import { LayoutGrid, Search, ArrowLeft } from "lucide-react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";

interface SearchSuggestions {
  trendingKeywords: string[];
  popularCategories: SanityCategory[];
}
interface NewHeaderProps {
  categories: SanityCategory[];
  onMenuClick: () => void;
  searchSuggestions: SearchSuggestions;
}

export default function NewHeader({
  categories,
  onMenuClick,
  searchSuggestions,
}: NewHeaderProps) {
  const logoIconRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTabletSearchOpen, setIsTabletSearchOpen] = useState(false);

  const playLogoAnimation = () => {
    if (isAnimating || !logoIconRef.current) return;
    setIsAnimating(true);

    const isLargeScreen = window.innerWidth >= 1024;
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    if (isLargeScreen) {
      tl.to(logoIconRef.current, {
        x: -120,
        rotation: -360,
        scale: 1.1,
        duration: 1.5,
        ease: "power2.inOut",
      }).to(logoIconRef.current, {
        x: 0,
        rotation: 0,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.1,
      });
    } else {
      tl.to(logoIconRef.current, {
        rotation: -360,
        scale: 1.2,
        duration: 1.5,
        ease: "power2.inOut",
      }).to(logoIconRef.current, {
        rotation: 0,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => playLogoAnimation(), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    // Added 'z-50' to ensure dropdowns appear above content
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 w-full z-50 relative">
      {/* === 🖥️ DESKTOP VIEW === */}
      <div className="hidden lg:flex items-center justify-between h-28 w-full px-12 gap-8">
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-4 group"
            onMouseEnter={playLogoAnimation}
          >
            <div
              ref={logoIconRef}
              className="relative h-20 w-20 filter drop-shadow-sm"
            >
              <Image
                src="/usamabrand.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-gray-900 dark:text-white text-3xl font-clash font-bold tracking-tight leading-none">
                PocketValue
              </span>
              <span className="text-sm text-brand-primary font-medium tracking-widest uppercase mt-1">
                Premium Store
              </span>
            </div>
          </Link>
        </div>
        <div className="grow max-w-4xl px-4 relative z-50">
          {" "}
          {/* Z-Index added */}
          <SearchBar searchSuggestions={searchSuggestions} />
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <HeaderActions isMobile={false} />
        </div>
      </div>

      {/* === 📱 TABLET VIEW (FIXED OVERFLOW ISSUE) === */}
      <div
        className={`hidden md:flex lg:hidden items-center justify-between h-24 w-full px-6 gap-4 relative ${isTabletSearchOpen ? "overflow-visible" : "overflow-hidden"}`}
      >
        <AnimatePresence mode="wait">
          {!isTabletSearchOpen ? (
            <motion.div
              key="normal-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={onMenuClick}
                  className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-brand-primary hover:text-white transition-colors shrink-0"
                >
                  <LayoutGrid size={24} />
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onMouseEnter={playLogoAnimation}
                >
                  <div className="relative h-16 w-16 shrink-0">
                    <Image
                      src="/usamabrand.svg"
                      alt="Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-2xl font-clash font-bold text-gray-900 dark:text-white leading-none">
                      PocketValue
                    </span>
                    <span className="text-xs text-brand-primary font-medium tracking-widest uppercase mt-0.5">
                      Premium Store
                    </span>
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsTabletSearchOpen(true)}
                  className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-brand-primary/10 text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-all"
                >
                  <Search size={22} strokeWidth={2.5} />
                </button>
                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                <HeaderActions isMobile={false} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="search-nav"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex items-center gap-3 z-50" // High Z-Index
            >
              <button
                onClick={() => setIsTabletSearchOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors shrink-0"
              >
                <ArrowLeft
                  size={24}
                  className="text-gray-600 dark:text-gray-300"
                />
              </button>
              <div className="grow relative z-50">
                <SearchBar searchSuggestions={searchSuggestions} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* === 📱 MOBILE VIEW (Same as before) === */}
      <div className="md:hidden flex items-center justify-between w-full h-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-brand-secondary to-brand-primary opacity-80" />
        <Link
          href="/"
          className="flex items-center gap-3 z-10"
          onMouseEnter={playLogoAnimation}
        >
          <div className="relative h-16 w-16 filter drop-shadow-sm shrink-0">
            <Image
              src="/usamabrand.svg"
              alt="PocketValue Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-clash font-bold text-gray-900 dark:text-white tracking-tight leading-none">
              PocketValue
            </span>
            <span className="text-xs text-brand-primary font-medium tracking-tight uppercase mt-0.5">
              Premium Store
            </span>
          </div>
        </Link>
        <div className="z-10">
          <HeaderActions isMobile={true} />
        </div>
      </div>
    </header>
  );
}
