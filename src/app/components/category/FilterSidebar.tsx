// // // export default FilterSidebar;
// // "use client";

// // import { useState, memo } from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { SanityBrand, SanityCategory } from "@/sanity/types/product_types";
// // import { X, ChevronDown, Check, Filter } from "lucide-react";
// // import { motion, AnimatePresence } from "framer-motion";

// // interface Filters {
// //   brands: string[];
// //   categories?: string[];
// //   [key: string]: any;
// // }

// // interface FilterSidebarProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   brands: SanityBrand[];
// //   attributes: { name: string; values: string[] }[];
// //   priceRange: { min: number | null; max: number | null };
// //   appliedFilters: Filters;
// //   onFilterChange: (group: string, value: string) => void;
// //   onPriceApply: (price: { min: string; max: string }) => void;
// //   onClearFilters: () => void;
// //   categoryTree?: SanityCategory;
// //   dealCategories?: SanityCategory[];
// // }

// // // === 1. ANIMATED FILTER SECTION (Accordion Style) ===
// // const FilterSection = ({
// //   title,
// //   children,
// //   defaultOpen = true,
// // }: {
// //   title: string;
// //   children: React.ReactNode;
// //   defaultOpen?: boolean;
// // }) => {
// //   const [isOpen, setIsOpen] = useState(defaultOpen);

// //   return (
// //     <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
// //       <button
// //         onClick={() => setIsOpen(!isOpen)}
// //         className="w-full flex justify-between items-center py-4 text-left group"
// //       >
// //         <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100 group-hover:text-brand-primary transition-colors">
// //             {title}
// //         </h3>
// //         <ChevronDown
// //             className={`w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
// //         />
// //       </button>
// //       <AnimatePresence>
// //         {isOpen && (
// //             <motion.div
// //                 initial={{ height: 0, opacity: 0 }}
// //                 animate={{ height: "auto", opacity: 1 }}
// //                 exit={{ height: 0, opacity: 0 }}
// //                 transition={{ duration: 0.3, ease: "easeInOut" }}
// //                 className="overflow-hidden"
// //             >
// //                 <div className="pb-5 pt-1 space-y-1">
// //                     {children}
// //                 </div>
// //             </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // };

// // // === 2. CATEGORY NODE (Tree View) ===
// // const CategoryNode = ({ category, parentPath }: { category: SanityCategory; parentPath: string; }) => {
// //   const pathname = usePathname();
// //   const currentPath = `${parentPath}/${category.slug}`;
// //   const isActive = pathname === currentPath;
// //   const hasChildren = Array.isArray(category.subCategories) && category.subCategories.length > 0;
// //   const [isOpen, setIsOpen] = useState(isActive || pathname.startsWith(currentPath));

// //   return (
// //     <li className="relative">
// //       <div className="flex items-center justify-between group py-1">
// //         <Link
// //             href={currentPath}
// //             className={`block text-sm py-2 px-3 rounded-lg grow transition-all duration-200
// //             ${isActive
// //                 ? "font-bold text-white bg-brand-primary shadow-md shadow-brand-primary/20"
// //                 : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
// //             }`}
// //         >
// //           {category.name}
// //         </Link>
// //         {hasChildren && (
// //             <button
// //                 onClick={() => setIsOpen(!isOpen)}
// //                 className="p-2 ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
// //             >
// //                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
// //             </button>
// //         )}
// //       </div>

// //       <AnimatePresence>
// //         {hasChildren && isOpen && (
// //             <motion.div
// //                 initial={{ height: 0, opacity: 0 }}
// //                 animate={{ height: "auto", opacity: 1 }}
// //                 exit={{ height: 0, opacity: 0 }}
// //                 className="overflow-hidden"
// //             >
// //                 <ul className="pl-4 mt-1 space-y-1 border-l-2 border-gray-100 dark:border-gray-800 ml-3">
// //                     {category.subCategories?.map((subCat) => (
// //                         <CategoryNode key={subCat._id} category={subCat} parentPath={currentPath} />
// //                     ))}
// //                 </ul>
// //             </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </li>
// //   );
// // };

