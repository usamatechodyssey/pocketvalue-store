
// import React from "react";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

// export default async function Coupon() {
//   const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);

//   if (!banners || banners.length === 0) return null;

//   const bannerData = banners[0];
//   const { mediaUrls, width, height, objectFit, altText, link } = bannerData;

//   // === SMART DYNAMIC STYLES ===
//   // Humne variables ko 'px' mein convert kar diya hai taake CSS calc() mein use ho sakein agar zarurat pare
//   const dynamicStyles = {
//     "--width-mobile": width.mobile ? `${width.mobile}px` : "100%",
//     "--width-tablet": width.tablet ? `${width.tablet}px` : "100%",
//     "--width-desktop": width.desktop ? `${width.desktop}px` : "100%",

//     "--height-mobile": height.mobile ? `${height.mobile}px` : "auto",
//     "--height-tablet": height.tablet ? `${height.tablet}px` : "auto",
//     "--height-desktop": height.desktop ? `${height.desktop}px` : "auto",
//   } as React.CSSProperties;

//   const href = link?.slug
//     ? link._type === "product"
//       ? `/products/${link.slug.current}`
//       : `/categories/${link.slug.current}`
//     : "";

//   const BannerContent = (
//     <div
//       className="relative overflow-hidden transition-transform duration-300 hover:opacity-95 mx-auto
        
//         /* === MOBILE: EDGE TO EDGE === */
//         w-full h-(--height-mobile)
//         rounded-none shadow-none

//         /* === TABLET: PADDED & ROUNDED === */
//         md:w-(--width-tablet) md:h-(--height-tablet)
//         md:rounded-xl md:shadow-md

//         /* === DESKTOP: CENTERED PREMIUM === */
//         lg:w-(--width-desktop) lg:h-(--height-desktop)
//         lg:rounded-2xl lg:hover:shadow-lg
//       "
//       style={dynamicStyles}
//     >
//       <picture className="block w-full h-full">
//         {/* Desktop Source */}
//         {mediaUrls.desktop?.asset?.url && (
//           <source
//             media="(min-width: 1024px)"
//             srcSet={mediaUrls.desktop.asset.url}
//           />
//         )}
//         {/* Tablet Source */}
//         {mediaUrls.tablet?.asset?.url && (
//           <source
//             media="(min-width: 768px)"
//             srcSet={mediaUrls.tablet.asset.url}
//           />
//         )}
//         {/* Mobile / Default Source */}
//         {(mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url) && (
//           <img
//             src={
//               mediaUrls.mobile?.asset?.url ||
//               mediaUrls.desktop?.asset?.url ||
//               ""
//             }
//             alt={altText || "Promotional Coupon"}
//             className={`w-full h-full object-${objectFit || "cover"}`}
//             // Priority loading for better LCP if it's near top
//             loading="eager"
//           />
//         )}
//       </picture>
//     </div>
//   );

//   // Wrapper Section to remove external padding impact
//   return (
//     <section className="w-full flex justify-center my-4 md:my-8">
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
"use client"; // Make it a Client Component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

interface CouponProps {
  data?: any; // Data from Page Builder
}

export default function Coupon({ data }: CouponProps) {
  const [bannerData, setBannerData] = useState<CouponBannerType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (useEffect ka code waisa hi rahega, usme koi change nahi)
    const fetchCoupon = async () => {
      if (data && data.couponReference) {
        setBannerData(data.couponReference);
        setLoading(false);
      } else {
        try {
          const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);
          if (banners && banners.length > 0) {
            setBannerData(banners[0]);
          }
        } catch (error) {
          console.error("Failed to fetch coupon:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCoupon();
  }, [data]);

  if (loading) return null;
  if (!bannerData) return null;

  const { mediaUrls, width, height, objectFit, altText, link } = bannerData;

  const dynamicStyles = {
    "--width-mobile": width?.mobile ? `${width.mobile}px` : "100%",
    "--width-tablet": width?.tablet ? `${width.tablet}px` : "100%",
    "--width-desktop": width?.desktop ? `${width.desktop}px` : "100%",
    "--height-mobile": height?.mobile ? `${height.mobile}px` : "auto",
    "--height-tablet": height?.tablet ? `${height.tablet}px` : "auto",
    "--height-desktop": height?.desktop ? `${height.desktop}px` : "auto",
  } as React.CSSProperties;

  const href = link?.slug
    ? link._type === "product"
      ? `/products/${link.slug.current}`
      // This line is correct, no changes needed.
      : `/categories/${link.slug.current}`
    : "";

  const BannerContent = (
    // 🔥 FIX: Is div se rounded corners aur shadow hata di gayi hain
    <div
      className="relative overflow-hidden transition-transform duration-300 hover:opacity-95 mx-auto
        w-full h-(--height-mobile)
        md:w-(--width-tablet) md:h-(--height-tablet)
        lg:w-(--width-desktop) lg:h-(--height-desktop)
      "
      style={dynamicStyles}
    >
      <picture className="block w-full h-full">
        {mediaUrls?.desktop?.asset?.url && (
          <source media="(min-width: 1024px)" srcSet={mediaUrls.desktop.asset.url} />
        )}
        {mediaUrls?.tablet?.asset?.url && (
          <source media="(min-width: 768px)" srcSet={mediaUrls.tablet.asset.url} />
        )}
        {(mediaUrls?.mobile?.asset?.url || mediaUrls?.desktop?.asset?.url) && (
          <img
            src={mediaUrls.mobile?.asset?.url || mediaUrls.desktop?.asset?.url || ""}
            alt={altText || "Promotional Coupon"}
            className={`w-full h-full object-${objectFit || "cover"}`}
            loading="eager"
          />
        )}
      </picture>
    </div>
  );

  return (
    <section className="w-full">
      {href ? (
        // 🔥 FIX: Yahan se md:w-auto hata diya taake banner poori width le
        <Link href={href} className="block w-full">
          {BannerContent}
        </Link>
      ) : (
        // 🔥 FIX: Yahan se bhi md:w-auto hata diya
        <div className="w-full">{BannerContent}</div>
      )}
    </section>
  );
}