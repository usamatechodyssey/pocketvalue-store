// src/app/components/layout/FooterColumn.tsx

"use client";

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable Contact Item Component (Agar tumhari file mein ye hai to use karo) ---
export const ContactItem = ({ icon: Icon, href, text }: { icon: React.ElementType; href?: string; text: string; }) => (
  <li className="flex items-start gap-3">
    <Icon className="mt-1 h-4 w-4 shrink-0 text-brand-primary" />
    {href ? (
      <a href={href} className="text-gray-300 hover:text-brand-primary transition-colors text-sm">{text}</a>
    ) : (
      <span className="text-gray-300 text-sm">{text}</span>
    )}
  </li>
);


// --- Reusable Accordion/Column Component (Hydration Fixed) ---
const FooterColumn = ({ title, children, isMobile }: { title: string, children: React.ReactNode, isMobile: boolean | null }) => {
    const [isOpen, setIsOpen] = useState(false);

    // FIX: Server Side (isMobile === null) aur Desktop (isMobile === false)
    // Dono cases mein hamesha Column (Non-Accordion) UI dikhao.
    if (isMobile === false || isMobile === null) {
        return (
            <div>
                <h3 className="font-bold text-white mb-4 text-lg border-b-2 border-brand-primary/50 pb-1.5">{title}</h3>
                <ul className="space-y-3">{children}</ul>
            </div>
        );
    }
    
    // Client Side Mobile (isMobile === true) par Accordion
    return (
        <div className="border-b border-gray-700 dark:border-gray-800">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4">
                <h3 className="font-bold text-white text-lg">{title}</h3>
                <FiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <ul className="space-y-3 pb-4">
                            {children}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FooterColumn;