// // // === 3. CUSTOM CHECKBOX ROW ===
// // const CheckboxRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
// //     <label className="flex items-center gap-3 cursor-pointer group py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
// //         <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200
// //             ${checked
// //                 ? "bg-brand-primary border-brand-primary shadow-sm"
// //                 : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-brand-primary"
// //             }`}
// //         >
// //             {checked && <Check size={14} className="text-white" strokeWidth={3} />}
// //         </div>
// //         <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
// //         <span className={`text-sm transition-colors ${checked ? "font-semibold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
// //             {label}
// //         </span>
// //     </label>
// // );

// // // === MAIN COMPONENT ===
// // const FilterSidebar = memo(function FilterSidebar({
// //   isOpen,
// //   onClose,
// //   brands,
// //   attributes,
// //   priceRange,
// //   appliedFilters,
// //   onFilterChange,
// //   onPriceApply,
// //   onClearFilters,
// //   categoryTree,
// //   dealCategories,
// // }: FilterSidebarProps) {

// //   const [priceValues, setPriceValues] = useState({ min: "", max: "" });

// //   const handleApplyClick = () => {
// //     onPriceApply(priceValues);
// //   };

// //   const sidebarContentJsx = (
// //     <div className="h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">

// //       {/* 1. HEADER */}
// //       <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-10">
// //         <div className="flex items-center gap-2">
// //             <Filter size={20} className="text-brand-primary" />
// //             <h2 className="text-xl font-clash font-bold text-gray-900 dark:text-white">Filters</h2>
// //         </div>
// //         <button
// //             onClick={onClose}
// //             className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors lg:hidden"
// //             aria-label="Close filters"
// //         >
// //             <X size={20} />
// //         </button>
// //       </div>

// //       {/* 2. SCROLLABLE CONTENT */}
// //       <div className="px-5 grow overflow-y-auto custom-scrollbar">

// //         {/* Category Tree */}
// //         {categoryTree && (
// //           <FilterSection title="Categories">
// //             <ul className="space-y-0.5">
// //               <CategoryNode category={categoryTree} parentPath={`/category`} />
// //             </ul>
// //           </FilterSection>
// //         )}

// //         {/* Deal Categories */}
// //         {dealCategories && dealCategories.length > 0 && (
// //           <FilterSection title="Deal Categories">
// //             <div className="max-h-60 overflow-y-auto pr-1">
// //               {dealCategories.map((category) => (
// //                 <CheckboxRow
// //                     key={category._id}
// //                     label={category.name}
// //                     checked={appliedFilters.categories?.includes(category.slug) || false}
// //                     onChange={() => onFilterChange("categories", category.slug)}
// //                 />
// //               ))}
// //             </div>
// //           </FilterSection>
// //         )}

// //         {/* Price Filter */}
// //         <FilterSection title="Price Range">
// //           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
// //               <div className="flex items-center gap-3 mb-4">
// //                 <div className="grow">
// //                     <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Min Price</label>
// //                     <input
// //                         type="number"
// //                         placeholder={priceRange.min ? String(priceRange.min) : "0"}
// //                         value={priceValues.min}
// //                         onChange={(e) => setPriceValues(prev => ({ ...prev, min: e.target.value }))}
// //                         className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
// //                     />
// //                 </div>
// //                 <div className="pt-5 text-gray-400">-</div>
// //                 <div className="grow">
// //                     <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Max Price</label>
// //                     <input
// //                         type="number"
// //                         placeholder={priceRange.max ? String(priceRange.max) : "Any"}
// //                         value={priceValues.max}
// //                         onChange={(e) => setPriceValues(prev => ({ ...prev, max: e.target.value }))}
// //                         className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
// //                     />
// //                 </div>
// //               </div>
// //               <button
// //                 onClick={handleApplyClick}
// //                 className="w-full py-2.5 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20 transition-all active:scale-95"
// //               >
// //                 Apply Price
// //               </button>
// //           </div>
// //         </FilterSection>

