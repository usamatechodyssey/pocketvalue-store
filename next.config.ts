// /next.config.js (CORRECTED - without next-intl)

import { withSentryConfig } from "@sentry/nextjs";
// import createNextIntlPlugin from 'next-intl/plugin'; // <-- STEP 1: Removed this import
import type { NextConfig } from "next";

// const withNextIntl = createNextIntlPlugin(); // <-- STEP 2: Removed this initialization

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '**' },
    ],
  },
  // You can keep other configs like transpilePackages if you still need them
  transpilePackages: ['papaparse'],
};

// const configWithPlugins = withNextIntl(nextConfig); // <-- STEP 3: Removed this wrapping

// Export the final configuration, now wrapping the base config directly
export default withSentryConfig(
  nextConfig, // <-- STEP 4: Pass the base nextConfig directly to Sentry
  {
    // Your Sentry configuration remains unchanged
    org: "pocketvalue",
    project: "javascript-nextjs",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    widenClientFileUpload: true,
  }
);