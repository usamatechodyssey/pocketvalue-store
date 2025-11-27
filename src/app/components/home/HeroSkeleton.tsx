"use client";



export default function HeroSkeleton() {
  return (
    // === CHANGE 1: BASE COLOR DARKER (bg-gray-300 instead of 200) ===
    // Ye background thoda gehra hoga taake white background pe nazar aaye
    <div className="w-full relative bg-gray-400 dark:bg-gray-700 overflow-hidden">
      
      {/* Aspect Ratios (Same as before) */}
      <div className="block md:hidden w-full pb-[125%]"></div>
      <div className="hidden md:block w-full pb-[33.33%]"></div>
      
      {/* === CHANGE 2: STRONG PULSE LAYER === */}
      {/* Hum 'bg-white' use kar rahe hain. 
          Animation isay 10% se 80% opacity tak le jayegi.
          Result: Box Gray se White chamkega (High Contrast). 
      */}
      <div className="absolute inset-0 bg-white dark:bg-gray-600 animate-deep-breath" />

    </div>
  );
}