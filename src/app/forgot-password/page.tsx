"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Mail, Loader2, KeyRound } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/authActions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await requestPasswordReset(email);
    setIsLoading(false);
    
    // API hamesha 'success: true' bhejta hai taake email snooping na ho,
    // is liye hum hamesha success state hi dikhayenge.
    if (result.success) {
      setIsSubmitted(true);
    } else {
      // Yeh sirf server error (e.g., mail server down) ki soorat mein dikhega
      toast.error(result.message);
    }
  };

  if (isSubmitted) {
    return (
      <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <Mail size={48} className="mx-auto text-brand-primary mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Check Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            If an account with that email exists, we've sent a link to reset your password.
          </p>
           <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-brand-primary hover:underline">
              ← Back to Login
           </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <KeyRound size={40} className="mx-auto text-brand-primary mb-4"/>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Forgot Your Password?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                No problem. Enter your email and we'll send you a reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email-forgot" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email-forgot"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && <Loader2 className="animate-spin" size={20} />}
                {isLoading ? "Sending Link..." : "Send Reset Link"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Remembered your password?{" "}
              <Link href="/login" className="font-semibold text-brand-primary hover:underline">
                Log in here
              </Link>
            </p>
        </div>
    </main>
  );
}