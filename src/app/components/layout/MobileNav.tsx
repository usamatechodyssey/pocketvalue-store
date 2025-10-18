// app/components/layout/MobileNav.tsx (UPDATED)
"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { SanityCategory } from "@/sanity/types/product_types";
import MobileMenu from "./MobileMenu";

export default function MobileNav({ categories }: { categories: SanityCategory[]; }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(true)}
        className="p-2"
        aria-label="Open menu"
      >
        <FiMenu size={24} className="text-gray-600 dark:text-gray-300" />
      </button>
      <MobileMenu
        categories={categories}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}