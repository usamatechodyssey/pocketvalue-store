// /src/app/checkout/_components/CheckoutForm.tsx (FINAL & CORRECTED)

"use client";

import { useState, FormEvent, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStateContext } from "@/app/context/StateContext";
import { useCheckoutContext } from "../CheckoutContext";
import { toast } from "react-hot-toast";
import { ArrowRight, Plus } from "lucide-react";
// --- THE ARCHITECTURAL FIX IS HERE ---
import { ClientAddress } from "@/app/actions/addressActions"; // <-- Import the new, SAFE DTO type

import SavedAddresses from "./SavedAddresses";
import NewAddressForm from "./NewAddressForm";

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
  const { shippingAddress: persistedAddress, setShippingAddress } =
    useStateContext();
  const { savedAddresses } = useCheckoutContext(); // This now returns ClientAddress[]

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
    getInitialAddress?._id || null // No .toString() needed
  );
  const [showNewAddressForm, setShowNewAddressForm] =
    useState(!getInitialAddress);
  const [shippingInfo, setShippingInfo] =
    useState<ShippingInfo>(emptyAddressState);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ShippingInfo, boolean>>
  >({});

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
  }, [getInitialAddress, persistedAddress]);

  useEffect(() => {
    const errors: Partial<Record<keyof ShippingInfo, boolean>> = {};
    if (shippingInfo.fullName) delete errors.fullName;
    if (shippingInfo.phone) delete errors.phone;
    if (shippingInfo.address) delete errors.address;
    if (shippingInfo.city) delete errors.city;
    if (shippingInfo.province) delete errors.province;
    setFormErrors(errors);
  }, [shippingInfo]);

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
    // <-- Use the ClientAddress type
    setSelectedAddressId(address._id); // No .toString() needed
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
  };

  const handleShowNewForm = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    setShippingInfo(emptyAddressState);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      toast.error("Please fill all required address fields.");
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
    router.push("/checkout/payment");
  };

  const isButtonDisabled =
    !shippingInfo.fullName ||
    !shippingInfo.phone ||
    !shippingInfo.address ||
    !shippingInfo.city ||
    !shippingInfo.province;

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
        <NewAddressForm
          shippingInfo={shippingInfo}
          onShippingInfoChange={setShippingInfo}
          errors={formErrors}
        />
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <button
          type="submit"
          className="w-full h-12 flex items-center justify-center gap-2 bg-brand-primary text-white text-base font-bold rounded-lg shadow-md transition-all duration-300 hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={isButtonDisabled}
        >
          <span>Continue to Payment</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </form>
  );
}
