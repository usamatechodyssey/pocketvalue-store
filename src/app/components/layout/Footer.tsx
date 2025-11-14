// /src/app/components/layout/Footer.tsx

import Link from 'next/link';
// --- NEW: Import icons for the contact details ---
import { FiFacebook, FiTwitter, FiInstagram, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { GlobalSettings } from '@/sanity/lib/queries';

// --- Reusable component for contact items for cleaner code ---
const ContactItem = ({ icon: Icon, href, text }: { icon: React.ElementType; href?: string; text: string; }) => (
  <li className="flex items-start gap-3">
    <Icon className="mt-1 h-4 w-4 shrink-0 text-orange-400" />
    {href ? (
      <a href={href} className="hover:text-white transition-colors">{text}</a>
    ) : (
      <span>{text}</span>
    )}
  </li>
);


export default function MainFooter({ settings }: { settings: GlobalSettings }) {
  
  const { storeContactEmail, storePhoneNumber, storeAddress, socialLinks } = settings;

  return (
    <footer className="bg-gray-800 dark:bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* --- Column 1: Redesigned as "Contact Us" --- */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              {/* Dynamic Address field with Icon */}
              {storeAddress && (
                <ContactItem icon={FiMapPin} text={storeAddress} />
              )}
              {/* Dynamic Phone field with Icon */}
              {storePhoneNumber && (
                <ContactItem icon={FiPhone} href={`tel:${storePhoneNumber}`} text={storePhoneNumber} />
              )}
              {/* Dynamic Email field with Icon */}
              {storeContactEmail && (
                <ContactItem icon={FiMail} href={`mailto:${storeContactEmail}`} text={storeContactEmail} />
              )}
            </ul>
          </div>

          {/* Column 2: Customer Service (No change) */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</Link></li>
              <li><Link href="/returns-and-refunds" className="text-gray-300 hover:text-orange-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact-us" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: About Us (No change) */}
          <div>
            <h3 className="font-semibold text-white mb-4">About PocketValue</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="text-gray-300 hover:text-orange-400 transition-colors">Our Story</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-orange-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-300 hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Follow Us & Brand Info */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">PocketValue</h3>
            <p className="text-sm leading-relaxed mb-4">
              Quality products, unbeatable prices, delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Facebook">
                  <FiFacebook size={20} />
                </a>
              )}
              {socialLinks?.twitter && (
                 <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Twitter">
                  <FiTwitter size={20} />
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Instagram">
                  <FiInstagram size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar (No change) */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PocketValue. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}