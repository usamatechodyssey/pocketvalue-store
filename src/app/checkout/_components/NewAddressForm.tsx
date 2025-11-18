// // // // /src/app/checkout/_components/NewAddressForm.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
// import { LocateFixed, CheckCircle, Loader2 } from "lucide-react";
// import dynamic from "next/dynamic";
// import { StylesConfig } from "react-select";
// import AddressInputFields from "./AddressInputFields";
// import AddressLocationSelectors from "./AddressLocationSelectors";

// const LocationPicker = dynamic(() => import("./LocationPicker"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
//       <Loader2 className="animate-spin text-gray-400" />
//     </div>
//   ),
// });

// export interface ShippingInfo {
//   fullName: string;
//   phone: string;
//   province: { value: string; label: string } | null;
//   city: { value: string; label: string } | null;
//   area: string;
//   address: string;
//   lat: number | null;
//   lng: number | null;
// }

// interface NewAddressFormProps {
//   shippingInfo: ShippingInfo;
//   onShippingInfoChange: (info: ShippingInfo) => void;
//   errors: Partial<Record<keyof ShippingInfo, boolean>>;
// }

// export default function NewAddressForm({
//   shippingInfo,
//   onShippingInfoChange,
//   errors,
// }: NewAddressFormProps) {
//   const { theme } = useTheme();
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   const [showMap, setShowMap] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onShippingInfoChange({ ...shippingInfo, [e.target.name]: e.target.value });
//   };
//   const handleSelectChange = (name: "province" | "city", option: any) => {
//     let newInfo = { ...shippingInfo, [name]: option };
//     if (name === "province") newInfo.city = null;
//     onShippingInfoChange(newInfo);
//   };
//   const handleLocationSelect = (lat: number, lng: number) => {
//     onShippingInfoChange({ ...shippingInfo, lat, lng });
//   };

//   const getErrorStyles = (hasError: boolean) => {
//     return hasError ? "!border-red-500 !ring-red-500" : "";
//   };

//   // === THE FIX IS HERE ===
//   // customSelectStyles is now a function that accepts the error state,
//   // matching the prop type expected by the child component.
//   const customSelectStyles = (hasError: boolean): StylesConfig => ({
//     control: (provided, state) => ({
//       ...provided,
//       backgroundColor: theme === "dark" ? "#1f2937" : "white",
//       borderColor: hasError
//         ? "#ef4444"
//         : state.isFocused
//           ? "#f97316"
//           : theme === "dark"
//             ? "#4b5563"
//             : "#d1d5db",
//       minHeight: "42px",
//       boxShadow: hasError
//         ? "0 0 0 1px #ef4444"
//         : state.isFocused
//           ? "0 0 0 1px #f97316"
//           : "none",
//       transition: "border-color 0.2s, box-shadow 0.2s",
//       "&:hover": {
//         borderColor: hasError
//           ? "#ef4444"
//           : state.isFocused
//             ? "#f97316"
//             : theme === "dark"
//               ? "#6b7280"
//               : "#a5b4fc",
//       },
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: theme === "dark" ? "#1f2937" : "white",
//       zIndex: 20,
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isSelected
//         ? "#f97316"
//         : state.isFocused
//           ? theme === "dark"
//             ? "#374151"
//             : "#f3f4f6"
//           : "transparent",
//       color: "inherit",
//       "&:active": { backgroundColor: "#fb923c" },
//     }),
//     singleValue: (provided) => ({ ...provided, color: "inherit" }),
//     input: (provided) => ({ ...provided, color: "inherit" }),
//   });

//   const inputStyles = `appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition duration-200 sm:text-sm`;

