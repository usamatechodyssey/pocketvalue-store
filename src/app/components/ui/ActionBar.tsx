// app/components/ui/ActionBar.tsx (THE FINAL ANIMATED VERSION)

import React from "react";

const TEXT_ITEMS = [
  "Zindagi Delivered: Free Delivery over Rs.999",
  "Quality You Can Trust",
  "24/7 WhatsApp Support",
];

const TopActionBar = () => {
  // Text ko 4 baar repeat karein taake lambi marquee ban sake
  const duplicatedItems = Array(4).fill(TEXT_ITEMS).flat();

  return (
    <>
      {/* Hum CSS styles ko component ke andar hi define kar rahe hain */}
      <style jsx global>{`
        @keyframes marquee-flow {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); } /* Sirf 50% move karega taake seamless loop bane */
        }
        
        @keyframes gradient-flow-subtle {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animated-action-bar {
          background: linear-gradient(-45deg, #10589E, #083B6A, #E86627, #FF8F32);
          background-size: 400% 400%;
          animation: gradient-flow-subtle 15s ease-in-out infinite;
        }

        .marquee-track {
          animation: marquee-flow 40s linear infinite;
        }
      `}</style>
      
      {/* === YAHAN ASAL DESIGN HAI === */}
      <div className="animated-action-bar text-white w-full h-7 overflow-hidden">
        <div className="relative flex h-full items-center">
          
          {/* Hum ab 2 alag-alag tracks ke bajaye, ek hi track ko 2 baar render karenge */}
          {/* Is se code saaf-suthra rehta hai */}
          <div className="w-max flex items-center absolute top-0 left-0 marquee-track">
            {/* Track 1 */}
            {duplicatedItems.map((item, index) => (
              <React.Fragment key={`trackA-${index}`}>
                <p className="text-xs font-semibold tracking-wide mx-4 flex-shrink-0">{item}</p>
                {index < duplicatedItems.length - 1 && (
                  <span className="text-white/50 mx-2 flex-shrink-0" aria-hidden="true">•</span>
                )}
              </React.Fragment>
            ))}
            {/* Track 2 (for seamless loop) */}
            {duplicatedItems.map((item, index) => (
              <React.Fragment key={`trackB-${index}`}>
                <p className="text-xs font-semibold tracking-wide mx-4 flex-shrink-0">{item}</p>
                {index < duplicatedItems.length - 1 && (
                  <span className="text-white/50 mx-2 flex-shrink-0" aria-hidden="true">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default TopActionBar;