
// import { withSentryConfig } from "@sentry/nextjs";
// import type { NextConfig } from "next";
// import withPWAInit from "@ducanh2912/next-pwa";

// /** @type {import('next').NextConfig} */
// const nextConfig: NextConfig = {
//   // 🔥🔥🔥 PERFORMANCE FIXES START HERE 🔥🔥🔥
  
//   // 1. Experimental: Next.js ki next generation code splitting
//   experimental: {
//     webpackBuildWorker: true,
//   },

//   // 2. Webpack Configuration for Duplicates/Minification
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       if (!config.optimization.splitChunks) {
//           config.optimization.splitChunks = {};
//       }
      
//       config.optimization.splitChunks = {
//         chunks: 'all',
//         minSize: 20000,
//         maxInitialRequests: 20,
//         maxAsyncRequests: 20,
//         cacheGroups: {
//           vendors: {
//             test: /[\\/]node_modules[\\/]/,
//             name(module: any) { 
//               const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/|$])/)?.[1];
//               return packageName ? `npm.${packageName.replace('@', '')}` : null;
//             },
//             priority: 10,
//           },
//           common: {
//             minChunks: 2,
//             priority: 5,
//             reuseExistingChunk: true,
//           },
//         },
//       };
      
//       // ✅ FIX: Runtime chunk optimization (Helps with caching and HMR)
//       config.optimization.runtimeChunk = 'single';
//     }
//     return config;
//   },

//   // 🔥🔥🔥 REST OF YOUR CONFIG 🔥🔥🔥

//   images: {
//     formats: ['image/avif', 'image/webp'],
//     qualities: [75, 85, 90, 95], 
//     remotePatterns: [
//       { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '**' },
//       { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '**' },
//       { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '**' },
//       { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '**' },
//     ],
//   },
//   transpilePackages: ['papaparse'],
// };

// // PWA CONFIGURATION
// const withPWA = withPWAInit({
//   dest: "public",
//   cacheOnFrontEndNav: true,
//   aggressiveFrontEndNavCaching: true,
//   reloadOnOnline: true,
//   disable: process.env.NODE_ENV === "development", 
//   workboxOptions: {
//     disableDevLogs: true,
//   },
// });
// // // ORIGINAL CONFIG WITH SENTRY (Uncomment this later for Production Deployment)
// export default withSentryConfig(
//   withPWA(nextConfig),
//   {
//     org: "pocketvalue",
//     project: "javascript-nextjs",
//     authToken: process.env.SENTRY_AUTH_TOKEN,
//     silent: !process.env.CI,
//     widenClientFileUpload: true,
//     disableLogger: true,
//   }
// ); 
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // 🔥🔥🔥 LATEST NEXT.JS CONFIGURATION 🔥🔥🔥
  
  // FIX 1: New Top-Level Key for Node.js package tracing (For Font/PDF)
  // Ye Vercel ko batata hai ke 'public/fonts' folder ko API ke sath bhejo
  outputFileTracingIncludes: {
    '/api/**/*': ['./public/fonts/**/*'], 
  },
  
  // FIX 2: New Top-Level Key for external Server Components packages (For @react-pdf/renderer)
  serverExternalPackages: ['@react-pdf/renderer'],

  // FIX 3: Experimental section mein sirf baki settings rahengi
  experimental: {
    webpackBuildWorker: true,
    // Note: Invalid keys (jo upar move ho gaye hain) ko yahan se hata diya gaya hai
  },

  // 2. Webpack Configuration for Duplicates/Minification
  webpack: (config, { isServer }) => {
    // ... (Your Webpack code remains the same as it's not the issue)
    if (!isServer) {
      if (!config.optimization.splitChunks) {
          config.optimization.splitChunks = {};
      }
      
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxInitialRequests: 20,
        maxAsyncRequests: 20,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module: any) { 
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/|$])/)?.[1];
              return packageName ? `npm.${packageName.replace('@', '')}` : null;
            },
            priority: 10,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
      
      // ✅ FIX: Runtime chunk optimization (Helps with caching and HMR)
      config.optimization.runtimeChunk = 'single';
    }
    return config;
  },

  // 🔥🔥🔥 REST OF YOUR CONFIG 🔥🔥🔥

  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90, 95], 
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '**' },
    ],
  },
  transpilePackages: ['papaparse'],
};

// PWA CONFIGURATION
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development", 
  workboxOptions: {
    disableDevLogs: true,
  },
});

// // ORIGINAL CONFIG WITH SENTRY
export default withSentryConfig(
  withPWA(nextConfig),
  {
    org: "pocketvalue",
    project: "javascript-nextjs",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    disableLogger: true,
  }
);