// //         {/* Brands */}
// //         {brands.length > 0 && (
// //             <FilterSection title="Brands">
// //                 <div className="max-h-60 overflow-y-auto pr-1">
// //                     {brands.map((brand) => brand && (
// //                         <CheckboxRow
// //                             key={brand._id}
// //                             label={brand.name}
// //                             checked={appliedFilters.brands?.includes(brand.slug) || false}
// //                             onChange={() => onFilterChange("brands", brand.slug)}
// //                         />
// //                     ))}
// //                 </div>
// //             </FilterSection>
// //         )}

// //         {/* Attributes */}
// //         {attributes.map((attr) => (
// //             <FilterSection title={attr.name} key={attr.name}>
// //                 <div className="max-h-60 overflow-y-auto pr-1">
// //                     {attr.values.map((value) => {
// //                         const groupKey = attr.name.toLowerCase();
// //                         const isChecked = appliedFilters[groupKey]?.includes(value) || false;
// //                         return (
// //                             <CheckboxRow
// //                                 key={value}
// //                                 label={value}
// //                                 checked={isChecked}
// //                                 onChange={() => onFilterChange(groupKey, value)}
// //                             />
// //                         );
// //                     })}
// //                 </div>
// //             </FilterSection>
// //         ))}
// //       </div>

// //       {/* 3. FOOTER */}
// //       <div className="p-5 shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
// //         <button
// //             onClick={() => { setPriceValues({ min: "", max: "" }); onClearFilters(); }}
// //             className="w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
// //         >
// //             <X size={16} />
// //             Clear All Filters
// //         </button>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <>
// //       {/* Desktop Sidebar */}
// //       <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit self-start">
// //         <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
// //           {sidebarContentJsx}
// //         </div>
// //       </aside>

// //       {/* Mobile Sidebar */}
// //       <AnimatePresence>
// //         {isOpen && (
// //           <>
// //             {/* Backdrop */}
// //             <motion.div
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 exit={{ opacity: 0 }}
// //                 transition={{ duration: 0.3 }}
// //                 onClick={onClose}
// //                 // 🔥 Z-Index decreased to 30 (Behind Navbar)
// //                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
// //                 aria-hidden="true"
// //             />

// //             {/* Drawer */}
// //             <motion.div
// //                 initial={{ x: "-100%" }}
// //                 animate={{ x: 0 }}
// //                 exit={{ x: "-100%" }}
// //                 transition={{ type: "spring", stiffness: 300, damping: 30 }}

// //                 // 🔥 NATIVE APP FIX: Height matches Sidebar logic
// //                 style={{
// //                     height: "calc(100dvh - 60px - env(safe-area-inset-bottom))"
// //                 }}

// //                 // 🔥 Z-Index decreased to 40 (BottomNav is 50)
// //                 // Ab ye Bottom Nav ke peeche rahega agar overlap hua to
// //                 className="fixed top-0 left-0 w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-40 flex flex-col lg:hidden  shadow-2xl overflow-hidden"
// //             >
// //               {sidebarContentJsx}
// //             </motion.div>
// //           </>
// //         )}
// //       </AnimatePresence>
// //     </>
// //   );
// // });

// // export default FilterSidebar;
// // /src/app/components/category/FilterSidebar.tsx (CLEANED & OPTIMIZED)

// "use client";

// import { useState, memo } from "react";
// import { SanityBrand, SanityCategory } from "@/sanity/types/product_types";
// import { X, Filter } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// // --- IMPORT OPTIMIZED COMPONENTS ---
// import FilterSection from "./FilterSection";
// import CategoryNode from "./FilterCategoryTree";
// import FilterCheckboxRow from "./FilterCheckboxRow";

// interface Filters {
//   brands: string[];
//   categories?: string[];
//   [key: string]: any;
// }

// interface FilterSidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
//   brands: SanityBrand[];
//   attributes: { name: string; values: string[] }[];
//   priceRange: { min: number | null; max: number | null };
//   appliedFilters: Filters;
//   onFilterChange: (group: string, value: string) => void;
//   onPriceApply: (price: { min: string; max: string }) => void;
//   onClearFilters: () => void;
//   categoryTree?: SanityCategory;
//   dealCategories?: SanityCategory[];
// }

