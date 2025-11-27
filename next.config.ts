// /next.config.js (CORRECTED)

import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    // Next.js 16 requires whitelisting quality values used in your app
    qualities: [75, 85, 90], 
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '**' },
    ],
  },
  transpilePackages: ['papaparse'],
};

export default withSentryConfig(
  nextConfig,
  {
    org: "pocketvalue",
    project: "javascript-nextjs",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    widenClientFileUpload: true,
  }
);