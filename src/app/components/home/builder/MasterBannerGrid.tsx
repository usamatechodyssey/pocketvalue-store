// "use client";

// import Link from "next/link";
// import Image from "next/image";

// // Types updated to match new Schema
// interface BannerItem {
//   desktopImage: string;
//   mobileImage?: string;
//   altText?: string;
//   link?: string;
//   heading?: string;
//   subheading?: string;
//   buttonText?: string;
//   contentPosition?: string;
//   overlayOpacity?: number;
//   textColor?: string;
// }

// interface MasterBannerGridProps {
//   // Sanity Schema Props
//   desktopLayout: string;
//   gridColumns?: number;
//   heightMode: string;
//   aspectRatio?: string;
//   fixedHeight?: string;
//   customHeightPx?: number;
//   mobileBehavior: string;
//   containerSettings: {
//     fullWidth: boolean;
//     gap: string;
//     roundedCorners: string;
//   };
//   banners: BannerItem[];
// }

// export default function MasterBannerGrid({
//   desktopLayout = 'grid',
//   gridColumns = 1,
//   heightMode = 'fixed',
//   aspectRatio = 'aspect-video',
//   fixedHeight = 'h-[500px]',
//   customHeightPx,
//   mobileBehavior = 'stack',
//   containerSettings,
//   banners,
// }: MasterBannerGridProps) {

//   if (!banners || banners.length === 0) return null;

//   // === 1. CONTAINER STYLES ===
//   const isFullWidth = containerSettings?.fullWidth;
//   const gapClass = `gap-${containerSettings?.gap || '4'}`;
//   const radiusClass = containerSettings?.roundedCorners === 'none' ? '' : `rounded-${containerSettings?.roundedCorners || 'xl'}`;

//   // === 2. HEIGHT LOGIC ===
//   // Helper function to get height style
//   const getHeightStyle = () => {
//     if (heightMode === 'custom' && customHeightPx) return { height: `${customHeightPx}px` };
//     return {};
//   };
//   const getHeightClass = () => {
//     if (heightMode === 'aspect') return aspectRatio;
//     if (heightMode === 'fixed') return fixedHeight;
//     return ''; // Custom uses inline style
//   };

//   // === 3. DESKTOP GRID LOGIC ===
//   let gridClass = "";
//   // Note: md:grid-cols-X controls desktop. Mobile is handled separately.
//   if (desktopLayout === 'grid') {
//      gridClass = `md:grid-cols-${gridColumns}`;
//   } else if (desktopLayout === 'mosaic-left') {
//      gridClass = "md:grid-cols-3"; // 1st item spans 2
//   } else if (desktopLayout === 'mosaic-right') {
//      gridClass = "md:grid-cols-3"; // Last item spans 2
//   } else if (desktopLayout === 'hero-stack') {
//      gridClass = "md:grid-cols-3"; // Top spans 3
//   }

//   // === 4. MOBILE LAYOUT LOGIC ===
//   let mobileWrapperClass = "";
//   if (mobileBehavior === 'scroll') {
//       mobileWrapperClass = "flex overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:grid";
//   } else if (mobileBehavior === 'grid-2') {
//       mobileWrapperClass = "grid grid-cols-2";
//   } else {
//       mobileWrapperClass = "grid grid-cols-1"; // Default Stack
//   }

//   return (
//     <section className={`w-full ${isFullWidth ? "" : "px-4 md:px-8 max-w-[1920px] mx-auto"}`}>

//       <div className={`${mobileWrapperClass} ${gridClass} ${gapClass}`}>

//         {banners.map((banner, index) => {

//           // === MOSAIC / ASYMMETRICAL LOGIC ===
//           let colSpanClass = "";
//           if (desktopLayout === 'mosaic-left' && index === 0) colSpanClass = "md:col-span-2";
//           if (desktopLayout === 'mosaic-right' && index === banners.length - 1) colSpanClass = "md:col-span-2";
//           if (desktopLayout === 'hero-stack' && index === 0) colSpanClass = "md:col-span-3";

