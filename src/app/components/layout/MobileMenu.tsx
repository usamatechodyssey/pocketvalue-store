
// // app/components/layout/MobileMenu.tsx (CRITICAL FIX APPLIED)

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { FiX, FiChevronDown } from "react-icons/fi";

// // Mocking these links for completeness
// const SECONDARY_NAV_LINKS = [
//     { name: "Today's Deals", href: "/deals" },
//     { name: "Customer Service", href: "/customer-service" },
//     { name: "Gift Cards", href: "/gift-cards" },
//     { name: "Sell on PocketValue", href: "/sell" },
//     { name: "About Us", href: "/about-us" },
//     { name: "Contact Us", href: "/contact-us" },
// ];

// interface MobileMenuProps {
//   categories: SanityCategory[];
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function MobileMenu({
//   categories,
//   isOpen,
//   onClose,
// }: MobileMenuProps) {
//   const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

//   const toggleSubMenu = (categoryId: string) => {
//     setOpenSubMenu(openSubMenu === categoryId ? null : categoryId);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={onClose}
//             // === md:hidden REMOVED FROM HERE ===
//             className="fixed inset-0 bg-black/50 z-40"
//             aria-hidden="true"
//           />
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             // === md:hidden REMOVED FROM HERE ===
//             className="fixed top-0 left-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 z-50 flex flex-col"
//           >
//             <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
//               <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Menu</h2>
//               <button onClick={onClose} className="p-2">
//                 <FiX size={24} className="text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>
//             <nav className="grow overflow-y-auto p-4">
//               <ul className="space-y-2">
//                 {categories.map((cat) => (
//                   <li
//                     key={cat._id}
//                     className="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
//                   >
//                     {cat.subCategories && cat.subCategories.length > 0 ? (
//                       <div>
//                         <button
//                           onClick={() => toggleSubMenu(cat._id)}
//                           className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-700 dark:text-gray-300"
//                         >
//                           <span>{cat.name}</span>
//                           <FiChevronDown
//                             className={`transition-transform duration-200 ${
//                               openSubMenu === cat._id ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                         <AnimatePresence>
//                           {openSubMenu === cat._id && (
//                             <motion.ul
//                               initial={{ height: 0, opacity: 0 }}
//                               animate={{ height: "auto", opacity: 1 }}
//                               exit={{ height: 0, opacity: 0 }}
//                               className="overflow-hidden pl-4"
//                             >
//                               {cat.subCategories.map((sub) => (
//                                 <li key={sub._id}>
//                                   <Link
//                                     href={`/category/${cat.slug}/${sub.slug}`}
//                                     onClick={onClose}
//                                     className="block py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500"
//                                   >
//                                     {sub.name}
//                                   </Link>
//                                 </li>
//                               ))}
//                             </motion.ul>
//                           )}
//                         </AnimatePresence>
//                       </div>
//                     ) : (
//                       <Link
//                         href={`/category/${cat.slug}`}
//                         onClick={onClose}
//                         className="block py-3 font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
//                       >
//                         {cat.name}
//                       </Link>
//                     )}
//                   </li>
//                 ))}
//                  <li className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
//                     <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">More</p>
//                  </li>
//                  {SECONDARY_NAV_LINKS.map(link => (
//                     <li key={link.name} className="border-b border-gray-200 dark:border-gray-800 last:border-b-0">
//                          <Link
//                             href={link.href}
//                             onClick={onClose}
//                             className="block py-3 font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500"
//                         >
//                             {link.name}
//                         </Link>
//                     </li>
//                  ))}
//               </ul>
//             </nav>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SanityCategory } from "@/sanity/types/product_types";
import { 
  X, ChevronDown, ChevronRight, User, LogOut, HelpCircle, 
  Package, Info, Phone, Tag, Gift, DollarSign, Sun, Moon 
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "next-themes";

const QUICK_LINKS = [
    { name: "Today's Deals", href: "/deals", icon: Tag, highlight: true },
    { name: "Gift Cards", href: "/gift-cards", icon: Gift },
    { name: "Sell on PocketValue", href: "/sell", icon: DollarSign },
];

const UTILITY_LINKS = [
    { name: "Track Order", href: "/account/orders", icon: Package },
    { name: "Help & Support", href: "/faq", icon: HelpCircle },
    { name: "About Us", href: "/about-us", icon: Info },
    { name: "Contact Us", href: "/contact-us", icon: Phone },
];

interface MobileMenuProps {
  categories: SanityCategory[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ categories, isOpen, onClose }: MobileMenuProps) {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const toggleSubMenu = (categoryId: string) => {
    setOpenSubMenu(openSubMenu === categoryId ? null : categoryId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-dvh w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8">
                        <Image src="/usamabrand.svg" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Menu</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>
              </div>

              {/* USER CARD */}
              {status === "authenticated" ? (
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                        {session?.user?.image ? (
                            <Image src={session.user.image} alt="User" width={40} height={40} className="rounded-full" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                    <div className="grow overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                    </div>
                </div>
              ) : (
                <Link href="/login" onClick={onClose} className="flex items-center justify-between w-full p-4 bg-brand-primary text-white rounded-xl shadow-md active:scale-95 transition-transform">
                    <div className="flex items-center gap-3">
                        <div className="p-1 bg-white/20 rounded-full"><User size={18} /></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">Sign In / Register</span>
                            <span className="text-[10px] opacity-90">Access your orders & wishlist</span>
                        </div>
                    </div>
                    <ChevronRight size={18} />
                </Link>
              )}
            </div>

            {/* SCROLLABLE CONTENT */}
            <nav className="grow overflow-y-auto custom-scrollbar">
              
              {/* 🔥 QUICK LINKS (HIDDEN ON TABLET/DESKTOP BECAUSE THEY ARE IN SECONDARY NAV) */}
              <div className="p-4 pb-2 lg:hidden">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Quick Access</h3>
                <ul className="space-y-1">
                    {QUICK_LINKS.map((link) => (
                        <li key={link.name}>
                            <Link 
                                href={link.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors group
                                    ${link.highlight ? "bg-orange-50 dark:bg-orange-900/10 text-brand-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                            >
                                <link.icon size={18} className={link.highlight ? "text-brand-primary" : "text-gray-400 group-hover:text-brand-primary"} />
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-2" />
              </div>

              {/* CATEGORIES */}
              <div className="p-4 pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Shop by Category</h3>
                <ul className="space-y-1">
                  {categories.map((cat) => (
                    <li key={cat._id}>
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        <div className="rounded-lg overflow-hidden">
                          <button onClick={() => toggleSubMenu(cat._id)} className={`flex justify-between items-center w-full px-3 py-3 text-left font-medium transition-colors ${openSubMenu === cat._id ? "bg-brand-primary/5 text-brand-primary" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                            <span className="text-sm">{cat.name}</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${openSubMenu === cat._id ? "rotate-180 text-brand-primary" : "text-gray-400"}`} />
                          </button>
                          <AnimatePresence>
                            {openSubMenu === cat._id && (
                              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-gray-50 dark:bg-gray-800/30 border-l-2 border-brand-primary/20 ml-3 my-1">
                                {cat.subCategories.map((sub) => (
                                  <li key={sub._id}>
                                    <Link href={`/category/${cat.slug}/${sub.slug}`} onClick={onClose} className="block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link href={`/category/${cat.slug}`} onClick={onClose} className="block px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          {cat.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-2" />

              {/* UTILITY LINKS */}
              <div className="p-4 pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Help & Settings</h3>
                <ul className="space-y-1">
                    {UTILITY_LINKS.map((link) => (
                        <li key={link.name}>
                            <Link href={link.href} onClick={onClose} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                                <link.icon size={18} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
              </div>
            </nav>

            {/* === 3. FOOTER (LOGOUT) - PADDING INCREASED HERE === */}
            {status === "authenticated" && (
                <div className="p-4 pb-28 md:pb-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
                    <button onClick={() => signOut()} className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { 
//   X, 
//   ChevronDown, 
//   ChevronRight, 
//   User, 
//   LogOut, 
//   HelpCircle, 
//   Package, 
//   Info, 
//   Phone 
// } from "lucide-react";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";

// const UTILITY_LINKS = [
//     { name: "Track Order", href: "/account/orders", icon: Package },
//     { name: "Help & Support", href: "/faq", icon: HelpCircle },
//     { name: "About Us", href: "/about-us", icon: Info },
//     { name: "Contact Us", href: "/contact-us", icon: Phone },
// ];

// interface MobileMenuProps {
//   categories: SanityCategory[];
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function MobileMenu({
//   categories,
//   isOpen,
//   onClose,
// }: MobileMenuProps) {
//   const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
//   const { data: session, status } = useSession();

//   const toggleSubMenu = (categoryId: string) => {
//     setOpenSubMenu(openSubMenu === categoryId ? null : categoryId);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* BACKDROP */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//             aria-hidden="true"
//           />

//           {/* DRAWER CONTAINER */}
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed top-0 left-0 h-[100dvh] w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl overflow-hidden"
//           >
            
//             {/* === 1. HEADER & USER PROFILE === */}
//             <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="flex items-center gap-2">
//                     <div className="relative h-8 w-8">
//                         <Image src="/usamabrand.svg" alt="Logo" fill className="object-contain" />
//                     </div>
//                     <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Menu</span>
//                 </div>
//                 <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors">
//                   <X size={24} />
//                 </button>
//               </div>

//               {status === "authenticated" ? (
//                 <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
//                     <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
//                         {session?.user?.image ? (
//                             <Image src={session.user.image} alt="User" width={40} height={40} className="rounded-full" />
//                         ) : (
//                             <User size={20} />
//                         )}
//                     </div>
//                     <div className="grow overflow-hidden">
//                         <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{session?.user?.name}</p>
//                         <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
//                     </div>
//                 </div>
//               ) : (
//                 <Link 
//                     href="/login" 
//                     onClick={onClose}
//                     className="flex items-center justify-between w-full p-4 bg-brand-primary text-white rounded-xl shadow-md active:scale-95 transition-transform"
//                 >
//                     <div className="flex items-center gap-3">
//                         <div className="p-1 bg-white/20 rounded-full">
//                             <User size={18} />
//                         </div>
//                         <div className="flex flex-col">
//                             <span className="text-sm font-bold">Sign In / Register</span>
//                             <span className="text-[10px] opacity-90">Access your orders & wishlist</span>
//                         </div>
//                     </div>
//                     <ChevronRight size={18} />
//                 </Link>
//               )}
//             </div>

//             {/* === 2. SCROLLABLE CONTENT === */}
//             <nav className="grow overflow-y-auto custom-scrollbar">
//               <div className="p-4 pb-0">
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Shop by Category</h3>
//                 <ul className="space-y-1">
//                   {categories.map((cat) => (
//                     <li key={cat._id}>
//                       {cat.subCategories && cat.subCategories.length > 0 ? (
//                         <div className="rounded-lg overflow-hidden">
//                           <button
//                             onClick={() => toggleSubMenu(cat._id)}
//                             className={`flex justify-between items-center w-full px-3 py-3 text-left font-medium transition-colors
//                                 ${openSubMenu === cat._id ? "bg-brand-primary/5 text-brand-primary" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
//                           >
//                             <span className="text-sm">{cat.name}</span>
//                             <ChevronDown
//                               size={16}
//                               className={`transition-transform duration-300 ${
//                                 openSubMenu === cat._id ? "rotate-180 text-brand-primary" : "text-gray-400"
//                               }`}
//                             />
//                           </button>
                          
//                           <AnimatePresence>
//                             {openSubMenu === cat._id && (
//                               <motion.ul
//                                 initial={{ height: 0, opacity: 0 }}
//                                 animate={{ height: "auto", opacity: 1 }}
//                                 exit={{ height: 0, opacity: 0 }}
//                                 transition={{ duration: 0.2 }}
//                                 className="bg-gray-50 dark:bg-gray-800/30 border-l-2 border-brand-primary/20 ml-3 my-1"
//                               >
//                                 {cat.subCategories.map((sub) => (
//                                   <li key={sub._id}>
//                                     <Link
//                                       href={`/category/${cat.slug}/${sub.slug}`}
//                                       onClick={onClose}
//                                       className="block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
//                                     >
//                                       {sub.name}
//                                     </Link>
//                                   </li>
//                                 ))}
//                               </motion.ul>
//                             )}
//                           </AnimatePresence>
//                         </div>
//                       ) : (
//                         <Link
//                           href={`/category/${cat.slug}`}
//                           onClick={onClose}
//                           className="block px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
//                         >
//                           {cat.name}
//                         </Link>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-4" />

//               <div className="p-4 pt-0">
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Help & Settings</h3>
//                 <ul className="space-y-1">
//                     {UTILITY_LINKS.map((link) => (
//                         <li key={link.name}>
//                             <Link 
//                                 href={link.href}
//                                 onClick={onClose}
//                                 className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
//                             >
//                                 <link.icon size={18} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
//                                 {link.name}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//               </div>
//             </nav>

//             {/* === 3. FOOTER (Logout) === */}
//             {/* FIX: Added 'pb-28' here to push content above the Bottom Nav */}
//             {status === "authenticated" && (
//                 <div className="p-4 pb-28 md:pb-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
//                     <button 
//                         onClick={() => signOut()}
//                         className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
//                     >
//                         <LogOut size={18} />
//                         Sign Out
//                     </button>
//                 </div>
//             )}

//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }