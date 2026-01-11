
// "use client";

// import { useEffect, useState } from "react";
// import { usePathname, useSearchParams } from "next/navigation";
// import LogoSpinner from "./LogoSpinner";
// import { AnimatePresence, motion } from "framer-motion";

// export default function GlobalLoader() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [isLoading, setIsLoading] = useState(false);

//   // 1. Navigation Complete hone par Loader band karein
//   useEffect(() => {
//     setIsLoading(false);
//   }, [pathname, searchParams]);

//   // 2. Smart Click Listener
//   useEffect(() => {
//     const handleAnchorClick = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       const anchor = target.closest("a"); // Link dhoondo

//       // Agar link nahi hai, ya naya tab khol raha hai, to ignore karo
//       if (!anchor) return;
//       if (anchor.target === "_blank") return;
      
//       // 🔥 SMART CHECK: Modifier Keys (Ctrl, Cmd, Shift, Alt)
//       // Agar user new tab mein khol raha hai to loader mat dikhao
//       if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

//       const href = anchor.getAttribute("href");
//       if (!href) return;

//       // 🔥 SMART CHECK: Ignore Hash Links (e.g., #reviews) & Mail/Tel
//       if (href.startsWith("#")) return;
//       if (href.startsWith("mailto:") || href.startsWith("tel:")) return;

//       // Agar same page link hai (e.g. /product/abc clicked on /product/abc), to ignore
//       // Lekin agar query params badal rahe hain to load karo
//       const currentUrl = window.location.pathname + window.location.search;
//       if (href === currentUrl) return;

//       // Agar sab checks pass ho gaye, to Loader dikhao
//       setIsLoading(true);
//     };

//     document.addEventListener("click", handleAnchorClick);
//     return () => {
//       document.removeEventListener("click", handleAnchorClick);
//     };
//   }, []);

//   return (
//     <AnimatePresence>
//       {isLoading && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.3 }} // Thoda slow fade for smoothness
//           // Highest Z-Index to cover everything
//           className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm cursor-wait"
//         >
//           {/* Bada size taake mobile aur desktop dono par clear dikhe */}
//           <LogoSpinner size="lg" />
          
//           {/* Optional: Branding Text */}
//           <motion.p 
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="mt-4 text-sm font-bold tracking-widest text-brand-primary uppercase"
//           >
//             PocketValue
//           </motion.p>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LogoSpinner from "./LogoSpinner";
import { AnimatePresence, motion } from "framer-motion";

export default function GlobalLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 FIX: Prevent Cascading Render (Synchronous State Update)
  // Jab Naya Page load ho jaye, to Loader band karo.
  // setTimeout use karne se ye update "Next Tick" par chali jati hai,
  // jo browser ko pehle page paint karne deti hai.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0); 
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // 2. Smart Click Listener (Links par click detect karne ke liye)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      // Current URL check (taake same page par loader na aye)
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      setIsLoading(true);
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm cursor-wait"
        >
          <LogoSpinner size="lg" />
          
      
        </motion.div>
      )}
    </AnimatePresence>
  );
}