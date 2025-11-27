// // components/ui/Coupon.tsx

// import React from "react";
// import Link from "next/link";
// import { client } from "@/sanity/lib/client";
// import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
// import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

// export default async function Coupon() {
//   const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);

//   if (!banners || banners.length === 0) return null;

//   const bannerData = banners[0];
//   const { mediaType, mediaUrls, width, height, objectFit, altText, link } =
//     bannerData;

//   const dynamicStyles = {
//     "--width-mobile": width.mobile,
//     "--width-tablet": width.tablet,
//     "--width-desktop": width.desktop,
//     "--height-mobile": height.mobile,
//     "--height-tablet": height.tablet,
//     "--height-desktop": height.desktop,
//   } as React.CSSProperties;

//   const responsiveClasses = `
//     w-[var(--width-mobile)] md:w-[var(--width-tablet)] lg:w-[var(--width-desktop)]
//     h-[var(--height-mobile)] md:h-[var(--height-tablet)] lg:h-[var(--height-desktop)]
//   `;

//   let href = "";
//   if (link?.slug) {
//     href =
//       link._type === "product"
//         ? `/products/${link.slug.current}`
//         : `/categories/${link.slug.current}`;
//   }

//   // ✅ 'mx-auto' class wapis add kar di hai.
//   const BannerContent = (
//     <div
//       className={`relative overflow-hidden  mb-4 mx-auto ${responsiveClasses}`}
//       style={dynamicStyles}
//     >
//       {/* Andar ka media code bilkul waisa hi hai */}
//       {/* ... <video> aur <picture> tags ... */}
//       <picture className="absolute w-full h-full">
//         {mediaUrls.desktop?.asset?.url && (
//           <source
//             media="(min-width: 1024px)"
//             srcSet={mediaUrls.desktop.asset.url}
//           />
//         )}
//         {mediaUrls.tablet?.asset?.url && (
//           <source
//             media="(min-width: 768px)"
//             srcSet={mediaUrls.tablet.asset.url}
//           />
//         )}
//         {(mediaUrls.mobile?.asset?.url ||
//           mediaUrls.tablet?.asset?.url ||
//           mediaUrls.desktop?.asset?.url) && (
//           <img
//             src={
//               mediaUrls.mobile?.asset?.url ||
//               mediaUrls.tablet?.asset?.url ||
//               mediaUrls.desktop?.asset?.url ||
//               ""
//             }
//             alt={altText || ""}
//             className={`w-full h-full object-${objectFit}`}
//           />
//         )}
//       </picture>
//     </div>
//   );

//   return href ? <Link href={href}>{BannerContent}</Link> : <>{BannerContent}</>;
// }
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
      className="relative overflow-hidden transition-transform duration-300 hover:opacity-95 mx-auto
        
        /* === MOBILE: EDGE TO EDGE === */
        w-full h-(--height-mobile)
        rounded-none shadow-none

        /* === TABLET: PADDED & ROUNDED === */
        md:w-(--width-tablet) md:h-(--height-tablet)
        md:rounded-xl md:shadow-md

        /* === DESKTOP: CENTERED PREMIUM === */
        lg:w-(--width-desktop) lg:h-(--height-desktop)
        lg:rounded-2xl lg:hover:shadow-lg
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
    <section className="w-full flex justify-center my-4 md:my-8">
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