//   return (
//     <div className="space-y-4 pt-4 animate-fade-in">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//         Enter a New Address
//       </h2>
//       <div className="space-y-4">
//         <AddressInputFields
//           shippingInfo={shippingInfo}
//           handleInputChange={handleInputChange}
//           inputStyles={inputStyles}
//           errors={errors}
//           getErrorStyles={getErrorStyles}
//         />
//         <AddressLocationSelectors
//           shippingInfo={shippingInfo}
//           handleSelectChange={handleSelectChange}
//           customSelectStyles={customSelectStyles}
//           isMounted={isMounted}
//           errors={errors}
//         />
//       </div>
//       <div className="pt-2">
//         <div className="flex justify-between items-center">
//           <button
//             type="button"
//             onClick={() => setShowMap(!showMap)}
//             className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-2"
//           >
//             <LocateFixed size={16} />{" "}
//             {showMap ? "Hide Map" : "Pin Exact Location (Optional)"}
//           </button>
//           {shippingInfo.lat && (
//             <p className="text-xs text-green-600 flex items-center gap-1">
//               <CheckCircle size={14} /> Location Pinned!
//             </p>
//           )}
//         </div>
//         {showMap && isMounted && (
//           <div className="mt-3 rounded-lg overflow-hidden border dark:border-gray-600 relative z-0">
//             <LocationPicker onLocationSelect={handleLocationSelect} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// /src/app/checkout/_components/NewAddressForm.tsx (COMPLETE, FINAL CODE WITH OTP FIX + DEBUG LOGS)

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { LocateFixed, CheckCircle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { StylesConfig } from "react-select";
import { toast } from "react-hot-toast";

// Firebase imports for OTP
import { auth } from "@/app/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
// SAHI IMPORT (CORRECT IMPORT)
import { updateUserPhone } from "@/app/actions/authActions";
// Phone Number library import for validation
import { isValidPhoneNumber } from 'react-phone-number-input';

import AddressInputFields from "./AddressInputFields";
import AddressLocationSelectors from "./AddressLocationSelectors";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <Loader2 className="animate-spin text-gray-400" />
    </div>
  ),
});

export interface ShippingInfo {
  fullName: string;
  phone: string;
  province: { value: string; label: string } | null;
  city: { value: string; label: string } | null;
  area: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

interface NewAddressFormProps {
  shippingInfo: ShippingInfo;
  onShippingInfoChange: (info: ShippingInfo) => void;
  errors: Partial<Record<keyof ShippingInfo, boolean>>;
  isPhoneVerified: boolean;
  onPhoneVerified: () => void;
}

export default function NewAddressForm({
  shippingInfo,
  onShippingInfoChange,
  errors,
  isPhoneVerified,
  onPhoneVerified,
}: NewAddressFormProps) {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // --- NEW STATE FOR OTP FLOW ---
  const [otpUiState, setOtpUiState] = useState<"idle" | "sending" | "sent" | "verifying">("idle");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Setup invisible reCAPTCHA verifier
    // @ts-ignore
    if (!window.recaptchaVerifier) {
      // @ts-ignore
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container-checkout", { size: "invisible" });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onShippingInfoChange({ ...shippingInfo, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (name: "province" | "city", option: any) => {
    let newInfo = { ...shippingInfo, [name]: option };
    if (name === "province") newInfo.city = null;
    onShippingInfoChange(newInfo);
  };
  const handleLocationSelect = (lat: number, lng: number) => {
    onShippingInfoChange({ ...shippingInfo, lat, lng });
  };

  const handleSendOtp = async () => {
    console.log("--- [DEBUG] handleSendOtp triggered ---");
    console.log("[DEBUG] Current phone number state:", shippingInfo.phone);

    // --- THE CRITICAL FIX IS HERE ---
    // Use the library's built-in validator to check the number format.
    if (!isValidPhoneNumber(shippingInfo.phone)) {
      toast.error("Please enter a valid Pakistani phone number (e.g., +923001234567).");
      console.error("[DEBUG] Invalid phone number format:", shippingInfo.phone);
      return;
    }
    
    // The phone number from react-phone-number-input should already be in E.164 format.
    const phoneNumberInE164 = shippingInfo.phone;
    console.log("[DEBUG] Phone number is valid. Sending to Firebase in E.164 format:", phoneNumberInE164);

    setOtpUiState("sending");
    try {
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumberInE164, appVerifier);
      setConfirmationResult(confirmation);
      setOtpUiState("sent");
      toast.success(`OTP sent to ${phoneNumberInE164}`);
      console.log("[DEBUG] OTP sent successfully.");
    } catch (error) {
      console.error("[DEBUG] Firebase OTP sending error:", error);
      toast.error("Failed to send OTP. Please check the number and try again.");
      setOtpUiState("idle");
    }
  };

  const handleVerifyOtp = async () => {
    console.log("--- [DEBUG] handleVerifyOtp triggered ---");
    if (!otp || otp.length !== 6 || !confirmationResult) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    setOtpUiState("verifying");
    try {
      await confirmationResult.confirm(otp);
      console.log("[DEBUG] OTP confirmed with Firebase.");
      
      const result = await updateUserPhone(session!.user!.email!, shippingInfo.phone);
      console.log("[DEBUG] updateUserPhone server action result:", result);

      if (result.success) {
        toast.success(result.message);
        onPhoneVerified(); // Inform the parent component that verification is complete
      } else {
        toast.error(result.message);
        setOtpUiState("sent"); // Allow user to try again
      }
    } catch (error) {
      console.error("[DEBUG] OTP verification error:", error);
      toast.error("Incorrect OTP. Please try again.");
      setOtpUiState("sent");
    }
  };


