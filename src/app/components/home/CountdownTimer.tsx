"use client";

import { useState, useEffect } from "react";

const TimeBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center">
    {/* 
       BOX DESIGN:
       Light Mode: Clean White with subtle gray border.
       Dark Mode: Deep Transparent Black (Glassy) with white glow border.
    */}
    <div className="relative flex items-center justify-center 
      bg-gray-50 text-gray-900 border border-gray-200 
      dark:bg-white/5 dark:text-white dark:border-white/10 dark:backdrop-blur-sm
      rounded px-1 min-w-7 md:min-w-8 h-7 md:h-8 text-center shadow-sm">
      <span className="text-xs md:text-sm font-bold font-mono leading-none">
        {value}
      </span>
    </div>
    
    <span className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase font-bold tracking-tight">
      {label}
    </span>
  </div>
);

export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00", hours: "00", minutes: "00", seconds: "00",
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(endDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, "0"),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, "0"),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, "0"),
        };
      }
      return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => { setTimeLeft(calculateTime()); }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-start gap-1">
      <TimeBox value={timeLeft.days} label="D" />
      <span className="text-gray-400 dark:text-gray-600 font-bold mt-1.5 text-[10px]">:</span>
      <TimeBox value={timeLeft.hours} label="H" />
      <span className="text-gray-400 dark:text-gray-600 font-bold mt-1.5 text-[10px]">:</span>
      <TimeBox value={timeLeft.minutes} label="M" />
      <span className="text-gray-400 dark:text-gray-600 font-bold mt-1.5 text-[10px]">:</span>
      <TimeBox value={timeLeft.seconds} label="S" />
    </div>
  );
}