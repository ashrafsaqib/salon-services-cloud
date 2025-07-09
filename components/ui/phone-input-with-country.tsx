import React from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInputWithCountry({
  value,
  onChange,
}: PhoneInputWithCountryProps) {
  return (
    <div className="w-full rounded border border-gray-300 bg-white focus-within:border-amber-500 transition-all shadow-sm p-1">
      <PhoneInput
        country={"ae"}
        value={value}
        onChange={onChange}
        inputClass="!w-full !pl-12 !border-0 !shadow-none !bg-transparent !px-2 !py-1 !text-gray-800 focus:!outline-none focus:!ring-0"
        buttonClass="!border-0 !bg-transparent !rounded-l-md !left-2 !z-10"
        dropdownClass="!border !rounded-md !shadow-lg !bg-white"
        containerClass="!w-full"
        enableSearch
      />
      <style jsx global>{`
        .react-tel-input .flag-dropdown {
          left: 0 !important;
          z-index: 20;
        }
        .react-tel-input .form-control {
          padding-left: 48px !important;
        }
      `}</style>
    </div>
  );
}
