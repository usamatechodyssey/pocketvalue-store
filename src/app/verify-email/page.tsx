// /src/app/verify-email/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyEmailClient from "./VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verify Your Email | PocketValue",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
