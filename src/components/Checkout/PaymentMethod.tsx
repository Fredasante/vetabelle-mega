// components/Checkout/PaymentMethod.tsx
import React from "react";
import Image from "next/image";

interface PaymentMethodProps {
  selectedMethod: "card" | "mobile_money";
  onMethodChange: (method: "card" | "mobile_money") => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment Method</h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you want to pay for your items
        </p>
      </div>

      <div className="p-4 sm:p-8.5">
        <input type="hidden" name="paymentMethod" value={selectedMethod} />

        <div className="flex flex-col gap-3">
          {/* Mobile Money */}
          <label
            htmlFor="mobile_money"
            className="flex cursor-pointer select-none items-start gap-4"
          >
            <div className="relative mt-1">
              <input
                type="radio"
                name="payment"
                id="mobile_money"
                className="sr-only"
                checked={selectedMethod === "mobile_money"}
                onChange={() => onMethodChange("mobile_money")}
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selectedMethod === "mobile_money"
                    ? "border-blue bg-blue"
                    : "border-gray-4 bg-white"
                }`}
              >
                {selectedMethod === "mobile_money" && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div
                className={`rounded-md border py-4 px-5 ease-out duration-200 ${
                  selectedMethod === "mobile_money"
                    ? "border-blue bg-blue-50"
                    : "border-gray-3 bg-white hover:bg-gray-1"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {/* MTN Logo placeholder */}
                      <div className="w-10 h-10 bg-yellow-400 rounded flex items-center justify-center text-xs font-bold">
                        MTN
                      </div>
                      {/* Vodafone Logo placeholder */}
                      <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white">
                        VOD
                      </div>
                      {/* AirtelTigo Logo placeholder */}
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">
                        AT
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-dark">Mobile Money</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        MTN, Vodafone, AirtelTigo
                      </p>
                    </div>
                  </div>
                  {selectedMethod === "mobile_money" && (
                    <div className="flex items-center gap-1.5 text-blue text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Selected</span>
                    </div>
                  )}
                </div>
                {selectedMethod === "mobile_money" && (
                  <div className="mt-3 pt-3 border-t border-gray-3">
                    <p className="text-xs text-gray-600">
                      You&apos;ll be prompted to enter your mobile money number
                      and approve the payment on your phone
                    </p>
                  </div>
                )}
              </div>
            </div>
          </label>

          {/* Card Payment */}
          <label
            htmlFor="card"
            className="flex cursor-pointer select-none items-start gap-4"
          >
            <div className="relative mt-1">
              <input
                type="radio"
                name="payment"
                id="card"
                className="sr-only"
                checked={selectedMethod === "card"}
                onChange={() => onMethodChange("card")}
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selectedMethod === "card"
                    ? "border-blue bg-blue"
                    : "border-gray-4 bg-white"
                }`}
              >
                {selectedMethod === "card" && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <div
                className={`rounded-md border py-4 px-5 ease-out duration-200 ${
                  selectedMethod === "card"
                    ? "border-blue bg-blue-50"
                    : "border-gray-3 bg-white hover:bg-gray-1"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {/* Card icons */}
                      <svg
                        className="w-10 h-7"
                        viewBox="0 0 48 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="48" height="32" rx="4" fill="#1434CB" />
                        <circle cx="18" cy="16" r="7" fill="#EB001B" />
                        <circle cx="30" cy="16" r="7" fill="#FF5F00" />
                        <path
                          d="M24 11a7 7 0 000 10 7 7 0 000-10z"
                          fill="#F79E1B"
                        />
                      </svg>
                      <svg
                        className="w-10 h-7"
                        viewBox="0 0 48 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="48" height="32" rx="4" fill="#00579F" />
                        <path d="M20 12h8v8h-8z" fill="#FAA61A" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-dark">Debit/Credit Card</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Visa, Mastercard, Verve
                      </p>
                    </div>
                  </div>
                  {selectedMethod === "card" && (
                    <div className="flex items-center gap-1.5 text-blue text-sm">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-medium">Selected</span>
                    </div>
                  )}
                </div>
                {selectedMethod === "card" && (
                  <div className="mt-3 pt-3 border-t border-gray-3">
                    <p className="text-xs text-gray-600">
                      Securely enter your card details on the Paystack payment
                      page
                    </p>
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>

        {/* Security Notice */}
        <div className="mt-4 p-3 bg-gray-1 rounded-md flex items-start gap-2">
          <svg
            className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-dark">
              Your payment is secure
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              All transactions are encrypted and processed by Paystack, a PCI
              DSS compliant payment provider
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
