"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Central",
  "Eastern",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Savannah",
  "North East",
  "Oti",
  "Western North",
];

interface BillingProps {
  isGuest?: boolean;
}

const Billing = ({ isGuest = false }: BillingProps) => {
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <div className="mt-7">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        Delivery Information
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        {/* Full Name */}
        <div className="mb-5">
          <label htmlFor="fullName" className="block mb-2.5">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            placeholder="Enter your full name"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            Phone Number <span className="text-red">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder="024 123 4567"
            required
            pattern="[0-9]{10}"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <p className="text-xs text-gray-600 mt-1.5">
            For delivery contact and mobile money payment
          </p>
        </div>

        {/* Email (Optional) */}
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-dark-5">(Optional)</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="your.email@example.com"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <p className="text-xs text-gray-600 mt-1.5">
            For order confirmation and updates
          </p>
        </div>

        {/* Region Dropdown */}
        <div className="mb-5">
          <label htmlFor="region" className="block mb-2.5">
            Region <span className="text-red">*</span>
          </label>
          <div className="relative">
            <select
              name="region"
              id="region"
              required
              className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark py-3 pl-5 pr-9 duration-200 appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            >
              <option value="">Select your region</option>
              {GHANA_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-4 pointer-events-none">
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.41469 5.03569L2.41467 5.03571L2.41749 5.03846L7.76749 10.2635L8.0015 10.492L8.23442 10.2623L13.5844 4.98735L13.5844 4.98735L13.5861 4.98569C13.6809 4.89086 13.8199 4.89087 13.9147 4.98569C14.0092 5.08024 14.0095 5.21864 13.9155 5.31345C13.9152 5.31373 13.915 5.31401 13.9147 5.31429L8.16676 10.9622L8.16676 10.9622L8.16469 10.9643C8.06838 11.0606 8.02352 11.0667 8.00039 11.0667C7.94147 11.0667 7.89042 11.0522 7.82064 10.9991L2.08526 5.36345C1.99127 5.26865 1.99154 5.13024 2.08609 5.03569C2.18092 4.94086 2.31986 4.94086 2.41469 5.03569Z"
                  fill=""
                  stroke=""
                  strokeWidth="0.666667"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* City/Town */}
        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5">
            City/Town <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="e.g., Accra, Kumasi, Tema"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        {/* Delivery Address/Landmark */}
        <div className="mb-5.5">
          <label htmlFor="address" className="block mb-2.5">
            Delivery Address/Landmark <span className="text-red">*</span>
          </label>
          <textarea
            name="address"
            id="address"
            rows={4}
            placeholder="House number, street name, or recognizable landmark (e.g., 'Behind Total Filling Station, near the blue gate')"
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
          <p className="text-xs text-gray-600 mt-1.5">
            Include clear landmarks to help our delivery rider find you easily
          </p>
        </div>

        {/* Guest Checkout Option */}
        {isGuest && (
          <div className="pt-5 border-t border-gray-3">
            <label
              htmlFor="createAccount"
              className="text-dark flex cursor-pointer select-none items-start gap-3"
            >
              <div className="relative flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  id="createAccount"
                  name="createAccount"
                  checked={createAccount}
                  onChange={(e) => setCreateAccount(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                    createAccount
                      ? "border-blue bg-blue"
                      : "border-gray-4 bg-white"
                  }`}
                >
                  <Check
                    className={`w-3 h-3 text-white transition-opacity duration-200 ${
                      createAccount ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
              <div>
                <span className="font-medium">Create an account</span>
                <p className="text-sm text-gray-600 mt-1">
                  Save your details for faster checkout next time
                </p>
              </div>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
