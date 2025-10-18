// "use client";

// import { useState, useEffect, useMemo, useCallback, useRef } from "react";
// import SanityProduct, {
//   SanityBrand,
//   SanityCategory,
// } from "@/sanity/types/product_types";
// import FilterSidebar from "./FilterSidebar";
// import ProductGrid from "../product/ProductGrid";
// import QuickViewModal from "../product/QuickViewModal";
// import PaginationControls from "../ui/PaginationControls";
// import MobileFilterButton from "../ui/MobileFilterButton";
// import { ChevronDown, Loader2 } from "lucide-react";
// import { debounce } from "lodash";

// const PRODUCTS_PER_PAGE = 12;

// interface AppliedFilters {
//   brands: string[];
//   categories: string[];
//   [key: string]: string[];
// }
// interface FilterData {
//   brands: (SanityBrand | null)[];
//   attributes: { name: string; value: string }[];
//   priceRange: { min: number; max: number };
// }
// interface PLPProps {
//   initialProducts: SanityProduct[];
//   filterData: FilterData;
//   categoryTree?: SanityCategory;
//   dealCategories?: SanityCategory[];
//   context: {
//     type: "category" | "search" | "deals";
//     value?: string;
//   };
//   totalCount: number;
// }

// export default function ProductListingClient({
//   initialProducts,
//   filterData,
//   categoryTree,
//   dealCategories,
//   context,
//   totalCount,
// }: PLPProps) {
//   const [products, setProducts] = useState(initialProducts);
//   const [totalProducts, setTotalProducts] = useState(totalCount);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [quickViewProduct, setQuickViewProduct] = useState<SanityProduct | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOrder, setSortOrder] = useState("best-match");

//   const initialFilterState = useMemo(() => {
//     const state: AppliedFilters = { brands: [], categories: [] };
//     if (filterData?.attributes) {
//       filterData.attributes.forEach((attr) => {
//         if (attr.name) {
//           state[attr.name.toLowerCase()] = [];
//         }
//       });
//     }
//     return state;
//   }, [filterData?.attributes]);

//   const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>(initialFilterState);
//   const [appliedPriceRange, setAppliedPriceRange] = useState({ min: 0, max: Infinity });
//   const isInitialMount = useRef(true);

//   const fetchProducts = useCallback(
//     debounce(async (pageToFetch: number, filters: AppliedFilters, priceRange: { min: number, max: number }, sort: string) => {
//       setIsLoading(true);
//       try {
//         const response = await fetch("/api/filter", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             page: pageToFetch,
//             sortOrder: sort,
//             filters: filters,
//             priceRange: {
//               min: priceRange.min,
//               max: priceRange.max === Infinity ? undefined : priceRange.max,
//             },
//             context,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "API request failed");
//         }

//         const { products: newProducts, totalCount: newTotalCount } = await response.json();
//         setProducts(newProducts);
//         setTotalProducts(newTotalCount);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         setProducts([]); // Error ki soorat mein products khali kar dein
//         setTotalProducts(0);
//       } finally {
//         setIsLoading(false);
//       }
//     }, 400), // Thora sa debounce time barhaya
//     [context]
//   );

//   // === USEEFFECT LOGIC BEHTAR BANAYI GAYI HAI ===
//   useEffect(() => {
//     // isInitialMount check karega ke yeh pehli dafa page load hone per na chale
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }

//     // Page change hone per 1 nahi karna
//     fetchProducts(currentPage, appliedFilters, appliedPriceRange, sortOrder);

//   }, [currentPage]);

//   useEffect(() => {
//     if (!isInitialMount.current) {
//       // Filter, Price ya Sort change hone per page 1 per reset karein
//       if (currentPage !== 1) {
//         setCurrentPage(1);
//       } else {
//         // Agar pehle se page 1 per hain to direct fetch karein
//         fetchProducts(1, appliedFilters, appliedPriceRange, sortOrder);
//       }
//     }
//   }, [appliedFilters, appliedPriceRange, sortOrder]);

//   const handleFilterChange = (group: string, value: string) => {
//     setAppliedFilters((prev) => ({
//       ...prev,
//       [group]: (prev[group] || []).includes(value)
//         ? (prev[group] || []).filter((v) => v !== value)
//         : [...(prev[group] || []), value],
//     }));
//   };

//   const handlePriceApply = (price: { min: string; max: string }) => {
//     setAppliedPriceRange({ min: Number(price.min) || 0, max: Number(price.max) || Infinity });
//   };

//   const handleClearFilters = () => {
//     setAppliedFilters(initialFilterState);
//     setAppliedPriceRange({ min: 0, max: Infinity });
//   };

//   const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

//   const uniqueBrandsForSidebar = useMemo(() => (filterData?.brands?.filter(Boolean) as SanityBrand[]) || [], [filterData?.brands]);
//   const uniqueAttributes = useMemo(() => {
//     const attrs: Record<string, Set<string>> = {};
//     if (filterData?.attributes) {
//       filterData.attributes.forEach(({ name, value }) => {
//         if (!name || !value) return;
//         if (!attrs[name]) attrs[name] = new Set();
//         attrs[name].add(value);
//       });
//     }
//     return Object.entries(attrs).map(([name, valuesSet]) => ({ name, values: Array.from(valuesSet).sort() }));
//   }, [filterData?.attributes]);

