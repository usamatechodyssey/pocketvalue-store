
// app/category/[...slug]/page.tsx (FINAL AND COMPLETE CODE)

import { notFound } from "next/navigation";
import { GET_CATEGORY_PLP_DATA } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

import ProductListingClient from "@/app/components/category/ProductListingClient";
import CategoryHeader from "@/app/components/category/CategoryHeader";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  // `params` ko await karna zaroori hai
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];
  
  // Nayi query ab `initialProducts`, `filterData`, aur `totalCount` sab laayegi
  const plpData = await client.fetch(GET_CATEGORY_PLP_DATA, {
    slug: currentSlug,
  });

  if (!plpData || !plpData.currentCategory) {
    notFound();
  }

  const {
    initialProducts,
    filterData,
    totalCount, // Hum ab `totalCount` direct query se le rahe hain
    currentCategory,
    grandparentRef,
    parentTree,
    selfTree,
  } = plpData;

  // Sidebar ke liye category tree ka logic
  let categoryTreeForSidebar;
  if (grandparentRef) {
    categoryTreeForSidebar = parentTree;
  } else {
    categoryTreeForSidebar = selfTree;
  }

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-full mx-auto">
        <CategoryHeader
          currentCategory={currentCategory}
          slugPath={slug} 
        />
      </div>

      {initialProducts && initialProducts.length > 0 ? (
        <ProductListingClient
          initialProducts={initialProducts}
          filterData={filterData}
          categoryTree={categoryTreeForSidebar}
          totalCount={totalCount || 0} // `totalCount` prop pass karein
          context={{ type: 'category', value: currentSlug }}
        />
      ) : (
        <div className="max-w-full mx-auto">
          <div className="text-center py-20 bg-white dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-text-primary dark:text-gray-200">
              No Products Found
            </h3>
            <p className="text-text-secondary dark:text-gray-400 mt-2">
              There are currently no products in the "{currentCategory.name}" category.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}