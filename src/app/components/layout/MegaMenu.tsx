

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SanityCategory } from "@/sanity/types/product_types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const SubCategoryList = ({
  category, subCategory, onViewAllToggle, isExpanded,
}: {
  category: SanityCategory; subCategory: SanityCategory; onViewAllToggle: (id: string) => void; isExpanded: boolean;
}) => {
  const items = subCategory.subCategories || [];
  const initialLimit = 5;
  const hasMore = items.length > initialLimit;
  
  const listVariants: Variants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
    collapsed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="flex flex-col">
      {/* --- FIX #2 & #3 HERE: Center alignment and reduced spacing --- */}
      <Link href={`/category/${category.slug}/${subCategory.slug}`} className="self-start">
        <h3 className="inline-block text-base font-bold text-gray-800 dark:text-gray-100 border-b-2 border-brand-primary pb-1 hover:text-brand-primary transition-colors">
          {subCategory.name}
        </h3>
      </Link>
      
      <ul className="space-y-2.5 mt-4">
        {items.slice(0, initialLimit).map((item) => (
            <li key={item._id}><Link href={`/category/${category.slug}/${subCategory.slug}/${item.slug}`} className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary"><ArrowRight className="h-3 w-3 text-gray-400 dark:text-gray-600 group-hover:text-brand-primary transition-transform group-hover:translate-x-1" /><span>{item.name}</span></Link></li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
          {isExpanded && (
              <motion.ul
                  key="more-items"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={listVariants}
                  className="space-y-2.5 overflow-hidden"
              >
                 {items.slice(initialLimit).map((item) => (
                    <li key={item._id}><Link href={`/category/${category.slug}/${subCategory.slug}/${item.slug}`} className="group flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary"><ArrowRight className="h-3 w-3 text-gray-400 dark:text-gray-600 group-hover:text-brand-primary transition-transform group-hover:translate-x-1" /><span>{item.name}</span></Link></li>
                 ))}
              </motion.ul>
          )}
      </AnimatePresence>

      {hasMore && (
        <button onClick={() => onViewAllToggle(subCategory._id)} className="flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline mt-auto pt-2">
          <span>{isExpanded ? "Show Less" : `View All (${items.length})`}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default function MegaMenu({ category }: { category: SanityCategory | null }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const handleViewAllToggle = (id: string) => { setExpandedId(currentId => currentId === id ? null : id); };
  React.useEffect(() => { setExpandedId(null); }, [category]);

  const sortedSubCategories = React.useMemo(() => {
    if (!category?.subCategories) return [];
    return [...category.subCategories].sort((a, b) => {
      const aHasChildren = (a.subCategories?.length || 0) > 0;
      const bHasChildren = (b.subCategories?.length || 0) > 0;
      if (aHasChildren && !bHasChildren) return -1;
      if (!aHasChildren && bHasChildren) return 1;
      return 0;
    });
  }, [category]);
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.04 }},
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // --- FIX #1 HERE: Opacity added to the main animation ---
  const megaMenuVariants: Variants = {
      hidden: { x: "-100%", opacity: 0.5, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }},
      visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }},
  }

  return (
    <AnimatePresence mode="wait">
      {category?.subCategories && category.subCategories.length > 0 && (
        <motion.div
          key={category._id}
          variants={megaMenuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="h-full w-[70vw] max-w-5xl bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-2xl"
        >
          <div className="h-full overflow-y-auto p-8 lg:p-10">
            <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-3xl font-extrabold text-brand-primary mb-8"
            >
              {category.name}
            </motion.h2>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedSubCategories.map((subCategory) => (
                 <motion.div key={subCategory._id} variants={itemVariants}>
                    <SubCategoryList
                        category={category}
                        subCategory={subCategory}
                        onViewAllToggle={handleViewAllToggle}
                        isExpanded={expandedId === subCategory._id}
                    />
                 </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}