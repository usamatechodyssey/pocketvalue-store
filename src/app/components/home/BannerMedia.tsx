"use client";

import Image from "next/image";
import type { LifestyleBanner } from "@/sanity/types/product_types";

interface BannerMediaProps {
  banner: LifestyleBanner;
  className?: string;
}
export function BannerMedia({ banner, className }: BannerMediaProps) {
  
  // VIDEO RENDER
  if (banner.mediaType === "video") {
    // === YAHAN ASAL "SMART" LOGIC HAI ===
    // Priority: Pehle Cloudinary URL check karo, agar woh nahi to direct file URL istemal karo.
    const desktopVideoSrc = banner.desktopVideoUrl || banner.desktopVideoFile;
    const mobileVideoSrc = banner.mobileVideoUrl || banner.mobileVideoFile;
    // ===================================

    return (
       <>
        {/* Desktop Video */}
        {desktopVideoSrc && (
          <video
            // === YAHAN ASAL TABDEELI HAI ===
            // Humne key ko unique banane ke liye "desktop-" prefix add kiya hai
            key={`desktop-${desktopVideoSrc}`} 
            src={desktopVideoSrc}
            poster={banner.desktopImage || undefined}
            className={`hidden md:block object-cover w-full h-full ${className}`}
            autoPlay loop muted playsInline
          />
        )}
        {/* Mobile Video */}
        {mobileVideoSrc && (
          <video
            // === YAHAN BHI ASAL TABDEELI HAI ===
            // Humne key ko unique banane ke liye "mobile-" prefix add kiya hai
            key={`mobile-${mobileVideoSrc}`}
            src={mobileVideoSrc}
            poster={banner.mobileImage || undefined}
            className={`block md:hidden object-cover w-full h-full ${className}`}
            autoPlay loop muted playsInline
          />
        )}
      </>
    );
  }

  // IMAGE RENDER
  if (banner.mediaType === "image") {
    return (
      <>
        {/* Desktop Image */}
        {banner.desktopImage && (
          <Image
            src={banner.desktopImage}
            alt={banner.title || "Lifestyle Banner"}
            className={`hidden md:block object-cover w-full h-full ${className}`}
            width={1600}
            height={900}
            priority={false}
          />
        )}

        {/* Mobile Image */}
        {banner.mobileImage && (
          <Image
            src={banner.mobileImage}
            alt={banner.title || "Lifestyle Banner"}
            className={`block md:hidden object-cover w-full h-full ${className}`}
            width={600}
            height={800}
            priority={false}
          />
        )}
      </>
    );
  }

  return null;
}