//           // Mobile Item Width for Slider
//           const mobileItemClass = mobileBehavior === 'scroll' ? "min-w-[85vw] md:min-w-0 snap-center" : "w-full";

//           // Text Position Logic
//           const textPosClass = {
//              'center': 'justify-center items-center text-center',
//              'bottom-left': 'justify-end items-start text-left',
//              'bottom-center': 'justify-end items-center text-center',
//              'top-left': 'justify-start items-start text-left',
//           }[banner.contentPosition || 'center'];

//           return (
//             <div
//               key={index}
//               className={`relative overflow-hidden group ${colSpanClass} ${mobileItemClass} ${getHeightClass()} ${radiusClass}`}
//               style={getHeightStyle()} // Custom Height Apply Here
//             >
//               <Link href={banner.link || "#"} className="block w-full h-full relative">

//                 {/* Desktop Image */}
//                 <div className="hidden md:block w-full h-full relative">
//                   <Image
//                     src={banner.desktopImage}
//                     alt={banner.altText || "Banner"}
//                     fill
//                     className="object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                 </div>

//                 {/* Mobile Image */}
//                 <div className="block md:hidden w-full h-full relative min-h-[300px] md:min-h-0">
//                   <Image
//                     src={banner.mobileImage || banner.desktopImage}
//                     alt={banner.altText || "Banner"}
//                     fill
//                     className="object-cover transition-transform duration-700 group-hover:scale-105"
//                   />
//                 </div>

//                 {/* Dynamic Overlay (Opacity Control) */}
//                 <div
//                     className="absolute inset-0 transition-colors"
//                     style={{ backgroundColor: `rgba(0,0,0, ${(banner.overlayOpacity || 20) / 100})` }}
//                 />

//                 {/* Text Content */}
//                 {(banner.heading || banner.buttonText) && (
//                   <div className={`absolute inset-0 p-6 md:p-10 flex flex-col ${textPosClass}`}>
//                     <div className="max-w-xl">
//                       {banner.heading && (
//                         <h3 className={`text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md mb-2 ${banner.textColor || 'text-white'}`}>
//                           {banner.heading}
//                         </h3>
//                       )}
//                       {banner.subheading && (
//                         <p className={`text-sm md:text-lg drop-shadow-sm mb-4 opacity-90 ${banner.textColor || 'text-white'}`}>
//                           {banner.subheading}
//                         </p>
//                       )}
//                       {banner.buttonText && (
//                         <span className="inline-block px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-lg">
//                           {banner.buttonText}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
// "use client";

// import Link from "next/link";
// import Image from "next/image";

// // Types updated to match new Schema
// interface BannerItem {
//   desktopImage: string;
//   mobileImage?: string;
//   altText?: string;
//   link?: string;
//   heading?: string;
//   subheading?: string;
//   buttonText?: string;
//   contentPosition?: string;
//   overlayOpacity?: number;
//   textColor?: string;
// }

// interface MasterBannerGridProps {
//   // Sanity Schema Props
//   desktopLayout: string;
//   gridColumns?: number;
//   heightMode: string;
//   aspectRatio?: string;
//   fixedHeight?: string;
//   customHeightPx?: number;
//   mobileBehavior: string;
//   containerSettings: {
//     fullWidth: boolean;
//     gap: string;
//     roundedCorners: string;
//   };
//   banners: BannerItem[];
// }

// export default function MasterBannerGrid({
//   desktopLayout = "grid",
//   gridColumns = 1,
//   heightMode = "auto",
//   aspectRatio = "aspect-video",
//   fixedHeight = "h-[500px]",
//   customHeightPx,
//   mobileBehavior = "stack",
//   containerSettings,
//   banners,
// }: MasterBannerGridProps) {
//   if (!banners || banners.length === 0) return null;

//   const isAutoHeight = heightMode === "auto"; // 🔥 FIX: A variable to check for auto mode

//   // === 1. CONTAINER STYLES ===
//   const isFullWidth = containerSettings?.fullWidth;
//   const gapClass = `gap-${containerSettings?.gap || "4"}`;
//   const radiusClass =
//     containerSettings?.roundedCorners === "none"
//       ? ""
//       : `rounded-${containerSettings?.roundedCorners || "xl"}`;

