// import { client } from "@/sanity/lib/client";
// import {
//   HERO_CAROUSEL_QUERY,
//   HOMEPAGE_DATA_QUERY,
//   PROMO_BANNERS_QUERY,
//   INSTAGRAM_QUERY,
//   getTopBrands,
// } from "@/sanity/lib/queries";
// import { HeroCarouselSlide } from "@/sanity/types/carouselTypes";
// import SanityProduct from "@/sanity/types/product_types";
// import { FLASH_SALE_QUERY } from "@/sanity/lib/queries"; // Nayi query import karein
// import { FlashSaleData } from "@/sanity/types/product_types"; // Nayi type import karein
// import HeroCarousel from "../components/home/Hero Carousel Slider";
// import FeaturedProduct from "../components/home/ProductCarousel";
// import TripleBanner from "../components/home/TripleBanner";
// import DealOfTheDay from "../components/home/DealOfTheDay";
// import BrandShowcase from "@/app/components/home/BrandShowcase";
// import TrustBar from "../components/home/TrustBar";
// import InstagramWall from "../components/home/InstagramWall";
// import LifestyleBanners from "@/app/components/home/LifestyleBanners";
// import Coupon from "../components/ui/Coupon";
// import FeaturedCategoryGrid from "../components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "../components/home/CategoryShowcase";
// import FlashSaleSection from "../components/home/FlashSaleSection";
// import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
// import { getPaginatedProducts } from "@/sanity/lib/queries";
// const BATCH_SIZE = 10;
// export default async function Home() {
//   const [banners, homepageData, promoBanners, instagramData, topBrands] =
//     await Promise.all([
//       client.fetch(HERO_CAROUSEL_QUERY),
//       client.fetch(HOMEPAGE_DATA_QUERY),
//       client.fetch(PROMO_BANNERS_QUERY),
//       client.fetch(INSTAGRAM_QUERY),
//       getTopBrands(),
//     ]);

//   const featuredCategoriesData = homepageData?.featuredCategoriesData;
//   const sectionBanners = homepageData?.sectionBanners || [];
//   const initialGridProducts = await getPaginatedProducts(1, BATCH_SIZE);
//   const flashSaleData = await client.fetch<FlashSaleData | null>(
//     FLASH_SALE_QUERY
//   );
//   return (
//     <main className="w-full items-center">
//       {/* ✅ Hero Carousel with no padding */}
//       <div className="w-full pl-4 pr-4 mt-8 mb-4">
//         <HeroCarousel banners={banners} />
//       </div>
//       <Coupon />
//       {/* ✅ Rest content with padding */}
//       <div className="px-4 sm:px-6 md:px-8">
//         {featuredCategoriesData?.featuredCategories?.length > 0 && (
//           <CategoryShowcase
//             title={featuredCategoriesData.featuredCategoriesTitle}
//             categories={featuredCategoriesData.featuredCategories}
//           />
//         )}
//         <FlashSaleSection data={flashSaleData} />
//         {homepageData?.newArrivals && homepageData.newArrivals.length > 0 && (
//           <FeaturedProduct
//             title={homepageData.newArrivalsTitle || "New Arrivals"}
//             products={homepageData.newArrivals}
//             banner={sectionBanners.find((b) => b.tag === "new-arrivals")}
//           />
//         )}
//         {/* <ImageGallery /> */}
//         <DealOfTheDay />
//         {/* Best Sellers Section */}
//         {homepageData?.bestSellers && homepageData.bestSellers.length > 0 && (
//           <FeaturedProduct
//             title={homepageData.bestSellersTitle || "Best Sellers"}
//             products={homepageData.bestSellers}
//             banner={sectionBanners.find((b) => b.tag === "best-sellers")}
//           />
//         )}
//         {/* Featured Products Section */}
//         {homepageData?.featuredProducts &&
//           homepageData.featuredProducts.length > 0 && (
//             <FeaturedProduct
//               title={homepageData.featuredProductsTitle || "Featured Products"}
//               products={homepageData.featuredProducts}
//               banner={sectionBanners.find((b) => b.tag === "featured-products")}
//             />
//           )}
//         {/* Section 2: Naya, bara, Myntra-style grid */}
//         {featuredCategoriesData?.categoryGrid?.length > 0 && (
//           <FeaturedCategoryGrid
//             title={featuredCategoriesData.categoryGridTitle}
//             categories={featuredCategoriesData.categoryGrid}
//           />
//         )}
//         {/* <ShopByBrand /> */}
//         <BrandShowcase brands={topBrands} />
//         <InstagramWall data={instagramData} />
//         {/* The Final Section */}
//         <TripleBanner banners={promoBanners} />
//         {/* <Flashsale /> */}
//         <LifestyleBanners />
//         <InfiniteProductGrid initialProducts={initialGridProducts} />
//         <TrustBar />
//       </div>
//     </main>
//   );
// }
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import {
  HOMEPAGE_DATA_QUERY,
  PROMO_BANNERS_QUERY,
  INSTAGRAM_QUERY,
  getTopBrands,
  FLASH_SALE_QUERY,
  getPaginatedProducts,
} from "@/sanity/lib/queries";
import { FlashSaleData, SanityImageObject } from "@/sanity/types/product_types";

