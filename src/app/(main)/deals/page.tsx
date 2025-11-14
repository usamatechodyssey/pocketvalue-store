// /src/app/deals/page.tsx

import { client } from "@/sanity/lib/client";
import { GET_DEALS_PLP_DATA, getBreadcrumbs } from "@/sanity/lib/queries"; // <-- IMPORT getBreadcrumbs
import ProductListingClient from "@/app/components/category/ProductListingClient";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs"; // <-- IMPORT Breadcrumbs COMPONENT
import { SanityCategory } from "@/sanity/types/product_types";
import { generateBaseMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateBaseMetadata({
    title: "Today's Deals",
    description:
      "Check out the latest deals and special offers on our products. Filter by category, brand, and price.",
    path: "/deals",
  });
}

interface DealsPageData {
  initialProducts: any[];
  filterData: any;
  totalCount: number;
  dealCategories: (SanityCategory | null)[];
}

export default async function DealsPage() {
  // --- FETCH ALL DATA CONCURRENTLY ---
  const [data, breadcrumbs] = await Promise.all([
    client.fetch<DealsPageData | null>(GET_DEALS_PLP_DATA),
    getBreadcrumbs("deals"),
  ]);

  if (!data) {
    return <div>Could not load deals at this time.</div>;
  }

  const { initialProducts, filterData, totalCount, dealCategories } = data;

  const uniqueDealCategories = dealCategories
    ? Array.from(
        new Map(
          dealCategories
            .filter((category): category is SanityCategory => !!category)
            .map((category) => [category._id, category])
        )
      ).map(([, category]) => category)
    : [];

  return (
    <div className="max-w-screen-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        {/* --- ADD BREADCRUMBS COMPONENT --- */}
        <Breadcrumbs crumbs={breadcrumbs} />

        <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100 mt-2">
          Today's Deals
        </h1>
        <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">
          Exclusive offers and discounts, just for you. Grab them before they're
          gone!
        </p>
      </div>

      <ProductListingClient
        initialProducts={initialProducts || []}
        filterData={filterData}
        totalCount={totalCount || 0}
        context={{ type: "deals" }}
        categoryTree={undefined}
        dealCategories={uniqueDealCategories}
      />
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - Imported the `Breadcrumbs` component and the `getBreadcrumbs` function.
// - Refactored the data fetching to use `Promise.all` to fetch page data and breadcrumbs data concurrently.
// - Called `getBreadcrumbs('deals')` to generate the correct trail (`Home / Deals`).
// - Rendered the `<Breadcrumbs />` component at the top of the page, just above the main title.
