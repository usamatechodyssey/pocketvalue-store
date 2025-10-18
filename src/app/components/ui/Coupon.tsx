// components/ui/Coupon.tsx

import React from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { COUPON_BANNER_QUERY } from "@/sanity/lib/queries";
import { CouponBannerType } from "@/sanity/types/couponBannerTypes";

export default async function Coupon() {
  const banners: CouponBannerType[] = await client.fetch(COUPON_BANNER_QUERY);

  if (!banners || banners.length === 0) return null;

  const bannerData = banners[0];
  const { mediaType, mediaUrls, width, height, objectFit, altText, link } =
    bannerData;

  const dynamicStyles = {
    "--width-mobile": width.mobile,
    "--width-tablet": width.tablet,
    "--width-desktop": width.desktop,
    "--height-mobile": height.mobile,
    "--height-tablet": height.tablet,
    "--height-desktop": height.desktop,
  } as React.CSSProperties;

  const responsiveClasses = `
    w-[var(--width-mobile)] md:w-[var(--width-tablet)] lg:w-[var(--width-desktop)]
    h-[var(--height-mobile)] md:h-[var(--height-tablet)] lg:h-[var(--height-desktop)]
  `;

  let href = "";
  if (link?.slug) {
    href =
      link._type === "product"
        ? `/products/${link.slug.current}`
        : `/categories/${link.slug.current}`;
  }

  // ✅ 'mx-auto' class wapis add kar di hai.
  const BannerContent = (
    <div
      className={`relative overflow-hidden  mb-4 mx-auto ${responsiveClasses}`}
      style={dynamicStyles}
    >
      {/* Andar ka media code bilkul waisa hi hai */}
      {/* ... <video> aur <picture> tags ... */}
      <picture className="absolute w-full h-full">
        {mediaUrls.desktop?.asset?.url && (
          <source
            media="(min-width: 1024px)"
            srcSet={mediaUrls.desktop.asset.url}
          />
        )}
        {mediaUrls.tablet?.asset?.url && (
          <source
            media="(min-width: 768px)"
            srcSet={mediaUrls.tablet.asset.url}
          />
        )}
        {(mediaUrls.mobile?.asset?.url ||
          mediaUrls.tablet?.asset?.url ||
          mediaUrls.desktop?.asset?.url) && (
          <img
            src={
              mediaUrls.mobile?.asset?.url ||
              mediaUrls.tablet?.asset?.url ||
              mediaUrls.desktop?.asset?.url ||
              ""
            }
            alt={altText || ""}
            className={`w-full h-full object-${objectFit}`}
          />
        )}
      </picture>
    </div>
  );

  return href ? <Link href={href}>{BannerContent}</Link> : <>{BannerContent}</>;
}
