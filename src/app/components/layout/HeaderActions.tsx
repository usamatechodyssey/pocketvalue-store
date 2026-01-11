
// "use client";

// import Link from "next/link";
// import { User, Heart, ShoppingCart, LogIn } from "lucide-react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// // 🔥 FIX: Component bahar nikal diya (Performance Improvement)
// // Ab ye bar bar re-render nahi hoga
// const Badge = ({ count }: { count: number }) => {
//   if (count <= 0) return null;
//   return (
//     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
//       {count > 9 ? "9+" : count}
//     </span>
//   );
// };

// export default function HeaderActions({ isMobile = false }) {
//   const { totalQuantities, wishlistItems } = useStateContext();
//   const { data: session, status } = useSession();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // === SKELETON LOADING STATE ===
//   if (!mounted) {
//     return (
//       <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-4 lg:gap-6'}`}>
        
//         {/* 1. ACCOUNT SKELETON (Only show if NOT mobile) */}
//         {!isMobile && (
//             <div className="flex items-center gap-2 animate-pulse">
//                 <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
//                 <div className="hidden md:flex flex-col gap-1">
//                     <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                 </div>
//             </div>
//         )}
        
//         {/* Divider (Desktop/Tablet Only) */}
//         {!isMobile && <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>}

//         {/* 2. WISHLIST SKELETON */}
//         <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
        
//         {/* 3. CART SKELETON */}
//         <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
//       </div>
//     );
//   }

//   // === MOBILE VIEW ===
//   if (isMobile) {
//     return (
//       <div className="flex items-center gap-1 animate-in fade-in duration-300">
//         <Link 
//             href="/wishlist" 
//             aria-label="View Wishlist"
//             className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <Heart size={22} strokeWidth={2} />
//           <Badge count={wishlistItems.length} />
//         </Link>
//         <Link 
//             href="/cart" 
//             aria-label="View Shopping Cart"
//             className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <ShoppingCart size={22} strokeWidth={2} />
//           <Badge count={totalQuantities} />
//         </Link>
//       </div>
//     );
//   }

//   // === DESKTOP & TABLET VIEW ===
//   return (
//     <div className="flex items-center gap-4 lg:gap-6 animate-in fade-in duration-300">
//       <Link
//         href={status === "authenticated" ? "/account" : "/login"}
//         aria-label={status === "authenticated" ? "My Account" : "Login to Account"}
//         className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
//       >
//         <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
//           {status === "authenticated" ? <User size={20} strokeWidth={2.5} /> : <LogIn size={20} strokeWidth={2.5} />}
//         </div>
//         <div className="hidden md:flex flex-col">
//           <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-tight">
//             {status === "authenticated" ? "Welcome" : "Sign In"}
//           </span>
//           <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[100px]">
//             {status === "authenticated" && session?.user?.name
//               ? session.user.name.split(" ")[0]
//               : "Account"}
//           </span>
//         </div>
//       </Link>

//       <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

//       <Link 
//         href="/wishlist" 
//         aria-label="View Wishlist"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <Heart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
//         <Badge count={wishlistItems.length} />
//       </Link>

//       <Link 
//         href="/cart" 
//         aria-label="View Shopping Cart"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <ShoppingCart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
//         <Badge count={totalQuantities} />
//       </Link>
//     </div>
//   );
// }
// // /src/app/components/layout/HeaderActions.tsx (FIXED)

// "use client";

// import Link from "next/link";
// import { User, Heart, ShoppingCart, LogIn } from "lucide-react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// // Independent Component to prevent parent re-renders
// const Badge = ({ count }: { count: number }) => {
//   if (count <= 0) return null;
//   return (
//     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
//       {count > 9 ? "9+" : count}
//     </span>
//   );
// };

// export default function HeaderActions({ isMobile = false }) {
//   const { totalQuantities, wishlistItems } = useStateContext();
//   const { data: session, status } = useSession();
//   const [mounted, setMounted] = useState(false);

