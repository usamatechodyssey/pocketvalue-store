// const DEFAULT_TAGLINES = [
//   "Welcome to PocketValue - Premium Shopping Experience",
//   "100% Authentic Products Guaranteed",
//   "🇵🇰 Pakistan's Most Trusted Lifestyle Store",
//   "Elevate Your Everyday with PocketValue",
//   "Fast & Secure Delivery Nationwide",

// ];

// interface TopActionBarProps {
//   announcements?: string[];
// }

// const TopActionBar = ({ announcements }: TopActionBarProps) => {
//   const itemsToDisplay = (announcements && announcements.length > 0)
//     ? announcements
//     : DEFAULT_TAGLINES;

//   const duplicatedItems = [...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay, ...itemsToDisplay];

//   return (
//     // === CONTAINER WITH ANIMATED GRADIENT CLASS ===
//     <div className="relative w-full h-7 overflow-hidden z-50 shadow-sm animated-gradient-bg text-white">

//       <style jsx>{`
//         /* 1. TEXT SCROLLING ANIMATION */
//         @keyframes marquee-scroll {
//           0% { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }

//         /* 2. BACKGROUND COLOR FLOW ANIMATION */
//         @keyframes gradient-flow {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }

//         .animated-gradient-bg {
//           /* Blue -> Orange -> Dark Blue -> Light Orange */
//           background: linear-gradient(-45deg, #10589E, #083B6A, #E86627, #FF8F32);
//           background-size: 300% 300%; /* Zoomed in to allow movement */
//           animation: gradient-flow 10s ease-in-out infinite; /* Smooth flow */
//         }

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

//       {/* Glass Texture Overlay */}
//       <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />

//       <div className="marquee-wrapper relative flex h-full items-center max-w-[1920px] mx-auto cursor-default">

//         {/* Animated Text Track */}
//         <div className="marquee-track-animate">
//           {duplicatedItems.map((item, index) => (
//             <div key={`action-${index}`} className="flex items-center">
//               <span className="text-[11px] md:text-xs font-medium tracking-wide mx-8 whitespace-nowrap opacity-95 drop-shadow-sm">
//                 {item}
//               </span>
//               {/* Dot Separator */}
//               <span className="w-1 h-1 bg-white/60 rounded-full" aria-hidden="true" />
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

const DEFAULT_TAGLINES = [
  " Welcome to PocketValue - Premium Shopping Experience",
  "100% Authentic Products Guaranteed",
  "🇵🇰 Pakistan's Most Trusted Lifestyle Store",
  " Elevate Your Everyday with PocketValue",
  " Fast & Secure Delivery Nationwide",
];

interface TopActionBarProps {
  announcements?: string[];
}

const TopActionBar = ({ announcements }: TopActionBarProps) => {
  const itemsToDisplay =
    announcements && announcements.length > 0
      ? announcements
      : DEFAULT_TAGLINES;

  const duplicatedItems = [
    ...itemsToDisplay,
    ...itemsToDisplay,
    ...itemsToDisplay,
    ...itemsToDisplay,
  ];

  return (
    // === OUTER: FULL WIDTH BACKGROUND (No max-width here) ===
    <div className="relative w-full h-7 overflow-hidden z-50 shadow-sm animated-gradient-bg text-white">
      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-gradient-bg {
          background: linear-gradient(
            -45deg,
            #10589e,
            #083b6a,
            #e86627,
            #ff8f32
          );
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

      {/* === INNER: CONTENT CENTERED === */}
      <div className="relative h-full max-w-[1920px] mx-auto flex items-center px-4 md:px-8">
        <div className="marquee-wrapper w-full overflow-hidden cursor-default">
          <div className="marquee-track-animate">
            {duplicatedItems.map((item, index) => (
              <div key={`action-${index}`} className="flex items-center">
                <span className="text-[11px] md:text-xs font-medium tracking-wide mx-8 whitespace-nowrap opacity-95 drop-shadow-sm">
                  {item}
                </span>
                <span
                  className="w-1 h-1 bg-white/60 rounded-full"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopActionBar;
