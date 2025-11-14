// /src/app/wishlist/page.tsx

import type { Metadata } from "next";
import WishlistClientPage from "./_components/WishlistClientPage"; // <-- IMPORT the new client component

// Metadata can now be exported from a Server Component without issue.
export const metadata: Metadata = {
  title: "My Wishlist",
  robots: {
    index: false,
    follow: false,
  },
};

// This is now a simple Server Component
export default function WishlistPage() {
  // It renders the client component that contains all the logic and state.
  return <WishlistClientPage />;
}

// --- SUMMARY OF CHANGES ---
// - Removed the `"use client"` directive, converting this file into a React Server Component.
// - Deleted all hook-based logic, state management, and data fetching from this file.
// - Imported the new `WishlistClientPage` client component.
// - The component now only returns `<WishlistClientPage />`, delegating all rendering and interactivity to it.
// - The `metadata` export now works correctly as it's no longer in a client component file.