"use client";

import { useState, useTransition } from "react";
import { Address, deleteAddress, setDefaultAddress } from "@/app/actions/addressActions";
import { MapPin, Home, Plus, Trash2, Edit, Star, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import AddressModal from "./AddressModal"; // Hum yeh component agle step mein banayenge

interface AddressClientProps {
  initialAddresses: Address[];
}

export default function AddressClient({ initialAddresses }: AddressClientProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    startTransition(async () => {
      const result = await deleteAddress(addressId);
      if (result.success) {
        setAddresses(prev => prev.filter(addr => addr._id!.toString() !== addressId));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleSetDefault = (addressId: string) => {
     startTransition(async () => {
        const result = await setDefaultAddress(addressId);
        if (result.success) {
            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr._id!.toString() === addressId
            })));
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
     });
  }

  // Yeh function modal se naya/updated address receive karega
  const handleSaveAddress = (savedAddress: Address) => {
    const isEditing = addresses.some(addr => addr._id === savedAddress._id);
    if (isEditing) {
      // Update existing address
      setAddresses(prev => prev.map(addr => addr._id === savedAddress._id ? savedAddress : addr));
    } else {
      // Add new address
      setAddresses(prev => [...prev, savedAddress]);
    }
    // Agar naya address default set kiya gaya hai, to baaki sab ko update karo
    if(savedAddress.isDefault){
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr._id === savedAddress._id
        })))
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Addresses</h1>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-on-primary font-bold text-sm rounded-lg shadow-md hover:bg-brand-primary-hover transition-transform transform hover:scale-105"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {isPending && <div className="flex justify-center my-4"><Loader2 className="animate-spin text-brand-primary"/></div>}

      {addresses.length === 0 && !isPending ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-gray-200">
            No Saved Addresses
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add an address to make your checkout faster.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id!.toString()}
              className={`relative bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-sm border ${addr.isDefault ? "border-brand-primary" : "border-gray-200 dark:border-gray-700"}`}
            >
              {addr.isDefault && (
                <div className="absolute top-0 right-0 flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-400/20 px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    <Star size={12} fill="currentColor" /> Default
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="bg-brand-primary/10 p-3 rounded-full mt-1">
                  <Home className="text-brand-primary" size={24} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-gray-800 dark:text-gray-100">{addr.fullName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addr.phone}</p>
                  <address className="text-sm text-gray-500 dark:text-gray-400 mt-2 not-italic">
                    {addr.address}, {addr.area},<br />
                    {addr.city}, {addr.province}
                  </address>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 flex items-center justify-between gap-2">
                {!addr.isDefault && (
                    <button onClick={() => handleSetDefault(addr._id!.toString())} className="text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors">Set as Default</button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                    <button onClick={() => handleEdit(addr)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-500/10 transition-colors" aria-label="Edit address">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(addr._id!.toString())} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-500/10 transition-colors" aria-label="Delete address">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAddress}
        existingAddress={editingAddress}
      />
    </>
  );
}