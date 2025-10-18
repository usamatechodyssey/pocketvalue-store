"use client";

import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        // 300px scroll karne par button dikhayein
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="z-50 p-3 bg-brand-accent text-white rounded-full shadow-lg hover:bg-brand-primary-hover transition-all duration-300 animate-bounce"
          aria-label="Go to top"
        >
          <FiArrowUp size={24} />
        </button>
      )}
    </>
  );
}
