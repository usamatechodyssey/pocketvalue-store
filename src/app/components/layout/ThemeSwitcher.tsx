"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />; 
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-brand-primary flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {/* Container fixed size, NO overflow-hidden */}
      <div className="relative w-6 h-6">
        
        {/* Sun Icon */}
        <Sun 
            size={24} 
            strokeWidth={1.5}
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform origin-center
                ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} 
        />
        
        {/* Moon Icon */}
        <Moon 
            size={24} 
            strokeWidth={1.5}
            className={`absolute inset-0 transition-all duration-500 ease-in-out transform origin-center
                ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} 
        />
      </div>

      {/* Tooltip */}
      <span className="absolute right-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </span>
    </button>
  );
}