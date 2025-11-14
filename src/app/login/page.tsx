// /src/app/login/page.tsx

import type { Metadata } from "next";
import LoginClient from "./LoginClient"; // Import the client component

// This is a Server Component, so metadata is allowed here.
export const metadata: Metadata = {
  title: "Login | PocketValue",
  robots: {
    index: false, // Disallow search engines from indexing this page
    follow: true, // Allow them to follow links on the page (like "Register")
  },
};

export default function LoginPage() {
  // Render the Client Component which contains all the interactive logic.
  return <LoginClient />;
}
