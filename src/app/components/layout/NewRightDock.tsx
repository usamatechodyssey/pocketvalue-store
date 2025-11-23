// // /src/app/components/layout/NewRightDock.tsx

// "use client";

// import ThemeSwitcher from "./ThemeSwitcher";
// import BackToTopButton from "../ui/BackToTopButton";
// import { Bell, HelpCircle } from "lucide-react";
// import Link from "next/link";

// interface NewRightDockProps {
//   topOffset: number;
// }

// export default function NewRightDock({ topOffset }: NewRightDockProps) {
//   return (
//     // Yeh component ab sirf 'lg' (desktop) screens par hi render hoga
//     <aside
//       className="hidden lg:flex flex-col fixed right-0 w-16 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800
//       transition-all duration-300 ease-out z-30"
//       style={{
//         top: `${topOffset}px`,
//         height: `calc(100vh - ${topOffset}px)`,
//       }}
//     >
//       {/* Top Icons */}
//       <div className="grow p-2 pt-8 flex flex-col items-center gap-2">
//         {/* === LANGUAGE SWITCHER YAHAN ADD KIYA GAYA HAI === */}
//         {/* Iska design baaki icons se a a a haat kar hoga taake a a a saaf nazar aaye */}

//         <button className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-primary">
//           <Bell size={20} />
//         </button>
//         <Link
//           href="/faq"
//           aria-label="Help Center"
//           className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-primary"
//         >
//           <HelpCircle size={20} />
//         </Link>
//       </div>

//       {/* Bottom Utility Icons */}
//       <div className="shrink-0 p-2 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
//         <BackToTopButton />
//         <ThemeSwitcher />
//       </div>
//     </aside>
//   );
// }
"use client";

import ThemeSwitcher from "./ThemeSwitcher";
import BackToTopButton from "../ui/BackToTopButton";
import { Bell, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

interface NewRightDockProps {
  topOffset: number;
}

export default function NewRightDock({ topOffset }: NewRightDockProps) {
  return (
    // === DESKTOP UTILITY DOCK ===
    // Width increased to w-20 to match Left Sidebar
    <aside
      className="hidden lg:flex flex-col fixed right-0 w-16 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-out z-30 shadow-[-2px_0_10px_rgba(0,0,0,0.02)]"
      style={{
        top: `${topOffset}px`,
        height: `calc(100vh - ${topOffset}px)`,
      }}
    >
      {/* Top Icons Section */}
      <div className="grow pt-8 flex flex-col items-center gap-6">
        
        {/* Help / Support */}
        <Link
          href="/faq"
          aria-label="Help Center"
          className="group relative p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <HelpCircle size={24} strokeWidth={1.5} />
          {/* Tooltip */}
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Help Center
          </span>
        </Link>

        {/* Notifications (Dummy for now) */}
        <button className="group relative p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 text-gray-400 hover:text-brand-primary">
          <Bell size={24} strokeWidth={1.5} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
          <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Notifications
          </span>
        </button>

        {/* WhatsApp / Contact */}
        <Link
            href="/contact-us"
            className="group relative p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
        >
            <MessageCircle size={24} strokeWidth={1.5} />
             <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Contact Us
          </span>
        </Link>

      </div>

      {/* Bottom Utility Section */}
      <div className="shrink-0 p-4 pb-8 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <ThemeSwitcher />
        <BackToTopButton />
      </div>
    </aside>
  );
}