// // === MAIN COMPONENT ===
// const FilterSidebar = memo(function FilterSidebar({
//   isOpen,
//   onClose,
//   brands,
//   attributes,
//   priceRange,
//   appliedFilters,
//   onFilterChange,
//   onPriceApply,
//   onClearFilters,
//   categoryTree,
//   dealCategories,
// }: FilterSidebarProps) {

//   // State for Price Inputs (Only UI state)
//   const [priceValues, setPriceValues] = useState({ min: "", max: "" });

//   const handleApplyClick = () => {
//     onPriceApply(priceValues);
//   };

//   const sidebarContentJsx = (
//     <div className="h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">

//       {/* 1. HEADER */}
//       <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 bg-white dark:bg-gray-900 sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//             <Filter size={20} className="text-brand-primary" />
//             <h2 className="text-xl font-clash font-bold text-gray-900 dark:text-white">Filters</h2>
//         </div>
//         <button
//             onClick={onClose}
//             className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors lg:hidden"
//             aria-label="Close filters"
//         >
//             <X size={20} />
//         </button>
//       </div>

//       {/* 2. SCROLLABLE CONTENT */}
//       <div className="px-5 grow overflow-y-auto custom-scrollbar">

//         {/* Category Tree */}
//         {categoryTree && (
//           <FilterSection title="Categories">
//             <ul className="space-y-0.5">
//               <CategoryNode category={categoryTree} parentPath={`/category`} />
//             </ul>
//           </FilterSection>
//         )}

//         {/* Deal Categories */}
//         {dealCategories && dealCategories.length > 0 && (
//           <FilterSection title="Deal Categories">
//             <div className="max-h-60 overflow-y-auto pr-1">
//               {dealCategories.map((category) => (
//                 <FilterCheckboxRow
//                     key={category._id}
//                     label={category.name}
//                     checked={appliedFilters.categories?.includes(category.slug) || false}
//                     onChange={() => onFilterChange("categories", category.slug)}
//                 />
//               ))}
//             </div>
//           </FilterSection>
//         )}

//         {/* Price Filter */}
//         <FilterSection title="Price Range">
//           <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="grow">
//                     <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Min Price</label>
//                     <input
//                         type="number"
//                         placeholder={priceRange.min ? String(priceRange.min) : "0"}
//                         value={priceValues.min}
//                         onChange={(e) => setPriceValues(prev => ({ ...prev, min: e.target.value }))}
//                         className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
//                     />
//                 </div>
//                 <div className="pt-5 text-gray-400">-</div>
//                 <div className="grow">
//                     <label className="text-[10px] uppercase text-gray-400 font-bold mb-1 block">Max Price</label>
//                     <input
//                         type="number"
//                         placeholder={priceRange.max ? String(priceRange.max) : "Any"}
//                         value={priceValues.max}
//                         onChange={(e) => setPriceValues(prev => ({ ...prev, max: e.target.value }))}
//                         className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
//                     />
//                 </div>
//               </div>
//               <button
//                 onClick={handleApplyClick}
//                 className="w-full py-2.5 bg-brand-primary text-white text-sm font-bold rounded-lg hover:bg-brand-primary-hover shadow-md shadow-brand-primary/20 transition-all active:scale-95"
//               >
//                 Apply Price
//               </button>
//           </div>
//         </FilterSection>

//         {/* Brands */}
//         {brands.length > 0 && (
//             <FilterSection title="Brands">
//                 <div className="max-h-60 overflow-y-auto pr-1">
//                     {brands.map((brand) => brand && (
//                         <FilterCheckboxRow
//                             key={brand._id}
//                             label={brand.name}
//                             checked={appliedFilters.brands?.includes(brand.slug) || false}
//                             onChange={() => onFilterChange("brands", brand.slug)}
//                         />
//                     ))}
//                 </div>
//             </FilterSection>
//         )}

