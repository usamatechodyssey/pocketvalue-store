// components/TripleBanner.tsx - UPDATED

"use client";
import React from "react";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";

interface Banner {
  _id: string;
  title: string;
  image: SanityImageSource;
  link: string;
  buttonText: string;
}

interface StoryBannersProps {
  banners: Banner[];
}

export default function TripleBanner({ banners }: StoryBannersProps) {
  if (!banners || banners.length === 0) {
    return null;
  }
  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <section className="bg-surface-ground w-full pt-8 pb-6">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="text-center mb-10">
          {/* text-text-primary pehle se tha, font-bold ab base se aayega */}
          <h2 className="text-3xl tracking-tight">Explore Our Top Picks</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Discover collections that match your unique style.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Link
              href={banner.link}
              key={banner._id}
              className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 block"
            >
              <Image
                src={urlFor(banner.image).url()}
                alt={banner.title}
                width={600}
                height={400}
                className="w-full h-[40] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                priority
              />

              {/* Dark Overlay ko thora halka kar diya hai */}
              {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300"></div> */}

              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-on-primary text-center">
                <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider drop-shadow-md">
                  {/* {banner.title} */}
                </h3>

                {/* "Shop Now" button */}
                <div className="mt-4 flex items-center gap-2 bg-surface-base/20 backdrop-blur-sm border border-surface-base/40 text-on-primary font-semibold py-2 px-4 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                  {banner.buttonText}
                  <FiArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
