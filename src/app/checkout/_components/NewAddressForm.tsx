
// // /src/app/checkout/_components/NewAddressForm.tsx (FIXED)

// "use client";

// import { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
// import { useSession } from "next-auth/react";
// import {
//   LocateFixed,
//   CheckCircle,
//   Loader2,
//   AlertCircle,
//   Edit2,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// import { StylesConfig } from "react-select";
// import { toast } from "react-hot-toast";

// import { auth } from "@/app/lib/firebase";
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   ConfirmationResult,
// } from "firebase/auth";
// import {
//   updateUserPhone,
//   checkPhoneVerificationStatus,
// } from "@/app/actions/authActions";
// import { isValidPhoneNumber } from "react-phone-number-input";

// import AddressInputFields from "./AddressInputFields";
// import AddressLocationSelectors from "./AddressLocationSelectors";

// // --- Dynamic Import with Loading Skeleton ---
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
//   isPhoneVerified: boolean;
//   onPhoneVerified: () => void;
//   sessionVerifiedPhone?: string | null;
//   onEditPhone: () => void;
// }

// // Helper to safely access window property
// declare global {
//   interface Window {
//     recaptchaVerifier: RecaptchaVerifier | undefined;
//   }
// }

// export default function NewAddressForm({
//   shippingInfo,
//   onShippingInfoChange,
//   errors,
//   isPhoneVerified,
//   onPhoneVerified,
//   sessionVerifiedPhone,
//   onEditPhone,
// }: NewAddressFormProps) {
//   const { data: session, update } = useSession();
//   const { theme } = useTheme();
//   const [isMounted, setIsMounted] = useState(false);
//   const [showMap, setShowMap] = useState(false);

//   const [otpUiState, setOtpUiState] = useState<
//     "idle" | "sending" | "sent" | "verifying"
//   >("idle");
//   const [otp, setOtp] = useState("");
//   const [confirmationResult, setConfirmationResult] =
//     useState<ConfirmationResult | null>(null);

//   useEffect(() => {
//     setIsMounted(true);
//     // Initialize Recaptcha only once
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container-checkout",
//         { size: "invisible" }
//       );
//     }
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onShippingInfoChange({ ...shippingInfo, [e.target.name]: e.target.value });
//   };

//   const handlePhoneChange = (value?: string) => {
//     onShippingInfoChange({ ...shippingInfo, phone: value || "" });
//   };

//   const handleSelectChange = (name: "province" | "city", option: any) => {
//     const newInfo = { ...shippingInfo, [name]: option };
//     if (name === "province") newInfo.city = null;
//     onShippingInfoChange(newInfo);
//   };

//   const handleLocationSelect = (lat: number, lng: number) => {
//     onShippingInfoChange({ ...shippingInfo, lat, lng });
//   };

//   // --- OTP LOGIC ---
//   const handleSendOtp = async () => {
//     if (!shippingInfo.phone || !isValidPhoneNumber(shippingInfo.phone)) {
//       toast.error("Please enter a valid phone number first.");
//       return;
//     }

//     setOtpUiState("sending");

//     try {
//       const isAlreadyVerifiedInDB = await checkPhoneVerificationStatus(
//         shippingInfo.phone
//       );

//       if (isAlreadyVerifiedInDB) {
//         toast.success("Number already verified on your account!");
//         await update({ phone: shippingInfo.phone, phoneVerified: true });
//         onPhoneVerified();
//         setOtpUiState("idle");
//         return;
//       }

//       const appVerifier = window.recaptchaVerifier;
//       if (!appVerifier) {
//          throw new Error("Recaptcha not initialized");
//       }

//       const confirmation = await signInWithPhoneNumber(
//         auth,
//         shippingInfo.phone,
//         appVerifier
//       );
//       setConfirmationResult(confirmation);
//       setOtpUiState("sent");
//       toast.success(`Verification code sent to ${shippingInfo.phone}`);
//     } catch (error: any) {
//       console.error("OTP Process Error:", error);
//       let msg = "Failed to send OTP. Please try again.";
//       if (error.code === "auth/too-many-requests")
//         msg = "Too many requests. Please try again later.";
//       toast.error(msg);
//       setOtpUiState("idle");
      
