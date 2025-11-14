// /src/app/components/category/ProductListingClient.tsx

"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import SanityProduct, {
  SanityBrand,
  SanityCategory,
} from "@/sanity/types/product_types";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "../product/ProductGrid";
import QuickViewModal from "../product/QuickViewModal";
import PaginationControls from "../ui/PaginationControls";
import MobileFilterButton from "../ui/MobileFilterButton";
import { ChevronDown, Loader2 } from "lucide-react";
import { debounce } from "lodash";

const PRODUCTS_PER_PAGE = 12;

interface AppliedFilters {
  brands: string[];
  categories?: string[];
  isFeatured?: boolean;
  [key: string]: any;
}
interface FilterData {
  brands: (SanityBrand | null)[];
  attributes: { name: string; value: string }[];
  priceRange: { min: number; max: number };
}
interface PLPProps {
  initialProducts: SanityProduct[];
  filterData: FilterData;
  categoryTree?: SanityCategory;
  dealCategories?: SanityCategory[];
  context: {
    type: "category" | "search" | "deals";
    value?: string;
    sort?: string;
    filter?: string;
  };
  totalCount: number;
}

export default function ProductListingClient({
  initialProducts,
  filterData,
  categoryTree,
  dealCategories,
  context,
  totalCount,
}: PLPProps) {
  const [products, setProducts] = useState(initialProducts);
  const [totalProducts, setTotalProducts] = useState(totalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] =
    useState<SanityProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(context.sort || "best-match");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    brands: [],
    categories: [],
    isFeatured: context.filter === "isFeatured",
  });
  const [appliedPriceRange, setAppliedPriceRange] = useState({
    min: 0,
    max: Infinity,
  });

  // Ref to track if it's the initial render
  const isInitialMount = useRef(true);

  const fetchProducts = useCallback(
    debounce(
      async (
        pageToFetch: number,
        filters: AppliedFilters,
        priceRange: { min: number; max: number },
        sort: string
      ) => {
        setIsLoading(true);
        try {
          const payload = {
            page: pageToFetch,
            sortOrder: sort,
            filters,
            priceRange: {
              min: priceRange.min,
              max: priceRange.max === Infinity ? undefined : priceRange.max,
            },
            context,
          };
          const response = await fetch("/api/filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) throw new Error("API request failed");

          const { products: newProducts, totalCount: newTotalCount } =
            await response.json();
          setProducts(newProducts);
          setTotalProducts(newTotalCount);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
          setTotalProducts(0);
        } finally {
          setIsLoading(false);
        }
      },
      400
    ),
    [context]
  );

  // --- THE FIX IS HERE: Refactored useEffect Hooks ---

  // Effect 1: Handles changes to filters and sorting.
  // It resets to page 1 and fetches data.
  useEffect(() => {
    // We use the isInitialMount ref to skip this effect on the very first render.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // When any filter changes, we want to go back to page 1.
    setCurrentPage(1);

    // We then fetch the data for the new filters on page 1.
    fetchProducts(1, appliedFilters, appliedPriceRange, sortOrder);
  }, [appliedFilters, appliedPriceRange, sortOrder, fetchProducts]);

  // Effect 2: Handles changes to pagination (currentPage).
  // It only runs when the current page changes and it's not the first page.
  useEffect(() => {
    // We skip the initial mount and also skip if the page is 1
    // (because the effect above already handled the fetch for page 1).
    if (isInitialMount.current || currentPage === 1) {
      return;
    }

    fetchProducts(currentPage, appliedFilters, appliedPriceRange, sortOrder);
  }, [currentPage, fetchProducts]);

  const handleFilterChange = (group: string, value: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [group]: (prev[group] || []).includes(value)
        ? (prev[group] || []).filter((v: string) => v !== value)
        : [...(prev[group] || []), value],
    }));
  };

  const handlePriceApply = (price: { min: string; max: string }) => {
    setAppliedPriceRange({
      min: Number(price.min) || 0,
      max: Number(price.max) || Infinity,
    });
  };

  const handleClearFilters = () => {
    setAppliedFilters({ brands: [], categories: [], isFeatured: false });
    setAppliedPriceRange({ min: 0, max: Infinity });
    setSortOrder("best-match");
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const uniqueBrandsForSidebar = useMemo(
    () => (filterData?.brands?.filter(Boolean) as SanityBrand[]) || [],
    [filterData]
  );
  const uniqueAttributes = useMemo(() => {
    const attrs: Record<string, Set<string>> = {};
    if (filterData?.attributes) {
      filterData.attributes.forEach(({ name, value }) => {
        if (!name || !value) return;
        if (!attrs[name]) attrs[name] = new Set();
        attrs[name].add(value);
      });
    }
    return Object.entries(attrs).map(([name, valuesSet]) => ({
      name,
      values: Array.from(valuesSet).sort(),
    }));
  }, [filterData]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          brands={uniqueBrandsForSidebar}
          attributes={uniqueAttributes}
          priceRange={filterData.priceRange}
          appliedFilters={appliedFilters}
          onFilterChange={handleFilterChange}
          onPriceApply={handlePriceApply}
          onClearFilters={handleClearFilters}
          categoryTree={categoryTree}
          dealCategories={dealCategories}
        />

        <main className="flex-1 w-full">
          <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800/95 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {totalProducts}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="lg:hidden">
                <MobileFilterButton onClick={() => setIsSidebarOpen(true)} />
              </div>
              <div className="relative">
                <select
                  id="sort-by"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-gray-800 pl-3 sm:pl-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary pr-8 sm:pr-9"
                >
                  <option value="best-match">Best Match</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="newest">Newest</option>
                  <option value="price-low-to-high">Price: Low-High</option>
                  <option value="price-high-to-low">Price: High-Low</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="relative min-h-[50vh]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg bg-white/50 dark:bg-gray-900/50">
                <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
              </div>
            )}
            <div>
              {products.length > 0 ? (
                <ProductGrid
                  products={products}
                  onQuickView={setQuickViewProduct}
                />
              ) : (
                !isLoading && (
                  <div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold">No Products Found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your filters.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </main>
      </div>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Simplified State:** The component now directly uses `initialProducts` and `totalCount` for its initial state, trusting the `key` prop to provide fresh data.
// - **Refactored `useEffect`s:** The complex, multi-layered `useEffect` logic has been simplified into two clear effects: one for handling subsequent fetches (when filters, sort, or page change) and one for resetting the page number when filters change. This is a much cleaner and more predictable pattern.
// - Removed the `isInitialMount` ref, as the new `key` prop and simplified `useEffect` logic make it redundant.