// === UPDATED IMPORTS ===
import HeroSection from "./components/home/HeroSection"; 
import HeroSkeleton from "./components/home/HeroSkeleton"; // <-- NAYA IMPORT (Alag File wala)
import ProductCarousel from "./components/home/ProductCarousel";
import TripleBanner from "./components/home/TripleBanner";
import DealOfTheDay from "./components/home/DealOfTheDay";
import InstagramWall from "./components/home/InstagramWall";
import Coupon from "./components/ui/Coupon";
import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
import CategoryShowcase from "./components/home/CategoryShowcase";
import FlashSaleSection from "./components/home/FlashSaleSection";
import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
import LifestyleBanners from "./components/home/LifestyleBanners";
import BrandShowcase from "./components/home/BrandShowcase";
import { generateBaseMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateBaseMetadata({
    path: "/", 
  });
}

interface SectionBanner {
  tag: string;
  bannerImage: SanityImageObject;
}

const BATCH_SIZE = 12;

export default async function Home() {
  const [
    homepageData,
    promoBanners,
    instagramData,
    topBrands,
    flashSaleData,
    initialGridProducts,
  ] = await Promise.all([
    client.fetch(HOMEPAGE_DATA_QUERY),
    client.fetch(PROMO_BANNERS_QUERY),
    client.fetch(INSTAGRAM_QUERY),
    getTopBrands(),
    client.fetch<FlashSaleData | null>(FLASH_SALE_QUERY),
    getPaginatedProducts(1, BATCH_SIZE),
  ]);

  const featuredCategoriesData = homepageData?.featuredCategoriesData;
  const sectionBanners: SectionBanner[] = homepageData?.sectionBanners || [];

  return (
    <main className="w-full flex flex-col items-center bg-white dark:bg-gray-950 overflow-x-hidden">
      
      {/* === HERO SECTION with NEW SKELETON === */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* === REST OF CONTENT === */}
      <div className="w-full space-y-12 md:space-y-20 pt-6 md:pt-10">
        
        <div className="px-0 md:px-4 lg:px-8 w-full max-w-[1920px] mx-auto">
           <Coupon />
        </div>

        {featuredCategoriesData?.featuredCategories?.length > 0 && (
          <CategoryShowcase
            title={featuredCategoriesData.featuredCategoriesTitle}
            categories={featuredCategoriesData.featuredCategories}
          />
        )}

        <FlashSaleSection data={flashSaleData} />

        {homepageData?.newArrivals?.length > 0 && (
          <ProductCarousel
            title={homepageData.newArrivalsTitle || "New Arrivals"}
            products={homepageData.newArrivals}
            banner={sectionBanners.find(
              (b: SectionBanner) => b.tag === "new-arrivals"
            )}
          />
        )}

        <LifestyleBanners />

        <DealOfTheDay />

        {homepageData?.bestSellers?.length > 0 && (
          <ProductCarousel
            title={homepageData.bestSellersTitle || "Best Sellers"}
            products={homepageData.bestSellers}
            banner={sectionBanners.find(
              (b: SectionBanner) => b.tag === "best-sellers"
            )}
          />
        )}

        <div className="px-4 md:px-8 w-full max-w-[1920px] mx-auto">
            <TripleBanner banners={promoBanners} />
        </div>

        {homepageData?.featuredProducts?.length > 0 && (
          <ProductCarousel
            title={homepageData.featuredProductsTitle || "Featured Products"}
            products={homepageData.featuredProducts}
            banner={sectionBanners.find(
              (b: SectionBanner) => b.tag === "featured-products"
            )}
          />
        )}

        <BrandShowcase brands={topBrands} />

        {featuredCategoriesData?.categoryGrid?.length > 0 && (
          <FeaturedCategoryGrid
            title={featuredCategoriesData.categoryGridTitle}
            categories={featuredCategoriesData.categoryGrid}
          />
        )}

        <InstagramWall data={instagramData} />

        <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
            <InfiniteProductGrid initialProducts={initialGridProducts} />
        </div>
      </div>
    </main>
  );
}
// /src/app/(main)/page.tsx (FINAL POLISHED CODE)

