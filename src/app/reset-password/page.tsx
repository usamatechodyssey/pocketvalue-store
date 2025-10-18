"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { KeyRound, CheckCircle, Loader2 } from "lucide-react";
import { resetPassword, getEmailFromToken } from "@/app/actions/authActions";
import Link from "next/link";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    async function validateToken() {
        if (!token) {
          toast.error("Invalid or missing reset token.");
          router.replace("/forgot-password");
          return;
        }
        const email = await getEmailFromToken(token);
        if (email) {
          setUserEmail(email);
          setIsTokenValid(true);
        } else {
          toast.error("This token is invalid or has expired.");
          router.replace("/forgot-password");
        }
    }
    validateToken();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const result = await resetPassword(token!, password);
    if (result.success) {
      toast.success(result.message);
      setIsSuccess(true);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };
  
  if (!isTokenValid) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-primary" /></div>
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle size={48} className="mx-auto text-green-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Password Reset!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          You can now log in with your new password.
        </p>
        <Link
          href={`/login?email=${encodeURIComponent(userEmail)}`}
          className="inline-block w-full py-3 px-4 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password"
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading && <Loader2 className="animate-spin" size={20} />}
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default function ResetPasswordPage() {
  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900 flex justify-center items-center min-h-screen py-12 px-4">
        <div className="w-full max-w-md p-8 sm:p-10 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <KeyRound size={40} className="mx-auto text-brand-primary mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Set a New Password
              </h1>
            </div>
            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-primary" /></div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    </main>
  );
}