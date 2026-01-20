// src/sanity/lib/image-loader.ts

import { ImageLoaderProps } from "next/image";

export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  // 1. Agar image Sanity ki nahi hai (Local assets), to wese hi return kardo
  if (!src.includes("cdn.sanity.io")) {
    return src;
  }

  // 2. 🔥 FIX: Check karo ke URL mein pehle se parameters hain ya nahi
  // Agar '?' pehle se मौजूद hai to '&' use karo, warna '?' use karo
  const separator = src.includes('?') ? '&' : '?';

  // 3. Optimized URL return karo correct separator ke sath
  return `${src}${separator}w=${width}&q=${quality || 75}&auto=format`;
}