// import { defineConfig, globalIgnores } from "eslint/config";
// import nextVitals from "eslint-config-next/core-web-vitals";
// import nextTs from "eslint-config-next/typescript";
// const eslintConfig = defineConfig([
// ...nextVitals,
// ...nextTs,
// // Override default ignores of eslint-config-next.
// globalIgnores([
// // Default ignores of eslint-config-next:
// ".next/",
// "out/",
// "build/**",
// "next-env.d.ts",
// ]),
// ]);
// export default eslintConfig;
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 1. GLOBAL IGNORES (Yahan hum PWA aur Scripts ko ignore kar rahe hain)
  globalIgnores([
    ".next/",
    "out/",
    "build/**",
    "next-env.d.ts",
    "public/sw.js",              // PWA Service Worker
    "public/workbox-*.js",       // PWA Workbox files
    "public/swe-worker-*.js",    // PWA Worker files
    "scripts/*.cjs"              // Sanity Scripts
  ]),

  // 2. RULES OVERRIDE (Yahan hum strict rules ko naram kar rahe hain)
  {
    rules: {
      // "@typescript-eslint/no-explicit-any": "off",      // 'any' type allow karega
      "@typescript-eslint/no-unused-vars": "warn",      // Unused vars par sirf warning dega, error nahi
    }
  }
]);

export default eslintConfig;