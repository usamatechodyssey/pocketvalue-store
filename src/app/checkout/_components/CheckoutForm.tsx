// // /src/app/checkout/_components/CheckoutForm.tsx (FINAL & CORRECTED)

// "use client";

// import { useState, FormEvent, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useCheckoutContext } from "../CheckoutContext";
// import { toast } from "react-hot-toast";
// import { ArrowRight, Plus } from "lucide-react";
// // --- THE ARCHITECTURAL FIX IS HERE ---
// import { ClientAddress } from "@/app/actions/addressActions"; // <-- Import the new, SAFE DTO type

// import SavedAddresses from "./SavedAddresses";
// import NewAddressForm from "./NewAddressForm";

// interface ShippingInfo {
//   fullName: string;
//   phone: string;
//   province: { value: string; label: string } | null;
//   city: { value: string; label: string } | null;
//   area: string;
//   address: string;
//   lat: number | null;
//   lng: number | null;
// }

// const emptyAddressState: ShippingInfo = {
//   fullName: "",
//   phone: "",
//   province: null,
//   city: null,
//   area: "",
//   address: "",
//   lat: null,
//   lng: null,
// };

// export default function CheckoutForm() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const { shippingAddress: persistedAddress, setShippingAddress } =
//     useStateContext();
//   const { savedAddresses } = useCheckoutContext(); // This now returns ClientAddress[]

//   const getInitialAddress = useMemo(() => {
//     if (persistedAddress) {
//       return (
//         savedAddresses?.find(
//           (addr) =>
//             addr.address === persistedAddress.address &&
//             addr.city === persistedAddress.city &&
//             addr.province === persistedAddress.province
//         ) || null
//       );
//     }
//     return (
//       savedAddresses?.find((addr) => addr.isDefault) ||
//       savedAddresses?.[0] ||
//       null
//     );
//   }, [persistedAddress, savedAddresses]);

//   const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;

//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
//     getInitialAddress?._id || null // No .toString() needed
//   );
//   const [showNewAddressForm, setShowNewAddressForm] =
//     useState(!getInitialAddress);
//   const [shippingInfo, setShippingInfo] =
//     useState<ShippingInfo>(emptyAddressState);
//   const [formErrors, setFormErrors] = useState<
//     Partial<Record<keyof ShippingInfo, boolean>>
//   >({});

//   useEffect(() => {
//     const addressToLoad = persistedAddress
//       ? {
//           ...persistedAddress,
//           province: persistedAddress.province
//             ? {
//                 value: persistedAddress.province,
//                 label: persistedAddress.province,
//               }
//             : null,
//           city: persistedAddress.city
//             ? { value: persistedAddress.city, label: persistedAddress.city }
//             : null,
//         }
//       : getInitialAddress
//         ? {
//             ...getInitialAddress,
//             province: {
//               value: getInitialAddress.province,
//               label: getInitialAddress.province,
//             },
//             city: {
//               value: getInitialAddress.city,
//               label: getInitialAddress.city,
//             },
//           }
//         : emptyAddressState;
//     setShippingInfo(addressToLoad as ShippingInfo);
//   }, [getInitialAddress, persistedAddress]);

//   useEffect(() => {
//     const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
//     if (shippingInfo.fullName) delete errors.fullName;
//     if (shippingInfo.phone) delete errors.phone;
//     if (shippingInfo.address) delete errors.address;
//     if (shippingInfo.city) delete errors.city;
//     if (shippingInfo.province) delete errors.province;
//     setFormErrors(errors);
//   }, [shippingInfo]);

