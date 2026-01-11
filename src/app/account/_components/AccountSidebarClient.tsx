// // /src/app/account/_components/AccountSidebarClient.tsx
// "use client";

// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Menu, X } from "lucide-react";
// import AccountSidebar from "./AccountSidebar"; // We will reuse the main sidebar component

// export default function AccountSidebarClient({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div>
//       {/* --- Mobile Header & Hamburger Menu --- */}
//       {/* This header is only visible on screens smaller than lg */}
//       <div className="lg:hidden mb-6 flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         <h2 className="text-lg font-bold">Account Menu</h2>
//         <button
//           onClick={() => setIsSidebarOpen(true)}
//           className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
//           aria-label="Open account menu"
//         >
//           <Menu size={24} />
//         </button>
//       </div>

//       {/* --- Mobile Off-Canvas Sidebar --- */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <>
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               onClick={() => setIsSidebarOpen(false)}
//               className="fixed inset-0 bg-black/60 z-40 lg:hidden"
//               aria-hidden="true"
//             />
//             {/* Sidebar Panel */}
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//               className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden"
//             >
//               <AccountSidebar />
//               {/* Close Button */}
//               <button
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 aria-label="Close menu"
//               >
//                 <X size={24} />
//               </button>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       {/* --- Main Content Area --- */}
//       {/* This div will contain the actual page content (Profile, Orders, etc.) */}
//       <div className="bg-white dark:bg-gray-800/50 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
//         {children}
//       </div>
//     </div>
//   );
// }
"use client";

import AccountSidebar from "./AccountSidebar";

export default function AccountSidebarClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* 
          ❌ OLD MOBILE HEADER REMOVED 
          Kyunke ab Mobile Profile Sidebar "Bottom Nav" se khulta hai.
      */}

      {/* === 1. DESKTOP SIDEBAR (Visible only on Large Screens) === */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28">
            <AccountSidebar />
        </div>
      </div>

      {/* === 2. MAIN CONTENT AREA === */}
      {/* Mobile par sirf ye dikhega, Desktop par ye Right side par hoga */}
      <div className="grow min-h-[500px]">
        {children}
      </div>
      
    </div>
  );
}