"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";
import { Menu } from "lucide-react";
import { gsap } from "gsap";

// --- NAYE PROPS ---
interface SearchSuggestions {
  trendingKeywords: string[];
  popularCategories: SanityCategory[];
}
interface NewHeaderProps {
  categories: SanityCategory[];
  onMenuClick: () => void;
  searchSuggestions: SearchSuggestions; // <-- NAYA PROP
}

export default function NewHeader({
  categories,
  onMenuClick,
  searchSuggestions,
}: NewHeaderProps) {
  const logoIconRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const playLogoAnimation = () => {
    if (isAnimating || !logoIconRef.current) return;
    setIsAnimating(true);
    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });
    tl.to(logoIconRef.current, {
      x: -150,
      rotation: -720,
      duration: 2.5,
      ease: "power2.inOut",
    }).to(logoIconRef.current, {
      x: 0,
      rotation: 0,
      duration: 2,
      ease: "power2.inOut",
      delay: 0.5,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => playLogoAnimation(), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full">
      {/* === TABLET & DESKTOP HEADER === */}
      <div className="hidden md:flex items-center justify-around h-24 w-full px-6 lg:px-8 gap-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onMouseEnter={playLogoAnimation}
          >
            <div ref={logoIconRef} className="relative h-16 w-16">
              <Image
                src="/usamabrand.svg"
                alt="PocketValue Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-gray-800 dark:text-white text-2xl font-bold tracking-wider hidden md:inline-block">
              PocketValue
            </span>
          </Link>
        </div>

        <div className="grow max-w-2xl lg:max-w-3xl">
          <SearchBar searchSuggestions={searchSuggestions} />
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <HeaderActions isMobile={false} />
        </div>
      </div>

      {/* === MOBILE HEADER === */}
      <div className="md:hidden flex items-center justify-between w-full h-16 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10">
            <Image
              src="/usamabrand.svg"
              alt="PocketValue Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            PocketValue
          </span>
        </Link>
        <HeaderActions isMobile={true} />
      </div>
    </header>
  );
}
