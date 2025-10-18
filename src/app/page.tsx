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
// import HeroCarousel from "./components/home/Hero Carousel Slider";
// import FeaturedProduct from "./components/home/ProductCarousel";
// import TripleBanner from "./components/home/TripleBanner";
// import DealOfTheDay from "./components/home/DealOfTheDay";
// import BrandShowcase from "@/app/components/home/BrandShowcase";
// import TrustBar from "./components/home/TrustBar";
// import InstagramWall from "./components/home/InstagramWall";
// import LifestyleBanners from "@/app/components/home/LifestyleBanners";
// import Coupon from "./components/ui/Coupon";
// import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
// import CategoryShowcase from "./components/home/CategoryShowcase";
// import FlashSaleSection from "./components/home/FlashSaleSection";
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
//         {/* // <BrandShowcase brands={topBrands} /> */}
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
import { client } from "@/sanity/lib/client";
import {
  HERO_CAROUSEL_QUERY,
  HOMEPAGE_DATA_QUERY,
  PROMO_BANNERS_QUERY,
  INSTAGRAM_QUERY,
  getTopBrands,
  FLASH_SALE_QUERY,
  getPaginatedProducts,
} from "@/sanity/lib/queries";
import { FlashSaleData } from "@/sanity/types/product_types";

import HeroCarousel from "./components/home/Hero Carousel Slider";
import ProductCarousel from "./components/home/ProductCarousel";
import TripleBanner from "./components/home/TripleBanner";
import DealOfTheDay from "./components/home/DealOfTheDay";
import InstagramWall from "./components/home/InstagramWall";
import Coupon from "./components/ui/Coupon";
import FeaturedCategoryGrid from "./components/home/FeaturedCategoryGrid";
import CategoryShowcase from "./components/home/CategoryShowcase";
import FlashSaleSection from "./components/home/FlashSaleSection";
import InfiniteProductGrid from "@/app/components/home/InfiniteProductGrid";

const BATCH_SIZE = 10;

export default async function Home() {
  const [
    banners,
    homepageData,
    promoBanners,
    instagramData,
    topBrands,
    flashSaleData,
    initialGridProducts,
  ] = await Promise.all([
    client.fetch(HERO_CAROUSEL_QUERY),
    client.fetch(HOMEPAGE_DATA_QUERY),
    client.fetch(PROMO_BANNERS_QUERY),
    client.fetch(INSTAGRAM_QUERY),
    getTopBrands(),
    client.fetch<FlashSaleData | null>(FLASH_SALE_QUERY),
    getPaginatedProducts(1, BATCH_SIZE),
  ]);

  const featuredCategoriesData = homepageData?.featuredCategoriesData;
  const sectionBanners = homepageData?.sectionBanners || [];

  return (
    // Main container full-width hai
    <main className="w-full">
      {/* Hero Carousel - full width */}
      <div className="w-full mt-8 mb-4">
        <HeroCarousel banners={banners} />
      </div>

      {/* Coupon Banner - container ke andar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Coupon />
      </div>

      {/* --- FINAL FIX IS HERE: `container mx-auto` is removed from this div --- */}
      {/* Ab har section apni width khud control karega */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
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
            banner={sectionBanners.find((b) => b.tag === "new-arrivals")}
          />
        )}

        <DealOfTheDay />

        {homepageData?.bestSellers?.length > 0 && (
          <ProductCarousel
            title={homepageData.bestSellersTitle || "Best Sellers"}
            products={homepageData.bestSellers}
            banner={sectionBanners.find((b) => b.tag === "best-sellers")}
          />
        )}

        {homepageData?.featuredProducts?.length > 0 && (
          <ProductCarousel
            title={homepageData.featuredProductsTitle || "Featured Products"}
            products={homepageData.featuredProducts}
            banner={sectionBanners.find((b) => b.tag === "featured-products")}
          />
        )}

        {featuredCategoriesData?.categoryGrid?.length > 0 && (
          <FeaturedCategoryGrid
            title={featuredCategoriesData.categoryGridTitle}
            categories={featuredCategoriesData.categoryGrid}
          />
        )}

        <InstagramWall data={instagramData} />

        {/* TripleBanner ko alag se container denge taake woh a_chi tarah align ho */}
        <div className="container mx-auto">
          <TripleBanner banners={promoBanners} />
        </div>

        <InfiniteProductGrid initialProducts={initialGridProducts} />
      </div>
    </main>
  );
}