//   // === 2. HEIGHT LOGIC ===
//   const getHeightStyle = () => {
//     if (heightMode === "custom" && customHeightPx)
//       return { height: `${customHeightPx}px` };
//     return {};
//   };

//   // 🔥 FIX: This function will now be ignored for 'auto' mode
//   const getHeightClass = () => {
//     if (isAutoHeight) return ""; // Auto height is handled by the image itself now
//     if (heightMode === "aspect") return aspectRatio;
//     if (heightMode === "fixed") return fixedHeight;
//     return "";
//   };

//   // ... rest of the logic remains the same ...
//   let gridClass = "";
//   if (desktopLayout === "grid") gridClass = `md:grid-cols-${gridColumns}`;
//   else if (desktopLayout === "mosaic-left") gridClass = "md:grid-cols-3";
//   else if (desktopLayout === "mosaic-right") gridClass = "md:grid-cols-3";
//   else if (desktopLayout === "hero-stack") gridClass = "md:grid-cols-3";

//   let mobileWrapperClass = "";
//   if (mobileBehavior === "scroll")
//     mobileWrapperClass =
//       "flex overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:grid";
//   else if (mobileBehavior === "grid-2") mobileWrapperClass = "grid grid-cols-2";
//   else mobileWrapperClass = "grid grid-cols-1";

//   return (
//     <section
//       className={`w-full ${isFullWidth ? "" : "px-4 md:px-8 max-w-[1920px] mx-auto"}`}
//     >
//       <div className={`${mobileWrapperClass} ${gridClass} ${gapClass}`}>
//         {banners.map((banner, index) => {
//           let colSpanClass = "";
//           if (desktopLayout === "mosaic-left" && index === 0)
//             colSpanClass = "md:col-span-2";
//           if (desktopLayout === "mosaic-right" && index === banners.length - 1)
//             colSpanClass = "md:col-span-2";
//           if (desktopLayout === "hero-stack" && index === 0)
//             colSpanClass = "md:col-span-3";

//           const mobileItemClass =
//             mobileBehavior === "scroll"
//               ? "min-w-[85vw] md:min-w-0 snap-center"
//               : "w-full";
//           const textPosClass = {
//             center: "justify-center items-center text-center",
//             "bottom-left": "justify-end items-start text-left",
//             "bottom-center": "justify-end items-center text-center",
//             "top-left": "justify-start items-start text-left",
//           }[banner.contentPosition || "center"];

//           return (
//             <div
//               key={index}
//               className={`relative overflow-hidden group ${colSpanClass} ${mobileItemClass} ${getHeightClass()} ${radiusClass}`}
//               style={getHeightStyle()}
//             >
//               <Link href={banner.link || "#"} className="block w-full h-full">
//                 {/* 🔥 FIX: Conditional Rendering for Image based on heightMode */}
//                 {isAutoHeight ? (
//                   // RENDER PATH FOR 'AUTO' MODE (without fill)
//                   <>
//                     {/* Desktop Image */}
//                     <Image
//                       src={banner.desktopImage}
//                       alt={banner.altText || "Banner"}
//                       width={1920} // Placeholder for aspect ratio calculation
//                       height={1080} // Placeholder for aspect ratio calculation
//                       className="hidden md:block w-full h-auto object-cover "
//                     />
//                     {/* Mobile Image */}
//                     <Image
//                       src={banner.mobileImage || banner.desktopImage}
//                       alt={banner.altText || "Banner"}
//                       width={750} // Placeholder for aspect ratio calculation
//                       height={900} // Placeholder for aspect ratio calculation
//                       className="block md:hidden w-full h-auto object-cover "
//                     />
//                   </>
//                 ) : (
//                   // RENDER PATH FOR 'FIXED', 'ASPECT', 'CUSTOM' (with fill)
//                   <>
//                     {/* Desktop Image */}
//                     <div className="hidden md:block w-full h-full relative">
//                       <Image
//                         src={banner.desktopImage}
//                         alt={banner.altText || "Banner"}
//                         fill
//                         className="object-cover "
//                       />
//                     </div>
//                     {/* Mobile Image */}
//                     <div className="block md:hidden w-full h-full relative min-h-[300px] md:min-h-0">
//                       <Image
//                         src={banner.mobileImage || banner.desktopImage}
//                         alt={banner.altText || "Banner"}
//                         fill
//                         className="object-cover "
//                       />
//                     </div>
//                   </>
//                 )}

