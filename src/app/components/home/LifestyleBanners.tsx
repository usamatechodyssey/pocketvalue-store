// app/components/home/LifestyleBanners.tsx (YOUR DESKTOP DESIGN RESTORED)

import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { LIFESTYLE_BANNERS_QUERY } from "@/sanity/lib/queries";
import type { LifestyleBanner } from "@/sanity/types/product_types";
import { BannerMedia } from "./BannerMedia";

// BannerCard Component (Polished)
const BannerCard = ({
  banner,
  className,
}: {
  banner: LifestyleBanner;
  className?: string;
}) => {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-xl shadow-lg ${className}`}
    >
      {/* Media Layer */}
      <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105">
        <BannerMedia banner={banner} />
      </div>
      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/70" /> 
      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col items-start justify-end p-6 text-left text-white">
        <h3 className="text-2xl font-bold md:text-3xl tracking-tight drop-shadow-lg">{banner.title}</h3>
        {banner.subtitle && (
          <p className="mt-2 text-sm md:text-base max-w-prose drop-shadow">
            {banner.subtitle}
          </p>
        )}
        {banner.link && (
          <Link
            href={banner.link}
            className="mt-4 inline-block rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-brand-primary-hover hover:scale-105 hover:shadow-xl"
          >
            {banner.buttonText || "Explore Now"}
          </Link>
        )}
      </div>
    </div>
  );
};

// Main Component (Fully Responsive with Your Asymmetrical Layout)
export default async function LifestyleBanners() {
  const banners = await client.fetch<LifestyleBanner[]>(
    LIFESTYLE_BANNERS_QUERY
  );

  if (!banners || banners.length === 0) {
    return null;
  }
  
  const mainBanner = banners[0];
  // Agar 3 se kam banners hon, to secondary array khali ho jayega
  const secondaryBanners = banners.length >= 3 ? banners.slice(1, 3) : banners.slice(1, 2);

  return (
    <section className="w-full brand-gradient-bg dark:bg-gray-900/50 py-12 md:py-16">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">
            For Your Lifestyle
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-text-secondary dark:text-gray-300">
            Inspiration and gear for your home, travel, and adventures.
          </p>
        </div>

        {/* === THE FULLY RESPONSIVE GRID (YOUR DESKTOP DESIGN RESTORED) === */}
        {/* Mobile: Simple 1-column stack. Desktop: Your 3-col, 2-row asymmetrical grid. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-2 lg:gap-8">
          
          {/* Main Banner (Bara wala) */}
          {/* 'lg:col-span-2 lg:row-span-2' sirf large screens par apply hoga */}
          <div className="lg:col-span-2 lg:row-span-2">
            {/* Mobile par 16:9, Desktop par bhi 16:9 ratio */}
            <BannerCard banner={mainBanner} className="aspect-video h-full" />
          </div>

          {/* Secondary Banners (Chotay walay) */}
          {/* Yeh 2 banners mobile par main banner ke neeche aayenge, aur desktop par right side aamne-saamne */}
          {secondaryBanners.map((banner) => (
            <div key={banner._id} className="lg:col-span-1">
              {/* Mobile par 16:9, Desktop par bhi 16:9 ratio, h-full se height barabar hogi */}
              <BannerCard banner={banner} className="aspect-video h-full" />
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}