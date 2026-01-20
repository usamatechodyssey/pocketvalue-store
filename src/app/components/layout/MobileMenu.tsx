
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence, PanInfo } from "framer-motion";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { 
//   X, ChevronRight, User, LogOut, HelpCircle, 
//   Package, Info, Phone, Tag, Gift, DollarSign, 
//   Moon, Sun, ShieldCheck, FileText, ChevronDown 
// } from "lucide-react";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";
// import { useTheme } from "next-themes";

// // === REUSABLE COMPONENT: MENU ITEM ===
// const MenuItem = ({ 
//   icon: Icon, 
//   label, 
//   onClick, 
//   href, 
//   isDestructive = false,
//   showChevron = true,
//   rightElement 
// }: any) => {
//   const Content = () => (
//     <div className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors ${isDestructive ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
//       <div className="flex items-center gap-3.5">
//         <div className={`p-2 rounded-full ${isDestructive ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
//           <Icon size={20} strokeWidth={2} />
//         </div>
//         <span className="font-medium text-[15px]">{label}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         {rightElement}
//         {showChevron && <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />}
//       </div>
//     </div>
//   );

//   if (href) {
//     return <Link href={href} onClick={onClick} className="block"><Content /></Link>;
//   }
//   return <button onClick={onClick} className="block w-full text-left"><Content /></button>;
// };

// // === REUSABLE COMPONENT: GROUP CONTAINER ===
// const MenuGroup = ({ title, children }: { title?: string, children: React.ReactNode }) => (
//   <div className="mb-6">
//     {title && (
//       <h3 className="px-4 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
//         {title}
//       </h3>
//     )}
//     <div className="overflow-hidden border-y border-gray-200 dark:border-gray-800 sm:border sm:rounded-2xl divide-y divide-gray-100 dark:divide-gray-700/50">
//       {children}
//     </div>
//   </div>
// );

// interface MobileMenuProps {
//   categories: SanityCategory[];
//   isOpen: boolean;
//   onClose: () => void;
// }

// export default function MobileMenu({ categories, isOpen, onClose }: MobileMenuProps) {
//   const { data: session, status } = useSession();
//   const { theme, setTheme } = useTheme();
//   const [openCategory, setOpenCategory] = useState<string | null>(null);

//   // Drag to close logic
//   const handleDragEnd = (event: any, info: PanInfo) => {
//     if (info.offset.x < -100) { // Agar 100px left drag kiya to band kardo
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* BACKDROP (Blur) */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
//           />

//           {/* SIDEBAR DRAWER */}
//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "spring", damping: 30, stiffness: 300 }}
//             drag="x" // Enable Drag
//             dragConstraints={{ left: 0, right: 0 }} // Sirf Left (Close) taraf drag allow karein
//             dragElastic={{ left: 0.5, right: 0 }} 
//             onDragEnd={handleDragEnd}
//             className="fixed top-0 left-0 h-dvh w-[85vw] max-w-[340px] bg-gray-50 dark:bg-gray-950 z-50 flex flex-col shadow-2xl overflow-hidden"
//           >
            
//             {/* 1. HEADER (User Profile) */}
//             <div className="p-5 pb-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
//               <div className="flex justify-between items-start mb-4">
//                 <button 
//                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                   className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-transform active:scale-90"
//                 >
//                   {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//                 </button>
//                 <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 hover:text-red-500 transition-colors">
//                   <X size={20} />
//                 </button>
//               </div>

//               {status === "authenticated" ? (
//                 <Link href="/account" onClick={onClose} className="flex items-center gap-4 group">
//                   <div className="relative h-14 w-14 rounded-full border-2 border-brand-primary/20 p-0.5">
//                     <div className="h-full w-full rounded-full overflow-hidden bg-gray-200">
//                        {session?.user?.image ? (
//                            <Image src={session.user.image} alt="User" fill className="object-cover" />
//                        ) : (
//                            <div className="h-full w-full flex items-center justify-center bg-brand-primary text-white font-bold text-xl">
//                                {session?.user?.name?.[0]}
//                            </div>
//                        )}
//                     </div>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-brand-primary transition-colors">
//                         {session?.user?.name}
//                     </h2>
//                     <p className="text-sm text-gray-500 font-medium">View Profile</p>
//                   </div>
//                   <ChevronRight size={18} className="ml-auto text-gray-400" />
//                 </Link>
//               ) : (
//                 <Link href="/login" onClick={onClose} className="flex items-center gap-4">
//                   <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
//                     <User size={28} />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Welcome Guest</h2>
//                     <p className="text-sm text-brand-primary font-bold">Sign In / Register</p>
//                   </div>
//                   <ChevronRight size={18} className="ml-auto text-gray-400" />
//                 </Link>
//               )}
//             </div>

//             {/* 2. SCROLLABLE CONTENT */}
//             <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              
//               {/* GROUP 1: SHOPPING */}
//               <MenuGroup title="Shop">
//                 <MenuItem icon={Tag} label="Deals & Offers" href="/deals" onClick={onClose} rightElement={<span className="text-[10px] font-bold bg-brand-primary text-white px-2 py-0.5 rounded-full">HOT</span>} />
//                 <MenuItem icon={Gift} label="Gift Cards" href="/gift-cards" onClick={onClose} />
//                 <MenuItem icon={DollarSign} label="Sell on PocketValue" href="/sell" onClick={onClose} />
//               </MenuGroup>

//               {/* GROUP 2: CATEGORIES (Expandable) */}
//               <MenuGroup title="Categories">
//                 {categories.map((cat) => (
//                    <div key={cat._id} className="bg-white dark:bg-gray-800">
//                       {cat.subCategories && cat.subCategories.length > 0 ? (
//                         <div>
//                            <button 
//                              onClick={() => setOpenCategory(openCategory === cat._id ? null : cat._id)}
//                              className="flex items-center justify-between w-full p-4 text-left active:bg-gray-50 dark:active:bg-gray-700"
//                            >
//                              <div className="flex items-center gap-3.5">
//                                {/* Category Icon Placeholder - You can add real icons here */}
//                                <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-brand-secondary">
//                                   <Package size={20} />
//                                </div>
//                                <span className="font-medium text-[15px] text-gray-700 dark:text-gray-200">{cat.name}</span>
//                              </div>
//                              <ChevronDown size={18} className={`text-gray-400 transition-transform ${openCategory === cat._id ? 'rotate-180 text-brand-primary' : ''}`} />
//                            </button>
                           
//                            {/* Subcategories Animation */}
//                            <AnimatePresence>
//                              {openCategory === cat._id && (
//                                <motion.div 
//                                  initial={{ height: 0, opacity: 0 }}
//                                  animate={{ height: "auto", opacity: 1 }}
//                                  exit={{ height: 0, opacity: 0 }}
//                                  className="overflow-hidden bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
//                                >
//                                  {cat.subCategories.map((sub) => (
//                                    <Link 
//                                      key={sub._id} 
//                                      href={`/category/${cat.slug}/${sub.slug}`}
//                                      onClick={onClose}
//                                      className="flex items-center pl-14 pr-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary border-b border-gray-100 dark:border-gray-800 last:border-0"
//                                    >
//                                      {sub.name}
//                                    </Link>
//                                  ))}
//                                </motion.div>
//                              )}
//                            </AnimatePresence>
//                         </div>
//                       ) : (
//                         <MenuItem 
//                             icon={Package} 
//                             label={cat.name} 
//                             href={`/category/${cat.slug}`} 
//                             onClick={onClose} 
//                         />
//                       )}
//                    </div>
//                 ))}
//               </MenuGroup>

//               {/* GROUP 3: SUPPORT */}
//               <MenuGroup title="Support">
//                 <MenuItem icon={Package} label="Track Order" href="/account/orders" onClick={onClose} />
//                 <MenuItem icon={HelpCircle} label="Help Center" href="/faq" onClick={onClose} />
//                 <MenuItem icon={Phone} label="Contact Us" href="/contact-us" onClick={onClose} />
//               </MenuGroup>

//                {/* GROUP 4: LEGAL */}
//                <MenuGroup title="Legal">
//                 <MenuItem icon={Info} label="About Us" href="/about-us" onClick={onClose} />
//                 <MenuItem icon={ShieldCheck} label="Privacy Policy" href="/privacy-policy" onClick={onClose} />
//                 <MenuItem icon={FileText} label="Terms of Service" href="/terms-of-service" onClick={onClose} />
//               </MenuGroup>

//               {/* GROUP 5: ACTIONS */}
//               {status === "authenticated" && (
//                 <div className="pt-2 pb-10">
//                    <MenuItem 
//                       icon={LogOut} 
//                       label="Sign Out" 
//                       onClick={() => signOut()} 
//                       isDestructive={true} 
//                       showChevron={false}
//                    />
//                 </div>
//               )}
              
//               {/* App Version Info */}
//               <div className="text-center pb-8">
//                  <p className="text-[10px] text-gray-400 font-medium">PocketValue App v1.2.0</p>
//                  <p className="text-[10px] text-gray-300 mt-1">Made with ❤️ in Pakistan</p>
//               </div>

//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { SanityCategory } from "@/sanity/types/product_types";
// import { 
//   X, ChevronDown, ChevronRight, User, LogOut, HelpCircle, 
//   Package, Info, Phone, Tag, Gift, DollarSign, Sun, Moon 
// } from "lucide-react";
// import { useSession, signOut } from "next-auth/react";
// import Image from "next/image";
// import { useTheme } from "next-themes";

// const QUICK_LINKS = [
//     { name: "Today's Deals", href: "/deals", icon: Tag, highlight: true },
//     { name: "Gift Cards", href: "/gift-cards", icon: Gift },
//     { name: "Sell on PocketValue", href: "/sell", icon: DollarSign },
// ];

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

// export default function MobileMenu({ categories, isOpen, onClose }: MobileMenuProps) {
//   const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
//   const { data: session, status } = useSession();
//   const { theme, setTheme } = useTheme();

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
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
//             aria-hidden="true"
//           />

//           <motion.div
//             initial={{ x: "-100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "-100%" }}
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="fixed top-0 left-0 h-dvh w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-50 flex flex-col shadow-2xl overflow-hidden"
//           >
//             {/* HEADER */}
//             <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0">
//               <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center gap-2">
//                     <div className="relative h-8 w-8">
//                         <Image src="/usamabrand.svg" alt="Logo" fill className="object-contain" />
//                     </div>
//                     <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">Menu</span>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                     <button 
//                         onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                         className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
//                     >
//                         {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
//                     </button>
//                     <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors">
//                         <X size={24} />
//                     </button>
//                 </div>
//               </div>

//               {/* USER CARD */}
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
//                 <Link href="/login" onClick={onClose} className="flex items-center justify-between w-full p-4 bg-brand-primary text-white rounded-xl shadow-md active:scale-95 transition-transform">
//                     <div className="flex items-center gap-3">
//                         <div className="p-1 bg-white/20 rounded-full"><User size={18} /></div>
//                         <div className="flex flex-col">
//                             <span className="text-sm font-bold">Sign In / Register</span>
//                             <span className="text-[10px] opacity-90">Access your orders & wishlist</span>
//                         </div>
//                     </div>
//                     <ChevronRight size={18} />
//                 </Link>
//               )}
//             </div>

//             {/* SCROLLABLE CONTENT */}
//             <nav className="grow overflow-y-auto custom-scrollbar">
              
//               {/* 🔥 QUICK LINKS (HIDDEN ON TABLET/DESKTOP BECAUSE THEY ARE IN SECONDARY NAV) */}
//               <div className="p-4 pb-2 lg:hidden">
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Quick Access</h3>
//                 <ul className="space-y-1">
//                     {QUICK_LINKS.map((link) => (
//                         <li key={link.name}>
//                             <Link 
//                                 href={link.href}
//                                 onClick={onClose}
//                                 className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors group
//                                     ${link.highlight ? "bg-orange-50 dark:bg-orange-900/10 text-brand-primary" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
//                             >
//                                 <link.icon size={18} className={link.highlight ? "text-brand-primary" : "text-gray-400 group-hover:text-brand-primary"} />
//                                 {link.name}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//                 <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-2" />
//               </div>

//               {/* CATEGORIES */}
//               <div className="p-4 pt-2">
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Shop by Category</h3>
//                 <ul className="space-y-1">
//                   {categories.map((cat) => (
//                     <li key={cat._id}>
//                       {cat.subCategories && cat.subCategories.length > 0 ? (
//                         <div className="rounded-lg overflow-hidden">
//                           <button onClick={() => toggleSubMenu(cat._id)} className={`flex justify-between items-center w-full px-3 py-3 text-left font-medium transition-colors ${openSubMenu === cat._id ? "bg-brand-primary/5 text-brand-primary" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
//                             <span className="text-sm">{cat.name}</span>
//                             <ChevronDown size={16} className={`transition-transform duration-300 ${openSubMenu === cat._id ? "rotate-180 text-brand-primary" : "text-gray-400"}`} />
//                           </button>
//                           <AnimatePresence>
//                             {openSubMenu === cat._id && (
//                               <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-gray-50 dark:bg-gray-800/30 border-l-2 border-brand-primary/20 ml-3 my-1">
//                                 {cat.subCategories.map((sub) => (
//                                   <li key={sub._id}>
//                                     <Link href={`/category/${cat.slug}/${sub.slug}`} onClick={onClose} className="block px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
//                                       {sub.name}
//                                     </Link>
//                                   </li>
//                                 ))}
//                               </motion.ul>
//                             )}
//                           </AnimatePresence>
//                         </div>
//                       ) : (
//                         <Link href={`/category/${cat.slug}`} onClick={onClose} className="block px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
//                           {cat.name}
//                         </Link>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 my-2" />

//               {/* UTILITY LINKS */}
//               <div className="p-4 pt-2">
//                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Help & Settings</h3>
//                 <ul className="space-y-1">
//                     {UTILITY_LINKS.map((link) => (
//                         <li key={link.name}>
//                             <Link href={link.href} onClick={onClose} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
//                                 <link.icon size={18} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
//                                 {link.name}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//               </div>
//             </nav>

//             {/* === 3. FOOTER (LOGOUT) - PADDING INCREASED HERE === */}
//             {status === "authenticated" && (
//                 <div className="p-4 pb-28 md:pb-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
//                     <button onClick={() => signOut()} className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors">
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
          {/* BACKDROP (Ye Full Screen hi rahega) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            aria-hidden="true"
          />

          {/* SIDEBAR CONTAINER */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            
            // 🔥 NATIVE APP FIX: Height Calculation
            // 100dvh (Full Screen) - 65px (Bottom Nav Height) - Safe Area (iPhone Home Bar)
             className="fixed top-0 left-0 w-[85vw] max-w-[320px] bg-white dark:bg-gray-900 z-40 flex flex-col lg:hidden shadow-2xl overflow-hidden
                         h-dvh pb-20 md:pb-0"
            
          
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
                        className="p-2 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-red-500 transition-colors active:scale-90">
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
            <nav className="grow overflow-y-auto custom-scrollbar pb-4">
              
              {/* QUICK LINKS */}
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

            {/* === FOOTER (FIXED) === */}
            {/* Ab yahan 'pb-28' ki zaroorat nahi hai, kyunke sidebar waise hi BottomNav se upar ruk raha hai */}
            {status === "authenticated" && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
                    <button onClick={() => signOut()} className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors active:scale-95">
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