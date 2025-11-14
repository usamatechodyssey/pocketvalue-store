// /src/app/verify-phone/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyPhoneClient from "./VerifyPhoneClient";

export const metadata: Metadata = {
  title: "Verify Phone Number | PocketValue",
  robots: {
    index: false,
    follow: false,
  },
};

export default function VerifyPhonePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin text-brand-primary" size={40} />
        </div>
      }
    >
      <VerifyPhoneClient />
    </Suspense>
  );
}