//       // Reset recaptcha on error to allow retry
//       if (window.recaptchaVerifier) {
//         window.recaptchaVerifier.clear();
//         window.recaptchaVerifier = undefined;
//         // Re-init
//         window.recaptchaVerifier = new RecaptchaVerifier(
//             auth,
//             "recaptcha-container-checkout",
//             { size: "invisible" }
//         );
//       }
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp || otp.length !== 6 || !confirmationResult) {
//       toast.error("Please enter the 6-digit code.");
//       return;
//     }

//     setOtpUiState("verifying");
//     try {
//       await confirmationResult.confirm(otp);

//       if (session?.user?.email) {
//         const result = await updateUserPhone(
//           session.user.email,
//           shippingInfo.phone
//         );

//         if (result.success) {
//           toast.success("Phone number verified successfully!");

//           await update({
//             phone: shippingInfo.phone,
//             phoneVerified: true,
//           });

//           onPhoneVerified();
//         } else {
//           toast.error(result.message);
//           setOtpUiState("sent");
//         }
//       } else {
//         toast.error("Session error. Please refresh.");
//         setOtpUiState("sent");
//       }
//     } catch (error) {
//       console.error("OTP Verification Error:", error);
//       toast.error("Incorrect code. Please try again.");
//       setOtpUiState("sent");
//     }
//   };

//   const getErrorStyles = (hasError: boolean) => {
//     return hasError ? "!border-red-500 !ring-red-500" : "";
//   };

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
//       <div id="recaptcha-container-checkout"></div>

//       <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//         Enter a New Address
//       </h2>

//       <div className="space-y-4">
//         <AddressInputFields
//           shippingInfo={shippingInfo}
//           handleInputChange={handleInputChange}
//           onPhoneChange={handlePhoneChange}
//           inputStyles={inputStyles}
//           errors={errors}
//           getErrorStyles={getErrorStyles}
//           // LOCK INPUT IF VERIFIED
//           disabled={isPhoneVerified}
//         />

//         <AddressLocationSelectors
//           shippingInfo={shippingInfo}
//           handleSelectChange={handleSelectChange}
//           customSelectStyles={customSelectStyles}
//           isMounted={isMounted}
//           errors={errors}
//         />

//         <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-4">
//           {isPhoneVerified ? (
//             <div className="flex items-center justify-between gap-2 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-sm font-semibold text-green-800 dark:text-green-300">
//               <div className="flex items-center gap-2">
//                 <CheckCircle size={18} />
//                 <span>Phone number verified!</span>
//               </div>

//               {/* CHANGE BUTTON (Unlock) */}
//               <button
//                 type="button"
//                 onClick={onEditPhone}
//                 className="text-xs bg-white dark:bg-gray-800 border border-green-300 text-green-700 px-3 py-1 rounded hover:bg-green-50 transition-colors flex items-center gap-1"
//               >
//                 <Edit2 size={12} /> Change
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
//               <h3 className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-200">
//                 <AlertCircle size={16} className="text-brand-primary" />{" "}
//                 Verification Required
//               </h3>
//               <p className="text-xs text-gray-500 dark:text-gray-400">
//                 We need to verify your phone number for order confirmation.
//               </p>

//               {otpUiState === "sent" || otpUiState === "verifying" ? (
//                 <div>
//                   <label
//                     htmlFor="otp-input"
//                     className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-400"
//                   >
//                     Enter the 6-digit code sent to your phone
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       id="otp-input"
//                       type="text"
//                       value={otp}
//                       onChange={(e) =>
//                         setOtp(e.target.value.replace(/[^0-9]/g, ""))
//                       }
//                       placeholder="123456"
//                       maxLength={6}
//                       className={`${inputStyles} text-center tracking-[4px] font-bold text-lg`}
//                       disabled={otpUiState === "verifying"}
//                     />
//                     <button
//                       type="button"
//                       onClick={handleVerifyOtp}
//                       disabled={otpUiState === "verifying" || otp.length < 6}
//                       className="px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-md hover:bg-brand-primary-hover disabled:bg-gray-400 transition-colors whitespace-nowrap"
//                     >
//                       {otpUiState === "verifying" ? (
//                         <Loader2 className="animate-spin" size={18} />
//                       ) : (
//                         "Verify Code"
//                       )}
//                     </button>
//                   </div>
//                   <div className="mt-2 text-right">
//                     <button
//                       type="button"
//                       onClick={() => setOtpUiState("idle")}
//                       className="text-xs text-gray-500 underline hover:text-brand-primary"
//                     >
//                       Change Number?
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleSendOtp}
//                   disabled={otpUiState === "sending" || !shippingInfo.phone}
//                   className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-brand-primary text-brand-primary font-semibold rounded-md hover:bg-brand-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {otpUiState === "sending" ? (
//                     <Loader2 className="animate-spin" size={18} />
//                   ) : (
//                     "Send Verification Code via SMS"
//                   )}
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
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

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { LocateFixed, CheckCircle, Loader2 } from "lucide-react"; // Removed AlertCircle, Edit2
import dynamic from "next/dynamic";
import { StylesConfig } from "react-select";
// import { toast } from "react-hot-toast"; // Temporarily unused

