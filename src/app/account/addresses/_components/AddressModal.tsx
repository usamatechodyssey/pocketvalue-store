"use client";

import { useState, useEffect, useTransition, Fragment } from "react";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Address, addAddress, updateAddress } from "@/app/actions/addressActions";
import CreatableSelect from "react-select/creatable";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  existingAddress: Address | null;
}

// Data (Aap isay ek alag file mein bhi rakh sakte hain)
const provinces = [
  { value: "Punjab", label: "Punjab" },
  { value: "Sindh", label: "Sindh" },
  { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { value: "Balochistan", label: "Balochistan" },
  { value: "Islamabad Capital Territory", label: "Islamabad" },
  { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
  { value: "Azad Kashmir", label: "Azad Kashmir" },
];

const citiesByProvince: { [key: string]: { value: string; label: string }[] } = {
    Punjab: [{ value: "Lahore", label: "Lahore" }, { value: "Faisalabad", label: "Faisalabad" }, { value: "Rawalpindi", label: "Rawalpindi" }],
    Sindh: [{ value: "Karachi", label: "Karachi" }, { value: "Hyderabad", label: "Hyderabad" }],
    // ... baaki cities
};

export default function AddressModal({ isOpen, onClose, onSave, existingAddress }: AddressModalProps) {
  const [formData, setFormData] = useState({
    fullName: "", phone: "", province: null as any, city: null as any, area: "", address: "", isDefault: false,
  });
  
  const [isPending, startTransition] = useTransition();
  const isEditing = !!existingAddress;

  useEffect(() => {
    if (isOpen && existingAddress) {
      setFormData({
        fullName: existingAddress.fullName,
        phone: existingAddress.phone,
        province: { value: existingAddress.province, label: existingAddress.province },
        city: { value: existingAddress.city, label: existingAddress.city },
        area: existingAddress.area,
        address: existingAddress.address,
        isDefault: existingAddress.isDefault,
      });
    } else if (isOpen && !existingAddress) {
      // Reset form when opening for a new address
      setFormData({ fullName: "", phone: "", province: null, city: null, area: "", address: "", isDefault: false });
    }
  }, [isOpen, existingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, option: any) => {
    setFormData(prev => ({ ...prev, [name]: option }));
    if (name === "province") {
      setFormData(prev => ({ ...prev, city: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAddressData = {
        fullName: formData.fullName,
        phone: formData.phone,
        province: formData.province?.value || "",
        city: formData.city?.value || "",
        area: formData.area,
        address: formData.address,
        isDefault: formData.isDefault,
    };

    if(!finalAddressData.province || !finalAddressData.city){
        toast.error("Please select province and city.");
        return;
    }

    startTransition(async () => {
      if (isEditing) {
        const result = await updateAddress(existingAddress._id!.toString(), finalAddressData);
        if (result.success) {
          onSave({ ...finalAddressData, _id: existingAddress._id });
          toast.success(result.message);
          onClose();
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await addAddress(finalAddressData);
        if (result.success && result.address) {
          onSave(result.address);
          toast.success(result.message);
          onClose();
        } else {
          toast.error(result.message);
        }
      }
    });
  };
  
  const availableCities = formData.province ? (citiesByProvince[formData.province.value] || []) : [];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-2xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {isEditing ? "Edit Address" : "Add New Address"}
                  </Dialog.Title>
                  <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" aria-label="Close modal">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input name="fullName" type="text" value={formData.fullName} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary"/>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Province</label>
                        <CreatableSelect name="province" instanceId="province-select" options={provinces} value={formData.province} onChange={(option) => handleSelectChange("province", option)} required className="mt-1 react-select-container" classNamePrefix="react-select"/>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                        <CreatableSelect name="city" instanceId="city-select" options={availableCities} value={formData.city} onChange={(option) => handleSelectChange("city", option)} required isDisabled={!formData.province} className="mt-1 react-select-container" classNamePrefix="react-select" placeholder={!formData.province ? "Select province first" : "Select or type..."}/>
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Area / Locality</label>
                    <input name="area" type="text" value={formData.area} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g. DHA Phase 6, Johar Town"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address & House No.</label>
                    <input name="address" type="text" value={formData.address} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" placeholder="e.g. House #123, Street 4"/>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Set as default address</span>
                    <Switch
                        checked={formData.isDefault}
                        onChange={(checked) => setFormData(prev => ({...prev, isDefault: checked}))}
                        className={`${formData.isDefault ? 'bg-brand-primary' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                        <span className={`${formData.isDefault ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
                    </Switch>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={isPending} className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover disabled:bg-opacity-50 transition-colors">
                        {isPending && <Loader2 className="animate-spin" size={16}/>}
                        {isPending ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}