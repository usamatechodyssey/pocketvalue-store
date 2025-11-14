// /src/app/register/page.tsx

import type { Metadata } from "next";
import RegisterClient from "./RegisterClient"; // Import the client component

// This is a Server Component, so metadata is allowed here.
export const metadata: Metadata = {
  title: "Create Account | PocketValue",
  robots: {
    index: false, // Disallow search engines from indexing the registration page
    follow: true,
  },
};

export default function RegisterPage() {
  // Render the Client Component which contains all the interactive logic.
  return <RegisterClient />;
}