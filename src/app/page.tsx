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
// import { Suspense } from "react";
// import { client } from "@/sanity/lib/client";
// import {
//   HOMEPAGE_DATA_QUERY,
//   PROMO_BANNERS_QUERY,
//   INSTAGRAM_QUERY,
//   getTopBrands,
//   FLASH_SALE_QUERY,
//   getPaginatedProducts,
// } from "@/sanity/lib/queries";
// import { FlashSaleData, SanityImageObject } from "@/sanity/types/product_types";

// // === UPDATED IMPORTS ===
// import HeroSection from "./components/home/HeroSection"; 
// import HeroSkeleton from "./components/home/HeroSkeleton"; // <-- NAYA IMPORT (Alag File wala)
// import ProductCarousel from "./components/home/ProductCarousel";
// import TripleBanner from "./components/home/TripleBanner";
// import DealOfTheDay from "./components/home/DealOfTheDay";
// import InstagramWall from "./components/home/InstagramWall";
// import Coupon from "./components/ui/Coupon";
// import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "./components/home/CategoryShowcase";
// import FlashSaleSection from "./components/home/FlashSaleSection";
// import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
// import LifestyleBanners from "./components/home/LifestyleBanners";
// import BrandShowcase from "./components/home/BrandShowcase";
// import { generateBaseMetadata } from "@/utils/metadata";
// import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   return generateBaseMetadata({
//     path: "/", 
//   });
// }

// interface SectionBanner {
//   tag: string;
//   bannerImage: SanityImageObject;
// }

// const BATCH_SIZE = 12;

// export default async function Home() {
//   const [
//     homepageData,
//     promoBanners,
//     instagramData,
//     topBrands,
//     flashSaleData,
//     initialGridProducts,
//   ] = await Promise.all([
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
//     <main className="w-full flex flex-col items-center bg-white dark:bg-gray-950 overflow-x-hidden">
      
//       {/* === HERO SECTION with NEW SKELETON === */}
//       <Suspense fallback={<HeroSkeleton />}>
//         <HeroSection />
//       </Suspense>

//       {/* === REST OF CONTENT === */}
//       <div className="w-full space-y-12 md:space-y-20 pt-6 md:pt-10">
        
//         <div className="px-0 md:px-4 lg:px-8 w-full max-w-[1920px] mx-auto">
//            <Coupon />
//         </div>

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

//         <LifestyleBanners />

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

//         <div className="px-4 md:px-8 w-full max-w-[1920px] mx-auto">
//             <TripleBanner banners={promoBanners} />
//         </div>

//         {homepageData?.featuredProducts?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.featuredProductsTitle || "Featured Products"}
//             products={homepageData.featuredProducts}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "featured-products"
//             )}
//           />
//         )}

//         <BrandShowcase brands={topBrands} />

//         {featuredCategoriesData?.categoryGrid?.length > 0 && (
//           <FeaturedCategoryGrid
//             title={featuredCategoriesData.categoryGridTitle}
//             categories={featuredCategoriesData.categoryGrid}
//           />
//         )}

//         <InstagramWall data={instagramData} />

//         <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
//             <InfiniteProductGrid initialProducts={initialGridProducts} />
//         </div>
//       </div>
//     </main>
//   );
// }
// import { Suspense } from "react";
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

// // === IMPORTS ===
// import HeroSection from "./components/home/HeroSection"; 
// import HeroSkeleton from "./components/home/HeroSkeleton";
// // 🔥 NEW: BUILDER RENDERER
// import RenderSection from "./components/home/builder/RenderSection";

// // Legacy Imports (Backup)
// import ProductCarousel from "./components/home/ProductCarousel";
// import TripleBanner from "./components/home/TripleBanner";
// import DealOfTheDay from "./components/home/DealOfTheDay";
// import InstagramWall from "./components/home/InstagramWall";
// import Coupon from "./components/ui/Coupon";
// import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "./components/home/CategoryShowcase";
// import FlashSaleSection from "./components/home/FlashSaleSection";
// import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";
// import LifestyleBanners from "./components/home/LifestyleBanners";
// import BrandShowcase from "./components/home/BrandShowcase";
// import { generateBaseMetadata } from "@/utils/metadata";
// import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   return generateBaseMetadata({
//     path: "/", 
//   });
// }