//                 {/* Overlay and Text content will work for both cases because they are absolutely positioned */}
//                 {/* <div 
//                     className="absolute inset-0 transition-colors"
//                     style={{ backgroundColor: `rgba(0,0,0, ${(banner.overlayOpacity || 20) / 100})` }} 
//                 /> */}

//                 {(banner.heading || banner.buttonText) && (
//                   <div
//                     className={`absolute inset-0 p-6 md:p-10 flex flex-col ${textPosClass}`}
//                   >
//                     <div className="max-w-xl">
//                       {banner.heading && (
//                         <h3
//                           className={`text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md mb-2 ${banner.textColor || "text-white"}`}
//                         >
//                           {banner.heading}
//                         </h3>
//                       )}
//                       {banner.subheading && (
//                         <p
//                           className={`text-sm md:text-lg drop-shadow-sm mb-4 opacity-90 ${banner.textColor || "text-white"}`}
//                         >
//                           {banner.subheading}
//                         </p>
//                       )}
//                       {banner.buttonText && (
//                         <span className="inline-block px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-lg">
//                           {banner.buttonText}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
// "use client";

// import Link from "next/link";
// import Image from "next/image";

// // Types updated to match Schema
// interface BannerItem {
//   desktopImage: string;
//   mobileImage?: string;
//   altText?: string;
//   link?: string;
//   heading?: string;
//   subheading?: string;
//   buttonText?: string;
//   contentPosition?: string;
//   overlayOpacity?: number;
//   textColor?: string;
// }

// interface MasterBannerGridProps {
//   // Sanity Schema Props
//   desktopLayout: string;
//   gridColumns?: number;
//   heightMode: string;
//   aspectRatio?: string;
//   fixedHeight?: string;
//   customHeightPx?: number;
//   mobileBehavior: string;
//   containerSettings: {
//     fullWidth: boolean;
//     gap: string;
//     roundedCorners: string;
//   };
//   banners: BannerItem[];
// }

// export default function MasterBannerGrid({
//   desktopLayout = "grid",
//   gridColumns = 1,
//   heightMode = "auto",
//   aspectRatio = "aspect-video",
//   fixedHeight = "h-[500px]",
//   customHeightPx,
//   mobileBehavior = "stack",
//   containerSettings,
//   banners,
// }: MasterBannerGridProps) {
//   // Agar banners nahi hain to kuch mat dikhao
//   if (!banners || banners.length === 0) return null;

//   const isAutoHeight = heightMode === "auto";

//   // === 1. CONTAINER STYLES ===
//   const isFullWidth = containerSettings?.fullWidth;
//   const gapClass = `gap-${containerSettings?.gap || "4"}`;
//   const radiusClass =
//     containerSettings?.roundedCorners === "none"
//       ? ""
//       : `rounded-${containerSettings?.roundedCorners || "xl"}`;

//   // === 2. HEIGHT LOGIC ===
//   // Custom pixel height ke liye inline style
//   const getHeightStyle = () => {
//     if (heightMode === "custom" && customHeightPx)
//       return { height: `${customHeightPx}px` };
//     return {};
//   };

//   // Tailwind classes for Aspect Ratio or Fixed Height
//   const getHeightClass = () => {
//     if (isAutoHeight) return "";
//     if (heightMode === "aspect") return aspectRatio;
//     if (heightMode === "fixed") return fixedHeight;
//     return "";
//   };

//   // === 3. LAYOUT LOGIC ===
//   let gridClass = "";
//   if (desktopLayout === "grid") gridClass = `md:grid-cols-${gridColumns}`;
//   else if (desktopLayout === "mosaic-left") gridClass = "md:grid-cols-3";
//   else if (desktopLayout === "mosaic-right") gridClass = "md:grid-cols-3";
//   else if (desktopLayout === "hero-stack") gridClass = "md:grid-cols-3";

