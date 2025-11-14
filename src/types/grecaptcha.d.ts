// /src/types/grecaptcha.d.ts

/**
 * Declares the `grecaptcha` object on the global Window interface.
 * This object is made available by the Google reCAPTCHA script, but TypeScript
 * needs to be explicitly told about its shape to avoid compilation errors.
 */
declare global {
  interface Window {
    grecaptcha: {
      /**
       * Resets the reCAPTCHA widget with the given ID.
       * @param widgetId The ID of the widget to reset. Optional. If unspecified, the default widget is reset.
       */
      reset: (widgetId?: number) => void;
      // You can add other grecaptcha methods here if you use them, e.g., render, execute.
    };
  }
}

// This export statement makes the file a module, which is required for global declarations.
export {};