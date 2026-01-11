// "use client";

// import dynamic from "next/dynamic";

// // === DYNAMIC IMPORTS (Performance Optimization) ===
// // Hum inhein dynamic import kar rahe hain taake page load fast ho
// const MasterBannerGrid = dynamic(() => import("./MasterBannerGrid"));
// const UniversalDealSection = dynamic(() => import("./UniversalDealSection"));

// // Reuse Existing Components
// const ProductCarousel = dynamic(() => import("../ProductCarousel"));
// const CategoryCarousel = dynamic(() => import("../CategoryCarousel")); // Desktop Carousel
// const MobileCategoryList = dynamic(() => import("../MobileCategoryList")); // Mobile List
// const FeaturedCategoryGrid = dynamic(() => import("../FeaturedCategoryGrid"));
// const BrandShowcase = dynamic(() => import("../BrandShowcase"));
// const Coupon = dynamic(() => import("../../ui/Coupon")); // Adjust path if needed
// const TrustBar = dynamic(() => import("../TrustBar"));
// const FeaturesSection = dynamic(() => import("../FeaturesSection")); // Newsletter
// const InfiniteProductGrid = dynamic(() => import("../InfiniteProductGrid"));

// interface RenderSectionProps {
//   section: any;
// }

// export default function RenderSection({ section }: RenderSectionProps) {
//   if (!section || !section._type) return null;

//   switch (section._type) {
//     // === 1. BANNER GRID ===
//     case "bannerSection":
//       return <MasterBannerGrid {...section} />;

//     // === 2. DEAL SECTION (Universal) ===
//     case "dealSection":
//       return <UniversalDealSection data={section} />;

//     // === 3. PRODUCT SHOWCASE (With Side Banner) ===
//     case "productShowcase":
//       return (
//         <ProductCarousel
//           title={section.title}
//           products={section.products || section.manualProducts} // Products data query se ayega
//           banner={
//             section.showSideBanner
//               ? {
//                   tag: "custom",
//                   bannerImage: section.sideBanner?.image, // Image object pass kar rahe hain
//                   link: section.sideBanner?.link,
//                 }
//               : undefined
//           }
//         />
//       );

//     // === 4. CATEGORY SHOWCASE (Responsive: Mobile vs Desktop) ===
//     case "categoryShowcase":
//       return (
//         <section className="w-full">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 md:px-8 mb-6 md:mb-10 max-w-[1920px] mx-auto">
//             <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
//               {section.title || "Shop by Category"}
//             </h2>
//           </div>
//           {/* Mobile View */}
//           <div className="md:hidden">
//             <MobileCategoryList categories={section.categories} />
//           </div>
//           {/* Desktop View */}
//           <div className="hidden md:block">
//             <CategoryCarousel categories={section.categories} title="" />
//           </div>
//         </section>
//       );

//     // === 5. CATEGORY GRID (Bento) ===
//     case "categoryGrid":
//       return (
//         <FeaturedCategoryGrid
//           title={section.title}
//           categories={section.items} // Ensure query returns 'items' with 'discountText' & 'category'
//         />
//       );

//     // === 6. COUPON SECTION ===
//     case "couponSection":
//       // Note: Coupon component internally fetches data,
//       // but here we might need to pass data if we want it dynamic from Page Builder.
//       // For now, we render the standard Coupon component.
//       // If you want to use the specific coupon selected in Sanity:
//       // You'll need to update Coupon.tsx to accept props.
//       return (
//         <div
//           className={
//             section.fullWidth
//               ? "w-full"
//               : "px-4 md:px-8 w-full max-w-[1920px] mx-auto"
//           }
//         >
//           <Coupon />
//         </div>
//       );

//     // === 7. BRAND SHOWCASE ===
//     case "brandSection":
//       // Agar manual brands hain to wo dikhao, warna null (query auto-fetch handle karegi agar logic likhi ho)
//       // Filhal hum sirf manual brands pass kar rahe hain agar available hon.
//       return <BrandShowcase brands={section.manualBrands} />;

//     // === 8. LAYOUT UTILITIES (FIXED MERGED BLOCK) ===
//     case "layoutSection":
//       // Debugging Log for Layout Section
//       // console.log(`[LayoutSection] Type: ${section.type}`);

//       if (section.type === "trust") return <TrustBar />;

//       if (section.type === "newsletter") return <FeaturesSection />;

//       if (section.type === "infiniteGrid") {
//         // Debugging Log for Products
//         // console.log(`[InfiniteGrid] Products Count: ${section.initialProducts?.length}`);