//   // === 4. MOBILE BEHAVIOR & SCROLLBAR HIDING ===
//   let mobileWrapperClass = "";
//   if (mobileBehavior === "scroll") {
//     // Yahan scrollbar hide karne ki classes add ki gayi hain:
//     // [&::-webkit-scrollbar]:hidden -> Chrome/Safari/Edge ke liye
//     // [-ms-overflow-style:none] -> IE/Edge Legacy ke liye
//     // [scrollbar-width:none] -> Firefox ke liye
//     mobileWrapperClass =
//       "flex overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 md:grid [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";
//   } else if (mobileBehavior === "grid-2") {
//     mobileWrapperClass = "grid grid-cols-2";
//   } else {
//     mobileWrapperClass = "grid grid-cols-1";
//   }

//   return (
//     <section
//       className={`w-full ${isFullWidth ? "" : "px-4 md:px-8 max-w-[1920px] mx-auto"}`}
//     >
//       <div className={`${mobileWrapperClass} ${gridClass} ${gapClass}`}>
//         {banners.map((banner, index) => {
//           // --- Layout Spanning Logic ---
//           let colSpanClass = "";
//           if (desktopLayout === "mosaic-left" && index === 0)
//             colSpanClass = "md:col-span-2";
//           if (desktopLayout === "mosaic-right" && index === banners.length - 1)
//             colSpanClass = "md:col-span-2";
//           if (desktopLayout === "hero-stack" && index === 0)
//             colSpanClass = "md:col-span-3";

//           // Mobile Item Sizing
//           const mobileItemClass =
//             mobileBehavior === "scroll"
//               ? "min-w-[85vw] md:min-w-0 snap-center"
//               : "w-full";

//           // Text Positioning
//           const textPosClass = {
//             center: "justify-center items-center text-center",
//             "bottom-left": "justify-end items-start text-left",
//             "bottom-center": "justify-end items-center text-center",
//             "top-left": "justify-start items-start text-left",
//           }[banner.contentPosition || "center"];

//           // --- PERFORMANCE OPTIMIZATION ---
//           // 1. sizes: Browser ko batata hai ke kis screen par kitni bari image download karni hai.
//           const sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
          
//           // 2. priority: Pehle banner ko 'priority' milti hai taake wo fauran load ho (LCP improve).
//           // Baaki images lazy load hongi.
//           const isPriority = index === 0;

//           return (
//             <div
//               key={index}
//               className={`relative overflow-hidden group ${colSpanClass} ${mobileItemClass} ${getHeightClass()} ${radiusClass}`}
//               style={getHeightStyle()}
//             >
//               <Link href={banner.link || "#"} className="block w-full h-full">
//                 {/* 
//                    LOGIC:
//                    Agar 'Auto' height hai to Next/Image ko width/height chaiye.
//                    Agar 'Fixed/Aspect' hai to Next/Image ko 'fill' prop chaiye.
//                 */}
                
//                 {isAutoHeight ? (
//                   // === SCENARIO A: AUTO HEIGHT (No Crop) ===
//                   <>
//                     {/* Desktop Image */}
//                     <Image
//                       src={banner.desktopImage}
//                       alt={banner.altText || "Banner"}
//                       width={1920}
//                       height={1080}
//                       sizes={sizes}
//                       priority={isPriority}
//                       className="hidden md:block w-full h-auto object-cover"
//                     />
//                     {/* Mobile Image */}
//                     <Image
//                       src={banner.mobileImage || banner.desktopImage}
//                       alt={banner.altText || "Banner"}
//                       width={750}
//                       height={900}
//                       sizes="100vw"
//                       priority={isPriority}
//                       className="block md:hidden w-full h-auto object-cover"
//                     />
//                   </>
//                 ) : (
//                   // === SCENARIO B: FIXED/ASPECT HEIGHT (Fill & Crop) ===
//                   <>
//                     {/* Desktop Image */}
//                     <div className="hidden md:block w-full h-full relative">
//                       <Image
//                         src={banner.desktopImage}
//                         alt={banner.altText || "Banner"}
//                         fill
//                         sizes={sizes}
//                         priority={isPriority}
//                         className="object-cover"
//                       />
//                     </div>
//                     {/* Mobile Image */}
//                     <div className="block md:hidden w-full h-full relative min-h-[300px] md:min-h-0">
//                       <Image
//                         src={banner.mobileImage || banner.desktopImage}
//                         alt={banner.altText || "Banner"}
//                         fill
//                         sizes="100vw"
//                         priority={isPriority}
//                         className="object-cover"
//                       />
//                     </div>
//                   </>
//                 )}

