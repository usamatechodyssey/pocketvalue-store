


// app/components/layout/NewSidebar.tsx (FINAL UPDATED CODE)

"use client";

import React from "react";
import Link from "next/link";
import { SanityCategory } from "@/sanity/types/product_types";
import { FiHome, FiShoppingBag, FiHeart, FiUser, FiGrid, FiDroplet, FiCpu, FiArchive } from "react-icons/fi";


// === ICON WALA FUNCTION UPGRADE HO GAYA HAI ===
const getIconForCategory = (categoryName: string) => {
  const lowerCaseName = categoryName.toLowerCase();
  // Hum `startsWith` istemal kar rahe hain taake 'men' aur 'women' aapas mein confuse na hon
  if (lowerCaseName.startsWith("men")) return <FiUser size={22} />;
  if (lowerCaseName.startsWith("women")) return <FiHeart size={22} />;
  if (lowerCaseName.startsWith("kid")) return <FiShoppingBag size={22} />;
  if (lowerCaseName.startsWith("home")) return <FiHome size={22} />;
  if (lowerCaseName.startsWith("beauty")) return <FiDroplet size={22} />;
  if (lowerCaseName.startsWith("electronics")) return <FiCpu size={22} />;
  if (lowerCaseName.startsWith("grocery") || lowerCaseName.startsWith("food"))
    return <FiArchive size={22} />;
  return <FiGrid size={22} />; // Default icon
};


export default function NewSidebar({ categories, onCategoryHover }: { categories: SanityCategory[], onCategoryHover: (category: SanityCategory | null) => void }) {
  const mainCategories = categories.filter((cat) => !cat.parent);
  const desiredOrder = ["HOME", "BEAUTY", "MEN", "WOMEN", "KIDS", "FOOD & GROCERY", "ELECTRONICS"];
  
  const sortedCategories = [...mainCategories].sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.name.toUpperCase());
    const indexB = desiredOrder.indexOf(b.name.toUpperCase());
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <aside className="h-full w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30">
      <nav className="flex-grow pt-8 flex flex-col items-center gap-2">
        {sortedCategories.map((category) => (
          <div key={category._id} onMouseEnter={() => onCategoryHover(category)} className="w-full">
            <Link
              href={`/category/${category.slug}`}
              title={category.name}
              className="h-16 w-full flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-orange-500"
            >
              {getIconForCategory(category.name)}
              <span className="text-[10px] font-bold mt-1 w-full text-center truncate px-1">
                {category.name.toUpperCase()}
              </span>
            </Link>
          </div>
        ))}
      </nav>
      <div className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-gray-800"></div>
    </aside>
  );
}