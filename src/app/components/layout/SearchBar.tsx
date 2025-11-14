"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Camera,
  X,
  Loader2,
  TrendingUp,
  History,
  Tag,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { searchProducts } from "@/sanity/lib/queries";
import SanityProduct, { SanityCategory } from "@/sanity/types/product_types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { debounce } from "lodash";
import VisualSearchPanel from "@/app/components/ui/VisualSearchPanell";

const PLACEHOLDER_IMAGE_URL = "/placeholder.png";

interface SearchSuggestions {
  trendingKeywords: string[];
  popularCategories: SanityCategory[];
}
interface SearchBarProps {
  searchSuggestions: SearchSuggestions;
}

const SearchSuggestionPill = ({
  text,
  icon: Icon,
  onSelect,
}: {
  text: string;
  icon: React.ComponentType<{ size?: number }>;
  onSelect: (term: string) => void;
}) => (
  <button
    onClick={() => onSelect(text)}
    className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors"
  >
    <Icon size={14} />
    <span>{text}</span>
  </button>
);

export default function SearchBar({ searchSuggestions }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SanityProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const storedSearches = localStorage.getItem("pocketvalue_recent_searches");
    if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
  }, []);

  const addRecentSearch = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;
    const updatedSearches = [
      trimmedTerm,
      ...recentSearches.filter(
        (t) => t.toLowerCase() !== trimmedTerm.toLowerCase()
      ),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem(
      "pocketvalue_recent_searches",
      JSON.stringify(updatedSearches)
    );
  };

  const handleSearchSubmit = (e: React.FormEvent, term = searchTerm) => {
    e.preventDefault();
    const finalTerm = term.trim();
    if (!finalTerm) return;
    addRecentSearch(finalTerm);
    router.push(`/search?q=${encodeURIComponent(finalTerm)}`);
    setSearchTerm("");
    setResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        const { products } = await searchProducts({
          searchTerm: query.trim(),
          page: 1,
        });
        setResults(products.slice(0, 4));
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsVisualSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSuggestions = !searchTerm.trim();
  const showResults = !!searchTerm.trim();

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center w-full bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-brand-primary transition-all"
      >
        <div className="pl-4 pr-2 text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="w-full h-12 text-base text-gray-800 dark:text-gray-200 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          onFocus={() => {
            setIsVisualSearchOpen(false);
            setIsDropdownOpen(true);
          }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 px-3 h-12 flex items-center justify-center transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setIsDropdownOpen(false);
            setIsVisualSearchOpen((prev) => !prev);
          }}
          className="text-gray-500 hover:text-brand-primary px-3 h-12 flex items-center justify-center transition-colors border-l border-gray-200 dark:border-gray-700"
          aria-label="Search by image"
        >
          <Camera size={20} />
        </button>
        <button
          type="submit"
          className="bg-brand-primary hover:bg-brand-primary-hover transition-colors h-12 px-5 flex items-center justify-center rounded-r-lg focus:outline-none"
          aria-label="Submit search"
        >
          <Search className="text-white" size={20} />
        </button>
      </form>

      <AnimatePresence>
        {isVisualSearchOpen && (
          <motion.div
            key="visual-search-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VisualSearchPanel onClose={() => setIsVisualSearchOpen(false)} />
          </motion.div>
        )}

        {isDropdownOpen && (
          <motion.div
            key="search-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto"
          >
            {showResults && (
              <div>
                {isLoading && (
                  <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="animate-spin" size={16} /> Searching...
                  </div>
                )}
                {!isLoading && results.length > 0 && (
                  <ul>
                    {results.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={() => {
                            addRecentSearch(searchTerm);
                            setSearchTerm("");
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="relative w-14 h-14 shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md">
                            <Image
                              src={
                                product.defaultVariant.images?.[0]
                                  ? urlFor(
                                      product.defaultVariant.images[0]
                                    ).url()
                                  : PLACEHOLDER_IMAGE_URL
                              }
                              alt={product.title}
                              fill
                              className="object-contain p-1"
                              sizes="56px"
                            />
                          </div>
                          <div className="grow overflow-hidden">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                              {product.title}
                            </p>
                            <p className="text-sm font-bold text-brand-primary">
                              Rs.{" "}
                              {(
                                product.defaultVariant.salePrice ??
                                product.defaultVariant.price
                              ).toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={(e) => handleSearchSubmit(e)}
                        className="text-sm font-bold text-brand-primary hover:underline"
                      >
                        View all results for "{searchTerm}"
                      </button>
                    </li>
                  </ul>
                )}
                {!isLoading &&
                  results.length === 0 &&
                  searchTerm.length > 1 && (
                    <p className="p-4 text-center text-gray-500">
                      No results found for "{searchTerm}".
                    </p>
                  )}
              </div>
            )}
            {showSuggestions && (
              <div className="p-6 space-y-6">
                {recentSearches.length > 0 && (
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      Recent Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <SearchSuggestionPill
                          key={term}
                          text={term}
                          icon={History}
                          onSelect={(t) =>
                            handleSearchSubmit(new Event("submit") as any, t)
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* --- FIX APPLIED HERE --- */}
                {searchSuggestions?.trendingKeywords?.length > 0 && (
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.trendingKeywords.map((term) => (
                        <SearchSuggestionPill
                          key={term}
                          text={term}
                          icon={TrendingUp}
                          onSelect={(t) =>
                            handleSearchSubmit(new Event("submit") as any, t)
                          }
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* --- FIX APPLIED HERE --- */}
                {searchSuggestions?.popularCategories?.length > 0 && (
                  <section>
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                      Popular Categories
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {searchSuggestions.popularCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/category/${cat.slug}`}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
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
                          <p className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 line-clamp-2">
                            {cat.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
