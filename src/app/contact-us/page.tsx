import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../contact-us/_components/ContactForm'; // Hum yeh component agle step mein banayenge

export const metadata = {
  title: 'Contact Us | PocketValue',
  description: 'Get in touch with PocketValue. We are here to help you with your queries, orders, and feedback.',
};

export default function ContactPage() {
  return (
    <main className="w-full bg-white dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            We'd love to hear from you! Whether you have a question about our products, an order, or just want to say hello, our team is ready to answer all your questions.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400">Our support team will get back to you within 24 hours.</p>
                  <a href="mailto:support@pocketvalue.pk" className="mt-1 text-brand-primary font-medium hover:underline">
                    support@pocketvalue.pk
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-400">Mon-Fri from 9am to 6pm PST.</p>
                  <a href="tel:+923001234567" className="mt-1 text-brand-primary font-medium hover:underline">
                    +92 300 1234567
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-brand-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Our Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Saddar, Karachi,
                    <br />
                    Sindh, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}