  const getErrorStyles = (hasError: boolean) => {
    return hasError ? "!border-red-500 !ring-red-500" : "";
  };

  const customSelectStyles = (hasError: boolean): StylesConfig => ({
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      borderColor: hasError ? "#ef4444" : state.isFocused ? "#f97316" : theme === "dark" ? "#4b5563" : "#d1d5db",
      minHeight: "42px",
      boxShadow: hasError ? "0 0 0 1px #ef4444" : state.isFocused ? "0 0 0 1px #f97316" : "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      "&:hover": {
        borderColor: hasError ? "#ef4444" : state.isFocused ? "#f97316" : theme === "dark" ? "#6b7280" : "#a5b4fc",
      },
    }),
    menu: (provided) => ({ ...provided, backgroundColor: theme === "dark" ? "#1f2937" : "white", zIndex: 20 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f97316" : state.isFocused ? (theme === "dark" ? "#374151" : "#f3f4f6") : "transparent",
      color: "inherit",
      "&:active": { backgroundColor: "#fb923c" },
    }),
    singleValue: (provided) => ({ ...provided, color: "inherit" }),
    input: (provided) => ({ ...provided, color: "inherit" }),
  });

  const inputStyles = `appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition duration-200 sm:text-sm`;

  return (
    <div className="space-y-4 pt-4 animate-fade-in">
      <div id="recaptcha-container-checkout"></div> {/* Invisible reCAPTCHA container */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Enter a New Address
      </h2>
      <div className="space-y-4">
        <AddressInputFields
          shippingInfo={shippingInfo}
          handleInputChange={handleInputChange}
          inputStyles={inputStyles}
          errors={errors}
          getErrorStyles={getErrorStyles}
        />
        <AddressLocationSelectors
          shippingInfo={shippingInfo}
          handleSelectChange={handleSelectChange}
          customSelectStyles={customSelectStyles}
          isMounted={isMounted}
          errors={errors}
        />
        
        {/* --- NEW OTP VERIFICATION UI --- */}
        <div className="pt-2">
            {isPhoneVerified ? (
                <div className="flex items-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-sm font-semibold text-green-800 dark:text-green-300">
                    <CheckCircle size={16} />
                    Phone number verified: {shippingInfo.phone}
                </div>
            ) : (
                <div className="space-y-3">
                    {otpUiState === "sent" || otpUiState === "verifying" ? (
                        <div>
                            <label htmlFor="otp-input" className="block text-sm font-medium mb-1">Enter OTP</label>
                            <div className="flex gap-2">
                                <input 
                                    id="otp-input"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    className={`${inputStyles} text-center tracking-[4px]`}
                                    disabled={otpUiState === 'verifying'}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={otpUiState === 'verifying'}
                                    className="px-5 py-2 bg-brand-primary text-white text-sm font-bold rounded-md hover:bg-brand-primary-hover disabled:bg-gray-400"
                                >
                                    {otpUiState === 'verifying' ? <Loader2 className="animate-spin" size={18} /> : 'Verify'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium mb-1">Verify Phone Number</label>
                             <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={otpUiState === 'sending'}
                                className="w-full flex justify-center py-2.5 px-4 border border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-primary/10 disabled:opacity-50"
                            >
                                {otpUiState === 'sending' ? <Loader2 className="animate-spin" /> : 'Send Verification Code'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
      <div className="pt-2">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-2"
          >
            <LocateFixed size={16} />{" "}
            {showMap ? "Hide Map" : "Pin Exact Location (Optional)"}
          </button>
          {shippingInfo.lat && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle size={14} /> Location Pinned!
            </p>
          )}
        </div>
        {showMap && isMounted && (
          <div className="mt-3 rounded-lg overflow-hidden border dark:border-gray-600 relative z-0">
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </div>
        )}
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Fixed Firebase Phone Format Error:** The `handleSendOtp` function now uses `isValidPhoneNumber` to validate the number *before* sending it to Firebase, fixing the `auth/invalid-phone-number` error.
// - **Guaranteed E.164 Format:** The `react-phone-number-input` component (used in the child component) automatically provides the phone number in the E.164 format (e.g., `+923001234567`) that Firebase requires.
// - **Added Extensive Debug Logs:** `console.log` is added to `handleSendOtp` and `handleVerifyOtp` to track the phone number's value and log any errors from Firebase.