// --- FIREBASE IMPORTS (DISABLED) ---
/*
import { auth } from "@/app/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import {
  updateUserPhone,
  checkPhoneVerificationStatus,
} from "@/app/actions/authActions";
*/
// import { isValidPhoneNumber } from "react-phone-number-input";

import AddressInputFields from "./AddressInputFields";
import AddressLocationSelectors from "./AddressLocationSelectors";

// --- Dynamic Import with Loading Skeleton ---
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
  sessionVerifiedPhone?: string | null;
  onEditPhone: () => void;
}

// Helper to safely access window property
/*
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}
*/

export default function NewAddressForm({
  shippingInfo,
  onShippingInfoChange,
  errors,
  isPhoneVerified, // Ye ab hamesha 'true' aayega parent se
  onPhoneVerified,
  sessionVerifiedPhone,
  onEditPhone,
}: NewAddressFormProps) {
  // const { data: session, update } = useSession();
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // --- OTP STATES (DISABLED) ---
  /*
  const [otpUiState, setOtpUiState] = useState<
    "idle" | "sending" | "sent" | "verifying"
  >("idle");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  */

  useEffect(() => {
    setIsMounted(true);
    // Initialize Recaptcha only once (DISABLED)
    /*
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container-checkout",
        { size: "invisible" }
      );
    }
    */
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onShippingInfoChange({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value?: string) => {
    onShippingInfoChange({ ...shippingInfo, phone: value || "" });
  };

  const handleSelectChange = (name: "province" | "city", option: any) => {
    const newInfo = { ...shippingInfo, [name]: option };
    if (name === "province") newInfo.city = null;
    onShippingInfoChange(newInfo);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    onShippingInfoChange({ ...shippingInfo, lat, lng });
  };

  // --- OTP LOGIC (DISABLED) ---
  /*
  const handleSendOtp = async () => { ... };
  const handleVerifyOtp = async () => { ... };
  */

  const getErrorStyles = (hasError: boolean) => {
    return hasError ? "!border-red-500 !ring-red-500" : "";
  };

  const customSelectStyles = (hasError: boolean): StylesConfig => ({
    control: (provided, state) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
          ? "#f97316"
          : theme === "dark"
            ? "#4b5563"
            : "#d1d5db",
      minHeight: "42px",
      boxShadow: hasError
        ? "0 0 0 1px #ef4444"
        : state.isFocused
          ? "0 0 0 1px #f97316"
          : "none",
      transition: "border-color 0.2s, box-shadow 0.2s",
      "&:hover": {
        borderColor: hasError
          ? "#ef4444"
          : state.isFocused
            ? "#f97316"
            : theme === "dark"
              ? "#6b7280"
              : "#a5b4fc",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#f97316"
        : state.isFocused
          ? theme === "dark"
            ? "#374151"
            : "#f3f4f6"
          : "transparent",
      color: "inherit",
      "&:active": { backgroundColor: "#fb923c" },
    }),
    singleValue: (provided) => ({ ...provided, color: "inherit" }),
    input: (provided) => ({ ...provided, color: "inherit" }),
  });

  const inputStyles = `appearance-none block w-full rounded-md border-0 py-2.5 px-3.5 text-gray-900 bg-white dark:text-white dark:bg-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary transition duration-200 sm:text-sm`;

  return (
    <div className="space-y-4 pt-4 animate-fade-in">
      {/* Recaptcha Container (Ab Zaroorat Nahi) */}
      <div id="recaptcha-container-checkout"></div>

      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Enter a New Address
      </h2>

      <div className="space-y-4">
        <AddressInputFields
          shippingInfo={shippingInfo}
          handleInputChange={handleInputChange}
          onPhoneChange={handlePhoneChange}
          inputStyles={inputStyles}
          errors={errors}
          getErrorStyles={getErrorStyles}
          // Input Locked Nahi Hoga (Always False)
          disabled={false}
        />

        <AddressLocationSelectors
          shippingInfo={shippingInfo}
          handleSelectChange={handleSelectChange}
          customSelectStyles={customSelectStyles}
          isMounted={isMounted}
          errors={errors}
        />

        {/* --- VERIFICATION SECTION (MODIFIED) --- */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-4">
          
          {/* Pehle Logic: Agar Verified hai to "Green Box", nahi to "OTP Box" */}
          {/* Ab Hum Sirf ek simple message dikhayenge ya box hi hata denge */}
          
          {/* 
            === OLD VERIFICATION UI (HIDDEN) ===
            Agar wapis on karna ho to yahan ka code uncomment karein 
            aur 'true' wali condition hata dein.
          */}
          
          {/* Naya UI: Sirf Ek Tasalli Wala Message (Optional) */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
             <CheckCircle size={16} />
             <span>Phone verification is currently optional.</span>
          </div>

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