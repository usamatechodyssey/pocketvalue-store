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
import NewAddressForm, { ShippingInfo } from "./NewAddressForm";

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

// Helper to compare phones
const arePhoneNumbersEqual = (
  phone1: string | null | undefined,
  phone2: string | null | undefined
) => {
  if (!phone1 || !phone2) return false;
  const digits1 = phone1.replace(/\D/g, "");
  const digits2 = phone2.replace(/\D/g, "");
  return digits1.slice(-10) === digits2.slice(-10);
};

export default function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { shippingAddress: persistedAddress, setShippingAddress } =
    useStateContext();
  const { savedAddresses, userPhone, isUserPhoneVerified } =
    useCheckoutContext();

  const getInitialAddress = useMemo(() => {
    if (persistedAddress) {
      return (
        savedAddresses?.find(
          (addr) =>
            addr.address === persistedAddress.address &&
            addr.city === persistedAddress.city &&
            addr.province === persistedAddress.province
        ) || null
      );
    }
    return (
      savedAddresses?.find((addr) => addr.isDefault) ||
      savedAddresses?.[0] ||
      null
    );
  }, [persistedAddress, savedAddresses]);

  const hasSavedAddresses = savedAddresses && savedAddresses.length > 0;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    getInitialAddress?._id || null
  );
  const [showNewAddressForm, setShowNewAddressForm] =
    useState(!getInitialAddress);
  const [shippingInfo, setShippingInfo] =
    useState<ShippingInfo>(emptyAddressState);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ShippingInfo, boolean>>
  >({});

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneToVerify, setPhoneToVerify] = useState("");

  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const addressToLoad = persistedAddress
      ? {
          ...persistedAddress,
          province: persistedAddress.province
            ? {
                value: persistedAddress.province,
                label: persistedAddress.province,
              }
            : null,
          city: persistedAddress.city
            ? { value: persistedAddress.city, label: persistedAddress.city }
            : null,
        }
      : getInitialAddress
        ? {
            ...getInitialAddress,
            province: {
              value: getInitialAddress.province,
              label: getInitialAddress.province,
            },
            city: {
              value: getInitialAddress.city,
              label: getInitialAddress.city,
            },
          }
        : emptyAddressState;

    setShippingInfo(addressToLoad as ShippingInfo);

    if (getInitialAddress || persistedAddress) {
      setIsPhoneVerified(true);
      setPhoneToVerify((addressToLoad as ShippingInfo).phone);
    }
  }, [getInitialAddress, persistedAddress]);

  // === AUTO-VERIFY LOGIC ===
  useEffect(() => {
    if (isUserPhoneVerified && userPhone) {
      const isMatch = arePhoneNumbersEqual(shippingInfo.phone, userPhone);

      if (isMatch) {
        if (!isPhoneVerified) {
          // Agar number match karta hai to Auto Verify
          setIsPhoneVerified(true);
          setPhoneToVerify(shippingInfo.phone);
        }
      } else {
        // Agar number match nahi karta (user ne change kiya), to Unverify
        if (showNewAddressForm && shippingInfo.phone !== phoneToVerify) {
          setIsPhoneVerified(false);
        }
      }
    }
  }, [
    shippingInfo.phone,
    userPhone,
    isUserPhoneVerified,
    phoneToVerify,
    showNewAddressForm,
    isPhoneVerified,
  ]);

  const validateForm = () => {
    const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
    if (!shippingInfo.fullName.trim()) errors.fullName = true;
    if (!shippingInfo.phone) errors.phone = true;
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

    setShippingInfo({
      ...emptyAddressState,
      fullName: session?.user?.name || "",
      phone: isUserPhoneVerified && userPhone ? userPhone : "",
    });

    if (isUserPhoneVerified && userPhone) {
      setIsPhoneVerified(true);
      setPhoneToVerify(userPhone);
    } else {
      setIsPhoneVerified(false);
      setPhoneToVerify("");
    }
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
        const { email, ...addressToSave } = finalAddress;
        const result = await saveAddress(addressToSave, false);
        if (result.success) {
          toast.success("Address saved to your profile!");
        }
      }
      router.push("/checkout/payment");
    });
  };

  const isButtonDisabled =
    isPending ||
    !shippingInfo.fullName ||
    !shippingInfo.phone ||
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.province ||
    ((!hasSavedAddresses || showNewAddressForm) && !isPhoneVerified);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {hasSavedAddresses && (
        <>
          <SavedAddresses
            savedAddresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={handleAddressSelect}
          />
          <div className="relative flex items-center my-6">
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
            sessionVerifiedPhone={isUserPhoneVerified ? userPhone : null}
            // === CHANGE IS HERE ===
            onEditPhone={() => {
              // 1. Un-verify status
              setIsPhoneVerified(false);
              // 2. Clear the input field (To break the auto-verify loop)
              setShippingInfo((prev) => ({ ...prev, phone: "" }));
            }}
          />

          <div className="flex items-center mt-4">
            <input
              id="save-address"
              name="save-address"
              type="checkbox"
              checked={saveNewAddress}
              onChange={(e) => setSaveNewAddress(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
            />
            <label
              htmlFor="save-address"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer"
            >
              Save this address for future orders
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
