// This file configures the Sentry browser client.
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// === YEH NAYI LINE ADD KAREIN ===
// This export instruments router navigations for performance monitoring.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;