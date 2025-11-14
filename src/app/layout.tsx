// /src/app/layout.tsx (CORRECTED - without next-intl)

import type { Metadata } from "next";
import { AppStateProvider } from "./context/StateContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./providers/AuthProvider";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import MainLayoutClient from "./components/layout/MainLayoutClient";
import {
  getNavigationCategories,
  getSearchSuggestions,
  getGlobalSettings,
} from "@/sanity/lib/queries";
import { SanityCategory } from "@/sanity/types/product_types";

// Removed next-intl related imports

import { generateBaseMetadata } from "@/utils/metadata";
import { urlFor } from "@/sanity/lib/image";

// Removed generateStaticParams for locales

// Updated generateMetadata to not expect a 'locale' param
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  return generateBaseMetadata({
    title: settings.seo?.metaTitle,
    description: settings.seo?.metaDescription,
    image: settings.seo?.ogImage,
    path: `/`, // Set the canonical path for the homepage
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  // Removed 'params' as it's no longer needed for locales
}>) {
  
  // Removed 'locale' and 'getMessages' call
  const [categories, searchSuggestions, globalSettings] =
    await Promise.all([
      getNavigationCategories() as Promise<SanityCategory[]>,
      getSearchSuggestions(),
      getGlobalSettings(),
    ]);

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: globalSettings.siteName || "PocketValue",
    url: siteUrl,
    logo: globalSettings.siteLogo
      ? urlFor(globalSettings.siteLogo).url()
      : `${siteUrl}/icon.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: globalSettings.storePhoneNumber || "",
      contactType: "Customer Service",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: globalSettings.siteName || "PocketValue",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // The 'lang' attribute can be set to a default language, e.g., 'en'
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Removed the NextIntlClientProvider wrapper */}
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <AppStateProvider>
              <Toaster />
              <MainLayoutClient
                categories={categories || []}
                searchSuggestions={
                  searchSuggestions || {
                    trendingKeywords: [],
                    popularCategories: [],
                  }
                }
                globalSettings={globalSettings || {}}
              >
                {children}
              </MainLayoutClient>
            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>

        <Script src="https://www.google.com/recaptcha/api.js" async defer />
      </body>
    </html>
  );
}