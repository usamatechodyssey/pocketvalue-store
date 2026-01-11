// // /src/app/layout.tsx (CORRECTED - without next-intl)

// import type { Metadata } from "next";
// import { AppStateProvider } from "./context/StateContext";
// import { Toaster } from "react-hot-toast";
// import AuthProvider from "./providers/AuthProvider";
// import Script from "next/script";
// import "./globals.css";

// import { ThemeProvider } from "next-themes";
// import MainLayoutClient from "./components/layout/MainLayoutClient";
// import {
//   getNavigationCategories,
//   getSearchSuggestions,
//   getGlobalSettings,
// } from "@/sanity/lib/queries";
// import { SanityCategory } from "@/sanity/types/product_types";

// // Removed next-intl related imports

// import { generateBaseMetadata } from "@/utils/metadata";
// import { urlFor } from "@/sanity/lib/image";

// // Removed generateStaticParams for locales

// // Updated generateMetadata to not expect a 'locale' param
// export async function generateMetadata(): Promise<Metadata> {
//   const settings = await getGlobalSettings();

//   return generateBaseMetadata({
//     title: settings.seo?.metaTitle,
//     description: settings.seo?.metaDescription,
//     image: settings.seo?.ogImage,
//     path: `/`, // Set the canonical path for the homepage
//   });
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
//   // Removed 'params' as it's no longer needed for locales
// }>) {
  
//   // Removed 'locale' and 'getMessages' call
//   const [categories, searchSuggestions, globalSettings] =
//     await Promise.all([
//       getNavigationCategories() as Promise<SanityCategory[]>,
//       getSearchSuggestions(),
//       getGlobalSettings(),
//     ]);

//   const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
//   const organizationSchema = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: globalSettings.siteName || "PocketValue",
//     url: siteUrl,
//     logo: globalSettings.siteLogo
//       ? urlFor(globalSettings.siteLogo).url()
//       : `${siteUrl}/icon.svg`,
//     contactPoint: {
//       "@type": "ContactPoint",
//       telephone: globalSettings.storePhoneNumber || "",
//       contactType: "Customer Service",
//     },
//   };

//   const websiteSchema = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: globalSettings.siteName || "PocketValue",
//     url: siteUrl,
//     potentialAction: {
//       "@type": "SearchAction",
//       target: `${siteUrl}/search?q={search_term_string}`,
//       "query-input": "required name=search_term_string",
//     },
//   };

//   // The 'lang' attribute can be set to a default language, e.g., 'en'
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body>
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(organizationSchema),
//           }}
//         />
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//         />

//         {/* Removed the NextIntlClientProvider wrapper */}
//         <ThemeProvider attribute="class" defaultTheme="light">
//           <AuthProvider>
//             <AppStateProvider>
//               <Toaster />
//               <MainLayoutClient
//                 categories={categories || []}
//                 searchSuggestions={
//                   searchSuggestions || {
//                     trendingKeywords: [],
//                     popularCategories: [],
//                   }
//                 }
//                 globalSettings={globalSettings || {}}
//               >
//                 {children}
//               </MainLayoutClient>
//             </AppStateProvider>
//           </AuthProvider>
//         </ThemeProvider>

//         <Script src="https://www.google.com/recaptcha/api.js" async defer />
//       </body>
//     </html>
//   );
// }
// import { Suspense } from "react";
// import type { Metadata, Viewport } from "next";
// // ✅ NEW: Import Google Font via Next.js
// import { Montserrat } from "next/font/google"; 
// import { AppStateProvider } from "./context/StateContext";
// import { Toaster } from "react-hot-toast";
// import AuthProvider from "./providers/AuthProvider";
// import Script from "next/script";
// import "./globals.css";

// import { ThemeProvider } from "next-themes";
// import MainLayoutClient from "./components/layout/MainLayoutClient";
// import GlobalLoader from "./components/ui/GlobalLoader"; 

// import {
//   getNavigationCategories,
//   getSearchSuggestions,
//   getGlobalSettings,
// } from "@/sanity/lib/queries";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { generateBaseMetadata } from "@/utils/metadata";
// import { urlFor } from "@/sanity/lib/image";

// // ✅ CONFIG: Font Setup (No network request chain)
// const montserrat = Montserrat({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//   variable: "--font-sans", // We will use this variable in Tailwind
//   display: "swap",
// });

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false,
//   viewportFit: "cover",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#ffffff" },
//     { media: "(prefers-color-scheme: dark)", color: "#111827" },
//   ],
// };

// export async function generateMetadata(): Promise<Metadata> {
//   const settings = await getGlobalSettings();

//   const baseSEO = generateBaseMetadata({
//     title: settings.seo?.metaTitle,
//     description: settings.seo?.metaDescription,
//     image: settings.seo?.ogImage,
//     path: `/`,
//   });

