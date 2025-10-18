
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStateContext } from "@/app/context/StateContext";
import CreatableSelect from "react-select/creatable";
import toast from "react-hot-toast";
import { StylesConfig } from "react-select";
import { ArrowRight, MapPin, Plus, CheckCircle,ChevronDown} from "lucide-react";
import { Address } from "@/app/actions/addressActions";
import { useTheme } from "next-themes";
import { useCheckoutContext } from "./CheckoutContext"; // <-- NAYA IMPORT
// Data
const provinces = [ { value: "Punjab", label: "Punjab" }, { value: "Sindh", label: "Sindh" }, { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" }, { value: "Balochistan", label: "Balochistan" }, { value: "Islamabad Capital Territory", label: "Islamabad" }, { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" }, { value: "Azad Kashmir", label: "Azad Kashmir" }, ];
const citiesByProvince: { [key: string]: { value: string; label: string }[] } = { Punjab: [{ value: "Lahore", label: "Lahore" }, { value: "Faisalabad", label: "Faisalabad" }, { value: "Rawalpindi", label: "Rawalpindi" }], Sindh: [{ value: "Karachi", label: "Karachi" }, { value: "Hyderabad", label: "Hyderabad" }], "Khyber Pakhtunkhwa": [{ value: "Peshawar", label: "Peshawar" }], Balochistan: [{ value: "Quetta", label: "Quetta" }], "Islamabad Capital Territory": [{ value: "Islamabad", label: "Islamabad" }], "Gilgit-Baltistan": [{ value: "Gilgit", label: "Gilgit" }], "Azad Kashmir": [{ value: "Muzaffarabad", label: "Muzaffarabad" }], };
const emptyAddressState = { fullName: "", phone: "", province: null as any, city: null as any, area: "", address: "" };

const VISIBLE_ADDRESS_LIMIT = 2; // Hum by default 2 address dikhayenge

