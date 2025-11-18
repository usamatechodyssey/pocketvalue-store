// "use client";

// import { ShippingInfo } from './NewAddressForm';

// interface AddressInputFieldsProps {
//   shippingInfo: ShippingInfo;
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   inputStyles: string;
//   errors: Partial<Record<keyof ShippingInfo, boolean>>; // <-- NEW PROP
//   getErrorStyles: (hasError: boolean) => string; // <-- NEW PROP
// }

// export default function AddressInputFields({ shippingInfo, handleInputChange, inputStyles, errors, getErrorStyles }: AddressInputFieldsProps) {
//   return (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
//           <input id="fullName" name="fullName" type="text" value={shippingInfo.fullName} onChange={handleInputChange} required className={`${inputStyles} ${getErrorStyles(!!errors.fullName)}`}/>
//         </div>
//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
//           <input id="phone" name="phone" type="tel" value={shippingInfo.phone} onChange={handleInputChange} required className={`${inputStyles} ${getErrorStyles(!!errors.phone)}`}/>
//         </div>
//       </div>
//       <div>
//         <label htmlFor="area" className="block text-sm font-medium mb-1">Area / Locality</label>
//         <input id="area" name="area" type="text" value={shippingInfo.area} onChange={handleInputChange} required className={`${inputStyles}`} placeholder="e.g. DHA Phase 6, Johar Town"/>
//       </div>
//       <div>
//         <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address & House No.</label>
//         <input id="address" name="address" type="text" value={shippingInfo.address} onChange={handleInputChange} required className={`${inputStyles} ${getErrorStyles(!!errors.address)}`} placeholder="e.g. House #123, Street 4"/>
//       </div>
//     </div>
//   );
// }
// /src/app/checkout/_components/AddressInputFields.tsx (VERIFIED - NO CHANGES NEEDED)

"use client";

import { ShippingInfo } from "./NewAddressForm";

interface AddressInputFieldsProps {
  shippingInfo: ShippingInfo;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputStyles: string;
  errors: Partial<Record<keyof ShippingInfo, boolean>>;
  getErrorStyles: (hasError: boolean) => string;
}

export default function AddressInputFields({
  shippingInfo,
  handleInputChange,
  inputStyles,
  errors,
  getErrorStyles,
}: AddressInputFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={shippingInfo.fullName}
            onChange={handleInputChange}
            required
            className={`${inputStyles} ${getErrorStyles(!!errors.fullName)}`}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={shippingInfo.phone}
            onChange={handleInputChange}
            required
            // The phone number field itself is not disabled during OTP,
            // allowing the user to correct it if they made a mistake.
            className={`${inputStyles} ${getErrorStyles(!!errors.phone)}`}
          />
        </div>
      </div>
      <div>
        <label htmlFor="area" className="block text-sm font-medium mb-1">
          Area / Locality
        </label>
        <input
          id="area"
          name="area"
          type="text"
          value={shippingInfo.area}
          onChange={handleInputChange}
          required
          className={`${inputStyles}`}
          placeholder="e.g. DHA Phase 6, Johar Town"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Street Address & House No.
        </label>
        <input
          id="address"
          name="address"
          type="text"
          value={shippingInfo.address}
          onChange={handleInputChange}
          required
          className={`${inputStyles} ${getErrorStyles(!!errors.address)}`}
          placeholder="e.g. House #123, Street 4"
        />
      </div>
    </div>
  );
}

// --- SUMMARY OF CHANGES ---
// - No changes were required. This component is a "dumb" presentational component that correctly receives props from its parent (`NewAddressForm`) and renders input fields. It is already perfectly suited for our new OTP flow.
