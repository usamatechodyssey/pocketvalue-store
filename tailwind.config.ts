// tailwind.config.ts (THE FINAL, DOCS-APPROVED v4 VERSION)

import type { Config } from 'tailwindcss'

// Yeh file ab sirf plugins ke liye istemal hogi.
const config: Config = {
  // `content` aur `theme` ki v4 mein zaroorat nahi hai,
  // kyunke woh `globals.css` se sab kuch utha lega.
  
  plugins: [
    // Sirf plugins yahan aayenge
    require('@tailwindcss/typography'),
  ],
}
export default config