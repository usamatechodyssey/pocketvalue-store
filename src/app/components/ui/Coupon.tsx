
import React from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

export default async function Coupon() {
  const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);

  if (!banners || banners.length === 0) return null;

  const bannerData = banners[0];
  const { mediaUrls, width, height, objectFit, altText, link } = bannerData;

  // === SMART DYNAMIC STYLES ===
  // Humne variables ko 'px' mein convert kar diya hai taake CSS calc() mein use ho sakein agar zarurat pare
  const dynamicStyles = {
    "--width-mobile": width.mobile ? `${width.mobile}px` : "100%",
    "--width-tablet": width.tablet ? `${width.tablet}px` : "100%",
    "--width-desktop": width.desktop ? `${width.desktop}px` : "100%",

    "--height-mobile": height.mobile ? `${height.mobile}px` : "auto",
    "--height-tablet": height.tablet ? `${height.tablet}px` : "auto",
    "--height-desktop": height.desktop ? `${height.desktop}px` : "auto",
  } as React.CSSProperties;

  const href = link?.slug
    ? link._type === "product"
      ? `/products/${link.slug.current}`
      : `/categories/${link.slug.current}`
    : "";

  const BannerContent = (
    <div
      className="relative overflow-hidden mx-auto
        
        /* === MOBILE: EDGE TO EDGE === */
        w-full h-(--height-mobile)
     

        /* === TABLET: PADDED & ROUNDED === */
        md:w-(--width-tablet) md:h-(--height-tablet)
        

        /* === DESKTOP: CENTERED PREMIUM === */
        lg:w-(--width-desktop) lg:h-(--height-desktop)
        
      "
      style={dynamicStyles}
    >
      <picture className="block w-full h-full">
        {/* Desktop Source */}
        {mediaUrls.desktop?.asset?.url && (
          <source
            media="(min-width: 1024px)"
            srcSet={mediaUrls.desktop.asset.url}
          />
        )}
        {/* Tablet Source */}
        {mediaUrls.tablet?.asset?.url && (
          <source
            media="(min-width: 768px)"
            srcSet={mediaUrls.tablet.asset.url}
          />
        )}
        {/* Mobile / Default Source */}
        {(mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url) && (
          <img
            src={
              mediaUrls.mobile?.asset?.url ||
              mediaUrls.desktop?.asset?.url ||
              ""
            }
            alt={altText || "Promotional Coupon"}
            className={`w-full h-full object-${objectFit || "cover"}`}
            // Priority loading for better LCP if it's near top
            loading="eager"
          />
        )}
      </picture>
    </div>
  );

  // Wrapper Section to remove external padding impact
  return (
    <section className="w-full flex justify-center my-4 md:my-8 mb-6 md:mb-10">
      {href ? (
        <Link href={href} className="block w-full md:w-auto">
          {BannerContent}
        </Link>
      ) : (
        <div className="w-full md:w-auto">{BannerContent}</div>
      )}
    </section>
  );
}
// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

// // Interface define kar rahe hain
// interface CouponProps {
//   section?: any; // RenderSection se jo "section" prop aa raha hai
// }

// export default async function Coupon({ section }: CouponProps) {
//   let bannerData: CouponBannerType | null = null;

//   // === STEP 1: CHECK PARENT DATA (Jese File 2 me tha) ===
//   // Check karein ke kya parent ne 'couponReference' bheja hai?
//   // AUR KYA USME 'mediaUrls' MAJOOD HAIN? (Ye zaroori check hai)
//   if (section?.couponReference?.mediaUrls) {
//     bannerData = section.couponReference;
//   }

//   // === STEP 2: FALLBACK FETCH (Agar parent ka data khali ya adhoora hai) ===
//   // Ye wahi logic hai jo File 2 me "else" block me thi.
//   if (!bannerData) {
//     try {
//       const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);
//       // Agar array khali nahi hai, to pehla item lelo
//       if (banners && banners.length > 0) {
//         bannerData = banners[0];
//       }
//     } catch (error) {
//       console.error("Coupon fetch failed:", error);
//     }
//   }

//   // === STEP 3: AGAR DONO TARIKON SE DATA NAHI MILA TO RETURN NULL ===
//   if (!bannerData || !bannerData.mediaUrls) {
//     return null;
//   }

//   // === RENDER LOGIC (Ab hamare paas pakka data hai) ===
//   const { mediaUrls, width, height, altText, link, objectFit } = bannerData;

//   const href = link?.slug
//     ? link._type === "product"
//       ? `/products/${link.slug.current}`
//       : `/categories/${link.slug.current}`
//     : "";

