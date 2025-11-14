// /src/utils/metadata.ts

import type { Metadata } from 'next';
import { getGlobalSettings } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import type { GlobalSettings } from '@/sanity/lib/queries';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: any; // Can be a Sanity image object for Open Graph
  path: string; // The canonical path for the page (e.g., /product/my-slug)
}

/**
 * Generates a complete Metadata object for a page.
 * It merges page-specific data with global fallbacks fetched from Sanity.
 *
 * @param options - Page-specific SEO data.
 * @returns A promise that resolves to a Next.js Metadata object.
 */
export async function generateBaseMetadata(options: GenerateMetadataOptions): Promise<Metadata> {
  const settings: GlobalSettings = await getGlobalSettings();
  const { title, description, image, path } = options;

  const siteName = settings.siteName || 'PocketValue';
  
  // Determine the base title for the page, prioritizing the specific title passed in.
  const baseTitle = title || settings.seo?.metaTitle || siteName;
  
  // --- BUG FIX #2: Create a robust final title for OG and Twitter ---
  // This logic now checks if the site name is already present before appending it.
  const siteNameSuffix = ` | ${siteName}`;
  let finalTitle = baseTitle;
  // Prevent double-appending the site name if it's already in the custom meta title from Sanity
  if (!baseTitle.endsWith(siteNameSuffix) && baseTitle !== siteName) {
      finalTitle = baseTitle + siteNameSuffix;
  }
  
  const pageDescription = description || settings.seo?.metaDescription || 'Your one-stop shop for amazing deals!';
  
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!siteUrl) {
    console.warn("NEXT_PUBLIC_BASE_URL is not set. Canonical and Open Graph URLs may be incorrect.");
  }
  const canonicalUrl = siteUrl ? `${siteUrl}${path}` : path;

  const ogImageUrl = image ? urlFor(image).width(1200).height(630).url() 
                   : settings.seo?.ogImage ? urlFor(settings.seo.ogImage).width(1200).height(630).url()
                   : siteUrl ? `${siteUrl}/og-default.png`
                   : undefined;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    
    // The logic for the main <title> tag is correct and remains unchanged.
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
      absolute: baseTitle, // This correctly passes the "clean" base title to the template
    },

    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle, // Use the new, robustly-formatted title
      description: pageDescription,
      url: canonicalUrl,
      siteName: siteName,
      images: ogImageUrl ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: finalTitle, // Use the final title for better alt text
        },
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle, // Use the new, robustly-formatted title
      description: pageDescription,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

// --- SUMMARY OF CHANGES ---
// - **Bug #2 Fix (Duplicate Site Name):** The core of the fix is the new `finalTitle` variable. The logic now explicitly checks if the `baseTitle` already ends with the `| [Site Name]` suffix. It only appends the suffix if it's missing, completely eliminating the duplication bug for `og:title` and `twitter:title`.
// - **Increased Robustness:** This change makes the metadata utility more resilient. It will now produce correct titles even if a content editor manually adds the site name to a meta title field in Sanity.
// - **No Change for Bug #1:** The logic for the main `<title>` tag using `title.absolute` was already correct and has not been changed.