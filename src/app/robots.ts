// /src/app/robots.ts

import { MetadataRoute } from 'next';

/**
 * Generates the robots.txt file for the site.
 * This file tells search engine crawlers which pages or files the crawler
 * can or can't request from your site.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable. It's required for a production robots.txt.");
  }

  return {
    rules: [
      {
        userAgent: '*', // Applies to all user-agents (all crawlers)
        allow: '/',     // Allow crawling of all content by default
        
        // Disallow crawling of specific private, sensitive, or low-value routes.
        // This list is now comprehensive based on all files we have reviewed.
        disallow: [
          '/Bismillah786/',       // Admin panel
          '/account/',           // All user account pages
          '/api/',               // Disallow all API routes
          
          // Auth & User Flow
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password/',
          '/verify-email',
          '/verify-phone',
          '/access-denied',

          // E-commerce Flow
          '/cart',
          '/checkout/',
          '/wishlist',
          '/order-failure',
          '/order-success/',

          // Low-value or "Coming Soon" pages
          '/gift-cards',
          '/sell',
        ],
      },
    ],
    // Point crawlers to the location of the sitemap
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

// --- SUMMARY OF CHANGES ---
// - This file is the final, comprehensive version.
// - The `disallow` array has been updated to include all private and transactional routes we have identified, such as `/cart`, `/checkout/`, `/verify-email`, and `/verify-phone`, ensuring complete crawler control.