//   return (
//     <>
//       <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
//         <FilterSidebar
//           isOpen={isSidebarOpen}
//           onClose={() => setIsSidebarOpen(false)}
//           brands={uniqueBrandsForSidebar}
//           attributes={uniqueAttributes}
//           priceRange={{
//             min: filterData?.priceRange?.min || 0,
//             max: filterData?.priceRange?.max || 0,
//           }}
//           appliedFilters={appliedFilters}
//           onFilterChange={handleFilterChange}
//           onPriceApply={handlePriceApply}
//           onClearFilters={handleClearFilters}
//           categoryTree={categoryTree}
//           dealCategories={dealCategories}
//         />

//         <main className="flex-1 w-full">
//           <div className="flex justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800/95 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
//               Showing <span className="font-bold text-gray-800 dark:text-gray-200">{products.length}</span> of <span className="font-bold text-gray-800 dark:text-gray-200">{totalProducts}</span> results
//             </p>
//             <div className="flex items-center gap-2 sm:gap-4">
//               <div className="lg:hidden"><MobileFilterButton onClick={() => setIsSidebarOpen(true)} /></div>
//               <div className="relative">
//                 <select id="sort-by" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="appearance-none bg-gray-50 dark:bg-gray-800 pl-3 sm:pl-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary pr-8 sm:pr-9">
//                   <option value="best-match">Best Match</option>
//                   <option value="best-selling">Best Selling</option>
//                   <option value="newest">Newest</option>
//                   <option value="price-low-to-high">Price: Low-High</option>
//                   <option value="price-high-to-low">Price: High-Low</option>
//                 </select>
//                 <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>
//           <div className="relative">
//             {isLoading && (<div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-10 rounded-lg"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>)}
//             {products.length > 0 ? (<ProductGrid products={products} onQuickView={setQuickViewProduct} />) : (<div className="text-center py-20 px-6 bg-white dark:bg-gray-800 rounded-lg"><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Products Found</h3><p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p></div>)}
//           </div>
//           {totalPages > 1 && (<div className="mt-8"><PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} /></div>)}
//         </main>
//       </div>
//       <QuickViewModal product={quickViewProduct} isOpen={!!quickViewProduct} onClose={() => setQuickViewProduct(null)} />
//     </>
//   );
// }
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
  isFeatured?: boolean; // Naya filter
  [key: string]: any;
}
interface FilterData {
  brands: (SanityBrand | null)[];
  attributes: { name: string; value: string }[];
  priceRange: { min: number; max: number };
}
interface PLPProps {
  initialProducts: SanityProduct[]; // Yeh ab hamesha khali hoga
  filterData: FilterData;
  categoryTree?: SanityCategory;
  dealCategories?: SanityCategory[];
  context: {
    type: "category" | "search" | "deals";
    value?: string;
    sort?: string; // Optional sort
    filter?: string; // Optional filter
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
  // State Initialization
  const [products, setProducts] = useState(initialProducts);
  const [totalProducts, setTotalProducts] = useState(totalCount);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial fetch
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] =
    useState<SanityProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize state based on context from URL
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

  const isInitialMount = useRef(true); // Track initial render

  const fetchProducts = useCallback(
    debounce(
      async (
        pageToFetch: number,
        filters: AppliedFilters,
        priceRange: { min: number; max: number },
        sort: string,
        currentContext: PLPProps["context"]
      ) => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/filter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: pageToFetch,
              sortOrder: sort,
              filters: filters,
              priceRange: {
                min: priceRange.min,
                max: priceRange.max === Infinity ? undefined : priceRange.max,
              },
              context: {
                // Use the passed context
                type: currentContext.type,
                value: currentContext.value,
              },
            }),
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
    [] // dependency array ko khali rakhein taake function dobara na bane
  );

  // --- FINAL FIX: useEffect logic ---
  useEffect(() => {
    // Sirf page load hone per, initial context ke sath, data fetch karega.
    // Debounce yahan istemal na karein taake pehli load fast ho.
    const initialFetch = async () => {
      await fetchProducts(
        1,
        appliedFilters,
        appliedPriceRange,
        sortOrder,
        context
      );
      setIsLoading(false);
    };
    initialFetch();
  }, []); // Yeh sirf ek baar chalega jab component mount hoga

  useEffect(() => {
    if (isInitialMount.current) {
      // Initial fetch pehle hi ho chuka hai, isko skip karein.
      isInitialMount.current = false;
      return;
    }

    // Page change hone per hamesha page 1 se fetch karein (pagination ke ilawa)
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      // Agar pehle se hi page 1 per hain to direct fetch karein
      fetchProducts(1, appliedFilters, appliedPriceRange, sortOrder, context);
    }
  }, [appliedFilters, appliedPriceRange, sortOrder]);

  useEffect(() => {
    // Yeh sirf pagination ke liye hai
    if (!isInitialMount.current) {
      fetchProducts(
        currentPage,
        appliedFilters,
        appliedPriceRange,
        sortOrder,
        context
      );
    }
  }, [currentPage]);

  const handleFilterChange = (group: string, value: string) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [group]: (prev[group] || []).includes(value)
        ? (prev[group] || []).filter((v) => v !== value)
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
    [filterData?.brands]
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
  }, [filterData?.attributes]);

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
            {isLoading &&
              products.length === 0 && ( // Initial loading state
                <div className="absolute inset-0 flex items-center justify-center z-10 rounded-lg">
                  <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
                </div>
              )}
            <div
              className={`transition-opacity duration-300 ${isLoading ? "opacity-50" : "opacity-100"}`}
            >
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