export default function ShippingPage() {
  const router = useRouter();
  const { setShippingAddress } = useStateContext();
  const { theme } = useTheme();
  const { savedAddresses } = useCheckoutContext();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [showAllAddresses, setShowAllAddresses] = useState(false);

  const sortedAddresses = useMemo(() => {
    return [...savedAddresses].sort((a, b) => {
        if (a.isDefault) return -1;
        if (b.isDefault) return 1;
        return 0; // Baaki tarteeb wese hi rakho
    });
  }, [savedAddresses]);

  const initialAddress = sortedAddresses[0] || null;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(initialAddress?._id?.toString() || null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(!initialAddress && savedAddresses.length === 0);
  const [shippingInfo, setShippingInfo] = useState(
    initialAddress ? {
      fullName: initialAddress.fullName, phone: initialAddress.phone,
      province: { value: initialAddress.province, label: initialAddress.province },
      city: { value: initialAddress.city, label: initialAddress.city },
      area: initialAddress.area, address: initialAddress.address,
    } : emptyAddressState
  );

  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address._id!.toString());
    setShowNewAddressForm(false);
    setShippingInfo({
        fullName: address.fullName, phone: address.phone,
        province: { value: address.province, label: address.province },
        city: { value: address.city, label: address.city },
        area: address.area, address: address.address,
    });
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = {
      fullName: shippingInfo.fullName, phone: shippingInfo.phone, address: shippingInfo.address, area: shippingInfo.area,
      city: shippingInfo.city?.value || "", province: shippingInfo.province?.value || "",
    };
    if(!finalAddress.city || !finalAddress.province) {
        toast.error("Please select a city and province.");
        return;
    }
    setShippingAddress(finalAddress);
    router.push("/checkout/payment");
  };

  const availableCities = useMemo(() => { if (!shippingInfo.province) return []; return citiesByProvince[shippingInfo.province.value] || []; }, [shippingInfo.province]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectChange = (name: string, option: any) => { setShippingInfo((prev) => ({ ...prev, [name]: option })); if (name === "province") setShippingInfo((prev) => ({ ...prev, city: null })); };
  const customSelectStyles: StylesConfig = { control: (provided) => ({...provided, backgroundColor: theme === 'dark' ? '#111827' : 'white', borderColor: theme === 'dark' ? '#374151' : '#d1d5db',}), menu: (provided) => ({...provided, backgroundColor: theme === 'dark' ? '#1f2937' : 'white',}), option: (provided, state) => ({...provided, backgroundColor: state.isSelected ? '#f97316' : (state.isFocused ? (theme === 'dark' ? '#374151' : '#f3f4f6') : 'transparent'), color: state.isSelected ? 'white' : (theme === 'dark' ? '#e5e7eb' : '#111827'), '&:active': { backgroundColor: '#fb923c' }}), singleValue: (provided) => ({...provided, color: theme === 'dark' ? '#e5e7eb' : '#111827',}), input: (provided) => ({...provided, color: theme === 'dark' ? '#e5e7eb' : '#111827',}) };

  const displayedAddresses = showAllAddresses ? sortedAddresses : sortedAddresses.slice(0, VISIBLE_ADDRESS_LIMIT);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6"><MapPin className="text-brand-primary" size={28} /><h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Shipping Information</h1></div>
      
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {savedAddresses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Select a Saved Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedAddresses.map(addr => (
                <div key={addr._id!.toString()} onClick={() => handleAddressSelect(addr)} className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddressId === addr._id!.toString() ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-brand-primary/50'}`}>
                    {selectedAddressId === addr._id!.toString() && <CheckCircle size={20} className="absolute top-2 right-2 text-brand-primary" />}
                    <p className="font-bold text-sm text-gray-800 dark:text-gray-100">{addr.fullName}</p>
                    <address className="text-xs text-gray-500 dark:text-gray-400 mt-1 not-italic line-clamp-2">{addr.address}, {addr.area}, {addr.city}</address>
                </div>
              ))}
            </div>
            {sortedAddresses.length > VISIBLE_ADDRESS_LIMIT && (
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setShowAllAddresses(!showAllAddresses)} className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1 mx-auto">
                    {showAllAddresses ? 'Show Less' : `Show ${sortedAddresses.length - VISIBLE_ADDRESS_LIMIT} More`}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAllAddresses ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="relative flex items-center"><div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div><span className="flex-shrink mx-4 text-xs text-gray-400 dark:text-gray-500">OR</span><div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div></div>
        
        {!showNewAddressForm ? (
            <div><button type="button" onClick={() => {setShowNewAddressForm(true); setSelectedAddressId(null); setShippingInfo(emptyAddressState);}} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-brand-primary hover:text-brand-primary dark:hover:border-brand-primary transition-colors"><Plus size={16} /> Enter a New Address</button></div>
        ) : (
            <div className="space-y-4 pt-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label><input name="fullName" type="text" value={shippingInfo.fullName} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label><input name="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary"/></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Province</label>
                        {!isMounted ? <div className="mt-1 h-[38px] w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"/> : <CreatableSelect styles={customSelectStyles} name="province" instanceId="province-select" options={provinces} value={shippingInfo.province} onChange={(option) => handleSelectChange("province", option)} required className="mt-1"/>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                        {!isMounted ? <div className="mt-1 h-[38px] w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse"/> : <CreatableSelect styles={customSelectStyles} name="city" instanceId="city-select" options={availableCities} value={shippingInfo.city} onChange={(option) => handleSelectChange("city", option)} required isDisabled={!shippingInfo.province} className="mt-1" placeholder={!shippingInfo.province ? "Select province first" : "Select or type..."}/>}
                    </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area / Locality</label><input name="area" type="text" value={shippingInfo.area} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g. DHA Phase 6, Johar Town"/></div>
                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address & House No.</label><input name="address" type="text" value={shippingInfo.address} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g. House #123, Street 4"/></div>
            </div>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6"><button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-brand-primary-hover transition-all"><span>Continue to Payment</span><ArrowRight /></button></div>
      </form>
    </div>
  );
}