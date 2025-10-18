import type { Metadata } from "next";
import { StateContext } from "./context/StateContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./providers/AuthProvider";
import Script from "next/script"; // Next.js ka script component import karein
import "./globals.css";

import { ThemeProvider } from "next-themes";
import MainLayoutClient from "./components/layout/MainLayoutClient";
// --- NAYE IMPORTS ---
import {
  getNavigationCategories,
  getSearchSuggestions,
} from "@/sanity/lib/queries";
import { SanityCategory } from "@/sanity/types/product_types";

export const metadata: Metadata = {
  title: "PocketValue | Modern Store",
  description: "Your one-stop shop for amazing deals!",
  icons: {
    icon: "/usamabrand.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- DATA FETCHING YAHAN HO RAHA HAI ---
  const categories: SanityCategory[] = await getNavigationCategories();
  const searchSuggestions = await getSearchSuggestions();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <StateContext>
              <Toaster />
              {/* --- DATA AAGEY PASS HO RAHA HAI --- */}
              <MainLayoutClient
                categories={categories}
                searchSuggestions={
                  searchSuggestions || {
                    trendingKeywords: [],
                    popularCategories: [],
                  }
                }
              >
                {children}
              </MainLayoutClient>
            </StateContext>
          </AuthProvider>
        </ThemeProvider>
        {/* --- YEH SCRIPT YAHAN ADD KAREIN --- */}
        <Script src="https://www.google.com/recaptcha/api.js" async defer />
      </body>
    </html>
  );
}
