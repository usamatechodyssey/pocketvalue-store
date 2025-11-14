// /src/app/components/layout/NewRightDock.tsx

"use client";

import ThemeSwitcher from "./ThemeSwitcher";
import BackToTopButton from "../ui/BackToTopButton";
import { Bell, HelpCircle } from "lucide-react";
import Link from "next/link";

interface NewRightDockProps {
  topOffset: number;
}

export default function NewRightDock({ topOffset }: NewRightDockProps) {
  return (
    // Yeh component ab sirf 'lg' (desktop) screens par hi render hoga
    <aside
      className="hidden lg:flex flex-col fixed right-0 w-16 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800
      transition-all duration-300 ease-out z-30"
      style={{
        top: `${topOffset}px`,
        height: `calc(100vh - ${topOffset}px)`,
      }}
    >
      {/* Top Icons */}
      <div className="grow p-2 pt-8 flex flex-col items-center gap-2">
        {/* === LANGUAGE SWITCHER YAHAN ADD KIYA GAYA HAI === */}
        {/* Iska design baaki icons se a a a haat kar hoga taake a a a saaf nazar aaye */}

        <button className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-primary">
          <Bell size={20} />
        </button>
        <Link
          href="/faq"
          aria-label="Help Center"
          className="h-12 w-12 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-primary"
        >
          <HelpCircle size={20} />
        </Link>
      </div>

      {/* Bottom Utility Icons */}
      <div className="shrink-0 p-2 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
        <BackToTopButton />
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