//   // Dynamic Height/Width Setup
//   const styles = {
//     "--w-desktop": width?.desktop ? `${width.desktop}px` : "100%",
//     "--h-mobile": height?.mobile ? `${height.mobile}px` : "250px",
//     "--h-tablet": height?.tablet ? `${height.tablet}px` : "300px",
//     "--h-desktop": height?.desktop ? `${height.desktop}px` : "400px",
//   } as React.CSSProperties;

//   const objectFitClass = objectFit === "contain" ? "object-contain" : "object-cover";

//   // URL Helpers
//   const mobileUrl = mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url;
//   const tabletUrl = mediaUrls.tablet?.asset?.url || mediaUrls.desktop?.asset?.url;
//   const desktopUrl = mediaUrls.desktop?.asset?.url;

//   if (!mobileUrl && !desktopUrl) return null;

//   const BannerContent = (
//     <div
//       className="relative mx-auto overflow-hidden group
//         w-full md:w-auto lg:w-(--w-desktop)
//         h-(--h-mobile) md:h-(--h-tablet) lg:h-(--h-desktop)
//         md:rounded-xl lg:rounded-2xl transition-all duration-300"
//       style={styles}
//     >
//       {/* 1. Desktop Image (Large Screens) */}
//       {desktopUrl && (
//         <div className="hidden lg:block absolute inset-0 w-full h-full">
//           <Image
//             src={desktopUrl}
//             alt={altText || "Coupon Offer"}
//             fill
//             priority
//             sizes="(min-width: 1024px) 100vw"
//             className={objectFitClass}
//           />
//         </div>
//       )}

//       {/* 2. Tablet Image (Medium Screens) */}
//       {tabletUrl && (
//         <div className="hidden md:block lg:hidden absolute inset-0 w-full h-full">
//           <Image
//             src={tabletUrl}
//             alt={altText || "Coupon Offer"}
//             fill
//             priority
//             sizes="(min-width: 768px) 100vw"
//             className={objectFitClass}
//           />
//         </div>
//       )}

//       {/* 3. Mobile Image (Small Screens) */}
//       {mobileUrl && (
//         <div className="block md:hidden absolute inset-0 w-full h-full">
//           <Image
//             src={mobileUrl}
//             alt={altText || "Coupon Offer"}
//             fill
//             priority
//             sizes="100vw"
//             className={objectFitClass}
//           />
//         </div>
//       )}

//       {/* Hover Overlay */}
//       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
//     </div>
//   );

//   return (
//     <section className="w-full flex justify-center my-4 md:my-6 mb-6 md:mb-10 px-0 md:px-4">
//       {href ? (
//         <Link href={href} className="w-full flex justify-center">
//           {BannerContent}
//         </Link>
//       ) : (
//         BannerContent
//       )}
//     </section>
//   );
// }
// "use client"; // Make it a Client Component

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

// interface CouponProps {
//   data?: any; // Data from Page Builder
// }

// export default function Coupon({ data }: CouponProps) {
//   const [bannerData, setBannerData] = useState<CouponBannerType | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCoupon = async () => {
//       // Case 1: Data from Page Builder (Directly Passed)
//       if (data && data.couponReference) {
//         setBannerData(data.couponReference);
//         setLoading(false);
//       } 
//       // Case 2: Legacy Mode (Fetch from Sanity)
//       else {
//         try {
//           const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);
//           if (banners && banners.length > 0) {
//             setBannerData(banners[0]);
//           }
//         } catch (error) {
//           console.error("Failed to fetch coupon:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchCoupon();
//   }, [data]);

//   if (loading) return null; // Or return a Skeleton if you want
//   if (!bannerData) return null;

//   const { mediaUrls, width, height, objectFit, altText, link } = bannerData;

//   const dynamicStyles = {
//     "--width-mobile": width?.mobile ? `${width.mobile}px` : "100%",
//     "--width-tablet": width?.tablet ? `${width.tablet}px` : "100%",
//     "--width-desktop": width?.desktop ? `${width.desktop}px` : "100%",

//     "--height-mobile": height?.mobile ? `${height.mobile}px` : "auto",
//     "--height-tablet": height?.tablet ? `${height.tablet}px` : "auto",
//     "--height-desktop": height?.desktop ? `${height.desktop}px` : "auto",
//   } as React.CSSProperties;

//   const href = link?.slug
//     ? link._type === "product"
//       ? `/products/${link.slug.current}`
//       : `/categories/${link.slug.current}`
//     : "";

