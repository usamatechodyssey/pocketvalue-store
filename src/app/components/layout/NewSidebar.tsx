


// // app/components/layout/NewSidebar.tsx (FINAL UPDATED CODE)

// "use client";

// import React from "react";
// import Link from "next/link";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { FiHome, FiShoppingBag, FiHeart, FiUser, FiGrid, FiDroplet, FiCpu, FiArchive } from "react-icons/fi";


// // === ICON WALA FUNCTION UPGRADE HO GAYA HAI ===
// const getIconForCategory = (categoryName: string) => {
//   const lowerCaseName = categoryName.toLowerCase();
//   // Hum `startsWith` istemal kar rahe hain taake 'men' aur 'women' aapas mein confuse na hon
//   if (lowerCaseName.startsWith("men")) return <FiUser size={22} />;
//   if (lowerCaseName.startsWith("women")) return <FiHeart size={22} />;
//   if (lowerCaseName.startsWith("kid")) return <FiShoppingBag size={22} />;
//   if (lowerCaseName.startsWith("home")) return <FiHome size={22} />;
//   if (lowerCaseName.startsWith("beauty")) return <FiDroplet size={22} />;
//   if (lowerCaseName.startsWith("electronics")) return <FiCpu size={22} />;
//   if (lowerCaseName.startsWith("grocery") || lowerCaseName.startsWith("food"))
//     return <FiArchive size={22} />;
//   return <FiGrid size={22} />; // Default icon
// };


// export default function NewSidebar({ categories, onCategoryHover }: { categories: SanityCategory[], onCategoryHover: (category: SanityCategory | null) => void }) {
//   const mainCategories = categories.filter((cat) => !cat.parent);
//   const desiredOrder = ["HOME", "BEAUTY", "MEN", "WOMEN", "KIDS", "FOOD & GROCERY", "ELECTRONICS"];
  
//   const sortedCategories = [...mainCategories].sort((a, b) => {
//     const indexA = desiredOrder.indexOf(a.name.toUpperCase());
//     const indexB = desiredOrder.indexOf(b.name.toUpperCase());
//     if (indexA === -1) return 1;
//     if (indexB === -1) return -1;
//     return indexA - indexB;
//   });

//   return (
//     <aside className="h-full w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30">
//       <nav className="grow pt-8 flex flex-col items-center gap-2">
//         {sortedCategories.map((category) => (
//           <div key={category._id} onMouseEnter={() => onCategoryHover(category)} className="w-full">
//             <Link
//               href={`/category/${category.slug}`}
//               title={category.name}
//               className="h-16 w-full flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-orange-500"
//             >
//               {getIconForCategory(category.name)}
//               <span className="text-[10px] font-bold mt-1 w-full text-center truncate px-1">
//                 {category.name.toUpperCase()}
//               </span>
//             </Link>
//           </div>
//         ))}
//       </nav>
//       <div className="shrink-0 p-2 border-t border-gray-200 dark:border-gray-800"></div>
//     </aside>
//   );
// }
"use client";

import React from "react";
import Link from "next/link";
import { SanityCategory } from "@/sanity/types/product_types";
import { 
  FiHome, 
  FiShoppingBag, 
  FiHeart, 
  FiUser, 
  FiGrid, 
  FiDroplet, 
  FiCpu, 
  FiArchive 
} from "react-icons/fi";

// === ICON HELPER (Optimized) ===
const getIconForCategory = (categoryName: string) => {
  const lowerCaseName = categoryName.toLowerCase();
  if (lowerCaseName.startsWith("men")) return <FiUser size={24} />;
  if (lowerCaseName.startsWith("women")) return <FiHeart size={24} />;
  if (lowerCaseName.startsWith("kid")) return <FiShoppingBag size={24} />;
  if (lowerCaseName.startsWith("home")) return <FiHome size={24} />;
  if (lowerCaseName.startsWith("beauty")) return <FiDroplet size={24} />;
  if (lowerCaseName.startsWith("electronics")) return <FiCpu size={24} />;
  if (lowerCaseName.startsWith("grocery") || lowerCaseName.startsWith("food"))
    return <FiArchive size={24} />;
  return <FiGrid size={24} />; // Default fallback
};

interface NewSidebarProps {
  categories: SanityCategory[];
  onCategoryHover: (category: SanityCategory | null) => void;
}

export default function NewSidebar({ categories, onCategoryHover }: NewSidebarProps) {
  const mainCategories = categories.filter((cat) => !cat.parent);
  // Business Logic Order
  const desiredOrder = ["HOME", "BEAUTY", "MEN", "WOMEN", "KIDS", "FOOD & GROCERY", "ELECTRONICS"];
  
  const sortedCategories = [...mainCategories].sort((a, b) => {
    const indexA = desiredOrder.indexOf(a.name.toUpperCase());
    const indexB = desiredOrder.indexOf(b.name.toUpperCase());
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    // Changed Width from w-16 to w-20 for better breathing room
    <aside className="h-full w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 flex flex-col items-center py-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
      
      <nav className="flex flex-col items-center gap-1 w-full">
        {sortedCategories.map((category) => (
          <div 
            key={category._id} 
            onMouseEnter={() => onCategoryHover(category)} 
            className="w-full relative group px-2"
          >
            {/* === HOVER INDICATOR (The Premium Touch) === */}
            {/* Ye orange line sirf hover par aayegi */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-brand-primary rounded-r-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <Link
              href={`/category/${category.slug}`}
              title={category.name}
              className="flex flex-col items-center justify-center w-full py-3 rounded-xl transition-all duration-300 group-hover:bg-orange-50 dark:group-hover:bg-white/5"
            >
              {/* Icon Animation: Scale up slightly and change color */}
              <div className="text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:text-brand-primary group-hover:scale-110">
                {getIconForCategory(category.name)}
              </div>
              
              {/* Text Styling */}
              <span className="text-[8px] font-medium mt-1.5 w-full text-center truncate px-1 text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-brand-primary">
                {category.name.toUpperCase()}
              </span>
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}