"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiArrowRight } from "react-icons/fi";
import { client } from "@/sanity/lib/client";
import { DEAL_OF_THE_DAY_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

// === INTERFACES / TYPES ===
interface DealProduct {
  _id: string;
  title: string;
  slug: string;
  price?: number;
  salePrice?: number;
  description?: any;
  images: string[];
}

interface DealData {
  isEnabled: boolean;
  title?: string;
  dealStartDate?: string;
  dealEndDate: string;
  product: DealProduct;
}

// === HELPER FUNCTIONS (Poora code yahan hai) ===

// Keen Slider Autoplay Plugin
const AutoplayPlugin: KeenSliderPlugin = (slider) => {
  let timeout: NodeJS.Timeout;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 4000);
  }
  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

// Countdown Timer Hook
const useCountdown = (targetDateStr: string) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const targetDate = new Date(targetDateStr);
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        return {
          hours: totalHours,
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };
    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);
  return timeLeft;
};

const TimerBox = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
      <span className="text-2xl font-bold text-white tracking-wider">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="mt-2 text-xs font-medium uppercase text-white/70">
      {label}
    </span>
  </div>
);
// === WRAPPER COMPONENT (Data Fetching & Logic) ===
export default function DealOfTheDayWrapper() {
  const [dealData, setDealData] = useState<DealData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data: DealData = await client.fetch(DEAL_OF_THE_DAY_QUERY);
        setDealData(data);
      } catch (error) {
        console.error("Failed to fetch Deal of the Day data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-2xl my-16 mx-auto max-w-7xl px-4"></div>
    );
  }

  const now = new Date();
  const dealStarts = dealData?.dealStartDate
    ? new Date(dealData.dealStartDate)
    : null;
  const dealEnds = dealData?.dealEndDate
    ? new Date(dealData.dealEndDate)
    : null;

  const isDealActive =
    dealData &&
    dealData.isEnabled &&
    dealData.product &&
    (!dealStarts || now >= dealStarts) &&
    dealEnds &&
    now < dealEnds;

  if (!isDealActive) {
    return null;
  }

  return <DealOfTheDay dealData={dealData} />;
}

// === UI COMPONENT (Presentation) ===
function DealOfTheDay({ dealData }: { dealData: DealData }) {
  const { product, title, dealEndDate } = dealData;
  const { hours, minutes, seconds } = useCountdown(dealEndDate);

  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged: (s) => setCurrentSlide(s.track.details.rel),
      created: () => setLoaded(true),
    },
    [AutoplayPlugin]
  );

  const discountPercent =
    product.salePrice && product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    // ✅✅✅ YEH HAI AAPKA MUKAMMAL HAL ✅✅✅
    <section className="w-full bg-surface-ground py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Nayi, behtar height ke liye padding kam ki gayi hai (p-6 md:p-10) */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-8 rounded-2xl shadow-2xl bg-gradient-to-br from-brand-primary via-teal-600 to-cyan-700 text-white p-6 md:p-10">
          <div className="flex flex-col text-center lg:text-left z-10 order-2 lg:order-1">
            {/* Nayi, behtar animation */}
            <span className="animate-pulse rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-gray-900 self-center lg:self-start">
              DEAL OF THE DAY
            </span>

            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">
              {title || product.title}
            </h2>

            <div className="mt-2 max-w-lg text-white/80 mx-auto lg:mx-0 prose prose-sm prose-invert prose-p:text-white/80">
              {product.description ? (
                <PortableText value={product.description} />
              ) : (
                <p>Grab this amazing product at a discounted price!</p>
              )}
            </div>

            <div className="flex items-baseline justify-center lg:justify-start gap-3 mt-4">
              <span className="text-4xl font-bold text-yellow-300">
                Rs. {product.salePrice?.toLocaleString()}
              </span>
              <span className="text-xl line-through text-white/50">
                Rs. {product.price?.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <TimerBox value={hours} label="Hours" />
              <TimerBox value={minutes} label="Mins" />
              <TimerBox value={seconds} label="Secs" />
            </div>

            <Link
              href={`/product/${product.slug}`}
              className="mt-8 self-center lg:self-start"
            >
              <span className="group inline-flex items-center justify-center gap-3 rounded-lg bg-white px-6 py-3 text-md font-bold text-brand-primary shadow-lg transition-all duration-300 hover:bg-yellow-400 hover:shadow-xl hover:scale-105">
                Grab The Deal Now
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>

          <div className="relative h-64 lg:h-full order-1 lg:order-2">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative h-full">
              <div ref={sliderRef} className="keen-slider h-full">
                {product.images?.map((src, index) => (
                  <div
                    key={index}
                    className="keen-slider__slide flex items-center justify-center"
                  >
                    <img
                      src={src}
                      alt={`${product.title} image ${index + 1}`}
                      className="w-auto h-auto object-contain max-h-[200px] md:max-h-[300px] lg:max-h-[400px] drop-shadow-[0_20px_25px_rgba(0,0,0,0.4)]"
                    />
                  </div>
                ))}
              </div>

              {loaded && instanceRef.current && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                  {[
                    ...Array(
                      instanceRef.current.track.details.slides.length
                    ).keys(),
                  ].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => instanceRef.current?.moveToIdx(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                  ))}
                </div>
              )}
            </div>
            {discountPercent > 0 && (
              // Nayi, behtar animation
              <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center text-gray-900 shadow-xl -rotate-12 animate-pop">
                <span className="text-4xl font-extrabold">
                  {discountPercent}%
                </span>
                <span className="text-lg font-bold -mt-1">OFF</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