//   const BannerContent = (
//     <div
//       className="relative overflow-hidden transition-transform duration-300 hover:opacity-95 mx-auto
//         w-full h-(--height-mobile) rounded-none shadow-none
//         md:w-(--width-tablet) md:h-(--height-tablet) md:rounded-xl md:shadow-md
//         lg:w-(--width-desktop) lg:h-(--height-desktop) lg:rounded-2xl lg:hover:shadow-lg
//       "
//       style={dynamicStyles}
//     >
//       <picture className="block w-full h-full">
//         {mediaUrls?.desktop?.asset?.url && (
//           <source media="(min-width: 1024px)" srcSet={mediaUrls.desktop.asset.url} />
//         )}
//         {mediaUrls?.tablet?.asset?.url && (
//           <source media="(min-width: 768px)" srcSet={mediaUrls.tablet.asset.url} />
//         )}
//         {(mediaUrls?.mobile?.asset?.url || mediaUrls?.desktop?.asset?.url) && (
//           <img
//             src={mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url || ""}
//             alt={altText || "Promotional Coupon"}
//             className={`w-full h-full object-${objectFit || "cover"}`}
//             loading="eager"
//           />
//         )}
//       </picture>
//     </div>
//   );

//   return (
//     <section className={`w-full flex justify-center my-4 md:my-8 ${data?.fullWidth ? 'w-full' : ''}`}>
//       {href ? (
//         <Link href={href} className="block w-full md:w-auto">
//           {BannerContent}
//         </Link>
//       ) : (
//         <div className="w-full md:w-auto">{BannerContent}</div>
//       )}
//     </section>
//   );
// }
// "use client"; // Make it a Client Component

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

// interface CouponProps {
//   data?: any; // Data from Page Builder
// }

// export default function Coupon({ data }: CouponProps) {
//   const [bannerData, setBannerData] = useState<CouponBannerType | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // ... (useEffect ka code waisa hi rahega, usme koi change nahi)
//     const fetchCoupon = async () => {
//       if (data && data.couponReference) {
//         setBannerData(data.couponReference);
//         setLoading(false);
//       } else {
//         try {
//           const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);
//           if (banners && banners.length > 0) {
//             setBannerData(banners[0]);
//           }
//         } catch (error) {
//           console.error("Failed to fetch coupon:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCoupon();
//   }, [data]);

//   if (loading) return null;
//   if (!bannerData) return null;

//   const { mediaUrls, width, height, objectFit, altText, link } = bannerData;

//   const dynamicStyles = {
//     "--width-mobile": width?.mobile ? `${width.mobile}px` : "100%",
//     "--width-tablet": width?.tablet ? `${width.tablet}px` : "100%",
//     "--width-desktop": width?.desktop ? `${width.desktop}px` : "100%",
//     "--height-mobile": height?.mobile ? `${height.mobile}px` : "auto",
//     "--height-tablet": height?.tablet ? `${height.tablet}px` : "auto",
//     "--height-desktop": height?.desktop ? `${height.desktop}px` : "auto",
//   } as React.CSSProperties;

//   const href = link?.slug
//     ? link._type === "product"
//       ? `/products/${link.slug.current}`
//       // This line is correct, no changes needed.
//       : `/categories/${link.slug.current}`
//     : "";

//   const BannerContent = (
//     // 🔥 FIX: Is div se rounded corners aur shadow hata di gayi hain
//     <div
//       className="relative overflow-hidden transition-transform duration-300 hover:opacity-95 mx-auto
//         w-full h-(--height-mobile)
//         md:w-(--width-tablet) md:h-(--height-tablet)
//         lg:w-(--width-desktop) lg:h-(--height-desktop)
//       "
//       style={dynamicStyles}
//     >
//       <picture className="block w-full h-full">
//         {mediaUrls?.desktop?.asset?.url && (
//           <source media="(min-width: 1024px)" srcSet={mediaUrls.desktop.asset.url} />
//         )}
//         {mediaUrls?.tablet?.asset?.url && (
//           <source media="(min-width: 768px)" srcSet={mediaUrls.tablet.asset.url} />
//         )}
//         {(mediaUrls?.mobile?.asset?.url || mediaUrls?.desktop?.asset?.url) && (
//           <img
//             src={mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url || ""}
//             alt={altText || "Promotional Coupon"}
//             className={`w-full h-full object-${objectFit || "cover"}`}
//             loading="eager"
//           />
//         )}
//       </picture>
//     </div>
//   );

//   return (
//     <section className="w-full">
//       {href ? (
//         // 🔥 FIX: Yahan se md:w-auto hata diya taake banner poori width le
//         <Link href={href} className="block w-full">
//           {BannerContent}
//         </Link>
//       ) : (
//         // 🔥 FIX: Yahan se bhi md:w-auto hata diya
//         <div className="w-full">{BannerContent}</div>
//       )}
//     </section>
//   );
// }
// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";
// // import { urlFor } from "@/sanity/lib/image"; // Unused import removed to keep lint happy

