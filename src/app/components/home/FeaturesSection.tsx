// // components/footer/FeaturesSection.tsx (NEXT-GEN NEWSLETTER)

// "use client";

// import React from "react";
// import { Send, Mail } from "lucide-react";

// const FeaturesSection: React.FC = () => (
//   <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
//     <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      
//       {/* === NEWSLETTER CARD === */}
//       <div className="
//         relative w-full max-w-5xl mx-auto 
//         bg-gray-50 dark:bg-white/5 
//         rounded-3xl border border-gray-100 dark:border-gray-800
//         p-8 md:p-16 
//         overflow-hidden text-center
//       ">
        
//         {/* Decorative Background Glow (Subtle) */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

//         {/* Header Content */}
//         <div className="flex flex-col items-center mb-10">
//           <div className="w-12 h-12 mb-6 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-brand-primary shadow-sm rotate-3">
//             <Mail size={24} />
//           </div>
          
//           <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight">
//             Join Our Newsletter
//           </h2>
//           <div className="w-16 h-1 bg-brand-primary mt-4 rounded-full"></div>
          
//           <p className="mt-4 text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
//             Get exclusive access to new arrivals, special offers, and limited deals directly to your inbox.
//           </p>
//         </div>

//         {/* Modern Form */}
//         <form className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3 relative z-10">
//           <div className="relative grow">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="
//                 w-full h-12 px-6 
//                 bg-white dark:bg-gray-900 
//                 border border-gray-200 dark:border-gray-700 
//                 rounded-full 
//                 text-gray-900 dark:text-white
//                 placeholder:text-gray-400 dark:placeholder:text-gray-600
//                 focus:outline-none focus:border-brand-primary dark:focus:border-brand-primary focus:ring-1 focus:ring-brand-primary 
//                 transition-all duration-300
//               "
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="
//               h-12 px-8 
//               flex items-center justify-center gap-2 
//               bg-brand-primary hover:bg-brand-secondary 
//               text-white font-bold text-sm uppercase tracking-widest 
//               rounded-full shadow-lg hover:shadow-brand-primary/30 
//               transition-all duration-300 transform hover:-translate-y-0.5
//             "
//           >
//             <span>Subscribe</span>
//             <Send size={16} className="-mt-0.5" />
//           </button>
//         </form>

//         <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
//           No spam, ever. Unsubscribe anytime.
//         </p>
//       </div>
//     </div>
//   </section>
// );

// export default FeaturesSection;
// components/footer/FeaturesSection.tsx - UPDATED & POLISHED

// "use client";

// import React from "react";
// import { Mail, ArrowRight } from "lucide-react";

// const FeaturesSection: React.FC = () => (
//   <section className="w-full py-12 md:py-20 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
//     <div className="max-w-[1920px] mx-auto px-4 md:px-8">
      
//       {/* === NEWSLETTER CARD === */}
//       <div className="
//         relative overflow-hidden 
//         rounded-2xl md:rounded-3xl 
//         bg-gray-50 dark:bg-white/5 
//         border border-gray-100 dark:border-gray-800
//         px-6 py-12 md:px-12 md:py-20 
//         text-center
//       ">
        
//         {/* Decorative Background Glow */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl bg-brand-primary/5 blur-3xl rounded-full pointer-events-none" />

//         {/* Decorative Icon (Faded behind text) */}
//         <Mail 
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-800 opacity-20 -rotate-12" 
//           size={300} 
//           strokeWidth={0.5}
//         />

//         <div className="relative z-10 max-w-3xl mx-auto">
//           {/* Header */}
//           <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
//             Join Our Newsletter
//           </h2>
//           <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
//             Subscribe to get updates on new arrivals, special offers, and exclusive events directly to your inbox.
//           </p>

//           {/* Form */}
//           <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
//             <div className="relative grow">
//               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                 <Mail className="text-gray-400" size={20} />
//               </div>
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 className="
//                   w-full h-12 pl-11 pr-4 
//                   bg-white dark:bg-gray-900 
//                   border border-gray-200 dark:border-gray-700 
//                   rounded-full 
//                   text-gray-900 dark:text-white placeholder-gray-400 
//                   focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent
//                   transition-all duration-300
//                 "
//               />
//             </div>
            
//             <button
//               type="submit"
//               className="
//                 group flex items-center justify-center gap-2 
//                 h-12 px-8 
//                 bg-brand-primary hover:bg-brand-secondary 
//                 text-white font-bold uppercase tracking-wider text-sm 
//                 rounded-full shadow-lg hover:shadow-brand-primary/30 
//                 transition-all duration-300
//               "
//             >
//               <span>Subscribe</span>
//               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </form>

//           <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
//             We respect your privacy. Unsubscribe at any time.
//           </p>
//         </div>
//       </div>
//     </div>
//   </section>
// );

