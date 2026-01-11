// src/app/components/category/FilterCategoryTree.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityCategory } from "@/sanity/types/product_types";

interface CategoryNodeProps {
    category: SanityCategory;
    parentPath: string;
}

// === RECURSIVE COMPONENT ===
export default function CategoryNode({ category, parentPath }: CategoryNodeProps) {
  const pathname = usePathname();
  const currentPath = `${parentPath}/${category.slug}`;
  const isActive = pathname === currentPath;
  const hasChildren = Array.isArray(category.subCategories) && category.subCategories.length > 0;
  
  // Initialize isOpen state based on active path
  const [isOpen, setIsOpen] = useState(isActive || pathname.startsWith(currentPath));

  return (
    <li className="relative">
      <div className="flex items-center justify-between group py-1">
        <Link 
            href={currentPath} 
            className={`block text-sm py-2 px-3 rounded-lg grow transition-all duration-200 
            ${isActive 
                ? "font-bold text-white bg-brand-primary shadow-md shadow-brand-primary/20" 
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => {
              // Dispatch Custom Event to close mobile sidebar
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                 window.dispatchEvent(new Event('CLOSE_FILTER_SIDEBAR'));
              }
            }}
        >
          {category.name}
        </Link>
        {hasChildren && (
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
        )}
      </div>
      
      <AnimatePresence>
        {hasChildren && isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
            >
                <ul className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
                    {category.subCategories?.map((subCat) => (
                        <CategoryNode key={subCat._id} category={subCat} parentPath={currentPath} />
                    ))}
                </ul>
            </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}