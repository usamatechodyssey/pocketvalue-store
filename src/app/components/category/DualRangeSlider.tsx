// src/app/components/category/DualRangeSlider.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface PriceRangeProps {
  min: number;
  max: number; // Absolute limits (e.g., 0 to 5000)
  currentMin: number;
  currentMax: number;
  onChange: (min: string, max: string) => void;
}

export default function DualRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  onChange,
}: PriceRangeProps) {
  // Local state for smooth sliding before committing
  const [minVal, setMinVal] = useState(currentMin);
  const [maxVal, setMaxVal] = useState(currentMax);
  const minValRef = useRef(currentMin);
  const maxValRef = useRef(currentMax);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = (value: number) =>
    Math.round(((value - min) / (max - min)) * 100);

  // Update visual range bar color
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, min, max]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, min, max]);

  // Sync with parent props
  useEffect(() => {
    setMinVal(currentMin);
    setMaxVal(currentMax);
  }, [currentMin, currentMax]);

  return (
    <div className="pt-6 pb-2 px-2">
      {/* Visual Slider */}
      <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
        <div
          ref={range}
          className="absolute h-1 bg-brand-primary rounded-full z-10"
        />
        
        {/* Thumb 1 (Min) */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          onMouseUp={() => onChange(minVal.toString(), maxVal.toString())}
          onTouchEnd={() => onChange(minVal.toString(), maxVal.toString())}
          className="thumb thumb--left"
          style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
        />

        {/* Thumb 2 (Max) */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          onMouseUp={() => onChange(minVal.toString(), maxVal.toString())}
          onTouchEnd={() => onChange(minVal.toString(), maxVal.toString())}
          className="thumb thumb--right"
          style={{ zIndex: "4" }}
        />
      </div>

      {/* Manual Inputs */}
      <div className="flex items-center gap-2">
        <div className="grow">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Min</span>
            <div className="relative mt-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Rs:</span>
                <input
                    type="number"
                    value={minVal}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        setMinVal(val);
                    }}
                    onBlur={() => onChange(minVal.toString(), maxVal.toString())}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-brand-primary transition-colors"
                />
            </div>
        </div>
        <div className="grow">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Max</span>
            <div className="relative mt-1">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">Rs:</span>
                <input
                    type="number"
                    value={maxVal}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        setMaxVal(val);
                    }}
                    onBlur={() => onChange(minVal.toString(), maxVal.toString())}
                    className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-brand-primary transition-colors"
                />
            </div>
        </div>
      </div>

      {/* Global Styles for Range Inputs (Trick to overlay them) */}
      <style jsx global>{`
        .thumb {
          -webkit-appearance: none;
          pointer-events: none;
          position: absolute;
          height: 0;
          width: 100%;
          outline: none;
        }
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #FF8F32; /* Brand Color */
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          margin-top: 1px;
        }
        /* Firefox */
        .thumb::-moz-range-thumb {
          pointer-events: all;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #FF8F32;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}