// export default FeaturesSection;
// components/footer/FeaturesSection.tsx (FINAL POLISHED VERSION)

// "use client";

// import React from "react";
// import { Mail, ArrowRight } from "lucide-react";

// const FeaturesSection: React.FC = () => (
//   <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-900">
//     <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
      
//       <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        
//         {/* === ICON === */}
//         <div className="mb-6 p-4 bg-brand-primary/5 dark:bg-brand-primary/10 rounded-full text-brand-primary">
//           <Mail size={32} />
//         </div>

//         {/* === HEADER === */}
//         <h2 className="text-2xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
//           Join Our Newsletter
//         </h2>
//         <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-10">
//           Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
//         </p>

//         {/* === FORM (Next-Gen Pill Style) === */}
//         <form className="w-full max-w-lg relative group">
          
//           <div className="relative flex items-center">
//             {/* Input Icon */}
//             <Mail className="absolute left-4 text-gray-400 group-focus-within:text-brand-primary transition-colors z-10" size={20} />
            
//             {/* Input Field */}
//             <input
//               type="email"
//               placeholder="Enter your email address"
//               className="
//                 w-full pl-12 pr-4 md:pr-40 py-4 
//                 bg-gray-50 dark:bg-white/5 
//                 border border-gray-200 dark:border-gray-800 
//                 rounded-full 
//                 text-gray-900 dark:text-white 
//                 placeholder-gray-400 
//                 outline-none 
//                 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary 
//                 transition-all duration-300
//                 shadow-sm
//               "
//               required
//             />

//             {/* Desktop Button (Inside Input) */}
//             <button
//               type="submit"
//               className="
//                 hidden md:flex absolute right-1.5 top-1.5 bottom-1.5 
//                 items-center gap-2 
//                 bg-brand-primary hover:bg-brand-primary-hover 
//                 text-white font-bold text-sm uppercase tracking-wide 
//                 px-6 rounded-full 
//                 transition-all duration-300 
//                 hover:shadow-lg hover:scale-105 active:scale-95
//               "
//             >
//               <span>Subscribe</span>
//               <ArrowRight size={16} />
//             </button>
//           </div>

//           {/* Mobile Button (Stacked below input) */}
//           <button
//             type="submit"
//             className="
//               md:hidden w-full mt-4 
//               flex items-center justify-center gap-2 
//               bg-brand-primary hover:bg-brand-primary-hover 
//               text-white font-bold text-sm uppercase tracking-wide 
//               py-4 rounded-full 
//               transition-all duration-300 shadow-md
//             "
//           >
//             <span>Subscribe Now</span>
//             <ArrowRight size={18} />
//           </button>

//         </form>

//         {/* Privacy Note */}
//         <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
//           By subscribing, you agree to our Terms & Conditions and Privacy Policy.
//         </p>

//       </div>
//     </div>
//   </section>
// );

// export default FeaturesSection;
// components/FeaturesSection.tsx

"use client";

import React from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const FeaturesSection: React.FC = () => (
  <section className="relative w-full py-20 md:py-24 overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900">
    
    {/* === 1. BACKGROUND ATMOSPHERE (The Glow) === */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 dark:bg-brand-primary/10 blur-[100px] rounded-full" />
      {/* Decorative Icon Background */}
      <Mail 
        className="absolute top-10 right-10 w-64 h-64 text-gray-50 dark:text-white/5 -rotate-12 pointer-events-none select-none" 
        strokeWidth={0.5}
      />
    </div>

    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      
      {/* === 2. HEADER SECTION === */}
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
        </span>
        Newsletter
      </div>

      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
        Join the <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-secondary">Inner Circle</span>
      </h2>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
        Be the first to know about new arrivals, exclusive drops, and secret sales. 
        We promise not to spam your inbox.
      </p>

      {/* === 3. PREMIUM INPUT FORM (The Star) === */}
      <form className="max-w-md mx-auto group">
        <div className="relative flex items-center p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full shadow-lg hover:shadow-xl hover:border-brand-primary/30 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 transition-all duration-300">
          
          {/* Icon inside Input */}
          <div className="pl-4 text-gray-400 group-focus-within:text-brand-primary transition-colors">
            <Mail size={20} />
          </div>

          <input
            type="email"
            placeholder="Enter your email address..."
            className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base"
            required
          />

          <button
            type="submit"
            className="
              shrink-0 flex items-center gap-2 
              px-6 py-3 rounded-full 
              bg-brand-primary hover:bg-brand-primary-hover 
              text-white font-bold text-sm uppercase tracking-wide
              transition-all duration-300 transform active:scale-95
              shadow-md hover:shadow-lg
            "
          >
            <span>Subscribe</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {/* === 4. TRUST BADGES === */}
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-500" />
          <span>No spam, ever</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-500" />
          <span>Unsubscribe anytime</span>
        </div>
      </div>

    </div>
  </section>
);

export default FeaturesSection;