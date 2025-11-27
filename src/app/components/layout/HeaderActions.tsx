
// "use client";

// import Link from "next/link";
// import { User, Heart, ShoppingCart, LogIn } from "lucide-react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";

// export default function HeaderActions({ isMobile = false }) {
//   const { totalQuantities, wishlistItems } = useStateContext();
//   const { data: session, status } = useSession();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return <div className="w-20" />;

//   const Badge = ({ count }: { count: number }) => {
//     if (count <= 0) return null;
//     return (
//       <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
//         {count > 9 ? "9+" : count}
//       </span>
//     );
//   };

//   // === MOBILE VIEW ===
//   if (isMobile) {
//     return (
//       <div className="flex items-center gap-1">
//         <Link
//           href="/wishlist"
//           className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <Heart size={22} strokeWidth={2} />
//           <Badge count={wishlistItems.length} />
//         </Link>
//         <Link
//           href="/cart"
//           className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95"
//         >
//           <ShoppingCart size={22} strokeWidth={2} />
//           <Badge count={totalQuantities} />
//         </Link>
//       </div>
//     );
//   }

//   // === DESKTOP & TABLET VIEW ===
//   return (
//     <div className="flex items-center gap-4 lg:gap-6">
//       {/* 1. ACCOUNT (Visible on Tablet & Desktop now) */}
//       <Link
//         href={status === "authenticated" ? "/account" : "/login"}
//         className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
//       >
//         <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
//           {status === "authenticated" ? (
//             <User size={20} strokeWidth={2.5} />
//           ) : (
//             <LogIn size={20} strokeWidth={2.5} />
//           )}
//         </div>

//         {/* 🔥 CHANGE: 'hidden md:flex' (Tablet par bhi text dikhega) */}
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

//       {/* 2. WISHLIST */}
//       <Link
//         href="/wishlist"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <Heart
//           size={24}
//           className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
//           strokeWidth={2}
//         />
//         <Badge count={wishlistItems.length} />
//       </Link>

//       {/* 3. CART */}
//       <Link
//         href="/cart"
//         className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
//       >
//         <ShoppingCart
//           size={24}
//           className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
//           strokeWidth={2}
//         />
//         <Badge count={totalQuantities} />
//       </Link>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { User, Heart, ShoppingCart, LogIn } from "lucide-react";
import { useStateContext } from "@/app/context/StateContext";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function HeaderActions({ isMobile = false }) {
  const { totalQuantities, wishlistItems } = useStateContext();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // === SKELETON LOADING STATE ===
  if (!mounted) {
    return (
      <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-4 lg:gap-6'}`}>
        
        {/* 1. ACCOUNT SKELETON (Only show if NOT mobile) */}
        {!isMobile && (
            <div className="flex items-center gap-2 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                <div className="hidden md:flex flex-col gap-1">
                    <div className="w-12 h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
                </div>
            </div>
        )}
        
        {/* Divider (Desktop/Tablet Only) */}
        {!isMobile && <div className="hidden lg:block h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>}

        {/* 2. WISHLIST SKELETON */}
        <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
        
        {/* 3. CART SKELETON */}
        <div className={`bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse ${isMobile ? 'w-9 h-9' : 'w-10 h-10 lg:rounded-xl'}`}></div>
      </div>
    );
  }

  const Badge = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300">
        {count > 9 ? "9+" : count}
      </span>
    );
  };

  // === MOBILE VIEW ===
  if (isMobile) {
    return (
      <div className="flex items-center gap-1 animate-in fade-in duration-300">
        <Link href="/wishlist" className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95">
          <Heart size={22} strokeWidth={2} />
          <Badge count={wishlistItems.length} />
        </Link>
        <Link href="/cart" className="relative p-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all active:scale-95">
          <ShoppingCart size={22} strokeWidth={2} />
          <Badge count={totalQuantities} />
        </Link>
      </div>
    );
  }

  // === DESKTOP & TABLET VIEW ===
  return (
    <div className="flex items-center gap-4 lg:gap-6 animate-in fade-in duration-300">
      <Link
        href={status === "authenticated" ? "/account" : "/login"}
        className="group flex items-center gap-2 lg:gap-3 hover:opacity-90 transition-opacity"
      >
        <div className="p-2 lg:p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors border border-gray-100 dark:border-gray-700">
          {status === "authenticated" ? <User size={20} strokeWidth={2.5} /> : <LogIn size={20} strokeWidth={2.5} />}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide leading-tight">
            {status === "authenticated" ? "Welcome" : "Sign In"}
          </span>
          <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate max-w-[100px]">
            {status === "authenticated" && session?.user?.name
              ? session.user.name.split(" ")[0]
              : "Account"}
          </span>
        </div>
      </Link>

      <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden lg:block" />

      <Link href="/wishlist" className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
        <Heart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
        <Badge count={wishlistItems.length} />
      </Link>

      <Link href="/cart" className="group relative p-2 lg:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
        <ShoppingCart size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors" strokeWidth={2} />
        <Badge count={totalQuantities} />
      </Link>
    </div>
  );
}