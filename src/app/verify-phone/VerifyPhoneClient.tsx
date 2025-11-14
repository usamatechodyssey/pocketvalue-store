// /src/app/verify-phone/VerifyPhoneClient.tsx

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { signIn } from "next-auth/react";
import { auth } from "@/app/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { updateUserPhone } from "@/app/actions/authActions";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { useForm, Control } from "react-hook-form";

// METADATA EXPORT HAS BEEN REMOVED

const VerifyPhoneForm = () => {
  const {
    control,
    handleSubmit: handleReactHookFormSubmit,
    getValues,
  } = useForm<{ phone: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [uiState, setUiState] = useState<"details" | "otp">("details");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [otp, setOtp] = useState("");

  const inputStyles =
    "appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm";
  const otpInputStyles =
    "w-48 text-center text-2xl font-semibold tracking-[10px] rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition-all";

  useEffect(() => {
    if (!userEmail) {
      toast.error("Invalid session. Redirecting...");
      router.push("/login");
      return;
    }
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  }, [userEmail, router]);

  const onPhoneSubmit = async (data: { phone: string }) => {
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
      toast.error(error.message || "Failed to send OTP.");
      // @ts-ignore
      window.recaptchaVerifier.render().then((widgetId: any) => {
        if (typeof window.grecaptcha !== "undefined") {
          window.grecaptcha.reset(widgetId);
        }
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
      const phone = getValues("phone");
      const result = await updateUserPhone(userEmail!, phone);

      if (result.success) {
        toast.success(result.message);
        const signInResult = await signIn("credentials", {
          email: userEmail,
          isSocialVerification: "true",
          redirect: false,
        });
        if (signInResult?.ok) {
          router.push("/account");
        } else {
          throw new Error(
            signInResult?.error || "Login after verification failed."
          );
        }
      } else {
        toast.error(result.message);
        setUiState("details");
      }
    } catch (error: any) {
      console.error("Verification/Login Error:", error);
      toast.error(
        error.code === "auth/invalid-verification-code"
          ? "Incorrect OTP."
          : "Verification failed."
      );
      setIsLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] py-12 bg-gray-50 dark:bg-gray-900">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {uiState === "details" && (
          <form
            onSubmit={handleReactHookFormSubmit(onPhoneSubmit)}
            className="space-y-6 text-center"
          >
            <Smartphone size={48} className="mx-auto text-brand-primary" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Verify Your Phone Number
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              To complete your account setup, please provide and verify your
              phone number.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left mb-1">
                Phone Number
              </label>
              <div
                className={`flex items-center w-full rounded-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 bg-white dark:bg-gray-900 shadow-sm focus-within:ring-2 focus-within:ring-brand-primary ${inputStyles.replace("py-2.5 px-3.5", "")}`}
              >
                <PhoneInputWithCountry
                  name="phone"
                  control={control as unknown as Control}
                  rules={{ required: true }}
                  defaultCountry="PK"
                  countries={["PK"]}
                  international={false}
                  countrySelectProps={{ disabled: true }}
                  className="phone-input-custom"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 bg-brand-primary text-on-primary font-semibold rounded-md hover:bg-brand-primary-hover disabled:bg-opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </form>
        )}
        {uiState === "otp" && (
          <div className="text-center">
            <ShieldCheck
              size={48}
              className="mx-auto text-brand-primary mb-4"
            />
            <h1 className="text-2xl font-bold">Enter Verification Code</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              We've sent a 6-digit code to <br />
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {getValues("phone")}
              </span>
            </p>
            <div className="my-6">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={otpInputStyles}
              />
            </div>
            <button
              onClick={onOtpSubmit}
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 bg-brand-primary text-on-primary font-semibold rounded-md hover:bg-brand-primary-hover disabled:bg-opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>
            <button
              onClick={() => setUiState("details")}
              className="mt-4 text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
              Use a different number
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
};

export default function VerifyPhoneClient() {
  // Renamed from VerifyPhonePage
  // The Suspense was moved to the parent Server Component
  return <VerifyPhoneForm />;
}