//   const validateForm = () => {
//     const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
//     if (!shippingInfo.fullName.trim()) errors.fullName = true;
//     if (!shippingInfo.phone.trim()) errors.phone = true;
//     if (!shippingInfo.address.trim()) errors.address = true;
//     if (!shippingInfo.city) errors.city = true;
//     if (!shippingInfo.province) errors.province = true;
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleAddressSelect = (address: ClientAddress) => {
//     // <-- Use the ClientAddress type
//     setSelectedAddressId(address._id); // No .toString() needed
//     setShowNewAddressForm(false);
//     const newInfo = {
//       fullName: address.fullName,
//       phone: address.phone,
//       province: { value: address.province, label: address.province },
//       city: { value: address.city, label: address.city },
//       area: address.area,
//       address: address.address,
//       lat: address.lat || null,
//       lng: address.lng || null,
//     };
//     setShippingInfo(newInfo);
//     setFormErrors({});
//   };

//   const handleShowNewForm = () => {
//     setShowNewAddressForm(true);
//     setSelectedAddressId(null);
//     setShippingInfo(emptyAddressState);
//   };

//   const handleFormSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     const isFormValid = validateForm();

//     if (!isFormValid) {
//       toast.error("Please fill all required address fields.");
//       return;
//     }
//     const userEmail = session?.user?.email;
//     if (!userEmail) {
//       toast.error("Authentication error. Please log in again.");
//       return;
//     }
//     const finalAddress = {
//       fullName: shippingInfo.fullName,
//       email: userEmail,
//       phone: shippingInfo.phone,
//       province: shippingInfo.province?.value || "",
//       city: shippingInfo.city?.value || "",
//       area: shippingInfo.area,
//       address: shippingInfo.address,
//       lat: shippingInfo.lat,
//       lng: shippingInfo.lng,
//     };
//     setShippingAddress(finalAddress);
//     router.push("/checkout/payment");
//   };

//   const isButtonDisabled =
//     !shippingInfo.fullName ||
//     !shippingInfo.phone ||
//     !shippingInfo.address ||
//     !shippingInfo.city ||
//     !shippingInfo.province;

//   return (
//     <form onSubmit={handleFormSubmit} className="space-y-6">
//       {hasSavedAddresses && (
//         <>
//           <SavedAddresses
//             savedAddresses={savedAddresses}
//             selectedAddressId={selectedAddressId}
//             onAddressSelect={handleAddressSelect}
//           />
//           <div className="relative flex items-center">
//             <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
//             <span className="shrink mx-4 text-xs text-gray-400 dark:text-gray-500 uppercase">
//               Or
//             </span>
//             <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
//           </div>
//           {!showNewAddressForm && (
//             <div>
//               <button
//                 type="button"
//                 onClick={handleShowNewForm}
//                 className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//               >
//                 <Plus size={16} /> Add a New Shipping Address
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {(!hasSavedAddresses || showNewAddressForm) && (
//         <NewAddressForm
//           shippingInfo={shippingInfo}
//           onShippingInfoChange={setShippingInfo}
//           errors={formErrors}
//         />
//       )}

//       <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//         <button
//           type="submit"
//           className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white text-base font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
//           disabled={isButtonDisabled}
//         >
//           <span>Continue to Payment</span>
//           <ArrowRight size={20} />
//         </button>
//       </div>
//     </form>
//   );
// }
// // /src/app/checkout/_components/CheckoutForm.tsx (COMPLETE & UPGRADED FOR OTP FLOW)

// "use client";

// import { useState, FormEvent, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useStateContext } from "@/app/context/StateContext";
// import { useCheckoutContext } from "../CheckoutContext";
// import { toast } from "react-hot-toast";
// import { ArrowRight, Plus } from "lucide-react";
// import { ClientAddress } from "@/app/actions/addressActions";

// import SavedAddresses from "./SavedAddresses";
// import NewAddressForm from "./NewAddressForm";

// // The state for shipping information remains the same
// interface ShippingInfo {
//   fullName: string;
//   phone: string;
//   province: { value: string; label: string } | null;
//   city: { value: string; label: string } | null;
//   area: string;
//   address: string;
//   lat: number | null;
//   lng: number | null;
// }

// const emptyAddressState: ShippingInfo = {
//   fullName: "",
//   phone: "",
//   province: null,
//   city: null,
//   area: "",
//   address: "",
//   lat: null,
//   lng: null,
// };

// export default function CheckoutForm() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const { shippingAddress: persistedAddress, setShippingAddress } = useStateContext();
//   const { savedAddresses } = useCheckoutContext();

//   const getInitialAddress = useMemo(() => {
//     if (persistedAddress) {
//       return (
//         savedAddresses?.find(
//           (addr) =>
//             addr.address === persistedAddress.address &&
//             addr.city === persistedAddress.city &&
//             addr.province === persistedAddress.province
//         ) || null
//       );
//     }
//     return (
//       savedAddresses?.find((addr) => addr.isDefault) ||
//       savedAddresses?.[0] ||
//       null
//     );
//   }, [persistedAddress, savedAddresses]);

//   const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;

//   const [selectedAddressId, setSelectedAddressId] = useState<string | null>(getInitialAddress?._id || null);
//   const [showNewAddressForm, setShowNewAddressForm] = useState(!getInitialAddress);
//   const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(emptyAddressState);
//   const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({});

//   // --- NEW STATE FOR OTP VERIFICATION ---
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false);
//   const [phoneToVerify, setPhoneToVerify] = useState(""); // Tracks the number that was verified

//   useEffect(() => {
//     const addressToLoad = persistedAddress ? {
//       ...persistedAddress,
//       province: persistedAddress.province ? { value: persistedAddress.province, label: persistedAddress.province } : null,
//       city: persistedAddress.city ? { value: persistedAddress.city, label: persistedAddress.city } : null,
//     } : getInitialAddress ? {
//       ...getInitialAddress,
//       province: { value: getInitialAddress.province, label: getInitialAddress.province },
//       city: { value: getInitialAddress.city, label: getInitialAddress.city },
//     } : emptyAddressState;
    
//     setShippingInfo(addressToLoad as ShippingInfo);

//     // If we are loading a pre-existing address (either from context or saved addresses),
//     // we can assume its phone number is valid and verified.
//     if (getInitialAddress || persistedAddress) {
//       setIsPhoneVerified(true);
//       setPhoneToVerify((addressToLoad as ShippingInfo).phone);
//     }
//   }, [getInitialAddress, persistedAddress]);

//   // This effect listens for changes in the phone number input.
//   // If the user changes the number, we must reset the verification status.
//   useEffect(() => {
//     if (showNewAddressForm && shippingInfo.phone !== phoneToVerify) {
//       setIsPhoneVerified(false);
//     }
//   }, [shippingInfo.phone, phoneToVerify, showNewAddressForm]);

//   const validateForm = () => {
//     const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
//     if (!shippingInfo.fullName.trim()) errors.fullName = true;
//     if (!shippingInfo.phone.trim()) errors.phone = true;
//     if (!shippingInfo.address.trim()) errors.address = true;
//     if (!shippingInfo.city) errors.city = true;
//     if (!shippingInfo.province) errors.province = true;
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleAddressSelect = (address: ClientAddress) => {
//     setSelectedAddressId(address._id);
//     setShowNewAddressForm(false);
//     const newInfo = {
//       fullName: address.fullName,
//       phone: address.phone,
//       province: { value: address.province, label: address.province },
//       city: { value: address.city, label: address.city },
//       area: address.area,
//       address: address.address,
//       lat: address.lat || null,
//       lng: address.lng || null,
//     };
//     setShippingInfo(newInfo);
//     setFormErrors({});
    
//     // When a saved address is selected, its phone is considered verified.
//     setIsPhoneVerified(true);
//     setPhoneToVerify(address.phone);
//   };

//   const handleShowNewForm = () => {
//     setShowNewAddressForm(true);
//     setSelectedAddressId(null);
//     setShippingInfo(emptyAddressState);
//     setIsPhoneVerified(false); // A new form requires a new verification.
//     setPhoneToVerify("");
//   };

//   const handleFormSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     const isFormValid = validateForm();

//     if (!isFormValid) {
//       toast.error("Please fill all required address fields.");
//       return;
//     }
    
//     // --- NEW CHECK: Ensure phone number is verified before proceeding ---
//     if ((!hasSavedAddresses || showNewAddressForm) && !isPhoneVerified) {
//         toast.error("Please verify your phone number before continuing.");
//         return;
//     }

//     const userEmail = session?.user?.email;
//     if (!userEmail) {
//       toast.error("Authentication error. Please log in again.");
//       return;
//     }
//     const finalAddress = {
//       fullName: shippingInfo.fullName,
//       email: userEmail,
//       phone: shippingInfo.phone,
//       province: shippingInfo.province?.value || "",
//       city: shippingInfo.city?.value || "",
//       area: shippingInfo.area,
//       address: shippingInfo.address,
//       lat: shippingInfo.lat,
//       lng: shippingInfo.lng,
//     };
//     setShippingAddress(finalAddress);
//     router.push("/checkout/payment");
//   };

//   // The button should be disabled if required fields are empty OR if the new address form is shown and the phone is not verified.
//   const isButtonDisabled = !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.province || ((!hasSavedAddresses || showNewAddressForm) && !isPhoneVerified);

//   return (
//     <form onSubmit={handleFormSubmit} className="space-y-6">
//       {hasSavedAddresses && (
//         <>
//           <SavedAddresses
//             savedAddresses={savedAddresses}
//             selectedAddressId={selectedAddressId}
//             onAddressSelect={handleAddressSelect}
//           />
//           <div className="relative flex items-center">
//             <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
//             <span className="shrink mx-4 text-xs text-gray-400 dark:text-gray-500 uppercase">
//               Or
//             </span>
//             <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
//           </div>
//           {!showNewAddressForm && (
//             <div>
//               <button
//                 type="button"
//                 onClick={handleShowNewForm}
//                 className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//               >
//                 <Plus size={16} /> Add a New Shipping Address
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {(!hasSavedAddresses || showNewAddressForm) && (
//         <NewAddressForm
//           shippingInfo={shippingInfo}
//           onShippingInfoChange={setShippingInfo}
//           errors={formErrors}
//           // --- PASS NEW PROPS FOR OTP FLOW ---
//           isPhoneVerified={isPhoneVerified}
//           onPhoneVerified={() => {
//               setIsPhoneVerified(true);
//               // Lock in the verified number
//               setPhoneToVerify(shippingInfo.phone);
//           }}
//         />
//       )}

//       <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//         <button
//           type="submit"
//           className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white text-base font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
//           disabled={isButtonDisabled}
//         >
//           <span>Continue to Payment</span>
//           <ArrowRight size={20} />
//         </button>
//       </div>
//     </form>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Added OTP State:** Introduced `isPhoneVerified` and `phoneToVerify` to track verification status.
// // - **Logic for Verification Status:** When a saved address is selected, `isPhoneVerified` is set to `true`. When a new address is added or an existing number is changed, it resets to `false`.
// // - **Blocked Form Submission:** The form submission and the "Continue" button are now disabled if the new address form is active and the phone number has not been verified.
// // - **Passed Props to Child:** The `NewAddressForm` now receives `isPhoneVerified` and an `onPhoneVerified` callback, preparing it to handle the OTP UI and report success back to this parent component.
// /src/app/checkout/_components/CheckoutForm.tsx (FINAL UPGRADE - WITH SAVE ADDRESS LOGIC)

"use client";

import { useState, FormEvent, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/app/context/StateContext";
import { useCheckoutContext } from "../CheckoutContext";
import { toast } from "react-hot-toast";
import { ArrowRight, Plus, Loader2 } from "lucide-react";
import { ClientAddress, saveAddress } from "@/app/actions/addressActions";

import SavedAddresses from "./SavedAddresses";
import NewAddressForm from "./NewAddressForm";

// The state for shipping information remains the same
interface ShippingInfo {
  fullName: string;
  phone: string;
  province: { value: string; label: string } | null;
  city: { value: string; label: string } | null;
  area: string;
  address: string;
  lat: number | null;
  lng: number | null;
}

const emptyAddressState: ShippingInfo = {
  fullName: "",
  phone: "",
  province: null,
  city: null,
  area: "",
  address: "",
  lat: null,
  lng: null,
};

export default function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { shippingAddress: persistedAddress, setShippingAddress } = useStateContext();
  const { savedAddresses } = useCheckoutContext();

  const getInitialAddress = useMemo(() => {
    if (persistedAddress) {
      return savedAddresses?.find((addr) =>
        addr.address === persistedAddress.address &&
        addr.city === persistedAddress.city &&
        addr.province === persistedAddress.province
      ) || null;
    }
    return savedAddresses?.find((addr) => addr.isDefault) || savedAddresses?.[0] || null;
  }, [persistedAddress, savedAddresses]);

  const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(getInitialAddress?._id || null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(!getInitialAddress);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(emptyAddressState);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingInfo, boolean>>>({});
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState("");

  // --- NEW STATES FOR SAVING ADDRESS ---
  const [saveNewAddress, setSaveNewAddress] = useState(true); // State for the checkbox
  const [isPending, startTransition] = useTransition(); // Loading state for the server action

  useEffect(() => {
    const addressToLoad = persistedAddress ? {
      ...persistedAddress,
      province: persistedAddress.province ? { value: persistedAddress.province, label: persistedAddress.province } : null,
      city: persistedAddress.city ? { value: persistedAddress.city, label: persistedAddress.city } : null,
    } : getInitialAddress ? {
      ...getInitialAddress,
      province: { value: getInitialAddress.province, label: getInitialAddress.province },
      city: { value: getInitialAddress.city, label: getInitialAddress.city },
    } : emptyAddressState;
    
    setShippingInfo(addressToLoad as ShippingInfo);

    if (getInitialAddress || persistedAddress) {
      setIsPhoneVerified(true);
      setPhoneToVerify((addressToLoad as ShippingInfo).phone);
    }
  }, [getInitialAddress, persistedAddress]);

  useEffect(() => {
    if (showNewAddressForm && shippingInfo.phone !== phoneToVerify) {
      setIsPhoneVerified(false);
    }
  }, [shippingInfo.phone, phoneToVerify, showNewAddressForm]);

  const validateForm = () => {
    const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
    if (!shippingInfo.fullName.trim()) errors.fullName = true;
    if (!shippingInfo.phone.trim()) errors.phone = true;
    if (!shippingInfo.address.trim()) errors.address = true;
    if (!shippingInfo.city) errors.city = true;
    if (!shippingInfo.province) errors.province = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSelect = (address: ClientAddress) => {
    setSelectedAddressId(address._id);
    setShowNewAddressForm(false);
    const newInfo = {
      fullName: address.fullName,
      phone: address.phone,
      province: { value: address.province, label: address.province },
      city: { value: address.city, label: address.city },
      area: address.area,
      address: address.address,
      lat: address.lat || null,
      lng: address.lng || null,
    };
    setShippingInfo(newInfo);
    setFormErrors({});
    setIsPhoneVerified(true);
    setPhoneToVerify(address.phone);
  };

  const handleShowNewForm = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    setShippingInfo(emptyAddressState);
    setIsPhoneVerified(false);
    setPhoneToVerify("");
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    const isFormValid = validateForm();
    if (!isFormValid) {
      toast.error("Please fill all required address fields.");
      return;
    }
    
    if ((!hasSavedAddresses || showNewAddressForm) && !isPhoneVerified) {
        toast.error("Please verify your phone number before continuing.");
        return;
    }

    const userEmail = session?.user?.email;
    if (!userEmail) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    const finalAddress = {
      fullName: shippingInfo.fullName,
      email: userEmail,
      phone: shippingInfo.phone,
      province: shippingInfo.province?.value || "",
      city: shippingInfo.city?.value || "",
      area: shippingInfo.area,
      address: shippingInfo.address,
      lat: shippingInfo.lat,
      lng: shippingInfo.lng,
    };
    
    setShippingAddress(finalAddress);

    startTransition(async () => {
      if ((!hasSavedAddresses || showNewAddressForm) && saveNewAddress) {
        // Prepare the data for the saveAddress server action
        const { lat, lng, email, ...addressToSave } = finalAddress;
        
        const result = await saveAddress(addressToSave, false); // `isDefault` is false for now
        if (result.success) {
          toast.success("New address saved to your address book!");
        } else {
          toast.error(`Could not save new address: ${result.message}`);
        }
      }
      
      // Proceed to payment regardless of whether the address was saved
      router.push("/checkout/payment");
    });
  };

  const isButtonDisabled = isPending || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.province || ((!hasSavedAddresses || showNewAddressForm) && !isPhoneVerified);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {hasSavedAddresses && (
        <>
          <SavedAddresses
            savedAddresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={handleAddressSelect}
          />
          <div className="relative flex items-center">
            <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="shrink mx-4 text-xs text-gray-400 dark:text-gray-500 uppercase">
              Or
            </span>
            <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          {!showNewAddressForm && (
            <div>
              <button
                type="button"
                onClick={handleShowNewForm}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} /> Add a New Shipping Address
              </button>
            </div>
          )}
        </>
      )}

      {(!hasSavedAddresses || showNewAddressForm) && (
        <>
          <NewAddressForm
            shippingInfo={shippingInfo}
            onShippingInfoChange={setShippingInfo}
            errors={formErrors}
            isPhoneVerified={isPhoneVerified}
            onPhoneVerified={() => {
                setIsPhoneVerified(true);
                setPhoneToVerify(shippingInfo.phone);
            }}
          />
          <div className="flex items-center">
            <input
              id="save-address"
              name="save-address"
              type="checkbox"
              checked={saveNewAddress}
              onChange={(e) => setSaveNewAddress(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
            />
            <label htmlFor="save-address" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Save this address for next time
            </label>
          </div>
        </>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          type="submit"
          className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white text-base font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={isButtonDisabled}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <span>Continue to Payment</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// --- SUMMARY OF CHANGES ---
// - **Added "Save Address" Logic:** The `handleFormSubmit` function now calls the `saveAddress` Server Action when a user submits a new address and the "Save" checkbox is checked.
// - **Added `useTransition`:** Implemented the `useTransition` hook to provide a loading state (`isPending`) for the "Continue to Payment" button while the server action is running.
// - **Added "Save Address" Checkbox:** A new checkbox has been added to the UI, allowing users to choose whether or not to save their new address to their account.