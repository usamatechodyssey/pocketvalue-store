import Link from 'next/link';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function MainFooter() {
  return (
    <footer className="bg-gray-800 dark:bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold text-white text-lg mb-4">PocketValue</h3>
            <p className="text-sm leading-relaxed">
              Your one-stop shop for everything you need. Quality products, unbeatable prices, delivered to your doorstep.
            </p>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/faq" className="text-gray-300 hover:text-orange-400 transition-colors">Help Center</Link></li>
              <li><Link href="/returns-and-refunds" className="text-gray-300 hover:text-orange-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact-us" className="text-gray-300 hover:text-orange-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">About PocketValue</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="text-gray-300 hover:text-orange-400 transition-colors">Our Story</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-300 hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy-policy" className="text-gray-300 hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Follow Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-orange-400 transition-colors" aria-label="Instagram">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} PocketValue. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}