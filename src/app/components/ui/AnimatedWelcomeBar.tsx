// app/components/AnimatedWelcomeBar.tsx

"use client";

import { useState, useEffect } from "react";

export default function AnimatedWelcomeBar() {
  const [isVisible, setIsVisible] = useState(true);

  // === NAYA TIMER WALA EFFECT ===
  useEffect(() => {
    // Ek timer set karein jo 5 second (5000ms) ke baad chalega
    const timer = setTimeout(() => {
      // 5 second ke baad, bar ko hide kar do
      setIsVisible(false);
    }, 7000); // 5000 milliseconds = 5 seconds

    // Cleanup Function: Yeh zaroori hai taake agar user page band kar de to memory leak na ho
    return () => clearTimeout(timer);
  }, []); // Empty array ka matlab hai ke yeh effect sirf component load hone par ek baar chalega

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border-b border-white/20 dark:border-gray-500/20 transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center p-4 h-20">
        <div className="flex flex-col items-center">
          <div className="text-black dark:text-amber-400">
            <svg
              width="200"
              height="32"
              viewBox="0 20 800 100"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="400"
                y="95"
                textAnchor="middle"
                fontSize="100"
                fontFamily="serif"
              >
                ﷽
              </text>
            </svg>
          </div>

          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 tracking-wide">
            In the name of Allah, the Most Gracious, the Most Merciful.
          </p>
        </div>
      </div>
    </div>
  );
}
