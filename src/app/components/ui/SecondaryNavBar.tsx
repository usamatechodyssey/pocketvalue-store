// app/components/ui/SecondaryNavBar.tsx (FINAL UPDATED CODE)

"use client";

import Link from "next/link";

const navLinks = [
  { name: "Today's Deals", href: "/deals" },
  { name: "Gift Cards", href: "/gift-cards" },
  { name: "Sell on PocketValue", href: "/sell" },
];
const navLinksuser = [
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
  { name: "Help & Support", href: "/faq" },
];

export default function SecondaryNavBar({ isVisible }: { isVisible: boolean }) {
  return (
    <nav
      className={`hidden md:flex bg-gray-50 dark:bg-gray-800 w-full overflow-hidden transition-all duration-300 ease-out ${
        isVisible
          ? "h-10 opacity-100 border-t border-gray-200 dark:border-gray-700"
          : "h-0 opacity-0"
      }`}
    >
      <div className="w-full h-full flex items-center justify-between px-6 lg:px-8 text-sm font-medium">
        <div className="flex items-center gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {navLinksuser.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
