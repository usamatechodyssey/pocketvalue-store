"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Search, User, Tag } from "lucide-react";

interface BottomNavProps {
  onCategoriesClick: () => void;
  onSearchClick: () => void;
}

export default function BottomNav({ onCategoriesClick, onSearchClick }: BottomNavProps) {
  const pathname = usePathname();

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      
      {/* GRID LAYOUT FOR PERFECT CENTERING (5 Cols) */}
      <div className="grid grid-cols-5 h-[60px] items-end">
        
        {/* 1. HOME */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-full pb-2 transition-all duration-200 active:scale-90
            ${isActive("/") ? "text-brand-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
          <span className="text-[9px] font-medium mt-1">Home</span>
        </Link>

        {/* 2. CATALOG (Drawer) */}
        <button
          onClick={onCategoriesClick}
          className="flex flex-col items-center justify-center h-full pb-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all duration-200 active:scale-90"
        >
          <Grid size={22} strokeWidth={2} />
          <span className="text-[9px] font-medium mt-1">Catalog</span>
        </button>

        {/* 3. SEARCH (Floating Center) */}
        <div className="relative flex justify-center h-full">
            <button
            onClick={onSearchClick}
            className="absolute -top-5 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 group"
            >
            <div className="p-3.5 bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/40 border-4 border-gray-50 dark:border-gray-900 group-hover:scale-105 transition-transform">
                <Search size={24} strokeWidth={3} />
            </div>
            <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300 mt-1 group-hover:text-brand-primary transition-colors">Search</span>
            </button>
        </div>

        {/* 4. DEALS (New Added) */}
        <Link
          href="/deals"
          className={`flex flex-col items-center justify-center h-full pb-2 transition-all duration-200 active:scale-90
            ${isActive("/deals") ? "text-brand-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <Tag size={22} strokeWidth={isActive("/deals") ? 2.5 : 2} />
          <span className="text-[9px] font-medium mt-1">Offers</span>
        </Link>

        {/* 5. ACCOUNT */}
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center h-full pb-2 transition-all duration-200 active:scale-90
            ${isActive("/account") ? "text-brand-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"}`}
        >
          <User size={22} strokeWidth={isActive("/account") ? 2.5 : 2} />
          <span className="text-[9px] font-medium mt-1">Profile</span>
        </Link>

      </div>
    </div>
  );
}