//         {/* Attributes */}
//         {attributes.map((attr) => (
//             <FilterSection title={attr.name} key={attr.name}>
//                 <div className="max-h-60 overflow-y-auto pr-1">
//                     {attr.values.map((value) => {
//                         const groupKey = attr.name.toLowerCase();
//                         const isChecked = appliedFilters[groupKey]?.includes(value) || false;
//                         return (
//                             <FilterCheckboxRow
//                                 key={value}
//                                 label={value}
//                                 checked={isChecked}
//                                 onChange={() => onFilterChange(groupKey, value)}
//                             />
//                         );
//                     })}
//                 </div>
//             </FilterSection>
//         ))}
//       </div>

//       {/* 3. FOOTER */}
//       <div className="p-5 shrink-0 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
//         <button
//             onClick={() => { setPriceValues({ min: "", max: "" }); onClearFilters(); }}
//             className="w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
//         >
//             <X size={16} />
//             Clear All Filters
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit self-start">
//         <div className="rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
//           {sidebarContentJsx}
//         </div>
//       </aside>

//       {/* Mobile Sidebar */}
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 onClick={onClose}
//                 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
//                 aria-hidden="true"
//             />

//             {/* Drawer */}
//             <motion.div
//                 initial={{ x: "-100%" }}
//                 animate={{ x: 0 }}
//                 exit={{ x: "-100%" }}
//                 transition={{ type: "spring", stiffness: 300, damping: 30 }}

//                 style={{
//                     height: "calc(100dvh - 60px - env(safe-area-inset-bottom))"
//                 }}

//                 className="fixed top-0 left-0 w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-40 flex flex-col lg:hidden  shadow-2xl overflow-hidden"
//             >
//               {sidebarContentJsx}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// });

// export default FilterSidebar;
"use client";

