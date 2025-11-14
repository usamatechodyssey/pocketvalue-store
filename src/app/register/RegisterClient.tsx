// /src/app/register/RegisterClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Loader2, ShieldCheck } from "lucide-react";

// Firebase imports
import { auth } from "@/app/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Phone Number Input library
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { useForm, Control } from "react-hook-form";

const ALLOWED_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "protonmail.com",
]);

// Social Logins component
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

// Main Page Component
type FormData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export default function RegisterClient() {
  const {
    control,
    register,
    handleSubmit: handleReactHookFormSubmit,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormData>();
  const router = useRouter();

  const [uiState, setUiState] = useState<"details" | "otp">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState("");

  const inputStyles =
    "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";

  useEffect(() => {
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  }, []);

  const onDetailsSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(
        auth,
        data.phone,
        appVerifier
      );
      setConfirmationResult(confirmation);
      setUiState("otp");
      toast.success(`OTP sent to ${data.phone}`);
    } catch (error: any) {
      console.error("Firebase OTP Error:", error);
      toast.error(
        error.message || "Failed to send OTP. Check the number and try again."
      );
      // @ts-ignore
      window.recaptchaVerifier.render().then((widgetId: any) => {
        // @ts-ignore
        if (typeof grecaptcha !== "undefined") grecaptcha.reset(widgetId);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async () => {
    if (otp.length !== 6 || !confirmationResult) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      const { name, email, password, phone } = getValues();

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message);
        setUiState("details");
      }
    } catch (error: any) {
      console.error("OTP Confirmation or Registration Error:", error);
      toast.error(
        error.code === "auth/invalid-verification-code"
          ? "The OTP you entered is incorrect. Please try again."
          : "Verification failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-12 bg-gray-50 dark:bg-gray-900">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {uiState === "details" && (
          <>
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
              Create Your Account
            </h1>
            <SocialLogins />
            <form
              onSubmit={handleReactHookFormSubmit(onDetailsSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={inputStyles}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    validate: {
                      isAllowedDomain: (value) =>
                        ALLOWED_EMAIL_DOMAINS.has(
                          value.split("@")[1]?.toLowerCase()
                        ) || "Please use a valid email provider.",
                    },
                  })}
                  onBlur={() => trigger("email")}
                  className={inputStyles}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={inputStyles}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number (for verification)
                </label>
                <div
                  className={`mt-1 flex items-center w-full rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus-within:ring-2 focus-within:ring-brand-primary ${inputStyles.replace("py-2.5 px-3.5", "")}`}
                >
                  <PhoneInputWithCountry
                    name="phone"
                    control={control as unknown as Control}
                    rules={{ required: "Phone number is required" }}
                    defaultCountry="PK"
                    countries={["PK"]}
                    international={false}
                    countrySelectProps={{ disabled: true }}
                    className="phone-input-custom"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 bg-brand-primary text-on-primary font-semibold rounded-md hover:bg-brand-primary-hover disabled:bg-opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </button>
            </form>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-brand-primary hover:underline"
              >
                Log In
              </Link>
            </p>
          </>
        )}

        {uiState === "otp" && (
          <div className="text-center">
            <ShieldCheck
              size={48}
              className="mx-auto text-brand-primary mb-4"
            />
            <h1 className="text-2xl font-bold">Verify Your Phone</h1>
            <p className="mt-2">
              Enter the 6-digit code we sent to <br />
              <span className="font-bold">{getValues("phone")}</span>
            </p>
            <div className="my-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-48 text-center text-2xl font-semibold tracking-[10px] rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <button
              onClick={onOtpSubmit}
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 bg-brand-primary text-on-primary font-semibold rounded-md hover:bg-brand-primary-hover disabled:bg-opacity-70"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify & Create Account"
              )}
            </button>
            <button
              onClick={() => setUiState("details")}
              className="mt-4 text-sm hover:underline"
            >
              Change phone number
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        .phone-input-custom .PhoneInputInput {
          flex-grow: 1;
          border: none;
          outline: none;
          background-color: transparent;
          height: 2.375rem;
          padding-left: 0.5rem;
        }
        .phone-input-custom .PhoneInputCountry {
          padding: 0 0.75rem;
        }
        .phone-input-custom .PhoneInputCountrySelect {
          display: none;
        }
      `}</style>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - Renamed the file to `RegisterClient.tsx` and the component to `RegisterClient`.
// - Removed the `metadata` export to resolve the Next.js build error.
// - This file now exclusively handles the client-side logic for the registration form.