// import { client } from "@/sanity/lib/client";
// import {
//   HERO_CAROUSEL_QUERY,
//   HOMEPAGE_DATA_QUERY,
//   PROMO_BANNERS_QUERY,
//   INSTAGRAM_QUERY,
//   getTopBrands,
//   FLASH_SALE_QUERY,
//   getPaginatedProducts,
// } from "@/sanity/lib/queries";
// import { FlashSaleData, SanityImageObject } from "@/sanity/types/product_types";

// // Import all homepage components
// import HeroCarousel from "./components/home/Hero Carousel Slider";
// import ProductCarousel from "./components/home/ProductCarousel";
// import TripleBanner from "./components/home/TripleBanner";
// import DealOfTheDay from "./components/home/DealOfTheDay";
// import InstagramWall from "./components/home/InstagramWall";
// import Coupon from "./components/ui/Coupon";
// import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "./components/home/CategoryShowcase";
// import FlashSaleSection from "./components/home/FlashSaleSection";
// import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
// import { generateBaseMetadata } from "@/utils/metadata";
// import type { Metadata } from "next";

// // --- Dynamic metadata for the homepage ---
// export async function generateMetadata(): Promise<Metadata> {
//   return generateBaseMetadata({
//     path: "/", // Canonical path for the homepage
//   });
// }

// interface SectionBanner {
//   tag: string;
//   bannerImage: SanityImageObject;
// }

// const BATCH_SIZE = 10;

// export default async function Home() {
//   const [
//     banners,
//     homepageData,
//     promoBanners,
//     instagramData,
//     topBrands,
//     flashSaleData,
//     initialGridProducts,
//   ] = await Promise.all([
//     client.fetch(HERO_CAROUSEL_QUERY),
//     client.fetch(HOMEPAGE_DATA_QUERY),
//     client.fetch(PROMO_BANNERS_QUERY),
//     client.fetch(INSTAGRAM_QUERY),
//     getTopBrands(),
//     client.fetch<FlashSaleData | null>(FLASH_SALE_QUERY),
//     getPaginatedProducts(1, BATCH_SIZE),
//   ]);

//   const featuredCategoriesData = homepageData?.featuredCategoriesData;
//   const sectionBanners: SectionBanner[] = homepageData?.sectionBanners || [];

//   return (
//     <main className="w-full flex flex-col items-center">
//       {/* HeroCarousel is full-width, so it has its own padding control */}
//       <HeroCarousel banners={banners} />

//       {/* --- THE DEFINITIVE FIX IS HERE --- */}
//       {/* This single div will now control the padding and spacing for ALL sections below the hero banner. */}
//       <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 md:space-y-16 lg:space-y-20">
//         <Coupon />

//         {featuredCategoriesData?.featuredCategories?.length > 0 && (
//           <CategoryShowcase
//             title={featuredCategoriesData.featuredCategoriesTitle}
//             categories={featuredCategoriesData.featuredCategories}
//           />
//         )}

//         <FlashSaleSection data={flashSaleData} />

//         {homepageData?.newArrivals?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.newArrivalsTitle || "New Arrivals"}
//             products={homepageData.newArrivals}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "new-arrivals"
//             )}
//           />
//         )}

//         <DealOfTheDay />

//         {homepageData?.bestSellers?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.bestSellersTitle || "Best Sellers"}
//             products={homepageData.bestSellers}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "best-sellers"
//             )}
//           />
//         )}

//         {homepageData?.featuredProducts?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.featuredProductsTitle || "Featured Products"}
//             products={homepageData.featuredProducts}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "featured-products"
//             )}
//           />
//         )}

//         {featuredCategoriesData?.categoryGrid?.length > 0 && (
//           <FeaturedCategoryGrid
//             title={featuredCategoriesData.categoryGridTitle}
//             categories={featuredCategoriesData.categoryGrid}
//           />
//         )}

//         <InstagramWall data={instagramData} />

//         <TripleBanner banners={promoBanners} />

//         <InfiniteProductGrid initialProducts={initialGridProducts} />
//       </div>
//     </main>
//   );
// }

