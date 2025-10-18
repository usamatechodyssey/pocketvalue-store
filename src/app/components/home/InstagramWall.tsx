// src/components/home/InstagramWall.tsx - FINAL TOUCH-UP

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { FaInstagram } from "react-icons/fa";

type GalleryImage = SanityImageSource & {
  alt: string;
};

interface InstagramWallData {
  heading?: string;
  subheading?: string;
  instagramHandle?: string;
  gallery?: GalleryImage[];
}

interface InstagramWallProps {
  data: InstagramWallData | null;
}

export default function InstagramWall({ data }: InstagramWallProps) {
  if (!data || !data.gallery || data.gallery.length === 0) {
    return null;
  }

  const instagramUrl = `https://www.instagram.com/${data.instagramHandle || ""}`;

  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <section className="bg-surface-ground py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* font-bold aur color ab base se aayega */}
          <h2 className="text-3xl md:text-4xl tracking-tight">
            {data.heading}
          </h2>
          <p className="mt-3 text-lg text-text-secondary max-w-2xl mx-auto">
            {data.subheading}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {data.gallery.map((image, index) => (
            <Link
              href={instagramUrl}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden aspect-square rounded-lg shadow-sm"
            >
              <Image
                src={urlFor(image).url()}
                alt={image.alt || `Instagram post ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:brightness-75"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaInstagram className="text-on-primary h-10 w-10 transform-gpu transition-transform duration-300 group-hover:scale-110" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          {/* Yeh link `a` tag ke base styles se aek dum alag hai, isliye iski classes theek hain */}
          <Link
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-primary hover:bg-brand-primary-hover text-text-on-primary font-bold py-3 px-10 rounded-md transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Follow on Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