//   // --- HYDRATION FIX ---
//   // This ensures the component only renders client-specific content after mounting
//   // preventing hydration mismatch errors.
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // === SKELETON LOADING STATE (Prevents Hydration Mismatch) ===
//   if (!mounted) {
//     return (
//       <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-4 lg:gap-6'}`}>
//         {!isMobile && (
//             <div className="flex items-center gap-2 animate-pulse">
//                 <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
//                 <div className="hidden md:flex flex-col gap-1">
//                     <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                     <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
//                 </div>
//             </div>
//         )}
//         {!isMobile && <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>}
//         <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
//         <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
//       </div>
//     );
//   }

//   // === MOBILE VIEW ===
//   if (isMobile) {
//     return (
//       <div className="flex items-center gap-1 animate-in fade-in duration-300">
//         <Link 
//             href="/wishlist" 
//             aria-label="View Wishlist"
//             className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <Heart size={22} strokeWidth={2} />
//           <Badge count={wishlistItems.length} />
//         </Link>
//         <Link 
//             href="/cart" 
//             aria-label="View Shopping Cart"
//             className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <ShoppingCart size={22} strokeWidth={2} />
//           <Badge count={totalQuantities} />
//         </Link>
//       </div>
//     );
//   }

//   // === DESKTOP & TABLET VIEW ===
//   return (
//     <div className="flex items-center gap-4 lg:gap-6 animate-in fade-in duration-300">
//       <Link
//         href={status === "authenticated" ? "/account" : "/login"}
//         aria-label={status === "authenticated" ? "My Account" : "Login to Account"}
//         className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
//       >
//         <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
//           {status === "authenticated" ? <User size={20} strokeWidth={2.5} /> : <LogIn size={20} strokeWidth={2.5} />}
//         </div>
//         <div className="hidden md:flex flex-col">
//           <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-tight">
//             {status === "authenticated" ? "Welcome" : "Sign In"}
//           </span>
//           <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[100px]">
//             {status === "authenticated" && session?.user?.name
//               ? session.user.name.split(" ")[0]
//               : "Account"}
//           </span>
//         </div>
//       </Link>

//       <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

//       <Link 
//         href="/wishlist" 
//         aria-label="View Wishlist"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <Heart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
//         <Badge count={wishlistItems.length} />
//       </Link>

//       <Link 
//         href="/cart" 
//         aria-label="View Shopping Cart"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <ShoppingCart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
//         <Badge count={totalQuantities} />
//       </Link>
//     </div>
//   );
// }
// "use client";

// import Link from "next/link";
// import { User, Heart, ShoppingCart, LogIn } from "lucide-react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// // Independent Component to prevent parent re-renders
// const Badge = ({ count }: { count: number }) => {
//   if (count <= 0) return null;
//   return (
//     <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
//       {count > 9 ? "9+" : count}
//     </span>
//   );
// };

// export default function HeaderActions({ isMobile = false }) {
//   const { totalQuantities, wishlistItems } = useStateContext();
//   const { data: session, status } = useSession();
//   const [mounted, setMounted] = useState(false);

//   // ✅ FIX: "Calling setState synchronously within an effect"
//   // Using setTimeout(..., 0) moves the update to the next event loop tick.
//   // This allows the initial HTML (empty icons) to paint immediately (Super Fast),
//   // then hydrates the badges/user info without blocking the main thread.
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setMounted(true);
//     }, 0);
//     return () => clearTimeout(timer);
//   }, []);

//   // === MOBILE VIEW ===
//   if (isMobile) {
//     return (
//       <div className="flex items-center gap-1">
//         <Link
//           href="/wishlist"
//           aria-label="View Wishlist"
//           className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <Heart size={22} strokeWidth={2} />
//           {/* Only render badge after mount to prevent hydration mismatch */}
//           {mounted && <Badge count={wishlistItems.length} />}
//         </Link>
//         <Link
//           href="/cart"
//           aria-label="View Shopping Cart"
//           className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <ShoppingCart size={22} strokeWidth={2} />
//           {mounted && <Badge count={totalQuantities} />}
//         </Link>
//       </div>
//     );
//   }

