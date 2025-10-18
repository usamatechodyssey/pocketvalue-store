
"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, History, Tag } from "lucide-react";
import SearchBar from "../layout/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { SanityCategory } from "@/sanity/types/product_types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  trendingKeywords: string[];
  popularCategories: SanityCategory[];
}

const SearchSuggestionPill = ({
  text,
  icon: Icon,
  onSelect,
}: {
  text: string;
  icon: React.ElementType;
  onSelect: (term: string) => void;
}) => (
  <button
    onClick={() => onSelect(text)}
    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
  >
    <Icon size={14} />
    <span>{text}</span>
  </button>
);

export default function SearchPanel({
  isOpen,
  onClose,
  trendingKeywords,
  popularCategories,
}: SearchPanelProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedSearches = localStorage.getItem("pocketvalue_recent_searches");
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, [isOpen]);

  const clearRecentSearches = () => {
    localStorage.removeItem("pocketvalue_recent_searches");
    setRecentSearches([]);
  };

  const handleSuggestionClick = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;
    const updatedSearches = [
      trimmedTerm,
      ...recentSearches.filter(
        (t) => t.toLowerCase() !== trimmedTerm.toLowerCase()
      ),
    ].slice(0, 5);
    localStorage.setItem(
      "pocketvalue_recent_searches",
      JSON.stringify(updatedSearches)
    );
    router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
    onClose();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 top-auto h-[calc(100dvh-5rem)] bg-gray-50 dark:bg-gray-900 z-50 flex flex-col rounded-t-2xl shadow-2xl md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                Search Products
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex-shrink-0">
              <SearchBar
                searchSuggestions={{
                  trendingKeywords: [],
                  popularCategories: [],
                }}
              />
            </div>
            <div className="flex-grow overflow-y-auto px-4 pb-20">
              <motion.div
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
              >
                {recentSearches.length > 0 && (
                  <motion.section
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs font-semibold text-brand-danger hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <SearchSuggestionPill
                          key={term}
                          text={term}
                          icon={History}
                          onSelect={handleSuggestionClick}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* --- FIX APPLIED HERE --- */}
                {trendingKeywords?.length > 0 && (
                  <motion.section
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingKeywords.map((term) => (
                        <SearchSuggestionPill
                          key={term}
                          text={term}
                          icon={TrendingUp}
                          onSelect={handleSuggestionClick}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* --- FIX APPLIED HERE --- */}
                {popularCategories?.length > 0 && (
                  <motion.section
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Popular Categories
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {popularCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/category/${cat.slug}`}
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            {cat.image ? (
                              <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Tag className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300">
                            {cat.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.section>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
