
// app/components/layout/MobileMenu.tsx (CRITICAL FIX APPLIED)

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SanityCategory } from "@/sanity/types/product_types";
import { FiX, FiChevronDown } from "react-icons/fi";

// Mocking these links for completeness
const SECONDARY_NAV_LINKS = [
    { name: "Today's Deals", href: "/deals" },
    { name: "Customer Service", href: "/customer-service" },
    { name: "Gift Cards", href: "/gift-cards" },
    { name: "Sell on PocketValue", href: "/sell" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
];

interface MobileMenuProps {
  categories: SanityCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  categories,
  isOpen,
  onClose,
}: MobileMenuProps) {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (categoryId: string) => {
    setOpenSubMenu(openSubMenu === categoryId ? null : categoryId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            // === md:hidden REMOVED FROM HERE ===
            className="fixed inset-0 bg-black/50 z-40"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            // === md:hidden REMOVED FROM HERE ===
            className="fixed top-0 left-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Menu</h2>
              <button onClick={onClose} className="p-2">
                <FiX size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <nav className="flex-grow overflow-y-auto p-4">
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
                  >
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      <div>
                        <button
                          onClick={() => toggleSubMenu(cat._id)}
                          className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-700 dark:text-gray-300"
                        >
                          <span>{cat.name}</span>
                          <FiChevronDown
                            className={`transition-transform duration-200 ${
                              openSubMenu === cat._id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openSubMenu === cat._id && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4"
                            >
                              {cat.subCategories.map((sub) => (
                                <li key={sub._id}>
                                  <Link
                                    href={`/category/${cat.slug}/${sub.slug}`}
                                    onClick={onClose}
                                    className="block py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="block py-3 font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
                      >
                        {cat.name}
                      </Link>
                    )}
                  </li>
                ))}
                 <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">More</p>
                 </li>
                 {SECONDARY_NAV_LINKS.map(link => (
                    <li key={link.name} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                         <Link
                            href={link.href}
                            onClick={onClose}
                            className="block py-3 font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
                        >
                            {link.name}
                        </Link>
                    </li>
                 ))}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