//   // === DESKTOP & TABLET VIEW ===
//   return (
//     <div className="flex items-center gap-4 lg:gap-6">
//       <Link
//         href={status === "authenticated" ? "/account" : "/login"}
//         aria-label={
//           status === "authenticated" ? "My Account" : "Login to Account"
//         }
//         className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
//       >
//         <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
//           {/* Switch icon based on status, default to User for immediate render */}
//           {status === "authenticated" ? (
//             <User size={20} strokeWidth={2.5} />
//           ) : (
//             <User size={20} strokeWidth={2.5} />
//           )}
//         </div>
//         <div className="hidden md:flex flex-col">
//           <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-tight">
//             {mounted && status === "authenticated" ? "Welcome" : "Sign In"}
//           </span>
//           <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[100px] min-h-5">
//             {/* Show name if auth, otherwise 'Account'. Skeleton effect removed for speed. */}
//             {mounted && status === "authenticated" && session?.user?.name
//               ? session.user.name.split(" ")[0]
//               : "Account"}
//           </span>
//         </div>
//       </Link>

//       <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

//       <Link
//         href="/wishlist"
//         aria-label="View Wishlist"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <Heart
//           size={24}
//           className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
//           strokeWidth={2}
//         />
//         {mounted && <Badge count={wishlistItems.length} />}
//       </Link>

//       <Link
//         href="/cart"
//         aria-label="View Shopping Cart"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <ShoppingCart
//           size={24}
//           className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
//           strokeWidth={2}
//         />
//         {mounted && <Badge count={totalQuantities} />}
//       </Link>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { User, Heart, ShoppingCart } from "lucide-react";
import { useStateContext } from "@/app/context/StateContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Badge = ({ count }: { count: number }) => {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
      {count > 9 ? "9+" : count}
    </span>
  );
};

export default function HeaderActions({ isMobile = false }) {
  const { totalQuantities, wishlistItems } = useStateContext();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // FIX: Force render only after mount to sync server/client HTML
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe Values (Server doesn't know about them, so we keep them empty initially)
  const cartCount = mounted ? totalQuantities : 0;
  const wishCount = mounted ? wishlistItems.length : 0;
  const userName = mounted && session?.user?.name ? session.user.name.split(" ")[0] : "Account";
  const isAuthenticated = mounted && status === "authenticated";

  // === MOBILE VIEW ===
  if (isMobile) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/wishlist"
          aria-label="View Wishlist"
          className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
        >
          <Heart size={22} strokeWidth={2} />
          {mounted && <Badge count={wishCount} />}
        </Link>
        <Link
          href="/cart"
          aria-label="View Shopping Cart"
          className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
        >
          <ShoppingCart size={22} strokeWidth={2} />
          {mounted && <Badge count={cartCount} />}
        </Link>
      </div>
    );
  }

  // === DESKTOP VIEW ===
  return (
    <div className="flex items-center gap-4 lg:gap-6">
      
      {/* 🔴 HYDRATION FIX: Use 'mounted' check for conditional Link */}
      {mounted ? (
        <Link
          href={isAuthenticated ? "/account" : "/login"}
          className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
          aria-label={isAuthenticated ? "My Account" : "Login"}
        >
          <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
            <User size={20} strokeWidth={2.5} />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-tight">
              {isAuthenticated ? "Welcome" : "Sign In"}
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[100px] min-h-5">
              {isAuthenticated ? userName : "Account"}
            </span>
          </div>
        </Link>
      ) : (
        // SERVER SKELETON (Prevents Mismatch)
        <div className="flex items-center gap-3 opacity-50">
           <div className="p-2.5 bg-gray-100 rounded-full"><User size={20} /></div>
           <div className="hidden md:flex flex-col gap-1">
              <div className="h-3 w-10 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
           </div>
        </div>
      )}

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

      <Link
        href="/wishlist"
        aria-label="View Wishlist"
        className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <Heart
          size={24}
          className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
          strokeWidth={2}
        />
        {mounted && <Badge count={wishCount} />}
      </Link>

      <Link
        href="/cart"
        aria-label="View Shopping Cart"
        className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
      >
        <ShoppingCart
          size={24}
          className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
          strokeWidth={2}
        />
        {mounted && <Badge count={cartCount} />}
      </Link>
    </div>
  );
}