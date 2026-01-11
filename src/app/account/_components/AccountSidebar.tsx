// // /src/app/account/_components/AccountSidebar.tsx
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import Image from "next/image";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   User as UserIcon,
//   MapPin,
//   LogOut,
//   Loader2,
// } from "lucide-react";

// const sidebarNavItems = [
//   { title: "Dashboard", href: "/account", icon: LayoutDashboard },
//   { title: "My Orders", href: "/account/orders", icon: ShoppingBag },
//   { title: "My Profile", href: "/account/profile", icon: UserIcon },
//   { title: "Address Book", href: "/account/addresses", icon: MapPin },
//   { title: "Return", href: "/account/returns", icon: MapPin },
// ];

// export default function AccountSidebar() {
//   const pathname = usePathname();
//   const { data: session, status } = useSession();

//   // Loading state for user info
//   if (status === "loading") {
//     return (
//       <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin text-brand-primary" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
//       {/* User Info Box */}
//       <div className="p-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
//           {session?.user?.image ? (
//             <Image
//               src={session.user.image}
//               alt={session.user.name || "User"}
//               fill
//               sizes="48px"
//               className="object-cover"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full w-full">
//               <UserIcon className="h-6 w-6 text-gray-400" />
//             </div>
//           )}
//         </div>
//         <div>
//           <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate">
//             {session?.user?.name || "Valued Customer"}
//           </h3>
//           <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
//             {session?.user?.email}
//           </p>
//         </div>
//       </div>

//       {/* Navigation Links */}
//       <nav className="p-4 grow">
//         <ul className="space-y-1">
//           {sidebarNavItems.map((item) => {
//             // More robust check: also highlights child routes like /account/orders/[orderId]
//             const isActive =
//               item.href === "/account"
//                 ? pathname === item.href
//                 : pathname.startsWith(item.href);

//             return (
//               <li key={item.title}>
//                 <Link
//                   href={item.href}
//                   className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-brand-primary/10 text-brand-primary"
//                       : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
//                   }`}
//                 >
//                   {/* Active state indicator bar */}
//                   {isActive && (
//                     <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-brand-primary rounded-r-full"></div>
//                   )}
//                   <item.icon size={18} />
//                   <span>{item.title}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Logout Button */}
//       <div className="border-t border-gray-200 dark:border-gray-700 p-2">
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 transition-colors"
//         >
//           <LogOut size={18} />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// }
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { signOut, useSession } from "next-auth/react";
// import Image from "next/image";
// import {
//   LayoutDashboard,
//   ShoppingBag,
//   User,
//   MapPin,
//   LogOut,
//   Loader2,
//   ChevronRight,
//   RefreshCcw,
//   Heart,
//   LogIn
// } from "lucide-react";

// const sidebarNavItems = [
//   { title: "Dashboard", href: "/account", icon: LayoutDashboard },
//   { title: "My Orders", href: "/account/orders", icon: ShoppingBag },
//   { title: "My Profile", href: "/account/profile", icon: User },
//   { title: "Wishlist", href: "/wishlist", icon: Heart },
//   { title: "Address Book", href: "/account/addresses", icon: MapPin },
//   { title: "Returns", href: "/account/returns", icon: RefreshCcw },
// ];

// export default function AccountSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
//   const pathname = usePathname();
//   const { data: session, status } = useSession();

//   // Loading Skeleton
//   if (status === "loading") {
//     return (
//       <div className="p-8 flex justify-center items-center h-full">
//         <Loader2 className="animate-spin text-brand-primary" size={32} />
//       </div>
//     );
//   }

//   // === GUEST USER VIEW (Not Logged In) ===
//   if (status === "unauthenticated") {
//       return (
//         <div className="flex flex-col h-full bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent p-5">
//             <div className="text-center py-10 space-y-4">
//                 <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
//                     <User size={40} />
//                 </div>
//                 <div>
//                     <h3 className="text-xl font-bold text-gray-900 dark:text-white">Welcome Guest</h3>
//                     <p className="text-sm text-gray-500 mt-1">Login to access your profile & orders.</p>
//                 </div>
//                 <Link 
//                     href="/login"
//                     onClick={onLinkClick}
//                     className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:bg-brand-primary-hover transition-colors"
//                 >
//                     <LogIn size={20} /> Login / Register
//                 </Link>
//             </div>
//         </div>
//       );
//   }

//   // === AUTHENTICATED USER VIEW ===
//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent">
      
