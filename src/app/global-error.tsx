"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Capture the error in Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* 
          This is the default Next.js error page component. 
          It's recommended to use this because it handles all cases automatically.
        */}
        <NextError statusCode={500} title="An error occurred on the client" />
      </body>
    </html>
  );
}
