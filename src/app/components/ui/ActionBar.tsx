"use client";

import React, { useState, useEffect } from "react";

const DEFAULT_TAGLINES = [
  "🌟 Welcome to PocketValue - Premium Shopping Experience",
  "💎 100% Authentic Products Guaranteed",
  "🇵🇰 Pakistan's Most Trusted Lifestyle Store",
  "✨ Elevate Your Everyday with PocketValue",
  "📦 Fast & Secure Delivery Nationwide",
];

interface TopActionBarProps {
  announcements?: string[]; 
}

const TopActionBar = ({ announcements }: TopActionBarProps) => {
  const [mounted, setMounted] = useState(false);

  // Hydration Check
  useEffect(() => {
    setMounted(true);
  }, []);

  // === SKELETON STATE (Jab tak load na ho) ===
  if (!mounted) {
    return (
      // High Contrast Gray Bar (h-7 matches real height)
      <div className="w-full h-7 bg-gray-300 dark:bg-gray-800 animate-pulse" />
    );
  }

  // === REAL CONTENT ===
  const itemsToDisplay = (announcements && announcements.length > 0) 
    ? announcements 
    : DEFAULT_TAGLINES;

  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay];

  return (
    <div className="relative w-full h-7 overflow-hidden z-50 shadow-sm animated-gradient-bg text-white">
      
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-bg {
          background: linear-gradient(-45deg, #10589E, #083B6A, #E86627, #FF8F32);
          background-size: 300% 300%;
          animation: gradient-flow 10s ease-in-out infinite;
        }
        .marquee-track-animate {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
          will-change: transform;
        }
        .marquee-wrapper:hover .marquee-track-animate {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative h-full max-w-[1920px] mx-auto flex items-center px-4 md:px-8">
        <div className="marquee-wrapper w-full overflow-hidden cursor-default">
          <div className="marquee-track-animate">
            {duplicatedItems.map((item, index) => (
              <div key={`action-${index}`} className="flex items-center">
                <span className="text-[11px] md:text-xs font-medium tracking-wide mx-8 whitespace-nowrap opacity-95 drop-shadow-sm">
                  {item}
                </span>
                <span className="w-1 h-1 bg-white/60 rounded-full" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopActionBar;