
"use client";

import { useState, useEffect, ReactNode } from "react";
import { SanityCategory } from "@/sanity/types/product_types";
import NewSidebar from "./NewSidebar";
import NewHeader from "./NewHeader";
import NewRightDock from "./NewRightDock";
import MainFooter from "./Footer";
import MegaMenu from "./MegaMenu";
import TopActionBar from "@/app/components/ui/ActionBar";
import SecondaryNavBar from "@/app/components/ui/SecondaryNavBar";
import BottomNav from "./BottomMobileNav";
import MobileMenu from "./MobileMenu";
import SearchPanel from "../ui/MobileSearchPanel"; // <-- File ka naam update kiya

// --- NAYE PROPS ---
interface SearchSuggestions {
  trendingKeywords: string[];
  popularCategories: SanityCategory[];
}

// Heights (No change)
const TOP_ACTION_BAR_HEIGHT = 18;
const HEADER_HEIGHT_DESKTOP = 70;
const HEADER_HEIGHT_MOBILE = 64;
const SECONDARY_NAV_HEIGHT = 40;
const DESKTOP_UNSCROLLED_HEIGHT = TOP_ACTION_BAR_HEIGHT + HEADER_HEIGHT_DESKTOP + SECONDARY_NAV_HEIGHT;
const MOBILE_UNSCROLLED_HEIGHT = TOP_ACTION_BAR_HEIGHT + HEADER_HEIGHT_MOBILE;

export default function MainLayoutClient({
  categories,
  children,
  searchSuggestions, // <-- NAYA PROP
}: {
  categories: SanityCategory[];
  children: ReactNode;
  searchSuggestions: SearchSuggestions; // <-- NAYA PROP
}) {
  const [hoveredCategory, setHoveredCategory] = useState<SanityCategory | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleMenu = () => {
    if (isSearchPanelOpen) setIsSearchPanelOpen(false);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleToggleSearch = () => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setIsSearchPanelOpen((prev) => !prev);
  };

  const handleClosePanels = () => {
    setIsMobileMenuOpen(false);
    setIsSearchPanelOpen(false);
  };

  const topOffsetDesktop = isScrolled ? HEADER_HEIGHT_DESKTOP : DESKTOP_UNSCROLLED_HEIGHT;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 overflow-x-hidden">
      <style>{`
        :root {
            --header-height-unscrolled: ${MOBILE_UNSCROLLED_HEIGHT}px;
            --header-height-scrolled: ${HEADER_HEIGHT_MOBILE}px;
        }
        @media (min-width: 768px) {
            :root {
                --header-height-unscrolled: ${DESKTOP_UNSCROLLED_HEIGHT}px;
                --header-height-scrolled: ${HEADER_HEIGHT_DESKTOP}px;
            }
        }
      `}</style>

      {/* Fixed Headers */}
      <div
        className="fixed top-0 w-full z-40 bg-white dark:bg-gray-900 shadow-sm"
        style={{
          transform: isScrolled ? `translateY(-${TOP_ACTION_BAR_HEIGHT}px)` : "translateY(0)",
          transition: "transform 0.3s ease-out",
        }}
      >
        <TopActionBar />
        <NewHeader 
            categories={categories} 
            onMenuClick={handleToggleMenu} 
            searchSuggestions={searchSuggestions} // <-- Data ko NewHeader ko pass kiya
        />
        <SecondaryNavBar isVisible={!isScrolled} />
      </div>

     <div
        className="hidden lg:flex fixed left-0 z-30 transition-all duration-300 ease-out"
        style={{ top: `${topOffsetDesktop}px`, height: `calc(100vh - ${topOffsetDesktop}px)` }}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* Sidebar remains the same */}
        <NewSidebar categories={categories} onCategoryHover={setHoveredCategory} />
        {/* MegaMenu is now positioned correctly relative to the sidebar */}
        <div className="absolute left-16 top-0 h-full">
            <MegaMenu category={hoveredCategory} />
        </div>
      </div>
      <NewRightDock topOffset={topOffsetDesktop} />

      {/* Mobile Panels */}
      <MobileMenu categories={categories} isOpen={isMobileMenuOpen} onClose={handleClosePanels} />
      <SearchPanel 
        isOpen={isSearchPanelOpen} 
        onClose={handleClosePanels}
        // --- DATA KO SEARCH PANEL KO PASS KIYA ---
        trendingKeywords={searchSuggestions.trendingKeywords}
        popularCategories={searchSuggestions.popularCategories}
      />
      <BottomNav onCategoriesClick={handleToggleMenu} onSearchClick={handleToggleSearch} />

      {/* Main Content */}
      <div className="relative flex flex-col min-h-screen">
        <main
          className="flex-grow transition-all duration-300 ease-out lg:pl-16 lg:pr-16 pb-20 md:pb-0"
          style={{ paddingTop: isScrolled ? `var(--header-height-scrolled)` : `var(--header-height-unscrolled)` }}
        >
          {children}
        </main>
        <MainFooter />
      </div>
    </div>
  );
}