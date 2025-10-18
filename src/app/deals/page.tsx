import { client } from "@/sanity/lib/client";
import { GET_DEALS_PLP_DATA } from "@/sanity/lib/queries";
import ProductListingClient from "@/app/components/category/ProductListingClient";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { SanityCategory } from "@/sanity/types/product_types";

export const metadata = {
  title: "Today's Deals",
  description:
    "Check out the latest deals and special offers on our products. Filter by category, brand, and price.",
};

interface DealsPageData {
  initialProducts: any[];
  filterData: any;
  totalCount: number;
  dealCategories: SanityCategory[];
}

export default async function DealsPage() {
  const data: DealsPageData = await client.fetch(GET_DEALS_PLP_DATA);

  const { initialProducts, filterData, totalCount, dealCategories } = data;

  // === YAHAN ASAL FIX HAI ===
  // Hum duplicate categories ko client per filter kar rahe hain.
  const uniqueDealCategories = dealCategories
    ? Array.from(
        // Pehle aek Map banayein. Map mein keys hamesha unique hoti hain.
        // Hum category._id ko key ke tor per istemal karenge.
        new Map(dealCategories.map((category) => [category._id, category]))
        // Phir us Map se values (yani category objects) wapis nikal lein.
      ).map(([, category]) => category)
    : [];
  // ==========================

  const breadcrumbLinks = [
    { name: "Home", href: "/" },
    { name: "Deals", href: "/deals" },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-6 md:mb-8">
        <Breadcrumbs links={breadcrumbLinks} />
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
        // Ab hum saaf suthri, unique categories ki list aagey bhej rahe hain
        dealCategories={uniqueDealCategories}
      />
    </div>
  );
}
