// app/components/category/CategoryHeader.tsx (MUKAMMAL FINAL CODE)

import Link from "next/link";
import Image from "next/image";
import { SanityCategory } from "@/sanity/types/product_types"; // Make sure types are correct
import { urlFor } from "@/sanity/lib/image";
import { FiArrowLeft } from "react-icons/fi";

interface Props {
  currentCategory: SanityCategory;
  // categoryTree is no longer needed here for display
  slugPath: string[];
}

export default function CategoryHeader({ currentCategory, slugPath }: Props) {
  const hasBanner =
    currentCategory.desktopBanner || currentCategory.mobileBanner;

  return (
    <>
    
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-gray-100">
            {currentCategory.name}
          </h1>
          {/* Breadcrumbs */}
          <div className="text-xs text-text-secondary mt-2 flex items-center flex-wrap">
            <Link href="/" className="hover:text-brand-primary">
              Home
            </Link>
            {slugPath.map((slug, i) => (
              <span key={i} className="flex items-center">
                <span className="mx-1">/</span>
                <Link
                  href={`/category/${slugPath.slice(0, i + 1).join("/")}`}
                  className="hover:text-brand-primary capitalize"
                >
                  {slug.replace(/-/g, " ")}
                </Link>
              </span>
            ))}
          </div>
        </div>

        {slugPath.length > 1 && (
          <Link
            href={`/category/${slugPath.slice(0, -1).join("/")}`}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
          >
            <FiArrowLeft size={16} />
            Back
          </Link>
        )}
      </div>
      {hasBanner && (
        <div className="relative w-full h-130 sm:h-110 md:h-100 rounded-xl overflow-hidden mb-8 shadow-lg">
          <picture>
            {currentCategory.mobileBanner && (
              <source
                media="(max-width: 767px)"
                srcSet={urlFor(currentCategory.mobileBanner).url()}
              />
            )}
            {currentCategory.desktopBanner && (
              <source
                media="(min-width: 768px)"
                srcSet={urlFor(currentCategory.desktopBanner).url()}
              />
            )}
            <Image
              src={urlFor(
                currentCategory.desktopBanner || currentCategory.mobileBanner!
              ).url()}
              alt={`${currentCategory.name} Category Banner`}
              fill
              className="object-cover"
              priority
            />
          </picture>
        </div>
      )}

      {currentCategory.description && (
        <div className="prose prose-sm max-w-none mb-8 p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-300">
          <p>{currentCategory.description}</p>
        </div>
      )}
    </>
  );
}
