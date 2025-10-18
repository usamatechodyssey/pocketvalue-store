// components/footer/FeaturesSection.tsx - UPDATED

"use client";

import React from "react";

const FeaturesSection: React.FC = () => (
  // === YAHAN CLASSES UPDATE HUIN HAIN ===
  <div className="bg-surface-base border-y border-surface-border">
    {/* Newsletter Section */}
    <div className="bg-surface-ground py-16">
      <div className="max-w-[1240px] mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-text-primary">
          JOIN OUR NEWSLETTER
        </h3>
        <p className="mt-2 text-base text-text-secondary">
          Get updates on special offers, news, and events.
        </p>
        <form className="mt-8 flex justify-center">
          <div className="w-full max-w-lg flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-5 py-3 border border-surface-border-darker bg-surface-base rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover text-on-primary font-semibold px-8 py-3 rounded-md transition-colors"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default FeaturesSection;
