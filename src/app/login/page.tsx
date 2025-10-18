"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Loader2, LogIn } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

// SocialLogins component ko yahan move kar dein
const SocialLogins = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    if (provider === "google") setIsGoogleLoading(true);
    if (provider === "facebook") setIsFacebookLoading(true);
    await signIn(provider, { callbackUrl: "/account" });
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={isGoogleLoading || isFacebookLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <FaGoogle className="text-[#DB4437]" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Google
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("facebook")}
          disabled={isGoogleLoading || isFacebookLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          <FaFacebook className="text-[#1877F2]" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            Facebook
          </span>
        </button>
      </div>
    </>
  );
};

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledEmail = searchParams.get("email");
  const callbackUrl = searchParams.get("redirect") || "/account";

  const [email, setEmail] = useState(prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Invalid email or password. Please try again.");
      } else if (result.error === "EmailNotVerified") {
        toast.error(
          "Your email is not verified. Please check your inbox for the OTP."
        );
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else if (result.error === "PhoneNotVerified") {
        toast.error("Your phone number is not verified.");
        router.push(`/verify-phone?email=${encodeURIComponent(email)}`);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      setIsLoading(false);
    } else {
      toast.success("Logged in successfully!");
      // Don't set loading to false on success, as router will navigate away
      router.push(callbackUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email-login"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          id="email-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <label
            htmlFor="password-login"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <input
          id="password-login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && <Loader2 className="animate-spin" size={20} />}
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default function LoginPage() {
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Login to Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center pt-10">
              <Loader2 className="animate-spin text-brand-primary" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <SocialLogins />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand-primary hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
