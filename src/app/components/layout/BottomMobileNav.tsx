// app/components/layout/BottomNav.tsx (NEW COMPONENT)

"use client";

import Link from "next/link";
import { FiHome, FiGrid, FiSearch, FiUser } from "react-icons/fi";

interface BottomNavProps {
    onCategoriesClick: () => void;
    onSearchClick: () => void;
}

const NavItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors w-1/4 h-full">
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const NavLinkItem = ({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) => (
    <Link href={href} className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors w-1/4 h-full">
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </Link>
);

export default function BottomNav({ onCategoriesClick, onSearchClick }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-around h-full">
            <NavLinkItem icon={<FiHome size={22} />} label="Home" href="/" />
            <NavItem icon={<FiGrid size={22} />} label="Categories" onClick={onCategoriesClick} />
            <NavItem icon={<FiSearch size={22} />} label="Search" onClick={onSearchClick} />
            <NavLinkItem icon={<FiUser size={22} />} label="Account" href="/account" />
        </div>
    </div>
  );
}