//                 {/* --- Text Content --- */}
//                 {(banner.heading || banner.buttonText) && (
//                   <div
//                     className={`absolute inset-0 p-6 md:p-10 flex flex-col ${textPosClass}`}
//                   >
//                     <div className="max-w-xl">
//                       {banner.heading && (
//                         <h3
//                           className={`text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md mb-2 ${banner.textColor || "text-white"}`}
//                         >
//                           {banner.heading}
//                         </h3>
//                       )}
//                       {banner.subheading && (
//                         <p
//                           className={`text-sm md:text-lg drop-shadow-sm mb-4 opacity-90 ${banner.textColor || "text-white"}`}
//                         >
//                           {banner.subheading}
//                         </p>
//                       )}
//                       {banner.buttonText && (
//                         <span className="inline-block px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-lg">
//                           {banner.buttonText}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </Link>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";

interface BannerItem {
  desktopImage: string;
  mobileImage?: string;
  altText?: string;
  link?: string;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  contentPosition?: string;
  overlayOpacity?: number;
  textColor?: string;
}

interface MasterBannerGridProps {
  desktopLayout: string;
  gridColumns?: number;
  heightMode: string;
  aspectRatio?: string;
  fixedHeight?: string;
  customHeightPx?: number;
  mobileBehavior: string;
  containerSettings: {
    fullWidth: boolean;
    gap: string;
    roundedCorners: string;
  };
  banners: BannerItem[];
}

