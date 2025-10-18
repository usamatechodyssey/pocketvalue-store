
"use client";

import { useState, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SanityBrand, SanityCategory } from "@/sanity/types/product_types";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Filters {
  brands: string[];
  categories?: string[]; // categories filter ab yahan zaroori hai
  [key: string]: any;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  brands: SanityBrand[];
  attributes: { name: string; values: string[] }[];
  priceRange: { min: number | null; max: number | null };
  appliedFilters: Filters;
  onFilterChange: (group: string, value: string) => void;
  onPriceApply: (price: { min: string; max: string }) => void;
  onClearFilters: () => void;
  // Yeh prop ab optional hai, taake Deals page per error na aye
  categoryTree?: SanityCategory; 
  dealCategories?: SanityCategory[]; // Nayi optional prop
}

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="py-5 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden"><div className="p-1">{children}</div></div>
      </div>
    </div>
  );
};

const CategoryNode = ({ category, parentPath }: { category: SanityCategory; parentPath: string; }) => {
  const pathname = usePathname();
  const currentPath = `${parentPath}/${category.slug}`;
  const isActive = pathname === currentPath;
  const hasChildren = Array.isArray(category.subCategories) && category.subCategories.length > 0;
  const [isOpen, setIsOpen] = useState(isActive || pathname.startsWith(currentPath));

  return (
    <li>
      <div className="flex items-center justify-between group">
        <Link href={currentPath} className={`block text-sm py-1.5 px-2 rounded-md flex-grow transition-colors ${isActive ? "font-semibold text-brand-primary bg-brand-primary/10" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
          {category.name}
        </Link>
        {hasChildren && (<button onClick={() => setIsOpen(!isOpen)} className="p-1.5 flex-shrink-0" aria-label={`Expand ${category.name}`}><ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-all ${isOpen ? "rotate-180" : ""}`} /></button>)}
      </div>
      {hasChildren && (<div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><ul className="overflow-hidden pl-4 mt-1 border-l border-gray-200 dark:border-gray-600">{category.subCategories?.map((subCat) => (<CategoryNode key={subCat._id} category={subCat} parentPath={currentPath} />))}</ul></div>)}
    </li>
  );
};

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
  dealCategories, // Nayi prop yahan receive hui
}: FilterSidebarProps) {

  const [priceValues, setPriceValues] = useState({ min: "", max: "" });

  const handleApplyClick = () => {
    onPriceApply(priceValues);
  };

  const sidebarContentJsx = (
    <div className="h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Close filters"><X size={20} /></button>
      </div>

      <div className="px-5 flex-grow overflow-y-auto">
        {/* === YAHAN ASAL TABDEELI HAI === */}
        {/* Yeh section sirf tab nazar aayega jab 'categoryTree' mojood ho */}
        {categoryTree && (
          <FilterSection title="Categories" defaultOpen={true}>
            <ul className="space-y-0.5">
              <CategoryNode category={categoryTree} parentPath={`/category`} />
            </ul>
          </FilterSection>
        )}
        
        {/* === NAYA SECTION YAHAN ADD HUA HAI === */}
        {/* Deal Categories (Sirf Deals Page per nazar aayega) */}
        {dealCategories && dealCategories.length > 0 && (
          <FilterSection title="Category" defaultOpen={true}>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {dealCategories.map((category) => (
                <label key={category._id} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    // Hum category ka slug filter ke liye istemal karenge
                    checked={appliedFilters.categories?.includes(category.slug) || false}
                    onChange={() => onFilterChange("categories", category.slug)}
                    className="h-4 w-4 rounded-sm text-brand-primary focus:ring-brand-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
        <FilterSection title="Price">
          <div className="flex items-center gap-2">
            <input type="number" placeholder={`Min: ${priceRange.min || 0}`} value={priceValues.min} onChange={(e) => setPriceValues(prev => ({ ...prev, min: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            <span className="text-gray-400">-</span>
            <input type="number" placeholder={`Max: ${priceRange.max || "Any"}`} value={priceValues.max} onChange={(e) => setPriceValues(prev => ({ ...prev, max: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
          </div>
          <button onClick={handleApplyClick} className="w-full mt-3 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-md hover:bg-brand-primary-hover transition-colors">Apply</button>
        </FilterSection>
        
        {brands.length > 0 && (<FilterSection title="Brands" defaultOpen={true}><div className="space-y-3 max-h-60 overflow-y-auto pr-2">{brands.map((brand) => brand && (<label key={brand._id} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={appliedFilters.brands?.includes(brand.slug) || false} onChange={() => onFilterChange("brands", brand.slug)} className="h-4 w-4 rounded-sm text-brand-primary focus:ring-brand-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" /><span>{brand.name}</span></label>))}</div></FilterSection>)}
        
        {attributes.map((attr) => (<FilterSection title={attr.name} key={attr.name} defaultOpen={true}><div className="space-y-3 max-h-60 overflow-y-auto pr-2">{attr.values.map((value) => {const groupKey = attr.name.toLowerCase(); const isChecked = appliedFilters[groupKey]?.includes(value) || false; return (<label key={value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={isChecked} onChange={() => onFilterChange(groupKey, value)} className="h-4 w-4 rounded-sm text-brand-primary focus:ring-brand-primary/50 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" /><span>{value}</span></label>);})}</div></FilterSection>))}
      </div>

      <div className="p-5 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <button onClick={() => { setPriceValues({ min: "", max: "" }); onClearFilters(); }} className="w-full text-sm font-semibold text-red-600 hover:underline">Clear All Filters</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-24 h-fit">
        <div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {sidebarContentJsx}
        </div>
      </aside>
      
      {/* Mobile Sidebar (Logic wesi hi rahegi) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" aria-hidden="true" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 left-0 h-[100dvh] w-80 max-w-[calc(100%-4rem)] bg-white dark:bg-gray-900 z-50 flex flex-col lg:hidden">
              {sidebarContentJsx}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

export default FilterSidebar;