//   return {
//     ...baseSEO,
//     manifest: "/manifest.json",
//     appleWebApp: {
//       capable: true,
//       statusBarStyle: "default",
//       title: "PocketValue",
//     },
//     formatDetection: {
//       telephone: false,
//     },
//   };
// }

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const [categories, searchSuggestions, globalSettings] = await Promise.all([
//     getNavigationCategories() as Promise<SanityCategory[]>,
//     getSearchSuggestions(),
//     getGlobalSettings(),
//   ]);

//   const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

//   const organizationSchema = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: globalSettings.siteName || "PocketValue",
//     url: siteUrl,
//     logo: globalSettings.siteLogo
//       ? urlFor(globalSettings.siteLogo).url()
//       : `${siteUrl}/icon.svg`,
//     contactPoint: {
//       "@type": "ContactPoint",
//       telephone: globalSettings.storePhoneNumber || "",
//       contactType: "Customer Service",
//     },
//   };

//   const websiteSchema = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: globalSettings.siteName || "PocketValue",
//     url: siteUrl,
//     potentialAction: {
//       "@type": "SearchAction",
//       target: `${siteUrl}/search?q={search_term_string}`,
//       "query-input": "required name=search_term_string",
//     },
//   };

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={montserrat.variable}> {/* ✅ Apply Font Variable */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify(organizationSchema),
//           }}
//         />
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
//         />

//         <Suspense fallback={null}>
//           <GlobalLoader />
//         </Suspense>

//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem={false}
//         >
//           <AuthProvider>
//             <AppStateProvider>
//               <Toaster
//                 position="bottom-center"
//                 toastOptions={{ duration: 3000 }}
//               />
              
//               <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
//                 <MainLayoutClient
//                     categories={categories || []}
//                     searchSuggestions={
//                     searchSuggestions || {
//                         trendingKeywords: [],
//                         popularCategories: [],
//                     }
//                     }
//                     globalSettings={globalSettings || {}}
//                 >
//                     {children}
//                 </MainLayoutClient>
//               </Suspense>

//             </AppStateProvider>
//           </AuthProvider>
//         </ThemeProvider>

//         {/* ✅ OPTIMIZATION: Lazy load ReCaptcha to unblock main thread */}
//         <Script 
//           src="https://www.google.com/recaptcha/api.js" 
//           strategy="lazyOnload" 
//         />
//       </body>
//     </html>
//   );
// }
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
// ✅ NEW: Import Google Font via Next.js
import { Montserrat } from "next/font/google"; 
import { AppStateProvider } from "./context/StateContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./providers/AuthProvider";
import Script from "next/script";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import MainLayoutClient from "./components/layout/MainLayoutClient";
// import GlobalLoader from "./components/ui/GlobalLoader"; 

// ✅ NEW: PWA Install Prompt Component Import
import PWAInstallPrompt from "./components/PWAInstallPrompt";

import {
  getNavigationCategories,
  getSearchSuggestions,
  getGlobalSettings,
} from "@/sanity/lib/queries";
import { SanityCategory } from "@/sanity/types/product_types";
import { generateBaseMetadata } from "@/utils/metadata";
import { urlFor } from "@/sanity/lib/image";
import NextTopLoader from 'nextjs-toploader';
// ✅ CONFIG: Font Setup (No network request chain)
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans", // We will use this variable in Tailwind
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobalSettings();

  const baseSEO = generateBaseMetadata({
    title: settings.seo?.metaTitle,
    description: settings.seo?.metaDescription,
    image: settings.seo?.ogImage,
    path: `/`,
  });

  return {
    ...baseSEO,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "PocketValue",
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, searchSuggestions, globalSettings] = await Promise.all([
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.variable}> {/* ✅ Apply Font Variable */}
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
{/* 
            ✅ NEW: Top Loader (YouTube Style)
            Ye full screen spinner ki jagah top par line dikhayega.
            Is se "Double Loading" ka issue khatam ho jayega.
        */}
       
       
        <NextTopLoader 
          color="#f97316"      // Brand Color (Orange)
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}           // 🔴 Pehle 3 tha, ab 5 (Zyaada mota aur visible)
          crawl={true}
          showSpinner={false}   // 🔴 Pehle false tha, ab TRUE (Spinner wapis aa gaya)
          easing="ease"
          speed={200}
          shadow="0 0 15px #f97316, 0 0 10px #f97316" // 🔴 Zyada chamakdar shadow
          zIndex={99999}
        />

        {/* ❌ REMOVED: <Suspense fallback={null}><GlobalLoader /></Suspense> */}
      
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <AuthProvider>
            <AppStateProvider>
              <Toaster
                position="bottom-center"
                toastOptions={{ duration: 3000 }}
              />
              
              {/* ✅ ADDED: PWA Install Prompt here (Inside ThemeProvider) */}
              <PWAInstallPrompt />

              <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
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
              </Suspense>

            </AppStateProvider>
          </AuthProvider>
        </ThemeProvider>

        {/* ✅ OPTIMIZATION: Lazy load ReCaptcha to unblock main thread */}
        {/* <Script 
          src="https://www.google.com/recaptcha/api.js" 
          strategy="lazyOnload" 
        /> */}
      </body>
    </html>
  );
}