// interface SectionBanner {
//   tag: string;
//   bannerImage: SanityImageObject;
// }

// const BATCH_SIZE = 12;

// export default async function Home() {
//   const [
//     homepageData,
//     promoBanners,
//     instagramData,
//     topBrands,
//     flashSaleData,
//     initialGridProducts,
//   ] = await Promise.all([
//     client.fetch(HOMEPAGE_DATA_QUERY),
//     client.fetch(PROMO_BANNERS_QUERY),
//     client.fetch(INSTAGRAM_QUERY),
//     getTopBrands(),
//     client.fetch<FlashSaleData | null>(FLASH_SALE_QUERY),
//     getPaginatedProducts(1, BATCH_SIZE),
//   ]);

//   // Extract Data
//   const pageSections = homepageData?.pageSections || [];
//   const featuredCategoriesData = homepageData?.featuredCategoriesData;
//   const sectionBanners: SectionBanner[] = homepageData?.sectionBanners || [];

//   return (
//     <main className="w-full flex flex-col items-center bg-white dark:bg-gray-950 overflow-x-hidden">
      
//       {/* === 1. FIXED HERO SECTION === */}
//       <Suspense fallback={<HeroSkeleton />}>
//         <HeroSection />
//       </Suspense>

//       <div className="w-full space-y-12 md:space-y-20 pt-6 md:pt-10">
        
//         {/* Coupon (Global) */}
//         <div className="px-0 md:px-4 lg:px-8 w-full max-w-[1920px] mx-auto">
//            <Coupon />
//         </div>

//         {/* === 2. DYNAMIC PAGE BUILDER SECTIONS (THE FUTURE) === */}
//         {/* Sanity se jo bhi drag-drop karenge wo yahan render hoga */}
//         {pageSections.length > 0 && (
//             <div className="flex flex-col gap-12 md:gap-20 w-full">
//                 {pageSections.map((section: any) => (
//                     <RenderSection key={section._key} section={section} />
//                 ))}
//             </div>
//         )}

//         {/* ========================================================== */}
//         {/* === 3. LEGACY SECTIONS (BACKUP CONTENT) === */}
//         {/* Jab aap Page Builder use karna shuru karenge, inhein hata sakte hain */}
//         {/* ========================================================== */}

//         {/* Categories */}
//         {featuredCategoriesData?.featuredCategories?.length > 0 && (
//           <CategoryShowcase
//             title={featuredCategoriesData.featuredCategoriesTitle}
//             categories={featuredCategoriesData.featuredCategories}
//           />
//         )}

//         {/* Flash Sale (Legacy) */}
//         <FlashSaleSection data={flashSaleData} />

//         {/* New Arrivals (Legacy) */}
//         {homepageData?.newArrivals?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.newArrivalsTitle || "New Arrivals"}
//             products={homepageData.newArrivals}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "new-arrivals"
//             )}
//           />
//         )}

//         {/* Lifestyle Banners (Legacy) */}
//         <LifestyleBanners />

//         {/* Deal of the Day (Legacy) */}
//         <DealOfTheDay />

//         {/* Best Sellers (Legacy) */}
//         {homepageData?.bestSellers?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.bestSellersTitle || "Best Sellers"}
//             products={homepageData.bestSellers}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "best-sellers"
//             )}
//           />
//         )}

//         {/* Promo Grid (Legacy) */}
//         <div className="px-4 md:px-8 w-full max-w-[1920px] mx-auto">
//             <TripleBanner banners={promoBanners} />
//         </div>

//         {/* Featured Products (Legacy) */}
//         {homepageData?.featuredProducts?.length > 0 && (
//           <ProductCarousel
//             title={homepageData.featuredProductsTitle || "Featured Products"}
//             products={homepageData.featuredProducts}
//             banner={sectionBanners.find(
//               (b: SectionBanner) => b.tag === "featured-products"
//             )}
//           />
//         )}

