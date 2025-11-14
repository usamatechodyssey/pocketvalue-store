import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// === YEH NAYA EXPORT ADD HUA HAI ===
// This captures errors that happen during a server-side render
export const onRequestError = Sentry.captureRequestError;