// src/sanity/lib/image-loader.ts

import { ImageLoaderProps } from "next/image";

export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  // Agar image Sanity ki hai, to Sanity ke URL params use karo
  if (src.includes("cdn.sanity.io")) {
    return `${src}?w=${width}&q=${quality || 75}&auto=format`;
  }
  
  // Agar koi aur image hai, to wese hi return kardo
  return src;
}