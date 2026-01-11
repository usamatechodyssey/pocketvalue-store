
// "use client";

// import React, { useState, useEffect } from "react";

// const DEFAULT_TAGLINES = [
//   "🌟 Welcome to PocketValue - Premium Shopping Experience",
//   "💎 100% Authentic Products Guaranteed",
//   "🇵🇰 Pakistan's Most Trusted Lifestyle Store",
//   "✨ Elevate Your Everyday with PocketValue",
//   "📦 Fast & Secure Delivery Nationwide",
// ];

// interface TopActionBarProps {
//   announcements?: string[]; 
// }

// const TopActionBar = ({ announcements }: TopActionBarProps) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return <div className="w-full h-7 bg-gray-300 dark:bg-gray-800 animate-pulse" />;
//   }

//   const itemsToDisplay = (announcements && announcements.length > 0) 
//     ? announcements 
//     : DEFAULT_TAGLINES;

//   const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay];

//   return (
//     // === SOLID BLUE BACKGROUND (bg-brand-secondary) ===
//     <div className="relative w-full h-7 overflow-hidden z-50 shadow-sm bg-brand-secondary text-white">
      
//       <style jsx>{`
//         @keyframes marquee-scroll {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
        
//         /* Sirf Scroll Animation Bachi Hai */
//         .marquee-track-animate {
//           display: flex;
//           width: max-content;
//           animation: marquee-scroll 40s linear infinite;
//           will-change: transform;
//         }
//         .marquee-wrapper:hover .marquee-track-animate {
//           animation-play-state: paused;
//         }
//       `}</style>

//       {/* Glass Overlay (Optional Shine) */}
//       <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

//       <div className="relative h-full max-w-[1920px] mx-auto flex items-center px-4 md:px-8">
//         <div className="marquee-wrapper w-full overflow-hidden cursor-default">
//           <div className="marquee-track-animate">
//             {duplicatedItems.map((item, index) => (
//               <div key={`action-${index}`} className="flex items-center">
//                 <span className="text-[11px] md:text-s font-normal tracking-wide mx-8 whitespace-nowrap opacity-95 drop-shadow-sm">
//                   {item}
//                 </span>
//                 <span className="w-1 h-1 bg-white/60 rounded-full" aria-hidden="true" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopActionBar;
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

  // 🔥 FIX: Prevent Cascading Render
  // setTimeout(..., 0) ensures the state update happens after the initial paint.
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    // Skeleton Loader (Matches height h-7)
    return <div className="w-full h-7 bg-gray-200 dark:bg-gray-800 animate-pulse" />;
  }

  const itemsToDisplay = (announcements && announcements.length > 0) 
    ? announcements 
    : DEFAULT_TAGLINES;

  const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay];

  return (
    <div className="relative w-full h-7 overflow-hidden z-50 shadow-sm bg-brand-secondary text-white">
      
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />

      <div className="relative h-full max-w-[1920px] mx-auto flex items-center px-4 md:px-8">
        <div className="marquee-wrapper w-full overflow-hidden cursor-default">
          <div className="marquee-track-animate">
            {duplicatedItems.map((item, index) => (
              <div key={`action-${index}`} className="flex items-center">
                <span className="text-[11px] md:text-xs font-normal tracking-wide mx-8 whitespace-nowrap opacity-95 drop-shadow-sm">
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