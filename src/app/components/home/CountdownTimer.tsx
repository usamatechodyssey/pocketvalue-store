// app/components/home/CountdownTimer.tsx (NEW COMPONENT)

"use client";

import { useState, useEffect } from 'react';

// TimeBox ko naya, behtar design diya gaya hai
const TimeBox = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center text-center w-12">
    {/* Background ab brand orange hai, jo blue par pop karega */}
    <span className="text-2xl font-bold bg-brand-primary text-white px-2 py-1.5 rounded-md shadow-lg">
      {value}
    </span>
    {/* Text color light gray hai jo blue background par saaf nazar aayega */}
    <span className="text-xs text-gray-300 mt-1.5 uppercase tracking-wider">{label}</span>
  </div>
);
export default function CountdownTimer({ endDate }: { endDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = +new Date(endDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <span className="text-sm font-semibold text-gray-200 hidden sm:inline">Ends in:</span>
      <TimeBox value={timeLeft.days} label="Days" />
      <span className="text-2xl font-bold text-brand-primary/80">:</span>
      <TimeBox value={timeLeft.hours} label="Hrs" />
      <span className="text-2xl font-bold text-brand-primary/80">:</span>
      <TimeBox value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl font-bold text-brand-primary/80">:</span>
      <TimeBox value={timeLeft.seconds} label="Secs" />
    </div>
  );
}