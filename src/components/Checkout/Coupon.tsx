"use client";
import React, { useState } from "react";

interface CouponProps {
  onApplyCoupon: (discount: number) => void;
}

const Coupon = ({ onApplyCoupon }: CouponProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Available coupons - move to Sanity CMS or API in production
  const coupons: Record<string, number> = {
    SAVE50: 50,
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setMessage("Please enter a coupon code");
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const upperCouponCode = couponCode.toUpperCase().trim();

      if (coupons[upperCouponCode]) {
        const discount = coupons[upperCouponCode];
        onApplyCoupon(discount);
        setMessage(`Success! You saved ₵${discount.toFixed(2)}`);
        setIsApplied(true);
      } else {
        setMessage("Invalid coupon code. Please try again.");
        onApplyCoupon(0);
        setIsApplied(false);
      }

      setIsLoading(false);
    }, 500);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setMessage("");
    setIsApplied(false);
    onApplyCoupon(0);
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Have any Coupon Code?</h3>
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCoupon();
              }
            }}
            placeholder="Enter coupon code"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isApplied || isLoading}
          />

          {!isApplied ? (
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isLoading}
              className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="inline-flex font-medium text-white bg-red-500 py-3 px-6 rounded-md ease-out duration-200 hover:bg-red-600 whitespace-nowrap"
            >
              Remove
            </button>
          )}
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md ${
              isApplied
                ? "bg-green-light-6 text-green-dark border border-green-dark"
                : "bg-red-light-6 text-red-dark border border-red-dark"
            }`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupon;
