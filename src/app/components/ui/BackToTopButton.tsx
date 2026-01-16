// src/app/components/ui/BackToTopButton.tsx

"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsVisible(scrollTop > 300);

      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Calculation Fix for Perfect Alignment
  const size = 44; // Button size
  const strokeWidth = 3; 
  const center = size / 2;
  const radius = (size - strokeWidth) / 2 - 2; // Thoda padding (2px) taake kate nahi
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          // ✅ Padding removed (p-0), Flex Center use kiya alignment ke liye
          className="group fixed bottom-44 lg:bottom-26 right-4 lg:right-1 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300 p-0"
          aria-label="Back to Top"
        >
          {/* Progress Ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" 
            viewBox={`0 0 ${size} ${size}`}
          >
            {/* 1. Track Circle (Halka Gray) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-gray-100 dark:text-gray-700"
            />
            {/* 2. Progress Circle (Neutral Black/White - NO CONFLICT) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              // 🔥 Color Changed: Text-Gray-800 (Dark Mode me White)
              className="text-gray-800 dark:text-white transition-all duration-100 ease-out"
            />
          </svg>

          {/* Arrow Icon */}
          <ArrowUp 
            size={18} 
            strokeWidth={2.5}
            // Icon color matches the ring
            className="text-gray-800 dark:text-white z-10" 
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}