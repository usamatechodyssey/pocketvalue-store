// /src/app/components/SentryTestButton.tsx
"use client";

// This component will only render in the development environment.
// In production, it will render nothing.
export default function SentryTestButton() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Frontend Test - " + new Date().toISOString());
        }}
        className="p-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700"
        title="Click to generate a test error for Sentry"
      >
        Test Sentry
      </button>
    </div>
  );
}