//         return (
//           <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
//             <InfiniteProductGrid initialProducts={section.initialProducts || []} />
//           </div>
//         );
//       }
//       return null;

//     default:
//       return null;
//   }
// }
// "use client";

// import dynamic from "next/dynamic";

// // Imports
// const MasterBannerGrid = dynamic(() => import("./MasterBannerGrid"));
// const UniversalDealSection = dynamic(() => import("./UniversalDealSection"));
// const ProductCarousel = dynamic(() => import("../ProductCarousel"));
// const CategoryCarousel = dynamic(() => import("../CategoryCarousel"));
// const MobileCategoryList = dynamic(() => import("../MobileCategoryList"));
// const FeaturedCategoryGrid = dynamic(() => import("../FeaturedCategoryGrid"));
// const BrandShowcase = dynamic(() => import("../BrandShowcase"));
// const Coupon = dynamic(() => import("../../ui/Coupon"));
// const TrustBar = dynamic(() => import("../TrustBar"));
// const FeaturesSection = dynamic(() => import("../FeaturesSection"));
// const InfiniteProductGrid = dynamic(() => import("../InfiniteProductGrid"));

// interface RenderSectionProps {
//   section: any;
// }

// export default function RenderSection({ section }: RenderSectionProps) {
//   if (!section || !section._type) return null;

//   switch (section._type) {
//     // === 1. BANNER GRID ===
//     case "bannerSection":
//       return <MasterBannerGrid {...section} />;

//     // === 2. DEAL SECTION (SMART SWITCH) ===
//     case "dealSection":
//       // 🔥 LOGIC: Agar Side Banner ON hai, to 'ProductCarousel' use karo (Zero Spacing wala)
//       if (section.showSideBanner) {
//         return (
//           <ProductCarousel
//             title={section.title}
//             products={section.products}
//             banner={{
//               tag: "custom",
//               bannerImage: section.sideBanner?.image,
//               link: section.sideBanner?.link,
//             }}
//             // Agar deal timer hai to wo header mein dikhane ke liye extra logic yahan ja sakti hai
//           />
//         );
//       }
//       // Warna Normal Grid/Slider wala use karo
//       return <UniversalDealSection data={section} />;

//     // === 3. PRODUCT SHOWCASE (SMART SWITCH) ===
//     case "productShowcase":
//       // 🔥 LOGIC: Agar Side Banner ON hai, to 'ProductCarousel'
//       if (section.showSideBanner) {
//         return (
//           <ProductCarousel
//             title={section.title}
//             products={section.products || section.manualProducts}
//             banner={{
//               tag: "custom",
//               bannerImage: section.sideBanner?.image,
//               link: section.sideBanner?.link,
//             }}
//           />
//         );
//       }
//       // Agar Side Banner nahi hai, to hum isay bhi 'UniversalDealSection' ke through dikha sakte hain
//       // taake Grid/Slider ka option mil jaye aur spacing achi ho.
//       // HACK: Data shape match karne ke liye thoda transform kar rahe hain.
//       return (
//         <UniversalDealSection
//           data={{
//             ...section,
//             fetchStrategy: "manual", // Just to satisfy type
//             viewType: "slider", // Default to slider if no banner
//             backgroundStyle: "white",
//             products: section.products || section.manualProducts,
//           }}
//         />
//       );

//     // ... (Baaki cases same rahenge) ...
//     case "categoryShowcase":
//       return (
//         <section className="w-full">
//           {/* 🔥 FIX: Desktop Title ko center kiya gaya hai */}
//           <div className="hidden md:block text-center  mb-8 px-8 max-w-[1920px] mx-auto">
//              {/* 🔥 FIX: text-3xl ko text-[90px] se badal diya gaya hai */}
//               <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
//                 {section.title || "SHOP BY CATEGORY"}
//               </h2>
//           </div>
//           <div className="md:hidden">
//             <MobileCategoryList categories={section.categories} />
//           </div>
//           <div className="hidden md:block">
//             <CategoryCarousel categories={section.categories} title="" />
//           </div>
//         </section>
//       );

//     case "categoryGrid":
//       return (
//         <FeaturedCategoryGrid
//           title={section.title}
//           categories={section.items}
//         />
//       );

//     case "couponSection":
//       return (
//         <div
//           className={
//             section.fullWidth
//               ? "w-full"
//               : "px-4 md:px-8 pt-8 w-full max-w-[1920px] mx-auto"
//           }
//         >
//           <Coupon data={section} />
//         </div>
//       );

