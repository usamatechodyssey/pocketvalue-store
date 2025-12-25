import { client } from "@/sanity/lib/client";
import { GET_CAMPAIGN_DATA } from "@/sanity/lib/queries";
import ProductListingClient from "@/app/components/category/ProductListingClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

// Type Definition Update
type PageProps = {
  params: Promise<{ slug: string }>; // 🔥 Params is now a Promise
};

// Metadata generator (Async Await Added)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // 🔥 Await here
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} - PocketValue Deals`,
    description: `Exclusive offers for ${slug}`,
  };
}

export default async function CampaignPage({ params }: PageProps) {
  // 🔥 Unwrap Params here
  const { slug } = await params;
  
  // Fetch Campaign Data
  const data = await client.fetch(GET_CAMPAIGN_DATA, { slug });

  if (!data) return notFound();

  const { title, description, banner, products, filterData, totalCount } = data;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      
      {/* === CAMPAIGN BANNER HEADER === */}
      <div className="relative w-full h-[200px] md:h-[300px] bg-gray-800 flex items-center justify-center overflow-hidden">
        {banner ? (
            <Image src={banner} alt={title} fill className="object-cover opacity-60" />
        ) : (
            <div className="absolute inset-0 bg-linear-to-r from-brand-primary to-brand-secondary opacity-90" />
        )}
        <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-clash font-bold text-white drop-shadow-lg uppercase tracking-wide">
                {title}
            </h1>
            {description && <p className="text-white/90 mt-2 text-lg max-w-2xl mx-auto">{description}</p>}
        </div>
      </div>

      {/* === PRODUCT LISTING === */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductListingClient
            initialProducts={products || []}
            filterData={filterData}
            totalCount={totalCount || 0}
            // Context batayega ke ye "Campaign" hai taake API filter sahi kaam kare
            context={{ type: "deals", value: slug }} 
            categoryTree={undefined}
        />
      </div>

    </main>
  );
}