//       {/* 1. USER PROFILE CARD */}
//       <div className="p-5 lg:p-0 mb-6">
//         <div className="flex items-center gap-4 p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
//             <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md shrink-0 bg-gray-200 flex items-center justify-center">
//             {session?.user?.image ? (
//                 <Image
//                 src={session.user.image}
//                 alt={session.user.name || "User"}
//                 fill
//                 sizes="56px"
//                 className="object-cover"
//                 />
//             ) : (
//                 <span className="text-xl font-bold text-gray-500">
//                     {session?.user?.name?.[0] || "U"}
//                 </span>
//             )}
//             </div>
//             <div className="overflow-hidden">
//             <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
//                 {session?.user?.name || "Valued Customer"}
//             </h3>
//             <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
//                 {session?.user?.email}
//             </p>
//             </div>
//         </div>
//       </div>

//       {/* 2. NAVIGATION MENU */}
//       <nav className="px-5 lg:px-0 grow">
//         <ul className="space-y-2">
//           {sidebarNavItems.map((item) => {
//             const isActive = item.href === "/account"
//                 ? pathname === item.href
//                 : pathname.startsWith(item.href);

//             return (
//               <li key={item.title}>
//                 <Link
//                   href={item.href}
//                   onClick={onLinkClick} 
//                   className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 border
//                     ${
//                       isActive
//                         ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
//                         : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-200"
//                     }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-brand-primary"} />
//                     <span>{item.title}</span>
//                   </div>
                  
//                   {!isActive && (
//                     <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* 3. LOGOUT BUTTON */}
//       <div className="p-5 lg:px-0 mt-4 lg:mt-6 shrink-0">
//         <button
//           onClick={() => signOut({ callbackUrl: "/" })}
//           className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 transition-all active:scale-95"
//         >
//           <LogOut size={18} />
//           <span>Sign Out</span>
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  MapPin,
  LogOut,
  Loader2,
  ChevronRight,
  RefreshCcw,
  Heart,
  LogIn
} from "lucide-react";

const sidebarNavItems = [
  { title: "Dashboard", href: "/account", icon: LayoutDashboard },
  { title: "My Orders", href: "/account/orders", icon: ShoppingBag },
  { title: "My Profile", href: "/account/profile", icon: User },
  { title: "Wishlist", href: "/wishlist", icon: Heart },
  { title: "Address Book", href: "/account/addresses", icon: MapPin },
  { title: "Returns", href: "/account/returns", icon: RefreshCcw },
];

export default function AccountSidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  // FIX: Force client-side render only
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔴 HYDRATION FIX: Show loader until mounted on client
  if (!mounted || status === "loading") {
    return (
      <div className="p-8 flex justify-center items-center h-full min-h-[300px]">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  // === GUEST USER VIEW ===
  if (status === "unauthenticated") {
      return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent p-5">
            <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400">
                    <User size={40} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Welcome Guest</h3>
                    <p className="text-sm text-gray-500 mt-1">Login to access your profile & orders.</p>
                </div>
                <Link 
                    href="/login"
                    onClick={onLinkClick}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md hover:bg-brand-primary-hover transition-colors"
                >
                    <LogIn size={20} /> Login / Register
                </Link>
            </div>
        </div>
      );
  }

  // === AUTHENTICATED USER VIEW ===
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent">
      
      {/* 1. USER PROFILE CARD */}
      <div className="p-5 lg:p-0 mb-6">
        <div className="flex items-center gap-4 p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
            <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-md shrink-0 bg-gray-200 flex items-center justify-center">
            {session?.user?.image ? (
                <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                sizes="56px"
                className="object-cover"
                />
            ) : (
                <span className="text-xl font-bold text-gray-500">
                    {session?.user?.name?.[0] || "U"}
                </span>
            )}
            </div>
            <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">
                {session?.user?.name || "Valued Customer"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {session?.user?.email}
            </p>
            </div>
        </div>
      </div>

      {/* 2. NAVIGATION MENU */}
      <nav className="px-5 lg:px-0 grow">
        <ul className="space-y-2">
          {sidebarNavItems.map((item) => {
            const isActive = item.href === "/account"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  onClick={onLinkClick} 
                  className={`group relative flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 border
                    ${
                      isActive
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-200"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-brand-primary"} />
                    <span>{item.title}</span>
                  </div>
                  
                  {!isActive && (
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. LOGOUT BUTTON */}
      <div className="p-5 lg:px-0 mt-4 lg:mt-6 shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 transition-all active:scale-95"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}