export default function MasterBannerGrid({
  desktopLayout = "grid",
  gridColumns = 1,
  heightMode = "auto",
  aspectRatio = "aspect-video", // Default fallback only
  fixedHeight = "h-[500px]",    // Default fallback only
  customHeightPx,
  mobileBehavior = "stack",
  containerSettings,
  banners,
}: MasterBannerGridProps) {
  if (!banners || banners.length === 0) return null;

  const isAutoHeight = heightMode === "auto";

  // === 1. CONTAINER STYLES ===
  const isFullWidth = containerSettings?.fullWidth;
  const gapClass = `gap-${containerSettings?.gap || "4"}`;
  const radiusClass =
    containerSettings?.roundedCorners === "none"
      ? ""
      : `rounded-${containerSettings?.roundedCorners || "xl"}`;

  // === 2. HEIGHT LOGIC ===
  const getHeightStyle = () => {
    if (heightMode === "custom" && customHeightPx)
      return { height: `${customHeightPx}px` };
    return {};
  };

  const getHeightClass = () => {
    if (isAutoHeight) return ""; // Auto mode me koi height class nahi, content decide karega
    if (heightMode === "aspect") return aspectRatio;
    if (heightMode === "fixed") return fixedHeight;
    return "";
  };

  // === 3. LAYOUT LOGIC ===
  let gridClass = "";
  if (desktopLayout === "grid") gridClass = `md:grid-cols-${gridColumns}`;
  else if (desktopLayout === "mosaic-left") gridClass = "md:grid-cols-3";
  else if (desktopLayout === "mosaic-right") gridClass = "md:grid-cols-3";
  else if (desktopLayout === "hero-stack") gridClass = "md:grid-cols-3";

  // === 4. MOBILE BEHAVIOR ===
  let mobileWrapperClass = "";
  if (mobileBehavior === "scroll") {
    mobileWrapperClass =
      "flex overflow-x-auto snap-x snap-mandatory pb-2 md:pb-0 md:grid [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";
  } else if (mobileBehavior === "grid-2") {
    mobileWrapperClass = "grid grid-cols-2";
  } else {
    mobileWrapperClass = "grid grid-cols-1";
  }

  return (
    <section
      className={`w-full mb-4 md:mb-6 ${isFullWidth ? "" : "px-4 md:px-8 max-w-[1920px] mx-auto"}`}
    >
      <div className={`${mobileWrapperClass} ${gridClass} ${gapClass}`}>
        {banners.map((banner, index) => {
          let colSpanClass = "";
          if (desktopLayout === "mosaic-left" && index === 0)
            colSpanClass = "md:col-span-2";
          if (desktopLayout === "mosaic-right" && index === banners.length - 1)
            colSpanClass = "md:col-span-2";
          if (desktopLayout === "hero-stack" && index === 0)
            colSpanClass = "md:col-span-3";

          // Mobile Item sizing for scroll
          const mobileItemClass =
            mobileBehavior === "scroll"
              ? "min-w-[85vw] md:min-w-0 snap-center shrink-0"
              : "w-full";

          const textPosClass = {
            center: "justify-center items-center text-center",
            "bottom-left": "justify-end items-start text-left",
            "bottom-center": "justify-end items-center text-center",
            "top-left": "justify-start items-start text-left",
          }[banner.contentPosition || "center"];

          const sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
          const isPriority = index === 0;

          return (
            <div
              key={index}
              className={`relative overflow-hidden group ${colSpanClass} ${mobileItemClass} ${getHeightClass()} ${radiusClass}`}
              style={getHeightStyle()}
            >
              <Link href={banner.link || "#"} className="block w-full h-full relative">
                
                {isAutoHeight ? (
                  // === AUTO HEIGHT (Fully Dynamic) ===
                  <>
                    {/* Desktop Image */}
                    <Image
                      src={banner.desktopImage}
                      alt={banner.altText || "Banner"}
                      width={0} // Dynamic width
                      height={0} // Dynamic height
                      sizes="100vw"
                      priority={isPriority}
                      className="hidden md:block w-full h-auto object-cover" // h-auto lets image define height
                    />
                    {/* Mobile Image */}
                    <Image
                      src={banner.mobileImage || banner.desktopImage}
                      alt={banner.altText || "Banner"}
                      width={0} // Dynamic width
                      height={0} // Dynamic height
                      sizes="100vw"
                      priority={isPriority}
                      className="block md:hidden w-full h-auto object-cover" // h-auto lets image define height
                    />
                  </>
                ) : (
                  // === FIXED/ASPECT HEIGHT (Fill container) ===
                  <>
                    <div className="hidden md:block w-full h-full relative">
                      <Image
                        src={banner.desktopImage}
                        alt={banner.altText || "Banner"}
                        fill
                        sizes={sizes}
                        priority={isPriority}
                        className="object-cover"
                      />
                    </div>
                    <div className="block md:hidden w-full h-full relative">
                      <Image
                        src={banner.mobileImage || banner.desktopImage}
                        alt={banner.altText || "Banner"}
                        fill
                        sizes="100vw"
                        priority={isPriority}
                        className="object-cover"
                      />
                    </div>
                  </>
                )}

                {/* --- Text Content --- */}
                {(banner.heading || banner.buttonText) && (
                  <div
                    className={`absolute inset-0 p-6 md:p-10 flex flex-col ${textPosClass} pointer-events-none`}
                  >
                    <div className="max-w-xl pointer-events-auto">
                      {banner.heading && (
                        <h3
                          className={`text-2xl md:text-4xl font-bold tracking-tight drop-shadow-md mb-2 ${banner.textColor || "text-white"}`}
                        >
                          {banner.heading}
                        </h3>
                      )}
                      {banner.subheading && (
                        <p
                          className={`text-sm md:text-lg drop-shadow-sm mb-4 opacity-90 ${banner.textColor || "text-white"}`}
                        >
                          {banner.subheading}
                        </p>
                      )}
                      {banner.buttonText && (
                        <span className="inline-block px-6 py-2.5 bg-white text-black font-bold text-sm rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-lg">
                          {banner.buttonText}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}