//     case "brandSection":
//       return <BrandShowcase brands={section.manualBrands} />;

//     case "layoutSection":
//       if (section.type === "trust") return <TrustBar />;
//       if (section.type === "newsletter") return <FeaturesSection />;
//       if (section.type === "infiniteGrid") {
//         return (
//           <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
//             <InfiniteProductGrid
//               initialProducts={section.initialProducts || []}
//             />
//           </div>
//         );
//       }
//       return null;

//     default:
//       return null;
//   }
// }
// "use client";

import dynamic from "next/dynamic";

// 🔥 PERFORMANCE FIX 1: MasterBannerGrid ko Direct Import karein (For LCP Speed)
import MasterBannerGrid from "./MasterBannerGrid";

// Baaki sections lazy load hi rahenge (Performance Bachane ke liye)
const UniversalDealSection = dynamic(() => import("./UniversalDealSection"));
const ProductCarousel = dynamic(() => import("../ProductCarousel"));
const CategoryCarousel = dynamic(() => import("../CategoryCarousel"));
const MobileCategoryList = dynamic(() => import("../MobileCategoryList"));
const FeaturedCategoryGrid = dynamic(() => import("../FeaturedCategoryGrid"));
const BrandShowcase = dynamic(() => import("../BrandShowcase"));
const Coupon = dynamic(() => import("../../ui/Coupon"));
const TrustBar = dynamic(() => import("../TrustBar"));
const FeaturesSection = dynamic(() => import("../FeaturesSection"));
const InfiniteProductGrid = dynamic(() => import("../InfiniteProductGrid"));

interface RenderSectionProps {
  section: any;
}

export default function RenderSection({ section }: RenderSectionProps) {
  if (!section || !section._type) return null;

  switch (section._type) {
    // === 1. BANNER GRID ===
    case "bannerSection":
      // Yeh ab foran render hoga bina delay ke
      return <MasterBannerGrid {...section} />;

    // === 2. DEAL SECTION (SMART SWITCH) ===
    case "dealSection":
      if (section.showSideBanner) {
        return (
          <ProductCarousel
            title={section.title}
            products={section.products}
            banner={{
              tag: "custom",
              bannerImage: section.sideBanner?.image,
              link: section.sideBanner?.link,
            }}
          />
        );
      }
      return <UniversalDealSection data={section} />;

    // === 3. PRODUCT SHOWCASE (SMART SWITCH) ===
    case "productShowcase":
      if (section.showSideBanner) {
        return (
          <ProductCarousel
            title={section.title}
            products={section.products || section.manualProducts}
            banner={{
              tag: "custom",
              bannerImage: section.sideBanner?.image,
              link: section.sideBanner?.link,
            }}
          />
        );
      }
      return (
        <UniversalDealSection
          data={{
            ...section,
            fetchStrategy: "manual",
            viewType: "slider",
            backgroundStyle: "white",
            products: section.products || section.manualProducts,
          }}
        />
      );

    case "categoryShowcase":
      return (
        <section className="w-full">
          <div className="hidden md:block text-center mb-8 px-8 max-w-[1920px] mx-auto">
              <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                {section.title || "SHOP BY CATEGORY"}
              </h2>
          </div>
          <div className="md:hidden">
            <MobileCategoryList categories={section.categories} />
          </div>
          <div className="hidden md:block">
            <CategoryCarousel categories={section.categories} title="" />
          </div>
        </section>
      );

    case "categoryGrid":
      return (
        <FeaturedCategoryGrid
          title={section.title}
          categories={section.items}
        />
      );

    case "couponSection":
      return (
        <div
          className={
            section.fullWidth
              ? "w-full"
              : "px-4 md:px-8 pt-8 w-full max-w-[1920px] mx-auto"
          }
        >
           <Coupon/>
        </div>
      );

    case "brandSection":
      return <BrandShowcase brands={section.manualBrands} />;

    case "layoutSection":
      if (section.type === "trust") return <TrustBar />;
      if (section.type === "newsletter") return <FeaturesSection />;
      if (section.type === "infiniteGrid") {
        return (
          <div className="px-0 md:px-8 w-full max-w-[1920px] mx-auto pb-20">
            <InfiniteProductGrid
              initialProducts={section.initialProducts || []}
            />
          </div>
        );
      }
      return null;

    default:
      return null;
  }
}