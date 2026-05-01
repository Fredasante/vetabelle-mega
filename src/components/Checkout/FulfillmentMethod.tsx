"use client";

import React from "react";
import { Truck, Store } from "lucide-react";

export type FulfillmentType = "delivery" | "pickup_office" | "pickup_ac_mall";

interface FulfillmentOption {
  value: FulfillmentType;
  label: string;
  description: string;
  address: string;
  icon: React.ReactNode;
}

const FULFILLMENT_OPTIONS: FulfillmentOption[] = [
  {
    value: "delivery",
    label: "Delivery",
    description: "We'll deliver to your address",
    address: "Enter your delivery address at checkout",
    icon: <Truck className="w-6 h-6" />,
  },
  {
    value: "pickup_office",
    label: "Pickup at Office",
    description: "Pick up from our office location",
    address: "Near Entrance Hospital Kokomelemele",
    icon: <Store className="w-6 h-6" />,
  },
];

interface FulfillmentMethodProps {
  selected: FulfillmentType;
  onChange: (method: FulfillmentType) => void;
}

const FulfillmentMethod = ({ selected, onChange }: FulfillmentMethodProps) => {
  return (
    <div className="mt-7">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        How would you like to receive your order?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FULFILLMENT_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative flex flex-col items-center text-center p-5 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-[#c77f56] bg-orange-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`mb-3 p-2.5 rounded-full ${
                  isSelected
                    ? "bg-[#c77f56] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {option.icon}
              </div>

              <h3
                className={`font-semibold text-sm mb-1 ${
                  isSelected ? "text-[#c77f56]" : "text-dark"
                }`}
              >
                {option.label}
              </h3>

              <p className="text-xs text-gray-500 mb-2">{option.description}</p>

              <p
                className={`text-xs font-medium ${
                  isSelected ? "text-[#c77f56]" : "text-gray-400"
                }`}
              >
                {option.address}
              </p>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#c77f56] rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Pickup info note */}
      {selected !== "delivery" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            <strong>Pickup:</strong> After payment, our team will contact you to
            confirm your pickup time. No delivery fee applies.
          </p>
        </div>
      )}
    </div>
  );
};

export default FulfillmentMethod;

export const PICKUP_LOCATIONS: Record<
  Exclude<FulfillmentType, "delivery">,
  { name: string; address: string }
> = {
  pickup_office: {
    name: "Vetabelle Office",
    address: "Near Entrance Hospital Kokomelemele",
  },
  pickup_ac_mall: {
    name: "A&C Mall",
    address: "A&C Mall",
  },
};