import { memo } from "react";
import { SanityBrand, SanityCategory } from "@/sanity/types/product_types";
import { X, Filter, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FilterSection from "./FilterSection";
import CategoryNode from "./FilterCategoryTree";
import FilterCheckboxRow from "./FilterCheckboxRow";
import SearchableFilterList from "./SearchableFilterList";
import DualRangeSlider from "./DualRangeSlider";
import StarRatingFilter from "./StarRatingFilter";

interface Filters {
  brands: string[];
  categories?: string[];
  availability?: string[];
  isOnSale?: boolean;
  minRating?: number;
  [key: string]: any;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  brands: SanityBrand[];
  attributes: { name: string; values: string[] }[];
  priceRange: { min: number | null; max: number | null };
  appliedFilters: Filters;
  onFilterChange: (group: string, value: any) => void;
  onPriceApply: (price: { min: string; max: string }) => void;
  onClearFilters: () => void;
  categoryTree?: SanityCategory;
  dealCategories?: SanityCategory[];
}

const FilterSidebar = memo(function FilterSidebar({
  isOpen,
  onClose,
  brands,
  attributes,
  priceRange,
  appliedFilters,
  onFilterChange,
  onPriceApply,
  onClearFilters,
  categoryTree,
  dealCategories,
}: FilterSidebarProps) {
  
  // 🔥 FIX 1: Price Reset Logic (Handle 0 correctly)
  // Agar value defined hai (bhale 0 ho) to wo use karo, warna default range.
  const currentMinPrice = 
    appliedFilters.minPrice !== undefined && appliedFilters.minPrice !== null 
      ? Number(appliedFilters.minPrice) 
      : (priceRange.min ?? 0);

  const currentMaxPrice = 
    appliedFilters.maxPrice !== undefined && appliedFilters.maxPrice !== null 
      ? Number(appliedFilters.maxPrice) 
      : (priceRange.max ?? 10000);

  // --- INTERNAL CONTENT ---
  const sidebarContentJsx = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* 1. HEADER */}
      <div className="shrink-0 p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-primary/10 rounded-lg text-brand-primary">
            <Filter size={18} />
          </div>
          <h2 className="text-lg font-clash font-bold text-gray-900 dark:text-white">
            Filters
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 text-gray-500 hover:text-red-500 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* 2. SCROLLABLE MIDDLE SECTION */}
      <div className="px-5 pt-2 pb-4 overflow-y-auto custom-scrollbar grow">
        {categoryTree && (
          <FilterSection title="Categories">
            <ul className="space-y-0.5">
              <CategoryNode category={categoryTree} parentPath={`/category`} />
            </ul>
          </FilterSection>
        )}

        {dealCategories && dealCategories.length > 0 && (
          <FilterSection title="Deal Categories">
            <div className="space-y-1">
              {dealCategories.map((cat) => (
                <FilterCheckboxRow
                  key={cat._id}
                  label={cat.name}
                  checked={appliedFilters.categories?.includes(cat.slug) || false}
                  onChange={() => onFilterChange("categories", cat.slug)}
                />
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection title="Promotions" defaultOpen={true}>
          <div className="space-y-1">
            <label className="flex items-center gap-3 cursor-pointer group py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 
                        ${
                          appliedFilters.isOnSale
                            ? "bg-brand-danger border-brand-danger"
                            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-brand-danger"
                        }`}
              >
                {appliedFilters.isOnSale && (
                  <Zap size={12} className="text-white fill-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={!!appliedFilters.isOnSale}
                onChange={() => onFilterChange("isOnSale", !appliedFilters.isOnSale)}
                className="hidden"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                On Sale / Deals
              </span>
            </label>
          </div>
        </FilterSection>

        {/* PRICE RANGE SLIDER - Key prop added to force re-render if needed */}
        <FilterSection title="Price Range" defaultOpen={true}>
          <DualRangeSlider
            key={`${currentMinPrice}-${currentMaxPrice}`} // Ensures slider updates when props change
            min={priceRange.min ?? 0}
            max={priceRange.max ?? 10000}
            currentMin={currentMinPrice}
            currentMax={currentMaxPrice}
            onChange={(min, max) => onPriceApply({ min, max })}
          />
        </FilterSection>

        <FilterSection title="Availability">
          <FilterCheckboxRow
            label="In Stock"
            checked={appliedFilters.availability?.includes("in-stock") || false}
            onChange={() => onFilterChange("availability", "in-stock")}
          />
        </FilterSection>

        <FilterSection title="Customer Ratings">
          <StarRatingFilter
            selectedRating={appliedFilters.minRating || null}
            onChange={(rating) => onFilterChange("minRating", rating)}
          />
        </FilterSection>

        {brands.length > 0 && (
          <FilterSection title="Brands">
            <SearchableFilterList
              items={brands.map((b) => ({ id: b._id, name: b.name, value: b.slug }))}
              selectedValues={appliedFilters.brands || []}
              onChange={(val) => onFilterChange("brands", val)}
              placeholder="Find a brand..."
            />
          </FilterSection>
        )}

        {attributes.map((attr) => (
          <FilterSection title={attr.name} key={attr.name} defaultOpen={false}>
            <SearchableFilterList
              items={attr.values.map((v) => ({ id: v, name: v, value: v }))}
              selectedValues={appliedFilters[attr.name.toLowerCase()] || []}
              onChange={(val) => onFilterChange(attr.name.toLowerCase(), val)}
              placeholder={`Search ${attr.name}...`}
            />
          </FilterSection>
        ))}
      </div>

      {/* 3. FOOTER */}
      <div className="shrink-0 p-5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 mt-auto">
        <button
          onClick={onClearFilters}
          className="w-full py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <X size={16} />
          Reset All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit self-start">
        <div className="flex flex-col rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden ">
          {sidebarContentJsx}
        </div>
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 🔥 FIX 2: Z-Index lowered to z-20 (Behind Nav) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              
              // 🔥 FIX 2 & 3: 
              // - z-30: Keeps it behind standard bottom nav (usually z-40 or z-50)
              // - pb-20: Adds padding at bottom so Reset Button isn't hidden by nav
              className="fixed top-0 left-0 w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-40 flex flex-col lg:hidden shadow-2xl overflow-hidden
                         h-dvh pb-20 md:pb-0"
            >
              <div className="h-full flex flex-col">{sidebarContentJsx}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default FilterSidebar;
