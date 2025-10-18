
import { Suspense } from 'react';
import { GET_FILTER_DATA_FOR_PLP, searchProducts } from "@/sanity/lib/queries"; 
import ProductListingClient from "@/app/components/category/ProductListingClient";
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }; }) {
    return ( <Suspense fallback={<SearchPageSkeleton />}> <SearchResults searchParams={searchParams} /> </Suspense> );
}

async function SearchResults({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined }; }) {
  const params = await searchParams;
  const q = (params?.q as string) || "";
  const sort = (params?.sort as string) || "best-match";
  const filter = (params?.filter as string) || "";
  const isFeatured = filter === 'isFeatured';
  
  const filtersForSearch = { isFeatured: isFeatured };
  
  const [initialData, filterData] = await Promise.all([
    searchProducts({ searchTerm: q, sortOrder: sort, filters: filtersForSearch, page: 1 }),
    GET_FILTER_DATA_FOR_PLP({ searchTerm: q, sortOrder: sort, isFeatured: isFeatured })
  ]);
  
  const { products: initialProducts, totalCount } = initialData;
  
  let title = "Search Results";
  if (!q && sort === 'newest') title = "New Arrivals";
  if (!q && sort === 'best-selling') title = "Best Sellers";
  if (!q && isFeatured) title = "Featured Products";
  
  const finalFilterData = filterData || { brands: [], attributes: [], priceRange: { min: 0, max: 0 } };

  return (
    // --- FINAL FIX IS HERE: main is now full-width ---
    <main className="w-full bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-full mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">{title}</h1>
          {q && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Showing results for: <span className="font-semibold text-brand-primary">"{q}"</span>
            </p>
          )}
        </div>
      
        {initialProducts && initialProducts.length > 0 ? (
          <ProductListingClient 
            initialProducts={initialProducts} 
            filterData={finalFilterData}
            totalCount={totalCount || 0}
            context={{ 
              type: 'search', 
              value: q,
              sort: sort,
              filter: filter
            }}
          />
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Search size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                  We couldn't find anything matching your criteria. Try a different search or filter.
              </p>
          </div>
        )}
      </div>
    </main>
  );
}

function SearchPageSkeleton() {
    return (
        <main className="w-full bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="max-w-full mx-auto">
                 <div className="mb-6 md:mb-8">
                    <div className="h-10 bg-gray-200 rounded w-1/3 dark:bg-gray-700 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mt-4 dark:bg-gray-700 animate-pulse"></div>
                 </div>
                 <div className="flex justify-center items-center h-[50vh] text-center">
                    <div>
                        <Loader2 className="w-12 h-12 mx-auto animate-spin text-brand-primary" />
                        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Loading results...</p>
                    </div>
                 </div>
            </div>
        </main>
    );
}