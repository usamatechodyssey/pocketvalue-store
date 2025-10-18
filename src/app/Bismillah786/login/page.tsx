// src/app/admin/login/page.tsx - SIRF STYLING UPDATE

"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { handleAdminLogin, verifyAdminOtp } from "./_actions/loginActions";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCredentialsSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await handleAdminLogin(formData);

    if (result.success) {
      toast.success(result.message);
      setStep(2);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await verifyAdminOtp(formData);

    if (result.success) {
      toast.success("Login Successful! Redirecting...");
      router.push("/Bismillah786");
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <div className="flex min-h-screen items-center justify-center bg-surface-ground">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-surface-base p-8 shadow-lg border border-surface-border">
        <div>
          <h1 className="text-center text-3xl font-bold text-text-primary">
            Admin Panel
          </h1>
        </div>

        {step === 1 && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 mt-1 border border-surface-border-darker rounded-md bg-surface-base focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 mt-1 border border-surface-border-darker rounded-md bg-surface-base focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-brand-primary text-on-primary rounded-md hover:bg-brand-primary-hover disabled:bg-surface-border-darker disabled:text-text-subtle"
            >
              {isLoading ? "Verifying..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <p className="text-center text-sm text-text-secondary">
              An OTP was sent to your admin email.
            </p>
            <div>
              <label className="block text-sm font-medium text-text-primary">
                Enter OTP
              </label>
              <input
                name="otp"
                type="text"
                required
                maxLength={6}
                className="w-full px-3 py-2 mt-1 border border-surface-border-darker rounded-md text-center tracking-[1em] bg-surface-base focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-brand-primary text-on-primary rounded-md hover:bg-brand-primary-hover disabled:bg-surface-border-darker disabled:text-text-subtle"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