//         {/* Static Brand & Category Grid */}
//         <BrandShowcase brands={topBrands} />

//         {featuredCategoriesData?.categoryGrid?.length > 0 && (
//           <FeaturedCategoryGrid
//             title={featuredCategoriesData.categoryGridTitle}
//             categories={featuredCategoriesData.categoryGrid}
//           />
//         )}

//         <InstagramWall data={instagramData} />

//         {/* Infinite Scroll */}
//         <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
//             <InfiniteProductGrid initialProducts={initialGridProducts} />
//         </div>
//       </div>
//     </main>
//   );
// }
// import { Suspense } from "react";
// import { client } from "@/sanity/lib/client";
// import { HOMEPAGE_DATA_QUERY } from "@/sanity/lib/queries";

// // Components
// import HeroSection from "./components/home/HeroSection"; 
// import HeroSkeleton from "./components/home/HeroSkeleton";
// import RenderSection from "./components/home/builder/RenderSection";

// // Metadata
// import { generateBaseMetadata } from "@/utils/metadata";
// import type { Metadata } from "next";

// export async function generateMetadata(): Promise<Metadata> {
//   return generateBaseMetadata({
//     path: "/", 
//   });
// }

// export default async function Home() {
//   // Fetch Page Builder Data
//   const homepageData = await client.fetch(HOMEPAGE_DATA_QUERY);
//   const pageSections = homepageData?.pageSections || [];

//   return (
//     <main className="w-full flex flex-col items-center bg-white dark:bg-gray-950 min-h-screen">
      
//       {/* === 1. HERO SECTION (Priority Loading) === */}
//       {/* Suspense is good for streaming, ensures User sees skeleton while data fetches */}
//       <Suspense fallback={<HeroSkeleton />}>
//         <HeroSection />
//       </Suspense>

//       {/* === 2. DYNAMIC SECTIONS === */}
//       {/* Gap hata diya hai kyunke components mein internal padding hai */}
//       <div className="w-full flex flex-col">
//           {pageSections.length > 0 ? (
//              pageSections.map((section: any) => (
//                 <RenderSection key={section._key} section={section} />
//              ))
//           ) : (
//              // Fallback for empty Sanity setup
//              <div className="text-center py-32 text-gray-400 bg-gray-50 dark:bg-gray-900 w-full">
//                 <p>Content not configured in Sanity CMS.</p>
//              </div>
//           )}
//       </div>

//     </main>
//   );
// }
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { HOMEPAGE_DATA_QUERY } from "@/sanity/lib/queries";

// Components
import HeroSection from "./components/home/HeroSection"; 
import HeroSkeleton from "./components/home/HeroSkeleton";
import RenderSection from "./components/home/builder/RenderSection";

// Metadata
import { generateBaseMetadata } from "@/utils/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateBaseMetadata({
    path: "/", 
  });
}

// === THE CLEANEST PAGE EVER ===
export default async function Home() {
  // 1. Fetch Only Essential Data
  const homepageData = await client.fetch(HOMEPAGE_DATA_QUERY);
  const pageSections = homepageData?.pageSections || [];

  return (
    <main className="w-full flex flex-col items-center bg-white dark:bg-gray-950 overflow-x-hidden">
      
      {/* === 1. HERO (ALWAYS ON TOP) === */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* === 2. DYNAMIC BUILDER (THE MAGIC) === */}
      {/* Ab aap Sanity se jo chaho jahan chaho laga sakte ho */}
      <div className="w-full">
          {pageSections.length > 0 ? (
             <div className="flex flex-col w-full">
                {pageSections.map((section: any) => (
                    <RenderSection key={section._key} section={section} />
                ))}
             </div>
          ) : (
             // Empty State (Sirf tab dikhega agar Sanity khali ho)
             <div className="text-center py-20 text-gray-400">
                Homepage content not set. Please configure via Sanity Page Builder.
             </div>
          )}
      </div>

    </main>
  );
}