// --- SUMMARY OF CHANGES ---
// - Imported the `generateBaseMetadata` utility and `Metadata` type.
// - Added an `async function generateMetadata()` that calls our central utility to set the root SEO metadata for the site.

// import { client } from "@/sanity/lib/client";
// import {
//   HERO_CAROUSEL_QUERY,
//   HOMEPAGE_DATA_QUERY,
//   PROMO_BANNERS_QUERY,
//   INSTAGRAM_QUERY,
//   getTopBrands,
//   FLASH_SALE_QUERY,
//   getPaginatedProducts,
// } from "@/sanity/lib/queries";
// import { FlashSaleData } from "@/sanity/types/product_types";

// import HeroCarousel from "./components/home/Hero Carousel Slider";
// import ProductCarousel from "./components/home/ProductCarousel";
// import TripleBanner from "./components/home/TripleBanner";
// import DealOfTheDay from "./components/home/DealOfTheDay";
// import InstagramWall from "./components/home/InstagramWall";
// import Coupon from "./components/ui/Coupon";
// import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "./components/home/CategoryShowcase";
// import FlashSaleSection from "./components/home/FlashSaleSection";
// import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
// // import SentryTestButton from "./components/ui/SentryTestButton";

// const BATCH_SIZE = 10;

// export default async function Home() {
//   const [
//     banners,
//     homepageData,
//     promoBanners,
//     instagramData,
//     topBrands,
//     flashSaleData,
//     initialGridProducts,
//   ] = await Promise.all([
//     client.fetch(HERO_CAROUSEL_QUERY),
//     client.fetch(HOMEPAGE_DATA_QUERY),
//     client.fetch(PROMO_BANNERS_QUERY),
//     client.fetch(INSTAGRAM_QUERY),
//     getTopBrands(),
//     client.fetch<FlashSaleData | null>(FLASH_SALE_QUERY),
//     getPaginatedProducts(1, BATCH_SIZE),
//   ]);

//   const featuredCategoriesData = homepageData?.featuredCategoriesData;
//   const sectionBanners = homepageData?.sectionBanners || [];

//   return (
//     // Main container full-width hai
//     <main className="w-full">
//       {/* Sentry Test Button (Temporary) */}
//       {/* We place it at the top for easy access during testing. */}
//       {/* It will only render in development mode. */}
//       {/* <SentryTestButton /> */}
//       {/* Hero Carousel - full width */}
//       <div className="w-full mt-8 mb-4">
//         <HeroCarousel banners={banners} />
//       </div>

//       {/* Coupon Banner - container ke andar */}
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <Coupon />
//       </div>

//       {/* --- FINAL FIX IS HERE: `container mx-auto` is removed from this div --- */}
//       {/* Ab har section apni width khud control karega */}
//       <div className="w-full px-4 sm:px-6 lg:px-8">
//         {featuredCategoriesData?.featuredCategories?.length > 0 && (
//           <CategoryShowcase
//             title={featuredCategoriesData.featuredCategoriesTitle}
//             categories={featuredCategoriesData.featuredCategories}
//           />
//         )}

//         <FlashSaleSection data={flashSaleData} />

//         {homepageData?.newArrivals?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.newArrivalsTitle || "New Arrivals"}
//             products={homepageData.newArrivals}
//             banner={sectionBanners.find((b) => b.tag === "new-arrivals")}
//           />
//         )}

//         <DealOfTheDay />

//         {homepageData?.bestSellers?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.bestSellersTitle || "Best Sellers"}
//             products={homepageData.bestSellers}
//             banner={sectionBanners.find((b) => b.tag === "best-sellers")}
//           />
//         )}

//         {homepageData?.featuredProducts?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.featuredProductsTitle || "Featured Products"}
//             products={homepageData.featuredProducts}
//             banner={sectionBanners.find((b) => b.tag === "featured-products")}
//           />
//         )}

//         {featuredCategoriesData?.categoryGrid?.length > 0 && (
//           <FeaturedCategoryGrid
//             title={featuredCategoriesData.categoryGridTitle}
//             categories={featuredCategoriesData.categoryGrid}
//           />
//         )}

//         <InstagramWall data={instagramData} />

//         {/* TripleBanner ko alag se container denge taake woh a_chi tarah align ho */}
//         <div className="container mx-auto">
//           <TripleBanner banners={promoBanners} />
//         </div>

//         <InfiniteProductGrid initialProducts={initialGridProducts} />
//       </div>
//     </main>
//   );
// }