// interface CouponProps {
//   data?: any;
// }

// // Function to check if the URL is likely a video based on extension
// const isVideo = (url: string) => /\.(mp4|webm|ogv)$/i.test(url);
// // Function to check if the URL is likely an animated GIF/WebP
// const isAnimated = (url: string) => /\.(gif|webp)$/i.test(url) || url.includes('animated');

// export default function Coupon({ data }: CouponProps) {
//   const [bannerData, setBannerData] = useState<CouponBannerType | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCoupon = async () => {
//       if (data && data.couponReference) {
//         setBannerData(data.couponReference);
//         setLoading(false);
//       } else {
//         try {
//           const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);
//           if (banners && banners.length > 0) {
//             setBannerData(banners[0]);
//           }
//         } catch (error) {
//           console.error("Failed to fetch coupon:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCoupon();
//   }, [data]);

//   if (loading || !bannerData) return null;

//   const { mediaUrls, width, height, altText, link, mediaType, objectFit } = bannerData;

//   const href = link?.slug
//     ? link._type === "product"
//       ? `/products/${link.slug.current}`
//       : `/category/${link.slug.current}`
//     : "";

//   // CSS Variables for Responsive Heights
//   const containerStyles = {
//     "--h-mobile": height?.mobile || "250px",
//     "--h-tablet": height?.tablet || "180px",
//     "--h-desktop": height?.desktop || "140px",
//     "--w-desktop": width?.desktop || "1325px",
//   } as React.CSSProperties;

//   const MediaRenderer = ({ src, objectFitClass }: { src: string; objectFitClass: string }) => {
    
//     const isVid = mediaType === 'video' || isVideo(src);
//     const isStaticImage = mediaType === 'image' && !isAnimated(src);
    
//     if (isVid) {
//       return (
//         <video
//           src={src}
//           autoPlay
//           loop
//           muted
//           playsInline
//           className={`w-full h-full ${objectFitClass}`}
//         />
//       );
//     }
    
//     return (
//       <Image
//         src={src}
//         alt={altText || "Coupon Offer"}
//         fill
//         priority
//         className={`w-full h-full ${objectFitClass}`}
//         sizes="100vw"
//         unoptimized={!isStaticImage}
//       />
//     );
//   };
  
//   const ResponsiveContent = ({ 
//     mobileSrc, 
//     tabletSrc, 
//     desktopSrc 
//   }: { 
//     mobileSrc?: string; 
//     tabletSrc?: string; 
//     desktopSrc?: string 
//   }) => {
//     const objectFitClass = `object-${objectFit || "cover"}`;

//     return (
//       <>
//         {/* ✅ FIX 1: Added 'relative' class to all parent divs */}
//         {/* ✅ FIX 2: Fixed Height Syntax to h-[var(--name)] for better Tailwind support */}

//         {/* 1. Mobile View (< 768px) */}
//         <div className="block md:hidden w-full relative h-(--h-mobile)">
//           <MediaRenderer src={mobileSrc || tabletSrc || desktopSrc || ""} objectFitClass={objectFitClass} />
//         </div>

//         {/* 2. Tablet View (768px - 1024px) */}
//         <div className="hidden md:block lg:hidden w-full relative h-(--h-tablet)">
//           <MediaRenderer src={tabletSrc || desktopSrc || ""} objectFitClass={objectFitClass} />
//         </div>

//         {/* 3. Desktop View (> 1024px) */}
//         <div className="hidden lg:block w-full max-w-(--w-desktop) mx-auto relative h-(--h-desktop)">
//           <MediaRenderer src={desktopSrc || ""} objectFitClass={objectFitClass} />
//         </div>
//       </>
//     );
//   };
  
//   const mobileUrl = mediaUrls?.mobile?.asset?.url || '';
//   const tabletUrl = mediaUrls?.tablet?.asset?.url || mobileUrl;
//   const desktopUrl = mediaUrls?.desktop?.asset?.url || tabletUrl;
  
//   const BannerContent = (
//     <div
//       className="relative w-full mx-auto overflow-hidden transition-opacity duration-300 hover:opacity-95"
//       style={containerStyles}
//     >
//       <ResponsiveContent
//         mobileSrc={mobileUrl}
//         tabletSrc={tabletUrl}
//         desktopSrc={desktopUrl}
//       />
//     </div>
//   );

//   return (
//     <section className="w-full flex justify-center bg-transparent">
//       {href ? (
//         <Link href={href} className="block w-full">
//           {BannerContent}
//         </Link>
//       ) : (
//         <div className="w-full">{BannerContent}</div>
//       )}
//     </section>
//   );
// }